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

export type RecordingEntry = {
  title: string;
  period: string;
  theme: string;
  summary: string;
  href: string;
};

export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "flow"; items: string[] }
  | { kind: "subheading"; text: string }
  | { kind: "quote"; label: string; text: string }
  | { kind: "formula"; expression: string; description: string }
  | { kind: "links"; items: ResourceLink[] }
  | { kind: "quoteGrid"; items: CustomerQuoteEntry[] }
  | { kind: "recordings"; items: RecordingEntry[] };

export type VisualKind =
  | "insurance-loop"
  | "team-network"
  | "research-rhythm"
  | "evidence-triangulation"
  | "retention-journey";

export type OnboardingGroup =
  | "Start here"
  | "Research programs"
  | "Training"
  | "Resources";

export type OnboardingSection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  visual?: VisualKind;
};

export type OnboardingPage = {
  slug: string;
  group: OnboardingGroup;
  order: number;
  title: string;
  summary: string;
  updated: string;
  sections: OnboardingSection[];
};

const updated = "Last Updated: Jul 27, 2026";

export const onboardingPages: OnboardingPage[] = [
  {
    slug: "insurance-basics",
    group: "Start here",
    order: 1,
    title: "Insurance basics",
    summary:
      "The financial and legal mechanisms that shape the realities of Root customers.",
    updated,
    sections: [
      {
        id: "core-insurance-mechanisms",
        title: "Core insurance mechanisms",
        visual: "insurance-loop",
        blocks: [
          {
            kind: "paragraph",
            text: "To design experiences that respect our users’ realities, first master the baseline financial and legal structures that shape their behavior. Auto insurance at Root is defined by a few core mechanisms.",
          },
          {
            kind: "list",
            items: [
              "Premium: The recurring fee a customer pays to maintain active policy coverage.",
              "Deductible: The defined out-of-pocket amount a customer must pay before Root covers a loss following a claim.",
              "Collision coverage: Protects the policyholder’s vehicle by covering repair or replacement costs after a crash with another vehicle or physical object, independent of who is at fault.",
              "Comprehensive coverage: Pays for non-collision damage caused by theft, vandalism, extreme weather, fire, falling objects, or animal impacts.",
              "Liability coverage — bodily injury: Required by law in most states, this covers medical expenses and legal defense costs for other people injured in an accident where the policyholder is at fault. It does not cover the policyholder’s own injuries or vehicle damage.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "team",
    group: "Start here",
    order: 2,
    title: "Meet the team",
    summary:
      "The research, design, product, data, operations, and leadership partners who make insights actionable.",
    updated,
    sections: [
      {
        id: "research-and-design",
        title: "UX Research & Design cores",
        visual: "team-network",
        blocks: [
          {
            kind: "paragraph",
            text: "Research cannot operate in a vacuum. Coordinate regular touchpoints across this cross-functional network so insights can influence the product roadmap.",
          },
          {
            kind: "list",
            items: [
              "Hala Daher — UX Researcher & Onboarding Buddy: Your primary peer connection for research workflow execution, peer-review loops, and qualitative methodology alignment.",
              "Julie Harrison — UXR VOC Lead: Coordinates Voice of the Customer frameworks and high-level stakeholder requirements.",
              "Klew Still — UX Design Systems Lead: Connect with Klew so reporting and wireframes make effective use of the internal Beacon Design System.",
              "Product Design Partners — Ryan Farnham, Mike Parra, Joey Yim: Visual and content design partners who translate behavioral problem spaces into wireframes and mobile user flows.",
            ],
          },
        ],
      },
      {
        id: "product-and-data",
        title: "Cross-functional product & data allies",
        blocks: [
          {
            kind: "list",
            items: [
              "Product Managers: Coordinate with Tiffany Meyer (Onboarding), Brandon Hill (Policyholder Experience / Policy Billing and Servicing), and Gabrielle Calderon (Market Carrier Management) to integrate findings into six-week product-cycle backlogs.",
              "Analytics Managers & Data Buddies — Pranil Deone, Matthew Gray: Partners who write SQL queries and parse data-warehouse schemas. Work with them to cross-check qualitative themes against macro-level tracking.",
              "Customer Experience & Operations — Olu Roberts, Jennifer Heady, Chris Lohrman, Heidi Roark: Customer service and operations leads who provide exposure to downstream complaints, chat transcripts, and support escalations.",
              "Claims Management — Christina Ward, Tyler E.: Operational contacts for observing behavior during critical, high-stress moments such as claim-loss processing.",
            ],
          },
        ],
      },
      {
        id: "executive-leadership",
        title: "Executive leadership",
        blocks: [
          {
            kind: "list",
            items: [
              "Jill Kellett — VP of Product: Aligns customer-experience metrics with business performance so user satisfaction supports board-level reporting.",
              "Executive Stakeholders — Matt Bonakdarpour, President/CTO; Alex Timm, CEO; Kyle Schmitt, VP of Data Science: Core consumers of synthesized research readouts who rely on unambiguous user insights to guide company strategy.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "operating-procedures",
    group: "Start here",
    order: 3,
    title: "Operating procedures",
    summary:
      "The rhythms, tools, access requirements, and administrative practices that keep research moving.",
    updated,
    sections: [
      {
        id: "operational-rhythms",
        title: "Departmental operational rhythms",
        visual: "research-rhythm",
        blocks: [
          {
            kind: "list",
            items: [
              "The six-week business cycle: Root structures product engineering around fixed six-week cycles. Research plans should align with these windows so engineering resources are available to act on findings.",
              "Jira outcome tracking: Task tracking occurs in biweekly product sprints. UX Researchers use Jira to track high-level weekly outcomes rather than granular daily task lists.",
              "Asynchronous communication protocol: Post daily status logs and weekly progress summaries in team Slack channels to maintain transparency across fully remote cohorts.",
            ],
          },
        ],
      },
      {
        id: "tooling-and-access",
        title: "Tooling access & provisioning",
        blocks: [
          {
            kind: "paragraph",
            text: "Submit access requests through Okta on day one for the core research infrastructure below.",
          },
          {
            kind: "list",
            items: [
              "Figma / FigJam: The primary workspace for design systems, journey mapping, and executive presentation building.",
              "Productboard: The central repository for customer insights, feature-backlog hierarchies, and product-strategy roadmaps.",
              "Sprig: The deployment engine for in-product intercept surveys and localized feedback prompts.",
              "Qualtrics: The platform for consumer benchmarks, independent-agent surveys, and multi-state questionnaire pipelines.",
              "Lookback: The remote-testing portal for video recordings, moderated screen flows, and live usability sessions.",
              "Mode Analytics: The browser-based interface for running SQL queries against the Enterprise Data Warehouse and verifying funnel-volume metrics.",
              "Admin Dashboard / Customer Service Dashboard: Internal tools for investigating policy accounts and safely simulating pre-bind and post-bind customer states.",
            ],
          },
        ],
      },
      {
        id: "administrative-policies",
        title: "Core administrative policies",
        blocks: [
          {
            kind: "list",
            items: [
              "Timekeeping compliance: Non-exempt employees and interns must enter timecards daily in Rippling, verify all biweekly shifts, and sign off before 9:00 AM ET on the Monday after the pay period closes.",
              "Out-of-office protocol: For an absence of one day or longer, notify your manager in advance, update Slack status, decline conflicting meetings, and formally log the request in Workday.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "voice-of-customer",
    group: "Research programs",
    order: 4,
    title: "Voice of the Customer",
    summary:
      "How Root combines quantitative signals and qualitative evidence into decisive customer narratives.",
    updated,
    sections: [
      {
        id: "program-overview",
        title: "Program overview",
        blocks: [
          {
            kind: "paragraph",
            text: "The Voice of the Customer program is Root’s strategic feedback engine. It modernizes how the company systematically measures and internalizes customer sentiment, then connects that evidence to decisions.",
          },
        ],
      },
      {
        id: "triangulation",
        title: "Methodological triangulation",
        visual: "evidence-triangulation",
        blocks: [
          {
            kind: "list",
            items: [
              "The “what vs. why” hierarchy: Use large-scale quantitative data — Qualtrics benchmarks, app-store reviews, and Sprig intercepts — to isolate what is happening. Pair those signals with targeted qualitative research — Lookback clips and interview verbatims — to explain why.",
              "The Net Promoter Score mandate: Use NPS as one narrative spine, not a universal truth. Always preserve the source, denominator, relationship segment, and limitations behind the score.",
              "Problem-oriented execution: Keep deliverables focused on root-cause analysis. Map the scale and isolate the cause; product design owns finalized interface solutions and prototypes.",
              "Granular competitor benchmarking: Avoid generic labels such as “incumbents” or “insurtech.” Name carriers such as GEICO, Progressive, and Lemonade so competitive intelligence is actionable.",
            ],
          },
        ],
      },
      {
        id: "communication-guidelines",
        title: "Communication & copywriting",
        blocks: [
          {
            kind: "paragraph",
            text: "Executive research readouts should be decisive, scannable, and honest about the strength of the evidence.",
          },
          {
            kind: "quote",
            label: "Legacy style",
            text: "The outlook on telematics is mixed, with some customers perceiving the potential benefit of price reduction but others identifying the risk of premium increase as a result.",
          },
          {
            kind: "quote",
            label: "Root’s stance",
            text: "Customer perception of telematics is highly correlated to price. Customers perceive telematics as a positive feature only when it helps them get discounts.",
          },
          {
            kind: "list",
            items: [
              "Take a definitive stance: Remove ambivalent, passive, or overly safe language that dilutes meaning.",
              "Use ascending visual rank: Put the lowest-performing metrics, drop-offs, and critical complaints at the top of graphs so failures receive immediate attention.",
              "Prioritize scannable summaries: Begin every slide with a concise executive summary. Limit each slide to one primary message, no more than three bullets, and one clear chart.",
              "Simplify readability: Remove academic language and corporate jargon. Write with direct, high-school-level clarity.",
            ],
          },
        ],
      },
      {
        id: "operational-workflows",
        title: "Operational VOC workflows",
        blocks: [
          {
            kind: "list",
            items: [
              "Collaborative vendor model: 10/10 Research handles large-scale data collection, panel cleaning, and raw sampling. The internal research team owns strategic validation, Root-specific alignment, and storytelling.",
              "Searchable evidence repositories: Avoid manual note transcription as the only record. Store interviews in an indexed library with descriptive titles, source locators, and annotated Lookback recordings so themes can be audited later.",
              "Close the loop: Record the decision, owner, due date, and follow-up measure attached to each accepted insight.",
            ],
          },
          {
            kind: "links",
            items: [
              {
                label: "Learn the reproducible analysis workflow",
                description:
                  "Profile, clean, calculate, audit, and triangulate a new VOC dataset.",
                href: "/voc-analysis-workflow",
              },
              {
                label: "Open the Customer Quote Library",
                description:
                  "Review governed customer evidence and access-controlled recordings.",
                href: "/customer-quote-library",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "customer-retention",
    group: "Research programs",
    order: 5,
    title: "Customer retention",
    summary:
      "The journey moments, behavioral drivers, and system friction that determine whether customers stay.",
    updated,
    sections: [
      {
        id: "journey-friction",
        title: "Funnel journey friction mapping",
        visual: "retention-journey",
        blocks: [
          {
            kind: "paragraph",
            text: "The research team identifies downstream drop-offs across Root’s web and mobile experiences. Track behavior across the standard customer funnel.",
          },
          {
            kind: "flow",
            items: [
              "Installs",
              "Accounts",
              "Prefills",
              "Profiles",
              "Rates",
              "Underwriting",
              "Policies",
              "Claims",
            ],
          },
          {
            kind: "paragraph",
            text: "Research focuses on five critical journey moments: Apply & Quote, Onboarding, Claims, Renewal, and Cancellation.",
          },
        ],
      },
      {
        id: "behavioral-drivers",
        title: "Key retention insights & behavioral drivers",
        blocks: [
          {
            kind: "list",
            items: [
              "Acquisition vs. retention: Balance customer discoverability — including partner aggregators such as Carvana and Insurify — against the high financial value of retention. Retaining customers reduces ad-spend shocks and protects margins against price-sensitive shoppers.",
              "Telematics comprehension threshold: Rapid Iterative Testing disproved the assumption that users only want to skip to a rate. Users actively seek to understand telematics rules. Clear explanations of scoring and privacy improve trust and reduce cognitive effort.",
              "Telematics tracking anomalies: Renewal friction often comes from inaccurate driver-versus-passenger detection. Customers become frustrated when penalized for phone use or driving metrics while riding in an Uber, walking, or using public transportation.",
              "Billing architecture impacts: Quantitative logs connect rigid monthly lump-sum payments with cancellation. Flexible biweekly paths that align with real payroll cycles can prevent churn.",
            ],
          },
        ],
      },
      {
        id: "customer-voice",
        title: "What retention friction sounds like",
        blocks: [
          {
            kind: "quote",
            label: "Billing research · Q3 2025",
            text: "If I had been able to manage the payment by maybe paying it twice a month, I think I probably still would be with Root right now.",
          },
          {
            kind: "quote",
            label: "Q1 2026 customer interview",
            text: "When they initiate things, kind of hold your hand, and walk you through. You know, it feels like they care about you. I don’t like when they expect you to do the footwork.",
          },
          {
            kind: "paragraph",
            text: "These quotes illustrate mechanisms already supported by the broader evidence: payment flexibility, proactive guidance, and fast human support can all affect whether a customer feels able and willing to stay. Quotes explain the experience; they do not establish prevalence on their own.",
          },
        ],
      },
    ],
  },
  {
    slug: "voc-analysis-workflow",
    group: "Training",
    order: 6,
    title: "VOC analysis workflow",
    summary:
      "A reproducible, source-by-source method for turning raw customer data into auditable findings.",
    updated,
    sections: [
      {
        id: "required-workflow",
        title: "Required source-by-source workflow",
        blocks: [
          {
            kind: "paragraph",
            text: "Treat each source as its own piece of evidence before building a cross-source story. Do not normalize away disagreement or average incompatible measures.",
          },
          {
            kind: "list",
            items: [
              "1. Preserve the original: Keep the raw export read-only, identify the canonical version, and record its filename and retrieval date. Recompute reported numbers from that source.",
              "2. Profile the source: Record the unit of analysis, population, field period, dimensions, identifiers, missingness, duplicates, completion patterns, valid ranges, sampling method, and any quality flags.",
              "3. Remove only documented artifacts: Keep a cleaning log that names every exclusion and its effect on the base.",
              "4. Produce one descriptive result per source: Show counts, denominators, missing values, and segment bases before comparing sources.",
              "5. Lock the metric contract: Define the unit, denominator, filters, relationship segment, missing-value treatment, and rounding before charting.",
              "6. Save reproducible counts: Keep the counts table or query, then hand-check a small set of rows against the original export.",
              "7. Triangulate after limitations are explicit: Treat disagreement between sources as a finding, not a reason to blend them.",
            ],
          },
          {
            kind: "quote",
            label: "Field note",
            text: "A cleaning log and reproducible counts table are part of the research output, not background paperwork.",
          },
        ],
      },
      {
        id: "q1-source-roles",
        title: "Source roles in Q1 2026",
        blocks: [
          {
            kind: "list",
            items: [
              "10/10 DTC benchmark: 528 current policyholders across nine carriers. Root’s quota was 13, so Root-specific results are directional.",
              "Marketing Brand Tracker: 511 Root ratings, including 410 people who had never purchased Root. The aggregate mostly reflects brand or reputation, not current-customer experience.",
              "Independent Agent survey: 33 agents. Use it as directional evidence about the agent experience.",
              "App reviews: 159 self-selected reviews with a negative skew. Use them to identify failure modes and customer language, not prevalence.",
              "Customer interviews: Three participants. Use them to understand mechanisms, emotion, and language; never use them for percentages or demand estimates.",
            ],
          },
        ],
      },
      {
        id: "version-and-quality",
        title: "Version & quality lessons",
        blocks: [
          {
            kind: "list",
            items: [
              "Reconcile every reported base: An earlier deck showed 16 Root DTC responses, while the canonical workbook contained 13. The workbook base governs until a documented correction says otherwise.",
              "Do not invent exclusion rules: The DTC file included an unresolved DataQualityScore flag. Report a sensitivity view, but do not exclude cases until the flag’s meaning is verified.",
              "Keep the denominator reproducible: A reviewer should be able to follow the saved logic from the original export to every displayed percentage or score.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "nps-worked-example",
    group: "Training",
    order: 7,
    title: "NPS worked example",
    summary:
      "An audited small-sample example that shows how to calculate, label, and interpret NPS responsibly.",
    updated,
    sections: [
      {
        id: "metric-contract",
        title: "Lock the metric contract",
        blocks: [
          {
            kind: "formula",
            expression:
              "NPS = 100 × (Promoters − Detractors) ÷ valid responses",
            description:
              "Promoters score 9–10, passives score 7–8, and detractors score 0–6.",
          },
          {
            kind: "paragraph",
            text: "Before calculating, document the survey question, valid range, unit of analysis, valid-response denominator, relationship segment, filters, missing-value treatment, and rounding rule.",
          },
        ],
      },
      {
        id: "audited-q1-example",
        title: "Audited Q1 2026 example",
        blocks: [
          {
            kind: "list",
            items: [
              "DTC benchmark — Root current customers: 4 promoters, 7 passives, and 2 detractors; n = 13; NPS = +15.4.",
              "Brand Tracker — current customers: 19 promoters, 7 passives, and 3 detractors; n = 29; NPS = +55.2.",
              "Brand Tracker — former customers: n = 72; NPS = 0.0.",
              "Brand Tracker — never purchased: n = 410; NPS = −44.6.",
              "Base reconciliation: 29 current + 72 former + 410 never purchased = 511 total ratings.",
            ],
          },
        ],
      },
      {
        id: "interpretation-rules",
        title: "Interpretation rules",
        blocks: [
          {
            kind: "list",
            items: [
              "Treat the DTC and Brand Tracker results as independent directional estimates. Never blend or pool them.",
              "Label every result with its source, valid n, relationship segment, and limitations.",
              "Interpret the Brand Tracker aggregate as brand or reputation because 80.2% of its respondents had never purchased Root.",
              "Treat segment bases below 30 as directional. A point estimate can be exact while still being unstable.",
              "Do not call four small waves — n = 10, 4, 7, and 8 — a stable trend.",
              "Current and former customers are different groups, not a before-and-after cohort.",
              "Use confidence intervals as descriptive uncertainty, not proof that one experience caused another.",
            ],
          },
          {
            kind: "quote",
            label: "Field note",
            text: "Combine conclusions, not metrics. Two sources can support the same story without becoming the same measure.",
          },
        ],
      },
    ],
  },
  {
    slug: "evidence-storytelling",
    group: "Training",
    order: 8,
    title: "Evidence storytelling",
    summary:
      "How to make customer pain, desire, and lived experience understandable without overstating the evidence.",
    updated,
    sections: [
      {
        id: "narrative-purpose",
        title: "Build an evidence-led narrative",
        blocks: [
          {
            kind: "paragraph",
            text: "Use NPS as one narrative spine, trust as a recurring theme, and retention or business value as the stake. Do not invent financial impact. Quantitative evidence establishes what is happening; qualitative evidence explains why and how it feels.",
          },
        ],
      },
      {
        id: "repeatable-story-unit",
        title: "The repeatable story unit",
        blocks: [
          {
            kind: "flow",
            items: [
              "Fact",
              "Meaning",
              "Human evidence",
              "Customer desire",
              "Implication",
            ],
          },
          {
            kind: "list",
            items: [
              "Fact: State the measured pattern with the source, base, and caveat.",
              "Meaning: Explain what the pattern suggests about the customer experience.",
              "Human evidence: Add an exact, deidentified quote or clip that makes the mechanism understandable.",
              "Customer desire: Name the control, reassurance, clarity, or flexibility customers are asking for.",
              "Implication: Connect the evidence to a decision without prescribing an unsupported solution.",
            ],
          },
        ],
      },
      {
        id: "evidence-and-delivery",
        title: "Evidence & delivery requirements",
        blocks: [
          {
            kind: "list",
            items: [
              "A quote illustrates a verified pattern; it never establishes prevalence by itself.",
              "Preserve the exact wording, deidentify the speaker, record the field date and source locator, and label the quote’s evidence role.",
              "Show where sources agree and where they disagree. Disconfirming evidence belongs in the analysis.",
              "Use one message, no more than three bullets, one clear chart, and a visible source, n, and caveat for each executive slide.",
              "Use Figma for quarterly research reporting and Google Slides for Executive or Board delivery when that is the expected stakeholder format.",
            ],
          },
          {
            kind: "quote",
            label: "Field note",
            text: "A quote earns its place when it makes a verified pattern understandable and reveals the control or reassurance the customer wants.",
          },
        ],
      },
    ],
  },
  {
    slug: "ai-research-playbook",
    group: "Training",
    order: 9,
    title: "AI-assisted research",
    summary:
      "A governed workflow for using AI to accelerate analysis while keeping human ownership of evidence and claims.",
    updated,
    sections: [
      {
        id: "required-skill-order",
        title: "Required skill order",
        blocks: [
          {
            kind: "flow",
            items: [
              "research-viz",
              "research-synthesis",
              "root-brand-voice",
            ],
          },
          {
            kind: "paragraph",
            text: "Use the research-viz skill to inspect and express evidence, research-synthesis to assemble cross-source findings, and root-brand-voice only after the claims are stable. Voice should never outrun validity.",
          },
        ],
      },
      {
        id: "approachable-workflow",
        title: "Approachable workflow for a new dataset",
        blocks: [
          {
            kind: "list",
            items: [
              "Frame the decision: Write the stakeholder decision, target population, and required evidence before opening the data.",
              "Use an approved environment: Confirm that the Root-approved AI environment and data class are compatible.",
              "Profile the source: Inventory rows, fields, identifiers, missingness, duplicates, bases, and quality flags.",
              "Lock the metric contract: Define the unit, denominator, filters, segments, missing-value treatment, and rounding.",
              "Prepare qualitative evidence: Preserve exact source locators and existing human codes.",
              "Use AI as a proposal engine: It may suggest a codebook or coding with rationale and confidence, but a researcher reviews low-confidence cases, disagreements, disconfirming evidence, and roughly 20% of coded material through double-coding.",
              "Aggregate reproducibly: Keep saved counts, transformations, and an evidence matrix that connects every claim to its source.",
              "Build and audit the story: Apply the evidence-story unit, conduct an independent claim audit, and record the decision and follow-up owner.",
            ],
          },
        ],
      },
      {
        id: "data-handling-gate",
        title: "AI data-handling gate",
        blocks: [
          {
            kind: "list",
            items: [
              "Use only a Root-approved AI environment for the data class.",
              "Remove or mask names, contact details, policy identifiers, payment identifiers, and unrestricted recording links.",
              "Provide the minimum fields needed for the analysis.",
              "Pause when approval, consent, or allowed use is unclear.",
            ],
          },
          {
            kind: "quote",
            label: "Field note",
            text: "AI assists. The researcher still owns the metric contract, human review, claims, and data handling.",
          },
        ],
      },
    ],
  },
  {
    slug: "customer-quote-library",
    group: "Resources",
    order: 10,
    title: "Customer Quote Library",
    summary:
      "A governed, searchable evidence layer for exact customer language, themes, source context, and recordings.",
    updated,
    sections: [
      {
        id: "library-purpose",
        title: "How to use this library",
        blocks: [
          {
            kind: "paragraph",
            text: "This library curates customer language from the VOC source material so researchers can find evidence without stripping it of provenance. It is an internal research resource: confirm consent, approved use, and access level before placing a quote or recording into a broader deliverable.",
          },
          {
            kind: "list",
            items: [
              "A complete entry includes the exact verbatim, study and field date, deidentified segment or lifecycle stage, theme or mechanism, evidence role, source locator or timestamp, connected quantitative pattern, sample limitation, exact-match status, consent or approved use, and reviewer/date.",
              "Do not publish incomplete placeholders, customer names, unrestricted recording links, or sensitive policy and payment details in a broad-access layer.",
              "A memorable line is not automatically evidence. Preserve the locator, evidence role, and limitation that make it auditable.",
            ],
          },
        ],
      },
      {
        id: "customer-recordings",
        title: "Q1 2026 customer recordings",
        blocks: [
          {
            kind: "paragraph",
            text: "The three access-controlled Lookback sessions below open in the recording provider. Use them to understand tone, hesitation, and context; cite a timestamp before reusing a clip.",
          },
          {
            kind: "recordings",
            items: [
              {
                title: "Participant 1 · Test-drive skepticism",
                period: "Q1 2026",
                theme: "Telematics trust",
                summary:
                  "A customer describes skepticism about Root’s required driving trial and a rejected first attempt.",
                href: "https://lookback.io/play/qpzK47AyZGPfTzDE7",
              },
              {
                title: "Participant 2 · Human support",
                period: "Q1 2026",
                theme: "Service access",
                summary:
                  "A customer explains why chatbot-only help feels inadequate and why speaking with a person still matters.",
                href: "https://lookback.io/play/PAg8bd26jergevcv5",
              },
              {
                title: "Participant 3 · Monitoring & care",
                period: "Q1 2026",
                theme: "Trust and reassurance",
                summary:
                  "A customer refuses to download the app because of monitoring concerns, then describes the proactive help that would feel caring.",
                href: "https://lookback.io/play/hbdMNbJCUJm3LMxhH",
              },
            ],
          },
        ],
      },
      {
        id: "trust-and-telematics",
        title: "Trust, transparency & telematics",
        blocks: [
          {
            kind: "quoteGrid",
            items: [
              {
                quote:
                  "I was a little skeptical at first because when I first tried Root, they wanted me to drive first to see my driving habits. So the first time I drove, Root would not accept me.",
                theme: "Test-drive skepticism",
                source: "VOC interview · Participant 1",
                period: "Q1 2026",
                context:
                  "Illustrates the trust cost of an unexplained driving trial; not a prevalence estimate.",
              },
              {
                quote:
                  "What I heard is that some apps monitor your driving. And they just find ways to make your rate go up. So... that’s why I didn’t touch the app.",
                theme: "Monitoring fear",
                source: "VOC interview · Participant 3",
                period: "Q1 2026",
                context:
                  "The participant declined to download the app during the session.",
              },
              {
                quote:
                  "I don't trust insurers to have the best interests of their consumers. There's no transparency of what we pay for.",
                theme: "Industry trust",
                source: "Rebrand research · Participant 1",
                period: "Q2 2026",
                context:
                  "Illustrative language about transparency and insurer incentives.",
              },
            ],
          },
        ],
      },
      {
        id: "human-support",
        title: "Human support & feeling cared for",
        blocks: [
          {
            kind: "quoteGrid",
            items: [
              {
                quote:
                  "There's no actual phone number for me to talk to someone, and I had to look the phone number up. I may have questions that the chatbot is not familiar with. You know, and I'm just old school.",
                theme: "Human support",
                source: "VOC interview · Participant 2",
                period: "Q1 2026",
                context:
                  "Illustrates why a chatbot-only path can feel insufficient.",
              },
              {
                quote:
                  "When they initiate things, kind of hold your hand, and walk you through. You know, it feels like they care about you. I don’t like when they expect you to do the footwork. I feel appreciated when I can contact a human being quickly.",
                theme: "Proactive care",
                source: "VOC interview · Participant 3",
                period: "Q1 2026",
                context:
                  "Connects proactive guidance and fast human access with feeling valued.",
              },
              {
                quote:
                  "A part of me feels like I don't know how to connect with Lemonade. Picking up the phone and talking to somebody, I don't know how to do that, but maybe that's what I'm paying for.",
                theme: "Service visibility",
                source: "Rebrand research · Participant 1",
                period: "Q2 2026",
                context:
                  "Competitor evidence about the value of an obvious human-support path.",
              },
            ],
          },
        ],
      },
      {
        id: "affordability-and-retention",
        title: "Affordability, flexibility & retention",
        blocks: [
          {
            kind: "quoteGrid",
            items: [
              {
                quote:
                  "If I had been able to manage the payment by maybe paying it twice a month, I think I probably still would be with Root right now.",
                theme: "Payment flexibility",
                source: "Billing research",
                period: "Q3 2025",
                context:
                  "Illustrates the mechanism connecting payment cadence and preventable churn.",
              },
              {
                quote:
                  "I recently lost my husband, and all these companies raised my rates. I'm going through enough. Feels like being punished. Thinking downsizing would save money, but it did the opposite. Logically, it makes no sense.",
                theme: "Life-event affordability",
                source: "Rebrand research · Participant 1",
                period: "Q2 2026",
                context:
                  "Sensitive life context; use only in approved, deidentified settings.",
              },
              {
                quote:
                  "The average consumer wants the best deal for their family and personal situation. If they can say they are high quality, simple, and affordable, then that's the message they need to send.",
                theme: "Value proposition",
                source: "Rebrand research · Participant 1",
                period: "Q2 2026",
                context:
                  "Illustrative language about simplicity, affordability, and quality.",
              },
            ],
          },
        ],
      },
      {
        id: "source-repositories",
        title: "Source repositories",
        blocks: [
          {
            kind: "paragraph",
            text: "These source files contain additional quotes and context. Access depends on your Root account and the permissions of the original study.",
          },
          {
            kind: "links",
            items: [
              {
                label: "Q1 2026 VOC report",
                description:
                  "Quarterly findings, customer evidence, and presentation context.",
                href: "https://docs.google.com/presentation/d/1dUaI8HeGenU9K8fZ9wiiDMFfcncDxuMn2x7H0wPsP5Y/edit?slide=id.gaba82d8a63_0_493#slide=id.gaba82d8a63_0_493",
              },
              {
                label: "Q2 2026 rebrand interview evidence",
                description:
                  "Deidentified participant verbatims and study notes.",
                href: "https://docs.google.com/spreadsheets/d/1l4Z6JH0m-OE6iJYUYuVQ4AXdh8zRt8LU8vQa3O62I68/edit?gid=1135818415#gid=1135818415",
              },
              {
                label: "Sprig response repository",
                description:
                  "In-product feedback covering cancellation, payment, renewal, claims, and proof-of-insurance friction.",
                href: "https://app.sprig.com/ex-NBvl3Oc6q/survey/356212/data",
              },
              {
                label: "Customer survey quote sheet",
                description:
                  "Customer language about savings, loyalty, payment stress, and family needs.",
                href: "https://docs.google.com/spreadsheets/d/1UcoFnseHQjTYgXwEnX1564HPy0PUdaaA39nCRLeIdNo/edit?gid=2071523604#gid=2071523604",
              },
              {
                label: "Billing research presentation",
                description:
                  "Q3 2025 evidence about payment cadence, rate changes, and retention.",
                href: "https://docs.google.com/presentation/d/1pxNNQ2e8T9VKvLVC2UEZ25rxTHiU7QWewx5YvYBSX8c/edit?slide=id.gb776ff643b_0_87#slide=id.gb776ff643b_0_87",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "slack-directories",
    group: "Resources",
    order: 11,
    title: "Slack directories",
    summary:
      "The active channels for collaboration, peer review, product context, and operational monitoring.",
    updated,
    sections: [
      {
        id: "ux-and-design",
        title: "Core UX & Design channels",
        blocks: [
          {
            kind: "paragraph",
            text: "Slack is the primary workspace for collaboration, operational visibility, and peer review. Join these channels and review them weekly.",
          },
          {
            kind: "list",
            items: [
              "#prd-dsn-mkt — Private: Cross-functional collaboration between research, design, and marketing leads.",
              "#design-research-intake — Public: Incoming pipeline where product teams submit tactical UXR requests.",
              "#customer-insights — Public: High-visibility stream of qualitative observations, app reviews, and raw customer quotes.",
              "#feedback — Public: Quality-assurance and anomaly channel for live system bugs and experience friction.",
            ],
          },
        ],
      },
      {
        id: "product-and-data-feeds",
        title: "Strategic product & data feeds",
        blocks: [
          {
            kind: "list",
            items: [
              "#product_managers — Private: Monitor cycle timelines and upcoming feature developments across product domains.",
              "#okrs — Public: Follow cross-company progress toward quarterly business objectives.",
              "#shipped — Public: Track live feature rollouts and production deployments.",
              "#qs-team-rrd-feed / #QDST: Quantitative research channels for data-science findings, risk models, and telematics adjustments.",
              "#data_science_analytics_triage: Request data-dictionary information or escalate Mode dashboard anomalies.",
            ],
          },
        ],
      },
      {
        id: "operations-hubs",
        title: "Funnel operations & monitoring hubs",
        blocks: [
          {
            kind: "list",
            items: [
              "#root-direct / #root-direct-triage: Real-time operational tracking for the mobile onboarding funnel.",
              "#claims_amigos: Product updates, research readouts, and operational metrics for claims-processing flows.",
              "#marketupdates: State-by-state tracking of rate adjustments and regional regulatory changes.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "knowledge-repositories",
    group: "Resources",
    order: 12,
    title: "Knowledge repositories",
    summary:
      "The onboarding files, glossaries, business reports, process guides, and research catalogs to keep close.",
    updated,
    sections: [
      {
        id: "glossaries",
        title: "Acronyms & corporate glossaries",
        blocks: [
          {
            kind: "paragraph",
            text: "Use these repositories to expand business context, decode company terminology, and review prior research.",
          },
          {
            kind: "list",
            items: [
              "Product Management Onboarding — Brandon Hill, Policyholder Experience.docx: Maps internal team structures across Policy Billing and Servicing and Market Operations.",
              "Product Management New Hire Onboarding — Tiffany Meyer.docx: Reviews historical onboarding goals, annual-planning inputs, and direct-to-consumer metric breakdowns.",
              "Root Platform Glossary: The centralized Confluence repository for insurance terminology, pricing jargon, and database names.",
            ],
          },
        ],
      },
      {
        id: "business-context",
        title: "Strategic business context",
        blocks: [
          {
            kind: "list",
            items: [
              "Root’s Form 10-K Performance Report: Details user volumes, advertising spend, rate adjustments, and the business need to prioritize retention over expensive acquisition.",
              "Licensed Customer Service Process Guide: Maps how support agents use internal dashboards and how those processes affect trust during moments of friction.",
            ],
          },
        ],
      },
      {
        id: "survey-and-tool-catalogs",
        title: "Departmental survey & tool catalogs",
        blocks: [
          {
            kind: "list",
            items: [
              "Voice of Customer Survey Catalog: The master index of customer-satisfaction questionnaires across auto, renters, and web funnels.",
              "Project Brief — Quarterly Customer Report Expectations: Archives stakeholder interviews about reporting gaps, presentation critiques, and desired future customer-experience reporting.",
              "VOC Dashboard: A working repository for quarter-over-quarter source profiles, counts, claims, and chart-ready evidence.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "voc-technical-appendix",
    group: "Resources",
    order: 13,
    title: "VOC technical appendix",
    summary:
      "Calculation notes, reusable templates, review checks, and sampling improvements for defensible VOC work.",
    updated,
    sections: [
      {
        id: "nps-uncertainty",
        title: "NPS uncertainty",
        blocks: [
          {
            kind: "formula",
            expression:
              "Standard error = 100 × √((p + d − (p − d)²) ÷ n)",
            description:
              "Here p and d are promoter and detractor proportions. A descriptive 95% interval is NPS ± 1.96 × standard error.",
          },
          {
            kind: "list",
            items: [
              "DTC Root current: NPS +15.4; approximate 95% interval −20.6 to +51.4; n = 13.",
              "Brand Tracker current: NPS +55.2; approximate 95% interval +30.6 to +79.7; n = 29.",
              "Brand Tracker aggregate: 115 promoters, 114 passives, 282 detractors; n = 511; NPS −32.7. Never-purchasers account for 80.2% of the base.",
              "The interval describes sampling uncertainty under simplifying assumptions. It does not repair quota, self-selection, coverage, or measurement limitations.",
            ],
          },
        ],
      },
      {
        id: "source-profile-template",
        title: "Source-profile template",
        blocks: [
          {
            kind: "list",
            items: [
              "Identity: Source owner, canonical filename, version, retrieval date, and field period.",
              "Population: Target population, recruitment or sampling method, inclusion criteria, and relationship segment.",
              "Structure: Unit of analysis, rows, fields, identifier behavior, duplicate pattern, and completion definition.",
              "Quality: Missingness, valid ranges, data-quality flags, cleaning actions, and unresolved questions.",
              "Use: Intended evidence role, limits, and the decisions this source can or cannot support.",
            ],
          },
        ],
      },
      {
        id: "metric-contract-template",
        title: "Metric-contract template",
        blocks: [
          {
            kind: "list",
            items: [
              "Metric name and business question.",
              "Source, field, valid range, and unit of analysis.",
              "Numerator, denominator, filters, and relationship segment.",
              "Missing-value, duplicate, weighting, and quality-flag treatment.",
              "Rounding, uncertainty method, minimum base, and display caveat.",
              "Saved query or counts table, reviewer, and approval date.",
            ],
          },
        ],
      },
      {
        id: "qual-review",
        title: "Qualitative codebook & human review",
        blocks: [
          {
            kind: "list",
            items: [
              "Codebook fields: Code name, definition, inclusion criteria, exclusion criteria, positive example, negative example, and parent theme.",
              "AI-assisted coding record: Proposed code, rationale, confidence, source locator, and human disposition.",
              "Human review: Double-code roughly 20% of material, inspect every low-confidence item, resolve disagreements, and search explicitly for disconfirming evidence.",
              "Quote check: Confirm exact match, deidentification, source locator, evidence role, limitation, consent or approved use, reviewer, and date.",
            ],
          },
        ],
      },
      {
        id: "audit-templates",
        title: "Claim, quote & audit templates",
        blocks: [
          {
            kind: "list",
            items: [
              "Claim matrix: Claim, decision relevance, supporting sources, conflicting sources, exact counts, limitations, confidence, and owner.",
              "Quote record: Exact verbatim, deidentified segment, theme, evidence role, source locator, connected pattern, limitation, permission, and reviewer.",
              "Independent audit: Reproduce the base and calculation, trace each claim to its source, verify every quote, and challenge the strongest alternative explanation.",
              "Close-loop record: Decision, action owner, due date, success measure, follow-up source, and outcome.",
            ],
          },
        ],
      },
      {
        id: "quality-and-sampling",
        title: "Quality sensitivity & future sampling",
        blocks: [
          {
            kind: "list",
            items: [
              "Q1 sensitivity: All 13 Root DTC cases produce NPS +15.4. The eight cases with DataQualityScore 0 produce +25; the five cases with score 1 produce 0. Because the flag’s meaning is unverified, this is a sensitivity view, not an exclusion rule.",
              "Oversample Root current and former customers so relationship segments have interpretable bases.",
              "Ask an open-ended NPS-reason question immediately after the rating.",
              "Retain raw exports, quota plans, weights, cleaning logs, and saved calculations together.",
              "Use Sprig at meaningful journey moments and define minimum bases and decision thresholds before fieldwork.",
            ],
          },
        ],
      },
    ],
  },
];

export const onboardingGroups: OnboardingGroup[] = [
  "Start here",
  "Research programs",
  "Training",
  "Resources",
];

export function getOnboardingPage(slug: string) {
  return onboardingPages.find((page) => page.slug === slug);
}
