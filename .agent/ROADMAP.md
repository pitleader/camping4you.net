# Roadmap — camping4you.net (Leisure Oaks Park)

Canonical work-structure tree (D-0050). Tasks carry `depends:` edges;
`.agent/TODO.md` is the _rendered_ ready-frontier — never hand-edited.
Staged per PROJECT-SCOPE: tier B = M1→M2→M3; tier C (reservations) is out of
scope until a new dated decision.

## Active

### M1 — SvelteKit + SEO rebuild to parity on Cloudflare
**Admitted:** 2026-06-27 · **Goal:** Replace the Hugo site with a SvelteKit 5 app on Cloudflare that renders every current page from a single typed content module, with the full SEO stack, deployed to a preview URL.

- [x] **T1** Scaffold SvelteKit 5 + TypeScript (`strict`) + Tailwind v4 + `adapter-cloudflare`; archive the Hugo site (content/layouts/hugo.toml). — done: vite.config.ts, src/routes/+page.svelte
      done-when: `npm run build` produces a Cloudflare build, `vite dev` serves a home route, and the Hugo-specific files are removed or moved to `archive/`. ✓ build → `.svelte-kit/cloudflare/`; dev serves `/` (200); Hugo in `archive/hugo/`; svelte-check 0/0 + lint green. Also shipped a polished design system (pine/amber OKLCH tokens, Fraunces+Inter, dark/light) and a designed home page (hero, features, rates/rules teasers, contact CTA) — copy-truth: no invented prices ("Call for rates").
- [x] **T2** Typed content module (`$lib/content/site.ts`) — single source for all park facts (name, NAP, hours, rates, rules sections, compliance/effective dates). Placeholders stay visibly placeholder (copy-truth). — depends: [T1] — done: src/lib/content/site.ts, src/lib/content/site.test.ts
      done-when: every page's data reads from `site.ts`; no park fact is hardcoded in a template; `$XX.XX`-style placeholders are clearly marked, not invented. ✓ home/Nav/Footer source from `site.ts`; rate prices are `null` → `formatPrice()` renders "Call for rates"; a unit test guards against invented placeholders + marketing wording.
- [x] **T3** Rebuild all current pages from the content module: home, rates, contact, rules, privacy, terms, sample-SMS. — depends: [T2] — done: src/routes/rates/+page.svelte, src/routes/privacy/+page.svelte
      done-when: each existing Hugo page has a working SvelteKit route rendering from `site.ts`, content-parity verified against the current site. ✓ all 7 routes prerender + serve 200, titles correct, facts sourced from `site.ts`; copy-truth verified — no `$XX` placeholder reaches output. Shared `PageHeader` + `LegalContact` components; nav now points at real routes.
- [x] **T4** SEO stack — typed schema.org JSON-LD `@graph` in `$lib/seo`, a `<Seo>` meta helper (title/description/canonical/OG/Twitter/robots), and `sitemap.xml` + `llms.txt` + `robots.txt` routes. — depends: [T2] — done: src/lib/seo/structured-data.ts, src/lib/components/Seo.svelte
      done-when: `/` JSON-LD validates clean in Google Rich Results, sitemap/llms.txt/robots serve, and every emitted value traces to `site.ts`. ✓ Campground/LodgingBusiness `@graph` (Organization + Campground + WebSite) parses clean; `<Seo>` on all 7 pages (canonical/OG/Twitter/geo, geo+image omitted while unconfirmed — copy-truth); sitemap.xml (7 urls), llms.txt, robots.txt prerender + trace to `site.ts`. Live Rich-Results check after T6 deploy.
- [x] **T5** Design + styling pass — Tailwind v4 token architecture (OKLCH palette, role-based semantic tokens), responsive 320px→desktop, reduced-motion contract, AA contrast on every token pair. — depends: [T3] — done: src/routes/layout.css, src/lib/components/Nav.svelte
      done-when: pages render correctly from 320px to desktop, all token pairs ≥ 4.5:1, `prefers-reduced-motion` honored. ✓ added a mobile nav menu (was a real <md gap); reduced-motion in base layer; WCAG audit of all 15 semantic pairs passes (text ≥4.5, UI/large ≥3) — light accent deepened to oklch(0.54 0.13 48) to clear AA on canvas.
- [ ] **T6** Deploy to Cloudflare Pages — adapter/`wrangler` config, successful build, preview URL, deploy steps documented in README. — depends: [T4, T5]
      done-when: a Cloudflare Pages preview URL serves the full site; the deploy command is documented.
- [x] **T7** CI green — `tsc --noEmit` + lint + a minimal test in a GitHub Actions workflow. — depends: [T1] — done: .github/workflows/ci.yml
      done-when: CI runs on push and passes (typecheck + lint + test). ✓ `.github/workflows/ci.yml` runs check + lint + test + build on push/PR; all four pass locally (the GitHub run fires on first push).

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
- [ ] **B6** CSP hardening — add hash-mode Content-Security-Policy for the prerendered pages (the inline pre-paint theme script needs its hash allow-listed) plus a sync test so the hash can't drift. Deferred from T5 to avoid a fragile hash without the guard. — source: session 2026-06-27 (M1.T5)
      revisit-when: security hardening pass, before public launch
      stratum: committed
      held: design
- [ ] **B7** OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: session 2026-06-27 (M1.T4/T5)
      revisit-when: brand assets / hero photography available
      stratum: committed

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
