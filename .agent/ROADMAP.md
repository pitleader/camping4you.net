# Roadmap — camping4you.net (Leisure Oaks Park)

Canonical work-structure tree (D-0050). Tasks carry `depends:` edges;
`.agent/TODO.md` is the _rendered_ ready-frontier — never hand-edited.
Staged per PROJECT-SCOPE: tier B = M1→M2→M3; tier C (reservations) is out of
scope until a new dated decision.

## Active

> M1 + M3 shipped (see ## Shipped). No milestone is actively building.
> M2 (Telnyx SMS) stays in ## Backlog on A2P registration.

## Loose

> Milestone-less one-liner tasks.

- [x] **L1** Ads conversion IDs — set `site.ads.conversionId` (AW-…) + `callLabel` in `site.ts`; the Google tag + tel-click conversion (layout) and CSP origins (`_headers`) are already wired and emit only when set. — source: REPORTS/2026-09-17-seo-winter-triage.md F9
      done: 2026-09-17 — AW-18377202342 / Rh9UCOu2jPscEKa197pE set (commits 1138669, 70b95a7); ad assets via scripts/gen-ads.mjs.
- [ ] **L2** Winter facts → operator-editable — move the winter copy on `/winter-camping` into a `winter` block in `content.json` + Zod schema + /admin editor, so the owner can state which sites are winter-ready, water-in-freeze, plowing, electric billing, winter rate. Content-store shape change → Critical check-in before build. — source: REPORTS/2026-09-17-seo-winter-triage.md F2
      revisit-when: owner supplies the winter fact sheet
      held: decision
      note: 2026-09-22 — owner supplied the facts and they are in the page copy (commit 25fcb6a); site-count still unknown. L2 remains the editability move, still Critical-gated.
- [ ] **L3** More ranking pages — general FAQ (`FAQPage` builder exists), amenities page, "near Peoria / Pekin / I-474" area page; each doubles as an ad landing page. — source: REPORTS/2026-09-17-seo-winter-triage.md F8
      revisit-when: general-FAQ + amenities pages earn their own decision (area page shipped)
      held: design
      note: 2026-09-22 — area page shipped as `/rv-park-peoria` (drive times from OSRM, FAQPage schema, linked from home/sitemap/llms.txt). General FAQ + amenities pages remain.
- [x] **L4** GBP copy pasted — owner pastes `docs/google-business-profile.md` (categories, description, winter post, Q&A, photos) into the Business Profile dashboard. — source: REPORTS/2026-09-17-seo-winter-triage.md F1
      done: 2026-09-17 — categories, description, hours, cover, winter post (pending Google review) applied. Residual: Q&A seeding on the public Maps listing; real photos (B11).
- [ ] **L5** Off-site local SEO — owner-hand: claim/correct the 14 directory listings in `docs/directory-listings.md` (exact NAP), verify the GBP website field is `https://camping4you.net`, and run the review ask (printable QR card at `docs/review-card.pdf`). Rationale: GSC 3-month export shows the brand query "leisure oaks park" at avg position ~11 (137 impressions) — a prominence/consistency gap, not a site-copy gap. — source: session 2026-09-22 (GSC Performance export)
      revisit-when: top-5 directories claimed, or brand query reaches page 1
- [ ] **L6** Request indexing — owner-hand: GSC URL inspection → Request indexing for `/winter-camping` and `/rv-park-peoria`; neither appears in the 3-month Pages export. — source: session 2026-09-22 (GSC Pages export)
      revisit-when: both URLs appear in the GSC Pages report

## Backlog

> Future / parked work. M2 and M3 are committed (tier B) but gated on M1 and
> on external setup; reservations (tier C) is needs-decision.

- [ ] **B1** Owner content-fill — replace placeholder rates/hours/policies in `site.ts` with real owner-supplied values. — source: PROJECT-SCOPE (copy-truth)
      revisit-when: owner supplies real rates/hours/site-count/policy data
      stratum: committed
      held: creds
- [ ] **B2** Research findings → M2/M3 design — fold `.agent/REPORTS/ARCHIVED/research-telnyx-a2p-10dlc.md`, `research-cloudflare-content-store.md`, `research-oidc-multi-idp.md` into ratified DECISIONs before building M2 (M3 already shipped git-backed + Entra per D-0001; record the residual). — source: session 2026-06-27 Phase 3
      revisit-when: research reports land in `.agent/REPORTS/`
      stratum: committed
      held: decision
- [ ] **B11** Owner imagery for the two declared photo slots — drop Unsplash+ originals into `assets/source/` (`og-backdrop.*`, `texture-rates.*`) and run `npm run assets` + `npm run img`. The pipeline, the slot declarations, and the picking brief are shipped; both slots are optional and the site is complete and green while empty. Non-representational imagery only, and none of it may go on the Google Business Profile. — source: session 2026-08-10 — verified: 2026-09-17
      revisit-when: owner downloads originals from their Unsplash+ account
      stratum: committed
      held: creds
- [x] **B9** Search-engine verification — add Google Search Console + Bing Webmaster tokens to `site.ts` `verification` (`<Seo>` emits them when set); confirm GSC/Bing ownership. IndexNow already pings on deploy. — source: session 2026-06-27 (probe)
      done: owner confirmed GSC verified (2026-09-21; predates this board line — verified out-of-band, not via site.ts token).
      revisit-when: owner provides GSC + Bing verification tokens
      stratum: committed
      held: creds
- [ ] **B10** Tighten `/admin` CSP — replace `script-src 'unsafe-inline'` with a per-request nonce on the SSR admin routes (the public prerendered pages keep the baseline CSP). — source: session 2026-06-27 (M3.T6)
      revisit-when: security hardening pass
      stratum: committed
      held: design

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

### M3 — OIDC control panel (git-backed editor) — 2026-06-27
**Done:** src/routes/admin/edit/+page.server.ts, src/lib/server/github.ts, src/lib/server/auth.ts
Entra-OIDC-gated `/admin` panel (per D-0001): the operator signs in with Microsoft (allow-listed), edits park content, and Save commits `content.json` via the GitHub API → Pages rebuild — public pages stay prerendered. Built on a typed `content.json` store with Zod validation (copy-truth: blank price → null) and a signed session cookie. Login verified live; the save path was tested end-to-end (real commit). Tasks T1–T6 complete.


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
