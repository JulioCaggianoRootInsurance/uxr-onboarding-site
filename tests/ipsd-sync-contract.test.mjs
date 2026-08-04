import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assertControlInventoryIdentity } from "../scripts/ipsd-live-safety.mjs";
import {
  buildFormattingRepairRequests,
  formattingIssues,
} from "../scripts/ipsd-formatting.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(projectRoot, relativePath), "utf8"));
}

test("protects the HR tab and denies unknown-tab writes", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const payload = await readJson("sync/ipsd-sync.generated.json");

  assert.equal(config.unknownTabPolicy, "preserve");
  assert.deepEqual(payload.protectedTabIds, ["t.0"]);
  assert.equal(config.tabs.find((tab) => tab.tabId === "t.0")?.mode, "protected");
  assert.ok(payload.targets.every((target) => target.tabId !== "t.0"));
  assert.ok(payload.targets.every((target) => ["managed-body", "managed-block"].includes(target.mode)));
  assert.equal(new Set(payload.targets.map((target) => target.tabId)).size, payload.targets.length);
});

test("maps every website chapter exactly once", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const handoffSource = await readFile(path.join(projectRoot, "app", "handoff.ts"), "utf8");
  const sourceSlugs = [...handoffSource.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  const mappedSlugs = config.tabs.flatMap((tab) => tab.sourceSlugs ?? []);

  assert.deepEqual([...mappedSlugs].sort(), [...sourceSlugs].sort());
  assert.equal(new Set(mappedSlugs).size, mappedSlugs.length);
});

test("preserves document-owned and native-control tabs", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const modes = Object.fromEntries(config.tabs.map((tab) => [tab.tabId, tab.mode]));

  assert.equal(modes["t.vwocc5k1v4db"], "doc-to-site-source");
  assert.equal(modes["t.x1rjygdc0a3s"], "verify-only");
  assert.equal(modes["t.trloe1e36awc"], "preserve-only");
  assert.equal(modes["t.qa2itxq3djir"], "managed-block");
  assert.equal(modes["t.pgdqdutlrhpb"], "managed-body");
  assert.equal(
    config.tabs.find((tab) => tab.tabId === "t.x1rjygdc0a3s")?.managedRangeName,
    "UXR_HANDOFF_PRESENTATION_PARITY",
  );
});

test("generated targets are non-empty and content-addressed", async () => {
  const payload = await readJson("sync/ipsd-sync.generated.json");

  assert.equal(payload.targets.length, 9);
  for (const target of payload.targets) {
    assert.ok(target.blocks.length > 0, `${target.expectedTitle} should have content`);
    assert.match(target.contentHash, /^[a-f0-9]{64}$/);
    for (const [index, block] of target.blocks.entries()) {
      for (const field of ["text", "description", "href"]) {
        if (field in block) {
          assert.ok(
            typeof block[field] === "string" && block[field].trim().length > 0,
            `${target.expectedTitle} block ${index} has an empty ${field}`,
          );
        }
      }
    }
  }
  assert.equal(payload.verificationTargets.length, 1);
  assert.equal(payload.verificationTargets[0].tabId, "t.x1rjygdc0a3s");
  assert.match(payload.verificationTargets[0].contentHash, /^[a-f0-9]{64}$/);
  assert.ok(payload.verificationTargets[0].parityText.includes("UXR Handoff website parity"));
});

test("detects and repairs inherited 30pt body formatting without changing emphasis or links", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const target = {
    tabId: "t.synthetic",
    expectedTitle: "Synthetic",
    mode: "managed-body",
    blocks: [{ type: "quote", label: "Linked text", text: "Quoted evidence" }],
  };
  const tab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    namedStyles: {
      styles: [
        {
          namedStyleType: "NORMAL_TEXT",
          textStyle: {
            fontSize: { magnitude: 11, unit: "PT" },
            weightedFontFamily: { fontFamily: "Proxima Nova", weight: 400 },
          },
          paragraphStyle: { lineSpacing: 115 },
        },
      ],
    },
    body: {
      content: [{
        startIndex: 1,
        endIndex: 12,
        paragraph: {
          paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
          elements: [{
            startIndex: 1,
            endIndex: 12,
            textRun: {
              content: "Linked text\n",
              textStyle: {
                bold: true,
                italic: true,
                fontSize: { magnitude: 30, unit: "PT" },
                weightedFontFamily: { fontFamily: "Arial", weight: 700 },
                link: { url: "https://example.com" },
              },
            },
          }],
        },
      }],
    },
  };

  const issues = formattingIssues(tab, target, config.formatting);
  assert.ok(issues.some((issue) => issue.kind === "font-size" && issue.actual === 30));
  const requests = buildFormattingRepairRequests(tab, target, config.formatting);
  assert.deepEqual(requests, [{
    updateTextStyle: {
      range: { startIndex: 1, endIndex: 12, tabId: target.tabId },
      textStyle: {
        fontSize: { magnitude: 11, unit: "PT" },
        weightedFontFamily: { fontFamily: "Proxima Nova", weight: 700 },
        bold: true,
        italic: true,
      },
      fields: "fontSize,weightedFontFamily,bold,italic",
    },
  }]);
  assert.equal(requests[0].updateTextStyle.textStyle.bold, true);
  assert.equal(requests[0].updateTextStyle.textStyle.italic, true);
  assert.equal(JSON.stringify(requests).includes("link"), false);
});

test("treats a native rich-link chip as one bold code unit and leaves its description normal", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const target = {
    tabId: "t.rich-link",
    expectedTitle: "Rich link",
    mode: "managed-body",
    blocks: [{
      type: "link",
      label: "Project record",
      description: "Source notes in the IPSD.",
      href: "https://docs.google.com/document/d/example/edit",
    }],
  };
  const tab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    namedStyles: {
      styles: [{
        namedStyleType: "NORMAL_TEXT",
        textStyle: {
          bold: false,
          italic: false,
          underline: false,
          fontSize: { magnitude: 11, unit: "PT" },
          weightedFontFamily: { fontFamily: "Proxima Nova", weight: 400 },
        },
        paragraphStyle: { lineSpacing: 115 },
      }],
    },
    body: {
      content: [{
        startIndex: 1,
        endIndex: 30,
        paragraph: {
          paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
          elements: [
            {
              startIndex: 1,
              endIndex: 2,
              richLink: {
                textStyle: {
                  bold: true,
                  underline: false,
                  foregroundColor: { color: { rgbColor: config.formatting.link.color } },
                },
                richLinkProperties: {
                  title: "IPSD",
                  uri: "https://docs.google.com/document/d/example/edit",
                },
              },
            },
            {
              startIndex: 2,
              endIndex: 30,
              textRun: { content: " — Source notes in the IPSD.\n", textStyle: {} },
            },
          ],
        },
      }],
    },
  };

  assert.equal(formattingIssues(tab, target, config.formatting).length, 0);
  const broken = structuredClone(tab);
  broken.body.content[0].paragraph.elements[0].richLink.textStyle.bold = false;
  assert.deepEqual(
    formattingIssues(broken, target, config.formatting)
      .filter((issue) => issue.kind === "bold")
      .map(({ startIndex, endIndex, expected }) => ({ startIndex, endIndex, expected })),
    [{ startIndex: 1, endIndex: 2, expected: true }],
  );
  assert.deepEqual(buildFormattingRepairRequests(broken, target, config.formatting), [{
    updateTextStyle: {
      range: { startIndex: 1, endIndex: 2, tabId: target.tabId },
      textStyle: { bold: true },
      fields: "bold",
    },
  }]);
});

test("splits a callout text run at the exact bold-prefix boundary", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const block = {
    type: "callout",
    status: "In progress",
    title: "Waiting for data",
    text: "The description must remain normal.",
  };
  const prefix = `${block.status} — ${block.title}:`;
  const content = `${prefix} ${block.text}`;
  const target = {
    tabId: "t.callout",
    expectedTitle: "Callout",
    mode: "managed-body",
    blocks: [block],
  };
  const tab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    namedStyles: {
      styles: [{
        namedStyleType: "NORMAL_TEXT",
        textStyle: {
          bold: false,
          italic: false,
          fontSize: { magnitude: 11, unit: "PT" },
          weightedFontFamily: { fontFamily: "Proxima Nova", weight: 400 },
        },
        paragraphStyle: { lineSpacing: 115 },
      }],
    },
    body: {
      content: [{
        startIndex: 1,
        endIndex: content.length + 2,
        paragraph: {
          paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
          elements: [{
            startIndex: 1,
            endIndex: content.length + 2,
            textRun: { content: `${content}\n`, textStyle: { bold: false } },
          }],
        },
      }],
    },
  };

  assert.deepEqual(
    formattingIssues(tab, target, config.formatting)
      .filter((issue) => issue.kind === "bold")
      .map(({ startIndex, endIndex, expected }) => ({ startIndex, endIndex, expected })),
    [{ startIndex: 1, endIndex: 1 + prefix.length, expected: true }],
  );
  assert.deepEqual(buildFormattingRepairRequests(tab, target, config.formatting), [{
    updateTextStyle: {
      range: { startIndex: 1, endIndex: 1 + prefix.length, tabId: target.tabId },
      textStyle: { bold: true },
      fields: "bold",
    },
  }]);
});

test("repairs semantic paragraph roles, branded H1 rules, and exact native list runs", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const target = {
    tabId: "t.roles",
    expectedTitle: "Role repair",
    mode: "managed-body",
    blocks: [
      { type: "title", text: "Title" },
      { type: "heading", level: 1, text: "Heading" },
      { type: "bullet", text: "First line\ncontinuation" },
      { type: "numbered", text: "Step" },
    ],
  };
  let cursor = 1;
  const paragraph = (text) => {
    const startIndex = cursor;
    const endIndex = startIndex + text.length + 1;
    cursor = endIndex;
    return {
      startIndex,
      endIndex,
      paragraph: {
        paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
        bullet: { listId: "wrong-list", nestingLevel: 0 },
        elements: [{
          startIndex,
          endIndex,
          textRun: { content: `${text}\n`, textStyle: {} },
        }],
      },
    };
  };
  const tab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    namedStyles: {
      styles: [
        {
          namedStyleType: "NORMAL_TEXT",
          textStyle: {
            bold: false,
            fontSize: { magnitude: 11, unit: "PT" },
            weightedFontFamily: { fontFamily: "Arial", weight: 400 },
          },
          paragraphStyle: { lineSpacing: 115 },
        },
        { namedStyleType: "TITLE", textStyle: { bold: true, fontSize: { magnitude: 26, unit: "PT" } } },
        { namedStyleType: "HEADING_1", textStyle: { bold: true, fontSize: { magnitude: 14, unit: "PT" } } },
      ],
    },
    lists: {
      "wrong-list": {
        listProperties: { nestingLevels: [{ glyphType: "DECIMAL", glyphFormat: "%0." }] },
      },
    },
    body: {
      content: [paragraph("Title"), paragraph("Heading"), paragraph("First line"), paragraph("continuation"), paragraph("Step")],
    },
  };

  const issues = formattingIssues(tab, target, config.formatting);
  assert.ok(issues.some((issue) => issue.kind === "paragraph-role" && issue.expected === "TITLE"));
  assert.ok(issues.some((issue) => issue.kind === "list-role" && issue.expected === "none"));
  const requests = buildFormattingRepairRequests(tab, target, config.formatting);
  assert.ok(requests.some((request) => request.updateParagraphStyle?.paragraphStyle.namedStyleType === "TITLE"));
  assert.ok(requests.some((request) =>
    request.updateParagraphStyle?.paragraphStyle.borderBottom?.width?.magnitude === 3));
  assert.ok(requests.some((request) => request.deleteParagraphBullets));
  const bulletRequests = requests.filter((request) => request.createParagraphBullets);
  assert.equal(bulletRequests.length, 2);
  assert.deepEqual(
    bulletRequests.map((request) => ({
      preset: request.createParagraphBullets.bulletPreset,
      startIndex: request.createParagraphBullets.range.startIndex,
      endIndex: request.createParagraphBullets.range.endIndex,
    })),
    [
      { preset: "BULLET_DISC_CIRCLE_SQUARE", startIndex: 15, endIndex: 26 },
      { preset: "NUMBERED_DECIMAL_ALPHA_ROMAN", startIndex: 39, endIndex: 44 },
    ],
  );
});

test("verifies and repairs title and heading line spacing by payload role", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const target = {
    tabId: "t.spacing",
    expectedTitle: "Spacing repair",
    mode: "managed-body",
    blocks: [
      { type: "title", text: "Title" },
      { type: "heading", level: 1, text: "H1" },
      { type: "heading", level: 2, text: "H2" },
      { type: "heading", level: 3, text: "H3" },
    ],
  };
  const borderBottom = {
    color: { color: { rgbColor: config.formatting.heading1Border.color } },
    width: { magnitude: 3, unit: "PT" },
  };
  const style = (namedStyleType, size, lineSpacing, extra = {}) => ({
    namedStyleType,
    textStyle: {
      bold: namedStyleType !== "NORMAL_TEXT",
      fontSize: { magnitude: size, unit: "PT" },
    },
    paragraphStyle: { lineSpacing, ...extra },
  });
  let cursor = 1;
  const paragraph = (text, namedStyleType) => {
    const startIndex = cursor;
    const endIndex = startIndex + text.length + 1;
    cursor = endIndex;
    return {
      startIndex,
      endIndex,
      paragraph: {
        paragraphStyle: { namedStyleType, lineSpacing: 115 },
        elements: [{
          startIndex,
          endIndex,
          textRun: { content: `${text}\n`, textStyle: {} },
        }],
      },
    };
  };
  const tab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    namedStyles: {
      styles: [
        {
          ...style("NORMAL_TEXT", 11, 115),
          textStyle: {
            bold: false,
            fontSize: { magnitude: 11, unit: "PT" },
            weightedFontFamily: { fontFamily: "Proxima Nova", weight: 400 },
          },
        },
        style("TITLE", 26, 150),
        style("HEADING_1", 14, 100, { borderBottom }),
        style("HEADING_2", 14, 100),
        style("HEADING_3", 12, 100),
      ],
    },
    body: {
      content: [
        paragraph("Title", "TITLE"),
        paragraph("H1", "HEADING_1"),
        paragraph("H2", "HEADING_2"),
        paragraph("H3", "HEADING_3"),
      ],
    },
  };

  const issues = formattingIssues(tab, target, config.formatting)
    .filter((issue) => issue.kind === "line-spacing");
  assert.deepEqual(issues.map((issue) => issue.expected), [150, 100, 100, 100]);
  const spacingRequests = buildFormattingRepairRequests(tab, target, config.formatting)
    .filter((request) => request.updateParagraphStyle?.fields === "lineSpacing");
  assert.deepEqual(spacingRequests.map((request) => ({
    lineSpacing: request.updateParagraphStyle.paragraphStyle.lineSpacing,
    startIndex: request.updateParagraphStyle.range.startIndex,
    endIndex: request.updateParagraphStyle.range.endIndex,
  })), [
    { lineSpacing: 150, startIndex: 1, endIndex: 7 },
    { lineSpacing: 100, startIndex: 7, endIndex: 16 },
  ]);
});

test("builds a revision-locked formatting plan accepted by the scope validator", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const payload = await readJson("sync/ipsd-sync.generated.json");
  const target = payload.targets.find((candidate) => candidate.tabId === "t.x2nebw360ab0");
  const directory = await mkdtemp(path.join(tmpdir(), "ipsd-format-plan-test-"));
  const preflightPath = path.join(directory, "preflight.json");
  const documentPath = path.join(directory, "document.json");
  const planPath = path.join(directory, "plan.json");
  const revisionId = "AIroFormattingRevision";
  const preflight = {
    changedTargets: [{ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }],
    changedVerificationTargets: [],
    snapshot: {
      documentId: config.document.id,
      revisionId,
      tabs: { [target.tabId]: { bodyEndIndex: 20 } },
    },
  };
  const document = {
    structuredContent: {
      documentId: config.document.id,
      title: config.document.expectedTitle,
      revisionId,
      tabs: [{
        tabId: target.tabId,
        title: target.expectedTitle,
        namedStyles: {
          styles: [{
            namedStyleType: "NORMAL_TEXT",
            textStyle: {
              fontSize: { magnitude: 11, unit: "PT" },
              weightedFontFamily: { fontFamily: "Proxima Nova", weight: 400 },
            },
            paragraphStyle: { lineSpacing: 115 },
          }],
        },
        body: {
          content: [{
            startIndex: 1,
            endIndex: 20,
            paragraph: {
              paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
              elements: [{
                startIndex: 1,
                endIndex: 20,
                textRun: {
                  content: "Oversized body text\n",
                  textStyle: { fontSize: { magnitude: 30, unit: "PT" } },
                },
              }],
            },
          }],
        },
      }],
    },
  };

  try {
    await writeFile(preflightPath, JSON.stringify(preflight), "utf8");
    await writeFile(documentPath, JSON.stringify(document), "utf8");
    const builder = path.join(projectRoot, "scripts", "build-ipsd-format-repair-plan.mjs");
    const validator = path.join(projectRoot, "scripts", "validate-ipsd-apply-plan.mjs");
    assert.equal(
      spawnSync(process.execPath, [builder, preflightPath, documentPath, "--output", planPath]).status,
      0,
    );
    const plan = JSON.parse(await readFile(planPath, "utf8"));
    assert.equal(plan.kind, "formatting-repair");
    assert.equal(plan.formattingProfileId, config.formatting.profileId);
    assert.equal(plan.requests.length, 1);
    assert.equal(plan.requests[0].updateTextStyle.textStyle.fontSize.magnitude, 11);
    assert.equal(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("records the last verified live application without protected content", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const state = await readJson("sync/ipsd-sync.state.json");
  const managedTabIds = config.tabs
    .filter(({ mode }) => mode === "managed-body" || mode === "managed-block")
    .map(({ tabId }) => tabId);
  const verificationTabIds = config.tabs
    .filter(({ mode, managedRangeName }) => mode === "verify-only" && managedRangeName)
    .map(({ tabId }) => tabId);

  assert.equal(state.version, 2);
  assert.match(state.sourceHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(Object.keys(state.managedTargets).sort(), [...managedTabIds].sort());
  assert.deepEqual(Object.keys(state.verificationTargets).sort(), [...verificationTabIds].sort());
  for (const hash of [...Object.values(state.managedTargets), ...Object.values(state.verificationTargets)]) {
    assert.match(hash, /^[a-f0-9]{64}$/);
  }
  assert.match(state.documentRevisionId, /^AIro/);
  assert.equal(state.presentationNativeControlVerified, true);
  assert.equal(JSON.stringify(state).includes("HR-specific"), false);
  assert.equal(state.liveSnapshot.documentId, config.document.id);
  assert.equal(state.liveSnapshot.revisionId, state.documentRevisionId);
  assert.deepEqual(
    state.liveSnapshot.topology.map(({ tabId, title }) => ({ tabId, title })),
    config.tabs.map(({ tabId, expectedTitle }) => ({ tabId, title: expectedTitle })),
  );
  assert.equal(state.liveSnapshot.managedRange.name, "UXR_HANDOFF_SYNC_STATUS");
  assert.match(state.liveSnapshot.managedRange.namedRangeId, /^kix\./);
  assert.match(state.liveSnapshot.protectedControl.signature, /^[a-f0-9]{64}$/);
  assert.equal(
    state.liveSnapshot.verificationRanges["t.x1rjygdc0a3s"].name,
    "UXR_HANDOFF_PRESENTATION_PARITY",
  );
  assert.equal(state.liveSnapshot.verificationRanges["t.x1rjygdc0a3s"].missing, undefined);
  assert.deepEqual(
    state.verification.verifiedTargetIds,
    [...managedTabIds, ...verificationTabIds],
  );
  for (const [tabId, hash] of Object.entries(state.preservedTabProofs)) {
    assert.equal(hash, state.liveSnapshot.tabs[tabId].semanticHash);
  }
});

test("binds protected-control evidence to the companion document revision", () => {
  const document = { documentId: "doc-1", revisionId: "revision-2" };

  assert.doesNotThrow(() => assertControlInventoryIdentity({
    target: { documentId: "doc-1", revisionId: "revision-2" },
  }, document));
  assert.throws(() => assertControlInventoryIdentity({
    target: { documentId: "doc-1", revisionId: "revision-1" },
  }, document), /identity\/revision/);
  assert.throws(() => assertControlInventoryIdentity({
    target: { documentId: "other-doc", revisionId: "revision-2" },
  }, document), /identity\/revision/);
  assert.throws(() => assertControlInventoryIdentity({}, document), /identity\/revision/);
});

test("mechanically rejects unscoped or protected Google Docs apply plans", async () => {
  const config = await readJson("ipsd-sync.config.json");
  const payload = await readJson("sync/ipsd-sync.generated.json");
  const target = payload.targets.find((candidate) => candidate.tabId === "t.x2nebw360ab0");
  const workingNotesTarget = payload.targets.find((candidate) => candidate.tabId === "t.qa2itxq3djir");
  const directory = await mkdtemp(path.join(tmpdir(), "ipsd-plan-test-"));
  const preflightPath = path.join(directory, "preflight.json");
  const planPath = path.join(directory, "plan.json");
  const validator = path.join(projectRoot, "scripts", "validate-ipsd-apply-plan.mjs");
  const preflight = {
    changedTargets: [{ tabId: target.tabId, title: target.expectedTitle, contentHash: target.contentHash }],
    snapshot: {
      documentId: config.document.id,
      revisionId: "AIroValidatedRevision",
      tabs: { [target.tabId]: { bodyEndIndex: 100 } },
      managedRange: { range: { startIndex: 15, endIndex: 40 } },
    },
  };
  const basePlan = {
    documentId: config.document.id,
    writeControl: { requiredRevisionId: preflight.snapshot.revisionId },
    targetContentHashes: { [target.tabId]: target.contentHash },
    requests: [{ insertText: { location: { index: 1, tabId: target.tabId }, text: "Verified" } }],
  };

  try {
    await writeFile(preflightPath, JSON.stringify(preflight), "utf8");
    await writeFile(planPath, JSON.stringify(basePlan), "utf8");
    assert.equal(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    await writeFile(planPath, JSON.stringify({
      ...basePlan,
      requests: [{ insertText: { location: { index: 1, tabId: "t.0" }, text: "Unsafe" } }],
    }), "utf8");
    assert.notEqual(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    await writeFile(planPath, JSON.stringify({
      ...basePlan,
      requests: [{ replaceAllText: { containsText: { text: "a", matchCase: true }, replaceText: "b" } }],
    }), "utf8");
    assert.notEqual(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    await writeFile(planPath, JSON.stringify({
      ...basePlan,
      requests: [
        ...basePlan.requests,
        { insertText: { endOfSegmentLocation: { tabId: "t.0" }, text: "Unsafe" } },
      ],
    }), "utf8");
    assert.notEqual(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    await writeFile(planPath, JSON.stringify({
      ...basePlan,
      requests: [{
        updateTextStyle: {
          range: { startIndex: 1, endIndex: 2, tabId: target.tabId, segmentId: "header-id" },
          textStyle: { bold: true },
          fields: "bold",
        },
      }],
    }), "utf8");
    assert.notEqual(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    const workingNotesPreflight = {
      changedTargets: [{
        tabId: workingNotesTarget.tabId,
        title: workingNotesTarget.expectedTitle,
        contentHash: workingNotesTarget.contentHash,
      }],
      snapshot: {
        documentId: config.document.id,
        revisionId: "AIroWorkingNotesRevision",
        tabs: { [workingNotesTarget.tabId]: { bodyEndIndex: 200 } },
        managedRange: { range: { startIndex: 15, endIndex: 40 } },
      },
    };
    const workingNotesPlan = {
      documentId: config.document.id,
      writeControl: { requiredRevisionId: workingNotesPreflight.snapshot.revisionId },
      targetContentHashes: { [workingNotesTarget.tabId]: workingNotesTarget.contentHash },
      requests: [
        {
          deleteContentRange: {
            range: { startIndex: 15, endIndex: 40, tabId: workingNotesTarget.tabId },
          },
        },
        {
          insertText: {
            location: { index: 15, tabId: workingNotesTarget.tabId },
            text: "Replacement",
          },
        },
        {
          updateTextStyle: {
            range: { startIndex: 15, endIndex: 26, tabId: workingNotesTarget.tabId },
            textStyle: { bold: true },
            fields: "bold",
          },
        },
      ],
    };
    await writeFile(preflightPath, JSON.stringify(workingNotesPreflight), "utf8");
    await writeFile(planPath, JSON.stringify(workingNotesPlan), "utf8");
    assert.equal(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);

    await writeFile(planPath, JSON.stringify({
      ...workingNotesPlan,
      requests: [
        {
          deleteContentRange: {
            range: { startIndex: 15, endIndex: 80, tabId: workingNotesTarget.tabId },
          },
        },
        {
          insertText: {
            location: { index: 15, tabId: workingNotesTarget.tabId },
            text: "x".repeat(100),
          },
        },
      ],
    }), "utf8");
    assert.notEqual(spawnSync(process.execPath, [validator, planPath, preflightPath]).status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("postflight verification rejects stale or duplicate managed content", async () => {
  const { verifyGeneratedTarget } = await import("../scripts/ipsd-live-safety.mjs");
  const target = {
    tabId: "t.synthetic",
    expectedTitle: "Synthetic managed tab",
    mode: "managed-body",
    blocks: [
      { type: "title", text: "Title" },
      { type: "paragraph", text: "Exact body" },
    ],
  };
  const paragraph = (startIndex, text) => ({
    startIndex,
    endIndex: startIndex + text.length + 1,
    paragraph: {
      elements: [{
        startIndex,
        endIndex: startIndex + text.length + 1,
        textRun: { content: `${text}\n`, textStyle: {} },
      }],
      paragraphStyle: { namedStyleType: "NORMAL_TEXT" },
    },
  });
  const exactTab = {
    tabId: target.tabId,
    title: target.expectedTitle,
    body: { content: [paragraph(1, "Title"), paragraph(7, "Exact body")] },
    positionedObjects: {},
  };

  assert.doesNotThrow(() => verifyGeneratedTarget(exactTab, target, { documentId: "doc-id" }));
  const staleTab = {
    ...exactTab,
    body: { content: [...exactTab.body.content, paragraph(18, "Stale duplicate")] },
  };
  assert.throws(
    () => verifyGeneratedTarget(staleTab, target, { documentId: "doc-id" }),
    /expected exactly/,
  );
});
