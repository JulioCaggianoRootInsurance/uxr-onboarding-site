import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the onboarding index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Root UX Research Onboarding · Root UX Research<\/title>/i,
  );
  assert.match(html, /Root UX Research Onboarding/);
  assert.match(html, /Last Updated: Jul 27, 2026/);
  assert.match(
    html,
    /Prepared by UXR Interns Layilah Campbell and Julio Caggiano/,
  );
  assert.match(
    html,
    /Have any questions\? Feel free to slack the @director of research/,
  );
  assert.match(html, /Insurance basics/);
  assert.match(html, /Voice of the Customer/);
  assert.match(html, /VOC analysis workflow/);
  assert.match(html, /Customer Quote Library/);
  assert.match(html, /AI-assisted research/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders every onboarding route", async () => {
  const routes = [
    "/insurance-basics",
    "/team",
    "/operating-procedures",
    "/voice-of-customer",
    "/customer-retention",
    "/voc-analysis-workflow",
    "/nps-worked-example",
    "/evidence-storytelling",
    "/ai-research-playbook",
    "/customer-quote-library",
    "/slack-directories",
    "/knowledge-repositories",
    "/voc-technical-appendix",
  ];
  const visualCaptions = new Map([
    ["/insurance-basics", /shared pool of risk/],
    ["/team", /shared direction/],
    ["/operating-procedures", /six-week decision cycle/],
    ["/voice-of-customer", /direct customer evidence/],
    ["/customer-retention", /protect retention across the journey/],
  ]);

  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, /Return to index/, route);
    assert.match(html, /Last Updated: Jul 27, 2026/, route);
    assert.doesNotMatch(html, /\[cite:|\\longrightarrow|\\text\{/i, route);
    if (visualCaptions.has(route)) {
      assert.match(html, visualCaptions.get(route), route);
    }
  }
});

test("renders a governed quote library with embedded customer reels", async () => {
  const response = await render("/customer-quote-library");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Q1 2026 customer recordings/);
  assert.match(html, /Open the full Lookback session/);
  assert.match(html, /lookback\.io\/play\/qpzK47AyZGPfTzDE7/);
  assert.match(html, /lookback\.io\/play\/PAg8bd26jergevcv5/);
  assert.match(html, /lookback\.io\/play\/hbdMNbJCUJm3LMxhH/);
  assert.match(
    html,
    /drive\.google\.com\/file\/d\/1zX5uhypEBVEzfPXiRcfPjVcfGoE0y-93\/preview/,
  );
  assert.match(
    html,
    /drive\.google\.com\/file\/d\/1Qkp1MLWJ1rWzsgqu4TV0nGZH2X7SNmoi\/preview/,
  );
  assert.match(
    html,
    /drive\.google\.com\/file\/d\/1mQQmWUzw4wainZ4P2-NrJKuXnHOejvqi\/preview/,
  );
  assert.equal((html.match(/<iframe\b/g) ?? []).length, 21);
  assert.doesNotMatch(html, /Jasmine Anderson|Dawn Collins|Adan/);
  assert.match(html, /Payment flexibility/);
  assert.match(html, /Quotes explain the experience|A memorable line/);
});

test("renders readable NPS formulas and audited examples", async () => {
  const npsResponse = await render("/nps-worked-example");
  const npsHtml = await npsResponse.text();
  assert.match(
    npsHtml,
    /NPS = 100 × \(Promoters − Detractors\) ÷ valid responses/,
  );
  assert.match(npsHtml, /DTC benchmark — Root current customers/);
  assert.match(npsHtml, /NPS = \+15\.4/);

  const appendixResponse = await render("/voc-technical-appendix");
  const appendixHtml = await appendixResponse.text();
  assert.match(appendixHtml, /Standard error = 100 × √/);
  assert.match(appendixHtml, /DataQualityScore/);
});
