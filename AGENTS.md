# UXR handoff content synchronization

`app/handoff.ts` is the canonical source for the UXR Handoff website and for
the managed areas of the IPSD Google Doc.

When a task changes the meaning of `app/handoff.ts`, `app/customer-quotes.ts`,
or any content rendered from them:

1. Run `pnpm sync:ipsd:prepare`.
2. Review `sync/ipsd-sync.generated.json` and confirm every changed site page
   is represented in exactly one mapped document destination.
3. Read the live document tab tree and verify the immutable tab IDs and titles
   against `ipsd-sync.config.json`.
4. Use Google Docs connector writes only. Lock each write with the latest
   `requiredRevisionId`, target every request with an explicit allowlisted
   `tabId`, and re-read after every managed-tab replacement.
5. Run `pnpm sync:ipsd:check`, the normal test suite, and a final Google Docs
   readback before declaring the content change complete.

Safety rules:

- Never write to tab `t.0` (`IPSD`). It contains HR-specific information.
- Unknown or newly discovered tabs are preserve-only by default.
- Never use a document-wide replacement request.
- `VOC Customer Quote Library` is Doc-to-site source content; do not overwrite
  it from the website.
- `Additional Deliverable IV (Presentation Template)` is verify-only because
  it contains a native control that must remain intact.
- `Appendix` is preserve-only.
- The Working Notes sync status is a managed block; do not replace the whole
  tab or remove its existing figures and notes.
- Abort if a tab ID/title differs from the config, if the document revision
  changes during a write, or if generated content is unexpectedly empty.
- Do not store Google credentials, HR text, or full protected-tab snapshots in
  the repository. Revision history is the recovery path for live document
  writes.

The local generator prepares deterministic, reviewable content. It does not
authenticate to Google or mutate the document by itself. Applying the payload
is intentionally handled by Codex through the authenticated Google Drive
connector so target checks, revision locking, and readback verification cannot
be bypassed.
