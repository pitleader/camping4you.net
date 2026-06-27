# Project Scope: camping4you.net (Leisure Oaks Park)

## Overview

A marketing + SMS-compliance + self-service website for **Leisure Oaks Park**,
an RV/campground at 5805 S Lafayette Ave, Bartonville, IL. Three co-equal
purposes: a fast, SEO-strong brochure site; the public compliance host +
transactional backend for the park's Telnyx A2P 10DLC service-SMS program; and
an auth-gated control panel the operator uses to update content. It is a full
rebuild of the current Hugo site onto the peoriait.com SvelteKit archetype,
adopted into the dotagent system.

## Pairings (optional)

- sveltekit — SvelteKit 5 app framework on the Cloudflare adapter; routing, load, form actions, page options.
- typescript — TS end-to-end including the Telnyx/OIDC/contact backend; honest type boundaries, no `any` at seams.
- web-frontend — browser-UI discipline for the marketing site and the control panel; performance & a11y as constraints.
- css — Tailwind v4 token discipline, OKLCH palette, motion/reduced-motion contract.
- copy-truth — no invented rates/hours/claims; A2P-compliance and SEO E-E-A-T claims must be true and verifiable.
- jobs-to-be-done — camper/operator dual-role lens; guards the service-vs-marketing "message" overload.
- svelte — runes reactivity for the interactive control panel.

## Principles, in priority order

The canonical principles in `PERSONAL-PRINCIPLES.md` apply in their given order.
No canonical principle is overridden. Two project-specific principles sharpen
them and take precedence where they bite:

1. **Compliance before features.** A2P 10DLC obligations — explicit consent,
   working STOP/HELP, service-only messaging, live & accurate
   privacy/terms/sample-SMS pages — are never traded for velocity. (Specializes
   #9/#10/#13.)
2. **Never invent park facts.** Rates, hours, site counts, and policies come
   from the owner. Placeholders stay visibly placeholder until real data
   arrives; they are never filled with plausible guesses. (Specializes
   copy-truth / #13.)

Otherwise, canonical priority order holds.

## Hard constraints

- **A2P 10DLC compliance:** the privacy, terms, and sample-SMS pages must stay
  live and accurate; SMS on this number is **service-only** (no marketing);
  **STOP/HELP** keyword handling must always work; consent is **never** a
  condition of purchase or service.
- **Copy-truth:** no invented rates, hours, policies, or claims anywhere on the
  site. Real values come from the owner.
- **Stack lock:** SvelteKit 5 + TypeScript (`strict`) end-to-end + Tailwind v4,
  on the Cloudflare adapter. No `any` escape at boundaries; external input
  (Telnyx webhooks, OIDC tokens, contact form) is runtime-validated with Zod.
- **Telnyx webhooks:** verify signatures; inbound handling is idempotent.
- **Secrets are server-only:** read via `$env/static/private` or
  `$env/dynamic/private`; never imported into a client bundle.
- **Edge runtime:** all server code must run within Cloudflare Workers
  constraints.
- **CI green before deploy:** `tsc --noEmit`, lint, and tests pass.

## Out of scope

- **Reservations / online booking (tier C)** — deferred, tracked. Revisit once
  M1–M3 ship; reservations happen by phone meanwhile. Adding it requires a new
  dated decision (in-app build vs. external integration is itself open).
- **Marketing / promotional SMS** — excluded by the service-only A2P
  commitment; would need a separate brand/campaign registration and consent
  model.
- **Online payments / transactions** — not part of this version.
- **Multi-park / multi-tenant** — single park (Leisure Oaks) only.
- **Native mobile apps** — web only.

## Criticality rubric

**Critical** (hard-stop, do not touch related work):
- Changes to compliance pages, SMS consent flow, or STOP/HELP handling.
- Auth / authorization boundary (OIDC, control-panel access).
- Data shape of the content store.
- Scope changes; removing load-bearing structure; secrets handling.

**Material** (continue parallel work, avoid downstream):
- Bounded backend refactors (Telnyx adapter, OIDC adapter).
- SEO structured-data changes.
- Content-model changes that preserve compliance.

**Minor** (continue freely):
- Marketing copy / styling / Tailwind tweaks.
- Additive tests, comment fixes.
- New brochure content within existing templates.

## Default check-in mode

Hybrid, per the operating manual.

## Active milestone

**Milestone:** M1 — SvelteKit + SEO rebuild to parity on Cloudflare.

**Definition of done:**
- SvelteKit 5 app on the Cloudflare adapter replaces Hugo; the old Hugo build is
  retired.
- All current pages rebuilt: home, rates, contact, rules, privacy, terms,
  sample-SMS — content sourced from a single typed content module
  (`site.ts`-style), not hardcoded in templates.
- SEO stack live: typed schema.org JSON-LD `@graph` validates, `sitemap.xml` and
  `llms.txt` routes serve.
- Deploys to Cloudflare Pages at a preview URL; `npm run build` + `tsc --noEmit`
  + lint + tests all green.
- Placeholder park data remains visibly placeholder (copy-truth); replacing it
  with real owner-supplied values is a tracked content-fill task, **not** an M1
  code blocker.

**Subsequent milestones:** M2 — Telnyx service-SMS send + inbound
STOP/HELP webhooks (A2P-compliant). M3 — OIDC control panel (Google +
Microsoft + Cloudflare Access free tier) for operator content editing.

**Active blockers:** none for M1. (Owner data for content-fill; Telnyx brand/
campaign registration for M2; content-store choice — KV/D1/DO — for M3.)

## Project-specific glossary

- **Message / SMS**: a **service (transactional)** text only — reservation
  confirmations, check-in/out reminders, park notices. Explicitly **not**
  marketing or promotional. Load-bearing for A2P compliance.
- **Camper**: a prospective or current guest — finds the park via search,
  checks rates/rules, contacts the office, and (opted-in) receives service SMS.
- **Operator**: the park owner/staff — administers the site via the control
  panel and is the sender of the SMS program. A dual-role user (administers
  *and* sends).
- **Tier B / Tier C**: tier B = build-now scope (M1–M3); tier C = deferred
  reservations/booking.
