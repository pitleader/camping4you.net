# Roadmap — camping4you.net (Leisure Oaks Park)

Canonical work-structure tree (D-0050). Tasks carry `depends:` edges;
`.agent/TODO.md` is the _rendered_ ready-frontier — never hand-edited.
Staged per PROJECT-SCOPE: tier B = M1→M2→M3; tier C (reservations) is out of
scope until a new dated decision.

## Active

> M1 shipped (see ## Shipped). M3 is now building (architecture ratified in
> D-0001). M2 (Telnyx SMS) stays in ## Backlog on A2P registration.

### M3 — OIDC control panel (git-backed editor)
**Admitted:** 2026-06-27 · **Goal:** An Entra-OIDC-gated `/admin` panel where the operator edits park content; saves commit `content.json` to the repo and trigger a rebuild — public pages stay prerendered. Per D-0001.

- [x] **T1** Refactor editable park content out of `site.ts` into `src/lib/content/content.json`; `site.ts` imports + types it (copy-truth `null` rule preserved). — source: D-0001 — done: src/lib/content/content.json, src/lib/content/site.ts
      done-when: all public pages render unchanged from `content.json`-backed `site.ts`; check/lint/test/build green. ✓ editable content (tagline, NAP, hours, rates, rules, sms, legal) now in content.json typed via EditableContent; infra config (url, tokens, geo) stays in site.ts; all gates green, output identical.
- [ ] **T2** Entra OIDC auth — authorization-code + PKCE (`arctic`), signed session cookie (Web Crypto HMAC), admin allowlist enforced in `hooks.server.ts` → `event.locals.user`; secrets server-only. — source: D-0001 — depends: [T1]
      done-when: a login round-trip against Entra sets a session; non-allowlisted users are denied; `/admin/**` is `prerender=false` and unreachable when unauthenticated.
- [ ] **T3** Admin shell — login page, dashboard, `/admin` layout (SSR), sign-out. — depends: [T2]
      done-when: signed-in operator sees the dashboard; sign-out clears the session.
- [ ] **T4** Editor forms — edit rates, hours, rules, office hours, and notices against `content.json`; Zod-validated; copy-truth (clearing a price → `null`). — depends: [T3]
      done-when: forms load current values and validate edits; preview of the resulting `content.json`.
- [ ] **T5** Save action — commit the updated `content.json` to the repo via the GitHub API (fine-grained token, Contents r/w), which triggers `deploy.yml` → rebuild. — depends: [T4]
      done-when: a save produces a real commit + deployment; the live site reflects the edit after rebuild; failures surface to the operator.
- [ ] **T6** Harden + ship — per-request CSP nonce on `/admin` (folds B10), deploy, verify end-to-end with the owner's Entra app + GitHub token. — depends: [T5]
      done-when: live `/admin` login + edit + rebuild works for the owner; `/admin` CSP has no `unsafe-inline`.

## Loose

> Milestone-less one-liner tasks.

## Backlog

> Future / parked work. M2 and M3 are committed (tier B) but gated on M1 and
> on external setup; reservations (tier C) is needs-decision.

- [ ] **B1** Owner content-fill — replace placeholder rates/hours/policies in `site.ts` with real owner-supplied values. — source: PROJECT-SCOPE (copy-truth)
      revisit-when: owner supplies real rates/hours/site-count/policy data
      stratum: committed
      held: creds
- [ ] **B2** Research findings → M2/M3 design — fold `.agent/REPORTS/` research (Telnyx A2P 10DLC, Cloudflare content-store, multi-IdP OIDC) into ratified DECISIONs before building M2/M3. — source: session 2026-06-27 Phase 3
      revisit-when: research reports land in `.agent/REPORTS/`
      stratum: committed
      held: decision
- [x] **B6** Security headers + CSP — root `_headers` now sets HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, and a baseline CSP header on `/*` (Cloudflare Pages serves them on every route, static included). — source: session 2026-06-27 (SEO/security probe) — done: _headers
      Residual (→ M3.T6): `script-src` uses `'unsafe-inline'` for the prerendered hydration bootstrap (a real header CSP can't carry per-page hashes); fine for a forms-less brochure site, tighten when forms/auth land.
- [ ] **B7** OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: session 2026-06-27 (M1.T4/T5)
      revisit-when: brand assets / hero photography available
      stratum: committed
- [x] **B8** Enable analytics — Cloudflare Web Analytics enabled; beacon token wired into `site.analytics.cfBeaconToken`, rendered cookieless from `+layout.svelte` (edge auto-injection was flaky on the Pages custom domain, so the manual token is the reliable path). CSP already allow-lists the beacon. — source: session 2026-06-27 (probe) — done: src/lib/content/site.ts, src/routes/+layout.svelte
- [ ] **B9** Search-engine verification — add Google Search Console + Bing Webmaster tokens to `site.ts` `verification` (`<Seo>` emits them when set); confirm GSC/Bing ownership. IndexNow already pings on deploy. — source: session 2026-06-27 (probe)
      revisit-when: owner provides GSC + Bing verification tokens
      stratum: committed
      held: creds

### M2 — Telnyx service-SMS + STOP/HELP webhooks (A2P 10DLC)
**Goal:** The app sends service-only SMS (confirmations, reminders, notices) via Telnyx and handles inbound STOP/HELP webhooks compliantly.
- [ ] **B3** Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: PROJECT-SCOPE M2
      revisit-when: M1 shipped AND Telnyx brand/campaign (A2P 10DLC) registration approved
      stratum: committed
      held: creds

### Tier C — Reservations / booking
- [ ] **B5** Reservations / online booking (in-app vs. external integration both open). — source: PROJECT-SCOPE (out of scope this version)
      revisit-when: a new dated decision admits tier C after M1–M3 ship
      stratum: needs-decision
      held: decision

## Shipped

> Checked-off milestones, newest first.

### M1 — SvelteKit + SEO rebuild to parity on Cloudflare — 2026-06-27
**Done:** src/routes/+page.svelte, src/lib/content/site.ts, src/lib/seo/structured-data.ts, .github/workflows/ci.yml
Replaced the Hugo site with a SvelteKit 5 + TS (strict) + Tailwind v4 app on
`adapter-cloudflare`, live on the production domain **https://camping4you.net**
(apex + www, valid SSL) and https://camping4you.pages.dev. All 7 pages
(home, rates, rules, contact, privacy, terms, sms-sample) render from a single
typed `site.ts` (copy-truth: unconfirmed prices show "Call for rates"); full
SEO stack (Campground JSON-LD `@graph`, sitemap/llms/robots); outdoorsy OKLCH
design system with dark/light + mobile nav, WCAG-AA contrast verified; CI runs
check+lint+test+build. Tasks T1–T7 all complete; Hugo archived under
`archive/hugo/`.
