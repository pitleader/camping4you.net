# Roadmap — camping4you.net (Leisure Oaks Park)

Canonical work-structure tree (D-0050). Tasks carry `depends:` edges;
`.agent/TODO.md` is the _rendered_ ready-frontier — never hand-edited.
Staged per PROJECT-SCOPE: tier B = M1→M2→M3; tier C (reservations) is out of
scope until a new dated decision.

## Active

> No milestone is actively building. M1 shipped (see ## Shipped). The next
> milestones, M2 (Telnyx SMS) and M3 (OIDC control panel), are committed but
> held in ## Backlog on external gates (Telnyx A2P registration; research-fold
> decisions). They activate when their `revisit-when:` clears.

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
      Residual (→ B10): `script-src` uses `'unsafe-inline'` for the prerendered hydration bootstrap (a real header CSP can't carry per-page hashes); fine for a forms-less brochure site, tighten when forms/auth land.
- [ ] **B7** OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: session 2026-06-27 (M1.T4/T5)
      revisit-when: brand assets / hero photography available
      stratum: committed
- [ ] **B8** Enable analytics — turn on Cloudflare Web Analytics for the Pages project (auto-injects the cookieless beacon; no token in repo), OR set `site.analytics.cfBeaconToken`. CSP already allow-lists `static.cloudflareinsights.com`. Closes the probe's analytics gap. — source: session 2026-06-27 (probe)
      revisit-when: owner enables Web Analytics in the Cloudflare dashboard
      stratum: committed
      held: creds
- [ ] **B9** Search-engine verification — add Google Search Console + Bing Webmaster tokens to `site.ts` `verification` (`<Seo>` emits them when set); confirm GSC/Bing ownership. IndexNow already pings on deploy. — source: session 2026-06-27 (probe)
      revisit-when: owner provides GSC + Bing verification tokens
      stratum: committed
      held: creds
- [ ] **B10** Tighten CSP — replace `script-src 'unsafe-inline'` with hashed/nonce script-src once forms/auth (M2/M3) raise the XSS surface; likely needs the form routes on SSR (not prerender) so a per-request nonce is available. — source: session 2026-06-27 (B6 residual)
      revisit-when: M2 or M3 adds a form or authenticated route
      stratum: committed
      held: design

### M2 — Telnyx service-SMS + STOP/HELP webhooks (A2P 10DLC)
**Goal:** The app sends service-only SMS (confirmations, reminders, notices) via Telnyx and handles inbound STOP/HELP webhooks compliantly.
- [ ] **B3** Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: PROJECT-SCOPE M2
      revisit-when: M1 shipped AND Telnyx brand/campaign (A2P 10DLC) registration approved
      stratum: committed
      held: creds

### M3 — OIDC control panel
**Goal:** An auth-gated control panel lets the operator edit `site.ts`-backed content; OIDC via Google + Microsoft + Cloudflare Access (free tier).
- [ ] **B4** Build the OIDC relying-party auth + protected control-panel routes over the chosen content store. — source: PROJECT-SCOPE M3
      revisit-when: M2 shipped AND content-store (KV / D1 / Durable Object) decided
      stratum: committed
      held: design

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
