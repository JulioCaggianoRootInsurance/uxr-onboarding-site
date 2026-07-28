import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

async function filesBelow(directory) {
  const entries = await readdir(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const details = await stat(fullPath);
    if (details.isDirectory()) {
      files.push(...(await filesBelow(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

test("defines the six handoff chapters and removes stale onboarding content", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const slugs = [...content.matchAll(/slug: "([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(slugs, [
    "voc-report-redesign",
    "customer-evidence-library",
    "voc-dashboard-exploration",
    "research-and-stakeholders",
    "internship-reflection",
    "handoff",
  ]);
  assert.equal(new Set(slugs).size, slugs.length);

  assert.match(content, /Prepared by Julio Caggiano for Hala Daher/);
  assert.match(content, /Last Updated: Jul 27, 2026/);
  assert.match(content, /Delivered/);
  assert.match(content, /Prototype/);
  assert.match(content, /In progress/);
  assert.match(content, /Recommendation/);
  assert.match(content, /TBD/);

  assert.doesNotMatch(content, /Layilah Campbell/);
  assert.doesNotMatch(content, /Insurance basics/);
  assert.doesNotMatch(content, /Meet the team/);
  assert.doesNotMatch(content, /\[cite:|\\longrightarrow|\\text\{/i);
  assert.doesNotMatch(content, /magic_link=/i);
});

test("keeps future dashboard work explicitly separate from completed work", async () => {
  const content = await readProjectFile("app/handoff.ts");

  assert.match(content, /placeholder data/);
  assert.match(content, /GitHub should become the source of truth/);
  assert.match(content, /git fetch origin/);
  assert.match(content, /git pull origin main/);
  assert.match(content, /git push origin <branch-name>/);
  assert.match(content, /Vercel preview/);
  assert.match(content, /Future AI-assisted update flow/);
  assert.match(content, /should not overwrite production directly/);
  assert.match(content, /human researcher reviews/i);
  assert.match(
    content,
    /Final Q2 report, live dashboard, NPS studies, in-product surveys, and journey-map platform/,
  );
});

test("retains a deidentified, governed library of 21 customer clips", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const driveIds = [...content.matchAll(/driveId: "([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.equal(driveIds.length, 21);
  assert.equal(new Set(driveIds).size, 21);
  assert.match(content, /Participant 1/);
  assert.match(content, /Participant 2/);
  assert.match(content, /Participant 3/);
  assert.match(content, /lookback\.io\/play\/qpzK47AyZGPfTzDE7/);
  assert.match(content, /lookback\.io\/play\/PAg8bd26jergevcv5/);
  assert.match(content, /lookback\.io\/play\/hbdMNbJCUJm3LMxhH/);
  assert.doesNotMatch(content, /Jasmine Anderson|Dawn Collins|Adan/);
  assert.match(content, /Confirm consent and approved use/);
});

test("keeps private prose server-only and interactive navigation isolated", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const navigation = await readProjectFile("app/article-navigation.tsx");

  assert.match(content, /^import "server-only";/);
  assert.doesNotMatch(components, /^"use client";/);
  assert.match(navigation, /^"use client";/);
  assert.doesNotMatch(components, /from "\.\/onboarding"/);
});

test("enforces the confirmed Root Workspace domain on the server", async () => {
  const auth = await readProjectFile("auth.ts");
  const proxy = await readProjectFile("proxy.ts");

  assert.match(auth, /ROOT_WORKSPACE_DOMAIN = "joinroot\.com"/);
  assert.match(auth, /email_verified === true/);
  assert.match(auth, /googleProfile\.hd/);
  assert.match(auth, /workspaceDomain === ROOT_WORKSPACE_DOMAIN/);
  assert.match(auth, /NODE_ENV === "development"/);
  assert.match(auth, /AUTH_DEV_BYPASS === "true"/);
  assert.match(auth, /rootAuthorized/);
  assert.match(proxy, /api\/auth/);
  assert.match(proxy, /auth as proxy/);
});

test("does not emit the development auth secret into browser assets", async () => {
  const staticDirectory = path.join(projectRoot, ".next", "static");
  const files = await filesBelow(staticDirectory);
  const browserText = (
    await Promise.all(
      files
        .filter((file) => /\.(?:js|css|map)$/.test(file))
        .map((file) => readFile(file, "utf8")),
    )
  ).join("\n");

  assert.doesNotMatch(
    browserText,
    /root-uxr-local-development-auth-bypass-only/,
  );
  assert.doesNotMatch(browserText, /AUTH_GOOGLE_SECRET|AUTH_SECRET/);
});
