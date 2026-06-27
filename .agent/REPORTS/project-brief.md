# Project Brief — camping4you.net (Leisure Oaks Park)

> Locked vision brief (dotagent Phase 0). Captured context per D-0024 —
> carries the vision into pairing selection (Phase 1) and scope
> elicitation (Phase 2), which read this instead of re-asking.

## Vision

A marketing **+** SMS-compliance **+** self-service website for **Leisure
Oaks Park**, an RV/campground at 5805 S Lafayette Ave, Bartonville, IL.
Three co-equal, first-class purposes:

1. A polished local-business **brochure site** that ranks in search and
   converts campers (rates, rules, contact).
2. The public **compliance host + transactional backend** for the park's
   Telnyx A2P 10DLC **service-SMS** program (reservation confirmations,
   check-in/out reminders, park notices) with carrier-compliant consent
   and STOP/HELP handling.
3. An **auth-gated control panel** that lets the park operator update site
   content (rates, hours, rules, notices) without touching code.

Success = a fast, SEO-strong site live on Cloudflare Pages that also
legitimately runs the park's service-SMS program and lets the operator
maintain it themselves.

## Platforms & stack

Full rebuild off the current **Hugo** site onto the **peoriait.com
archetype**:

- **SvelteKit 5 + TypeScript** end-to-end (typed backend boundaries).
- **Tailwind v4**.
- **Cloudflare** adapter — Pages/Workers (edge runtime).
- **Vite / Vitest** for build + tests.
- **SEO stack mirrored from peoriait.com**: typed schema.org JSON-LD
  (`@graph`, single-source from a `site.ts`-style content module),
  `sitemap.xml` + `llms.txt` routes, GSC + PSI reporting scripts.
- **Telnyx** for SMS — outbound send + inbound webhook handling.
- **OIDC** auth for the control panel (provider/IdP TBD — gap).

## User-facing surface

- **Graphical web** — responsive marketing pages (home, rates, contact,
  rules) plus the legal/compliance trio (privacy, terms, sample SMS).
- **Auth-gated control panel** — operator UI for editing site content.
- **Programmatic** — Telnyx webhook endpoint(s) for inbound SMS
  (STOP/HELP/keywords) and a contact-form email backend.

## Personas / roles & domain glossary

**Personas**

- **Camper / prospective guest** — finds the park via search, checks
  rates/rules, contacts the office, and (once opted in) receives
  service texts.
- **Park operator / owner** — wants inbound leads, a credible compliant
  web presence, a working service-SMS channel, and the ability to update
  site content via the control panel without a developer.
- **Builder / maintainer (Stephen)** — owns the rebuild, the SMS/auth
  backend, and the dotagent governance.

**Roles & dual-role users** — the operator both *administers* the site
(control panel) and is the *sender* of the SMS program. No role collapse
to guard yet; revisit if a non-owner staff role appears.

**Domain glossary — overloaded term**

- **"Message" / "SMS"** here means **service (transactional) messages
  only** — confirmations, reminders, notices. It explicitly does **not**
  mean marketing/promotional messaging. This distinction is load-bearing
  for A2P 10DLC compliance and must not be collapsed into a generic
  "send a text" capability.

## Methodology

- **dotagent governance** (this bootstrap) — scope, decisions, roadmap.
- Mirror **peoriait.com conventions**: typed boundaries end-to-end,
  single-source content module, **copy-truth** (no fabricated rates,
  hours, or claims), tests for backend logic.
- **Cloudflare-first** deploy.
- Not committed to: a specific auth stack or reservations architecture
  yet (both open).

## Constraints

- **A2P 10DLC / carrier compliance** is the hard constraint: public
  privacy + terms + sample-SMS pages; consent is **not** a condition of
  service; working **STOP/HELP** keyword handling via Telnyx webhooks;
  service-only messaging (no marketing on this number).
- **Placeholder content** — current site is all placeholders (`$XX.XX`,
  "Fill in your details"). Real rates/hours/policies required before
  launch; **copy-truth forbids inventing them**.
- **Cloudflare edge/Workers runtime limits** shape backend design.
- Control-panel auth introduces a **security surface** (protected
  mutations, session handling) the brochure site alone didn't have.

## Expertise needed

- SvelteKit + Cloudflare edge (adapters, Workers, bindings).
- TypeScript backend with honest type boundaries.
- Technical **SEO / structured data** (schema.org, sitemaps).
- **Telnyx messaging + A2P 10DLC** regulatory compliance.
- **OIDC auth** (session/identity for the control panel).
- Tailwind v4 design.

## Scope staging (load-bearing)

- **Build now (tier B):** marketing + SEO site, contact-form email
  backend, **in-app Telnyx SMS sending + inbound webhook/STOP-HELP
  handling**, and the **auth-gated content control panel**.
- **Full target (tier C):** in-app **reservations / booking** —
  **deferred, tracked**. Revisit once tier B ships. (Whether C is built
  in-app or integrates an external reservation tool is itself open.)

## Gaps / unknowns

- **Real park data** — actual rates, hours, policies (blocked on owner;
  copy-truth-gated).
- **Telnyx setup** — account, number, messaging profile, brand/campaign
  (A2P 10DLC) registration status.
- **OIDC provider/IdP** for the control panel — OIDC chosen; specific
  IdP (e.g. Cloudflare Access, Auth0, Google) not yet picked.
- **Content storage** for control-panel edits — where edited content
  lives (KV/D1/durable object/git-backed) is undecided.
- **Reservations (tier C)** — in-app build vs external integration.
- **Contact-form email transport** — peoriait uses MS Graph; same here,
  or Telnyx/another provider?
- **Migration** — how much of the current Hugo content/structure carries
  over vs. is rebuilt fresh.

*(Several open gaps — notably auth, content storage, and Telnyx
registration. The downstream branch step should weigh research-/plan-first
over straight-to-code.)*
