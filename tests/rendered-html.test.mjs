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
    { order: 1, title: "VOC Quarterly Report (Q1-26)" },
    { order: 2, title: "VOC Quarterly Report (Q2-26)" },
    { order: 3, title: "VOC Dashboard" },
    { order: 4, title: "VOC Customer Quote Library" },
    { order: 5, title: "NPS Executive Report (Q1-26)" },
    { order: 6, title: "UXR Documentation" },
    { order: 7, title: "Presentation Template" },
    { order: 8, title: "AI Skills" },
    { order: 9, title: "Research Process" },
    { order: 10, title: "Standard Operating Procedures (SOPs)" },
    { order: 11, title: "Insights" },
    { order: 12, title: "Transition Plan" },
  ]);

  assert.match(content, /I’m deeply grateful/);
  assert.doesNotMatch(content, /Last Updated: Jul 29, 2026/);
  assert.match(content, /"Deliverables"/);
  assert.match(content, /"Research practice"/);
  assert.match(content, /"Future"/);
  assert.match(content, /Layilah Campbell/);
  assert.match(content, /VOC Quarterly Report \(Q1-26\)/);
  assert.match(content, /title: "Project Brief"/);
  assert.doesNotMatch(content, /title: "The brief"/);
  assert.match(
    content,
    /Quantitative evidence helped us identify broader phenomena that required attention/,
  );
  assert.match(
    content,
    /specific struggles customers were facing, which then informed our debriefs with Product Design stakeholders/,
  );
  assert.doesNotMatch(
    content,
    /Quantitative evidence establishes what is happening/,
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
  const q1Page = content.slice(
    content.indexOf('slug: "q1-voc-report"'),
    content.indexOf('slug: "q2-voc-report"'),
  );
  const reportingFramework = q1Page.slice(
    q1Page.indexOf('id: "reporting-framework"'),
    q1Page.indexOf('id: "continuation"'),
  );
  assert.ok(
    reportingFramework.indexOf('kind: "pipeline"') <
      reportingFramework.indexOf('kind: "list"'),
    "the reporting-framework pipeline should appear before its guidance list",
  );
  assert.match(content, /VOC Quarterly Report \(Q2-26\)/);
  assert.match(content, /VOC Dashboard/);
  assert.match(content, /VOC Customer Quote Library/);
  assert.match(content, /NPS Executive Report \(Q1-26\)/);
  assert.match(content, /UXR Documentation/);
  assert.match(content, /Presentation Template/);
  assert.match(content, /AI Skills/);
  assert.match(content, /Research Process/);
  assert.match(content, /Standard Operating Procedures \(SOPs\)/);
  assert.match(content, /title: "Insights"/);
  assert.match(content, /Transition Plan/);
  assert.doesNotMatch(content, /slug: "internship-insights"/);
  assert.match(
    content,
    /"internship-insights": "internship-reflection"/,
  );
  assert.equal((content.match(/primaryLinks: \[/g) ?? []).length, 8);
  assert.match(content, /label: "Interactive prototype"/);
  assert.match(content, /page-id=311%3A2741/);
  assert.match(content, /node-id=311-2744/);
  assert.doesNotMatch(content, /node-id=1305-1457/);
  assert.doesNotMatch(content, /starting-point-node-id=/);
  assert.equal((content.match(/href: q1PrototypeHref/g) ?? []).length, 2);
  assert.doesNotMatch(content, /node-id=1200-2707/);
  const primaryLinkBlocks =
    content.match(/primaryLinks: \[[\s\S]*?\n    \],\n    sections:/g) ?? [];
  assert.equal(primaryLinkBlocks.length, 8);
  for (const block of primaryLinkBlocks) {
    assert.doesNotMatch(block, /label: "(?:Open|Review|Browse|Download) /);
  }
  assert.match(content, /1LK-sDBk7s94LY6uet1-ys1QsUBhrdBDm/);
  assert.doesNotMatch(content, /1mz6GdtOxh3LmALf4T3-jPHBmhvG1aTcZ/);
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

test("frames the internship reflection as actionable insights", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const insightsPage = content.slice(
    content.indexOf('slug: "internship-reflection"'),
    content.indexOf('slug: "handoff-next-steps"'),
  );

  assert.match(insightsPage, /title: "Insights"/);
  for (const [id, title] of [
    ["product-roadmaps", "Product Roadmaps"],
    ["data-visualization", "Data Visualization"],
    ["rapid-iteration", "Rapid Iteration"],
    ["skills-developed", "Skills developed"],
    ["what-i-want-to-develop-next", "What I Want to Develop Next"],
  ]) {
    assert.match(
      insightsPage,
      new RegExp(`id: "${id}",\\s+title: "${title}"`),
    );
  }
  assert.match(
    insightsPage,
    /research findings represent the beginning of a product design journey/,
  );
  assert.match(insightsPage, /current roadmap, its constraints/);
  assert.match(insightsPage, /stronger researcher and a more thoughtful designer/);
  assert.match(insightsPage, /every two or three days/);
  assert.match(insightsPage, /less organizational context/);
  assert.match(insightsPage, /continuous, incremental refinement/);
  assert.doesNotMatch(
    insightsPage,
    /id: "systematic-thinking"|Systematic Thinking|broader storytelling system/,
  );
  assert.match(
    insightsPage,
    /Visible sample sizes, source labels, and limitations/,
  );
  assert.match(insightsPage, /Qualitative synthesis:/);
  assert.match(insightsPage, /AI practice beyond research and design into production/);
  assert.match(insightsPage, /technical and non-technical audiences/);
  assert.match(insightsPage, /comfort zone as an introvert/);
  assert.doesNotMatch(
    insightsPage,
    /Research impact is a system|Clarity and rigor reinforce each other|Prototypes create alignment/,
  );
  assert.doesNotMatch(
    insightsPage,
    /id: "ai-needs-boundaries"|AI is useful when its boundaries are explicit/,
  );
  assert.doesNotMatch(
    insightsPage,
    /id: "shared-ownership"|Shared ownership should remain visible/,
  );
  assert.doesNotMatch(
    insightsPage,
    /From a report to a system|id: "evidence-discipline"|Evidence discipline/,
  );
  assert.doesNotMatch(
    insightsPage,
    /What I would strengthen next|Impact still to verify/,
  );
});

test("consolidates the transition plan and ends with an italic thank-you", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");
  const transitionPage = content.slice(
    content.indexOf('slug: "handoff-next-steps"'),
  );
  const actionSection = transitionPage.slice(
    transitionPage.indexOf('id: "immediate-actions"'),
    transitionPage.indexOf('id: "closing"'),
  );

  assert.match(transitionPage, /title: "Transition Plan"/);
  assert.doesNotMatch(
    transitionPage,
    /id: "artifact-links"|title: "Related Resources"/,
  );
  assert.match(
    actionSection,
    /id: "immediate-actions",\s+title: "Action Required"/,
  );
  for (const action of [
    "Confirm the long-term owner for every artifact.",
    "Verify access to Figma, Drive recordings, research notes, the AI Skills folder, the dashboard GitHub repository, and Vercel.",
    "Pilot the onboarding documentation with a new team member and assign chapter owners.",
  ]) {
    assert.ok(actionSection.includes(action));
  }
  for (const question of [
    "Who will own the completed VOC presentation system and approve future changes?",
    "Who will own the evidence library, onboarding playbook, and their permission or content reviews?",
    "Which Q2 findings require another research round before publication?",
    "Which data sources and metrics are approved for the first operational dashboard version?",
  ]) {
    assert.ok(actionSection.includes(question));
  }
  assert.doesNotMatch(
    actionSection,
    /one canonical link|Complete the Q2 report’s evidence review|Connect the dashboard only to validated metrics|Finish the dashboard repository|Should the dashboard move from a presentation prototype|Where should the AI skill packages be installed/,
  );
  assert.equal((actionSection.match(/kind: "steps"/g) ?? []).length, 2);
  assert.doesNotMatch(actionSection, /kind: "list"/);
  assert.doesNotMatch(
    transitionPage,
    /id: "manager-decisions"|Decisions for Hala|Choices that determine the next phase/,
  );
  assert.match(
    transitionPage,
    /kind: "paragraph",\s+emphasis: true,\s+text: "I’m deeply grateful/,
  );
  assert.match(
    transitionPage,
    /hope to continue contributing to Root throughout my final year of university and after graduation/,
  );
  assert.match(
    transitionPage,
    /kind: "signature",\s+text: "Julio Caggiano"/,
  );
  assert.doesNotMatch(
    transitionPage,
    /This handoff separates delivered artifacts|Prepared by Julio Caggiano|The goal is not only to preserve/,
  );
  assert.match(
    components,
    /className=\{block\.emphasis \? "article-paragraph-emphasis" : undefined\}/,
  );
  assert.match(
    styles,
    /\.content-section > \.article-paragraph-emphasis\s*\{[^}]*font-family: var\(--font-secondary\);[^}]*font-style: italic;/s,
  );
  assert.match(
    components,
    /block\.kind === "signature"[\s\S]*className="closing-signature"/,
  );
  assert.match(
    styles,
    /\.content-section > \.closing-signature\s*\{[^}]*font-family: var\(--font-secondary\);[^}]*font-style: italic;/s,
  );
});

test("links every artifact status to its most useful destination", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");
  const transitionPage = content.slice(
    content.indexOf('slug: "handoff-next-steps"'),
  );
  const statusInventory = transitionPage.slice(
    transitionPage.indexOf('id: "status-inventory"'),
    transitionPage.indexOf('id: "immediate-actions"'),
  );

  assert.match(content, /export type StatusItem = \{[\s\S]*href: string;/);
  assert.equal((statusInventory.match(/\bhref:/g) ?? []).length, 9);
  for (const [title, destination] of [
    ["VOC Quarterly Report (Q1-26)", "q1PrototypeHref"],
    ["VOC Quarterly Report (Q2-26)", "node-id=2546-1804"],
    ["VOC Dashboard · Prototype", "lovable.dev/preview/"],
    ["VOC Dashboard · Code Handoff", "1ybcIiBDlDmvNmnbr0hoJyQSgG8ZSgzBs"],
    ["VOC Customer Quote Library", "/customer-quote-library"],
    ["NPS Executive Report (Q1-26)", "node-id=1861-3299"],
    ["UXR Documentation", "1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU"],
    ["Presentation Template", "liCQw8Mv0VVnPMLacbEixP"],
    ["AI Skills", "/ai-research-skills"],
  ]) {
    assert.ok(statusInventory.includes(`title: "${title}"`));
    assert.ok(statusInventory.includes(destination));
  }
  assert.match(components, /const isInternal = item\.href\.startsWith\("\/"\)/);
  assert.match(
    components,
    /aria-label=\{`\$\{item\.title\}\. \$\{item\.text\}\. Opens in a new tab\.`\}/,
  );
  assert.match(components, /rel="noreferrer"\s+target="_blank"/);
  assert.match(components, /className="status-card-action"/);
  assert.match(styles, /\.status-card:hover[\s\S]*\.status-card:focus-visible/);
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
  assert.match(content, /VOC Quarterly Report \(Q2-26\)/);
  assert.match(content, /Completed Q1 2026 executive report delivered to Jill/);
  assert.match(content, /practical system for yearly reporting/);
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

test("frames the NPS report for product and executive audiences", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const npsPage = content.slice(
    content.indexOf('slug: "nps-executive-report"'),
    content.indexOf('slug: "uxr-onboarding-documentation"'),
  );
  const figmaPrototype =
    "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=1861%3A3298&node-id=1861-3299&p=f&viewport=-168%2C128%2C0.17&t=gF482mM1I1lkZy3Z-1&scaling=contain&content-scaling=fixed";

  assert.ok(npsPage.includes(`href: "${figmaPrototype}"`));
  assert.match(
    npsPage,
    /helps the product team navigate Root’s current NPS performance/,
  );
  for (const label of [
    "Executive summary:",
    "NPS segment views:",
    "Promoter and detractor themes:",
    "Methodology and sampling:",
    "Follow-up strategy:",
    "Appendix:",
  ]) {
    assert.match(npsPage, new RegExp(label));
  }
  assert.match(npsPage, /key findings and future steps for leadership/);
  assert.match(
    npsPage,
    /central research workflow examined each NPS tracking source independently/,
  );
  assert.match(npsPage, /current-customer and non-customer samples/);
  assert.match(
    npsPage,
    /Marketing Brand Tracking Study and the 10\/10 Benchmark Survey/,
  );
  assert.match(
    npsPage,
    /Structured the report narrative for an executive audience/,
  );
  assert.match(
    npsPage,
    /multiple rounds of review with leadership stakeholders/,
  );
  assert.match(
    npsPage,
    /common source of confusion across multiple NPS tracking studies/,
  );
  assert.doesNotMatch(
    npsPage,
    /The completed Q1 2026 executive readout delivered to Jill/,
  );
  assert.doesNotMatch(npsPage, /id: "delivered-artifact"/);
  assert.doesNotMatch(npsPage, /title: "Delivered artifact"/);
  assert.doesNotMatch(npsPage, /Executive report delivered/);
  assert.doesNotMatch(npsPage, /The central analytical safeguard/);
  assert.doesNotMatch(npsPage, /node-id=311-2741/);
});

test("keeps UXR documentation focused on the onboarding deliverable", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const onboardingPage = content.slice(
    content.indexOf('slug: "uxr-onboarding-documentation"'),
    content.indexOf('slug: "presentation-template-system"'),
  );

  assert.match(onboardingPage, /label: "Onboarding document"/);
  assert.equal((onboardingPage.match(/\bhref:/g) ?? []).length, 1);
  assert.doesNotMatch(
    onboardingPage,
    /label: "Project record"|Scope, progress, and continuation notes in the IPSD|id: "how-it-was-built"|title: "How it was built"/,
  );
});

test("presents the reporting templates as one reusable system", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const templatePage = content.slice(
    content.indexOf('slug: "presentation-template-system"'),
    content.indexOf('slug: "ai-research-skills"'),
  );

  assert.match(templatePage, /label: "Google Slides Template"/);
  assert.match(templatePage, /label: "Figma Template"/);
  assert.match(
    templatePage,
    /description: "Completed Figma presentation template\."/,
  );
  assert.match(templatePage, /label: "Design System"/);
  assert.match(templatePage, /label: "Project Documentation"/);
  assert.match(
    templatePage,
    /I expanded the rebrand into a practical system for yearly reporting/,
  );
  assert.match(templatePage, /repeatable structures for executive summaries/);
  assert.match(
    templatePage,
    /research stakeholders and product partners communicate ideas through a cohesive presentation and storytelling framework/,
  );
  assert.match(
    templatePage,
    /Reusable components and design elements for product and research teams/,
  );
  assert.match(
    templatePage,
    /Root’s photography identity for non-commercial use, grounded in its brand principles/,
  );
  assert.match(
    templatePage,
    /Two separate templates: Figma \(for designers and technical team members\) and Google Slides \(for non-technical stakeholders, such as Human Resources partners\)/,
  );
  assert.match(
    templatePage,
    /focusing each slide on one primary image or message/,
  );
  assert.doesNotMatch(templatePage, /id: "delivered-system"/);
  assert.doesNotMatch(templatePage, /Presentation system complete/);
  assert.doesNotMatch(
    templatePage,
    /I expanded the reporting direction into a practical system/,
  );
  assert.doesNotMatch(templatePage, /label: "Team Figma template"/);
  assert.doesNotMatch(templatePage, /label: "VOC design system"/);
  assert.doesNotMatch(templatePage, /label: "Presentation template"/);
  assert.doesNotMatch(templatePage, /label: "Project record"/);
  assert.doesNotMatch(
    templatePage,
    /New Brand Figma Slides Template in UX Team resources/,
  );
});

test("keeps the AI skills page focused on the research process", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const styles = await readProjectFile("app/globals.css");
  const aiSkillsPage = content.slice(
    content.indexOf('slug: "ai-research-skills"'),
    content.indexOf('slug: "research-process"'),
  );
  const primaryLinks = aiSkillsPage.slice(
    aiSkillsPage.indexOf("primaryLinks: ["),
    aiSkillsPage.indexOf("sections: ["),
  );

  assert.match(
    primaryLinks,
    /primaryLinks: \[\s+\{\s+label: "\/research-viz"/,
  );
  for (const label of [
    "/research-viz",
    "/research-synthesis",
    "/root-brand-voice",
    "Project Documentation",
  ]) {
    assert.match(primaryLinks, new RegExp(`label: "${label}"`));
  }
  assert.equal((primaryLinks.match(/^\s+label:/gm) ?? []).length, 4);
  assert.doesNotMatch(primaryLinks, /label: "AI Skills folder"/);
  assert.doesNotMatch(primaryLinks, /label: "Project record"/);
  assert.doesNotMatch(primaryLinks, /label: "Research playbook"/);
  assert.doesNotMatch(primaryLinks, /label: "Research visualization"/);
  assert.doesNotMatch(primaryLinks, /label: "Research synthesis"/);
  assert.doesNotMatch(primaryLinks, /label: "Root brand voice"/);
  assert.match(
    aiSkillsPage,
    /streamline research across diverse data sources/,
  );
  assert.match(aiSkillsPage, /Python-based visualization/);
  assert.match(aiSkillsPage, /reliable handling of CSV files/);
  assert.match(aiSkillsPage, /CSV files\.\\nThe packages/);
  assert.match(aiSkillsPage, /spend more time interpreting results/);
  assert.doesNotMatch(
    aiSkillsPage,
    /instead of repeating manual spreadsheet work/,
  );
  assert.match(aiSkillsPage, /Root brand-voice skill/);
  assert.match(aiSkillsPage, /evolving experiment/);
  assert.match(aiSkillsPage, /AI-written language/);
  assert.match(
    styles,
    /\.article-intro > p\s*\{[^}]*white-space: pre-line;/s,
  );
  assert.match(
    aiSkillsPage,
    /id: "how-they-work-together",\s+title: "Research Process"/,
  );
  assert.match(aiSkillsPage, /id: "data-processing-workflow"/);
  assert.match(aiSkillsPage, /title: "Data-processing workflow"/);
  assert.doesNotMatch(aiSkillsPage, /id: "skill-set"|The skill set/);
  assert.doesNotMatch(aiSkillsPage, /Three complementary roles/);
  assert.doesNotMatch(aiSkillsPage, /How they work together/);
  assert.doesNotMatch(aiSkillsPage, /Operating rule/);
  assert.doesNotMatch(aiSkillsPage, /Voice should never outrun validity/);
  assert.doesNotMatch(
    aiSkillsPage,
    /id: "artifacts-and-boundary"|Artifacts and handoff boundary/,
  );
  assert.doesNotMatch(aiSkillsPage, /Confirm the canonical packages/);
});

test("keeps the research process focused on an iterative workflow", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const styles = await readProjectFile("app/globals.css");
  const researchProcessPage = content.slice(
    content.indexOf('slug: "research-process"'),
    content.indexOf('slug: "standard-operating-procedures"'),
  );

  assert.match(researchProcessPage, /title: "Research Process",\s+summary: ""/);
  assert.doesNotMatch(
    researchProcessPage,
    /The repeatable path I used to turn an open brief/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /id: "inputs-and-collaboration"|Inputs and collaboration/,
  );
  assert.doesNotMatch(researchProcessPage, /June 3 and June 12, 2026/);
  assert.match(
    researchProcessPage,
    /id: "how-inputs-shaped-work",\s+title: "Research workflow",\s+showTitle: false/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /How the inputs shaped the work/,
  );
  assert.match(
    researchProcessPage,
    /label: "Iterate", detail: "Implement feedback and improve"/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /label: "Record"|Preserve decisions and open work/,
  );
  assert.match(
    researchProcessPage,
    /My UX research workflow is experimental, iterative, and informed by established human-centered design methods\./,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /Reporting direction:|Dashboard direction:|Research boundary:|Operating model:/,
  );
  assert.match(
    researchProcessPage,
    /id: "research-foundation",\s+title: "Research philosophy"/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /Research foundation reviewed|The appendix records a broad review/,
  );
  assert.match(
    researchProcessPage,
    /My research approach is centered around observable behavior\./,
  );
  assert.match(
    researchProcessPage,
    /being able to observe users in a natural setting—such as through moderated usability testing and qualitative surveys/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /My research approach begins with observable behavior|Self-reported attitudes can help explain meaning and motivation/,
  );
  assert.match(
    researchProcessPage,
    /success rate, time on task, assistance required, error frequency/,
  );
  assert.match(
    researchProcessPage,
    /sample quality, segment differences, and the limitations of each source\./,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /a metric is useful only when/,
  );
  assert.match(
    researchProcessPage,
    /customer empathy is an active exercise/,
  );
  assert.match(
    researchProcessPage,
    /conduct an unmoderated usability test than ask users whether they feel the solution is appropriate/,
  );
  assert.match(
    researchProcessPage,
    /without supervision or support from the research team/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /Watching where they pause, adapt, or fail reveals friction|active research practice rather than a statement of intent/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /id: "attribution-boundary"|Attribution boundary/,
  );
  assert.doesNotMatch(
    researchProcessPage,
    /Preserve shared ownership|Confirm whether I led, co-led, attended, or synthesized/,
  );
  assert.match(
    components,
    /\.filter\(\(section\) => section\.showTitle !== false\)/,
  );
  assert.match(components, /content-section-untitled/);
  assert.match(
    components,
    /\{page\.summary \? <p>\{page\.summary\}<\/p> : null\}/,
  );
  assert.match(
    styles,
    /\.content-section-untitled\s*\{\s*padding-top: 0\.75rem;/s,
  );
  assert.match(
    styles,
    /\.content-section-untitled > :first-child\s*\{\s*margin-top: 0;/s,
  );
});

test("consolidates the SOP data-analysis and review workflow", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const sopPage = content.slice(
    content.indexOf('slug: "standard-operating-procedures"'),
    content.indexOf('slug: "internship-reflection"'),
  );

  assert.match(
    sopPage,
    /id: "data-analysis-workflow",\s+title: "Data Analysis Workflow"/,
  );
  assert.match(sopPage, /Provenance: Preserve source, period, population/);
  assert.match(sopPage, /label: "Self-review"/);
  assert.match(sopPage, /label: "Handoff"/);
  assert.match(sopPage, /Use a branch and preview for code changes/);
  assert.doesNotMatch(
    sopPage,
    /id: "evidence-and-analysis"|id: "review-and-publishing"|Review rule|A memorable quote can make a verified pattern understandable/,
  );
  assert.doesNotMatch(
    sopPage,
    /id: "source-playbook"|Source playbook|UXR onboarding and SOP source|AI research workflow/,
  );
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

test("publishes a minimal, host-aware social preview card", async () => {
  const layout = await readProjectFile("app/layout.tsx");
  const home = await readProjectFile("app/page.tsx");
  const socialCard = await readFile(
    path.join(projectRoot, "public", "og.png"),
  );

  assert.equal(socialCard.toString("ascii", 1, 4), "PNG");
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);
  assert.match(layout, /export async function generateMetadata/);
  assert.match(
    layout,
    /requestHeaders\s+\.get\("x-forwarded-host"\)/,
  );
  assert.match(layout, /requestHeaders\.get\("host"\)/);
  assert.match(
    layout,
    /new URL\("\/og\.png", metadataOrigin\)\.toString\(\)/,
  );
  assert.match(layout, /width: 1200/);
  assert.match(layout, /height: 630/);
  assert.match(layout, /alt: "UX Research Internship Handoff"/);
  assert.match(layout, /card: "summary_large_image"/);
  assert.doesNotMatch(home, /openGraph:/);
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

test("reflects the refined Q1 brief without a redundant completion callout", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const styles = await readProjectFile("app/globals.css");
  const q1Page = content.slice(
    content.indexOf('slug: "q1-voc-report"'),
    content.indexOf('slug: "q2-voc-report"'),
  );

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
  assert.match(content, /VOC Customer Quote Library/);
  assert.match(content, /Clu and Ryan Farnham, Director of Product Design/);
  assert.doesNotMatch(
    q1Page,
    /Latest presentation complete|The current Q1 VOC presentation is complete in Figma/,
  );
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

test("keeps the customer quote library synchronized, ordered, and deidentified", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const quotes = await readProjectFile("app/customer-quotes.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const evidenceLibrary = await readProjectFile(
    "app/customer-evidence-library.tsx",
  );
  const styles = await readProjectFile("app/globals.css");
  const customerPage = content.slice(
    content.indexOf('slug: "customer-quote-library"'),
    content.indexOf('slug: "voc-dashboard"'),
  );
  const quoteRecords = quotes.match(/^\s{8}quote:/gm) ?? [];
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
  assert.doesNotMatch(customerPage, /Embedded recordings/);
  assert.doesNotMatch(
    customerPage,
    /Find the deidentified Q1-26 clips available on this page/,
  );
  assert.match(
    content,
    /A complete, organized customer quote library to support future quarterly reports/,
  );
  assert.match(
    content,
    /workflow of connecting quantitative data patterns to direct customer experiences/,
  );
  assert.match(
    content,
    /interviews, app reviews, long-form survey responses, customer feedback, and other research resources/,
  );
  assert.match(customerPage, /id: "customer-quotes"/);
  assert.match(customerPage, /title: "Customer Quotes"/);
  assert.doesNotMatch(customerPage, /id: "purpose"|Purpose and contribution/);
  assert.doesNotMatch(customerPage, /representative-evidence|Representative evidence/);
  assert.match(customerPage, /kind: "customerEvidenceLibrary"/);
  assert.match(customerPage, /quotes: customerQuotes/);
  assert.match(customerPage, /collections: q1CustomerRecordings/);
  assert.doesNotMatch(customerPage, /id: "recordings"/);
  assert.ok(
    customerPage.indexOf('id: "customer-quotes"') <
      customerPage.indexOf('id: "next-steps"'),
  );
  assert.match(
    customerPage,
    /id: "next-steps",\s+title: "Next steps",\s+blocks: \[\s+\{\s+kind: "list",\s+items: \[\s+"Assign the long-term owner of the customer quote library, responsible for quarterly updates"/,
  );
  assert.doesNotMatch(
    customerPage,
    /Governance still required|A useful library also needs rules|Playback access is only one layer|Confirm consent and approved use|Preserve exact source locators|Record the connected quantitative pattern|Treat memorable quotes as illustrations/,
  );
  assert.equal(quoteRecords.length, 45);
  assert.match(quotes, /tabId: "t\.vwocc5k1v4db"/);
  assert.match(quotes, /syncedOn: "2026-07-30"/);
  assert.match(quotes, /VOC Customer Interview · Participant 1/);
  assert.match(quotes, /Q1 VOC Report · App reviews/);
  assert.match(quotes, /Rebrand Consumer Interview · Participant 8/);
  assert.match(quotes, /In-App Survey Pilot at Sprig/);
  assert.match(quotes, /Customer Survey/);
  assert.match(quotes, /Customer Choice Survey/);
  assert.match(quotes, /Billing and Payments Vision Research/);
  assert.doesNotMatch(content, /label: "Library record"/);
  assert.doesNotMatch(content, /Jump to the deidentified/);
  assert.doesNotMatch(content, /title: "Library delivered"/);
  assert.doesNotMatch(content, /Q2 rebrand interviews/);
  assert.doesNotMatch(content, /These reels play from Google Drive/);
  assert.match(
    components,
    /import \{ CustomerEvidenceLibrary \} from "\.\/customer-evidence-library"/,
  );
  assert.match(
    components,
    /<CustomerEvidenceLibrary\s+collections=\{block\.collections\}\s+quotes=\{block\.quotes\}/,
  );
  assert.match(evidenceLibrary, /^"use client";/);
  assert.match(evidenceLibrary, /function roundRobinClips/);
  assert.match(evidenceLibrary, /function buildEvidenceStream/);
  assert.match(evidenceLibrary, /baseQuotesPerClip/);
  assert.match(evidenceLibrary, /extraQuoteCount/);
  assert.match(
    evidenceLibrary,
    /Math\.floor\(\(extraIndex \* clips\.length\) \/ extraQuoteCount\)/,
  );
  assert.match(evidenceLibrary, /allowFullScreen/);
  assert.match(evidenceLibrary, /\/preview`}/);
  assert.match(evidenceLibrary, />\s*Search quotes\s*<\/button>/);
  assert.match(evidenceLibrary, />\s*Search\s*<\/label>/);
  assert.match(evidenceLibrary, /Keyword, theme, or idea/);
  assert.match(evidenceLibrary, />Affinities<\/p>/);
  assert.match(evidenceLibrary, /function isWithinEditDistance/);
  assert.match(evidenceLibrary, /function affinityMatchesQueryToken/);
  assert.match(evidenceLibrary, /function quoteMatchesQuery/);
  assert.match(evidenceLibrary, /aria-expanded=\{isSearchOpen\}/);
  assert.match(evidenceLibrary, /aria-pressed=\{isSelected\}/);
  assert.match(evidenceLibrary, /aria-live="polite"/);
  for (const affinity of [
    "Trust",
    "Pricing",
    "Payments",
    "Support",
    "Telematics / data",
    "Cancellation / retention",
    "Shopping / quotes",
    "App experience",
    "Brand / messaging",
  ]) {
    assert.match(evidenceLibrary, new RegExp(`label: "${affinity}"`));
  }
  assert.match(styles, /\.customer-evidence-stream \{/);
  assert.match(styles, /\.evidence-search-toggle \{/);
  assert.match(styles, /\.evidence-search-panel \{/);
  assert.match(styles, /\.evidence-affinity-chip\.is-selected \{/);
  const searchPanel =
    styles.match(/\.evidence-search-panel \{([^}]*)\}/)?.[1] ?? "";
  const searchControls =
    styles.match(
      /\.evidence-affinity-chip,\n\.evidence-search-clear \{([^}]*)\}/,
    )?.[1] ?? "";
  assert.match(searchPanel, /border: 0/);
  assert.match(searchPanel, /border-radius: 0/);
  assert.match(searchPanel, /background: transparent/);
  assert.match(searchControls, /border-radius: 0/);
  assert.doesNotMatch(searchControls, /999px/);
  assert.doesNotMatch(content, /Jasmine Anderson|Dawn Collins|Adan/);
  assert.doesNotMatch(quotes, /Jasmine Anderson|Dawn Collins|Adan/);
});

test("keeps private prose server-only and interactive navigation isolated", async () => {
  const content = await readProjectFile("app/handoff.ts");
  const components = await readProjectFile("app/site-components.tsx");
  const evidenceLibrary = await readProjectFile(
    "app/customer-evidence-library.tsx",
  );
  const navigation = await readProjectFile("app/article-navigation.tsx");

  assert.match(content, /^import "server-only";/);
  assert.doesNotMatch(components, /^"use client";/);
  assert.match(evidenceLibrary, /^"use client";/);
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
  assert.match(loginForm, /useState\(false\)/);
  assert.match(loginForm, /type=\{passwordVisible \? "text" : "password"\}/);
  assert.match(loginForm, /className="login-password-toggle"/);
  assert.match(loginForm, /type="button"/);
  assert.match(loginForm, /aria-controls="handoff-password"/);
  assert.match(loginForm, /"Hide password" : "Show password"/);
  assert.match(loginForm, /\{passwordVisible \? "Hide" : "Show"\}/);
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
