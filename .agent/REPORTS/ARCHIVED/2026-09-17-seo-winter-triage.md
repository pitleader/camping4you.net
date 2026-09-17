# SEO / advertising triage — winter & year-round focus (2026-09-17)

**Goal:** rank at the top for local campground searches, with winter /
year-round terms weighted (season is imminent), and be ready to run paid ads.
**Method:** read `src/` at source + probed the live site; nothing below is
from memory. Ranked by expected impact on "showing at the top".

## Findings

### F1 — Google Business Profile is the top lever, and it is outside the repo
Local campground searches resolve to the Maps 3-pack before organic. A GBP
exists (`content.json` `reviewUrl` → `g.page/r/CYFbWuGbDke_EAI`), but its
state (categories, hours, photos, attributes, description, posts) is not
visible from here. Winter demand is captured in GBP first: hours per season,
"open year-round" wording in the description, a post announcing winter sites,
photos. **Owner action; I can draft every field.**

### F2 — The site contains zero winter / year-round content
`grep -ri "winter|year.round" src/` → no hits. "Season" appears only as the
Seasonal rate tier. Nothing to rank for the target queries. Build: a dedicated
`/winter-camping` page (H1 + FAQ + FAQPage JSON-LD), a home-page section, title
/ description updates, `llms.txt` + sitemap entries, and `Campground` schema
amenities. **Blocked on owner facts (copy-truth):** which sites are winter-
capable, water in winter (frost-free hydrant? heated?), bathhouse/laundry in
winter, road plowing, electric billing on monthly winter stays, winter rate.

### F3 — Search Console + Bing not verified (B9)
`site.verification` is `{google:'', bing:''}`. Without GSC you cannot see
impressions/queries, request indexing, or diagnose. Tokens are free;
`<Seo>` already emits them when set. **Owner supplies tokens.**

### F4 — Every rate is `null` → "Call for rates" (B1)
Rates page is thin; schema `priceRange` omitted. Pages with real prices rank
and convert better, and ad landing pages without prices bleed clicks.
**Owner supplies numbers.**

### F5 — No geo coordinates
`site.geo = null` → no `geo.position` meta and no schema `geo`. The address is
fixed; coordinates are a lookup, not a guess. **Owner confirms one pair.**

### F6 — No photos (B11)
Zero imagery on site and (unknown) on GBP. Campground searchers pick by photo.
**Owner supplies originals** (pipeline already shipped).

### F7 — H1 carries no keyword
Home H1 = "Your home away from home." Title tag is fine. Recommend an H1 that
names the entity + place + year-round ("RV park & campground in Bartonville, IL
— open year-round"), keeping the tagline as the sub-line. Minor; no facts needed
beyond F2's confirmation.

### F8 — Thin site (7 pages, 4 substantive)
No FAQ, no amenities page, no area/"near Peoria" page. Each is a ranking
surface and an ad landing page. Build after F2; needs the same fact sheet.

### F9 — Ads readiness
No conversion tracking (Cloudflare Web Analytics is cookieless, no tel-click
goals; `_headers` CSP would need Google tag origins allow-listed). Ads without
a conversion signal cannot be tuned. Decision needed: GA4/Ads tag (CSP change,
privacy-page update) vs. call-tracking number vs. run untracked.

## Disposition (2026-09-17)
- F1 — queued: ROADMAP L4 (copy drafted at `docs/google-business-profile.md`).
- F2 — fixed-now: `/winter-camping` page + FAQPage schema, home year-round section, nav, sitemap, llms.txt, `Campground` amenities; unconfirmed facts render "Call the office". Operator-editability queued: ROADMAP L2.
- F3 — queued: ROADMAP B9 (tokens pending from owner).
- F4 — queued: ROADMAP B1 (owner enters via /admin).
- F5 — fixed-now: `site.geo` set (OSM house-level geocode) → `geo.position` + schema `GeoCoordinates`.
- F6 — queued: ROADMAP B11 (unchanged).
- F7 — fixed-now: home H1 now "RV park & campground in Bartonville, IL — open year-round."; tagline moved to the sub-line.
- F8 — queued: ROADMAP L3.
- F9 — fixed-now (wiring): Google Ads tag + tel-click conversion in `+layout.svelte`, CSP origins in `_headers` per Google's CSP guide, privacy-page paragraph. IDs queued: ROADMAP L1.
