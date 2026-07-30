"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type CustomerEvidenceQuote = {
  quote: string;
  theme: string;
  source: string;
  period: string;
  context?: string;
};

export type CustomerEvidenceClip = {
  label: string;
  driveId: string;
};

export type CustomerEvidenceVideoCollection = {
  participant: string;
  period: string;
  theme: string;
  summary: string;
  fullSessionHref: string;
  clips: readonly CustomerEvidenceClip[];
};

export type CustomerEvidenceLibraryProps = {
  quotes: readonly CustomerEvidenceQuote[];
  collections: readonly CustomerEvidenceVideoCollection[];
};

type AffinityDefinition = {
  id: string;
  label: string;
  terms: readonly string[];
};

const AFFINITIES = [
  {
    id: "trust",
    label: "Trust",
    terms: [
      "trust",
      "trusted",
      "distrust",
      "confidence",
      "skeptical",
      "skepticism",
      "transparent",
      "transparency",
      "honest",
      "honesty",
      "scam",
      "fair",
      "fairness",
      "reassurance",
      "reassured",
      "credible",
      "reliable",
      "safe",
      "security",
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    terms: [
      "price",
      "pricing",
      "rate",
      "rates",
      "cost",
      "costs",
      "expensive",
      "expense",
      "affordability",
      "affordable",
      "savings",
      "save money",
      "cheap",
      "renewal",
      "rate hike",
      "increase",
      "fee",
      "fees",
      "discount",
      "value",
      "budget",
    ],
  },
  {
    id: "payments",
    label: "Payments",
    terms: [
      "payment",
      "payments",
      "pay",
      "paid",
      "billing",
      "bill",
      "installment",
      "installments",
      "twice a month",
      "apple pay",
      "due date",
      "payment arrangement",
      "hardship",
      "funds",
    ],
  },
  {
    id: "support",
    label: "Support",
    terms: [
      "support",
      "service",
      "customer service",
      "phone",
      "chatbot",
      "human",
      "person",
      "agent",
      "advisor",
      "claims",
      "communication",
      "contact",
      "help",
      "hold",
      "care",
      "guidance",
      "walk you through",
    ],
  },
  {
    id: "telematics-data",
    label: "Telematics / data",
    terms: [
      "telematics",
      "test drive",
      "driving score",
      "score",
      "monitoring",
      "monitor",
      "tracked",
      "tracking",
      "data",
      "privacy",
      "collect your data",
      "driving habits",
      "night driving",
      "sensor",
    ],
  },
  {
    id: "cancellation-retention",
    label: "Cancellation / retention",
    terms: [
      "cancellation",
      "cancel",
      "canceled",
      "cancelled",
      "retention",
      "stay",
      "leave",
      "left",
      "move on",
      "switch",
      "churn",
      "refund",
      "still be with",
      "coming back",
      "policy ended",
    ],
  },
  {
    id: "shopping-quotes",
    label: "Shopping / quotes",
    terms: [
      "shopping",
      "shop",
      "quote",
      "quoted",
      "carrier",
      "insurer",
      "comparison",
      "compare",
      "offer",
      "best deal",
      "lead generation",
      "phone calls and emails",
      "turborater",
    ],
  },
  {
    id: "app-experience",
    label: "App experience",
    terms: [
      "app",
      "mobile",
      "onboarding",
      "login",
      "screen",
      "button",
      "browser",
      "download",
      "digital",
      "proof of insurance",
      "score tracking",
      "online",
    ],
  },
  {
    id: "brand-messaging",
    label: "Brand / messaging",
    terms: [
      "brand",
      "branding",
      "name",
      "message",
      "messaging",
      "proposition",
      "positioning",
      "tone",
      "slogan",
      "tagline",
      "lemonade",
      "ruut",
      "built to keep you moving",
      "high quality",
      "simple and affordable",
    ],
  },
] as const satisfies readonly AffinityDefinition[];

type AffinityId = (typeof AFFINITIES)[number]["id"];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "for",
  "from",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "was",
  "were",
  "with",
]);

type IndexedClip = {
  collection: CustomerEvidenceVideoCollection;
  collectionIndex: number;
  clip: CustomerEvidenceClip;
  clipIndex: number;
};

type EvidenceStreamItem =
  | {
      kind: "quote";
      quote: CustomerEvidenceQuote;
      quoteIndex: number;
    }
  | ({ kind: "video" } & IndexedClip);

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalize(value);
  return normalized ? normalized.split(/\s+/) : [];
}

function isWithinEditDistance(
  left: string,
  right: string,
  maximumDistance: number,
): boolean {
  if (Math.abs(left.length - right.length) > maximumDistance) return false;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let smallest = current[0];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost =
        left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      const distance = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
      current.push(distance);
      smallest = Math.min(smallest, distance);
    }

    if (smallest > maximumDistance) return false;
    previous = current;
  }

  return previous[right.length] <= maximumDistance;
}

function wordsMatch(left: string, right: string): boolean {
  if (left === right) return true;

  const shortestLength = Math.min(left.length, right.length);
  if (shortestLength >= 4 && (left.startsWith(right) || right.startsWith(left))) {
    return true;
  }

  if (shortestLength < 4) return false;
  const maximumDistance = Math.max(left.length, right.length) >= 8 ? 2 : 1;
  return isWithinEditDistance(left, right, maximumDistance);
}

function textMatchesTerm(
  normalizedText: string,
  textTokens: readonly string[],
  term: string,
): boolean {
  const normalizedTerm = normalize(term);
  if (!normalizedTerm) return false;

  if (normalizedTerm.includes(" ")) {
    return normalizedText.includes(normalizedTerm);
  }

  return textTokens.some((token) => wordsMatch(normalizedTerm, token));
}

function searchableQuoteText(quote: CustomerEvidenceQuote): string {
  return [
    quote.quote,
    quote.theme,
    quote.source,
    quote.period,
    quote.context ?? "",
  ].join(" ");
}

function affinityMatchesText(
  normalizedText: string,
  textTokens: readonly string[],
  affinity: AffinityDefinition,
): boolean {
  return affinity.terms.some((term) =>
    textMatchesTerm(normalizedText, textTokens, term),
  );
}

function affinityMatchesQueryToken(
  affinity: AffinityDefinition,
  queryToken: string,
): boolean {
  return affinity.terms.some((term) =>
    tokenize(term).some((termToken) => wordsMatch(queryToken, termToken)),
  );
}

function quoteMatchesQuery(
  quote: CustomerEvidenceQuote,
  rawQuery: string,
): boolean {
  const normalizedQuery = normalize(rawQuery);
  if (!normalizedQuery) return true;

  const normalizedText = normalize(searchableQuoteText(quote));
  if (normalizedText.includes(normalizedQuery)) return true;

  const textTokens = tokenize(normalizedText);
  const allQueryTokens = tokenize(normalizedQuery);
  const meaningfulQueryTokens = allQueryTokens.filter(
    (token) => !STOP_WORDS.has(token),
  );
  const queryTokens =
    meaningfulQueryTokens.length > 0 ? meaningfulQueryTokens : allQueryTokens;

  return queryTokens.every((queryToken) => {
    if (textMatchesTerm(normalizedText, textTokens, queryToken)) return true;

    return AFFINITIES.some(
      (affinity) =>
        affinityMatchesQueryToken(affinity, queryToken) &&
        affinityMatchesText(normalizedText, textTokens, affinity),
    );
  });
}

function quoteMatchesSelectedAffinities(
  quote: CustomerEvidenceQuote,
  selectedAffinities: readonly AffinityId[],
): boolean {
  if (selectedAffinities.length === 0) return true;

  const normalizedText = normalize(searchableQuoteText(quote));
  const textTokens = tokenize(normalizedText);

  return selectedAffinities.some((affinityId) => {
    const affinity = AFFINITIES.find(({ id }) => id === affinityId);
    return affinity
      ? affinityMatchesText(normalizedText, textTokens, affinity)
      : false;
  });
}

function roundRobinClips(
  collections: readonly CustomerEvidenceVideoCollection[],
): IndexedClip[] {
  const clipPositions = collections.map(() => 0);
  const clips: IndexedClip[] = [];
  let addedClip = true;

  while (addedClip) {
    addedClip = false;

    collections.forEach((collection, collectionIndex) => {
      const clipIndex = clipPositions[collectionIndex];
      const clip = collection.clips[clipIndex];
      if (!clip) return;

      clips.push({ collection, collectionIndex, clip, clipIndex });
      clipPositions[collectionIndex] += 1;
      addedClip = true;
    });
  }

  return clips;
}

function buildEvidenceStream(
  quotes: readonly CustomerEvidenceQuote[],
  clips: readonly IndexedClip[],
): EvidenceStreamItem[] {
  if (clips.length === 0) {
    return quotes.map((quote, quoteIndex) => ({
      kind: "quote",
      quote,
      quoteIndex,
    }));
  }

  const stream: EvidenceStreamItem[] = [];
  const baseQuotesPerClip = Math.floor(quotes.length / clips.length);
  const extraQuoteCount = quotes.length % clips.length;
  const slotsWithExtraQuote = new Set<number>();

  for (let extraIndex = 0; extraIndex < extraQuoteCount; extraIndex += 1) {
    slotsWithExtraQuote.add(
      Math.floor((extraIndex * clips.length) / extraQuoteCount),
    );
  }

  let quoteIndex = 0;
  clips.forEach((indexedClip, clipIndex) => {
    const quotesInSlot =
      baseQuotesPerClip + (slotsWithExtraQuote.has(clipIndex) ? 1 : 0);

    for (let slotIndex = 0; slotIndex < quotesInSlot; slotIndex += 1) {
      const quote = quotes[quoteIndex];
      if (!quote) break;
      stream.push({ kind: "quote", quote, quoteIndex });
      quoteIndex += 1;
    }

    stream.push({ kind: "video", ...indexedClip });
  });

  while (quoteIndex < quotes.length) {
    stream.push({
      kind: "quote",
      quote: quotes[quoteIndex],
      quoteIndex,
    });
    quoteIndex += 1;
  }

  return stream;
}

function QuoteCard({
  quote,
  quoteIndex,
  result = false,
}: {
  quote: CustomerEvidenceQuote;
  quoteIndex: number;
  result?: boolean;
}) {
  return (
    <blockquote
      className={`customer-quote-card evidence-quote-card${
        result ? " evidence-search-result" : ""
      }`}
      key={`${quote.source}-${quote.quote}-${quoteIndex}`}
    >
      <p>“{quote.quote}”</p>
      <footer>
        <span>{quote.theme}</span>
        <small>
          {quote.source} · {quote.period}
        </small>
        {quote.context ? <small>{quote.context}</small> : null}
      </footer>
    </blockquote>
  );
}

function VideoCard({ item }: { item: Extract<EvidenceStreamItem, { kind: "video" }> }) {
  const { clip, collection } = item;

  return (
    <figure className="embedded-video-card evidence-video-card">
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
        <span className="evidence-video-caption">
          <strong>
            {collection.participant} · {clip.label}
          </strong>
          <small>
            {collection.period} · {collection.theme}
          </small>
        </span>
        <span className="evidence-video-links">
          <a
            href={`https://drive.google.com/file/d/${clip.driveId}/view`}
            rel="noreferrer"
            target="_blank"
          >
            Open in Drive ↗
          </a>
          <a
            href={collection.fullSessionHref}
            rel="noreferrer"
            target="_blank"
          >
            Full session ↗
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

export function CustomerEvidenceLibrary({
  quotes,
  collections,
}: CustomerEvidenceLibraryProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedAffinities, setSelectedAffinities] = useState<AffinityId[]>(
    [],
  );
  const panelId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const stream = useMemo(
    () => buildEvidenceStream(quotes, roundRobinClips(collections)),
    [collections, quotes],
  );
  const isFiltering =
    normalize(query).length > 0 || selectedAffinities.length > 0;
  const matchingQuotes = useMemo(
    () =>
      isFiltering
        ? quotes.filter(
            (quote) =>
              quoteMatchesQuery(quote, query) &&
              quoteMatchesSelectedAffinities(quote, selectedAffinities),
          )
        : [],
    [isFiltering, query, quotes, selectedAffinities],
  );

  function toggleAffinity(affinityId: AffinityId) {
    setSelectedAffinities((current) =>
      current.includes(affinityId)
        ? current.filter((id) => id !== affinityId)
        : [...current, affinityId],
    );
  }

  function clearSearch() {
    setQuery("");
    setSelectedAffinities([]);
    inputRef.current?.focus();
  }

  return (
    <div className="customer-evidence-library">
      <div className="evidence-library-tools">
        <button
          aria-controls={panelId}
          aria-expanded={isSearchOpen}
          className="evidence-search-toggle"
          onClick={() => setIsSearchOpen((current) => !current)}
          type="button"
        >
          Search quotes
        </button>

        {isSearchOpen ? (
          <section
            aria-label="Search customer quotes"
            className="evidence-search-panel"
            id={panelId}
          >
            <div className="evidence-search-field">
              <label className="evidence-search-label" htmlFor={inputId}>
                Search
              </label>
              <div className="evidence-search-control">
                <input
                  autoComplete="off"
                  className="evidence-search-input"
                  id={inputId}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Keyword, theme, or idea"
                  ref={inputRef}
                  type="search"
                  value={query}
                />
                <p className="evidence-search-hint">
                  Includes related concepts and close spellings.
                </p>
              </div>
            </div>

            <div
              aria-label="Affinity filters"
              className="evidence-affinity-filters"
              role="group"
            >
              <p>Affinities</p>
              <div className="evidence-affinity-chips">
                {AFFINITIES.map((affinity) => {
                  const isSelected = selectedAffinities.includes(affinity.id);

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`evidence-affinity-chip${
                        isSelected ? " is-selected" : ""
                      }`}
                      key={affinity.id}
                      onClick={() => toggleAffinity(affinity.id)}
                      type="button"
                    >
                      {affinity.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {isFiltering ? (
        <div className="evidence-filtered-view">
          <div className="evidence-search-summary">
            <p aria-live="polite" role="status">
              {matchingQuotes.length}{" "}
              {matchingQuotes.length === 1 ? "quote" : "quotes"} found
            </p>
            <button
              className="evidence-search-clear"
              onClick={clearSearch}
              type="button"
            >
              Clear search
            </button>
          </div>
          <div
            aria-label="Quote search results"
            className="quote-library-grid evidence-search-results"
          >
            {matchingQuotes.length > 0 ? (
              matchingQuotes.map((quote, quoteIndex) => (
                <QuoteCard
                  key={`${quote.source}-${quote.quote}-${quoteIndex}`}
                  quote={quote}
                  quoteIndex={quoteIndex}
                  result
                />
              ))
            ) : (
              <p className="evidence-search-empty">
                No close matches yet. Try a broader idea or another smart
                category.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          aria-label="Customer quotes and recordings"
          className="customer-evidence-stream"
        >
          {stream.map((item) =>
            item.kind === "quote" ? (
              <QuoteCard
                key={`quote-${item.quoteIndex}`}
                quote={item.quote}
                quoteIndex={item.quoteIndex}
              />
            ) : (
              <VideoCard
                item={item}
                key={`video-${item.collectionIndex}-${item.clipIndex}-${item.clip.driveId}`}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
