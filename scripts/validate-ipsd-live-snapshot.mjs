import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertSameJson,
  documentFromConnectorResult,
  findTab,
  readJson,
  snapshotProof,
  verifyGeneratedTarget,
  verifyReferenceTarget,
} from "./ipsd-live-safety.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).filter((argument) => argument !== "--");
const bootstrap = args.includes("--bootstrap");
const outputFlag = args.indexOf("--output");
const recoveryFlag = args.indexOf("--recover-after");
const planFlag = args.indexOf("--plan");
const outputPath = outputFlag >= 0 ? path.resolve(args[outputFlag + 1]) : null;
const recoveryPreflightPath = recoveryFlag >= 0 ? path.resolve(args[recoveryFlag + 1]) : null;
const recoveryPlanPath = planFlag >= 0 ? path.resolve(args[planFlag + 1]) : null;
const consumed = new Set(args.flatMap((argument, index) => {
  if (argument === "--bootstrap") return [index];
  if (["--output", "--recover-after", "--plan"].includes(argument)) return [index, index + 1];
  return [];
}));
const positional = args.filter((_, index) => !consumed.has(index));

if (positional.length !== 2) {
  throw new Error("Usage: validate-ipsd-live-snapshot.mjs <document-result.json> <control-inventory.json> [--output <path>] [--bootstrap] [--recover-after <preflight.json> --plan <apply-plan.json>]");
}
if (Boolean(recoveryPreflightPath) !== Boolean(recoveryPlanPath)) {
  throw new Error("Recovery requires both --recover-after and --plan");
}

const [documentResultPath, controlInventoryPath] = positional.map((value) => path.resolve(value));
const [config, payload, state, connectorResult, controlInventory] = await Promise.all([
  readJson(path.join(projectRoot, "ipsd-sync.config.json")),
  readJson(path.join(projectRoot, "sync", "ipsd-sync.generated.json")),
  readJson(path.join(projectRoot, "sync", "ipsd-sync.state.json")),
  readJson(documentResultPath),
  readJson(controlInventoryPath),
]);
const document = documentFromConnectorResult(connectorResult);
const recoveryPreflight = recoveryPreflightPath ? await readJson(recoveryPreflightPath) : null;
const recoveryPlan = recoveryPlanPath ? await readJson(recoveryPlanPath) : null;

if (bootstrap && (state.version >= 2 || state.liveSnapshot)) {
  throw new Error("Bootstrap is disabled after the verified live-state baseline has been initialized");
}

if (document.documentId !== config.document.id || document.title !== config.document.expectedTitle) {
  throw new Error("Live Google Doc identity does not match ipsd-sync.config.json");
}
if (!document.revisionId) throw new Error("Live Google Doc read is missing a revision ID");

const liveById = new Map(document.tabs.map((tab) => [tab.tabId, tab]));
if (liveById.size !== document.tabs.length) throw new Error("Live Google Doc has duplicate tab IDs");
for (const expected of config.tabs) {
  const live = liveById.get(expected.tabId);
  if (!live) throw new Error(`Configured tab is missing: ${expected.tabId} (${expected.expectedTitle})`);
  if (live.title !== expected.expectedTitle) {
    throw new Error(`Tab title drift for ${expected.tabId}: expected ${expected.expectedTitle}, found ${live.title}`);
  }
}

const configuredIds = new Set(config.tabs.map((tab) => tab.tabId));
const unknownTabs = document.tabs
  .filter((tab) => !configuredIds.has(tab.tabId))
  .map((tab) => ({ tabId: tab.tabId, title: tab.title }));
const snapshot = snapshotProof(document, controlInventory, config);
const recoveryTargetIds = new Set();
if (recoveryPreflight && recoveryPlan) {
  const validatorPath = path.join(projectRoot, "scripts", "validate-ipsd-apply-plan.mjs");
  const validation = spawnSync(
    process.execPath,
    [validatorPath, recoveryPlanPath, recoveryPreflightPath],
    { encoding: "utf8" },
  );
  if (validation.status !== 0) {
    throw new Error(`Recovery source plan failed revalidation: ${validation.stderr || validation.stdout}`);
  }
  if (recoveryPreflight.sourceHash !== payload.sourceHash ||
      recoveryPreflight.previousAppliedSourceHash !== state.sourceHash ||
      recoveryPlan.documentId !== document.documentId ||
      recoveryPlan.writeControl?.requiredRevisionId !== recoveryPreflight.snapshot?.revisionId ||
      document.revisionId === recoveryPreflight.snapshot?.revisionId) {
    throw new Error("Recovery source does not match the current payload, state lineage, or document revision");
  }
  const recoveryTargets = [
    ...(recoveryPreflight.changedTargets ?? []),
    ...(recoveryPreflight.changedVerificationTargets ?? []),
  ];
  assertSameJson(
    recoveryPlan.targetContentHashes,
    Object.fromEntries(recoveryTargets.map((target) => [target.tabId, target.contentHash])),
    "Recovery source plan target hashes do not match its preflight",
  );
  recoveryTargets.forEach((target) => recoveryTargetIds.add(target.tabId));
  assertSameJson(
    snapshot.topology,
    recoveryPreflight.snapshot.topology,
    "Document topology changed during the failed formatting apply",
  );
  if (snapshot.protectedControl.signature !== recoveryPreflight.snapshot.protectedControl.signature) {
    throw new Error("Protected presentation control changed during the failed formatting apply");
  }
  for (const [tabId, before] of Object.entries(recoveryPreflight.snapshot.tabs)) {
    if (recoveryTargetIds.has(tabId)) continue;
    if (snapshot.tabs?.[tabId]?.semanticHash !== before.semanticHash) {
      throw new Error(`Non-target tab changed during the failed formatting apply: ${tabId}`);
    }
  }
  if (recoveryTargetIds.has(recoveryPreflight.snapshot.managedRange.tabId) &&
      (snapshot.managedRange.namedRangeId !== recoveryPreflight.snapshot.managedRange.namedRangeId ||
       snapshot.managedRange.unmanagedSemanticHash !==
        recoveryPreflight.snapshot.managedRange.unmanagedSemanticHash)) {
    throw new Error("Working Notes unmanaged content changed during the failed formatting apply");
  }
  for (const target of recoveryPreflight.changedVerificationTargets ?? []) {
    const before = recoveryPreflight.snapshot.verificationRanges?.[target.tabId];
    const after = snapshot.verificationRanges?.[target.tabId];
    if (!before || !after || before.missing || after.missing ||
        before.namedRangeId !== after.namedRangeId ||
        before.unmanagedSemanticHash !== after.unmanagedSemanticHash) {
      throw new Error(`Verify-only unmanaged content changed during the failed formatting apply: ${target.tabId}`);
    }
  }
}
const sourceChangedTargets = payload.targets
  .filter((target) => state.managedTargets?.[target.tabId] !== target.contentHash)
  .map((target) => ({ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }));
const repairTargets = [];
for (const target of payload.targets) {
  try {
    verifyGeneratedTarget(findTab(document, target.tabId), target, {
      documentId: config.document.id,
      formatting: config.formatting,
    });
  } catch (error) {
    repairTargets.push({
      tabId: target.tabId,
      title: target.expectedTitle,
      contentHash: target.contentHash,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
const changedTargets = [...new Map(
  [...sourceChangedTargets, ...repairTargets].map((target) => [target.tabId, {
    tabId: target.tabId,
    title: target.title,
    contentHash: target.contentHash,
  }]),
).values()];
const sourceChangedVerificationTargets = (payload.verificationTargets ?? [])
  .filter((target) => state.verificationTargets?.[target.tabId] !== target.contentHash)
  .map((target) => ({ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }));
const verificationRepairTargets = [];
for (const target of payload.verificationTargets ?? []) {
  try {
    verifyReferenceTarget(findTab(document, target.tabId), target, {
      documentId: config.document.id,
      formatting: config.formatting,
    });
  } catch (error) {
    verificationRepairTargets.push({
      tabId: target.tabId,
      title: target.expectedTitle,
      contentHash: target.contentHash,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
const changedVerificationTargets = [...new Map(
  [...sourceChangedVerificationTargets, ...verificationRepairTargets].map((target) => [target.tabId, {
    tabId: target.tabId,
    title: target.title,
    contentHash: target.contentHash,
  }]),
).values()];

if (!bootstrap) {
  const baseline = state.liveSnapshot;
  if (!baseline) throw new Error("State has no liveSnapshot baseline; run a reviewed --bootstrap once");
  for (const tabConfig of config.tabs.filter((tab) => tab.mode === "managed-body")) {
    if (recoveryTargetIds.has(tabConfig.tabId)) continue;
    const previous = baseline.tabs?.[tabConfig.tabId];
    const current = snapshot.tabs[tabConfig.tabId];
    if (!previous) throw new Error(`Missing baseline proof for managed tab ${tabConfig.tabId}`);
    if (previous.semanticHash !== current.semanticHash) {
      throw new Error(`Managed tab drift detected before sync: ${tabConfig.expectedTitle}`);
    }
    assertSameJson(
      current.nativeElementCounts,
      previous.nativeElementCounts,
      `Native element drift detected before sync: ${tabConfig.expectedTitle}`,
    );
  }
  if (!recoveryTargetIds.has(snapshot.managedRange.tabId) &&
      (baseline.managedRange?.semanticHash !== snapshot.managedRange.semanticHash ||
       baseline.managedRange?.namedRangeId !== snapshot.managedRange.namedRangeId)) {
    throw new Error("Working Notes managed range drift detected before sync");
  }
  if (baseline.protectedControl?.signature !== snapshot.protectedControl.signature) {
    throw new Error("Presentation-template native control changed; automatic sync is blocked");
  }
}

const preflight = {
  version: 1,
  status: bootstrap ? "bootstrap-reviewed" : recoveryPreflight ? "recovery-validated" : "validated",
  sourceHash: payload.sourceHash,
  previousAppliedSourceHash: state.sourceHash,
  changedTargets,
  repairTargets,
  changedVerificationTargets,
  verificationRepairTargets,
  unknownTabsPreserved: unknownTabs,
  ...(recoveryPreflight ? {
    recovery: {
      priorPreflightRevisionId: recoveryPreflight.snapshot.revisionId,
      failedApplyRevisionId: snapshot.revisionId,
      priorPlanTargetIds: [...recoveryTargetIds],
    },
  } : {}),
  snapshot,
};

if (outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(preflight, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  status: preflight.status,
  revisionId: snapshot.revisionId,
  changedTargetCount: changedTargets.length,
  changedVerificationTargetCount: changedVerificationTargets.length,
  unknownTabCount: unknownTabs.length,
  outputPath,
}, null, 2));
