import { writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertSameJson,
  documentFromConnectorResult,
  findTab,
  readJson,
  sha256,
  snapshotProof,
  verifyGeneratedTarget,
  verifyReferenceTarget,
} from "./ipsd-live-safety.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).filter((argument) => argument !== "--");
const outputFlag = args.indexOf("--output");
const planFlag = args.indexOf("--plan");
const outputPath = outputFlag >= 0
  ? path.resolve(args[outputFlag + 1])
  : path.join(projectRoot, "sync", "ipsd-sync.state.json");
const planPath = planFlag >= 0 ? path.resolve(args[planFlag + 1]) : null;
const consumed = new Set(args.flatMap((argument, index) => {
  if (argument === "--output" || argument === "--plan") return [index, index + 1];
  return [];
}));
const positional = args.filter((_, index) => !consumed.has(index));
if (positional.length !== 3) {
  throw new Error("Usage: record-ipsd-live-state.mjs <preflight.json> <post-document-result.json> <post-control-inventory.json> [--plan <apply-plan.json>] [--output <state.json>]");
}

const [preflightPath, documentResultPath, controlInventoryPath] = positional.map((value) => path.resolve(value));
const [config, payload, currentState, preflight, connectorResult, controlInventory, plan] = await Promise.all([
  readJson(path.join(projectRoot, "ipsd-sync.config.json")),
  readJson(path.join(projectRoot, "sync", "ipsd-sync.generated.json")),
  readJson(path.join(projectRoot, "sync", "ipsd-sync.state.json")),
  readJson(preflightPath),
  readJson(documentResultPath),
  readJson(controlInventoryPath),
  planPath ? readJson(planPath) : Promise.resolve(null),
]);
const document = documentFromConnectorResult(connectorResult);
const postflight = snapshotProof(document, controlInventory, config);
const changedIds = new Set([
  ...(preflight.changedTargets ?? []),
  ...(preflight.changedVerificationTargets ?? []),
].map((target) => target.tabId));
const sourceChangedTargets = payload.targets
  .filter((target) => currentState.managedTargets?.[target.tabId] !== target.contentHash)
  .map((target) => ({ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }));
const payloadById = new Map(payload.targets.map((target) => [target.tabId, target]));
for (const repair of preflight.repairTargets ?? []) {
  const target = payloadById.get(repair.tabId);
  if (!target || target.contentHash !== repair.contentHash) {
    throw new Error(`Preflight repair target is not bound to the current payload: ${repair.tabId}`);
  }
}
const currentChangedTargets = [...new Map([
  ...sourceChangedTargets,
  ...(preflight.repairTargets ?? []).map((repair) => ({
    tabId: repair.tabId,
    title: repair.title,
    contentHash: repair.contentHash,
  })),
].map((target) => [target.tabId, target])).values()];
const verificationById = new Map((payload.verificationTargets ?? []).map((target) => [target.tabId, target]));
for (const repair of preflight.verificationRepairTargets ?? []) {
  const target = verificationById.get(repair.tabId);
  if (!target || target.contentHash !== repair.contentHash) {
    throw new Error(`Preflight verification repair is not bound to the current payload: ${repair.tabId}`);
  }
}
const sourceChangedVerificationTargets = (payload.verificationTargets ?? [])
  .filter((target) => currentState.verificationTargets?.[target.tabId] !== target.contentHash)
  .map((target) => ({ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }));
const currentChangedVerificationTargets = [...new Map([
  ...sourceChangedVerificationTargets,
  ...(preflight.verificationRepairTargets ?? []).map((repair) => ({
    tabId: repair.tabId,
    title: repair.title,
    contentHash: repair.contentHash,
  })),
].map((target) => [target.tabId, target])).values()];

if (document.documentId !== config.document.id || document.title !== config.document.expectedTitle) {
  throw new Error("Post-write document identity does not match the sync config");
}
if (preflight.sourceHash !== payload.sourceHash ||
    preflight.previousAppliedSourceHash !== currentState.sourceHash) {
  throw new Error("Payload or recorded-state lineage changed after preflight; run a new preflight");
}
assertSameJson(preflight.changedTargets, currentChangedTargets, "Changed targets differ from the current payload/state lineage");
assertSameJson(
  preflight.changedVerificationTargets ?? [],
  currentChangedVerificationTargets,
  "Verify-only targets differ from the current payload/state lineage",
);
if (changedIds.size > 0 && !plan) throw new Error("A validated apply plan is required to record changed targets");
if (plan) {
  const validatorPath = path.join(projectRoot, "scripts", "validate-ipsd-apply-plan.mjs");
  const validation = spawnSync(process.execPath, [validatorPath, planPath, preflightPath], { encoding: "utf8" });
  if (validation.status !== 0) {
    throw new Error(`Apply plan failed recorder-side revalidation: ${validation.stderr || validation.stdout}`);
  }
  if (plan.documentId !== document.documentId ||
      plan.writeControl?.requiredRevisionId !== preflight.snapshot.revisionId) {
    throw new Error("Apply plan does not match the preflight document revision");
  }
  const expectedHashes = Object.fromEntries([
    ...(preflight.changedTargets ?? []),
    ...(preflight.changedVerificationTargets ?? []),
  ].map((target) => [target.tabId, target.contentHash]));
  assertSameJson(plan.targetContentHashes, expectedHashes, "Apply plan target hashes do not match preflight");
}
if (changedIds.size > 0 && postflight.revisionId === preflight.snapshot.revisionId) {
  throw new Error("Post-write read has the same revision ID as preflight");
}
assertSameJson(postflight.topology, preflight.snapshot.topology, "Document tab topology changed during sync");
if (postflight.protectedControl.signature !== preflight.snapshot.protectedControl.signature) {
  throw new Error("Presentation-template native control changed during sync");
}
if (changedIds.has(preflight.snapshot.managedRange.tabId) &&
    postflight.managedRange.unmanagedSemanticHash !== preflight.snapshot.managedRange.unmanagedSemanticHash) {
  throw new Error("Working Notes content outside the managed range changed during sync");
}
for (const target of preflight.changedVerificationTargets ?? []) {
  const beforeRange = preflight.snapshot.verificationRanges?.[target.tabId];
  const afterRange = postflight.verificationRanges?.[target.tabId];
  if (!afterRange || afterRange.missing) throw new Error(`Verify-only parity range is missing after sync: ${target.tabId}`);
  if (beforeRange && !beforeRange.missing &&
      beforeRange.unmanagedSemanticHash !== afterRange.unmanagedSemanticHash) {
    throw new Error(`Content outside the verify-only parity range changed during sync: ${target.tabId}`);
  }
}

for (const [tabId, before] of Object.entries(preflight.snapshot.tabs)) {
  if (changedIds.has(tabId)) continue;
  const after = postflight.tabs[tabId];
  if (!after || after.semanticHash !== before.semanticHash) {
    throw new Error(`Non-target tab changed during sync: ${tabId}`);
  }
}
for (const target of payload.targets) {
  verifyGeneratedTarget(findTab(document, target.tabId), target, {
    documentId: config.document.id,
    formatting: config.formatting,
  });
}
for (const target of payload.verificationTargets ?? []) {
  verifyReferenceTarget(findTab(document, target.tabId), target, {
    documentId: config.document.id,
    formatting: config.formatting,
  });
}

const preservedModes = new Set(["protected", "doc-to-site-source", "preserve-only"]);
const preservedTabProofs = Object.fromEntries(config.tabs
  .filter((tab) => preservedModes.has(tab.mode))
  .map((tab) => [tab.tabId, postflight.tabs[tab.tabId].semanticHash]));
const nextState = {
  version: 2,
  lastAppliedOn: new Date().toISOString().slice(0, 10),
  documentRevisionId: postflight.revisionId,
  sourceHash: payload.sourceHash,
  managedTargets: Object.fromEntries(payload.targets.map((target) => [target.tabId, target.contentHash])),
  verificationTargets: Object.fromEntries((payload.verificationTargets ?? [])
    .map((target) => [target.tabId, target.contentHash])),
  preservedTabProofs,
  presentationNativeControlVerified: true,
  liveSnapshot: postflight,
  verification: {
    preflightRevisionId: preflight.snapshot.revisionId,
    postflightRevisionId: postflight.revisionId,
    verifiedTargetIds: [
      ...payload.targets.map((target) => target.tabId),
      ...(payload.verificationTargets ?? []).map((target) => target.tabId),
    ],
    previousStateRevisionId: currentState.documentRevisionId,
    applyPlanDigest: plan ? sha256(plan) : null,
  },
};

await writeFile(outputPath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
console.log(`Recorded verified IPSD live state for revision ${postflight.revisionId} at ${outputPath}.`);
