# IPSD synchronization workflow

The UXR Handoff website is the content source of truth. The Google Doc remains
the human-readable handoff record, with a smaller structure and explicit
protected areas.

## Commands

```bash
pnpm sync:ipsd:prepare
pnpm sync:ipsd:check
pnpm sync:ipsd:preflight -- <document-result.json> <control-inventory.json> --output <preflight.json>
pnpm sync:ipsd:format-plan <preflight.json> <document-result.json> --output <format-plan.json>
pnpm sync:ipsd:validate-plan -- <apply-plan.json> <preflight.json>
pnpm sync:ipsd:record -- <preflight.json> <post-document-result.json> <post-control-inventory.json> --plan <apply-plan.json>
```

`sync:ipsd:prepare` imports the real typed site content and writes a
deterministic payload to `sync/ipsd-sync.generated.json`. `sync:ipsd:check`
fails when the payload is stale or the safety contract is broken.

The same validation runs before the standard production build and within the
normal test command. A website change therefore cannot pass the usual release
checks until the Google Doc has been applied, read back, and recorded in
`ipsd-sync.state.json`.

After a verified live apply, `ipsd-sync.state.json` records the source and
managed-target hashes, resulting document revision, hash-only proofs for every
live tab, tab topology, native-element counts, the Working Notes named-range
identity, and the presentation-control signature. It never stores protected-tab
text.

The commands consume trusted-read files but never store Google credentials.
Codex applies the prepared payload through the authenticated Google Drive
connector after the preflight has checked the live document ID, complete tab
tree, exact allowlisted tab IDs, current revision, three-way managed-content
baseline, named range, and native elements.

The formatting profile is declared in `ipsd-sync.config.json`. Postflight
verification resolves effective styles, so a `NORMAL_TEXT` paragraph with an
inherited 30pt override still fails. It also verifies paragraph roles, the
branded H1 rule, bold treatments, and native list roles. The formatting-plan
builder reads the exact same live revision as preflight and emits only
range-scoped formatting requests; content and link destinations are preserved.
Font-family repairs explicitly carry the payload-derived bold and italic state;
Google Docs may otherwise reset emphasis when `weightedFontFamily` changes.

## Policies

- `managed-body`: the website fully owns the tab body.
- `managed-block`: only the named synchronization block is owned by the site.
- `verify-only`: preserve the original tab and native elements; when a named
  parity range is configured, only that exact range may mirror website content.
- `doc-to-site-source`: the Doc is the source for this website dataset.
- `protected` / `preserve-only`: never write through this workflow.

All unrecognized tabs are preserve-only. The sync must stop on title/ID drift,
revision conflicts, empty generated output, or any attempted write to an
unmapped or protected tab.

## Applying a payload

1. Run the generator and review the diff.
2. Run a fresh trusted read and the preflight validator. This blocks silent
   overwrites when a collaborator changed a managed tab since the prior sync.
3. Build a request plan for exactly the generated targets whose hashes changed.
   If preflight reports content-perfect formatting repairs, use
   `sync:ipsd:format-plan`; it derives paragraph, font, and list ranges from the
   payload and trusted live snapshot. For multiline list blocks, only the first
   paragraph receives a glyph and continuation paragraphs remain unlisted.
4. Validate the plan. Document-wide requests, missing `tabId` fields,
   protected or unknown tabs, stale revisions, out-of-scope indexes, and
   unexpected request types are rejected mechanically.
5. Submit the validated request array with its exact revision lock.
6. Run a second trusted read and the state recorder. It requires exact ordered
   paragraph/link equality in every managed body or named parity range, proves
   content outside managed ranges and every non-target semantic hash stayed
   unchanged, and verifies the native presentation control before recording the
   new live state.

If the connector accepts a scoped plan but the recorder rejects its formatting,
leave `ipsd-sync.state.json` unchanged. Re-run preflight on the post-write read
with `--recover-after <prior-preflight> --plan <prior-plan>`. This continuation
mode first revalidates the original plan, allows drift only in its original
targets, and proves tab topology, protected controls, non-target tabs, and
content outside managed named ranges before creating a repair preflight bound
to the post-write revision.

Continuous unattended mutation is deliberately not enabled. It would require
long-lived Google credentials and could overwrite collaborator edits. The
Codex-assisted post-change workflow provides the automatic behavior requested
for local content edits while retaining explicit safety and verification. The
normal dev, build, start, and test entry points fail when the prepared or
recorded state is stale, so a local content change cannot quietly ship without
the document handoff step.
