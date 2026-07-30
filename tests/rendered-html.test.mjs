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

test("defines the full internship handoff architecture", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const slugs = [...content.matchAll(/slug: "([^"]+)"/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(slugs, [
    "q1-voc-report",
    "q2-voc-report",
    "customer-quote-library",
    "voc-dashboard",
    "nps-executive-report",
    "uxr-onboarding-documentation",
    "presentation-template-system",
    "ai-research-skills",
    "research-process",
    "standard-operating-procedures",
    "internship-reflection",
    "handoff-next-steps",
  ]);
  assert.equal(new Set(slugs).size, slugs.length);

  const orderedTitles = [
    ...content.matchAll(/order: (\d+),\n\s+title: "([^"]+)"/g),
  ]
    .map((match) => ({
      order: Number(match[1]),
      title: match[2],
    }))
    .sort((a, b) => a.order - b.order);

  assert.deepEqual(orderedTitles, [
    { order: 1, title: "Quarterly Report (Q1-26)" },
    { order: 2, title: "Quarterly Report (Q2-26)" },
    { order: 3, title: "VOC Dashboard" },
    { order: 4, title: "Customer Quote Library" },
    { order: 5, title: "Executive Report NPS (Q1-26)" },
    { order: 6, title: "UXR Onboarding Documentation" },
    { order: 7, title: "Presentation Template" },
    { order: 8, title: "AI Skills" },
    { order: 9, title: "Research Process" },
    { order: 10, title: "Standard Operating Procedures (SOPs)" },
    { order: 11, title: "Reflection" },
    { order: 12, title: "Next Steps" },
  ]);

  assert.match(content, /Prepared by Julio Caggiano/);
  assert.doesNotMatch(content, /Last Updated: Jul 29, 2026/);
  assert.match(content, /"Deliverables"/);
  assert.match(content, /"Research practice"/);
  assert.match(content, /"Future"/);
  assert.match(content, /Layilah Campbell/);
  assert.match(content, /Quarterly Report \(Q1-26\)/);
  assert.match(content, /title: "Project Brief"/);
  assert.doesNotMatch(content, /title: "The brief"/);
  assert.match(
    content,
    /On the other hand, qualitative evidence explains why it is happening and how customers experience it/,
  );
  assert.doesNotMatch(content, /1EoVJcaMvR5RmDN-6xGxzY0ljRDiurFCQ/);
  assert.match(
    content,
    /label: "Documentation",\n\s+description: "Source notes and research context in the IPSD\."/,
  );
  assert.match(content, /label: "Find quantitative patterns"/);
  assert.match(content, /label: "Investigate through qualitative evidence"/);
  assert.match(content, /label: "Validate findings with stakeholders"/);
  assert.match(
    content,
    /label: "Report viable next steps for product development"/,
  );
  assert.match(content, /Quarterly Report \(Q2-26\)/);
  assert.match(content, /VOC Dashboard/);
  assert.match(content, /Customer Quote Library/);
  assert.match(content, /Executive Report NPS \(Q1-26\)/);
  assert.match(content, /UXR Onboarding Documentation/);
  assert.match(content, /Presentation Template/);
  assert.match(content, /AI Skills/);
  assert.match(content, /Research Process/);
  assert.match(content, /Standard Operating Procedures \(SOPs\)/);
  assert.match(content, /Reflection/);
  assert.match(content, /Next Steps/);
  assert.doesNotMatch(content, /slug: "internship-insights"/);
  assert.match(
    content,
    /"internship-insights": "internship-reflection"/,
  );
  assert.equal((content.match(/primaryLinks: \[/g) ?? []).length, 8);
  assert.match(content, /label: "Interactive prototype"/);
  assert.match(content, /node-id=1305-1457/);
  assert.match(content, /starting-point-node-id=327%3A725/);
  assert.doesNotMatch(content, /node-id=1200-2707/);
  const primaryLinkBlocks =
    content.match(/primaryLinks: \[[\s\S]*?\n    \],\n    sections:/g) ?? [];
  assert.equal(primaryLinkBlocks.length, 8);
  for (const block of primaryLinkBlocks) {
    assert.doesNotMatch(block, /label: "(?:Open|Review|Browse|Download) /);
  }
  assert.match(content, /1LK-sDBk7s94LY6uet1-ys1QsUBhrdBDm/);
  assert.match(content, /1mz6GdtOxh3LmALf4T3-jPHBmhvG1aTcZ/);
  assert.match(content, /Delivered/);
  assert.match(content, /Prototype/);
  assert.match(content, /In progress/);
  assert.match(content, /Recommendation/);
  assert.match(content, /TBD/);

  assert.doesNotMatch(content, /Insurance basics/);
  assert.doesNotMatch(content, /Meet the team/);
  assert.doesNotMatch(
    content,
    /sitemap-collaboration|Customer journey sitemap|journey catalog|journey-catalog/i,
  );
  assert.doesNotMatch(content, /\[cite:|\\longrightarrow|\\text\{/i);
  assert.doesNotMatch(content, /magic_link=/i);
});

test("keeps future dashboard work explicitly separate from completed work", async () => {
  const content = await readProjectFile("app/handoff.ts");

  assert.match(content, /placeholder data/);
  assert.match(content, /Prototype complete; code handoff in progress/);
  assert.match(content, /GitHub should become the source of truth/);
  assert.match(content, /git fetch origin/);
  assert.match(content, /git pull origin main/);
  assert.match(content, /git push origin <branch-name>/);
  assert.match(content, /Vercel preview/);
  assert.match(content, /Future AI-assisted update flow/);
  assert.match(content, /should not overwrite production directly/);
  assert.match(content, /human researcher reviews/i);
  assert.match(content, /Quarterly Report \(Q2-26\)/);
  assert.match(content, /Completed Q1 2026 executive report delivered to Jill/);
  assert.match(content, /Presentation system complete/);
  assert.match(content, /1OshHDffRLd2498_qE3Nqkty_gHhTy6So/);
  assert.match(content, /liCQw8Mv0VVnPMLacbEixP/);
  assert.match(content, /cN9IgxIRTOnBOMJf4tKMeH/);
  assert.doesNotMatch(content, /Google Slides translation still needs finalization/);
});

test("reflects the Q2 report’s stakeholder dependency and current Figma source", async () => {
  const content = await readProjectFile("app/handoff.ts");

  assert.match(content, /delivery expected in mid-August/);
  assert.match(content, /node-id=2546-1804/);
  assert.match(content, /title: "Waiting for stakeholder datasets"/);
  assert.match(content, /10-10 Direct-to-Consumer Benchmark Survey/);
  assert.match(content, /10-10 Independent Agents Survey/);
  assert.match(content, /app reviews/);
  assert.match(content, /Marketing Brand Tracker/);
  assert.match(content, /qualitative customer interviews/);
  assert.match(content, /SPRIG Index Surveys/);
  assert.match(content, /VOC Auto Shopping Survey/);
  assert.match(content, /approximately two weeks earlier/);
  assert.match(content, /ongoing monitoring program/);
  assert.match(content, /May-to-late-August period/);
  assert.match(content, /begins at the system level/);
  assert.match(content, /quantitative “what” to the qualitative “why/);
  assert.match(content, /Scan systemic signals/);
  assert.match(content, /Conduct customer conversations/);
  assert.match(content, /Develop verbatim themes/);
  assert.match(content, /Integrate the evidence/);
  assert.match(content, /explanatory sequential mixed-methods design/);
  assert.match(
    content,
    /Translated the new VOC storytelling framework into the Q2 2026 data\./,
  );
  assert.doesNotMatch(content, /The Q2 report builds on the Q1 redesign/);
  assert.doesNotMatch(content, /starts by collecting and reviewing seven datasets/);
  assert.match(content, /Next steps: Bounded opportunities/);
  assert.match(content, /title: "Research Process"/);
  assert.doesNotMatch(content, /title: "Draft structure established"/);
  assert.doesNotMatch(content, /Product recommendations: Bounded opportunities/);
});

test("keeps the homepage focused on the introduction and chapter index", async () => {
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");

  assert.match(components, /Internship Handoff/);
  assert.match(components, /review each of my internship\s+deliverables/);
  assert.match(components, /understand where each project\s+stands/);
  assert.doesNotMatch(components, /most of my work supported the Voice of Customer/);
  assert.doesNotMatch(components, /key="narrative"/);
  assert.match(components, /<IndexList \/>/);
  assert.doesNotMatch(components, /HomeStatusOverview|home-status-overview/);
  assert.doesNotMatch(components, /Total Deliverables|Includes quarterly reports/);
  assert.doesNotMatch(styles, /\.home-status-overview/);
});

test("shows the update date on the homepage but not expanded pages", async () => {
  const components = await readProjectFile("app/site-components.tsx");
  const login = await readProjectFile("app/login/page.tsx");
  const updater = await readProjectFile("app/site-updated.ts");

  assert.match(components, /const siteUpdated = getSiteUpdated\(\)/);
  assert.match(
    components,
    /<time dateTime=\{siteUpdated\.dateTime\}>\{siteUpdated\.label\}<\/time>/,
  );
  assert.match(login, /const siteUpdated = getSiteUpdated\(\)/);
  assert.match(
    login,
    /<time dateTime=\{siteUpdated\.dateTime\}>\{siteUpdated\.label\}<\/time>/,
  );
  assert.match(updater, /const updatedAt = new Date\(\)/);
  assert.doesNotMatch(
    updater,
    /node:fs|process\.cwd\(\)|readdirSync|statSync|latestProjectModification/,
  );
  assert.match(updater, /timeZone: "America\/Los_Angeles"/);
  assert.doesNotMatch(updater, /Jul 29, 2026/);
  assert.doesNotMatch(components, /\{page\.updated\}/);
});

test("places article metadata below the title with compact spacing", async () => {
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");

  assert.match(
    components,
    /<h1>\{page\.title\}<\/h1>\s+<div className="article-kicker">\s+<span className="article-group">\{page\.group\}<\/span>\s+<StatusPill status=\{page\.status\} \/>/,
  );
  assert.match(styles, /\.article-group \{/);
  assert.match(
    styles,
    /\.article-header \{[\s\S]*gap: 0\.25rem;/,
  );
  assert.doesNotMatch(styles, /\.article-kicker \{[^}]*padding/);
  assert.doesNotMatch(styles, /\.article-kicker > span:last-child/);
});

test("reflects the refined Q1 brief and aligned callout rule", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const styles = await readProjectFile("app/globals.css");

  assert.match(content, /My primary internship objective was to improve/);
  assert.match(content, /storytelling techniques and data accuracy/);
  assert.match(content, /comprehensive direction for future research iterations/);
  assert.match(content, /confusing narrative and data-analysis format/);
  assert.match(content, /Target audience: Product leadership/);
  assert.match(content, /data interpretation to actionable product insights/);
  assert.match(content, /revise the data-analysis workflow/);
  assert.match(
    content,
    /id: "continuation",\s+title: "What should happen next",\s+blocks: \[\s+\{\s+kind: "list"/,
  );
  assert.match(content, /applying this new framework to future report iterations/);
  assert.match(content, /Customer Quote Library/);
  assert.match(content, /Clu and Ryan Farnham, Director of Product Design/);
  assert.match(
    styles,
    /\.handoff-callout\.status-delivered::before \{[\s\S]*top: 0\.8rem;[\s\S]*bottom: 0\.1rem;[\s\S]*width: 1px;/,
  );
  assert.doesNotMatch(content, /primary internship mandate/);
  assert.doesNotMatch(content, /Audience need:/);
  assert.doesNotMatch(content, /id: "artifacts"/);
  assert.doesNotMatch(content, /Turn the framework into team infrastructure/);
});

test("surfaces canonical deliverable links as Notion-style bookmarks", async () => {
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");
  const rootLogo = await stat(
    path.join(projectRoot, "public/provider-icons/root-official.png"),
  );

  assert.match(components, /page\.primaryLinks\?\.length/);
  assert.match(components, /className="primary-resources stagger-item"/);
  assert.match(components, /<p>Deliverable links<\/p>/);
  assert.match(components, /<ResourceLinks items=\{page\.primaryLinks\} \/>/);
  assert.match(components, /className="resource-link-description"/);
  assert.doesNotMatch(components, /className="resource-link-url"/);
  assert.doesNotMatch(components, /resourceDisplayUrl/);
  assert.match(components, /resourceProvider\(item\.href\)/);
  assert.match(components, /provider-\$\{provider\.id\}/);
  assert.match(components, /\/provider-icons\/figma\.svg/);
  assert.match(components, /\/provider-icons\/google-drive\.png/);
  assert.match(components, /\/provider-icons\/google-docs\.png/);
  assert.match(components, /\/provider-icons\/lovable\.ico/);
  assert.match(components, /\/provider-icons\/root-official\.png/);
  assert.doesNotMatch(components, /icon: "\/favicon\.svg"/);
  assert.ok(rootLogo.size > 0);
  assert.match(styles, /\.resource-link \{[\s\S]*border: 1px solid/);
  assert.match(styles, /\.resource-link \{[\s\S]*border-radius: 0\.625rem/);
  assert.match(styles, /\.resource-provider-icon \{[\s\S]*place-items: center/);
  assert.match(styles, /\.resource-provider-icon \{[\s\S]*background: #f1f1ee/);
  assert.match(
    styles,
    /\.provider-handoff img,\n\.provider-external img \{[\s\S]*width: 100%;[\s\S]*height: 100%;[\s\S]*object-fit: cover;/,
  );
  assert.match(
    styles,
    /\.provider-handoff,\n\.provider-external \{[\s\S]*background: var\(--accent\);[\s\S]*box-shadow: none;/,
  );
  assert.doesNotMatch(styles, /\.resource-link-meta/);
  assert.match(styles, /\.resource-links \{[\s\S]*display: grid/);
  assert.match(styles, /\.handoff-callout \{[\s\S]*border-left: 1px solid/);
  assert.match(styles, /\.handoff-callout \{[\s\S]*background: transparent/);
  assert.match(styles, /\.status-pill::before/);
  assert.match(styles, /\.resource-link:focus-visible \{[\s\S]*255, 103, 43/);
});

test("retains a deidentified, governed library of 21 customer clips", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");
  const videoGridBlocks = [
    ...styles.matchAll(/\.embedded-video-grid \{([^}]*)\}/g),
  ].map((match) => match[1]);
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
  assert.match(
    content,
    /lookback\.io\/org\/root-inc-2\/projects\/root-voc-customer-interviews\/reels/,
  );
  assert.match(content, /label: "Customer support library"/);
  assert.match(content, /label: "Lookback reels and insights"/);
  assert.match(content, /Access the overall VOC-specific qualitative interviews/);
  assert.match(content, /Find the deidentified Q1-26 clips available on this page/);
  assert.match(content, /I organized customer quotes to support future quarterly reports/);
  assert.match(content, /connecting quantitative data patterns to direct customer experiences/);
  assert.match(content, /app reviews, long-form survey responses, customer feedback/);
  assert.match(
    content,
    /id: "recordings",\n\s+title: "Q1 customer recordings",\n\s+showTitle: false/,
  );
  assert.doesNotMatch(content, /label: "Library record"/);
  assert.doesNotMatch(content, /Jump to the deidentified/);
  assert.doesNotMatch(content, /title: "Library delivered"/);
  assert.doesNotMatch(content, /Q2 rebrand interviews/);
  assert.doesNotMatch(content, /These reels play from Google Drive/);
  assert.match(
    components,
    /section\.showTitle !== false \? <h2>\{section\.title\}<\/h2> : null/,
  );
  assert.match(
    components,
    /section\.showTitle === false \? section\.title : undefined/,
  );
  assert.match(components, /allowFullScreen/);
  assert.match(components, /\/preview`}/);
  assert.ok(videoGridBlocks.length >= 1);
  assert.match(videoGridBlocks[0], /grid-template-columns: 1fr/);
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

test("enforces a server-side shared-password session", async () => {
  const auth = await readProjectFile("auth.ts");
  const proxy = await readProjectFile("proxy.ts");
  const login = await readProjectFile("app/login/page.tsx");
  const loginActions = await readProjectFile("app/login/actions.ts");
  const loginForm = await readProjectFile("app/login/login-form.tsx");
  const toast = await readProjectFile("app/login-toast.tsx");

  assert.match(auth, /Credentials/);
  assert.match(auth, /process\.env\.HANDOFF_PASSWORD/);
  assert.match(auth, /MINIMUM_PASSWORD_LENGTH = 12/);
  assert.match(auth, /crypto\.subtle\.digest/);
  assert.match(auth, /process\.env\.VERCEL === "1"/);
  assert.match(auth, /handoffAuthorized/);
  assert.doesNotMatch(auth, /GoogleProfile|providers\/google|joinroot\.com/);
  assert.match(proxy, /api\/auth/);
  assert.match(proxy, /auth as proxy/);
  assert.match(login, /className="page-shell login-page"/);
  assert.match(login, /className="article-header stagger-item"/);
  assert.match(login, /LoginForm/);
  assert.doesNotMatch(login, /login-introduction|private-access-title/);
  assert.match(loginActions, /^"use server";/);
  assert.match(loginActions, /redirect: false/);
  assert.match(loginActions, /result\.searchParams\.has\("error"\)/);
  assert.match(loginActions, /attempt: previousState\.attempt \+ 1/);
  assert.match(loginActions, /redirect\(returnTo\)/);
  assert.doesNotMatch(loginActions, /redirect\(`\/login\?error=/);
  assert.match(loginForm, /^"use client";/);
  assert.match(loginForm, /useActionState/);
  assert.match(loginForm, /key=\{state\.attempt\}/);
  assert.match(loginForm, /passwordInput\.current\.value = ""/);
  assert.match(loginForm, /passwordInput\.current\.focus\(\)/);
  assert.match(loginForm, /type="password"/);
  assert.match(loginForm, /autoComplete="current-password"/);
  assert.match(loginForm, /className="login-submit"/);
  assert.match(loginForm, /aria-invalid=\{hasError/);
  assert.match(loginForm, /That password didn’t match\. Try again\./);
  assert.match(toast, /^"use client";/);
  assert.match(toast, /role="alert"/);
  assert.match(toast, /aria-live="assertive"/);
  assert.match(toast, /5000/);
});

test("does not emit authentication secrets into browser assets", async () => {
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
  assert.doesNotMatch(
    browserText,
    /HANDOFF_PASSWORD|AUTH_GOOGLE_SECRET|AUTH_SECRET/,
  );
});
