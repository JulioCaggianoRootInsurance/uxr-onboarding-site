# IPSD synchronization workflow

The UXR Handoff website is the content source of truth. The Google Doc remains
the human-readable handoff record, with a smaller structure and explicit
protected areas.

## Commands

```bash
pnpm sync:ipsd:prepare
pnpm sync:ipsd:check
```

`sync:ipsd:prepare` imports the real typed site content and writes a
deterministic payload to `sync/ipsd-sync.generated.json`. `sync:ipsd:check`
fails when the payload is stale or the safety contract is broken.

The same validation runs before the standard production build and within the
normal test command. A website change therefore cannot pass the usual release
checks until the Google Doc has been applied, read back, and recorded in
`ipsd-sync.state.json`.

After a verified live apply, `ipsd-sync.state.json` records the source and
managed-target hashes, resulting document revision, and hash-only proofs for
preserved tabs. It never stores protected-tab text.

The commands never contact Google. Codex applies the prepared payload through
the authenticated Google Drive connector after confirming the live document
ID, complete tab tree, exact allowlisted tab IDs, and current revision.

## Policies

- `managed-body`: the website fully owns the tab body.
- `managed-block`: only the named synchronization block is owned by the site.
- `verify-only`: compare against the website, but do not rewrite automatically.
- `doc-to-site-source`: the Doc is the source for this website dataset.
- `protected` / `preserve-only`: never write through this workflow.

All unrecognized tabs are preserve-only. The sync must stop on title/ID drift,
revision conflicts, empty generated output, or any attempted write to an
unmapped or protected tab.

## Applying a payload

1. Run the generator and review the diff.
2. Read the full live tab topology.
3. For each changed managed tab, read its current body and revision.
4. Issue only tab-scoped, revision-locked requests.
5. Re-read every changed tab and compare its semantic content hash.
6. Verify the protected IPSD tab and the full tab topology are unchanged.

Continuous unattended mutation is deliberately not enabled. It would require
long-lived Google credentials and could overwrite collaborator edits. The
Codex-assisted post-change workflow provides the automatic behavior requested
for local content edits while retaining explicit safety and verification.
