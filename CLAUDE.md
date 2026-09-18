<!-- GENERATED-BY: publish.sh on 2026-09-18T16:40:23Z [build: pointer; include: no] -->
<!-- Sources: /Users/stephen/.dotagent/publish/../personal (personal) + /Users/stephen/.dotagent/publish (manual) -->
<!-- Do not hand-edit. Edit those files and re-run publish.sh. -->

# Project Bootstrap

This file is auto-loaded by the runtime. It is **pointer-only**: the canonical
cross-project context (principles, interaction style, operating manual) is not
inlined below — it is single-sourced in the global `~/.claude/CLAUDE.md` (see
the pointer block below).

**Also read these per-project files if they exist in the working directory:**

- `.agent/DIRECTION.md` — **the staircase: where this is going, in order.** Read first; it is the frame the rest is read inside.
- `.agent/PROJECT-SCOPE.md` — active milestone, hard constraints, out-of-scope, criticality rubric.
- `.agent/PROJECT-STATE.md` — current state and open check-ins.
- `.agent/CHECKINS/` — any files at this directory's root.
- `.agent/IDEAS/` — raw, pre-decision idea inbox, one file per idea (if present).

Project scope overrides personal principles. Surface conflicts; don't resolve silently.

<!-- ───── canon pointer ───── -->

# Cross-project canon — single-sourced in the global config

The canonical cross-project context — personal principles, interaction style,
and the operating manual — is **not inlined in this file**. It lives in the
global Claude Code config at `~/.claude/CLAUDE.md`, which this machine is
guaranteed to have (installed and refreshed by `recipes/sync-machine.sh`).
Inlining it here too would double-pay the same tokens every session, so this
project file points to the canon instead of copying it.

- **Always-on canon:** `~/.claude/CLAUDE.md` — the full principles, full
  interaction style, and full operating manual. (Built `--full` since
  2026-09-16; the build mode is recorded in that file's own marker line, which
  is the authority if this text and the file ever disagree.)
- **Full doctrine on demand:** the complete principle text is one MCP call away
  via `dotagent_get_principles` (and `dotagent_get_manual_section` /
  `dotagent_get_pairing` for the manual and pairings). Pull it for
  consequential work — architecture, scope changes, governance — per the
  raise-the-floor model.

On a machine **without** the global installed (e.g. a fresh clone before
`sync-machine.sh` has run), re-publish this file self-contained instead:
`publish/publish.sh claude-md --slim --force`.

