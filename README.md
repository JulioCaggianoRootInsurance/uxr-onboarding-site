# Root UX Research Onboarding

A local, static onboarding website for the Root UX Research team. Its editorial
shell follows the approved Benji.org reference while its content comes from the
reviewed UX Research onboarding Google Doc.

## Run locally

Node.js 22.13 or newer is required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-style local preview:

```bash
npm run build
npm start
```

## Routes

- `/` — onboarding index
- `/insurance-basics`
- `/team`
- `/operating-procedures`
- `/voice-of-customer`
- `/customer-retention`
- `/voc-analysis-workflow`
- `/nps-worked-example`
- `/evidence-storytelling`
- `/ai-research-playbook`
- `/customer-quote-library`
- `/slack-directories`
- `/knowledge-repositories`
- `/voc-technical-appendix`

## Content and behavior

- Static content lives in `app/onboarding.ts`.
- Shared index and article templates live in `app/site-components.tsx`.
- Styling, responsive behavior, motion, focus states, and print-free layout live
  in `app/globals.css`.
- The Customer Quote Library includes curated, deidentified excerpts and 21
  embedded, access-controlled Google Drive customer reels. Each participant
  collection also links to its full Lookback session.
- The social-preview image is `public/og.png`.
- Tests verify the index and every article route.

This version has no authentication, database, external API, production
deployment, or automatic Google Doc synchronization.
