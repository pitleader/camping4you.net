# Roadmap — Shipped history (camping4you.net)

Done tasks migrated out of the live frontier in `.agent/ROADMAP.md`, newest
block first. Task lines are kept verbatim so `depends:` targets pointing at a
migrated task keep resolving — `roadmap-render.sh` reads this file for
done-resolution.

## Shipped

### Harvested tasks — 2026-08-16

- [x] **B6** Security headers + CSP — root `_headers` now sets HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, and a baseline CSP header on `/*` (Cloudflare Pages serves them on every route, static included). — source: session 2026-06-27 (SEO/security probe) — done: _headers
      Residual (→ M3.T6, now carried by the live task B10): `script-src` uses `'unsafe-inline'` for the prerendered hydration bootstrap (a real header CSP can't carry per-page hashes); fine for a forms-less brochure site, tighten when forms/auth land.
- [x] **B7** OG share image — `static/og.png` (1200×630) is composed by `npm run assets` from the park mark, the dusk-sky/treeline motifs, and `content.json` copy, and `site.ogImage` is wired, so every unfurl now carries a card. Built in three layers so an optional photographic backdrop can slot under the artwork without touching it. — source: session 2026-06-27 (M1.T4/T5) — done: scripts/gen-assets.mjs, static/og.png, src/lib/content/site.ts
- [x] **B8** Enable analytics — Cloudflare Web Analytics enabled; beacon token wired into `site.analytics.cfBeaconToken`, rendered cookieless from `+layout.svelte` (edge auto-injection was flaky on the Pages custom domain, so the manual token is the reliable path). CSP already allow-lists the beacon. — source: session 2026-06-27 (probe) — done: src/lib/content/site.ts, src/routes/+layout.svelte
