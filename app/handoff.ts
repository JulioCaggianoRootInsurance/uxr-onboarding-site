import "server-only";

import { customerQuotes } from "./customer-quotes";
import { getSiteUpdated } from "./site-updated";

export type ResourceLink = {
  label: string;
  description: string;
  href: string;
  provider?: "root" | "slides";
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
  | { kind: "callout"; title: string; text: string }
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
  | { kind: "copyablePrompt"; title: string; introduction: string; prompt: string }
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
  updated: string;
  primaryLinks?: ResourceLink[];
  sections: HandoffSection[];
};

export const siteUpdated = getSiteUpdated().label;

const q1PrototypeHref =
  "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=311%3A2741&node-id=311-2744&p=f&viewport=-267%2C-45%2C0.16&t=xgUWguhbtJRImnrf-1&scaling=scale-down&content-scaling=fixed";

const dashboardPreviewHref =
  "https://lovable.dev/preview/tH8LUsFZk8vhXteqSZ1xswd9oirLnW5a";

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
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Presentation",
        description: "Navigate the completed Q1-26 presentation in prototype mode.",
        href: q1PrototypeHref,
        provider: "root",
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
            text: "Quantitative evidence helped us identify broader phenomena that required attention. Qualitative evidence helped us understand the nuances and specific struggles customers were facing, which then informed our debriefs with Product Design stakeholders.",
          },
        ],
      },
      {
        id: "reporting-framework",
        title: "The reporting framework",
        blocks: [
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
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Presentation visualization",
        description: "View the current Q2 report presentation in prototype mode.",
        href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=2546%3A1804&node-id=2546-1805&viewport=168%2C490%2C0.06&t=1woACFjok5i2B4fg-1&scaling=contain&content-scaling=fixed",
        provider: "root",
      },
      {
        label: "Figma source",
        description: "Current Q2 report workspace and draft structure.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=2546-1804",
      },
      {
        label: "Supporting files",
        description: "Main folder for the Q2 2026 VOC Quarterly Report.",
        href: "https://drive.google.com/drive/folders/1i3yLP2P42e7An8iP0eZioQ7BZDDnWlHG?usp=sharing",
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
            text: "My research process begins at the system level: I scan broad behavioral and attitudinal signals—such as a rise in negative app reviews—to identify where the customer experience may be changing. I then move from the quantitative “what” to the qualitative “why,” using interviews, customer conversations, and thematic analysis of verbatims to test competing explanations and surface context. Finally, I seek to integrate evidence across multiple sources and translate them into a clear narrative for the product design team to implement solutions.",
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
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Lovable dashboard preview",
        description: "Open the completed VOC dashboard prototype for stakeholder review.",
        href: dashboardPreviewHref,
      },
      {
        label: "Customer quote library spreadsheet",
        description: "The central spreadsheet for organizing and maintaining customer-quote evidence.",
        href: "https://docs.google.com/spreadsheets/d/1Js0nphTvokImTGG0zJpUJ9EfD6kOlkqblX8X8uKBG00/edit?usp=sharing",
      },
      {
        label: "Customer interview reels",
        description: "Shared Drive folder containing the P1, P2, and P3 recordings.",
        href: "https://drive.google.com/drive/folders/1LK-sDBk7s94LY6uet1-ys1QsUBhrdBDm",
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
      "A completed Lovable dashboard prototype for reviewing VOC content, with a stakeholder preview and an editor-ready project workspace.",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Stakeholder dashboard preview (Expires in 7 days)",
        description: "Completed Lovable dashboard prototype for stakeholder review.",
        href: dashboardPreviewHref,
      },
      {
        label: "Lovable editor invite",
        description: "Invite collaborators to edit the completed Lovable dashboard prototype.",
        href: "https://lovable.dev/projects/739ad35a-f0ac-44a9-a1f6-3d56613a5a0e?magic_link=mc_7b02f215-3bdb-4694-a298-8b1cc0a9415a",
      },
      {
        label: "Figma source",
        description: "Latest high-fidelity design in the shared VOC workspace.",
        href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=1563-2647&t=EIOlHXMAH4ey7MR5-1",
      },
    ],
    sections: [
      {
        id: "current-direction",
        title: "Current direction",
        blocks: [
          {
            kind: "paragraph",
            text: "I compared previous VOC documentation with the existing Mode experience to explore a faster, more visual, and more reusable way for product teams to inspect customer evidence between quarterly reports.",
          },
          {
            kind: "list",
            items: [
              "Designed a lightweight dashboard direction in Figma.",
              "Completed a Lovable dashboard prototype for stakeholder review.",
              "Explored a reusable, non-variable slideshow system with responsive icons and an expanded photo library.",
              "Collected direction and feedback from Jill.",
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
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Presentation visualization",
        description: "View the Q1-26 executive report presentation in prototype mode.",
        href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=1861-3299&p=f&viewport=-325%2C-869%2C0.21&t=CFFTOwJyDkoNAzU4-1&scaling=contain&content-scaling=fixed&page-id=1861%3A3298",
        provider: "root",
      },
      {
        label: "VOC Figma workspace",
        description: "Shared design workspace containing the report work.",
        href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=1861%3A3298&node-id=1861-3299&p=f&viewport=-168%2C128%2C0.17&t=gF482mM1I1lkZy3Z-1&scaling=contain&content-scaling=fixed",
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
      "A completed onboarding playbook co-developed with Layilah Campbell to help future researchers understand Root, the team, and its operating practices.",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Lovable project",
        description: "UXR documentation project workspace and interactive implementation.",
        href: "https://lovable.dev/projects/147235d4-c281-47cf-b008-6d33c4bf3bae",
      },
    ],
    sections: [
      {
        id: "purpose",
        title: "Purpose",
        blocks: [
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
              "Translated the documentation into an interactive Lovable project for future review and use.",
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
      "I expanded the rebrand into a practical system for yearly reporting. The finalized presentation template is now ready for stakeholder use, with repeatable structures for executive summaries, key findings, charts, customer quotes, section breaks, and references. Its primary objective is to help research stakeholders and product partners communicate ideas through a cohesive presentation and storytelling framework.",
    updated: siteUpdated,
    primaryLinks: [
      {
        label: "Google Slides Template",
        description: "Finalized and ready for stakeholder use.",
        href: "https://docs.google.com/presentation/d/1OshHDffRLd2498_qE3Nqkty_gHhTy6So/edit?slide=id.g3f5ad54fc94_3_663#slide=id.g3f5ad54fc94_3_663",
        provider: "slides",
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
          {
            kind: "copyablePrompt",
            title: "Copy-ready analysis prompt",
            introduction:
              "Attach the new CSV files, then use this prompt to preserve the same evidence standards, QA checks, and reporting structure as the prior execution.",
            prompt: `I’m attaching new CSV files. Recreate the same level of rigor and structure as this prior execution example:
https://drive.google.com/drive/folders/1ahbPceqKm8xHHOoxxR0xuQSrjGccrU1N?usp=sharing

Phase 1 — Descriptive analysis with \`research-viz\`:
- Inspect every CSV before analyzing: row count, columns, embedded headers, missingness, duplicate IDs, date windows, inclusion/exclusion flags, and unit of analysis.
- Use code for every count. Do not eyeball rows or type numbers manually.
- Produce one descriptive report per source/file where appropriate.
- Keep this phase descriptive only: no interpretation, theme claims, recommendations, or causal language.
- Include: data summary, how to read the report, cleaning log, column dictionary, closed-question distributions, NPS/top-2-box metrics where applicable, existing tag/label counts where applicable, literal word/phrase counts for text, verbatim library, figures, and reproducibility notes.
- Save artifacts: analysis code, results JSON/CSV, cleaning log, verbatim export, figures, and report output.
- Run QA assertions: counts sum to denominators, percentages reconcile, NPS bands sum to n, verbatim rows match source text counts, and figures match computed tables.

Phase 2 — Synthesis with \`research-synthesis\`:
- Only after Phase 1 passes QA, synthesize findings across the descriptive outputs.
- Separate strong evidence, directional evidence, and unresolved/low-confidence findings.
- Every synthesis claim must cite the source file/report it came from.
- Do not overgeneralize small samples or self-selected sources.

Phase 3 — Final narrative with \`root-brand-voice\`:
- Rewrite the final synthesis in Root’s internal VOC/reporting voice: plain, direct, evidence-backed, empathetic, and executive-readable.
- Keep sample sizes, caveats, source attribution, and confidence levels intact.
- Avoid slogans, marketing tone, unsupported recommendations, and AI-sounding flourish.

Before starting, give me a short execution plan and list any column-mapping questions you need answered. If the columns are clear, proceed without asking.`,
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
    summary:
      "An iterative, behavior-centered workflow for turning stakeholder inputs and observable evidence into reviewable research decisions.",
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
            text: "My research approach is centered around observable behavior. I believe that, beyond self-reported metrics, being able to observe users in a natural setting—such as through moderated usability testing and qualitative surveys—remains one of the best ways to understand and collect user data.",
          },
          {
            kind: "paragraph",
            text: "The metrics that matter depend on the decision I am trying to support. I look at measures such as success rate, time on task, assistance required, error frequency, conversion or drop-off, retention signals, and how often customer problems recur. I also consider sample quality, segment differences, and the limitations of each source.",
          },
          {
            kind: "paragraph",
            text: "For me, customer empathy is an active exercise. For example, when I want to understand whether a prototype makes sense, I would rather conduct an unmoderated usability test than ask users whether they feel the solution is appropriate. This lets me see whether, in practice and without supervision or support from the research team, users carry out the behavior we expected. I can then use follow-up questions to better understand what happened.",
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
        id: "data-analysis-workflow",
        title: "Data Analysis Workflow",
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
    ],
  },
  {
    slug: "internship-reflection",
    group: "Research practice",
    order: 11,
    title: "Insights",
    summary:
      "The most important lessons I developed about connecting evidence to product decisions, communicating data clearly, iterating with stakeholders, and building research systems that others can use.",
    updated: siteUpdated,
    sections: [
      {
        id: "product-roadmaps",
        title: "Product Roadmaps",
        blocks: [
          {
            kind: "paragraph",
            text: "One of my most important lessons is that research findings represent the beginning of a product design journey. To create impact, I need to work closely with product partners to understand the current roadmap, its constraints, and the quickest credible opportunities to address immediate customer pain points. Learning to connect evidence with sequencing, feasibility, and ownership has made me a stronger researcher and a more thoughtful designer, especially because I work across both disciplines.",
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
    updated: siteUpdated,
    sections: [
      {
        id: "artifact-inventory",
        title: "Artifact inventory",
        blocks: [
          {
            kind: "statusGrid",
            items: [
              {
                title: "VOC Quarterly Report (Q1-26)",
                text: "Completed Figma presentation, V7 export, and reusable reporting principles.",
                href: q1PrototypeHref,
              },
              {
                title: "VOC Quarterly Report (Q2-26)",
                text: "Working structure and source inventory established; findings and final review remain open.",
                href: "https://www.figma.com/design/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?node-id=2546-1804",
              },
              {
                title: "VOC Dashboard",
                text: "Completed Lovable dashboard prototype, ready for stakeholder review and editor collaboration.",
                href: dashboardPreviewHref,
              },
              {
                title: "VOC Customer Quote Library",
                text: "Multi-source evidence inventory and access points for 21 deidentified Q1 clips.",
                href: "/customer-quote-library",
              },
              {
                title: "NPS Executive Report (Q1-26)",
                text: "Completed Q1 2026 executive report delivered to Jill.",
                href: "https://www.figma.com/proto/cN9IgxIRTOnBOMJf4tKMeH/Voice-of-Customer--VOC-?page-id=1861%3A3298&node-id=1861-3299&p=f&viewport=-168%2C128%2C0.17&t=gF482mM1I1lkZy3Z-1&scaling=contain&content-scaling=fixed",
              },
              {
                title: "UXR Documentation",
                text: "Completed onboarding and operating playbook with a supporting interactive project.",
                href: "https://lovable.dev/projects/147235d4-c281-47cf-b008-6d33c4bf3bae",
              },
              {
                title: "Presentation Template",
                text: "Finalized Google Slides template, team-owned Figma template, and editable VOC design-system workspace.",
                href: "https://docs.google.com/presentation/d/1OshHDffRLd2498_qE3Nqkty_gHhTy6So/edit?slide=id.g3f5ad54fc94_3_663#slide=id.g3f5ad54fc94_3_663",
              },
              {
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
              "Confirm the long-term owner for every artifact.",
              "Verify access to Figma, Drive recordings, research notes, the AI Skills folder, the dashboard GitHub repository, and Vercel.",
              "Pilot the onboarding documentation with a new team member and assign chapter owners.",
              "Who will own the completed VOC presentation system and approve future changes?",
              "Who will own the evidence library, onboarding playbook, and their permission or content reviews?",
              "Which Q2 findings require another research round before publication?",
              "Confirm which data sources and metrics are approved for the first operational dashboard version, then identify who can help publish the VOC dashboard at a permanent URL so stakeholders are not dependent on a seven-day preview link.",
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
