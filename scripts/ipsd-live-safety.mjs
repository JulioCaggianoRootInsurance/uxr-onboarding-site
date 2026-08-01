import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { assertFormatting } from "./ipsd-formatting.mjs";

const volatileKeys = new Set(["contentUri"]);
const nativeElementKeys = new Set([
  "inlineObjectElement",
  "positionedObject",
  "richLink",
  "person",
  "horizontalRule",
  "table",
]);

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.keys(value)
      .filter((key) => !volatileKeys.has(key))
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  );
}

export function sha256(value) {
  const content = typeof value === "string" ? value : JSON.stringify(canonicalize(value));
  return createHash("sha256").update(content).digest("hex");
}

export function documentFromConnectorResult(result) {
  const document = result?.structuredContent ?? result;
  if (!document?.documentId || !Array.isArray(document.tabs)) {
    throw new Error("Expected a Google Docs get_document result with flattened tabs");
  }
  return document;
}

export function findTab(document, tabId) {
  const tab = document.tabs.find((candidate) => candidate.tabId === tabId);
  if (!tab) throw new Error(`Missing live document tab ${tabId}`);
  return tab;
}

export function tabSemanticValue(tab) {
  return {
    tabId: tab.tabId,
    title: tab.title,
    body: tab.body,
    headers: tab.headers,
    footers: tab.footers,
    footnotes: tab.footnotes,
    documentStyle: tab.documentStyle,
    namedStyles: tab.namedStyles,
    lists: tab.lists,
    namedRanges: tab.namedRanges,
    inlineObjects: tab.inlineObjects,
    positionedObjects: tab.positionedObjects,
  };
}

export function tabSemanticHash(tab) {
  return sha256(tabSemanticValue(tab));
}

export function nativeElementCounts(tab) {
  const counts = Object.fromEntries([...nativeElementKeys].sort().map((key) => [key, 0]));

  function visit(value) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (nativeElementKeys.has(key)) counts[key] += 1;
      if (Array.isArray(child)) child.forEach(visit);
      else visit(child);
    }
  }

  visit(tab.body);
  counts.positionedObject += Object.keys(tab.positionedObjects ?? {}).length;
  return counts;
}

export function bodyEndIndex(tab) {
  return Math.max(1, ...(tab.body?.content ?? []).map((element) => element.endIndex ?? 1));
}

export function namedRangeProof(tab, name) {
  const entry = tab.namedRanges?.[name];
  if (!entry || entry.name !== name || entry.namedRanges?.length !== 1) {
    throw new Error(`Expected exactly one named range ${name} in tab ${tab.tabId}`);
  }
  const namedRange = entry.namedRanges[0];
  if (namedRange.name !== name || namedRange.ranges?.length !== 1) {
    throw new Error(`Expected one contiguous range for ${name} in tab ${tab.tabId}`);
  }
  const range = namedRange.ranges[0];
  const elements = (tab.body?.content ?? []).filter((element) => {
    const start = element.startIndex ?? 0;
    const end = element.endIndex ?? start;
    return end > range.startIndex && start < range.endIndex;
  });
  const outsideElements = (tab.body?.content ?? []).filter((element) => {
    const start = element.startIndex ?? 0;
    const end = element.endIndex ?? start;
    return end <= range.startIndex || start >= range.endIndex;
  });
  const stripIndexes = (value) => {
    if (Array.isArray(value)) return value.map(stripIndexes);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !["startIndex", "endIndex", "contentUri"].includes(key))
      .map(([key, child]) => [key, stripIndexes(child)]));
  };
  return {
    tabId: tab.tabId,
    name,
    namedRangeId: namedRange.namedRangeId,
    range,
    semanticHash: sha256({ range, elements }),
    unmanagedSemanticHash: sha256(stripIndexes(outsideElements)),
  };
}

export function controlProof(controlInventory, tabId) {
  const controls = (controlInventory?.derivedControlInventory?.controls ?? [])
    .filter((control) => control.tabId === tabId);
  if (controls.length < 1) throw new Error(`Expected a protected native control in tab ${tabId}`);
  return {
    tabId,
    count: controls.length,
    signature: sha256(controls),
  };
}

export function assertControlInventoryIdentity(controlInventory, document) {
  const target = controlInventory?.target;
  if (!target || target.documentId !== document.documentId ||
      target.revisionId !== document.revisionId) {
    throw new Error("Control inventory identity/revision does not match the companion Google Docs snapshot");
  }
}

export function snapshotProof(document, controlInventory, config) {
  assertControlInventoryIdentity(controlInventory, document);
  const topology = document.tabs.map((tab) => ({
    tabId: tab.tabId,
    title: tab.title,
    index: tab.index,
    parentTabId: tab.parentTabId ?? null,
  }));
  const tabs = Object.fromEntries(document.tabs.map((tab) => [tab.tabId, {
    title: tab.title,
    semanticHash: tabSemanticHash(tab),
    nativeElementCounts: nativeElementCounts(tab),
    bodyEndIndex: bodyEndIndex(tab),
  }]));
  const workingNotes = config.tabs.find((tab) => tab.mode === "managed-block");
  const presentation = config.tabs.find((tab) => tab.mode === "verify-only");
  const verificationRanges = Object.fromEntries(config.tabs
    .filter((tab) => tab.mode === "verify-only" && tab.managedRangeName)
    .map((tab) => {
      const liveTab = findTab(document, tab.tabId);
      const proof = liveTab.namedRanges?.[tab.managedRangeName]
        ? namedRangeProof(liveTab, tab.managedRangeName)
        : { tabId: tab.tabId, name: tab.managedRangeName, missing: true };
      return [tab.tabId, proof];
    }));

  return {
    documentId: document.documentId,
    title: document.title,
    revisionId: document.revisionId,
    topology,
    topologyHash: sha256(topology),
    tabs,
    managedRange: namedRangeProof(
      findTab(document, workingNotes.tabId),
      workingNotes.managedRangeName,
    ),
    verificationRanges,
    protectedControl: controlProof(controlInventory, presentation.tabId),
  };
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function paragraphRecord(element) {
  const text = [];
  const urls = [];
  let hasPerson = false;
  for (const item of element.paragraph?.elements ?? []) {
    if (item.textRun?.content) text.push(item.textRun.content);
    if (item.textRun?.textStyle?.link?.url) urls.push(item.textRun.textStyle.link.url);
    if (item.richLink?.richLinkProperties) {
      text.push(item.richLink.richLinkProperties.title ?? "");
      if (item.richLink.richLinkProperties.uri) urls.push(item.richLink.richLinkProperties.uri);
    }
    if (item.person?.personProperties) {
      hasPerson = true;
      text.push(item.person.personProperties.name ?? item.person.personProperties.email ?? "");
    }
  }
  return {
    text: normalizeWhitespace(text.join("")),
    urls: [...new Set(urls)],
    hasPerson,
  };
}

export function liveManagedRecords(tab, target) {
  let range = { startIndex: 1, endIndex: bodyEndIndex(tab) };
  if (target.managedRangeName) {
    range = namedRangeProof(tab, target.managedRangeName).range;
  }
  return (tab.body?.content ?? [])
    .filter((element) => element.paragraph &&
      (element.endIndex ?? 0) > range.startIndex &&
      (element.startIndex ?? 0) < range.endIndex)
    .map(paragraphRecord)
    .filter((record) => record.text || record.urls.length || record.hasPerson);
}

export function verificationParityText(target) {
  const lines = ["UXR Handoff website parity"];
  for (const block of target.blocks) {
    if (block.type === "link") {
      lines.push(`${block.label} — ${block.description} — ${block.href}`);
    } else if (block.type === "quote") {
      lines.push(`${block.label}: “${block.text}”`);
    } else if (block.type === "callout") {
      lines.push(`${block.status} — ${block.title}: ${block.text}`);
    } else if (block.type === "command") {
      lines.push(`${block.command} — ${block.label}: ${block.description}`);
    } else if (typeof block.text === "string") {
      lines.push(...block.text.split("\n"));
    }
  }
  return lines.map(normalizeWhitespace).filter(Boolean).join("\n");
}

export function expectedManagedRecords(target, documentId) {
  const records = [];
  for (const block of target.blocks) {
    if (block.type === "link") {
      if (block.href.startsWith("/")) {
        records.push({ type: "text", text: normalizeWhitespace(`${block.label} — ${block.description}`) });
        continue;
      }
      if (block.href.includes(`/document/d/${documentId}/`)) {
        records.push({
          type: "link",
          text: normalizeWhitespace(block.description),
          href: `https://docs.google.com/document/d/${documentId}/edit`,
        });
        continue;
      }
      records.push({ type: "link", text: normalizeWhitespace(block.description), href: block.href });
      continue;
    }
    if (block.type === "quote") {
      records.push({ type: "text", text: normalizeWhitespace(`${block.label}: “${block.text}”`) });
      continue;
    }
    if (block.type === "callout") {
      records.push({ type: "text", text: normalizeWhitespace(`${block.status} — ${block.title}: ${block.text}`) });
      continue;
    }
    if (block.type === "command") {
      records.push({ type: "text", text: normalizeWhitespace(`${block.command} — ${block.label}: ${block.description}`) });
      continue;
    }
    if (typeof block.text === "string") {
      for (const line of block.text.split("\n")) {
        if (normalizeWhitespace(line)) records.push({ type: "text", text: normalizeWhitespace(line) });
      }
    }
  }
  return records;
}

export function verifyGeneratedTarget(tab, target, { documentId, formatting } = {}) {
  if (!documentId) throw new Error("verifyGeneratedTarget requires the target document ID");
  const actual = liveManagedRecords(tab, target);
  const expected = expectedManagedRecords(target, documentId);
  if (actual.length !== expected.length) {
    throw new Error(`${target.expectedTitle} has ${actual.length} managed records; expected exactly ${expected.length}`);
  }
  for (let index = 0; index < expected.length; index += 1) {
    const wanted = expected[index];
    const found = actual[index];
    if (found.hasPerson) {
      throw new Error(`${target.expectedTitle} contains an unexpected person chip at managed record ${index}`);
    }
    if (wanted.type === "link") {
      if (!found.urls.includes(wanted.href) || !found.text.endsWith(wanted.text)) {
        throw new Error(`${target.expectedTitle} link record ${index} does not match the generated URL and description`);
      }
    } else if (found.text !== wanted.text || found.urls.length) {
      throw new Error(`${target.expectedTitle} text record ${index} does not exactly match generated content`);
    }
  }
  if (target.mode === "managed-body") {
    const counts = nativeElementCounts(tab);
    for (const key of ["horizontalRule", "inlineObjectElement", "person", "positionedObject", "table"]) {
      if (counts[key] !== 0) {
        throw new Error(`${target.expectedTitle} contains an unexpected managed native element: ${key}`);
      }
    }
  }
  if (formatting) assertFormatting(tab, target, formatting);
}

export function verifyReferenceTarget(tab, target, { documentId, formatting } = {}) {
  if (!documentId) throw new Error("verifyReferenceTarget requires the target document ID");
  const actual = liveManagedRecords(tab, target);
  if (target.managedRangeName) {
    const expectedLines = verificationParityText(target).split("\n");
    if (actual.length !== expectedLines.length) {
      throw new Error(`${target.expectedTitle} parity range has ${actual.length} records; expected ${expectedLines.length}`);
    }
    for (let index = 0; index < expectedLines.length; index += 1) {
      if (actual[index].text !== expectedLines[index] || actual[index].urls.length || actual[index].hasPerson) {
        throw new Error(`${target.expectedTitle} parity record ${index} does not exactly match the website`);
      }
    }
    if (formatting) assertFormatting(tab, target, formatting);
    return;
  }
  const expected = expectedManagedRecords(target, documentId);
  let cursor = 0;
  for (const wanted of expected) {
    let foundIndex = -1;
    for (let index = cursor; index < actual.length; index += 1) {
      const found = actual[index];
      const matches = wanted.type === "link"
        ? found.urls.includes(wanted.href) && found.text.endsWith(wanted.text)
        : found.text === wanted.text || found.text.includes(wanted.text);
      if (matches) {
        foundIndex = index;
        break;
      }
    }
    if (foundIndex < 0) {
      throw new Error(`${target.expectedTitle} is missing verify-only content: ${wanted.text.slice(0, 120)}`);
    }
    cursor = foundIndex + 1;
  }
  if (formatting) assertFormatting(tab, target, formatting);
}

export function assertSameJson(actual, expected, message) {
  if (JSON.stringify(canonicalize(actual)) !== JSON.stringify(canonicalize(expected))) {
    throw new Error(message);
  }
}
