import "server-only";

import { customerQuotes } from "./customer-quotes";
import { getSiteUpdated } from "./site-updated";

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
  href: string;
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
  | { kind: "paragraph"; text: string; emphasis?: boolean }
  | { kind: "signature"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "subheading"; text: string }
  | { kind: "quote"; label: string; text: string }
  | { kind: "callout"; status: HandoffStatus; title: string; text: string }
  | { kind: "links"; items: ResourceLink[] }
  | {
      kind: "customerEvidenceLibrary";
      quotes: CustomerQuoteEntry[];
      collections: VideoCollection[];
    }
  | { kind: "quoteGrid"; items: CustomerQuoteEntry[] }
  | { kind: "videoLibrary"; collections: VideoCollection[] }
  | { kind: "statusGrid"; items: StatusItem[] }
  | { kind: "commands"; items: CommandItem[] }
  | { kind: "pipeline"; items: PipelineItem[]; caption?: string };

export type HandoffGroup =
  | "Deliverables"
  | "Research practice"
  | "Future";

export type HandoffSection = {
  id: string;
  title: string;
  showTitle?: boolean;
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
  primaryLinks?: ResourceLink[];
  sections: HandoffSection[];
};

export const siteUpdated = getSiteUpdated().label;

const q1PrototypeHref =
  "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=311%3A2741&node-id=311-2744&p=f&viewport=-267%2C-45%2C0.16&t=xgUWguhbtJRImnrf-1&scaling=scale-down&content-scaling=fixed";

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
    title: "VOC Quarterly Report (Q1-26)",
    summary:
      "The completed Q1 reporting redesign that turned a broad storytelling brief into an editable Figma presentation and reusable reporting framework.",
    status: "Delivered",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Interactive prototype",
        description: "Navigate the completed Q1-26 presentation in prototype mode.",
        href: q1PrototypeHref,
      },
      {
        label: "Figma source",
        description: "Review or continue the report in the shared VOC workspace.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=311-2741&t=RN5pZmfOi8ZJ1s2r-1",
      },
      {
        label: "Supporting files",
        description: "Shared research inputs and working artifacts for the report.",
        href: "https://drive.google.com/drive/folders/15YrTTyQ_I1F_-Tph1LR0bo3ZHjkoOpCc",
      },
      {
        label: "Documentation",
        description: "Source notes and research context in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.7momns81mgpm",
      },
    ],
    sections: [
      {
        id: "the-brief",
        title: "Project Brief",
        blocks: [
          {
            kind: "paragraph",
            text: "My primary internship objective was to improve the storytelling techniques and data accuracy of the VOC Quarterly Customer Report. To do so, I reviewed the existing research approach, documented its communication gaps, and translated that critique into a comprehensive direction for future research iterations.",
          },
          {
            kind: "list",
            items: [
              "Problem: Important findings competed for attention within a confusing narrative and data-analysis format.",
              "Target audience: Product leadership needed a quicker pathway from data interpretation to actionable product insights.",
              "My role: Audit the existing report, develop reporting standards, revise the data-analysis workflow, and prototype a clear storytelling direction.",
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
            text: "Quantitative evidence establishes what is happening. On the other hand, qualitative evidence explains why it is happening and how customers experience it.",
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
              {
                label: "Find quantitative patterns",
                detail: "Start with trends and recurring signals.",
              },
              {
                label: "Investigate through qualitative evidence",
                detail: "Use customer evidence to understand why.",
              },
              {
                label: "Validate findings with stakeholders",
                detail: "Review the interpretation, limits, and priority.",
              },
              {
                label: "Report viable next steps for product development",
                detail: "Connect the evidence to a feasible product decision.",
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
            kind: "list",
            items: [
              "Confirm the long-term owner responsible for applying this new framework to future report iterations.",
              "Continue improving and expanding long-term sources of data insight, such as the VOC Customer Quote Library.",
              "Strengthen the next-steps section by connecting recommendations directly to Product Design roadmaps through a dedicated communication channel or recurring review session with Clu and Ryan Farnham, Director of Product Design.",
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
    title: "VOC Quarterly Report (Q2-26)",
    summary:
      "This second quarterly report applies the updated storytelling system to a new round of evidence. It is currently in progress with the external stakeholders leading the core research, with delivery expected in mid-August.",
    status: "In progress",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Figma source",
        description: "Current Q2 report workspace and draft structure.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=2546-1804",
      },
      {
        label: "Q1 report reference",
        description: "The reporting framework that the Q2 draft builds upon.",
        href: "/q1-voc-report",
      },
    ],
    sections: [
      {
        id: "current-state",
        title: "Current state",
        blocks: [
          {
            kind: "callout",
            status: "In progress",
            title: "Waiting for stakeholder datasets",
            text: "Seven datasets must be collected and reviewed (10-10 Direct-to-Consumer Benchmark Survey, 10-10 Independent Agents Survey, app reviews, Marketing Brand Tracker, qualitative customer interviews, SPRIG Index Surveys, and VOC Auto Shopping Survey). We are waiting for stakeholders to share the remaining files before synthesis can continue.",
          },
          {
            kind: "paragraph",
            text: "To deliver the report during my final internship week, we are accelerating data collection and will use survey data that ends approximately two weeks earlier than the intended late-August cutoff. This timing tradeoff should be documented as a limitation. Future VOC reporting should operate as an ongoing monitoring program—independent of internship timelines—with fixed, comparable collection windows and precise cutoff dates across the May-to-late-August period.",
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
              "Next steps: Bounded opportunities connected to evidence, owners, and validation needs.",
              "Appendix: Supporting tables, definitions, source detail, and material that should remain available without crowding the main narrative.",
            ],
          },
        ],
      },
      {
        id: "evidence-inputs",
        title: "Research Process",
        blocks: [
          {
            kind: "paragraph",
            text: "My research process begins at the system level: I scan broad behavioral and attitudinal signals—such as a rise in negative app reviews—to identify where the customer experience may be changing. I then move from the quantitative “what” to the qualitative “why,” using interviews, customer conversations, and thematic analysis of verbatims to test competing explanations and surface context. Finally, I integrate evidence across sources, document contradictions and limitations, and translate the most defensible patterns into a clear narrative and focused questions for stakeholders.",
          },
          {
            kind: "pipeline",
            items: [
              {
                label: "Scan systemic signals",
                detail: "Find shifts across surveys, reviews, trackers, and behavioral data",
              },
              {
                label: "Select what needs explaining",
                detail: "Prioritize consequential patterns, segments, and contradictions",
              },
              {
                label: "Conduct customer conversations",
                detail: "Probe the context and mechanisms behind the quantitative signal",
              },
              {
                label: "Develop verbatim themes",
                detail: "Code recurring language, tensions, and counterevidence",
              },
              {
                label: "Integrate the evidence",
                detail: "Combine scale and meaning into a bounded narrative and next questions",
              },
            ],
            caption:
              "UX research adaptation of Creswell and Plano Clark’s explanatory sequential mixed-methods design: quantitative patterns → qualitative explanation → integrated interpretation.",
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
              "Translated the new VOC storytelling framework into the Q2 2026 data.",
              "Reviewed prior-quarter evidence and documented the sources needed for the next synthesis.",
              "Established a clearer separation between findings, explanatory customer evidence, and future research questions.",
              "Created a reusable visual and narrative system through the presentation-template work.",
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
    title: "VOC Customer Quote Library",
    summary:
      "A complete, organized customer quote library to support future quarterly reports, specifically the workflow of connecting quantitative data patterns to direct customer experiences. The library contains interviews, app reviews, long-form survey responses, customer feedback, and other research resources.",
    status: "Delivered",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Customer support library",
        description: "The source inventory and supporting links in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.vwocc5k1v4db",
      },
      {
        label: "Customer interview reels",
        description: "Shared Drive folder containing the P1, P2, and P3 recordings.",
        href: "https://drive.google.com/drive/folders/1LK-sDBk7s94LY6uet1-ys1QsUBhrdBDm",
      },
      {
        label: "Lookback reels and insights",
        description: "Access the overall VOC-specific qualitative interviews.",
        href: "https://lookback.io/org/root-inc-2/projects/root-voc-customer-interviews/reels",
      },
    ],
    sections: [
      {
        id: "customer-quotes",
        title: "Customer Quotes",
        blocks: [
          {
            kind: "customerEvidenceLibrary",
            quotes: customerQuotes,
            collections: q1CustomerRecordings,
          },
        ],
      },
      {
        id: "next-steps",
        title: "Next steps",
        blocks: [
          {
            kind: "list",
            items: [
              "Assign the long-term owner of the customer quote library, responsible for quarterly updates",
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
    title: "VOC Dashboard",
    summary:
      "A nearly complete design prototype and an in-progress coded handoff for a living VOC website powered by a reviewed GitHub-to-Vercel workflow.",
    status: "In progress",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Interactive prototype",
        description: "Interactive Lovable prototype used to test the website direction.",
        href: "https://lovable.dev/preview/hctAFpNwDdfYpSylhmUcuxPkCUtYQdHE",
      },
      {
        label: "Figma source",
        description: "Latest high-fidelity design in the shared VOC workspace.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=1563-2647&t=EIOlHXMAH4ey7MR5-1",
      },
      {
        label: "Prototype PDF",
        description: "High-fidelity dashboard artifact in Google Drive.",
        href: "https://drive.google.com/file/d/1h_J_vqX8rwL3Nt3TZzDC-a8L9bmTzTDe/view",
      },
      {
        label: "Code handoff",
        description: "Implementation notes, QA status, and remaining code work.",
        href: "https://drive.google.com/file/d/1ybcIiBDlDmvNmnbr0hoJyQSgG8ZSgzBs/view",
      },
      {
        label: "Project record",
        description: "The dashboard brief and working notes in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.eh4wx17fdlej",
      },
    ],
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
    title: "NPS Executive Report (Q1-26)",
    summary:
      "An additional project that helps the product team navigate Root’s current NPS performance beyond the broader quarterly Voice of Customer monitoring program.",
    status: "Delivered",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Final PDF",
        description: "Final Q1-26 executive report PDF in Google Drive.",
        href: "https://drive.google.com/file/d/1NCnSRL9ncpFiGmOJthbPzuqRwW8x1CIY/view",
      },
      {
        label: "VOC Figma workspace",
        description: "Shared design workspace containing the report work.",
        href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=1861%3A3298&node-id=1861-3299&p=f&viewport=-168%2C128%2C0.17&t=gF482mM1I1lkZy3Z-1&scaling=contain&content-scaling=fixed",
      },
      {
        label: "Project record",
        description: "Research process and delivery notes in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.p5vqlrzgpbt5",
      },
    ],
    sections: [
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "Executive summary: A quick overview of the key findings and future steps for leadership.",
              "NPS segment views: Separate views of aggregate, current-customer, former-customer, and non-customer performance.",
              "Promoter and detractor themes: A directional review of the experiences shaping positive and negative sentiment.",
              "Methodology and sampling: Source definitions, sampling context, and limitations for the 10/10 Benchmark Survey and Marketing Brand Tracking Study.",
              "Follow-up strategy: A focused plan for explaining non-customer sentiment and strengthening future NPS data collection.",
              "Appendix: Carrier comparisons, segment distributions, and supporting tables for deeper review.",
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
            text: "The central research workflow examined each NPS tracking source independently to clarify performance differences between current-customer and non-customer samples. Comparing results at the segment and study level helped explain the diverging scores and reconcile the apparent discrepancy between the Marketing Brand Tracking Study and the 10/10 Benchmark Survey.",
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
              "Structured the report narrative for an executive audience that needed concise explanations and a clear follow-up strategy.",
              "Iterated the document’s storytelling and formatting through multiple rounds of review with leadership stakeholders.",
              "Investigated a common source of confusion across multiple NPS tracking studies and their diverging results.",
              "Compared and reconciled the 10/10 Benchmark Survey and Marketing Brand Tracking Study perspectives.",
              "Created the information hierarchy, charts, annotations, disclaimers, and appendix structure.",
              "Translated analytical limitations into visible reading guidance rather than hiding them in footnotes.",
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
    title: "UXR Documentation",
    summary:
      "An in-progress onboarding playbook co-developed with Layilah Campbell to help future researchers understand Root, the team, and its operating practices.",
    status: "In progress",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Onboarding document",
        description: "Living Google Doc co-developed by the UXR interns.",
        href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
      },
      {
        label: "Project record",
        description: "Scope, progress, and continuation notes in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.z582zky508qm",
      },
    ],
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
        ],
      },
    ],
  },
  {
    slug: "presentation-template-system",
    group: "Deliverables",
    order: 7,
    title: "Presentation Template",
    summary:
      "I expanded the rebrand into a practical system for yearly reporting. It provides repeatable structures for executive summaries, key findings, charts, customer quotes, section breaks, and references. Its primary objective is to help research stakeholders and product partners communicate ideas through a cohesive presentation and storytelling framework.",
    status: "Delivered",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Google Slides Template",
        description: "Completed presentation-system export.",
        href: "https://drive.google.com/file/d/1OshHDffRLd2498_qE3Nqkty_gHhTy6So/view",
      },
      {
        label: "Figma Template",
        description: "Completed Figma presentation template.",
        href: "https://www.figma.com/design/liCQw8Mv0VVnPMLacbEixP/New-Brand-Figma-Slides-Template?node-id=59-2027&t=jLp3wOviYd34ZBgn-1",
      },
      {
        label: "Design System",
        description: "Editable component system and report workspace in Figma.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=59-2027&t=iyC0FSCAptPUCIpU-1",
      },
      {
        label: "Project Documentation",
        description: "Deliverable notes and source context in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.x1rjygdc0a3s",
      },
    ],
    sections: [
      {
        id: "what-it-encompasses",
        title: "What it encompasses",
        blocks: [
          {
            kind: "list",
            items: [
              "Reusable components and design elements for product and research teams.",
              "Executive-summary, key-finding, data-analysis, customer-quote, video, and appendix layouts.",
              "Chart patterns with places for research questions, sample bases, sources, scales, and limitations.",
              "An expansion of Root’s photography identity for non-commercial use, grounded in its brand principles.",
              "Two separate templates: Figma (for designers and technical team members) and Google Slides (for non-technical stakeholders, such as Human Resources partners).",
              "Structural workflow guidance that clarifies storytelling by focusing each slide on one primary image or message, supported by concise text and visible methodological context.",
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
    ],
  },
  {
    slug: "ai-research-skills",
    group: "Deliverables",
    order: 8,
    title: "AI Skills",
    summary:
      "To streamline research across diverse data sources, I developed reusable AI-assisted workflows for standardized data preparation and analysis, with an emphasis on Python-based visualization and reliable handling of CSV files.\nThe packages accelerate early-stage cleaning, quality checks, statistical calculations, and visualization so researchers can spend more time interpreting results, investigating the phenomena behind the data, and connecting evidence to decisions. As an additional deliverable, I created a Root brand-voice skill grounded in the company’s brand guidelines. It remains an evolving experiment and may still produce recognizably AI-written language, so its output should be reviewed and refined as the technology develops.",
    status: "Delivered",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "/research-viz",
        description: "Packaged workflow for research charts and visual communication.",
        href: "https://drive.google.com/file/d/14rJ2R0HVKT5mafL4txP91-2Cn7k_dmqt/view",
      },
      {
        label: "/research-synthesis",
        description: "Packaged workflow for cross-source research synthesis.",
        href: "https://drive.google.com/file/d/1V_W6ERl6x_cYkLtVYy9-L_MF_p4A0tVW/view",
      },
      {
        label: "/root-brand-voice",
        description: "Packaged writing guidance for Root’s updated voice.",
        href: "https://drive.google.com/file/d/1pLnFe6CPhkBGI-QKrk646YvkUfyFEQFc/view",
      },
      {
        label: "Project Documentation",
        description: "Deliverable notes and package inventory in the IPSD.",
        href: "https://docs.google.com/document/d/1eMVc8liDi-s3PGIdXN9lVaM9uOZOJGLGmbuBbt4DCco/edit?tab=t.1i5wqpu8xsw",
      },
    ],
    sections: [
      {
        id: "how-they-work-together",
        title: "Research Process",
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
    ],
  },
  {
    slug: "research-process",
    group: "Research practice",
    order: 9,
    title: "Research Process",
    summary: "",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "how-inputs-shaped-work",
        title: "Research workflow",
        showTitle: false,
        blocks: [
          {
            kind: "pipeline",
            items: [
              { label: "Listen", detail: "Collect expectations and constraints" },
              { label: "Compare", detail: "Audit reports, tools, and evidence" },
              { label: "Translate", detail: "Turn feedback into design criteria" },
              { label: "Prototype", detail: "Make the direction reviewable" },
              { label: "Iterate", detail: "Implement feedback and improve" },
            ],
            caption:
              "My UX research workflow is experimental, iterative, and informed by established human-centered design methods.",
          },
        ],
      },
      {
        id: "research-foundation",
        title: "Research philosophy",
        blocks: [
          {
            kind: "paragraph",
            text: "My research approach begins with observable behavior. Self-reported attitudes can help explain meaning and motivation, but they are not a substitute for seeing what people actually do in context. I look first for behavioral phenomena—task completion, hesitation, errors, workarounds, abandonment, recurring support needs, and changes over time—then use interviews and open-ended feedback to understand the mechanisms behind those patterns.",
          },
          {
            kind: "paragraph",
            text: "The metrics that matter depend on the decision, but I prioritize measures that connect experience to action: success rate, time on task, assistance required, error frequency, conversion or drop-off, retention signals, and the recurrence and severity of customer problems. I interpret these measures alongside sample quality, segment differences, and source limitations; a metric is useful only when its definition and relationship to the decision are clear.",
          },
          {
            kind: "paragraph",
            text: "I treat customer empathy as an active research practice rather than a statement of intent. For example, instead of asking whether a prototype seems appropriate, I would use an unmoderated usability study to observe whether participants can complete the intended behavior without guidance from the research team. Watching where they pause, adapt, or fail reveals friction that a direct opinion question may miss. Follow-up questions can then explain why the behavior occurred and what the experience meant to the participant.",
          },
        ],
      },
    ],
  },
  {
    slug: "standard-operating-procedures",
    group: "Research practice",
    order: 10,
    title: "Standard Operating Procedures (SOPs)",
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
    slug: "internship-reflection",
    group: "Research practice",
    order: 11,
    title: "Insights",
    summary:
      "The most important lessons I developed about connecting evidence to product decisions, communicating data clearly, iterating with stakeholders, and building research systems that others can use.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "product-roadmaps",
        title: "Product Roadmaps",
        blocks: [
          {
            kind: "paragraph",
            text: "One of my most important lessons is that a research finding is the beginning of a product journey, not its conclusion. To create impact, I need to work closely with product partners to understand the current roadmap, its constraints, and the quickest credible opportunities to address immediate customer pain points. Learning to connect evidence with sequencing, feasibility, and ownership has made me a stronger researcher and a more thoughtful designer, especially because I work across both disciplines.",
          },
        ],
      },
      {
        id: "data-visualization",
        title: "Data Visualization",
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
        id: "rapid-iteration",
        title: "Rapid Iteration",
        blocks: [
          {
            kind: "paragraph",
            text: "During this internship, I experimented with sharing focused increments every two or three days instead of waiting to present a polished final deliverable for formal review. That rhythm gave my managers more opportunities to shape the work while decisions were still flexible. As an intern, I began with less organizational context than colleagues in full-time roles; frequent reviews helped close that gap, sharpen my understanding of Root, and improve the quality of each deliverable through continuous, incremental refinement.",
          },
        ],
      },
      {
        id: "systematic-thinking",
        title: "Systematic Thinking",
        blocks: [
          {
            kind: "paragraph",
            text: "The quarterly-report assignment expanded into a broader storytelling system with reusable structures, evidence practices, and visual standards. During a conversation with a senior engineering leader alongside other summer interns, I was encouraged to strengthen this kind of systems thinking. That advice became a defining lesson in how I approached the Voice of Customer program: not as a collection of isolated reports, but as a connected system that helps teams find evidence, communicate it consistently, and carry insights into decisions over time.",
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
        id: "what-i-want-to-develop-next",
        title: "What I Want to Develop Next",
        blocks: [
          {
            kind: "list",
            items: [
              "Extend my AI practice beyond research and design into production, learning how to collaborate with engineering teams to carry work from findings through design iteration and into customer-facing implementation.",
              "Create artifacts that remain legible and useful across technical and non-technical audiences, adapting the same evidence for executives, product leaders, researchers, designers, and engineers without losing clarity or rigor.",
              "Expand my professional network and strengthen my confidence presenting work to broader groups, deliberately moving beyond my comfort zone as an introvert so I can communicate the value of my work more effectively.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "handoff-next-steps",
    group: "Future",
    order: 12,
    title: "Transition Plan",
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
                title: "VOC Quarterly Report (Q1-26)",
                text: "Completed Figma presentation, V7 export, and reusable reporting principles.",
                href: q1PrototypeHref,
              },
              {
                status: "In progress",
                title: "VOC Quarterly Report (Q2-26)",
                text: "Working structure and source inventory established; findings and final review remain open.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=2546-1804",
              },
              {
                status: "Prototype",
                title: "VOC Dashboard · Prototype",
                text: "High-fidelity Figma and Lovable direction; the current values remain placeholder data.",
                href: "https://lovable.dev/preview/hctAFpNwDdfYpSylhmUcuxPkCUtYQdHE",
              },
              {
                status: "In progress",
                title: "VOC Dashboard · Code Handoff",
                text: "Repository, production data, Vercel workflow, access, and maintenance SOP are active work.",
                href: "https://drive.google.com/file/d/1ybcIiBDlDmvNmnbr0hoJyQSgG8ZSgzBs/view",
              },
              {
                status: "Delivered",
                title: "VOC Customer Quote Library",
                text: "Multi-source evidence inventory and access points for 21 deidentified Q1 clips.",
                href: "/customer-quote-library",
              },
              {
                status: "Delivered",
                title: "NPS Executive Report (Q1-26)",
                text: "Completed Q1 2026 executive report delivered to Jill.",
                href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=1861%3A3298&node-id=1861-3299&p=f&viewport=-168%2C128%2C0.17&t=gF482mM1I1lkZy3Z-1&scaling=contain&content-scaling=fixed",
              },
              {
                status: "In progress",
                title: "UXR Documentation",
                text: "Living onboarding and operating playbook co-developed with Layilah Campbell.",
                href: "https://docs.google.com/document/d/1spAyv8Q9Oj2MyvjcpxYI0Ou-Sx-I8XVNuYTMudAXjNU/edit",
              },
              {
                status: "Delivered",
                title: "Presentation Template",
                text: "Completed Drive export, team-owned Figma template, and editable VOC design-system workspace.",
                href: "https://www.figma.com/design/liCQw8Mv0VVnPMLacbEixP/New-Brand-Figma-Slides-Template?node-id=59-2027&t=jLp3wOviYd34ZBgn-1",
              },
              {
                status: "Delivered",
                title: "AI Skills",
                text: "Packaged research-viz, research-synthesis, and root-brand-voice skills with a governed playbook.",
                href: "/ai-research-skills",
              },
            ],
          },
        ],
      },
      {
        id: "immediate-actions",
        title: "Action Required",
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
          {
            kind: "steps",
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
            emphasis: true,
            text: "I’m deeply grateful for the opportunity to work with Root’s UX Research team. I have genuinely enjoyed contributing to the team and learned an extraordinary amount from the people, projects, and trust I was given. I’m excited about what comes next and hope to continue contributing to Root throughout my final year of university and after graduation.",
          },
          {
            kind: "signature",
            text: "Julio Caggiano",
          },
        ],
      },
    ],
  },
];

export const handoffGroups: HandoffGroup[] = [
  "Deliverables",
  "Research practice",
  "Future",
];

const legacySlugAliases: Record<string, string> = {
  "voc-report-redesign": "q1-voc-report",
  "customer-evidence-library": "customer-quote-library",
  "voc-dashboard-exploration": "voc-dashboard",
  "research-and-stakeholders": "research-process",
  "internship-insights": "internship-reflection",
  handoff: "handoff-next-steps",
};

export function getHandoffPage(slug: string): HandoffPage | undefined {
  const canonicalSlug = legacySlugAliases[slug] ?? slug;
  return handoffPages.find((page) => page.slug === canonicalSlug);
}
