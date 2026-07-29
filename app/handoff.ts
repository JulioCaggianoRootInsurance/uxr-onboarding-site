import "server-only";

export type HandoffStatus =
  | "Delivered"
  | "Prototype"
  | "In progress"
  | "Recommendation"
  | "TBD";

export type ResourceLink = {
  label: string;
  description: string;
  href: string;
};

export type CustomerQuoteEntry = {
  quote: string;
  theme: string;
  source: string;
  period: string;
  context?: string;
};

export type VideoClip = {
  label: string;
  driveId: string;
};

export type VideoCollection = {
  participant: string;
  period: string;
  theme: string;
  summary: string;
  fullSessionHref: string;
  clips: VideoClip[];
};

export type StatusItem = {
  status: HandoffStatus;
  title: string;
  text: string;
};

export type CommandItem = {
  command: string;
  label: string;
  description: string;
};

export type PipelineItem = {
  label: string;
  detail: string;
};

export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "subheading"; text: string }
  | { kind: "quote"; label: string; text: string }
  | { kind: "callout"; status: HandoffStatus; title: string; text: string }
  | { kind: "links"; items: ResourceLink[] }
  | { kind: "quoteGrid"; items: CustomerQuoteEntry[] }
  | { kind: "videoLibrary"; collections: VideoCollection[] }
  | { kind: "statusGrid"; items: StatusItem[] }
  | { kind: "commands"; items: CommandItem[] }
  | { kind: "pipeline"; items: PipelineItem[] };

export type HandoffGroup =
  | "Deliverables"
  | "Research practice"
  | "Continuation";

export type HandoffSection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
};

export type HandoffPage = {
  slug: string;
  group: HandoffGroup;
  order: number;
  title: string;
  summary: string;
  status: HandoffStatus;
  updated: string;
  sections: HandoffSection[];
};

export const siteUpdated = "Last Updated: Jul 27, 2026";

const q1CustomerRecordings: VideoCollection[] = [
  {
    participant: "Participant 1",
    period: "Q1 2026",
    theme: "Telematics trust",
    summary:
      "Seven reels explore test-drive skepticism, price expectations, and the clarity customers need before trusting telematics.",
    fullSessionHref: "https://lookback.io/play/qpzK47AyZGPfTzDE7",
    clips: [
      { label: "Clip 01", driveId: "1zX5uhypEBVEzfPXiRcfPjVcfGoE0y-93" },
      { label: "Clip 02", driveId: "1-a5Yzuevq_fig2Jg81vHWigUK8-uVpkc" },
      { label: "Clip 03", driveId: "16peTyTmEd3ZNQ3t6JoSZD5yT18cqz7d9" },
      { label: "Clip 05", driveId: "1MSA0fe6kCrhkXYaAAPLuOyl84NAeJ2OS" },
      { label: "Clip 06", driveId: "1EU86VViVlQVXsasesSNoghuE4TXLFvx7" },
      { label: "Clip 07", driveId: "1go8uHXsrOX5k_BjxiEKxiaZIY-Tkr2ud" },
      { label: "Clip 08", driveId: "175VYmVU_6WBnxi8f-4zPGulGR9P7pJYb" },
    ],
  },
  {
    participant: "Participant 2",
    period: "Q1 2026",
    theme: "Service access",
    summary:
      "Eleven reels cover everyday driving decisions, chatbot limitations, support expectations, and the value of speaking with a person.",
    fullSessionHref: "https://lookback.io/play/PAg8bd26jergevcv5",
    clips: [
      { label: "Clip 01", driveId: "10Ht7ZTTJWLhYcXUZhrQfXa7PdFbbhHZM" },
      { label: "Clip 02", driveId: "1mE91Z4N1_wZ1vifBWeGBfB4b-ku3WhnY" },
      { label: "Clip 03", driveId: "1UCtxvxXj81xo9y9nFJMKezdrZ6KLAd7x" },
      { label: "Clip 04", driveId: "1hmhhFrfCXFwbW6NWDKh4hpAYReUe7auP" },
      { label: "Clip 05", driveId: "1L9PIFvx9I7MlCcgn2EOBuu1p8WaHRT92" },
      { label: "Clip 06", driveId: "14S68a8r-sePz-DfUz2GUzZKAndCv7mn-" },
      { label: "Clip 07", driveId: "1zszB3xOuZbnO0czEmtV62PoW6EA1cBrj" },
      { label: "Clip 08", driveId: "1GqhCQsWZ7Bv1IcRvs-UTiZTRF5UUI-_J" },
      { label: "Clip 09", driveId: "1WLgW9Mr-n-NuJvMzYRzYe0ZExQkIyxVY" },
      { label: "Clip 10", driveId: "1QQkGfzVxB1tuJiLpDAF0_210XoZDAM0a" },
      { label: "Clip 11", driveId: "1Qkp1MLWJ1rWzsgqu4TV0nGZH2X7SNmoi" },
    ],
  },
  {
    participant: "Participant 3",
    period: "Q1 2026",
    theme: "Trust and reassurance",
    summary:
      "Three reels capture app-monitoring concerns and the proactive, human guidance that would make an insurer feel caring.",
    fullSessionHref: "https://lookback.io/play/hbdMNbJCUJm3LMxhH",
    clips: [
      { label: "Clip 01", driveId: "1NznGvh0BHvIP_vvwHT9beayAhIbdv6ZK" },
      { label: "Clip 02", driveId: "1wYsm3iAAL0Fz1J3O1ahHS5GOMp-w8Ir5" },
      { label: "Clip 03", driveId: "1mQQmWUzw4wainZ4P2-NrJKuXnHOejvqi" },
    ],
  },
];

export const handoffPages: HandoffPage[] = [
  {
    slug: "q1-voc-report",
    group: "Deliverables",
    order: 1,
    title: "Q1 Voice of Customer report",
    summary:
      "The completed Q1 reporting redesign that turned a broad storytelling brief into an editable Figma presentation and reusable reporting framework.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "the-brief",
        title: "The brief",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Latest presentation complete",
            text: "The current Q1 VOC presentation is complete in Figma. This page records the work behind that artifact; the separate Q2 report remains in progress.",
          },
          {
            kind: "paragraph",
            text: "My primary internship mandate was to enhance storytelling for Voice of the Customer and the Quarterly Customer Report. I reviewed the existing Q1 approach, documented its communication gaps, and translated the critique into an editable redesign direction.",
          },
          {
            kind: "list",
            items: [
              "Problem: Important findings competed for attention instead of forming one narrative.",
              "Audience need: Product and leadership stakeholders needed a faster path from evidence to the “so what.”",
              "My role: Audit the existing report, develop reporting standards, and prototype a clearer storytelling direction.",
            ],
          },
        ],
      },
      {
        id: "audit-findings",
        title: "What I found",
        blocks: [
          {
            kind: "list",
            items: [
              "Storytelling hierarchy: Slides carried several disconnected messages, while critical findings did not consistently receive the strongest visual emphasis.",
              "Generalizability: Small qualitative samples sometimes appeared to carry the same explanatory weight as broader survey or review data.",
              "Data visualization: Some charts lacked descriptive questions, axis labels, response-scale definitions, or clear sample context.",
              "Actionability: Findings described customer sentiment but did not always connect the evidence to a prioritized problem or decision.",
            ],
          },
          {
            kind: "quote",
            label: "Working principle",
            text: "Quantitative evidence establishes what is happening. Qualitative evidence explains why it happens and how it feels.",
          },
        ],
      },
      {
        id: "reporting-framework",
        title: "The reporting framework",
        blocks: [
          {
            kind: "list",
            items: [
              "Use NPS as a narrative spine where it fits, without treating it as the complete customer story.",
              "Take a defensible stance instead of relying on passive or overly cautious language.",
              "Separate the quantitative “what” from the qualitative “why.”",
              "Use one primary message, one chart, and no more than three supporting points per slide.",
              "Label questions, scales, sources, sample bases, dates, and limitations consistently.",
              "Pair metrics with customer language while preserving conflicting evidence.",
              "Show trends and useful benchmarks, then connect findings to current or future roadmap decisions.",
              "Begin sections with a concise TL;DR so leadership can find the core implication quickly.",
            ],
          },
          {
            kind: "pipeline",
            items: [
              { label: "Signal", detail: "Metric, trend, or recurring pattern" },
              { label: "Mechanism", detail: "Customer evidence explains why" },
              { label: "Stance", detail: "A clear, bounded interpretation" },
              { label: "Decision", detail: "Owner, action, or question" },
            ],
          },
        ],
      },
      {
        id: "artifacts",
        title: "Artifacts and value",
        blocks: [
          {
            kind: "paragraph",
            text: "The result was more than a text critique: it created an editable design direction and a reusable set of standards for future VOC report reviews.",
          },
          {
            kind: "links",
            items: [
              {
                label: "Q1 VOC presentation prototype",
                description: "Interactive Figma prototype referenced by the project record.",
                href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=311%3A2741&node-id=1200-2707&viewport=-1835%2C243%2C0.49&t=6A7bVxpvy0kxtf1x-1&scaling=scale-down&content-scaling=fixed",
              },
              {
                label: "Q1 VOC editable Figma file",
                description: "Design source for continuing the reporting direction.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=311-2741&t=RN5pZmfOi8ZJ1s2r-1",
              },
              {
                label: "Q1 VOC report · V7 PDF",
                description: "Latest completed report export located in Google Drive.",
                href: "https://drive.google.com/file/d/1EoVJcaMvR5RmDN-6xGxzY0ljRDiurFCQ/view",
              },
              {
                label: "Intern Project Scope Document",
                description: "Authoritative source record for this handoff.",
                href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit",
              },
            ],
          },
        ],
      },
      {
        id: "continuation",
        title: "What should happen next",
        blocks: [
          {
            kind: "callout",
            status: "Recommendation",
            title: "Turn the framework into team infrastructure",
            text: "Convert the principles into an approved QCR template and review checklist, then record which recommendations are adopted and which decisions they influence.",
          },
          {
            kind: "list",
            items: [
              "Confirm the canonical template and its long-term owner.",
              "Create a lightweight review gate for sources, sample bases, claims, and customer evidence.",
              "Carry the accepted Q1 reporting rules into the in-progress Q2 report without assuming every Q1 pattern still applies.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "q2-voc-report",
    group: "Deliverables",
    order: 2,
    title: "Q2 Voice of Customer report",
    summary:
      "The in-progress quarterly report that applies the Q1 storytelling system to the next round of customer evidence.",
    status: "In progress",
    updated: siteUpdated,
    sections: [
      {
        id: "current-state",
        title: "Current state",
        blocks: [
          {
            kind: "callout",
            status: "In progress",
            title: "Draft structure established",
            text: "The report has a documented outline and source inventory, while several findings and recommendations remain intentionally marked for completion and review.",
          },
          {
            kind: "paragraph",
            text: "The Q2 report is the operational follow-through to the Q1 redesign. Its purpose is to turn the next quarter’s mixed research inputs into a concise story that distinguishes what the evidence establishes, why the pattern may be happening, and what Root should validate or decide next.",
          },
        ],
      },
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "Executive summary: The most decision-relevant findings, limitations, and next questions.",
              "Methodology and sources: A transparent record of data periods, samples, source types, and analytical boundaries.",
              "Key findings: Quantitative patterns separated from the qualitative mechanisms that help explain them.",
              "Product recommendations: Bounded opportunities connected to evidence, owners, and validation needs.",
              "Appendix: Supporting tables, definitions, source detail, and material that should remain available without crowding the main narrative.",
            ],
          },
        ],
      },
      {
        id: "evidence-inputs",
        title: "Evidence inputs",
        blocks: [
          {
            kind: "paragraph",
            text: "The working record identifies benchmark studies, app-store reviews, three qualitative customer interviews, and potential in-product Sprig feedback as inputs. Every source has a different evidentiary role and should not be presented with equal generalizability.",
          },
          {
            kind: "pipeline",
            items: [
              { label: "Inventory", detail: "Confirm period, sample, question, and source owner" },
              { label: "Validate", detail: "Check quality, exclusions, missingness, and limitations" },
              { label: "Synthesize", detail: "Separate broad patterns from explanatory evidence" },
              { label: "Narrate", detail: "Build one defensible through-line" },
              { label: "Review", detail: "Challenge claims before the report is final" },
            ],
          },
        ],
      },
      {
        id: "my-contribution",
        title: "My contribution",
        blocks: [
          {
            kind: "list",
            items: [
              "Carried the Q1 reporting principles into the Q2 outline.",
              "Reviewed prior-quarter evidence and documented the sources needed for the next synthesis.",
              "Established a clearer separation between findings, explanatory customer evidence, and future research questions.",
              "Created a reusable visual and narrative system through the presentation-template work.",
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "Q2 report working record",
                description: "The Q2 draft tab in the Internship Project Scope Document.",
                href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.x2nebw360ab0",
              },
              {
                label: "Q1 reporting system",
                description: "The completed predecessor and design framework.",
                href: "/q1-voc-report",
              },
            ],
          },
        ],
      },
      {
        id: "definition-of-done",
        title: "Definition of done",
        blocks: [
          {
            kind: "list",
            items: [
              "All included metrics have a confirmed definition, period, sample base, source, and limitation.",
              "Every headline claim is traceable to evidence and has survived a second-person review.",
              "Quotes and clips have approved use, exact provenance, and a clear explanatory role.",
              "Recommendations distinguish observed evidence from proposed product action.",
              "The approved final deck and editable source are stored at canonical links with an owner.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "customer-quote-library",
    group: "Deliverables",
    order: 4,
    title: "Customer quote and clip library",
    summary:
      "A completed, organized evidence layer that makes customer quotes, recordings, and source context easier to find and reuse responsibly.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "purpose",
        title: "Purpose and contribution",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Library delivered",
            text: "The source inventory and 21 access-controlled Q1 recording embeds are organized and available. Ongoing governance remains an operating responsibility, not an unfinished library feature.",
          },
          {
            kind: "paragraph",
            text: "I organized customer evidence so future reporting could connect quantitative patterns to direct customer language without losing provenance. The library spans interviews, reports, surveys, Sprig feedback, customer-choice research, and billing or retention work.",
          },
          {
            kind: "list",
            items: [
              "Q1 customer interviews and the Q1 VOC report.",
              "Q2 rebrand interviews.",
              "In-product Sprig feedback.",
              "Customer survey and Customer Choice research.",
              "Billing, payments, and retention research.",
            ],
          },
        ],
      },
      {
        id: "recordings",
        title: "Q1 customer recordings",
        blocks: [
          {
            kind: "paragraph",
            text: "These reels play from Google Drive and inherit the original Drive permissions. The library confirms that I organized and surfaced the clips; it does not claim that I personally edited every reel. Before reuse, verify the participant, clip number, timestamp, consent, and approved audience.",
          },
          {
            kind: "videoLibrary",
            collections: q1CustomerRecordings,
          },
        ],
      },
      {
        id: "representative-evidence",
        title: "Representative evidence",
        blocks: [
          {
            kind: "quoteGrid",
            items: [
              {
                quote:
                  "What I heard is that some apps monitor your driving, and they just find ways to make your rate go up.",
                theme: "Telematics trust",
                source: "VOC interview · Participant 3",
                period: "Q1 2026",
                context:
                  "Explains resistance to monitoring; not a prevalence estimate.",
              },
              {
                quote:
                  "I feel appreciated when I can contact a human being quickly.",
                theme: "Human support",
                source: "VOC interview · Participant 3",
                period: "Q1 2026",
                context:
                  "Illustrates how service access can communicate care.",
              },
              {
                quote:
                  "If I had been able to manage the payment by maybe paying it twice a month, I think I probably still would be with Root right now.",
                theme: "Payment flexibility",
                source: "Billing and Payments Vision Research",
                period: "Q3 2025",
                context:
                  "A retention mechanism from one participant; connect to broader evidence before generalizing.",
              },
            ],
          },
        ],
      },
      {
        id: "governance",
        title: "Governance still required",
        blocks: [
          {
            kind: "callout",
            status: "In progress",
            title: "A useful library also needs rules",
            text: "Playback access is only one layer. Every entry should carry its source, allowed use, evidence role, limitation, and reviewer.",
          },
          {
            kind: "list",
            items: [
              "Confirm consent and approved use for every quote and recording.",
              "Preserve exact source locators, timestamps, study dates, and deidentified context.",
              "Record the connected quantitative pattern, evidence role, limitation, reviewer, and review date.",
              "Assign a long-term owner and one canonical repository.",
              "Treat memorable quotes as illustrations of verified findings, not estimates of prevalence.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "voc-dashboard",
    group: "Deliverables",
    order: 3,
    title: "VOC customer dashboard",
    summary:
      "A nearly complete design prototype and an in-progress coded handoff for a living VOC website powered by a reviewed GitHub-to-Vercel workflow.",
    status: "In progress",
    updated: siteUpdated,
    sections: [
      {
        id: "current-direction",
        title: "Current direction",
        blocks: [
          {
            kind: "callout",
            status: "Prototype",
            title: "Prototype complete; code handoff in progress",
            text: "The dashboard experience is substantially designed and available as a Figma/Lovable prototype. The coded handoff, production data connection, access model, and repeatable update workflow are the active work.",
          },
          {
            kind: "paragraph",
            text: "I compared previous VOC documentation with the existing Mode experience to explore a faster, more visual, and more reusable way for product teams to inspect customer evidence between quarterly reports.",
          },
          {
            kind: "list",
            items: [
              "Designed a lightweight dashboard direction in Figma.",
              "Created a Lovable code preview to test the report as a website.",
              "Explored a reusable, non-variable slideshow system with responsive icons and an expanded photo library.",
              "Collected direction and feedback from Jill and Klew.",
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "Lovable dashboard code preview",
                description: "Existing prototype referenced in the IPSD.",
                href: "https://lovable.dev/preview/hctAFpNwDdfYpSylhmUcuxPkCUtYQdHE",
              },
              {
                label: "Dashboard Figma source",
                description: "Latest high-fidelity design source located in the shared VOC workspace.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=1563-2647&t=EIOlHXMAH4ey7MR5-1",
              },
              {
                label: "Dashboard prototype · PDF",
                description: "High-fidelity dashboard artifact in Google Drive.",
                href: "https://drive.google.com/file/d/1h_J_vqX8rwL3Nt3TZzDC-a8L9bmTzTDe/view",
              },
              {
                label: "Dashboard code handoff",
                description: "Current React/Vite implementation notes, QA status, and remaining work.",
                href: "https://drive.google.com/file/d/1ybcIiBDlDmvNmnbr0hoJyQSgG8ZSgzBs/view",
              },
              {
                label: "Dashboard project record",
                description: "The VOC Dashboard tab in the internship scope document.",
                href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.eh4wx17fdlej",
              },
            ],
          },
        ],
      },
      {
        id: "deployment-model",
        title: "How the website deployment should work",
        blocks: [
          {
            kind: "callout",
            status: "Recommendation",
            title: "GitHub should become the source of truth",
            text: "The working website should be stored in a GitHub repository connected to Vercel. Code changes create reviewable versions, and approved changes to the production branch trigger deployment.",
          },
          {
            kind: "pipeline",
            items: [
              { label: "Local + Codex", detail: "Draft and validate the change" },
              { label: "Git branch", detail: "Create an isolated checkpoint" },
              { label: "GitHub", detail: "Push and open a pull request" },
              { label: "Vercel preview", detail: "Review a live private URL" },
              { label: "Human approval", detail: "Verify content, data, and access" },
              { label: "Merge to main", detail: "Approve the source change" },
              { label: "Vercel production", detail: "Deploy automatically" },
            ],
          },
          {
            kind: "paragraph",
            text: "The repository records what changed, who changed it, and which version is live. Vercel watches the connected repository: branches and pull requests can produce preview deployments, while the configured production branch—usually main—publishes the approved site.",
          },
        ],
      },
      {
        id: "git-essentials",
        title: "Git and origin essentials",
        blocks: [
          {
            kind: "paragraph",
            text: "Origin is the conventional name for the remote GitHub repository connected to a local project. Local files are only a working copy; commits create durable checkpoints, and synchronization keeps that copy aligned with the shared repository.",
          },
          {
            kind: "commands",
            items: [
              {
                command: "git remote -v",
                label: "Confirm origin",
                description:
                  "Shows which GitHub repository receives fetches and pushes.",
              },
              {
                command: "git fetch origin",
                label: "Inspect remote updates",
                description:
                  "Downloads new remote history without changing the local working files.",
              },
              {
                command: "git pull origin main",
                label: "Integrate approved updates",
                description:
                  "Fetches and combines the current production branch. Commit or safely set aside local work first.",
              },
              {
                command: "git add <reviewed-files>",
                label: "Stage intentionally",
                description:
                  "Selects only the reviewed files for the next checkpoint; avoid staging secrets or unrelated work.",
              },
              {
                command: "git diff --staged",
                label: "Review before committing",
                description:
                  "Shows exactly what the checkpoint will contain.",
              },
              {
                command: 'git commit -m "Describe the dashboard update"',
                label: "Create a checkpoint",
                description:
                  "Records an intentional local version with a readable explanation.",
              },
              {
                command: "git push origin <branch-name>",
                label: "Submit to GitHub",
                description:
                  "Uploads the branch so it can be reviewed and deployed as a preview.",
              },
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "Getting changes from GitHub",
                description: "Official explanation of clone, fetch, merge, and pull.",
                href: "https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository",
              },
              {
                label: "Pushing commits to GitHub",
                description: "Official guide to sending local commits to a remote.",
                href: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository",
              },
            ],
          },
        ],
      },
      {
        id: "github-vercel",
        title: "GitHub to Vercel automation",
        blocks: [
          {
            kind: "steps",
            items: [
              "Create or confirm the GitHub repository and make main the protected production branch.",
              "Import that repository into Vercel and keep the framework preset on Next.js.",
              "Add the required authentication settings to Vercel as protected environment variables.",
              "Push work to a separate branch so Vercel creates a private preview deployment.",
              "Review the preview with research, design, data, and access-control checks.",
              "Merge the approved pull request into main; Vercel then builds the production deployment automatically.",
              "If a deployment fails, use Vercel’s build log to diagnose it. If an approved release causes a problem, revert the Git commit or roll back the deployment.",
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "Deploying Git repositories with Vercel",
                description: "Official production and preview branch workflow.",
                href: "https://vercel.com/docs/git",
              },
              {
                label: "Vercel for GitHub",
                description: "Automatic deployments, previews, and production-domain updates.",
                href: "https://vercel.com/docs/git/vercel-for-github",
              },
            ],
          },
        ],
      },
      {
        id: "ai-assisted-updates",
        title: "Future AI-assisted update flow",
        blocks: [
          {
            kind: "callout",
            status: "Recommendation",
            title: "Automate proposals—not unchecked production changes",
            text: "ChatGPT or Codex can help update code and content, but a researcher should verify every number, claim, quote, permission, and visual before merge.",
          },
          {
            kind: "steps",
            items: [
              "A researcher selects the new reporting period and provides approved, deidentified source material.",
              "ChatGPT or Codex proposes content, data, and code changes on a separate Git branch.",
              "Automated checks flag missing sample bases, citations, quote permissions, placeholder data, broken links, or failed builds.",
              "A human researcher reviews the code difference and the Vercel preview.",
              "After approval, the branch is merged into GitHub and Vercel deploys the accepted version.",
            ],
          },
          {
            kind: "subheading",
            text: "Possible one-click experience",
          },
          {
            kind: "paragraph",
            text: "A future “Update dashboard” button could collect a reporting period, approved files, and a change note, then ask a secured GitHub integration to create a branch and pull request. The button should stop at a reviewable preview; it should not overwrite production directly.",
          },
          {
            kind: "list",
            items: [
              "Required controls: Root authentication, least-privilege GitHub credentials, approved-source validation, audit logs, and a mandatory reviewer.",
              "What remains future work: The repository connection, automated checks, GitHub integration, one-click interface, and live data-refresh process.",
              "Definition of done: A repeatable update can move from approved evidence to private preview to reviewed production without copying files manually.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "nps-executive-report",
    group: "Deliverables",
    order: 5,
    title: "NPS executive report",
    summary:
      "The completed Q1 2026 executive readout delivered to Jill, separating customer experience from broader market perception.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "delivered-artifact",
        title: "Delivered artifact",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Executive report delivered",
            text: "The Q1 2026 NPS executive report is available as a completed PDF and was delivered to Jill. The working design lives in the VOC Figma workspace.",
          },
          {
            kind: "paragraph",
            text: "I built the report to answer a narrower executive question than the broader quarterly VOC report: what NPS reveals about Root’s current customers, former customers, and people who have not purchased Root—and which follow-up questions the existing evidence cannot yet answer.",
          },
        ],
      },
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "An executive summary that states the principal interpretation and the research questions it creates.",
              "Separate views of aggregate, current-customer, former-customer, and non-customer NPS.",
              "A directional review of promoter and detractor themes.",
              "Methodology and sampling notes for the DTC benchmark and Marketing Brand Tracker inputs.",
              "A next-step plan focused on explaining non-customer sentiment and strengthening future NPS data collection.",
              "An appendix with carrier comparisons, segment distributions, and supporting tables.",
            ],
          },
        ],
      },
      {
        id: "research-process",
        title: "Research process",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Segment", detail: "Separate current, former, and non-customers" },
              { label: "Compare", detail: "Review carrier-level patterns across sources" },
              { label: "Qualify", detail: "Surface small samples and source limitations" },
              { label: "Interpret", detail: "Distinguish experience from reputation" },
              { label: "Recommend", detail: "Name the next research question" },
            ],
          },
          {
            kind: "paragraph",
            text: "The central analytical safeguard was to avoid reading aggregate NPS as customer-only experience. The report keeps segment results separate, labels small Root samples, and treats open-ended themes as directional where the available response base is limited.",
          },
        ],
      },
      {
        id: "my-contribution",
        title: "My contribution",
        blocks: [
          {
            kind: "list",
            items: [
              "Structured the executive narrative around a clear decision and follow-up question.",
              "Combined and reconciled the benchmark and brand-tracker perspectives.",
              "Created the information hierarchy, charts, annotations, disclaimers, and appendix structure.",
              "Translated analytical limitations into visible reading guidance rather than hiding them in footnotes.",
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "NPS executive report · PDF",
                description: "Completed Q1 2026 executive report in Google Drive.",
                href: "https://drive.google.com/file/d/1NCnSRL9ncpFiGmOJthbPzuqRwW8x1CIY/view",
              },
              {
                label: "VOC Figma workspace",
                description: "Editable design workspace containing the report work.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=311-2741&t=RN5pZmfOi8ZJ1s2r-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "uxr-onboarding-documentation",
    group: "Deliverables",
    order: 6,
    title: "UXR onboarding documentation",
    summary:
      "An in-progress onboarding playbook co-developed with Layilah Campbell to help future researchers understand Root, the team, and its operating practices.",
    status: "In progress",
    updated: siteUpdated,
    sections: [
      {
        id: "purpose",
        title: "Purpose",
        blocks: [
          {
            kind: "callout",
            status: "In progress",
            title: "A living team playbook",
            text: "The source document and prototype content exist. Team review, durable ownership, and validation with a future new hire are the remaining steps before it should be treated as the canonical onboarding system.",
          },
          {
            kind: "paragraph",
            text: "Layilah Campbell and I developed this documentation to reduce the amount of critical research context that new hires must reconstruct through scattered conversations, Slack history, and repository searches.",
          },
        ],
      },
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "Root and auto-insurance context for researchers who are new to the domain.",
              "Key research partners, team connections, and communication channels.",
              "Standard operating procedures for intake, planning, evidence handling, analysis, review, and handoff.",
              "The Voice of the Customer program, its source types, and the way quarterly evidence is processed.",
              "A worked NPS example that keeps small samples and generalizability visible.",
              "The customer quote library, retention context, Slack directories, and knowledge repositories.",
              "A governed workflow for applying the AI research skills to a new dataset.",
            ],
          },
        ],
      },
      {
        id: "my-contribution",
        title: "My contribution",
        blocks: [
          {
            kind: "list",
            items: [
              "Helped define the content architecture and chapter sequence.",
              "Documented the VOC processing workflow, evidence-story model, and technical QA expectations.",
              "Connected the customer-evidence library and AI-assisted research guidance to the onboarding journey.",
              "Translated the documentation into a reviewable website prototype before the internship handoff changed focus.",
            ],
          },
        ],
      },
      {
        id: "how-it-was-built",
        title: "How it was built",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Collect", detail: "Gather existing SOPs, links, and team context" },
              { label: "Reconcile", detail: "Resolve conflicting or incomplete guidance" },
              { label: "Structure", detail: "Move from first-day context to advanced practice" },
              { label: "Prototype", detail: "Make the material scannable and navigable" },
              { label: "Validate", detail: "Assign owners and test with a new hire" },
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "UXR onboarding source document",
                description: "The living Google Doc co-developed by the UXR interns.",
                href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
              },
              {
                label: "Internship documentation record",
                description: "The onboarding deliverable tab in the IPSD.",
                href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.z582zky508qm",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "presentation-template-system",
    group: "Deliverables",
    order: 7,
    title: "VOC presentation template system",
    summary:
      "A completed reusable presentation system with expanded components, data-story layouts, and a Root-aligned photography direction.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "delivered-system",
        title: "Delivered system",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Presentation system complete",
            text: "The reusable design system, presentation template, and team-ready handoff are complete. The source artifacts are linked below for continued use.",
          },
          {
            kind: "paragraph",
            text: "I expanded the reporting direction into a practical system rather than a single polished deck. The templates create repeatable structures for executive summaries, key findings, charts, customer evidence, section breaks, and appendices.",
          },
        ],
      },
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "Reusable components and page archetypes for Figma.",
              "Executive-summary, key-finding, data-analysis, customer-quote, video, and appendix layouts.",
              "Chart patterns with places for research questions, sample bases, sources, scales, and limitations.",
              "A broader Root-aligned photography identity and image treatment for research storytelling.",
              "A team-owned Figma template and presentation export for repeatable editing and broader access.",
              "Guidance that favors one primary message, concise supporting text, and visible methodological context.",
            ],
          },
        ],
      },
      {
        id: "design-process",
        title: "Design process",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Audit", detail: "Review brand materials and existing report patterns" },
              { label: "Define", detail: "Set hierarchy, chart, quote, and evidence rules" },
              { label: "Componentize", detail: "Build reusable Figma structures" },
              { label: "Package", detail: "Create team-owned Figma and Drive versions" },
              { label: "Test", detail: "Use the components in real report work" },
            ],
          },
        ],
      },
      {
        id: "artifacts",
        title: "Artifacts",
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: "VOC presentation template · Google Drive",
                description: "The completed July 28 presentation-system export.",
                href: "https://drive.google.com/file/d/1OshHDffRLd2498_qE3Nqkty_gHhTy6So/view",
              },
              {
                label: "New Brand Figma Slides Template",
                description: "Team-owned copy in UX Team → Processes and Templates.",
                href: "https://www.figma.com/design/liCQw8Mv0VVnPMLacbEixP/New-Brand-Figma-Slides-Template?node-id=59-2027&t=jLp3wOviYd34ZBgn-1",
              },
              {
                label: "VOC Figma design system",
                description: "Julio’s original editable component system and report workspace.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=59-2027&t=iyC0FSCAptPUCIpU-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-research-skills",
    group: "Deliverables",
    order: 8,
    title: "AI research skills",
    summary:
      "Reusable AI workflows for standardized research-data processing, cross-source synthesis, and Root’s new brand voice.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "skill-set",
        title: "The skill set",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Three complementary roles",
            text: "The workflow separates evidence processing, research synthesis, and brand-voice editing so a polished tone cannot silently change the underlying analysis.",
          },
          {
            kind: "statusGrid",
            items: [
              {
                status: "Delivered",
                title: "research-viz",
                text: "Profiles standardized quantitative data, establishes metric contracts, checks quality, and proposes evidence-faithful visualizations.",
              },
              {
                status: "Delivered",
                title: "research-synthesis",
                text: "Connects claims across approved sources while retaining locators, confidence, limitations, and disconfirming evidence.",
              },
              {
                status: "Delivered",
                title: "root-brand-voice",
                text: "Rewrites stable, reviewed findings in Root’s new brand voice without changing numbers, evidence boundaries, or research meaning.",
              },
            ],
          },
        ],
      },
      {
        id: "how-they-work-together",
        title: "How they work together",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "research-viz", detail: "Inspect and express the evidence" },
              { label: "research-synthesis", detail: "Assemble supported findings" },
              { label: "Human review", detail: "Challenge claims and edge cases" },
              { label: "root-brand-voice", detail: "Refine approved communication" },
            ],
          },
          {
            kind: "quote",
            label: "Operating rule",
            text: "Voice should never outrun validity.",
          },
        ],
      },
      {
        id: "data-processing-workflow",
        title: "Data-processing workflow",
        blocks: [
          {
            kind: "steps",
            items: [
              "Frame the stakeholder decision, target population, and required evidence.",
              "Use only a Root-approved environment and provide the minimum necessary data.",
              "Profile fields, identifiers, missingness, duplicates, bases, and quality flags.",
              "Lock the metric definition, denominator, filters, segment rules, and rounding.",
              "Use AI to propose code or coding—not to replace evidence review.",
              "Review low-confidence cases, disagreements, and disconfirming evidence.",
              "Preserve reproducible transformations and a claim-to-source evidence matrix.",
              "Apply the brand-voice skill only after the claims are stable.",
            ],
          },
        ],
      },
      {
        id: "artifacts-and-boundary",
        title: "Artifacts and handoff boundary",
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: "Packaged AI Skills folder",
                description: "Research visualization, research synthesis, and Root brand-voice skill packages.",
                href: "https://drive.google.com/drive/folders/1mz6GdtOxh3LmALf4T3-jPHBmhvG1aTcZ",
              },
              {
                label: "AI-assisted research playbook",
                description: "Exported workflow covering skill order, a new-dataset process, and the data-handling gate.",
                href: "https://drive.google.com/file/d/1mPK7svpy8ShLSMtdH7qjapY_136u30Xy/view",
              },
              {
                label: "UXR onboarding document",
                description: "The team-facing context for using Julio’s AI skills on a new dataset.",
                href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
              },
            ],
          },
          {
            kind: "callout",
            status: "Recommendation",
            title: "Confirm the canonical packages",
            text: "Before the internship ends, record the approved installation location, owner, version, example input, expected output, and update process for each skill package.",
          },
        ],
      },
    ],
  },
  {
    slug: "research-process",
    group: "Research practice",
    order: 9,
    title: "Research process",
    summary:
      "The repeatable path I used to turn an open brief, mixed research evidence, and stakeholder feedback into reviewable deliverables.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "inputs-and-collaboration",
        title: "Inputs and collaboration",
        blocks: [
          {
            kind: "list",
            items: [
              "June 3 and June 12, 2026: project direction and reporting questions involving Anna Nguyen.",
              "June 9, 2026: input involving Julie Harrison, Hala Daher, 10:10 Research, and Jill Kellett.",
              "June 24, 2026: dashboard, presentation-system, and research-role feedback from Klew Still.",
              "July 2, 2026: dashboard feedback documented from Jill Kellett.",
            ],
          },
        ],
      },
      {
        id: "how-inputs-shaped-work",
        title: "How the inputs shaped the work",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Listen", detail: "Collect expectations and constraints" },
              { label: "Compare", detail: "Audit reports, tools, and evidence" },
              { label: "Translate", detail: "Turn feedback into design criteria" },
              { label: "Prototype", detail: "Make the direction reviewable" },
              { label: "Record", detail: "Preserve decisions and open work" },
            ],
          },
          {
            kind: "list",
            items: [
              "Reporting direction: Feedback reinforced the need for clearer claims, stronger evidence hierarchy, and a direct path to decision relevance.",
              "Dashboard direction: Product teams—not only executives—were identified as the primary audience for self-service VOC context.",
              "Research boundary: The VOC team should define problems and their scale without presenting unsupported product solutions as research conclusions.",
              "Operating model: Vendor efficiency can support collection and initial analysis, while Root retains validation, business context, prioritization, and storytelling.",
            ],
          },
        ],
      },
      {
        id: "research-foundation",
        title: "Research foundation reviewed",
        blocks: [
          {
            kind: "paragraph",
            text: "The appendix records a broad review of VOC reports, survey plans and datasets, telematics research, customer segmentation, product and research repositories, business reporting, presentation templates, and stakeholder notes. This review created the context needed to critique the report and explore the dashboard responsibly.",
          },
          {
            kind: "list",
            items: [
              "VOC program strategy, survey catalog, quarterly report, and project brief.",
              "DTC and Independent Agent benchmarking materials.",
              "Qualitative interviews, Lookback recordings, and Sprig feedback.",
              "Telematics history, customer-choice testing, and product-domain research.",
              "Business context including CX metrics, retention questions, and company reporting.",
            ],
          },
        ],
      },
      {
        id: "attribution-boundary",
        title: "Attribution boundary",
        blocks: [
          {
            kind: "callout",
            status: "In progress",
            title: "Preserve shared ownership",
            text: "The record confirms that the conversations and notes informed my work. It does not by itself establish that I led every session or owned collaborators’ research, data, or decisions.",
          },
          {
            kind: "list",
            items: [
              "Confirm whether I led, co-led, attended, or synthesized each documented conversation.",
              "Link to canonical notes instead of reproducing sensitive discussion details.",
              "Attach accepted recommendations to a decision, owner, date, and outcome.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "standard-operating-procedures",
    group: "Research practice",
    order: 10,
    title: "Standard operating procedures",
    summary:
      "The working routines and quality gates I used for planning, evidence handling, analysis, review, communication, and technical handoff.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "operating-rhythm",
        title: "Operating rhythm",
        blocks: [
          {
            kind: "list",
            items: [
              "Start the week by confirming the decision, deliverable, dependencies, and definition of done.",
              "Use focused work blocks for deep analysis and design rather than fragmenting core synthesis across meetings.",
              "Share concise asynchronous progress updates so blockers and scope changes remain visible.",
              "Use scheduled critique or manager review to challenge the work before it becomes expensive to change.",
              "End the week by recording decisions, open questions, owners, links, and the next concrete step.",
            ],
          },
        ],
      },
      {
        id: "intake-and-planning",
        title: "Intake and planning",
        blocks: [
          {
            kind: "steps",
            items: [
              "Write the stakeholder decision the research or artifact must support.",
              "Define the target audience, research question, scope boundary, and delivery format.",
              "Inventory existing evidence before proposing new collection.",
              "Identify source owners, access constraints, review partners, and timing risks.",
              "Agree on what completion means and which claims require approval.",
            ],
          },
        ],
      },
      {
        id: "evidence-and-analysis",
        title: "Evidence and analysis",
        blocks: [
          {
            kind: "list",
            items: [
              "Provenance: Preserve source, period, population, question wording, sample, filters, and exact locator.",
              "Quantitative QA: Confirm units, denominators, exclusions, missing values, segment definitions, and rounding before charting.",
              "Qualitative QA: Retain transcript or clip locators, consent boundaries, existing codes, contrary evidence, and researcher review.",
              "Evidence hierarchy: Use broad quantitative sources to establish patterns and qualitative sources to explain mechanisms and lived experience.",
              "Claim discipline: Keep observations, interpretations, recommendations, and unresolved questions visibly distinct.",
            ],
          },
          {
            kind: "quote",
            label: "Review rule",
            text: "A memorable quote can make a verified pattern understandable; it cannot establish prevalence by itself.",
          },
        ],
      },
      {
        id: "review-and-publishing",
        title: "Review and publishing",
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Self-review", detail: "Check evidence, logic, language, and accessibility" },
              { label: "Peer review", detail: "Challenge claims and missing context" },
              { label: "Stakeholder review", detail: "Confirm decision relevance and ownership" },
              { label: "Artifact QA", detail: "Verify links, permissions, layouts, and data labels" },
              { label: "Handoff", detail: "Record status, owner, source, and next step" },
            ],
          },
          {
            kind: "list",
            items: [
              "Use a branch and preview for code changes; do not publish directly from an unreviewed AI session.",
              "Keep credentials, customer identifiers, unrestricted recordings, and private source data out of repositories and browser assets.",
              "Treat the editable source and approved final artifact as separate, canonical links.",
              "Record what changed after review so future researchers can distinguish accepted guidance from discarded exploration.",
            ],
          },
        ],
      },
      {
        id: "source-playbook",
        title: "Source playbook",
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: "UXR onboarding and SOP source",
                description: "The living onboarding document containing the broader team operating guidance.",
                href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
              },
              {
                label: "AI research workflow",
                description: "The governed data-processing and synthesis sequence.",
                href: "/ai-research-skills",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "internship-insights",
    group: "Research practice",
    order: 11,
    title: "Internship insights",
    summary:
      "The practical lessons that emerged across reporting, evidence systems, stakeholder collaboration, design, and code.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "research-is-a-system",
        title: "Research impact is a system",
        blocks: [
          {
            kind: "paragraph",
            text: "A strong finding is only one part of impact. The source must be findable, the claim must be reviewable, the story must be understandable, the decision must have an owner, and the artifact must be maintainable after its original author leaves.",
          },
          {
            kind: "pipeline",
            items: [
              { label: "Evidence", detail: "Reliable and traceable" },
              { label: "Meaning", detail: "Bounded interpretation" },
              { label: "Story", detail: "Clear to the intended audience" },
              { label: "Decision", detail: "Connected to an owner" },
              { label: "System", detail: "Reusable and maintainable" },
            ],
          },
        ],
      },
      {
        id: "clarity-and-rigor",
        title: "Clarity and rigor reinforce each other",
        blocks: [
          {
            kind: "list",
            items: [
              "Visible sample sizes, source labels, and limitations make a decisive story more credible—not less engaging.",
              "Separating the quantitative “what” from the qualitative “why” protects both forms of evidence.",
              "One primary message per view creates space for a stronger claim and clearer supporting context.",
              "A report should surface consequential friction even when the evidence is uncomfortable or incomplete.",
            ],
          },
        ],
      },
      {
        id: "prototypes-create-alignment",
        title: "Prototypes create alignment",
        blocks: [
          {
            kind: "paragraph",
            text: "The dashboard and presentation-system work showed that a tangible prototype can make an abstract reporting conversation concrete. Stakeholders can react to hierarchy, navigation, evidence density, and maintenance expectations before a team commits to production.",
          },
          {
            kind: "callout",
            status: "Recommendation",
            title: "Prototype the decision, not only the interface",
            text: "Every prototype review should ask what decision becomes easier, which source supports it, how often it changes, and who will maintain it.",
          },
        ],
      },
      {
        id: "ai-needs-boundaries",
        title: "AI is useful when its boundaries are explicit",
        blocks: [
          {
            kind: "list",
            items: [
              "AI can accelerate profiling, transformations, visual exploration, synthesis drafts, and code implementation.",
              "A researcher still owns data classification, metric definitions, sample judgments, claim strength, consent, and final approval.",
              "Branch-based previews and evidence matrices make AI-assisted work easier to inspect and reverse.",
              "Brand voice belongs at the end of the workflow, after the analysis has stabilized.",
            ],
          },
        ],
      },
      {
        id: "shared-ownership",
        title: "Shared ownership should remain visible",
        blocks: [
          {
            kind: "paragraph",
            text: "The internship work depended on managers, researchers, designers, vendors, data owners, and fellow interns. A credible handoff names my contribution without absorbing collaborators’ research, decisions, or artifacts into an individual claim of ownership.",
          },
        ],
      },
    ],
  },
  {
    slug: "internship-reflection",
    group: "Research practice",
    order: 12,
    title: "Internship reflection",
    summary:
      "What the work taught me about turning research evidence into clear stories, reusable systems, and responsible handoffs.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "from-report-to-system",
        title: "From a report to a system",
        blocks: [
          {
            kind: "paragraph",
            text: "The work began as a request to improve a quarterly report and expanded into reusable storytelling guidance, an evidence inventory, a dashboard prototype, and this handoff. That progression taught me that research impact depends not only on finding something important, but also on whether others can locate, understand, review, and reuse the evidence.",
          },
        ],
      },
      {
        id: "skills-developed",
        title: "Skills developed",
        blocks: [
          {
            kind: "list",
            items: [
              "Qualitative synthesis: Connecting customer language to broader patterns without treating a small sample as prevalence.",
              "Strategic storytelling: Moving from descriptive findings to bounded, decision-relevant narratives.",
              "Data communication: Clarifying questions, scales, labels, sample bases, and visual hierarchy.",
              "Stakeholder influence: Turning feedback into explicit reporting and dashboard criteria.",
              "Technical prototyping: Using Figma, Lovable, HTML/CSS, and AI-assisted coding to make research systems tangible.",
              "Handoff discipline: Separating delivered artifacts, prototypes, open work, and recommendations.",
            ],
          },
        ],
      },
      {
        id: "evidence-discipline",
        title: "Evidence discipline",
        blocks: [
          {
            kind: "quote",
            label: "Research standard",
            text: "A decisive story becomes credible when its sources, sample, limitations, conflicting evidence, and owner remain visible.",
          },
          {
            kind: "list",
            items: [
              "Quantitative evidence should establish what is happening.",
              "Qualitative evidence should explain why it happens and how it feels.",
              "Quotes and clips make verified patterns understandable; they do not establish prevalence alone.",
              "Clear metadata and access rules make evidence reusable beyond one presentation.",
            ],
          },
        ],
      },
      {
        id: "what-i-would-strengthen",
        title: "What I would strengthen next",
        blocks: [
          {
            kind: "list",
            items: [
              "Establish ownership and completion criteria at the beginning of each deliverable.",
              "Connect accepted insights to decisions and follow-up measures.",
              "Validate production data and metric definitions before moving a dashboard beyond prototype status.",
              "Build governance into the evidence library rather than adding it after collection.",
              "Use branches, previews, and review gates so AI-assisted changes remain auditable.",
            ],
          },
          {
            kind: "callout",
            status: "TBD",
            title: "Impact still to verify",
            text: "Formal adoption, time saved, continued usage, and product or roadmap decisions influenced by the work are not yet established in the source record.",
          },
        ],
      },
    ],
  },
  {
    slug: "handoff-next-steps",
    group: "Continuation",
    order: 13,
    title: "Handoff and next steps",
    summary:
      "A clear inventory of what exists, what remains unfinished, and what the next owner should decide.",
    status: "In progress",
    updated: siteUpdated,
    sections: [
      {
        id: "status-inventory",
        title: "Artifact status",
        blocks: [
          {
            kind: "statusGrid",
            items: [
              {
                status: "Delivered",
                title: "Q1 VOC report",
                text: "Completed Figma presentation, V7 export, and reusable reporting principles.",
              },
              {
                status: "In progress",
                title: "Q2 VOC report",
                text: "Working structure and source inventory established; findings and final review remain open.",
              },
              {
                status: "Prototype",
                title: "VOC dashboard design",
                text: "High-fidelity Figma and Lovable direction; the current values remain placeholder data.",
              },
              {
                status: "In progress",
                title: "VOC dashboard code handoff",
                text: "Repository, production data, Vercel workflow, access, and maintenance SOP are active work.",
              },
              {
                status: "Delivered",
                title: "Customer quote library",
                text: "Multi-source evidence inventory and access points for 21 deidentified Q1 clips.",
              },
              {
                status: "Delivered",
                title: "NPS executive report",
                text: "Completed Q1 2026 executive report delivered to Jill.",
              },
              {
                status: "In progress",
                title: "UXR onboarding documentation",
                text: "Living onboarding and operating playbook co-developed with Layilah Campbell.",
              },
              {
                status: "Delivered",
                title: "Presentation template system",
                text: "Completed Drive export, team-owned Figma template, and editable VOC design-system workspace.",
              },
              {
                status: "Delivered",
                title: "AI research skills",
                text: "Packaged research-viz, research-synthesis, and root-brand-voice skills with a governed playbook.",
              },
            ],
          },
        ],
      },
      {
        id: "artifact-links",
        title: "Canonical source links",
        blocks: [
          {
            kind: "links",
            items: [
              {
                label: "Intern Project Scope Document",
                description: "Project scope, drafts, dashboard notes, quote library, and appendix.",
                href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit",
              },
              {
                label: "Q1 VOC editable Figma file",
                description: "Reporting redesign source.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=311-2741&t=RN5pZmfOi8ZJ1s2r-1",
              },
              {
                label: "NPS executive report",
                description: "Completed Q1 2026 PDF in Google Drive.",
                href: "https://drive.google.com/file/d/1NCnSRL9ncpFiGmOJthbPzuqRwW8x1CIY/view",
              },
              {
                label: "Customer evidence library",
                description: "This handoff’s access-controlled recording and governance chapter.",
                href: "/customer-quote-library",
              },
              {
                label: "VOC dashboard handoff",
                description: "Prototype, deployment model, and remaining code work.",
                href: "/voc-dashboard",
              },
              {
                label: "UXR onboarding documentation",
                description: "Living Google Doc co-developed with Layilah Campbell.",
                href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
              },
              {
                label: "Presentation template system",
                description: "Completed Drive and Figma template artifacts.",
                href: "/presentation-template-system",
              },
              {
                label: "AI Skills folder",
                description: "Packaged research skills in Google Drive.",
                href: "https://drive.google.com/drive/folders/1mz6GdtOxh3LmALf4T3-jPHBmhvG1aTcZ",
              },
            ],
          },
        ],
      },
      {
        id: "immediate-actions",
        title: "Immediate handoff actions",
        blocks: [
          {
            kind: "steps",
            items: [
              "Confirm one canonical link and long-term owner for every artifact.",
              "Complete the Q2 report’s evidence review, final claims, and approved artifact.",
              "Verify access to Figma, Drive recordings, research notes, the AI Skills folder, the dashboard GitHub repository, and Vercel.",
              "Connect the dashboard only to validated metrics and approved, deidentified sources.",
              "Finish the dashboard repository, preview, authentication, CSV maintenance, and deployment SOP.",
              "Pilot the onboarding documentation with a new team member and assign chapter owners.",
            ],
          },
        ],
      },
      {
        id: "manager-decisions",
        title: "Decisions for Hala",
        blocks: [
          {
            kind: "callout",
            status: "TBD",
            title: "Choices that determine the next phase",
            text: "The handoff is designed to make these decisions explicit rather than silently assuming that every prototype should become a production system.",
          },
          {
            kind: "list",
            items: [
              "Who will own the completed VOC presentation system and approve future changes?",
              "Who will own the evidence library, onboarding playbook, and their permission or content reviews?",
              "Which Q2 findings require another research round before publication?",
              "Should the dashboard move from a presentation prototype to a maintained internal product?",
              "Which data sources and metrics are approved for the first operational dashboard version?",
              "Where should the AI skill packages be installed, versioned, reviewed, and maintained?",
            ],
          },
        ],
      },
      {
        id: "closing",
        title: "Closing note",
        blocks: [
          {
            kind: "paragraph",
            text: "This handoff separates delivered artifacts, prototypes, ongoing work, and future recommendations so the next owner can continue the work without overstating its current state.",
          },
          {
            kind: "quote",
            label: "Prepared by Julio Caggiano",
            text: "The goal is not only to preserve what I made, but to preserve the reasoning, limitations, and next decisions that make the work usable.",
          },
        ],
      },
    ],
  },
];

export const handoffGroups: HandoffGroup[] = [
  "Deliverables",
  "Research practice",
  "Continuation",
];

const legacySlugAliases: Record<string, string> = {
  "voc-report-redesign": "q1-voc-report",
  "customer-evidence-library": "customer-quote-library",
  "voc-dashboard-exploration": "voc-dashboard",
  "research-and-stakeholders": "research-process",
  handoff: "handoff-next-steps",
};

export function getHandoffPage(slug: string): HandoffPage | undefined {
  const canonicalSlug = legacySlugAliases[slug] ?? slug;
  return handoffPages.find((page) => page.slug === canonicalSlug);
}
