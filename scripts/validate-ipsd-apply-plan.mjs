import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./ipsd-live-safety.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [planArgument, preflightArgument] = process.argv.slice(2).filter((argument) => argument !== "--");
if (!planArgument || !preflightArgument) {
  throw new Error("Usage: validate-ipsd-apply-plan.mjs <apply-plan.json> <preflight.json>");
}

const [plan, preflight, config] = await Promise.all([
  readJson(path.resolve(planArgument)),
  readJson(path.resolve(preflightArgument)),
  readJson(path.join(projectRoot, "ipsd-sync.config.json")),
]);
const expectedTargets = new Map([
  ...(preflight.changedTargets ?? []),
  ...(preflight.changedVerificationTargets ?? []),
].map((target) => [target.tabId, target.contentHash]));
const allowedTabs = new Map(config.tabs
  .filter((tab) => ["managed-body", "managed-block"].includes(tab.mode) ||
    (tab.mode === "verify-only" && tab.managedRangeName))
  .map((tab) => [tab.tabId, tab]));
const allowedRequestTypes = new Set([
  "deleteContentRange",
  "insertText",
  "updateTextStyle",
  "updateParagraphStyle",
  "createParagraphBullets",
  "deleteParagraphBullets",
  "createNamedRange",
]);

if (plan.documentId !== config.document.id || plan.documentId !== preflight.snapshot.documentId) {
  throw new Error("Apply plan documentId does not match the validated document");
}
if (plan.writeControl?.requiredRevisionId !== preflight.snapshot.revisionId) {
  throw new Error("Apply plan must use the exact preflight requiredRevisionId");
}
if (!Array.isArray(plan.requests)) throw new Error("Apply plan requests must be an array");

const suppliedHashes = plan.targetContentHashes ?? {};
if (Object.keys(suppliedHashes).length !== expectedTargets.size) {
  throw new Error("Apply plan target set does not match the changed generated targets");
}
for (const [tabId, hash] of expectedTargets) {
  if (suppliedHashes[tabId] !== hash) throw new Error(`Apply plan content hash mismatch for ${tabId}`);
}

for (const request of plan.requests) {
  const keys = Object.keys(request);
  if (keys.length !== 1 || !allowedRequestTypes.has(keys[0])) {
    throw new Error(`Unsupported or document-wide Google Docs request: ${keys.join(", ")}`);
  }
}

function initialBounds(tabId) {
  const tab = allowedTabs.get(tabId);
  const liveTab = preflight.snapshot.tabs?.[tabId];
  if (!tab || !liveTab || !Number.isInteger(liveTab.bodyEndIndex)) {
    throw new Error(`Preflight is missing validated body bounds for ${tabId}`);
  }

  let lower = 1;
  let upper = liveTab.bodyEndIndex;
  if (tab.mode === "managed-block") {
    lower = preflight.snapshot.managedRange?.range?.startIndex;
    upper = preflight.snapshot.managedRange?.range?.endIndex;
  } else if (tab.mode === "verify-only") {
    const verificationRange = preflight.snapshot.verificationRanges?.[tabId];
    if (verificationRange && !verificationRange.missing) {
      lower = verificationRange.range?.startIndex;
      upper = verificationRange.range?.endIndex;
    } else {
      lower = liveTab.bodyEndIndex - 1;
      upper = liveTab.bodyEndIndex;
    }
  }

  if (!Number.isInteger(lower) || !Number.isInteger(upper) || lower < 1 || upper < lower) {
    throw new Error(`Preflight has invalid managed bounds for ${tabId}`);
  }
  return { lower, upper };
}

const liveBounds = new Map([...expectedTargets.keys()].map((tabId) => [tabId, initialBounds(tabId)]));

const touchedTabs = new Set();
function inspectRequest(value, requestType, requestTabs) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => inspectRequest(item, requestType, requestTabs));
    return;
  }

  if ("endOfSegmentLocation" in value) {
    throw new Error(`${requestType} may not use endOfSegmentLocation`);
  }
  if (typeof value.segmentId === "string" && value.segmentId.length > 0) {
    throw new Error(`${requestType} may only edit the tab body, not headers, footers, or footnotes`);
  }
  if ("tabId" in value) {
    if (typeof value.tabId !== "string") throw new Error(`${requestType} has an invalid tabId`);
    const tab = allowedTabs.get(value.tabId);
    if (!tab || !expectedTargets.has(value.tabId)) {
      throw new Error(`${requestType} targets a protected, preserved, unchanged, or unknown tab: ${value.tabId}`);
    }
    touchedTabs.add(value.tabId);
    requestTabs.add(value.tabId);
  }

  for (const child of Object.values(value)) inspectRequest(child, requestType, requestTabs);
}

function validateSequentialPosition(requestType, requestValue, tabId) {
  const bounds = liveBounds.get(tabId);
  if (!bounds) throw new Error(`${requestType} has no sequential bounds for ${tabId}`);

  if (requestType === "insertText") {
    const location = requestValue?.location;
    const text = requestValue?.text;
    if (!location || location.tabId !== tabId || !Number.isInteger(location.index) ||
        typeof text !== "string" || text.length === 0) {
      throw new Error("insertText must have non-empty text and one explicit indexed body location");
    }
    if (location.index < bounds.lower || location.index > bounds.upper) {
      throw new Error(`insertText index ${location.index} is outside the current ${tabId} managed bounds`);
    }
    bounds.upper += text.length;
    return;
  }

  const range = requestValue?.range;
  if (!range || range.tabId !== tabId || !Number.isInteger(range.startIndex) ||
      !Number.isInteger(range.endIndex) || range.startIndex >= range.endIndex) {
    throw new Error(`${requestType} must have one non-empty explicit body range`);
  }
  if (range.startIndex < bounds.lower || range.endIndex > bounds.upper) {
    throw new Error(
      `${requestType} range ${range.startIndex}:${range.endIndex} is outside the current ${tabId} managed bounds ` +
      `${bounds.lower}:${bounds.upper}`,
    );
  }
  if (requestType === "deleteContentRange") {
    bounds.upper -= range.endIndex - range.startIndex;
  }
}

for (const request of plan.requests) {
  const requestType = Object.keys(request)[0];
  if (requestType === "createNamedRange") {
    const tabId = request.createNamedRange?.range?.tabId;
    const tab = allowedTabs.get(tabId);
    if (tab?.mode !== "verify-only" || request.createNamedRange?.name !== tab.managedRangeName ||
        !preflight.snapshot.verificationRanges?.[tabId]?.missing) {
      throw new Error("createNamedRange is allowed only for the initially missing verify-only parity range");
    }
  }
  const requestTabs = new Set();
  inspectRequest(request[requestType], requestType, requestTabs);
  if (requestTabs.size !== 1) {
    throw new Error(`${requestType} must target exactly one changed tab body`);
  }
  const [tabId] = requestTabs;
  validateSequentialPosition(requestType, request[requestType], tabId);
}
if (touchedTabs.size !== expectedTargets.size || [...expectedTargets.keys()].some((tabId) => !touchedTabs.has(tabId))) {
  throw new Error("Apply plan must touch every changed target and no other tab");
}
if (expectedTargets.size > 0 && plan.requests.length === 0) {
  throw new Error("Apply plan has changed targets but no requests");
}

console.log(`Validated ${plan.requests.length} tab-scoped requests for ${touchedTabs.size} changed IPSD targets.`);
