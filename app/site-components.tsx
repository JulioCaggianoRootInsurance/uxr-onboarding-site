"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  onboardingGroups,
  onboardingPages,
  type ContentBlock,
  type OnboardingPage,
  type VisualKind,
} from "./onboarding";

const updatedLabel = "Last Updated: Jul 27, 2026";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-rule" />
      <div className="footer-row">
        <p>Have any questions? Feel free to slack the @director of research</p>
        <span className="footer-mark" aria-hidden="true">
          root
        </span>
      </div>
    </footer>
  );
}

function IndexList() {
  return (
    <section className="index-section" aria-labelledby="onboarding-heading">
      <h2 className="index-title" id="onboarding-heading">
        Onboarding
      </h2>
      <ul className="index-groups">
        {onboardingGroups.map((group) => {
          const pages = onboardingPages.filter((page) => page.group === group);
          const shortGroup =
            group === "Start here"
              ? "Start"
              : group === "Research programs"
                ? "Research"
                : group === "Training"
                  ? "Training"
                  : "Tools";
          return (
            <li className="index-group" key={group}>
              <span className="group-label">
                <span className="group-label-full">{group}</span>
                <span className="group-label-short">{shortGroup}</span>
              </span>
              <ul>
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`} className="index-link">
                      <span className="index-name">
                        {page.title}
                        {page.order === 1 ? (
                          <span className="start-note">Start here</span>
                        ) : null}
                      </span>
                      <span className="index-number">
                        {String(page.order).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function HomePage() {
  const introChildren = [
    <header className="article-header" key="header">
      <h1>Root UX Research Onboarding</h1>
      <time dateTime="2026-07-27">{updatedLabel}</time>
    </header>,
    <p key="welcome">
      Welcome to the Root User Experience team. Our mission is to humanize
      insurance through deep user empathy, rigorous data validation, and
      strategic storytelling.
    </p>,
    <p key="role">
      As a UX Researcher at Root, you will help dismantle unfair, archaic, and
      complicated parts of the traditional insurance model by turning raw
      behavioral data into actionable product strategy.
    </p>,
    <p key="purpose">
      This site is your foundational onboarding playbook, research-methods
      training guide, and departmental operating manual.
    </p>,
    <p className="byline" key="byline">
      Prepared by UXR Interns Layilah Campbell and Julio Caggiano
    </p>,
  ];

  return (
    <div className="page-shell homepage">
      <a className="skip-link" href="#onboarding-heading">
        Skip to onboarding chapters
      </a>
      <article className="article home-article">
        {introChildren.map((child, index) => (
          <div
            className="stagger-item"
            style={{ "--delay": `${index * 50}ms` } as CSSProperties}
            key={index}
          >
            {child}
          </div>
        ))}
      </article>
      <div
        className="stagger-item"
        style={{ "--delay": "300ms" } as CSSProperties}
      >
        <IndexList />
      </div>
      <div
        className="stagger-item"
        style={{ "--delay": "350ms" } as CSSProperties}
      >
        <SiteFooter />
      </div>
    </div>
  );
}

function splitLabel(text: string): ReactNode {
  const colon = text.indexOf(":");
  if (colon < 1) return text;
  return (
    <>
      <strong>{text.slice(0, colon + 1)}</strong>
      {text.slice(colon + 1)}
    </>
  );
}

function Block({ block }: { block: ContentBlock }) {
  if (block.kind === "paragraph") {
    return <p>{block.text}</p>;
  }

  if (block.kind === "list") {
    return (
      <ul className="article-list">
        {block.items.map((item) => (
          <li key={item}>{splitLabel(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === "flow") {
    return (
      <ol className="funnel" aria-label="Customer journey funnel">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  if (block.kind === "subheading") {
    return <h3>{block.text}</h3>;
  }

  if (block.kind === "formula") {
    return (
      <div className="formula-card">
        <span>Formula</span>
        <p className="formula-expression">{block.expression}</p>
        <p>{block.description}</p>
      </div>
    );
  }

  if (block.kind === "links") {
    return (
      <ul className="resource-links">
        {block.items.map((item) => {
          const content = (
            <>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <span className="resource-arrow" aria-hidden="true">
                ↗
              </span>
            </>
          );

          return (
            <li key={item.href}>
              {item.href.startsWith("/") ? (
                <Link className="resource-link" href={item.href}>
                  {content}
                </Link>
              ) : (
                <a
                  className="resource-link"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  if (block.kind === "quoteGrid") {
    return (
      <div className="quote-library-grid">
        {block.items.map((item) => (
          <blockquote
            className="customer-quote-card"
            key={`${item.source}-${item.quote}`}
          >
            <p>“{item.quote}”</p>
            <footer>
              <span>{item.theme}</span>
              <small>
                {item.source} · {item.period}
              </small>
              {item.context ? <small>{item.context}</small> : null}
            </footer>
          </blockquote>
        ))}
      </div>
    );
  }

  if (block.kind === "videoLibrary") {
    return (
      <div className="video-library">
        {block.collections.map((collection, collectionIndex) => (
          <details
            className="video-collection"
            key={collection.participant}
            open={collectionIndex === 0}
          >
            <summary>
              <span className="video-summary-copy">
                <small>
                  {collection.period} · {collection.theme}
                </small>
                <strong>{collection.participant}</strong>
                <span>{collection.summary}</span>
              </span>
              <span className="clip-count">
                {collection.clips.length} clips
              </span>
            </summary>

            <div className="embedded-video-grid">
              {collection.clips.map((clip) => (
                <figure className="embedded-video-card" key={clip.driveId}>
                  <div className="embedded-video-frame">
                    <iframe
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      src={`https://drive.google.com/file/d/${clip.driveId}/preview`}
                      title={`${collection.participant} ${clip.label}`}
                    />
                  </div>
                  <figcaption>
                    <span>
                      {collection.participant} · {clip.label}
                    </span>
                    <a
                      href={`https://drive.google.com/file/d/${clip.driveId}/view`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open in Drive ↗
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>

            <a
              className="full-session-link"
              href={collection.fullSessionHref}
              rel="noreferrer"
              target="_blank"
            >
              Open the full Lookback session ↗
            </a>
          </details>
        ))}
      </div>
    );
  }

  return (
    <blockquote>
      <span>{block.label}</span>
      <p>“{block.text}”</p>
    </blockquote>
  );
}

function ConceptVisual({ kind }: { kind: VisualKind }) {
  if (kind === "insurance-loop") {
    return (
      <figure className="concept-visual insurance-visual">
        <div className="visual-stage" aria-hidden="true">
          <span className="visual-eyebrow">The insurance loop</span>
          <ol className="insurance-flow">
            <li>
              <span>01</span>
              <strong>Premium</strong>
              <small>funds coverage</small>
            </li>
            <li>
              <span>02</span>
              <strong>Shared pool</strong>
              <small>spreads risk</small>
            </li>
            <li>
              <span>03</span>
              <strong>Loss event</strong>
              <small>creates a claim</small>
            </li>
            <li>
              <span>04</span>
              <strong>Recovery</strong>
              <small>coverage responds</small>
            </li>
          </ol>
          <span className="insurance-signal" />
        </div>
        <figcaption>
          Premiums create a shared pool of risk that makes recovery possible
          when a covered loss occurs.
        </figcaption>
      </figure>
    );
  }

  if (kind === "team-network") {
    return (
      <figure className="concept-visual team-visual">
        <div className="visual-stage" aria-hidden="true">
          <span className="visual-eyebrow">Research is connective tissue</span>
          <div className="team-network">
            <span className="team-node team-product">Product</span>
            <span className="team-node team-design">Design</span>
            <span className="team-node team-research">
              UX
              <br />
              Research
            </span>
            <span className="team-node team-data">Data</span>
            <span className="team-node team-operations">Operations</span>
            <span className="network-pulse network-pulse-one" />
            <span className="network-pulse network-pulse-two" />
          </div>
        </div>
        <figcaption>
          Research turns signals from product, design, data, and operations into
          shared direction.
        </figcaption>
      </figure>
    );
  }

  if (kind === "research-rhythm") {
    return (
      <figure className="concept-visual rhythm-visual">
        <div className="visual-stage" aria-hidden="true">
          <div className="visual-heading-row">
            <span className="visual-eyebrow">One six-week cycle</span>
            <span className="script-note">keep moving</span>
          </div>
          <ol className="rhythm-track">
            <li>
              <span>01</span>
              <strong>Align</strong>
              <small>brief + outcomes</small>
            </li>
            <li>
              <span>02</span>
              <strong>Fieldwork</strong>
              <small>listen + observe</small>
            </li>
            <li>
              <span>03</span>
              <strong>Synthesize</strong>
              <small>pattern + stance</small>
            </li>
            <li>
              <span>04</span>
              <strong>Share</strong>
              <small>decision + backlog</small>
            </li>
          </ol>
        </div>
        <figcaption>
          Research stays useful when the learning rhythm lands inside the
          product team’s six-week decision cycle.
        </figcaption>
      </figure>
    );
  }

  if (kind === "evidence-triangulation") {
    return (
      <figure className="concept-visual evidence-visual">
        <div className="visual-stage" aria-hidden="true">
          <span className="visual-eyebrow">Triangulate before you conclude</span>
          <div className="evidence-grid">
            <div className="evidence-source">
              <span>Quantitative</span>
              <strong>What is happening?</strong>
              <small>benchmarks · reviews · intercepts</small>
            </div>
            <div className="evidence-source">
              <span>Qualitative</span>
              <strong>Why is it happening?</strong>
              <small>interviews · clips · verbatims</small>
            </div>
            <div className="evidence-merge">
              <span className="merge-dot merge-dot-left" />
              <span className="merge-dot merge-dot-right" />
            </div>
            <div className="evidence-outcome">
              <span>Root’s stance</span>
              <strong>Decisive customer narrative</strong>
            </div>
          </div>
        </div>
        <figcaption>
          Scale identifies the pattern; direct customer evidence explains the
          cause; together they support a decisive narrative.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="concept-visual retention-visual">
      <div className="visual-stage" aria-hidden="true">
        <div className="visual-heading-row">
          <span className="visual-eyebrow">The retention journey</span>
          <span className="script-note">friction compounds</span>
        </div>
        <ol className="journey-track">
          <li>
            <span>01</span>
            <strong>Quote</strong>
          </li>
          <li>
            <span>02</span>
            <strong>Onboard</strong>
          </li>
          <li>
            <span>03</span>
            <strong>Drive</strong>
          </li>
          <li>
            <span>04</span>
            <strong>Renew</strong>
          </li>
          <li>
            <span>05</span>
            <strong>Stay</strong>
          </li>
        </ol>
        <div className="journey-baseline">
          <span className="journey-progress" />
          <span className="journey-marker" />
        </div>
        <div className="journey-signals">
          <span>clarity</span>
          <span>trust</span>
          <span>flexibility</span>
        </div>
      </div>
      <figcaption>
        Clarity, trust, and payment flexibility protect retention across the
        journey—not only at renewal.
      </figcaption>
    </figure>
  );
}

function ArticleNavigation({ page }: { page: OnboardingPage }) {
  const [activeId, setActiveId] = useState(page.sections[0]?.id ?? "");
  const ids = useMemo(
    () => page.sections.map((section) => section.id),
    [page.sections],
  );

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-24% 0px -65% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return (
    <aside className="article-aside">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> Index
      </Link>
      <div className="toc">
        <h2>{page.title}</h2>
        <nav aria-label={`${page.title} sections`}>
          <ul>
            {page.sections.map((section) => (
              <li key={section.id}>
                <a
                  aria-current={activeId === section.id ? "location" : undefined}
                  className={activeId === section.id ? "active" : undefined}
                  href={`#${section.id}`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export function ArticlePage({ page }: { page: OnboardingPage }) {
  return (
    <div className="page-shell article-page">
      <ArticleNavigation page={page} />
      <main id="main-content">
        <article className="article">
          <header className="article-header article-intro">
            <h1>{page.title}</h1>
            <time>{page.updated}</time>
            <p>{page.summary}</p>
          </header>

          {page.sections.map((section, sectionIndex) => (
            <section
              className="content-section stagger-item"
              id={section.id}
              key={section.id}
              style={
                {
                  "--delay": `${Math.min(sectionIndex, 6) * 50}ms`,
                } as CSSProperties
              }
            >
              <h2>{section.title}</h2>
              {section.blocks.map((block, blockIndex) => (
                <Block block={block} key={`${section.id}-${blockIndex}`} />
              ))}
              {section.visual ? <ConceptVisual kind={section.visual} /> : null}
            </section>
          ))}

          <footer className="article-end">
            <p>Continue exploring the onboarding index.</p>
            <Link className="basic-link" href="/">
              Return to index
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
