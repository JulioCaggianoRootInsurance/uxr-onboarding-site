import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tsModule from "typescript";
import { verificationParityText } from "./ipsd-live-safety.mjs";
import { validateFormattingProfile } from "./ipsd-formatting.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(projectRoot, "ipsd-sync.config.json");
const outputPath = path.join(projectRoot, "sync", "ipsd-sync.generated.json");
const checkOnly = process.argv.includes("--check");
const ts = tsModule.default ?? tsModule;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function compileSiteContent() {
  const stagingDir = await mkdtemp(path.join(tmpdir(), "uxr-ipsd-sync-"));
  const entries = ["customer-quotes", "site-updated", "handoff"];

  try {
    for (const entry of entries) {
      const sourcePath = path.join(projectRoot, "app", `${entry}.ts`);
      let source = await readFile(sourcePath, "utf8");
      source = source.replace(/^import "server-only";\s*/m, "");
      source = source
        .replace('from "./customer-quotes"', 'from "./customer-quotes.mjs"')
        .replace('from "./site-updated"', 'from "./site-updated.mjs"');

      const compiled = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          verbatimModuleSyntax: true,
        },
        fileName: sourcePath,
      }).outputText;

      await writeFile(path.join(stagingDir, `${entry}.mjs`), compiled, "utf8");
    }

    const moduleUrl = `${pathToFileURL(path.join(stagingDir, "handoff.mjs")).href}?v=${Date.now()}`;
    return await import(moduleUrl);
  } finally {
    await rm(stagingDir, { recursive: true, force: true });
  }
}

function linkBlocks(links = []) {
  return links.map((link) => ({
    type: "link",
    label: link.label,
    description: link.description,
    href: link.href,
  }));
}

function convertContentBlock(block, headingLevel = 2) {
  switch (block.kind) {
    case "paragraph":
      return [{ type: "paragraph", text: block.text, emphasis: Boolean(block.emphasis) }];
    case "signature":
      return [{ type: "signature", text: block.text }];
    case "list":
      return block.items.map((text) => ({ type: "bullet", text }));
    case "steps":
      return block.items.map((text) => ({ type: "numbered", text }));
    case "subheading":
      return [{ type: "heading", level: Math.min(3, headingLevel), text: block.text }];
    case "quote":
      return [{ type: "quote", label: block.label, text: block.text }];
    case "callout":
      return [{
        type: "callout",
        status: block.status,
        title: block.title,
        text: block.text,
      }];
    case "links":
      return linkBlocks(block.items);
    case "statusGrid":
      return block.items.flatMap((item) => [
        { type: "heading", level: Math.min(3, headingLevel), text: item.title },
        { type: "paragraph", text: `${item.status}: ${item.text}` },
        { type: "link", label: item.title, description: item.text, href: item.href },
      ]);
    case "commands":
      return block.items.map((item) => ({
        type: "command",
        command: item.command,
        label: item.label,
        description: item.description,
      }));
    case "copyablePrompt":
      return [
        { type: "heading", level: Math.min(3, headingLevel), text: block.title },
        { type: "paragraph", text: block.introduction },
        { type: "paragraph", text: block.prompt },
      ];
    case "pipeline":
      return [
        ...block.items.map((item) => ({
          type: "numbered",
          text: `${item.label}: ${item.detail}`,
        })),
        ...(block.caption ? [{ type: "paragraph", text: block.caption, emphasis: true }] : []),
      ];
    case "quoteGrid":
      return block.items.flatMap((item) => [
        { type: "quote", label: `${item.theme} · ${item.source} · ${item.period}`, text: item.quote },
      ]);
    case "videoLibrary":
      return block.collections.flatMap((collection) => [
        { type: "heading", level: Math.min(3, headingLevel), text: `${collection.participant} · ${collection.theme}` },
        { type: "paragraph", text: collection.summary },
        { type: "link", label: "Full research session", description: collection.period, href: collection.fullSessionHref },
        ...collection.clips.map((clip) => ({
          type: "link",
          label: clip.label,
          description: collection.theme,
          href: `https://drive.google.com/file/d/${clip.driveId}/view`,
        })),
      ]);
    case "customerEvidenceLibrary":
      return [
        { type: "paragraph", text: `${block.quotes.length} deidentified quotes and ${block.collections.length} interview collections are maintained in the dedicated quote-library tab.` },
      ];
    default:
      throw new Error(`Unsupported content block kind: ${block.kind}`);
  }
}

function pageBlocks(page, { includeTitle = true, sectionLevel = 1 } = {}) {
  const blocks = [];
  if (includeTitle) blocks.push({ type: "title", text: page.title });
  blocks.push({ type: "paragraph", text: `Status: ${page.status}` });
  blocks.push({ type: "paragraph", text: page.summary });

  if (page.primaryLinks?.length) {
    blocks.push({ type: "heading", level: Math.min(3, sectionLevel), text: "Resources" });
    blocks.push(...linkBlocks(page.primaryLinks));
  }

  for (const section of page.sections) {
    if (section.showTitle !== false) {
      blocks.push({ type: "heading", level: Math.min(3, sectionLevel), text: section.title });
    }
    for (const block of section.blocks) {
      blocks.push(...convertContentBlock(block, sectionLevel + 1));
    }
  }

  return blocks;
}

function siteMapBlocks(pages, groups) {
  const blocks = [
    { type: "title", text: "UXR Handoff Site Map" },
    {
      type: "paragraph",
      text: "The private handoff site is the canonical source for project status and narrative detail. This tab records the complete route map and the role of each page.",
    },
  ];

  for (const group of groups) {
    blocks.push({ type: "heading", level: 1, text: group });
    for (const page of pages.filter((candidate) => candidate.group === group).sort((a, b) => a.order - b.order)) {
      blocks.push({
        type: "bullet",
        text: `${String(page.order).padStart(2, "0")} · ${page.title} · ${page.status} · /${page.slug} — ${page.summary}`,
      });
    }
  }

  return blocks;
}

function workingNotesBlocks(pages) {
  const blocks = [
    { type: "heading", level: 1, text: "UXR Handoff synchronization" },
    {
      type: "paragraph",
      text: "The UXR Handoff website is the source of truth for current project status and narrative detail. Only allowlisted report and deliverable tabs are synchronized; HR content, the quote-library source, the presentation-template native control, and the appendix are preserved.",
    },
    { type: "heading", level: 2, text: "Current site index" },
  ];

  for (const page of [...pages].sort((a, b) => a.order - b.order)) {
    blocks.push({
      type: "bullet",
      text: `${page.title} — ${page.status}: ${page.summary}`,
    });
  }

  return blocks;
}

function consolidatedBlocks(pages) {
  const blocks = [
    { type: "title", text: "UXR Handoff — Practice & Transition" },
    {
      type: "paragraph",
      text: "A streamlined companion to the UXR Handoff website covering the research operating model, reusable procedures, internship insights, and transition plan.",
    },
  ];

  for (const page of pages) {
    blocks.push({ type: "heading", level: 1, text: page.title });
    blocks.push(...pageBlocks(page, { includeTitle: false, sectionLevel: 2 }));
  }

  return blocks;
}

function validateConfig(config, pages) {
  validateFormattingProfile(config.formatting);
  if (config.unknownTabPolicy !== "preserve") {
    throw new Error("unknownTabPolicy must be preserve");
  }

  const tabIds = config.tabs.map((tab) => tab.tabId);
  if (new Set(tabIds).size !== tabIds.length) throw new Error("Duplicate tab IDs in sync config");

  const protectedTabs = config.tabs.filter((tab) => tab.mode === "protected");
  if (protectedTabs.length !== 1 || protectedTabs[0].tabId !== "t.0") {
    throw new Error("The IPSD HR tab t.0 must be the single protected tab");
  }

  const managedModes = new Set(["managed-body", "managed-block"]);
  const managedIds = new Set(config.tabs.filter((tab) => managedModes.has(tab.mode)).map((tab) => tab.tabId));
  if (managedIds.has("t.0")) throw new Error("Protected tab t.0 cannot be managed");

  const sourceCoverage = new Map();
  for (const tab of config.tabs) {
    for (const slug of tab.sourceSlugs ?? []) {
      if (sourceCoverage.has(slug)) throw new Error(`Page ${slug} is mapped more than once`);
      sourceCoverage.set(slug, tab);
    }
  }

  for (const page of pages) {
    if (!sourceCoverage.has(page.slug)) throw new Error(`Unmapped site page: ${page.slug}`);
  }
  for (const slug of sourceCoverage.keys()) {
    if (!pages.some((page) => page.slug === slug)) throw new Error(`Unknown source slug: ${slug}`);
  }
}

const config = JSON.parse(await readFile(configPath, "utf8"));
const { handoffGroups, handoffPages } = await compileSiteContent();
validateConfig(config, handoffPages);

const targets = [];
for (const tab of config.tabs) {
  if (tab.mode === "managed-block" && tab.sourceKind === "site-index") {
    targets.push({ ...tab, blocks: workingNotesBlocks(handoffPages) });
    continue;
  }
  if (tab.mode !== "managed-body") continue;

  let blocks;
  if (tab.sourceKind === "site-map") {
    blocks = siteMapBlocks(handoffPages, handoffGroups);
  } else {
    const pages = (tab.sourceSlugs ?? []).map((slug) => {
      const page = handoffPages.find((candidate) => candidate.slug === slug);
      if (!page) throw new Error(`Missing source page: ${slug}`);
      return page;
    });
    blocks = pages.length === 1 ? pageBlocks(pages[0]) : consolidatedBlocks(pages);
  }

  if (!blocks.length) throw new Error(`Generated empty target for ${tab.expectedTitle}`);
  targets.push({ ...tab, blocks });
}

const verificationTargets = config.tabs
  .filter((tab) => tab.mode === "verify-only")
  .map((tab) => {
    const pages = (tab.sourceSlugs ?? []).map((slug) => {
      const page = handoffPages.find((candidate) => candidate.slug === slug);
      if (!page) throw new Error(`Missing verify-only source page: ${slug}`);
      return page;
    });
    if (pages.length !== 1) throw new Error(`Verify-only tab ${tab.expectedTitle} must map exactly one page`);
    const blocks = pageBlocks(pages[0]);
    const target = { ...tab, blocks };
    const parityText = verificationParityText(target);
    return { ...target, parityText, contentHash: sha256(parityText) };
  });

const sourceText = await Promise.all([
  readFile(path.join(projectRoot, "app", "handoff.ts"), "utf8"),
  readFile(path.join(projectRoot, "app", "customer-quotes.ts"), "utf8"),
]);

const payload = {
  version: config.version,
  direction: config.direction,
  document: config.document,
  sourceHash: sha256(sourceText.join("\n")),
  protectedTabIds: config.tabs.filter((tab) => tab.mode === "protected").map((tab) => tab.tabId),
  targets: targets.map((target) => ({
    ...target,
    contentHash: sha256(JSON.stringify(target.blocks)),
  })),
  verificationTargets,
};

const rendered = stableJson(payload);
if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== rendered) {
    throw new Error("IPSD sync payload is stale. Run pnpm sync:ipsd:prepare.");
  }
  console.log(`IPSD sync payload is current (${payload.targets.length} managed targets).`);
} else {
  await writeFile(outputPath, rendered, "utf8");
  console.log(`Prepared ${payload.targets.length} managed IPSD targets at sync/ipsd-sync.generated.json.`);
}
