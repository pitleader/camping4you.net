# Project State

**Last updated:** 2026-06-27
**Active focus:** **M1 SHIPPED** (branch `m1-sveltekit-rebuild`) — the SvelteKit 5
rebuild is live on the production domain **https://camping4you.net** (apex + www,
valid SSL) and https://camping4you.pages.dev. All 7 pages render from a
typed `site.ts`, full SEO stack, outdoorsy design system, CI green. No
milestone is actively building: M2 (Telnyx SMS) and M3 (OIDC control panel)
are committed but held in ROADMAP `## Backlog` on external gates. Next moves
are owner-/decision-gated, not code-blocked. Three backend research reports
sit in `.agent/REPORTS/` (Telnyx A2P, content-store → git-backed, OIDC →
Cloudflare Access) ready to fold into M2/M3 DECISIONs (B2).

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
merge `m1-sveltekit-rebuild` → `main` (human/PR).

---

## 3. Open check-ins

none

---

## 4. (Dissolved per D-0050)

Deferred work lives in `.agent/ROADMAP.md` `## Backlog` (M2/M3 committed-gated,
tier-C needs-decision).

---

## 5. Next session

M1 is shipped and live. To resume: (1) merge `m1-sveltekit-rebuild` → `main`
(human/PR) so CI + the Pages deploy workflow run on the default branch;
(2) when ready for M2/M3, fold the three `.agent/REPORTS/` research findings
into ratified DECISIONs (B2) — recommended picks: content-store **git-backed**,
auth **Cloudflare Access**, SMS **Telnyx Low-Volume-Mixed**; (3) owner inputs
unblock B1 content-fill and Telnyx registration.

---

## 6. Recent milestones

Shipped history lives in ROADMAP `## Shipped` (none yet — M1 in progress).
