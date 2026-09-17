# Project State

**Last updated:** 2026-09-17
**Active focus:** **SEO / winter push (2026-09-17).** Triage in
`.agent/REPORTS/2026-09-17-seo-winter-triage.md` (9 findings, all
dispositioned). Shipped: `/winter-camping` (FAQPage schema), home H1 +
year-round section, geo coords, Google Ads tag + tel-click conversion wiring
(inert until `site.ads` ids are set), CSP origins, privacy paragraph. Deployed
(6f22e83→70b95a7); Google Ads tag + phone-click label live (L1 done); ad
images at `assets/ads/`; robots.txt cached-redirect loop fixed: Cloudflare Cache Rule
`bypass-crawler-files` (/robots.txt, /sitemap.xml, /llms.txt) + purge via
`cf-minter run --profile cache-hygiene` (profile added to cf-minter bfc041d);
verified 200×5 as Googlebot. Owner
inputs now gate the rest: GSC/Bing tokens (B9), GBP paste (L4,
copy at `docs/google-business-profile.md`), winter fact sheet (L2), rates (B1),
photos (B11).

**Prior (2026-08-16):** **M1 + M3 SHIPPED.** Site live at https://camping4you.net.
B7 closed and landed on `main` (98369ce, deployed 2026-08-16): `static/og.png`
serves 200 and the home page emits `og:image` + `twitter:card
summary_large_image`, so link unfurls are no longer blank. Same commit ships the
declared-slot image pipeline (`scripts/images.config.mjs` + `gen-assets` +
`gen-img` + `TextureBand.svelte`) with both photo slots empty and optional, and
bumps the CI/deploy actions to v7. **B11** is the remaining half: the owner
dropping Unsplash+ originals into `assets/source/` (brief in its README).
M3 = the Entra-OIDC `/admin` control panel (per D-0001): operator signs in with
Microsoft, edits content, Save commits `content.json` → rebuild; public pages
stay prerendered. Login verified live; save tested end-to-end (real commit
e90a9f1b). Secrets set on Pages (Entra + GITHUB_TOKEN + SESSION_SECRET +
ADMIN_ALLOWLIST = stephen@/reddings@peoriait.com). No milestone actively
building — **M2 (Telnyx SMS)** is next, held in `## Backlog` on A2P
registration. Open nicety: B10 (tighten /admin CSP off unsafe-inline). Owner
may rotate the pasted Entra secret + GitHub PAT anytime (I'll re-set).

---

## 1. Authority surface — where to look for X

| You want to know... | Look in |
|---|---|
| **Scope, principles, hard constraints, criticality rubric** | `.agent/PROJECT-SCOPE.md` |
| **Current state, in-flight work, next session plan** | `.agent/PROJECT-STATE.md` (this file) |
| **Locked vision brief** | `.agent/REPORTS/project-brief.md` |
| **All ratified design decisions** | `.agent/DECISIONS/` (index in `DECISIONS/README.md`) |
| **Open check-ins awaiting input** | `.agent/CHECKINS/` (root; archived in `CHECKINS/ARCHIVED/`) |
| **Generated audit / inspect / research reports** | `.agent/REPORTS/` |
| **Ratified work-structure (milestone→task tree, depends-edges, history)** | `.agent/ROADMAP.md` |
| **Committed work ready now (derived frontier)** | `.agent/TODO.md` (rendered from ROADMAP by `roadmap-render.sh`; never hand-edited) |
| **Unratified ideas** | `.agent/IDEAS/` (created on demand) |

---

## 2. Active milestone

**Milestone:** none active — **M1 shipped 2026-06-27** (see ROADMAP `## Shipped`).
Next: M2 (Telnyx SMS) / M3 (OIDC control panel), both in `## Backlog`, gated.
**Active blockers / gates:** Telnyx A2P brand+campaign registration (M2);
content-store decision from research (M3); owner data for content-fill (B1);
owner-supplied Unsplash+ originals (B11). The old "merge `m1-sveltekit-rebuild`
→ `main`" gate is retired — that branch is fully contained in `main` (verified
`git log main..m1-sveltekit-rebuild` empty, 2026-08-16).

---

## 3. Open check-ins

none

---

## 4. (Dissolved per D-0050)

Deferred work lives in `.agent/ROADMAP.md` `## Backlog` (M2/M3 committed-gated,
tier-C needs-decision).

---

## 4b. SEO/security probe (2026-06-27)

Sentinel probe of live camping4you.net: **13/14 pass**. Closed CSP + HSTS +
all security headers via root `_headers` (B6); IndexNow key + deploy ping live.
Only **analytics** fails — needs the owner to enable Cloudflare Web Analytics
(B8, dashboard). GSC/Bing verification tokens pending (B9). Re-verify with
`npm run probe https://camping4you.net` in the sentinel repo.

## 5. Next session

The share card is landed and deployed; nothing is in flight. To resume:
(1) **B11** — when the owner has Unsplash+ originals, drop them in
`assets/source/` and run `npm run assets` + `npm run img`, then judge them
through the real pipeline in both themes (never from the original file);
(2) when ready for M2/M3, fold the three `.agent/REPORTS/` research findings
into ratified DECISIONs (B2) — recommended picks: content-store **git-backed**,
auth **Cloudflare Access**, SMS **Telnyx Low-Volume-Mixed**; (3) owner inputs
unblock B1 content-fill and Telnyx registration.

---

## 6. Recent milestones

Shipped history lives in ROADMAP `## Shipped` (none yet — M1 in progress).
