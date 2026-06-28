# DECISION-0001 — M3 control panel: git-backed content store + Entra OIDC auth

**Status:** Binding
**Date:** 2026-06-27
**Ratified:** 2026-06-27
**Project:** camping4you.net

## Context

M3 (PROJECT-SCOPE) is the auth-gated operator control panel for editing park
content (rates, hours, rules, notices). It was gated on two open forks the
2026-06-27 research reports (`.agent/REPORTS/`) scoped: the content store and the
auth provider. The operator (owner) has now greenlit building it and chosen the
identity provider. The binding constraint is the current site architecture: the
public marketing pages are **fully prerendered/static** on Cloudflare Pages
(PSI ~99, fast LCP) and all editable facts live in `src/lib/content/site.ts`.
The decision must not silently sacrifice that static delivery.

## Decision

Two parts.

**(Part 1 — content store: git-backed rebuild.)** Editable content moves into
`src/lib/content/content.json`; `site.ts` imports and types it (stays the typed
single source of truth, copy-truth `null` rule preserved). The control panel
saves by committing an updated `content.json` to the GitHub repo via the GitHub
API, which triggers the existing `deploy.yml` → Pages rebuild (~1–2 min). Public
pages stay **prerendered**; edit history/audit is **git history** (revertable).
No runtime database.

**(Part 2 — auth: Entra OIDC, app-level.)** The `/admin` area is SSR (Pages
Functions). Authentication is OpenID Connect against **Microsoft Entra ID**
(authorization-code + PKCE via `arctic`, edge-compatible), with a signed
session cookie (HMAC via Web Crypto). Access is gated to an **allowlist** of
admin identities (email/oid) enforced in `hooks.server.ts` → `event.locals.user`.
Secrets (`ENTRA_*`, `GITHUB_TOKEN`, `SESSION_SECRET`) are server-only
(`$env/dynamic/private` / Pages secrets), never in the client bundle or repo.

This **supersedes** the research's runner-up picks for this project: Cloudflare
Access (auth) and D1 (store). Both remain valid; the owner chose Entra (already
in their tenant) and git-backed (keeps static delivery + free audit).

## Alternatives considered

- **D1 runtime store** — instant edits, but forces the public pages to SSR
  (loses static prerender/perf) and needs schema + migrations + a versions table
  for audit. Rejected: the static speed is a real asset and edits are infrequent;
  the ~1–2 min rebuild is the least-important dimension here.
- **Cloudflare Access (Zero Trust)** — the research's auth recommendation
  (federates Google/Microsoft, ~no app auth code). Rejected for this project
  because the owner specifically wants Entra app-level OIDC and to manage the
  user in their own tenant; the SvelteKit enforcement point is identical, so a
  later switch stays cheap.
- **Headless CMS / KV** — extra service or eventual-consistency store with no
  native versioning; more infra than a single-park brochure needs.

## Consequences

- New files: `src/lib/content/content.json`; `src/routes/admin/**` (SSR, login,
  dashboard, edit forms, `save` action); auth in `hooks.server.ts` +
  `$lib/server/auth.ts`; a `content.json` GitHub-commit module.
- `src/lib/content/site.ts` changes from holding editable values to importing
  `content.json` (typed); pages are unaffected (they already read `site.ts`).
- `/admin/**` routes set `export const prerender = false` (and likely `ssr`),
  keeping the rest of the site prerendered.
- New required secrets (owner provides): `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`,
  `ENTRA_CLIENT_SECRET`, `ADMIN_ALLOWLIST`, `GITHUB_TOKEN` (fine-grained, this
  repo, Contents: read/write), `SESSION_SECRET`. Set as Pages secrets + local
  `.dev.vars`.
- Entra app registration (owner): redirect URI
  `https://camping4you.net/admin/auth/callback` (+ a localhost URI for dev),
  delegated `openid profile email`, a client secret.
- Durable rule: editable park content is authored in `content.json` only; the
  panel writes there via commit, never to a runtime store. B10 (tighten CSP off
  `script-src 'unsafe-inline'`) is now in scope — the SSR `/admin` routes can
  carry a per-request nonce.
- New ROADMAP milestone M3 activates with tasks tracing to this decision.
