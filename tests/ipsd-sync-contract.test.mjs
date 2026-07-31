import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

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
});

test("records the last verified live application without protected content", async () => {
  const payload = await readJson("sync/ipsd-sync.generated.json");
  const state = await readJson("sync/ipsd-sync.state.json");

  assert.equal(state.sourceHash, payload.sourceHash);
  assert.deepEqual(
    state.managedTargets,
    Object.fromEntries(payload.targets.map((target) => [target.tabId, target.contentHash])),
  );
  assert.match(state.documentRevisionId, /^AIro/);
  assert.equal(state.presentationNativeControlVerified, true);
  assert.equal(JSON.stringify(state).includes("HR-specific"), false);
});
