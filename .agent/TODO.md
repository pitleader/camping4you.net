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

## Next

## Parked

- [ ] Owner content-fill — replace placeholder rates/hours/policies in `site.ts` with real owner-supplied values. — source: ROADMAP B1 (PROJECT-SCOPE (copy-truth))
- [ ] Research findings → M2/M3 design — fold `.agent/REPORTS/` research (Telnyx A2P 10DLC, Cloudflare content-store, multi-IdP OIDC) into ratified DECISIONs before building M2/M3. — source: ROADMAP B2 (session 2026-06-27 Phase 3)
- [ ] OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: ROADMAP B7 (session 2026-06-27 (M1.T4/T5))
- [ ] Enable analytics — turn on Cloudflare Web Analytics for the Pages project (auto-injects the cookieless beacon; no token in repo), OR set `site.analytics.cfBeaconToken`. CSP already allow-lists `static.cloudflareinsights.com`. Closes the probe's analytics gap. — source: ROADMAP B8 (session 2026-06-27 (probe))
- [ ] Search-engine verification — add Google Search Console + Bing Webmaster tokens to `site.ts` `verification` (`<Seo>` emits them when set); confirm GSC/Bing ownership. IndexNow already pings on deploy. — source: ROADMAP B9 (session 2026-06-27 (probe))
- [ ] Tighten CSP — replace `script-src 'unsafe-inline'` with hashed/nonce script-src once forms/auth (M2/M3) raise the XSS surface; likely needs the form routes on SSR (not prerender) so a per-request nonce is available. — source: ROADMAP B10 (session 2026-06-27 (B6 residual))
- [ ] Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: ROADMAP M2.B3 (PROJECT-SCOPE M2)
- [ ] Build the OIDC relying-party auth + protected control-panel routes over the chosen content store. — source: ROADMAP M3.B4 (PROJECT-SCOPE M3)
- [ ] Reservations / online booking (in-app vs. external integration both open). — source: ROADMAP M3.B5 (PROJECT-SCOPE (out of scope this version))
