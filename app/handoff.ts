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
  | "Core work"
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
    slug: "voc-report-redesign",
    group: "Core work",
    order: 1,
    title: "Redesigning the VOC report",
    summary:
      "How I turned a broad request to improve quarterly customer storytelling into an editable design concept and reusable reporting principles.",
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
            title: "Evidence-backed artifact",
            text: "A linked Q1 VOC/QCR Figma direction and detailed reporting framework exist. The final Q2 report is not represented as complete.",
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
              "Do not describe the final Q2 report as delivered until an approved artifact is identified.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "customer-evidence-library",
    group: "Core work",
    order: 2,
    title: "Building the customer evidence library",
    summary:
      "An organized evidence layer designed to make customer quotes, recordings, and source context easier to find and reuse responsibly.",
    status: "In progress",
    updated: siteUpdated,
    sections: [
      {
        id: "purpose",
        title: "Purpose and contribution",
        blocks: [
          {
            kind: "callout",
            status: "Delivered",
            title: "Evidence organized and surfaced",
            text: "The source inventory and 21 access-controlled Q1 recording embeds exist. Governance, attribution, and ownership still need to be completed.",
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
    slug: "voc-dashboard-exploration",
    group: "Core work",
    order: 3,
    title: "Exploring the VOC customer dashboard",
    summary:
      "The current dashboard direction, how its website deployment should work, and the future GitHub, Vercel, and AI-assisted workflow.",
    status: "Prototype",
    updated: siteUpdated,
    sections: [
      {
        id: "current-direction",
        title: "Current direction",
        blocks: [
          {
            kind: "callout",
            status: "Prototype",
            title: "A design and code direction—not yet a live analytics product",
            text: "A lightweight Figma dashboard and Lovable preview exist, but the documented data is placeholder content. Live connections, validated metrics, and an operating owner are not yet established.",
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
    slug: "research-and-stakeholders",
    group: "Research practice",
    order: 4,
    title: "Research and stakeholder inputs",
    summary:
      "The conversations, artifact reviews, and source analysis that shaped the reporting and dashboard directions.",
    status: "Delivered",
    updated: siteUpdated,
    sections: [
      {
        id: "documented-inputs",
        title: "Documented inputs",
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
    slug: "internship-reflection",
    group: "Research practice",
    order: 5,
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
    slug: "handoff",
    group: "Continuation",
    order: 6,
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
                title: "VOC report framework",
                text: "Q1 critique, storytelling principles, and linked Figma design artifacts.",
              },
              {
                status: "Delivered",
                title: "Customer evidence inventory",
                text: "Multi-source evidence organization and access points for 21 Q1 clips.",
              },
              {
                status: "Delivered",
                title: "Stakeholder record",
                text: "Notes and feedback that shaped the report and dashboard directions.",
              },
              {
                status: "Prototype",
                title: "VOC dashboard",
                text: "Figma and Lovable directions using placeholder rather than production data.",
              },
              {
                status: "In progress",
                title: "Evidence governance",
                text: "Permissions, provenance, review metadata, and long-term ownership.",
              },
              {
                status: "Recommendation",
                title: "GitHub and Vercel workflow",
                text: "Private previews, reviewed merges, automated deployment, and future AI assistance.",
              },
              {
                status: "TBD",
                title: "Unverified completion",
                text: "Final Q2 report, live dashboard, NPS studies, in-product surveys, and journey-map platform.",
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
                label: "Dashboard code preview",
                description: "Lovable prototype; not a production system.",
                href: "https://lovable.dev/preview/hctAFpNwDdfYpSylhmUcuxPkCUtYQdHE",
              },
              {
                label: "Customer evidence library",
                description: "This handoff’s access-controlled recording and governance chapter.",
                href: "/customer-evidence-library",
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
              "Verify access to Figma, Drive recordings, research notes, the GitHub repository, and Vercel.",
              "Complete evidence-library permissions and provenance fields.",
              "Replace dashboard placeholder data only after metric and source validation.",
              "Confirm whether the dashboard was sent to Klew and record any resulting feedback.",
              "Record which reporting recommendations were accepted and what follow-up they require.",
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
              "Which artifact should become the official reusable VOC reporting template?",
              "Who will own the evidence library and its permission reviews?",
              "Should the dashboard remain a presentation prototype or move toward a live product?",
              "Which data sources and metrics must be validated before the dashboard can be operational?",
              "Which unfinished opportunity, if any, should be prioritized after the internship?",
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
            label: "Prepared by Julio Caggiano for Hala Daher",
            text: "The goal is not only to preserve what I made, but to preserve the reasoning, limitations, and next decisions that make the work usable.",
          },
        ],
      },
    ],
  },
];

export const handoffGroups: HandoffGroup[] = [
  "Core work",
  "Research practice",
  "Continuation",
];

export function getHandoffPage(slug: string): HandoffPage | undefined {
  return handoffPages.find((page) => page.slug === slug);
}
