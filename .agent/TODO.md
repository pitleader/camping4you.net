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
- [ ] CSP hardening — add hash-mode Content-Security-Policy for the prerendered pages (the inline pre-paint theme script needs its hash allow-listed) plus a sync test so the hash can't drift. Deferred from T5 to avoid a fragile hash without the guard. — source: ROADMAP B6 (session 2026-06-27 (M1.T5))
- [ ] OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: ROADMAP B7 (session 2026-06-27 (M1.T4/T5))
- [ ] Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: ROADMAP M2.B3 (PROJECT-SCOPE M2)
- [ ] Build the OIDC relying-party auth + protected control-panel routes over the chosen content store. — source: ROADMAP M3.B4 (PROJECT-SCOPE M3)
- [ ] Reservations / online booking (in-app vs. external integration both open). — source: ROADMAP M3.B5 (PROJECT-SCOPE (out of scope this version))
