# Root UX Research Internship Handoff

A private, manager-facing Next.js record of Julio Caggiano's 2026 UX Research
internship work, prepared for Hala Daher. The site separates delivered work,
prototypes, ongoing work, recommendations, and unverified items so future work
is not presented as completed.

## Run locally

Node.js 22 is required.

Install dependencies, then start the site with the local-only authentication
bypass:

```bash
pnpm install
AUTH_DEV_BYPASS=true pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Do not set `AUTH_DEV_BYPASS` in Vercel. The application ignores it outside
development, but it should remain a local convenience only.

## Root Google sign-in

Production access requires a Google OAuth web client owned by Root:

1. Configure the Google OAuth app in a Root-owned Google Cloud project and set
   its audience/user type to **Internal** for the Root Workspace organization.
2. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR_PRODUCTION_DOMAIN/api/auth/callback/google`
3. Add the following protected environment variables in Vercel:
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
4. Keep the allowed Workspace domain as `joinroot.com`.

The server requires all three Google assertions before granting access: a
verified email, the signed Google hosted-domain claim `joinroot.com`, and an
email ending in `@joinroot.com`. The Google account chooser's domain hint is
only a convenience; the server-side check is the access boundary.

Use `.env.example` as the local configuration template. Never commit a real
OAuth client secret or `AUTH_SECRET`.

## Deploy to Vercel

1. Push this folder as the root of a private GitHub repository.
2. Import the repository into Vercel with the **Next.js** framework preset.
3. Leave the Build Command at its default (`pnpm build`).
4. Leave the Output Directory blank so Vercel uses Next.js's `.next` output.
5. Add the authentication variables above to Preview and Production.
6. Deploy, then verify sign-in with an allowed Root account and a denied
   non-Root account.

Branches and pull requests should be used for reviewable Vercel previews.
Approved changes to the production branch can then deploy automatically.

## Routes

- `/` — internship overview
- `/voc-report-redesign`
- `/customer-evidence-library`
- `/voc-dashboard-exploration`
- `/research-and-stakeholders`
- `/internship-reflection`
- `/handoff`
- `/login` — Root Google sign-in

## Content and behavior

- Private handoff content lives in `app/handoff.ts` and is marked server-only.
- Shared index and article templates live in `app/site-components.tsx`.
- Client-side code receives only article navigation labels, not the private
  handoff content model.
- `auth.ts` validates the Root Workspace domain; `proxy.ts` protects routes
  before rendering, and each private page verifies the session again.
- The customer evidence library preserves 21 deidentified, Drive-hosted clips
  and their existing Drive permissions.
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
