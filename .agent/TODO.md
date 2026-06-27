# TODO — committed-work queue (derived)

<!-- GENERATED-BY: roadmap-render/roadmap-render.sh -->
<!-- DO NOT HAND-EDIT. This file is the ready-task frontier
     rendered from .agent/ROADMAP.md by roadmap-render.sh.
     Edit ROADMAP.md and re-render. -->

> One axis: *committed, actionable work not yet done* (D-0035),
> derived from ROADMAP.md (D-0050). Now = ready tasks; Next =
> blocked tasks (deps unmet); Parked = ## Backlog tasks (future/parked).
> Each line cites its ROADMAP task; a Loose task's
> own source is preserved in parentheses.

## Now

- [ ] Typed content module (`$lib/content/site.ts`) — single source for all park facts (name, NAP, hours, rates, rules sections, compliance/effective dates). Placeholders stay visibly placeholder (copy-truth). — source: ROADMAP M1.T2
- [ ] CI green — `tsc --noEmit` + lint + a minimal test in a GitHub Actions workflow. — source: ROADMAP M1.T7

## Next

- [ ] Rebuild all current pages from the content module: home, rates, contact, rules, privacy, terms, sample-SMS. — source: ROADMAP M1.T3
- [ ] SEO stack — typed schema.org JSON-LD `@graph` in `$lib/seo`, a `<Seo>` meta helper (title/description/canonical/OG/Twitter/robots), and `sitemap.xml` + `llms.txt` + `robots.txt` routes. — source: ROADMAP M1.T4
- [ ] Design + styling pass — Tailwind v4 token architecture (OKLCH palette, role-based semantic tokens), responsive 320px→desktop, reduced-motion contract, AA contrast on every token pair. — source: ROADMAP M1.T5
- [ ] Deploy to Cloudflare Pages — adapter/`wrangler` config, successful build, preview URL, deploy steps documented in README. — source: ROADMAP M1.T6

## Parked

- [ ] Owner content-fill — replace placeholder rates/hours/policies in `site.ts` with real owner-supplied values. — source: ROADMAP B1 (PROJECT-SCOPE (copy-truth))
- [ ] Research findings → M2/M3 design — fold `.agent/REPORTS/` research (Telnyx A2P 10DLC, Cloudflare content-store, multi-IdP OIDC) into ratified DECISIONs before building M2/M3. — source: ROADMAP B2 (session 2026-06-27 Phase 3)
- [ ] Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: ROADMAP M2.B3 (PROJECT-SCOPE M2)
- [ ] Build the OIDC relying-party auth + protected control-panel routes over the chosen content store. — source: ROADMAP M3.B4 (PROJECT-SCOPE M3)
- [ ] Reservations / online booking (in-app vs. external integration both open). — source: ROADMAP M3.B5 (PROJECT-SCOPE (out of scope this version))
