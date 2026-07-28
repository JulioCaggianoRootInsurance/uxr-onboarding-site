"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type NavigationSection = {
  id: string;
  title: string;
};

export function ArticleNavigation({
  title,
  sections,
}: {
  title: string;
  sections: NavigationSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);

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

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
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
        <h2>{title}</h2>
        <nav aria-label={`${title} sections`}>
          <ul>
            {sections.map((section) => (
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
