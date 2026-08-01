import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFormattingRepairRequests, validateFormattingProfile } from "./ipsd-formatting.mjs";
import { documentFromConnectorResult, findTab, readJson } from "./ipsd-live-safety.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2).filter((argument) => argument !== "--");
const outputFlag = args.indexOf("--output");
const outputPath = outputFlag >= 0 ? path.resolve(args[outputFlag + 1]) : null;
const positional = args.filter((_, index) => index !== outputFlag && index !== outputFlag + 1);
if (positional.length !== 2 || !outputPath) {
  throw new Error(
    "Usage: build-ipsd-format-repair-plan.mjs <preflight.json> <document-result.json> --output <plan.json>",
  );
}

const [preflightPath, documentResultPath] = positional.map((value) => path.resolve(value));
const [config, payload, preflight, connectorResult] = await Promise.all([
  readJson(path.join(projectRoot, "ipsd-sync.config.json")),
  readJson(path.join(projectRoot, "sync", "ipsd-sync.generated.json")),
  readJson(preflightPath),
  readJson(documentResultPath),
]);
const document = documentFromConnectorResult(connectorResult);
const formatting = validateFormattingProfile(config.formatting);

if (document.documentId !== config.document.id || document.documentId !== preflight.snapshot.documentId ||
    document.revisionId !== preflight.snapshot.revisionId) {
  throw new Error("Formatting repair input does not match the preflight document revision");
}

const payloadById = new Map([
  ...payload.targets,
  ...(payload.verificationTargets ?? []),
].map((target) => [target.tabId, target]));
const changedTargets = [
  ...(preflight.changedTargets ?? []),
  ...(preflight.changedVerificationTargets ?? []),
];
const requests = [];
for (const changed of changedTargets) {
  const target = payloadById.get(changed.tabId);
  if (!target || target.contentHash !== changed.contentHash) {
    throw new Error(`Preflight target is not bound to the current payload: ${changed.tabId}`);
  }
  requests.push(...buildFormattingRepairRequests(findTab(document, target.tabId), target, formatting));
}

const touched = new Set(requests.flatMap((request) => {
  const value = request.updateTextStyle ?? request.updateParagraphStyle;
  return value?.range?.tabId ? [value.range.tabId] : [];
}));
for (const target of changedTargets) {
  if (!touched.has(target.tabId)) {
    throw new Error(
      `${target.title} has changed content but no live formatting defect; use the full content apply-plan path`,
    );
  }
}

const plan = {
  version: 1,
  kind: "formatting-repair",
  formattingProfileId: formatting.profileId,
  documentId: config.document.id,
  writeControl: { requiredRevisionId: preflight.snapshot.revisionId },
  targetContentHashes: Object.fromEntries(changedTargets.map((target) => [target.tabId, target.contentHash])),
  requests,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
console.log(`Prepared ${requests.length} formatting-only requests for ${touched.size} IPSD targets at ${outputPath}.`);
