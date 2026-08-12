import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { signOut } from "@/auth";
import { ArticleNavigation } from "./article-navigation";
import { CopyablePrompt } from "./copyable-prompt";
import { CustomerEvidenceLibrary } from "./customer-evidence-library";
import {
  handoffGroups,
  handoffPages,
  type ContentBlock,
  type HandoffPage,
  type ResourceLink,
} from "./handoff";
import { getSiteUpdated } from "./site-updated";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-rule" />
      <div className="footer-row">
        <div className="footer-copy">
          <p>Prepared by Julio Caggiano</p>
          <small>Root internal · Password protected</small>
          <small>Design system credit: Benji Taylor · SpaceX (SpaceX AI)</small>
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
        Internship Handoff
      </h2>
      <ul className="index-groups">
        {handoffGroups.map((group) => {
          const pages = handoffPages
            .filter((page) => page.group === group)
            .sort((a, b) => a.order - b.order);
          const shortGroup: Record<typeof group, string> = {
            Deliverables: "Work",
            "Research practice": "Practice",
            Future: "Future",
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

export function HomePage() {
  const siteUpdated = getSiteUpdated();
  const introChildren = [
    <header className="article-header" key="header">
      <h1>UXR Internship Handoff</h1>
      <time dateTime={siteUpdated.dateTime}>{siteUpdated.label}</time>
    </header>,
    <p key="summary">
      Hello! I developed this website to document the work I completed during
      my 2026 summer internship with the UX Research team at Root Insurance.
      Its primary goal is to help stakeholders review each of my internship
      deliverables, find the latest versions, understand where each project
      stands, and see what should happen next.
    </p>,
    <p className="byline" key="byline">
      Prepared by Julio Caggiano
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
        <IndexList />
      </div>
      <div
        className="stagger-item"
        style={{ "--delay": "300ms" } as CSSProperties}
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

type ResourceProvider = {
  icon: string;
  id:
    | "docs"
    | "drive"
    | "external"
    | "figma"
    | "handoff"
    | "lovable"
    | "root"
    | "sheets"
    | "slides";
  name: string;
};

function resourceProvider(
  href: string,
  providerOverride?: ResourceLink["provider"],
): ResourceProvider {
  if (providerOverride === "root") {
    return {
      icon: "/provider-icons/root-official.png",
      id: "root",
      name: "Root",
    };
  }

  if (providerOverride === "slides") {
    return {
      icon: "/provider-icons/google-slides.svg",
      id: "slides",
      name: "Google Slides",
    };
  }

  if (href.startsWith("/")) {
    return {
      icon: "/provider-icons/root-official.png",
      id: "handoff",
      name: "UXR handoff",
    };
  }

  if (href.includes("figma.com")) {
    return {
      icon: "/provider-icons/figma.svg",
      id: "figma",
      name: "Figma",
    };
  }

  if (href.includes("docs.google.com/spreadsheets")) {
    return {
      icon: "/provider-icons/google-sheets.svg",
      id: "sheets",
      name: "Google Sheets",
    };
  }

  if (href.includes("docs.google.com")) {
    return {
      icon: "/provider-icons/google-docs.png",
      id: "docs",
      name: "Google Docs",
    };
  }

  if (href.includes("drive.google.com")) {
    return {
      icon: "/provider-icons/google-drive.png",
      id: "drive",
      name: "Google Drive",
    };
  }

  if (href.includes("lovable.dev")) {
    return {
      icon: "/provider-icons/lovable.ico",
      id: "lovable",
      name: "Lovable",
    };
  }

  return {
    icon: "/provider-icons/root-official.png",
    id: "external",
    name: "External link",
  };
}

function ResourceLinks({ items }: { items: ResourceLink[] }) {
  return (
    <ul className="resource-links">
      {items.map((item) => {
        const provider = resourceProvider(item.href, item.provider);
        const content = (
          <>
            <span
              aria-hidden="true"
              className={`resource-provider-icon provider-${provider.id}`}
              title={provider.name}
            >
              <img alt="" height="24" src={provider.icon} width="24" />
            </span>
            <span className="resource-link-copy">
              <strong>{item.label}</strong>
              <span className="resource-link-description">
                {item.description}
              </span>
            </span>
          </>
        );

        return (
          <li key={item.href}>
            {item.href.startsWith("/") ? (
              <Link
                aria-label={`${item.label}. ${item.description}. ${provider.name}.`}
                className="resource-link"
                href={item.href}
              >
                {content}
              </Link>
            ) : (
              <a
                aria-label={`${item.label}. ${item.description}. ${provider.name}. Opens in a new tab.`}
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

function Block({ block }: { block: ContentBlock }) {
  if (block.kind === "paragraph") {
    return (
      <p className={block.emphasis ? "article-paragraph-emphasis" : undefined}>
        {block.text}
      </p>
    );
  }

  if (block.kind === "signature") {
    return <p className="closing-signature">{block.text}</p>;
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
      <aside className="handoff-callout">
        <h3>{block.title}</h3>
        <p>{block.text}</p>
      </aside>
    );
  }

  if (block.kind === "links") {
    return <ResourceLinks items={block.items} />;
  }

  if (block.kind === "customerEvidenceLibrary") {
    return (
      <CustomerEvidenceLibrary
        collections={block.collections}
        quotes={block.quotes}
      />
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
        {block.items.map((item) => {
          const isInternal = item.href.startsWith("/");
          const content = (
            <>
              <div className="status-card-heading">
                <h3>{item.title}</h3>
                <span aria-hidden="true" className="status-card-action">
                  {isInternal ? "Open →" : "Open ↗"}
                </span>
              </div>
              <p>{item.text}</p>
            </>
          );

          return isInternal ? (
            <Link
              aria-label={`${item.title}. ${item.text}. Open in this handoff.`}
              className="status-card"
              href={item.href}
              key={item.title}
            >
              {content}
            </Link>
          ) : (
            <a
              aria-label={`${item.title}. ${item.text}. Opens in a new tab.`}
              className="status-card"
              href={item.href}
              key={item.title}
              rel="noreferrer"
              target="_blank"
            >
              {content}
            </a>
          );
        })}
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

  if (block.kind === "copyablePrompt") {
    return (
      <CopyablePrompt
        introduction={block.introduction}
        prompt={block.prompt}
        title={block.title}
      />
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
          {block.caption ??
            "Each handoff point stays visible, reviewable, and reversible."}
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
        sections={page.sections
          .filter((section) => section.showTitle !== false)
          .map(({ id, title }) => ({ id, title }))}
      />
      <main id="main-content">
        <article className="article">
          <header className="article-header article-intro">
            <h1>{page.title}</h1>
            <div className="article-kicker">
              <span className="article-group">{page.group}</span>
            </div>
            {page.summary ? <p>{page.summary}</p> : null}
          </header>

          {page.primaryLinks?.length ? (
            <nav
              aria-label={`${page.title} deliverable links`}
              className="primary-resources stagger-item"
              style={{ "--delay": "50ms" } as CSSProperties}
            >
              <p>Deliverable links</p>
              <ResourceLinks items={page.primaryLinks} />
            </nav>
          ) : null}

          {page.sections.map((section, sectionIndex) => (
            <section
              aria-label={
                section.showTitle === false ? section.title : undefined
              }
              className={`content-section stagger-item${
                section.showTitle === false ? " content-section-untitled" : ""
              }`}
              id={section.id}
              key={section.id}
              style={
                {
                  "--delay": `${Math.min(sectionIndex, 6) * 50}ms`,
                } as CSSProperties
              }
            >
              {section.showTitle !== false ? <h2>{section.title}</h2> : null}
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
