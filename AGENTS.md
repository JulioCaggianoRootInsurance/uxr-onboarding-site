# UXR handoff content synchronization

`app/handoff.ts` is the canonical source for the UXR Handoff website. It is
also the source used when managed IPSD areas are intentionally synchronized.

When a task changes the meaning of `app/handoff.ts`, `app/customer-quotes.ts`,
or any content rendered from them:

1. Run `pnpm sync:ipsd:prepare` and review
   `sync/ipsd-sync.generated.json` so the website has a current,
   deterministic handoff payload.
2. Run the normal test suite and production build. Website releases are not
   blocked when the IPSD's last verified live revision is older than the
   website; `sync/ipsd-sync.state.json` is a record of that last verified live
   application, not a website release gate.

When the IPSD needs to catch up to the website, additionally:

1. Confirm every changed site page is represented in exactly one mapped
   document destination.
2. Run a fresh file-backed trusted read, then pass its `document-result.json`
   and `control-inventory.json` to `pnpm sync:ipsd:preflight -- ... --output
   <work-preflight.json>`. Stop on any managed-content, native-element, tab-ID,
   title, named-range, or presentation-control drift.
3. Build one JSON apply plan containing the exact connector `requests`,
   `targetContentHashes`, and `writeControl.requiredRevisionId`. Run `pnpm
   sync:ipsd:validate-plan -- <plan.json> <work-preflight.json>` and pass the
   validated request objects to the Google Docs connector unchanged.
   For a formatting-only repair, generate that plan with `pnpm
   sync:ipsd:format-plan <work-preflight.json> <document-result.json> --output
   <plan.json>`; do not hand-author font or list offsets.
4. Run a new trusted read after the write. Record it only with `pnpm
   sync:ipsd:record -- <work-preflight.json> <post-document-result.json>
   <post-control-inventory.json> --plan <plan.json>`. This verifies generated
   text and links, proves every non-target tab and the tab topology stayed
   unchanged, and updates `sync/ipsd-sync.state.json` from the live readback.
5. Run `pnpm sync:ipsd:check`, the normal test suite, and the production build
   before declaring the IPSD synchronization complete.

Safety rules:

- Never write to tab `t.0` (`IPSD`). It contains HR-specific information.
- Unknown or newly discovered tabs are preserve-only by default.
- Never use a document-wide replacement request.
- `VOC Customer Quote Library` is Doc-to-site source content; do not overwrite
  it from the website.
- `Additional Deliverable IV (Presentation Template)` is preserve/verify-only
  outside `UXR_HANDOFF_PRESENTATION_PARITY`. Only that named parity range may
  mirror website content; its native control and original structure must remain
  intact.
- `Appendix` is preserve-only.
- The Working Notes sync status is a managed block; do not replace the whole
  tab or remove its existing figures and notes.
- Abort if a tab ID/title differs from the config, if the document revision
  changes during a write, or if generated content is unexpectedly empty.
- Never edit `sync/ipsd-sync.state.json` by hand. Only the post-write recorder
  may update it from a fresh trusted read and a validated apply plan.
- Never construct connector requests ad hoc after plan validation. If a request
  changes, regenerate and revalidate the entire plan against a fresh preflight.
- If a scoped write succeeds but postflight verification fails, do not edit the
  state file or use bootstrap. Create a continuation preflight with
  `--recover-after <prior-preflight> --plan <prior-plan>`; this route revalidates
  the prior plan and proves protected, non-target, and unmanaged content before
  permitting a follow-up repair from the new live revision.
- Every managed paragraph must satisfy `root-uxr-doc-v1`: Proxima Nova, 11pt
  body text with 115% line spacing, 26pt titles, 14/14/12pt H1/H2/H3, the
  existing branded 3pt orange H1 rule, native bullets/numbers only on payload
  list roles, and explicit bold/italic/link-label treatment. Paragraph-style
  promotion alone is not a character-style reset.
- Do not store Google credentials, HR text, or full protected-tab snapshots in
  the repository. Revision history is the recovery path for live document
  writes.

The local generator prepares deterministic, reviewable content. It does not
authenticate to Google or mutate the document by itself. Applying the payload
is intentionally handled by Codex through the authenticated Google Drive
connector, while the preflight, apply-plan validator, and post-write recorder
mechanically enforce target scope, revision locking, drift detection, and
readback verification.
