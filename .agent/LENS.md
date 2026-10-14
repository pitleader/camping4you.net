# The Lens — what camping4you.net is, right now

restated: 2026-10-14

<!-- The session-read core (dotagent L95). Read every session before
     PROJECT-SCOPE.md. `class: current` (declared in <repo>/AGENT-SURFACES.txt):
     it must be true right now — bump `restated:` whenever the project moves.
     One screen. Boundaries live in PROJECT-SCOPE.md, not here. -->

## 1. What camping4you.net is

**The website for Leisure Oaks Park, an RV park and campground at 5805 S
Lafayette Ave, Bartonville, IL (Peoria area). It has three co-equal jobs: a
fast, search-strong brochure site that gets campers to call; the public host
for the park's service-only SMS compliance pages (Telnyx A2P 10DLC); and a
sign-in-gated control panel the operator uses to edit park content.**

It is a SvelteKit 5 + TypeScript + Tailwind v4 app on Cloudflare Pages. Public
pages prerender. Only `/admin` runs server-side. Park facts have one home:
`src/lib/content/content.json`, typed and validated by `site.ts` and
`content-schema.ts`. A fact the owner has not confirmed is `null` and renders an
honest fallback such as "Call for rates".

## 2. What it does

- **Brochure pages:** home, rates, rules, contact, `/winter-camping` and
  `/rv-park-peoria`. The last two are search landing pages with FAQPage schema.
- **Gets found:** a typed JSON-LD `@graph`, `sitemap.xml`, `llms.txt`,
  `robots.txt`, an IndexNow ping on every deploy, Search Console verified.
  Google Ads tag with phone-click conversion tracking. Cloudflare Web Analytics.
- **Compliance pages:** privacy, terms and sample-SMS stay live for A2P
  registration. Sending SMS and handling STOP/HELP (M2) is **not built yet**.
- **Operator editing (`/admin`):** Microsoft (Entra) sign-in with an allow-list.
  Save commits `content.json` through the GitHub API, which triggers a rebuild.

## 3. How it got here

**It was** a Hugo site (2025). **That produced** a full SvelteKit rebuild on
Cloudflare (M1) and the git-backed control panel (M3), both shipped
2026-06-27. A local-search push followed in September 2026: winter and Peoria
area pages, GBP copy, directory and review collateral. **What it cost:** rates
are still `null` because the owner hasn't supplied them. Analytics silently
404'd for months until 2026-09-17. A board line read as current when it was
stale (B9).

## 4. What is in flight, right now

No milestone is actively building (ROADMAP `## Active`). The open work below
is as of the last session (2026-09-22):
- **Owner-hand local SEO:** directory listings, the review ask and the GBP
  website field (L5). Request indexing for the two new pages (L6).
- **Waiting on a decision or design:** operator-editable winter facts (L2,
  Critical data-shape change). General-FAQ and amenities pages (L3).
- **Gated:** M2 Telnyx SMS (waiting on A2P registration), rates content-fill
  (B1), photos (B11).

## 5. What this file deliberately does not do

It holds no boundaries. Hard constraints, out-of-scope, the criticality rubric
and verification are PROJECT-SCOPE.md's. There is no DIRECTION.md yet: the
destination is **open**, and ROADMAP.md holds the work order.

## 6. What it is made of — the conservation run

| surface | what it serves |
|---|---|
| `src/` | the app: routes, components, `lib/content/` (park facts), `lib/seo/` (JSON-LD), `lib/server/` (Entra auth, GitHub commit, content schema) |
| `static/` | files served as-is: favicon, OG share image, IndexNow key |
| `scripts/` | build-time generators: OG/texture assets, image derivatives, ad creatives |
| `assets/` | image sources: `ads/` (committed ad creatives) and `source/` (untracked Unsplash+ originals) |
| `docs/` | owner-hand collateral: GBP copy, the directory-listing playbook, the printable review QR card |
| `archive/` | the retired Hugo build config, kept for reference |

**Unaccounted for:** none.

## 7. Scope, graded

**In scope — v1 (shipped):** brochure and SEO site, compliance pages, the
operator control panel.
**After v1:** M2 service-only SMS with STOP/HELP (gated on A2P registration).
More ranking pages (L3).
**Out — for now:** reservations and online booking (tier C), revisit after
M1–M3 with a new dated decision. Online payments.
**Out — entirely:** marketing SMS (conflicts with the service-only A2P
commitment), multiple parks, native apps. Reasons are in PROJECT-SCOPE.md.
