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

- [ ] Entra OIDC auth — authorization-code + PKCE (`arctic`), signed session cookie (Web Crypto HMAC), admin allowlist enforced in `hooks.server.ts` → `event.locals.user`; secrets server-only. — source: ROADMAP M3.T2 (D-0001 — depends: [T1])

## Next

- [ ] Admin shell — login page, dashboard, `/admin` layout (SSR), sign-out. — source: ROADMAP M3.T3
- [ ] Editor forms — edit rates, hours, rules, office hours, and notices against `content.json`; Zod-validated; copy-truth (clearing a price → `null`). — source: ROADMAP M3.T4
- [ ] Save action — commit the updated `content.json` to the repo via the GitHub API (fine-grained token, Contents r/w), which triggers `deploy.yml` → rebuild. — source: ROADMAP M3.T5
- [ ] Harden + ship — per-request CSP nonce on `/admin` (folds B10), deploy, verify end-to-end with the owner's Entra app + GitHub token. — source: ROADMAP M3.T6

## Parked

- [ ] Owner content-fill — replace placeholder rates/hours/policies in `site.ts` with real owner-supplied values. — source: ROADMAP B1 (PROJECT-SCOPE (copy-truth))
- [ ] Research findings → M2/M3 design — fold `.agent/REPORTS/` research (Telnyx A2P 10DLC, Cloudflare content-store, multi-IdP OIDC) into ratified DECISIONs before building M2/M3. — source: ROADMAP B2 (session 2026-06-27 Phase 3)
- [ ] OG share image — design a 1200×630 `og.png` and wire `site.ogImage`; until then `<Seo>` omits og:image (no broken card). — source: ROADMAP B7 (session 2026-06-27 (M1.T4/T5))
- [ ] Search-engine verification — add Google Search Console + Bing Webmaster tokens to `site.ts` `verification` (`<Seo>` emits them when set); confirm GSC/Bing ownership. IndexNow already pings on deploy. — source: ROADMAP B9 (session 2026-06-27 (probe))
- [ ] Build the Telnyx send adapter + inbound webhook route (signature-verified, idempotent) with STOP/HELP keyword handling and consent records. — source: ROADMAP M2.B3 (PROJECT-SCOPE M2)
- [ ] Reservations / online booking (in-app vs. external integration both open). — source: ROADMAP M2.B5 (PROJECT-SCOPE (out of scope this version))
