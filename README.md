# Root UX Research Internship Handoff

A private, manager-facing Next.js record of Julio Caggiano's 2026 UX Research
internship work, prepared for Hala Daher. The site separates delivered work,
prototypes, ongoing work, recommendations, and unverified items so future work
is not presented as completed. Its index is organized into Deliverables,
Research Practice, and Continuation.

## Run locally

Node.js 22 is required.

Install dependencies, then start the site with the local-only authentication
password stored in `.env.local`:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local`, set a unique `HANDOFF_PASSWORD`, and keep
that file out of Git.

## Shared-password access

The production site uses an application-level shared-password gate:

1. Add the following protected environment variables in Vercel:
   - `AUTH_SECRET`
   - `HANDOFF_PASSWORD`
2. Use a unique passphrase of at least 12 characters.
3. Apply both variables to Preview and Production and redeploy.

The password is compared only in server-side code. A successful unlock creates
an encrypted, HTTP-only session cookie that expires after eight hours. Never
commit the real password or `AUTH_SECRET`.

This simpler gate does not identify individual viewers. Anyone who knows the
password can enter until it is changed, so rotate it when access should be
revoked and share it only through an approved private channel.

## Deploy to Vercel

1. Push this folder as the root of a private GitHub repository.
2. Import the repository into Vercel with the **Next.js** framework preset.
3. Leave the Build Command at its default (`pnpm build`).
4. Leave the Output Directory blank so Vercel uses Next.js's `.next` output.
5. Add the two authentication variables above to Preview and Production.
6. Deploy, then verify the correct password succeeds and an incorrect password
   is denied.

Branches and pull requests should be used for reviewable Vercel previews.
Approved changes to the production branch can then deploy automatically.

## Routes

- `/` — internship overview
- `/q1-voc-report`
- `/q2-voc-report`
- `/voc-dashboard`
- `/customer-quote-library`
- `/nps-executive-report`
- `/uxr-onboarding-documentation`
- `/sitemap-collaboration`
- `/presentation-template-system`
- `/ai-research-skills`
- `/research-process`
- `/standard-operating-procedures`
- `/internship-insights`
- `/internship-reflection`
- `/handoff-next-steps`
- `/login` — shared-password entrance

Legacy article slugs continue to resolve through aliases in `app/handoff.ts`.

## Content and behavior

- Private handoff content lives in `app/handoff.ts` and is marked server-only.
- Shared index and article templates live in `app/site-components.tsx`.
- Client-side code receives only article navigation labels, not the private
  handoff content model.
- `auth.ts` validates the shared password on the server; `proxy.ts` protects
  routes before rendering, and each private page verifies the session again.
- The customer evidence library preserves 21 deidentified, Drive-hosted clips
  and their existing Drive permissions.
- The deliverables index distinguishes completed artifacts from in-progress
  work, including separate dashboard prototype and code-handoff states.
- The VOC dashboard chapter documents the proposed local → GitHub → Vercel
  workflow and a future human-reviewed ChatGPT/Codex update flow.
- The generic, non-sensitive social-preview image is `public/og.png`.
- Pages opt out of search indexing.

## Validate

```bash
pnpm build
pnpm lint
node --test tests/rendered-html.test.mjs
```
