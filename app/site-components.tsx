import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { signOut } from "@/auth";
import { ArticleNavigation } from "./article-navigation";
import {
  handoffGroups,
  handoffPages,
  siteUpdated,
  type ContentBlock,
  type HandoffPage,
  type HandoffStatus,
} from "./handoff";

function statusClass(status: HandoffStatus): string {
  return `status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function StatusPill({ status }: { status: HandoffStatus }) {
  return (
    <span className={`status-pill ${statusClass(status)}`}>{status}</span>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-rule" />
      <div className="footer-row">
        <div className="footer-copy">
          <p>Prepared by Julio Caggiano for Hala Daher</p>
          <small>Root internal · Password protected</small>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="sign-out-link" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </footer>
  );
}

function IndexList() {
  return (
    <section className="index-section" aria-labelledby="handoff-heading">
      <h2 className="index-title" id="handoff-heading">
        Internship handoff
      </h2>
      <ul className="index-groups">
        {handoffGroups.map((group) => {
          const pages = handoffPages
            .filter((page) => page.group === group)
            .sort((a, b) => a.order - b.order);
          const shortGroup: Record<typeof group, string> = {
            Deliverables: "Work",
            "Research practice": "Practice",
            Continuation: "Next",
          };

          return (
            <li className="index-group" key={group}>
              <span className="group-label">
                <span className="group-label-full">{group}</span>
                <span className="group-label-short">{shortGroup[group]}</span>
              </span>
              <ul>
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`} className="index-link">
                      <span className="index-name">
                        <span>{page.title}</span>
                        {page.order === 1 ? (
                          <span className="start-note">Start here</span>
                        ) : null}
                      </span>
                      <span className="index-meta">
                        <span className={`index-status ${statusClass(page.status)}`}>
                          {page.status}
                        </span>
                        <span className="index-number">
                          {String(page.order).padStart(2, "0")}
                        </span>
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

function HomeStatusOverview() {
  const deliverables = handoffPages.filter(
    (page) => page.group === "Deliverables",
  );
  const delivered = deliverables.filter(
    (page) => page.status === "Delivered",
  );
  const active = deliverables.filter(
    (page) => page.status === "In progress" || page.status === "Prototype",
  );

  return (
    <section className="home-status-overview" aria-label="Handoff status">
      <div>
        <span>Deliverables</span>
        <strong>{deliverables.length}</strong>
        <small>reports, dashboard, evidence, documentation, and systems</small>
      </div>
      <div>
        <span>Delivered</span>
        <strong>{delivered.length}</strong>
        <small>Q1 report, quote library, NPS report, and AI skills</small>
      </div>
      <div>
        <span>In progress</span>
        <strong>{active.length}</strong>
        <small>Q2, dashboard code, onboarding, sitemap, and template</small>
      </div>
    </section>
  );
}

export function HomePage() {
  const introChildren = [
    <header className="article-header" key="header">
      <h1>Julio Caggiano · UX Research Internship Handoff</h1>
      <time dateTime="2026-07-27">{siteUpdated}</time>
    </header>,
    <p key="summary">
      Hello! I developed this website to document the work I completed during
      my 2026 summer internship with the UX Research team at Root Insurance.
      Its primary goal is to help the research team review each deliverable,
      find the latest versions, and see what should happen next.
    </p>,
    <p key="narrative">
      Please note that most of my work supported the Voice of Customer (VoC)
      program. Throughout each section, you will find an explanation of what I
      did, where the work stands, and what still needs attention.
    </p>,
    <p key="dates">June 1 -&gt; August 14, 2026</p>,
    <p className="byline" key="byline">
      Prepared by Julio Caggiano for Hala Daher
    </p>,
  ];

  return (
    <div className="page-shell homepage">
      <a className="skip-link" href="#handoff-heading">
        Skip to handoff chapters
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
        style={{ "--delay": "250ms" } as CSSProperties}
      >
        <HomeStatusOverview />
      </div>
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

  if (block.kind === "steps") {
    return (
      <ol className="article-steps">
        {block.items.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{item}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (block.kind === "subheading") {
    return <h3>{block.text}</h3>;
  }

  if (block.kind === "callout") {
    return (
      <aside className={`handoff-callout ${statusClass(block.status)}`}>
        <StatusPill status={block.status} />
        <h3>{block.title}</h3>
        <p>{block.text}</p>
      </aside>
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

  if (block.kind === "statusGrid") {
    return (
      <div className="status-grid">
        {block.items.map((item) => (
          <article className="status-card" key={`${item.status}-${item.title}`}>
            <StatusPill status={item.status} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    );
  }

  if (block.kind === "commands") {
    return (
      <div className="command-list">
        {block.items.map((item) => (
          <article className="command-card" key={item.command}>
            <code>{item.command}</code>
            <div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (block.kind === "pipeline") {
    return (
      <figure className="deployment-pipeline">
        <ol>
          {block.items.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </li>
          ))}
        </ol>
        <figcaption>
          Each handoff point stays visible, reviewable, and reversible.
        </figcaption>
      </figure>
    );
  }

  return (
    <blockquote>
      <span>{block.label}</span>
      <p>“{block.text}”</p>
    </blockquote>
  );
}

export function ArticlePage({
  page,
}: {
  page: HandoffPage;
}) {
  return (
    <div className="page-shell article-page">
      <ArticleNavigation
        title={page.title}
        sections={page.sections.map(({ id, title }) => ({ id, title }))}
      />
      <main id="main-content">
        <article className="article">
          <header className="article-header article-intro">
            <div className="article-kicker">
              <StatusPill status={page.status} />
              <span>{page.group}</span>
            </div>
            <h1>{page.title}</h1>
            <time dateTime="2026-07-27">{page.updated}</time>
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
            </section>
          ))}

          <footer className="article-end">
            <p>Continue through Julio&apos;s internship handoff.</p>
            <Link className="basic-link" href="/">
              Return to index
            </Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
