# Root UX Research Onboarding

A Vercel-ready Next.js onboarding website for the Root UX Research team. Its
editorial shell follows the approved Benji.org reference while its content comes
from the reviewed UX Research onboarding Google Doc.

## Run locally

Node.js 22 is required.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-style local preview:

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push this folder as the root of the GitHub repository.
2. Import the repository in Vercel and use the **Next.js** framework preset.
3. Leave Build Command at its default (`pnpm build`) and leave Output Directory
   blank.
4. Redeploy. The native build creates the `.next` directory Vercel expects.

`NEXT_PUBLIC_SITE_URL` is optional. Set it to the final production URL if you
want social-preview links to use a custom domain immediately.

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

This version has no application authentication, database, persistent API, or
automatic Google Doc synchronization. Embedded customer reels continue to use
their existing Google Drive permissions.
