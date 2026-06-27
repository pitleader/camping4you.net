# Project State

**Last updated:** 2026-06-27
**Active focus:** Rebuilding the Hugo site as a SvelteKit 5 app on Cloudflare
(M1), on branch `m1-sveltekit-rebuild`. **M1.T1 done** — app scaffolded
(SvelteKit 5 + TS strict + Tailwind v4 + adapter-cloudflare), Hugo archived,
build + dev + svelte-check + lint all green, and a polished outdoorsy design
system + designed home page shipped. Ready next: T2 (typed `site.ts` content
module) and T7 (CI). All three backend research reports are in `.agent/REPORTS/`
(Telnyx A2P, Cloudflare content-store → git-backed, OIDC → Cloudflare Access).

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

**Milestone:** M1 — SvelteKit + SEO rebuild to parity on Cloudflare → see `.agent/ROADMAP.md`.
Done: T1 (scaffold), T2 (content module), T7 (CI). Ready: T3 (pages), T4 (SEO). Blocked: T5, T6.
**Active blockers:** none for M1 code. (Owner data gates content-fill B1; Telnyx
A2P registration gates M2; content-store choice gates M3.)

---

## 3. Open check-ins

none

---

## 4. (Dissolved per D-0050)

Deferred work lives in `.agent/ROADMAP.md` `## Backlog` (M2/M3 committed-gated,
tier-C needs-decision).

---

## 5. Next session

Phase 3 branch chosen: **M1 → code** (clear path, mirrors peoriait.com), with
**research running in parallel** on the M2/M3 gaps (Telnyx A2P 10DLC, Cloudflare
content-store, multi-IdP OIDC) landing in `.agent/REPORTS/`. Start M1.T1
(scaffold) when ready to build; fold research into DECISIONs (B2) before M2/M3.

---

## 6. Recent milestones

Shipped history lives in ROADMAP `## Shipped` (none yet — M1 in progress).
