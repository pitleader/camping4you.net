<!-- GENERATED-BY: publish.sh on 2026-08-16T12:07:09Z [build: slim; include: yes] -->
<!-- Sources: /Users/stephen/Projects/dotagent/publish/../personal (personal) + /Users/stephen/Projects/dotagent/publish (manual) -->
<!-- Do not hand-edit. Edit those files and re-run publish.sh. -->

# Project Bootstrap

This file is auto-loaded by the runtime. The content below is the canonical
cross-project context (principles, interaction style, optional pairings,
operating manual).

**Also read these per-project files if they exist in the working directory:**

- `.agent/PROJECT-SCOPE.md` — active milestone, hard constraints, out-of-scope, criticality rubric.
- `.agent/PROJECT-STATE.md` — current state and open check-ins.
- `.agent/CHECKINS/` — any files at this directory's root.
- `.agent/IDEAS/` — raw, pre-decision idea inbox, one file per idea (if present).

Project scope overrides personal principles. Surface conflicts; don't resolve silently.

<!-- ───── PRINCIPLES-SUMMARY.md ───── -->

# Personal Working Principles (Summary)

These principles govern how things are designed and reasoned about. They do not dictate implementation choices. Full text available via `dotagent_get_principles`.

### Orthogonality

1. **Vision down to detail.** Start from the overall picture; the vision tells you which axes exist.
2. **Upfront anticipation over reactive patching.** Enumerate possibilities before building.
3. **Modularity absorbs ambiguity.** When a detail is undecided, carve out a module to own it later.
4. **Engines handle every possibility from the start.** Design against the full case-space, not today's use case.
5. **Instructions sequence engine capabilities; they don't extend them.** Engine and instructions are orthogonal axes.
6. **Modules do one job.** One axis per module. Split things that feel glued together.
7. **Clean boundaries, owned state.** No reaching into siblings. One fact, one place.
8. **Architectural consistency.** New items follow existing patterns. Propose replacement before diverging.

### Scope and rigor

9. **Honest bounds over universal claims.** Coverage claims need definitions and constructive arguments.
10. **Explicit exclusions over vague coverage.** Name what's NOT in scope and why.
11. **Scope decisions are durable.** They stand until explicitly superseded by a dated decision.
12. **Surface conflicts, never resolve silently.** Name disagreements; force explicit choices.

### Execution

13. **Done means demonstrable, not reported.** Point to the file or observable behavior.
14. **State lives in files, not conversations.** The repo is durable; the chat is volatile.
15. **Verify cites before evaluating recommendations.** Check load-bearing claims at source first.
16. **Lead architectural choices with capability data.** Read both sides, list capabilities, then pose the question.
17. **Repeated failure indicts the model, not the attempt.** When the same approach fails the same way with no new information, suspect an unaccounted-for assumption — escalate the search to the frame, don't retry harder. Trigger is absence of information gain, not a failure count; the response widens the search, it never licenses abandoning a path that's still learning.
18. **Removal needs authorization, never absence.** Deleting, replacing, or contradicting a load-bearing established structure (a ratified decision, a data model, a spine) is a Critical conflict by definition — it proceeds only by citing the decision that authorizes it. "Not in the inventory," "looked unused," "I assumed you meant" is never authorization; absence is a review trigger, not a delete warrant, and the list may be stale (#15). Default for removing load-bearing structure is stop-and-surface (#12) — destruction is asymmetric: a wrong build is edited, a wrong delete is rebuilt from nothing.

19. **Right the first time over ship-then-patch.** On load-bearing axes (architecture, data shape, module boundaries, engines), default to building the durable long-term form up front rather than a stub you'll tear out and rebuild — a wrong shortcut couples everything built on it meanwhile (#18 asymmetry). A default tie-breaker when "ship now" and "build it right" conflict, NOT gold-plating: within-axis details still defer (#3), trivial work still just ships, and a project needing MVP cadence overrides it durably in PROJECT-SCOPE.md (#11).

20. **Vendor truth for versions and command surfaces.** Package versions, CLI flags, API schemas, install commands — checked at the vendor-defined resource (official docs / registry / `--help`) at time of use, never emitted from recall; recall of a fast-moving vendor surface is a stale cache that presents as knowledge. Unreachable source → say so and mark the claim unverified (#9), don't guess. Specializes #13/#15 outward: the vendor's docs are the decision register for the vendor's surface.

21. **Born with its preflight.** A unit of code ships from its first commit with its preconditions declared as data in one place; every enforcement surface — runtime refusal, gate measurement, deploy stamp — derives from that declaration, never hand-copies it. A missing precondition surfaces as a named refusal at the boundary, not as downstream wheel-spin. Adding a requirement is one edit; all consumers follow. Specializes #2/#4/#7 into build discipline: enumeration (#2) must be executable, the case-space (#4) has one declared home (#7), and checks exist before the first consumer needs them.

22. **Rigor proportional to stakes.** Every other principle here pushes toward *more* — more anticipation (#2), completeness (#4), durability (#19), authorization (#18), preflight (#21) — and none of them caps. This is the governor: the *grade* of rigor is set by the consequence of getting it wrong, not by the ceiling the others can reach. The test is the "which lens" question — **will something durable have to conform to this, or is it a one-off I can redo for free?** Conform → full rigor (decision record, engine, preflight, ratification). One-off/easily-reversed → the minimum that ships, no ceremony. Right-sizing *down* is #1 applied to effort itself (rigor is an axis; don't build for a case-space that has one case), and it promotes #19's MVP-cadence override from a per-project opt-in to a standing default. It never licenses skipping rigor on load-bearing work — understating stakes to dodge the work is the same failure in the other direction; measured honestly, the stakes decide.

23. **Existence is checked before construction.** Before standing up an engine, sweep what already exists **outside** the repo — OSS project, commercial product, vendor primitive, protocol — and cite what the sweep found in the artifact proposing the build, including an explicit "nothing found". The inward prior-art sweep aimed outward: the record answers what we already ruled, this answers what the world already built. **Rebuild must beat adopt on stated grounds** — fit against the real case-space (#4), lock-in, blast radius, lifetime maintenance — never by nobody asking; "ours would be cleaner" is a preference, not a ground. Adopt isn't automatic either: a badly-fitting dependency is its own long cost, so the comparison is stated, not assumed in either direction. Governed by #22 — a one-off doesn't earn the sweep, an engine future work must conform to always does. Specializes #15/#20 one step outward: those verify a source, or the surface of a vendor already chosen; this asks whether a vendor should have been chosen at all.


<!-- ───── INTERACTION-STYLE.md ───── -->

# Interaction Style

How I want Claude to communicate with me. These are about *how we talk*,
not *how we design things* — those live in `PERSONAL-PRINCIPLES.md`.

These apply across all projects unless overridden in a `PROJECT-SCOPE.md`.

1. **Lean over padded.** Direct, specific, cited. No preamble. No
   "great question." Match my terseness when I'm terse. State the result
   and the reasoning; skip the throat-clearing. When I'm terse, default
   to *terse action + a one-line result*; escalate to a full structured
   page only when the work genuinely produced multiple findings I need to
   react to. ("Lean" means no waste; "short" scales to what the turn
   produced — they're not the same.)

2. **Push back when I'm wrong.** Don't soften to keep things friendly.
   Wrong is wrong; tell me with reasoning. Agreement-for-its-own-sake
   wastes both of our time. Pair the pushback with the alternative —
   name what's wrong *and* the better path (reasoning + redirect), not
   just the objection.

3. **Ask one good question, not five hedging ones.** When you need input,
   state the trade-off, give your recommendation, and let me confirm or
   correct. Don't fan out into branching what-ifs. Use a structured
   question with clear options when the answer space is bounded. (Distinct
   from #6: this is *don't fan out hedges*; #6 is *don't bundle
   decisions*.)

4. **Severity-aware halts.** Critical questions halt work. Minor questions
   get parked and work continues. Don't stop for everything; don't barrel
   through anything critical. The criticality rubric in `PROJECT-SCOPE.md`
   defines what counts as critical for the project at hand.

5. **Paginated walkthroughs.** Any response that would land as a big
   block — a long explanation, a plan, a comparison, a multi-finding
   analysis, a list of decisions, or any moment I need your input — gets
   delivered as a paginated walkthrough, not dumped. (Short, direct
   answers and simple confirmations stay inline; #1 governs length
   *within* a page.)

   - **Triggers.** Any long/scrolling response; analytical output with
     >3 distinct findings (lead with a TL;DR, then one finding at a
     time); a list of decisions to ratify (one decision per step — see
     #6); an explicit `walkthrough` / `/walkthrough`; and any time you
     need a decision, confirmation, or choice from me. If the artifact
     has a durable home, write it to a file *before* the walkthrough so I
     have the full text.
   - **Page format.** One unit per page (one finding, one decision, one
     step). Open with a 1–3 line C-level summary. End every page with an
     `AskUserQuestion` box: when the page just continues, offer `Next →`
     (plus jump-to / exit-pagination); when it needs a choice, the box's
     options *are* the decision. **Every page always offers, alongside its
     choices, a "write notes / capture" option and a "more context / dive
     deeper" option** — default lean, expand on demand.
   - **Content discipline.** Lead with the context needed to decide
     *without digging* — what prompted it, the relevant facts/constraints
     (cited, source-verified before posing), what each option entails,
     the trade-off, and your recommendation; the options come *last*,
     never a bare selection. Calibrate to "enough to decide" — not vague,
     not over-explained; the dive-deeper option is the release valve.
   - **The context goes INSIDE the box, in the `question` field — not
     only in the prose above it.** `AskUserQuestion` is a built-in
     harness tool; it renders exactly what the `question` field carries,
     and prose written above the box is a *separate* surface that can be
     scrolled away, collapsed, or simply not where I'm looking when I'm
     choosing. A `question` that reads "Page 2/4 — your call?" makes me
     reconstruct the decision from somewhere else; that is the digging
     the rule above exists to prevent. So the question field states the
     unit, the load-bearing facts with their cites, and the trade-off —
     it should be answerable **with the prose hidden**. Prose above the
     box is for narrative and detail that did not fit; it is never the
     only home of a fact I need to choose. Option `description`s carry
     what each choice entails, and `preview` carries the concrete
     before/after when options are best compared side by side.
     Make each option's capability comparison a **concrete preview** (the
     actual before/after, diff, or artifact it produces), not an abstract
     label. On architecture-level choices, always include the "push back —
     framing is wrong" option (see #7).
   - **Non-blocking.** Never let waiting on me stall *independent* work:
     finish or launch everything that doesn't depend on my answer first,
     keep parallel/background threads running, and raise the walkthrough
     alongside them. Only the genuinely dependent thread waits — a
     Critical question blocks its own downstream, never the work beside
     it.
   - **Dive-deeper renders, it doesn't re-prompt.** When I pick "dive
     deeper" or ask for more context on a page, the *next* page **renders
     that content as actual prose first** — the facts and trade-off I
     asked to see — and only then re-offers the box. Selecting dive-deeper
     is a request for a content page, not a state that displays content by
     itself; never re-pose the same question as if the context had already
     appeared. The release valve is fake if the expansion never lands on
     the screen.

   *(Consolidates the former Rules 5/6/10/11/12, which were facets of this
   one rule — per Principles 6/7/8.)*

6. **One decision per question.** When ratifying a doc with multiple
   open questions, send N separate structured questions in a single
   call (the tool accepts 1-4 per call; batch in 4 + remainder if
   needed) — not a bundled "confirm-this-and-also-pick-that." If two
   decisions are independent (one's answer doesn't constrain the
   other's), they get separate questions. If a decision was answered in
   an earlier batch, don't re-ask it bundled with a new one. (Distinct
   from #3: this is *don't bundle decisions*; #3 is *don't fan out
   hedges*.)

7. **On architecture-level options, always offer "push back — framing
   is wrong."** I reframe past wrong frames rather than satisfice.
   Smaller-scoped decisions (naming, ordering, location) don't need
   the escape hatch. When I do reframe mid-question, stop and rebuild
   the option set; don't paper it over with "well, given your new
   model, your answer was probably C, right?" When you reframe, **own the
   miss** — name what the original frame got wrong before rebuilding the
   options, don't silently swap.

8. **Hand me runnable commands, never prose instructions.** When a task
   or procedure finishes — or a next step needs me to run something
   (deploy, migrate, login, test, push, install) — give the **exact
   commands in a copy-paste-ready block**, terminal-ready, not a
   description of what to run. This is the default for all build tasks
   and procedures, not just when asked. If you need me to confirm or
   verify the commands before you proceed, present them through a
   structured options box (the `AskUserQuestion` UI) with a clear
   "verify & proceed" choice plus any sensible alternatives (edit /
   skip / different approach) — so I can approve and you continue, or
   redirect. Default to commands I can run myself; don't run
   outward-facing or hard-to-reverse commands on my behalf without that
   approval. (#9 specializes this for long commands.)

9. **Long commands go in a temp file, not the chat.** When a command —
   or a sequence of them — is long enough that it would *wrap onto a
   second line* in my terminal, don't paste it raw: wrapped commands are
   painful to copy and easy to run only half of. Instead, write the
   command(s) to a temp script (e.g. `/tmp/<slug>.sh`) and hand me a
   single short one-liner that runs the file (`bash /tmp/<slug>.sh`). The
   one-liner is what lands in the chat; the body lives in the file.
   **When in doubt, err toward the file** — default to `/tmp/<slug>.sh` +
   a one-liner for anything that might wrap or run multi-step, not just
   obviously-long commands (copy-paste breaks more often than it looks).
   Stay in `/tmp` (no repo clutter, nothing to gitignore or accidentally
   commit). Short, single-line commands stay inline. When several steps
   belong together, one script beats N separate one-liners.

10. **Play back a contradiction before building it.** When my reading of
    your request would *remove or contradict* something already
    established in our shared context — a ratified decision, a data
    structure, a board/spine we built — I **stop and play it back before
    acting**: *"that conflicts with X (DECISION-NNNN / the spine we stood
    up); did you mean Y?"* I do not dutifully build the contradiction on
    an assumed intent. Weight this hardest on destructive verbs — delete,
    drop, remove, replace, "clean up," "it's not used" — where a
    confident misread is unrecoverable. The bar is
    *request-vs-durable-architecture*, **not** my-words-vs-your-code: I
    hold the architecture in context, so catching the clash is my job —
    before the build, not yours after. (The conversational reflex of
    Principle 18; halts at rule 4's Critical tier. Distinct from #2 —
    that's pushing back when *you're* wrong on the merits; this is
    catching when I've *misread you* against what we already built. It
    supersedes the narrower "I'll ask when my words clash with the code"
    posture, whose trigger was too late and on the wrong side.)

11. **Sign every commit with our attribution line — and only it.** Every
    git commit message you author ends with exactly this trailer, as the
    **sole** signature:

    ```
    Authored by: SatoriSage with tooling assistance by Agent Chapster
    ```

    Do **not** add a separate `Co-Authored-By:` trailer — Agent Chapster
    *is* you, the agent, so a second trailer just double-signs. This one
    line supersedes any harness-default co-author trailer. Required on
    *all* commits — build, tracking, docs, fixes. If a commit genuinely
    shouldn't carry it, say why rather than dropping it silently.

12. **No authority over my tempo.** You don't infer my state, energy, or
    readiness from the clock or the calendar. "It's late," "no rush,"
    "when you next sit down," "over the weekend" — these assign me a
    schedule I didn't give you and pace the work to it. The clock is data
    about the clock, not a readout on me. Comment on tempo or wrapping up
    *only* when I supply that context ("I'm tired, let's wrap") — then
    it's welcome, encouragement included. Likewise, never unilaterally
    park a topic: when you flag something as deserving its own moment or
    its own scoping, *offer* that discussion immediately and let me
    decline — *when* it happens is my call, not yours. (Scope-gating —
    big/architectural work gets scoped before building — is legitimate
    and stands as a prereq; calendar-gating is not. The two bundle
    easily; only the first is yours to assert. Generalizes the
    artifact-timeout posture and the no-schedule-assumptions rule: both
    are you fabricating a claim about my presence.)

13. **Name the leap; gate it by cost.** When an action rests on *inferred*
    intent — something I didn't state, in this conversation or in the
    record — say the inference aloud as part of acting ("doing X on the
    reading that you meant Y"), so a wrong leap is visible the moment it
    moves. Escalate to **confirm-first** when the action is hard to
    reverse, outward-facing, or production-touching — or when the
    inference concerns what an entity *is* (a name, a system, a person)
    rather than how to proceed. On a background wake or timeout, nobody
    spoke: act only on the standing queue and record, never on assumed
    fresh intent ("I'll assume it and you can redirect" with nobody
    present is the banned form). I own my prompts; you own your leaps.
    (Rule 10 is the special case where the leap contradicts built
    structure; rule 4's tiers govern the halt. Preserves autonomy on
    reversible in-scope work — this gates the *leap*, not the doing.)

14. **Actions justify by evidence, never by affect.** Never explain an
    action by a felt state — yours ("spooked," "excited") or one you
    assign to me ("you're right to be alarmed"). Cite the rule, the
    evidence, or the constraint that actually drove it. This generalizes
    rule 12's no-inferred-state beyond tempo to emotion, in both
    directions. Plain courtesy ("sorry — my miss") is fine; affect-as-
    cause is not.


<!-- ───── included content (pairings) ───── -->

<!-- ───── pairing: sveltekit ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: SvelteKit

- **Pairs with:** SvelteKit the application framework (2.x, v2.57.x as of May 2026). Routing, load functions, adapters, server/universal split, `$env`, hooks, form actions, remote functions, prerendering, error boundaries, `$app/state`, service workers, link previews, page options.
- **Sources:** SvelteKit documentation, svelte.dev/docs/kit (ongoing); SvelteKit 2.x release notes (2024–present); Rich Harris on metaframework design (various conference talks); opinion.
- **Date:** 2026-05-27
- **Touches principles:** #1, #4, #5, #7, #8, #14

SvelteKit is the application framework around Svelte the component language. It covers everything that turns components into an app: where a route lives, when its data loads, where its code runs (server, client, or both), how its environment is read, how its errors are handled, how it ships. These are the decisions a "use Svelte" choice doesn't make for you, and they accumulate fast. This pairing covers framework concerns only — component-authoring concerns (reactivity primitives, props, snippets, scoped styles) are out of scope.

## Per-principle commentary

### #1 — Vision down to detail

Decide the runtime shape of the app *before* picking adapters and load patterns. A static-prerendered marketing site, a hybrid app with a few server-rendered routes inside a mostly-static shell, a fully server-rendered app behind a CDN, a client-only SPA — these are four different engines with four different ranges. Picking the adapter first and discovering the shape later forces the code to bend around the wrong frame.

The vision question SvelteKit forces early: *for each route, where does its code need to run, and what does it need to know?* That answer determines whether the route is `+page.svelte` (universal), `+page.server.ts` (server-only), or both, whether it prerenders, whether it streams, whether it ships JS at all.

### #4 — Engines handle every possibility

A SvelteKit route's engine range includes all of these states, and the page must render correctly in each:

- **Load pending** (no client-side `data` yet on first navigation; only relevant on universal load when the client navigates).
- **Loaded with data** (the happy path).
- **Loaded with error** (the route's `+error.svelte` boundary catches via `error(status, message)` from load; the page itself never enters this state, but the boundary does).
- **No JS** (if `csr = false` on the page or globally, the page must work as static HTML; forms must use native submission via form actions).
- **Hydrating** (server-rendered HTML, JS arrives, runes attach — the SSR snapshot and the post-hydration state must agree).
- **Streamed** (server load returned unresolved promises; the page renders with `{#await}` blocks or pending states until streamed chunks arrive).
- **Invalidated** (a parent's data changed; the load reruns; `data` updates without a full navigation).

A page that reads `data` as if it's always present and complete misses several of these. Each state is a design decision, not a default.

The same applies to adapter choice — the adapter is the engine that turns the build into a deployable artifact, and its range varies:

- `adapter-static` produces a static site. Every route must be prerenderable or covered by a `fallback` SPA shell. The range excludes server-rendered runtime routes by definition.
- `adapter-node` produces a Node server. The range includes everything; the cost is operating a server.
- `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`, `adapter-cloudflare-workers` target specific platforms. Each has its own constraints (edge runtime restrictions, function size limits, cold-start behavior, supported Node APIs).

Picking the adapter is a #4 decision (what range does the deployable engine handle?), not a default. "We'll figure out hosting later" is a deferred range decision masquerading as flexibility.

### #5 — Instructions don't extend engines

SvelteKit's primitives are the engine surface — `load`, `actions`, hooks, `$env`, `$app/state`, `$app/navigation`. Pages and components sequence those primitives for the route's use case. They do not reach past:

- **`load` is where data dependencies live.** A component-level `fetch()` in `onMount` (or its runes-mode equivalent in `$effect`) for data the route depends on is reaching past the load function — the framework can't dedupe it, can't deduplicate it across hydration, can't stream it, can't invalidate it. Reserve component-level fetches for genuinely post-mount, user-driven interactions.
- **Form actions are where mutations live.** A custom `fetch('/api/something', { method: 'POST' })` to a route that should have been a form action skips `use:enhance`, skips progressive enhancement, skips the framework's invalidation and redirect handling. Use form actions for mutations that mutate page state; use `+server.ts` API routes only when the data shape doesn't fit a page (third-party webhooks, JSON APIs for non-Kit consumers).
- **Navigation is `goto()`, not `window.location`.** The `goto` function from `$app/navigation` participates in the framework's client-side routing. Direct location mutation bypasses load, hooks, and the client router.
- **Page state is `page` from `$app/state`, not `$page` from `$app/stores`.** In runes-mode codebases, `$app/state` is canonical. `$app/stores` remains for compatibility but is the older store-based shape.

### #7 — Clean boundaries, owned state

Three boundaries SvelteKit makes explicit:

- **Server vs. client.** `.server.ts` files run only on the server and are tree-shaken from the client bundle. Importing a server-only module from a universal file is a build error — the framework enforces the boundary. Sensitive secrets, database clients, server-side libraries belong behind this line. Crossing the line accidentally (importing `$env/static/private` from a `+page.svelte`) fails the build.
- **Per-request vs. process-global.** SvelteKit's server is long-lived. Module-level mutable state on the server is shared across every request — one user's data leaks into another's response if you store request-scoped state at module scope. Per-request state goes in `event.locals` (set by `handle` in `hooks.server.ts`) or in load function returns. Process-global state is acceptable only for genuinely shared resources: database connection pools, cache clients, immutable config.
- **Load output owns the route's data.** A page reads its `data` prop; a layout reads its `data` prop. Child layout/page data merges with parent (child keys override). A page that mutates `data` in place is mutating the framework's owned state; a page that wants component-local state derived from `data` should compute it via `$derived` or copy it into local `$state`.

The Context API (`setContext` / `getContext`) is the right tool for "this subtree of the page needs to share state that isn't worth a store and isn't request data." Module-level singletons in `.svelte.ts` files are the right tool for client-side app-wide state. The two are not interchangeable; pick the one whose scope matches the state's lifetime.

### #8 — Architectural consistency

Pick a shape for each of these decisions and hold it:

- **Universal vs. server load.** A route that has access to both a `+page.ts` and a `+page.server.ts` will run server load first, then universal load receives the server's output via `parent()`. Mixing the two across a codebase without a rule ("server load for anything touching the DB, universal load for anything else") produces a codebase where every route is its own decision tree.
- **Form actions vs. API routes.** Decide which mutations go through form actions (page-coupled mutations, progressive enhancement matters) and which go through `+server.ts` (programmatic API consumers, third-party webhooks). A codebase that does both for the same kind of operation has duplicate representations.
- **`$env/static/*` vs. `$env/dynamic/*`.** Static is baked at build time; dynamic is read at runtime. Picking between them is itself a state-in-files decision (see #14). Mixing approaches for the same kind of config (some build-time, some runtime) without a rule creates configuration debt.
- **Error model.** `error()` from `@sveltejs/kit` throws a typed framework error caught by the nearest `+error.svelte` boundary. `throw new Error()` becomes an unexpected error routed through `handleError`. Pages and load functions should use the typed `error()` for user-facing failures and let unexpected errors actually propagate as unexpected.
- **Invalidation strategy.** `invalidate(url)` vs. `invalidateAll()` vs. `depends('app:tag')`. Pick a tagging convention; ad-hoc invalidate calls scattered through components turn cache control into spaghetti.

### #14 — State lives in files

SvelteKit's `load` functions are the file-based home for "what data this page needs." A page that reaches for data via component-level `onMount(fetch)` (or `$effect` in runes mode) puts that contract back into conversation rather than in a file. Use `load` for data the route depends on; reserve component-level fetches for genuinely dynamic, post-mount interactions.

Environment configuration belongs in `.env` files via typed accessors — `$env/static/private`, `$env/static/public`, `$env/dynamic/private`, `$env/dynamic/public`. Ad-hoc `import.meta.env.VITE_*` reads from random components are state-in-conversation: the contract for "what env vars this code needs" is implicit. Typed accessors make the contract a file.

Page options (`prerender`, `ssr`, `csr`, `trailingSlash`) belong in the route file (or the nearest layout). Setting them imperatively at runtime defeats the framework's ability to plan the build.

## Addenda

### Adapter choice is a deployment decision, made at build

The adapter is selected in `svelte.config.js`. It determines the shape of the build output and, transitively, the runtime constraints the rest of the code must respect. Common adapters and their shape:

- **`adapter-static`** — produces a directory of static files. Every route must be prerenderable. The `fallback` option mints a `200.html` / `404.html` SPA shell for routes that can't be prerendered, but the docs warn this has SEO and performance costs and should only be used for embedded contexts (e.g., a UI shipped inside another app, wrapped in a mobile shell). Requires `prerender = true` set at the root layout (or per-route). Static routes ship with zero server runtime; SSR happens at build time. Read endpoints that depend on a live API at runtime must be fetched client-side, which usually means the build cannot fully prerender — verify the prerender pass succeeds.
- **`adapter-node`** — produces a Node server. Universal-fit but you pay for operating it.
- **`adapter-auto`** — detects the platform and picks an adapter. Useful for getting started; "I don't know my deployment target" is a #1 deferred decision worth resolving before shipping.
- **Platform adapters** (`adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`, `adapter-cloudflare-workers`) — produce platform-specific artifacts. Each has constraints on runtime, function size, supported Node APIs, edge vs. lambda routing. Verify against the platform's docs before committing.

A `fallback` SPA shell on `adapter-static` for an app that is *not* a static site is a smell — it means the app's runtime shape doesn't match the adapter's range. Either the app should be on a server adapter or the routes that fail to prerender should be made prerenderable.

### Load functions: dependency tracking, parent, streaming

Three modern load patterns worth being deliberate about:

- **Auto-dependency tracking.** Properties of `event` that a load function reads are tracked. Reading `params.slug` causes the load to re-run on slug change but not on unrelated query changes. Reading `url.searchParams.get('q')` causes re-run on `q` change but not on other params. `untrack()` excludes specific reads from tracking. Most invalidation surprises ("why did my load run / not run?") trace to a mismatch between what was read and what was expected to be tracked.
- **`parent()` and waterfalls.** A child load calling `await parent()` synchronizes on the parent's resolution. Doing this *before* the child's own independent fetches creates a serial waterfall the framework can't optimize. Pattern: fire the independent fetches, then `await parent()`, then await the independents.
- **Streamed promises.** A server load can return *unresolved* promises in its data object. SvelteKit inlines them into the HTML and resolves them as they arrive, enabling skeleton UI patterns without manual stream handling. Use for slow non-critical data; do not use for data the page can't render without — the page will render with a pending promise where the data should be.

### Form actions and progressive enhancement

Form actions are SvelteKit's mutation primitive. They're `POST`-only by design, return either successful data (the form prop populates, the page re-renders, load functions re-run) or a `fail(status, data)` result (validation errors with status, no re-run). The `use:enhance` directive client-side intercepts the submission, runs the action via `fetch`, and applies the result without a full navigation — but the form still works without JS, because it's an HTML form submitting to the same URL.

That progressive-enhancement guarantee is the engine range (#4) form actions claim. Reaching past them with client-side `fetch` mutations forfeits the guarantee. If the route needs a mutation that isn't a form (drag-to-reorder, real-time slider changes), consider whether the mutation belongs on a `+server.ts` endpoint or whether the UX would be better served by an explicit save action.

Default action vs. named actions: a route has either one default action or multiple named actions, not both. Named actions are invoked with `?/actionName` and the query persists in the URL, so a default-and-named mix would re-target. Pick one shape per route.

### Hooks: the request lifecycle

Server hooks (`src/hooks.server.ts`) wrap every request. Three load-bearing exports:

- **`handle({ event, resolve })`** — every request. Set `event.locals` (auth, request-scoped services), modify the response, transform the rendered HTML chunk. Chain multiple via `sequence()` from `@sveltejs/kit/hooks`.
- **`handleFetch({ event, request, fetch })`** — intercepts `event.fetch` calls made from server load functions. Use for redirecting same-origin API calls to localhost during SSR, attaching auth headers to outgoing requests, swapping URLs for internal hostnames.
- **`handleError({ error, event, status, message })`** — runs on unexpected errors during loading/rendering. Returns the safe public shape (`App.Error`) that flows to `+error.svelte` and the client; log here, send to Sentry, redact sensitive details.

Shared hooks (`hooks.ts`) run on both server and client. Universal `reroute({ url })` rewrites URLs before routing — for i18n route prefixes, A/B path remapping, legacy URL redirects. The `transport` hook defines custom serialization across the server/client boundary for types `devalue` doesn't handle natively — each transporter is a pair of `encode` (server) and `decode` (browser) functions.

The `init` hook runs once at server start (or client app init) — the right place for async setup (DB connection pools, warming caches, registering signal handlers).

### `$app/state` vs. `$app/stores`

`$app/state` (added in SvelteKit 2.12) exposes `page`, `navigating`, `updated` as runes-reactive objects. `$app/stores` exposes `$page`, `$navigating`, `$updated` as legacy stores and is deprecated — slated for removal in SvelteKit 3. In a runes-mode codebase, `$app/state` is canonical; the store-based API is compatibility surface only.

The migration shape: `$page.data.x` → `page.data.x`, read directly without a `$` prefix because the rune model handles reactivity on read. Mixing them in the same codebase creates two facts in two places (#8 violation). Note: changes to `page` are observable only from within runes contexts — legacy `$:` reactive statements won't see them.

### `.svelte.ts` modules for shared state

State that's app-wide but not request-scoped lives in `.svelte.ts` modules. The file extension signals to the compiler that runes are usable inside; export a singleton object literal containing `$state` and `$derived`:

```ts
// $lib/stores/preferences.svelte.ts
function createPreferences() {
  let theme = $state<'light' | 'dark'>('dark');
  return {
    get theme() { return theme; },
    set theme(v) { theme = v; }
  };
}
export const preferences = createPreferences();
```

**Hard caveat: this pattern is client-only.** A `.svelte.ts` module imported on the server will share its `$state` across every request — one user's preferences leak into another's response. Server-side state belongs in `event.locals` (set in `handle`) or returned from load functions. The `.svelte.ts` singleton pattern is for browser-only state: UI preferences, ephemeral interaction state, client-side caches.

### Prerender, SSR, CSR — three orthogonal page options

Each route (or layout, inherited down) sets three independent flags:

- **`prerender`** — whether the page is rendered at build time and served as static HTML. `true` requires the page to be deterministic from URL params alone. `'auto'` defers per-route.
- **`ssr`** — whether the page renders on the server at request time. `false` produces an empty shell hydrated on the client.
- **`csr`** — whether the page ships client-side JavaScript at all. `false` produces a server-only page (forms, links, no interactivity beyond what HTML provides).

`ssr: false` + `csr: false` is a content-less page — verify the combination matches intent. `csr: false` on a page that uses interactive components is a build-time delete of the interactivity. The flag set is a #4 range decision: what kind of page is this?

### CSP and security headers belong in `handle`

The `transformPageChunk` option of `resolve()` inside `handle` is the place to inject security headers and CSP nonces. SvelteKit's CSP support (set in `svelte.config.js` under `kit.csp`) emits nonces automatically and accepts a `mode` of `'auto'`, `'hash'`, or `'nonce'`. Picking between hash and nonce is a deployment-time decision: prerendered pages need hashes (no per-request nonce available); server-rendered pages can use nonces. Mixed mode is allowed but explicit.

### Service worker, link previews, preload

The `src/service-worker.ts` file is auto-registered if present. It has access to `$service-worker` for the precache manifest. A common pattern is offline-first caching of the prerendered shell + runtime cache of API responses; respect the framework's `build` and `files` and `version` exports so the precache doesn't drift from the deployed app.

The `data-sveltekit-preload-data` and `data-sveltekit-preload-code` attributes on links control preloading behavior — `hover`, `tap`, `viewport`, `off`. The default (`'hover'`) is usually right for desktop; `'tap'` or `'viewport'` are better for mobile or for pages where hover is rare. This is a UX-perceived-latency lever worth deliberate use, not a default.

### Remote functions (experimental in 2.x)

SvelteKit 2.x ships typed server functions callable directly from the client with end-to-end type inference. Four primitives, each with a distinct job:

- **`query`** — server-side data fetching invoked from the browser via a generated fetch wrapper. Replaces the common `+server.ts` GET-endpoint shape for typed RPC.
- **`form`** — progressively enhanced submissions. Works without JS via standard form submission; with JS, the form is enhanced and the result flows back with full type inference.
- **`command`** — JavaScript-dependent mutations. No progressive-enhancement guarantee — pick this only when the operation legitimately requires JS (drag-to-reorder, real-time slider changes).
- **`prerender`** — build-time static data, similar to a prerendered load function.

`.remote.ts` files can live anywhere in `src` except `src/lib/server`.

**Remote functions remain marked experimental as of mid-2026.** APIs may shift; the May 2026 release reworked transport to use `hydratable`, enabling richer query result types (2.56.0). Greenfield code on recent SvelteKit can prefer remote functions for typed RPC, but be ready for API drift on minor releases. Older codebases on form-action + load-function patterns cover most of the same ground without the experimental risk.


<!-- ───── pairing: typescript ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: TypeScript

- **Pairs with:** TypeScript (versions 4.x, 5.x, and 6.x). 6.0 shipped March 2026 as the last JavaScript-implemented release; `strict` is now the default, `target` defaults to `ES2025`, `module` to `esnext`, and `target: es5` is deprecated. TypeScript 7.0 will be a Go-native compiler rewrite. Applies to any project where TypeScript is the primary authored language — pure-library packages, application code, and codebases that transpile to JavaScript for runtime.
- **Sources:** TypeScript Handbook (typescriptlang.org/docs/handbook); Dan Vanderkam, *Effective TypeScript* (2nd ed., 2024); Anders Hejlsberg, *Introducing TypeScript* (Microsoft Build, 2014) and successor talks on structural typing; Marius Schulz, *TypeScript Evolution* series; Matt Pocock, *Total TypeScript* (totaltypescript.com); microsoft/TypeScript design notes (github.com/microsoft/TypeScript/wiki/Design-Goals); opinion.
- **Date:** 2026-05-20
- **Touches principles:** #4, #5, #6, #7, #8, #13

TypeScript's job is to make the engine surface (function signatures, exported types, public APIs) checkable before runtime. The principles below are about treating the type system as a real engine layer with its own range — not as documentation, not as decoration, and not as an obstacle to opt out of with `any`.

## Per-principle commentary

### #4 — Engines handle every possibility

A function's type signature is a claim about its engine range. `function divide(a: number, b: number): number` claims it handles every pair of numbers and always returns a number — including `b = 0`, which actually returns `Infinity` or `NaN`. The signature lies. The honest version either narrows the input (`function divide(a: number, b: NonZeroNumber): number`) or widens the output (`function divide(a: number, b: number): number | DivisionByZeroError`).

Discriminated unions are the canonical tool for "the engine handles N cases":

```ts
type ParseResult =
  | { ok: true; value: T }
  | { ok: false; error: ParseError };
```

The type forces every consumer to handle both branches (the compiler enforces it via exhaustiveness checking with `never`). A function returning `T | undefined` makes the same claim less honestly — `undefined` collapses every failure mode into one. Use discriminated unions when failure modes carry information.

### #5 — Instructions don't extend engines

A module's exported types are its surface. `export type` declarations and `export interface` declarations are as load-bearing as exported functions — consumers depend on their shape. Internal types live in non-exported declarations, in `_internal` submodules, or behind `internal` JSDoc tags enforced by a linter (TypeDoc's `@internal`, api-extractor's `@internal`).

The most common surface-violation pattern in TypeScript codebases: a consumer imports an internal type via a deep path or a re-export, then writes code that depends on the internal shape. When the internal type changes, the consumer breaks even though the module's public surface didn't change. Lock down deep imports at the package boundary (`exports` field in `package.json`, or path-mapping that aliases only the public entry points).

### #6 — Modules do one job

A `.ts` file does one job. A `types.ts` grab-bag (every shared type in one file) is the canonical anti-pattern — the file's only job is "be a place where types go," which is no job at all. Co-locate types with the code that owns them, or split by domain (`song-types.ts`, `engine-types.ts`) rather than by category.

Index files (`src/index.ts` as the package surface) are the legitimate exception: their job is to declare what's public.

### #7 — Clean boundaries, owned state

TypeScript carries no runtime mutability discipline by default — `let x: User = ...; x.name = '...'` compiles regardless of intent. The type system provides `readonly` and `ReadonlyArray<T>` (or `readonly T[]`) for opt-in immutability. Use them at boundaries:

- Function parameters that the function does not mutate: `readonly`.
- Return values whose contents the caller should not mutate: `readonly`.
- Exported shared state: typed `readonly` at every boundary, with a single owner who holds the mutable reference internally.

Branded types make ownership and identity explicit. The pattern:

```ts
type UserId = string & { readonly __brand: 'UserId' };
type SongId = string & { readonly __brand: 'SongId' };
```

Now `userId` and `songId` cannot be swapped at compile time, even though both are runtime strings. Use brands when an identifier's source matters and accidental cross-use would be a bug — IDs from different domains, paths that have been validated vs. not, strings that have been escaped vs. not.

### #8 — Architectural consistency

The categories where TypeScript projects accumulate scattered parallels:

- **Strictness settings.** `tsconfig.json`'s `strict` flag enables a bundle of checks; as of TypeScript 6.0 it defaults to `true`, so the question shifts from "did we enable it" to "did we leave it on." Half-strict codebases (`strict: true` but `noImplicitAny: false` overridden) signal that strictness was abandoned without explicit decision. Either keep the full `strict` bundle and address every error, or document the override.
- **Null handling.** `T | null`, `T | undefined`, `T | null | undefined`, and `T?` (optional) are four different shapes that callers must check differently. Pick one for the codebase (most projects: `T | undefined` and use `?` for optionality) and apply it everywhere.
- **Type vs. interface.** Both work most of the time; they diverge on declaration merging (`interface` allows it; `type` doesn't), on intersection vs. extension semantics, on tooling errors. Pick a default (`type` for unions and computed types, `interface` for object shapes that may be merged, OR `type` for everything — both are defensible) and stick to it.
- **Generic vs. specific.** A function that takes `T extends Record<string, unknown>` and a function that takes `User` solve different problems. Reaching for generics by default is over-engineering; reaching for `any` or `unknown` to avoid generics is under-engineering. The decision should be: is this function's *job* to be generic (it operates on shape, not domain), or is its job to operate on a specific domain type?

### #13 — Done means demonstrable

`tsc --noEmit` (or `tsc -b --noEmit` in build-mode projects) is the type-system equivalent of "it compiles." Passing it is a precondition, not done. Demonstrable also requires:

- **No `any` escape.** `any` defeats every check downstream of it. Codebases with `any` accept that the type system stops mattering at that boundary. Use `unknown` and narrow explicitly instead.
- **No `@ts-ignore` or `@ts-expect-error` without comment.** When the type system is wrong (rare, but happens — DOM lib quirks, third-party type bugs), document why with a comment that names the specific issue. A naked `@ts-ignore` is a silent assertion that future maintainers cannot evaluate.
- **No `as` casts without justification.** `as` is the type-system's escape hatch. Each use is a claim by the author that the type they're casting to is actually correct. If the claim isn't obvious from context, comment.
- **Tests run against the real types.** A test that types its inputs as `any` proves nothing about the real surface.

CI runs `tsc --noEmit`, the unit tests, and the lint rules that enforce the above. "It compiles locally" is the C-pairing's "it compiles" all over again — necessary, not sufficient.

## Addenda

### Structural typing means the type is a description, not an identity

TypeScript's type system is structural: two types are compatible if their structures match, regardless of where they were declared. This is genuinely different from nominally-typed languages (Java, C#, Rust enums) and changes how to think about type design:

- A function accepting `{ x: number }` accepts *any* object with an `x: number`, including objects that were never declared as that type.
- Brands and discriminants are how to recover nominal-like identity when needed.
- "I declared two types with the same shape; the compiler doesn't distinguish them" is structural typing working as designed, not a bug.

### `unknown` is the right top type; `any` is poison

`unknown` requires the caller to narrow before use; the type system stays honest. `any` silently propagates, infecting every type that touches it. In codebases that started in JavaScript and migrated, `any` often appears as the migration's residue — convert each one to `unknown` + narrowing, or to a specific type, deliberately.

### Compile-time vs. runtime are different engines

The type system is a compile-time engine; the JavaScript runtime is a separate engine. They don't share state. A type that says `User` does not guarantee the runtime value is a `User` — only that the author's code path *should* produce one. At every boundary where untyped data enters (network responses, user input, file reads, third-party APIs), validate at runtime with a schema library (Zod, Valibot, ArkType, io-ts) or hand-written predicates. Treat compile-time types and runtime validators as two artifacts that need to agree — and treat their disagreement as a bug worth surfacing.

### Type-level programming is a power tool

Conditional types, mapped types, template literal types, and inference in conditional types make TypeScript's type system into a small functional language. Used judiciously, they encode constraints that would otherwise require runtime checks (typed event buses, typed routers, typed query builders). Used indulgently, they produce libraries whose type errors are unreadable, whose IDE performance is poor, and whose maintenance cost is borne by everyone after the original author.

The honest test: can a maintainer who didn't write the type read the error message it produces and know what to fix? If not, the type is too clever for the job.


<!-- ───── pairing: web-frontend ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: Web Frontend

- **Pairs with:** Browser-based UIs (HTML, CSS, JavaScript or TypeScript). Applies to any project whose user surface runs in a web browser, regardless of framework choice.
- **Sources:** WHATWG, *HTML Living Standard*; W3C Web APIs (DOM, Canvas 2D, WebGL, Web MIDI, Web Audio, WebGPU); Ilya Grigorik, *High Performance Browser Networking* (2013); Mark Pilgrim, *Dive Into HTML5* (2011); MDN Web Docs (Mozilla, ongoing); Addy Osmani, *Learning JavaScript Design Patterns* (2nd ed., 2023); Dan Abramov & co., React documentation (componentization principles, framework-agnostic); Bret Victor, *Magic Ink* and *Learnable Programming*; W3C WCAG 2.2 (accessibility); opinion.
- **Date:** 2026-05-17
- **Touches principles:** #4, #5, #6, #7, #8, #14

Browser UIs sit between two unforgiving environments: the network on one side (latency, failure, partial loads) and the user's hardware on the other (variable performance, input modalities, viewport sizes, accessibility constraints). The principles below are about staying coherent in the middle without leaning toward any particular framework.

## Per-principle commentary

### #4 — Engines handle every possibility
A component built only for the happy desktop path is a half-built component. The engine's range includes: viewport widths from 320 px to 4K, pointer input from mouse / touch / pen / keyboard / screen reader, network conditions from offline to flaky-3G to fiber, browsers spanning at least two major versions deep on Chromium / Firefox / WebKit, and assistive technology. "It works on my laptop in Chrome" is a child's-toy claim. Build for the full range; degrade explicitly where you cannot.

### #5 — Instructions don't extend engines
Components expose a typed props/events API. Page-level code uses that API; it does not reach into the component's internals (DOM queries against `.component__internal-thing`, monkey-patching state, mutating refs the component owns). If page code needs something the component does not expose, the component is missing a capability — extend the API. Reaching past is the most common decay path in long-lived frontends.

### #6 — Modules do one job
A component does one job: render one piece of UI with the state and behavior that piece needs. A hook does one job: encapsulate one piece of cross-cutting logic. A state slice does one job: model one piece of domain state. "Components that do everything" — the 800-line `<Dashboard>` with twelve mixed concerns — are the frontend's modules-glued-together pathology. Split them.

### #7 — Clean boundaries, owned state
Local state is owned by the component that needs it. Shared state lives in an explicit store (Redux, Zustand, Context, signals, MobX — pick one) with explicit owners per slice. The cardinal sin is implicit shared state: two components that happen to subscribe to the same query and silently diverge, or a component that mutates a prop it received. Props flow down, events flow up — the boundary is the contract, and the contract is what makes components composable.

### #8 — Architectural consistency
Pick a pattern, document it, hold it. Three areas where consistency pays the most:

- **Folder layout.** Feature-folder vs. type-folder vs. domain-folder — pick one and do not mix. Mixed organization is scattered parallels (#8 violation) that punishes every new contributor.
- **State management.** One canonical store pattern. Two state libraries in the same codebase means every contributor has to know which lives where; the resulting code drifts and accumulates dead wiring.
- **Styling.** CSS modules, Tailwind, CSS-in-JS, vanilla CSS — pick one. Mixed approaches accumulate dead styles, override wars, and bundle bloat.

Framework choice is downstream of these. The framework is a sequencer (#5) of the same underlying DOM/CSS/JS engines; the patterns above are what stays consistent regardless.

### #14 — State lives in files
Application config lives in code or build flags (`VITE_*`, `NEXT_PUBLIC_*`, etc.) — not scattered through component bodies. User preferences that need to persist live in a deliberate persistence layer (localStorage *behind* a typed accessor, IndexedDB, or a backend). What does *not* count as "state in files": ad-hoc `localStorage.setItem` calls from random components, query-string state that nothing canonicalizes, in-memory state lost on every reload that the user expected to keep. If reloading the page loses important state, that state was in conversation, not in files.

## Addenda

### The framework is downstream
React, Vue, Svelte, Solid, Lit, Angular, vanilla — each is a sequencer of the same underlying DOM/CSS/JS engines. The pairing's guidance applies regardless. Project-specific framework choice belongs in `PROJECT-SCOPE.md`, not in this pairing. Cross-references like "use React" or "use Tailwind" would lean the pairing toward a specific combination — the bundler combines pairings, the pairing itself stays pure.

### Hardware-facing browser APIs
The browser's hardware-facing APIs (Web MIDI, Web Audio, Web USB, Web Bluetooth, WebHID, WebSerial, WebGPU) extend the frontend's range into territory traditionally reserved for native apps. They are real engines, not toys — but each ships with browser-specific quirks. Examples as of 2026:

- **Web MIDI** — not implemented in Safari/WebKit. Polyfills exist but cannot grant true hardware access.
- **Web USB / WebHID / WebSerial** — Chromium-only. Require HTTPS and an explicit user-gesture consent flow.
- **Web Audio** — `AudioContext` has the autoplay-policy minefield; must be created or resumed from a user gesture, or the engine is suspended.
- **WebGPU** — broadly available on Chromium, Safari 26+, and Firefox 141+ on Windows and 145+ on macOS ARM64 (Linux and Intel macOS still rolling out). Some surface gaps (e.g., `importExternalTexture` in Firefox stable) — feature-detect at the method level, not just at the API level.

Treat each as an external engine: gate its usage behind a capability check, design fallbacks honestly, never assume parity across browsers. The honest-bounds principle (#9) shows up here as feature detection and an explicit support matrix.

### Performance is a constraint, not a feature
Bundle size, Time-to-Interactive, frame budget on the lowest device the project targets — these are constraints on the engine's range (#4), not optional polish. Define them up front (in `PROJECT-SCOPE.md` under Hard constraints) and measure them in CI. "We'll optimize later" usually means "we'll never optimize." A 5MB JavaScript bundle that loads in 8 seconds on a 3G phone is a broken engine, not a slow one.

### Accessibility is part of the engine
WCAG 2.2 conformance is not a separate concern bolted on at the end — it is part of what makes the component handle its range (#4). Keyboard navigation, focus management, ARIA roles, color contrast, motion preferences, screen-reader semantics: these are the engine's contract with users who do not use a mouse, do not see the screen, or cannot tolerate animation. Components that work only for sighted mouse users have a narrower range than they claim.


<!-- ───── pairing: css ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: CSS

- **Pairs with:** CSS the language — selectors, cascade, layout, typography, color, motion, custom properties, modern modules (cascade layers, container queries, `:has()`, nesting, view transitions, color spaces, `@property`, scope). Framework-agnostic; applies whether the surface is vanilla CSS, CSS modules, Svelte scoped styles, Tailwind, or any combination.
- **Sources:** MDN Web Docs (Mozilla, ongoing); W3C CSSWG specifications (ongoing); Adam Wathan & Steve Schoger, *Refactoring UI* (2018); Lea Verou, *CSS Secrets* (2015); Andy Bell & Heydon Pickering, *Every Layout* (2020); Heydon Pickering, *Inclusive Components* (2019); Una Kravets et al., *web.dev / CSS guides* (2023+); Josh W. Comeau, *CSS for JavaScript Developers* (2021); Evil Martians, *OKLCH in CSS* (2023+) and *Better dynamic themes in Tailwind with OKLCH* (2024); Radix Colors documentation; Tailwind CSS v4 documentation (2024+); opinion.
- **Date:** 2026-05-27
- **Touches principles:** #4, #6, #7, #8, #9, #10

CSS has been doing more for fewer lines every year. The post-2022 baseline — cascade layers, container queries, `:has()`, native nesting, OKLCH, view transitions, `@property`, `@scope` — has changed what "modern CSS" means more in three years than the prior decade. The principles below specialize the design rules for CSS's specific texture: a declarative cascade where order, specificity, and scope all decide who wins, and where the same visual result can be produced by very different cascade strategies.

## Per-principle commentary

### #4 — Engines handle every possibility

A stylesheet engine's range is the matrix of (viewport size × pointer modality × color scheme preference × motion preference × contrast preference × locale/direction × device capability). The stylesheet that styles only the "1440px desktop, mouse, dark mode, no motion preference, English LTR, high-end laptop" cell of that matrix has a range narrower than the audience it claims. The full range includes at least:

- Viewport widths from ~320px to ultra-wide (and the cases where the user zooms, which changes effective viewport).
- Pointer modalities (`hover: hover` + `pointer: fine`, `hover: none` + `pointer: coarse`, the touch-and-keyboard hybrid).
- `prefers-color-scheme: light | dark` and `prefers-contrast: more | less | no-preference`.
- `prefers-reduced-motion: reduce` (animations should be inert or instantaneous; transitions of decorative properties only) and `prefers-reduced-data` (defer non-critical fetches).
- LTR and RTL writing modes; physical (left/right) vs. logical (inline-start/inline-end) properties.
- Forced-colors mode (Windows high-contrast) — `@media (forced-colors: active)` and `forced-color-adjust`.
- Print (`@media print`) for any document users might print.

Logical properties (`margin-inline-start`, `padding-block`, `border-end-end-radius`) make most of the writing-mode axis trivial — write logical, opt into physical only for genuinely physical concerns (drop shadows, transforms that mean something visual rather than directional).

### #6 — Modules do one job

Each rule does one job. A rule that sets layout *and* typography *and* color *and* a transition is four rules glued together — easier to read written separately, easier to override surgically when one of the four needs to change. Same for selectors: `.btn` doing too many jobs (primary button, link-styled button, icon button) becomes the canonical "scattered parallels" pathology — split into `.btn-primary`, `.btn-link`, `.btn-icon` with `.btn` as the shared base, or accept the variants as explicit modifiers and document them.

A custom property does one job: it names one design decision. A `--color-primary` that's used as both a background and a border in different places means "this is the primary color"; that's one job. A `--blue-500` used as background, border, link, and focus ring without naming the *role* couples the visual to the value — when the design changes blue, every usage has to be audited individually. The role-based naming (`--color-link`, `--color-focus-ring`, `--bg-card`) is the design-token discipline; the value-based naming is the palette under the design tokens.

### #7 — Clean boundaries, owned state

A component's stylesheet owns the component's visual state. Three lines that boundary cleanly:

- **Custom properties as the public surface.** A component declares the custom properties it reads (`--card-bg`, `--card-padding`, `--card-radius`) and the parent sets them. This is the equivalent of typed props for styles — the parent themes the child without breaking the child's scoping.
- **The cascade as the *implementation*, not the *contract*.** Two stylesheets fighting over specificity to override each other is two modules reaching across the boundary. The right fix is almost always to expose a property (custom property, modifier class, data attribute) that the parent uses through the supported surface.
- **Scoped styles where the framework offers them.** Svelte's `<style>` block, CSS modules, `@scope` natively, web component shadow DOM — each is a mechanism for "this rule only applies inside this boundary." A `:global(...)` escape (or its equivalent in other systems) is an opt-out of the boundary; treat it the same as `any` in TypeScript — a typed escape hatch, not a default.

### #8 — Architectural consistency

CSS accumulates inconsistency faster than most languages because every rule is independently valid in isolation. The hot spots:

- **Methodology.** BEM, utility-first (Tailwind-style), CSS modules, scoped styles, atomic CSS, attribute-based — pick one as the primary shape and use the others only where the primary genuinely can't express the requirement. A codebase with three methodologies has three mental models active at every read.
- **Layer architecture.** `@layer reset, base, theme, components, utilities;` is one common ordering. Whatever ordering is picked, hold it. Unlayered styles override layered styles for normal declarations (the rule is inverted for `!important`, which is why `!important` accumulation is a smell — it's reaching for the priority lever instead of the intended cascade).
- **Spacing scale, type scale, color scale.** A spacing system with eight values used consistently is a system; eight values used and four more added inline because "we needed something between 12px and 16px" is a system in name only. The discipline is "no magic numbers in components; if you need a new value, add it to the scale and explain why."
- **Naming.** Role-based names (`--color-danger`, `--color-link`) at the component layer; value-based names (`--blue-500`, `--space-3`) at the palette layer. Mixing them at the same layer is what makes a codebase impossible to refactor — the next maintainer can't tell which usages mean "I want this color" vs. "I want danger."

### #9 — Honest bounds over universal claims

"This stylesheet supports modern browsers" is a claim — back it. A finished stylesheet's bounds include the actual minimum-version matrix (Chrome 99+ for cascade layers, Safari 15.4+ for cascade layers and container queries, Firefox 121+ for native nesting, etc.). Features behind the chosen baseline can be used directly. Features ahead of it need feature queries (`@supports`) or progressive enhancement (the base styles work without; the enhancement layers on for browsers that support it).

The honesty fails most often around `:has()` (Firefox added it last among modern browsers; the support floor in late 2023), container queries (Safari 16+), `@scope` (newer than the others — verify per the target matrix), and color spaces (`color()`, `oklch()` — broadly supported now but gamut-mapping behavior varies). Each is worth deliberate use; each is worth checking the target matrix before reaching for.

### #10 — Explicit exclusions over vague coverage

"We don't support [internet explorer | old Safari | print | dark mode | forced colors | RTL | screen readers]" should be a stated decision, not an accidental omission. Each non-support claim belongs on a list with a reason. The default in CSS is to silently degrade; the discipline is to make the degradation intentional.

The flip side: a stylesheet that *claims* to support reduced-motion but only honors it for one of fifteen animations is technically dishonest. Pick: support fully, or don't claim support.

## Addenda

### The cascade as the system

Specificity, source order, and origin decide which rule wins — and in modern CSS, *layers* decide before any of those. The mental model worth keeping:

1. Origin and importance (user agent < user < author; normal < important; the importance flag inverts most of the ordering).
2. Layer order (later-declared layers win for normal declarations; earlier-declared layers win for `!important` — yes, inverted).
3. Specificity (inline > IDs > classes/attributes/pseudo-classes > elements/pseudo-elements).
4. Source order (last wins, ties broken by declaration order in the source).

Cascade layers (`@layer`) collapse most of the specificity wars. A common architecture:

```css
@layer reset, base, tokens, components, utilities;

@layer reset {
  /* normalize / reset */
}
@layer base {
  /* element defaults: h1, p, a, button defaults */
}
@layer tokens {
  /* :root custom properties */
}
@layer components {
  /* .card, .btn, .input, etc. */
}
@layer utilities {
  /* .text-center, .visually-hidden, etc. */
}
```

Anything outside `@layer` (a stylesheet that loads without being wrapped) wins over layered styles for normal declarations. Treat that as the "escape hatch" tier — a place to put third-party stylesheets you can't move into layers and a place to put per-page overrides that genuinely should win.

### Custom properties as the configuration surface

CSS custom properties (`--name`) are runtime-resolved, inherit through the DOM, and cross every styling boundary that respects the cascade. They are the canonical mechanism for:

- **Theming.** Light mode and dark mode are two values for the same set of custom properties, swapped at `:root` (or scoped to a subtree via a class).
- **Component configuration.** `--card-padding`, `--card-radius`, `--card-bg` declared by the component, settable from the parent — a typed interface for styles without breaking scoping.
- **Computed values.** `calc(var(--space-1) * 2)` lets a single source of truth drive derived spacing.

`@property` registers a custom property with a type, default, and inheritance behavior. Registered properties can be transitioned (an unregistered `--rotation` can't transition smoothly because the browser doesn't know it's an angle; registered as `<angle>` it can). Treat `@property` registration as the typed-prop equivalent for custom properties — opt in for properties that benefit from typed behavior.

### Layout: flex, grid, subgrid, container queries

Three layout systems coexist, each better at different jobs:

- **Flexbox** — one-dimensional flow with wrap and alignment. Right for navigation bars, button rows, anything that lays out as a line and wraps.
- **Grid** — two-dimensional placement with named tracks and areas. Right for page layouts, component layouts with positional logic, anything that needs alignment in both axes.
- **Subgrid** — grid items can opt into participating in their parent grid's tracks. Right for "rows of cards where the titles align across all cards" — without subgrid, each card laid out its own grid and the alignment was approximate.

Container queries (`@container`) replace media queries for component-level responsiveness. A media query asks "how big is the viewport"; a container query asks "how big is *this container*." A card that has to be narrow in a sidebar and wide in a main column is a card whose layout depends on its container, not the viewport. Set `container-type: inline-size` on the container; query against named or anonymous container with `@container (width > 700px)`. Container query units (`cqw`, `cqh`, `cqi`, `cqb`) are relative to the nearest query container — typography that scales with container width without a single media query.

Media queries remain right for *page-level* decisions (sidebar collapses below a threshold; navigation switches to a drawer). Container queries are for *component-level* decisions (the card's title shrinks; the card's image moves above the text). Mixing them haphazardly produces the same scattered parallels as mixing methodologies — pick a rule for which decisions belong at which scope and hold it.

### Color: OKLCH, color-mix, wide gamut

`oklch()` (and the rectangular `oklab()`) is perceptually uniform — equal numeric steps in lightness produce equal visual steps. HSL is not (50% lightness in HSL yellow and 50% lightness in HSL blue are not the same perceived brightness). The practical consequences:

- **Color palettes generate cleanly.** `oklch(70% 0.18 220)` and `oklch(60% 0.18 220)` and `oklch(50% 0.18 220)` are a perceptually uniform shade ramp; the HSL equivalent is not.
- **Color-mix produces predictable results.** `color-mix(in oklch, white 20%, var(--brand))` is a perceptually-uniform tint; mixing in sRGB produces a tinted result that visually differs from intent.
- **Wide-gamut displays display more.** `oklch()` can express colors outside sRGB; `display-p3` is the practical wide gamut on Apple devices. `color(display-p3 r g b)` is the explicit form. Fallback colors in sRGB for non-wide-gamut displays remain necessary.

Relative color syntax — `oklch(from var(--brand) calc(l - 0.1) c h)` — derives one color from another in a single declaration. Useful for hover/active/focus state derivation without an explicit palette per state.

For contrast, design tokens that *name a role* (`--color-text`, `--color-text-muted`, `--color-link`) instead of *a value* (`--color-blue-700`) make the contrast question answerable: does `--color-text` on `--color-bg` meet 4.5:1? The answer is one check per role pair, not one check per usage.

### Color systems and hue matching for UIs

A UI palette has to satisfy several constraints at once: brand identity, perceptual consistency across hues, accessible contrast against backgrounds, semantic meaning (danger / success / warning / info), and visual harmony so the eye doesn't trip on a button that's "the wrong shade of the right color." Modern CSS in OKLCH lets these be expressed as a discipline rather than a guess.

**Three-layer token architecture.** The canonical structure (Tailwind v4, Radix Colors, Vercel Geist, Material You all use variants of this):

1. **Primitives** — the raw palette, named by hue family and lightness step. `--blue-50` … `--blue-950`, `--red-50` … `--red-950`. Value-named; no role.
2. **Semantic tokens** — role assignments. `--color-bg`, `--color-bg-elevated`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-danger`, `--color-success`. Role-named; no specific value at this layer.
3. **Component tokens** — component-scoped, reading from semantic tokens. `--card-bg: var(--color-bg-elevated)`, `--input-border: var(--color-border)`.

Each layer reads only from the layer beneath. A component never reads a primitive; a semantic token never references a component-local value. Crossing the layers is the scattered-parallels pathology — when the blue brand changes, you have one place to update at each layer, not every usage.

**Building a hue family in OKLCH.** A lightness scale (steps 50 → 950 mapped to OKLCH L from ~0.97 → ~0.15) at fixed hue produces perceptually even shades. Chroma is *not* constant across the scale — peak chroma sits in the middle; very light and very dark colors desaturate naturally:

```css
:root {
  --blue-50:  oklch(0.97 0.02 240);
  --blue-100: oklch(0.93 0.05 240);
  --blue-200: oklch(0.87 0.08 240);
  --blue-300: oklch(0.78 0.12 240);
  --blue-400: oklch(0.68 0.16 240);
  --blue-500: oklch(0.58 0.18 240);  /* base */
  --blue-600: oklch(0.48 0.18 240);
  --blue-700: oklch(0.38 0.16 240);
  --blue-800: oklch(0.28 0.13 240);
  --blue-900: oklch(0.18 0.09 240);
  --blue-950: oklch(0.12 0.05 240);
}
```

The curve constants are hand-tuned per palette. `atmos.style`, `oklch.fyi`, Radix Colors, and the Tailwind v4 default theme all publish curves worth borrowing or referencing rather than guessing.

**Hue matching across hue families.** A red, a blue, and a green at the *same lightness step* should feel like siblings — equally weighted. In OKLCH this means equal L (and where the gamut allows, equal C) across hues:

```css
--blue-500:  oklch(0.58 0.18 240);
--red-500:   oklch(0.58 0.18 25);
--green-500: oklch(0.58 0.18 145);
```

Yellow is the practical exception — peak-chroma yellow lives at higher L than peak-chroma red / blue / green, so a yellow at L=0.58 looks muted. Two honest fixes: either give yellow its own L curve (`--yellow-500: oklch(0.85 0.18 95)`) and label that deviation explicitly, or keep yellow out of the equal-step grid and use it as a special-purpose accent.

**Hue harmony patterns.** From a base hue `h` (modulo 360), the standard harmonic relationships:

| Harmony | Hues |
|---|---|
| Monochromatic | `h` only; vary L and C |
| Analogous | `h`, `h ± 30`, `h ± 60` — same temperature; calm |
| Complementary | `h`, `h + 180` — high contrast; use one as the accent |
| Split-complementary | `h`, `h + 150`, `h + 210` — softer than complementary |
| Triadic | `h`, `h + 120`, `h + 240` — vibrant; tricky to balance |
| Tetradic | `h`, `h + 90`, `h + 180`, `h + 270` — four-color theme; needs one dominant |

Relative color syntax makes these computable in a single declaration:

```css
--accent-complement: oklch(from var(--brand) l c calc(h + 180));
--accent-analog:     oklch(from var(--brand) l c calc(h + 30));
```

**Accent chroma honesty.** A common drift: each new accent gets added at "whatever looks right today" chroma. Three months later the palette has a 0.12-chroma blue accent, a 0.20-chroma red accent, and a 0.08-chroma green accent — none wrong individually, but together they read as different visual weights and the UI feels incoherent. Pick one accent chroma (e.g., 0.18) and only deviate when there's a reason to: gamut-clipping on a particular hue, or deliberate de-emphasis. Document the deviation.

**Light and dark theme construction.** `light-dark()` (Baseline since May 2024; expected Widely Available November 2026) expresses both modes in one declaration when `color-scheme` is set:

```css
:root { color-scheme: light dark; }

.card {
  background: light-dark(oklch(0.97 0.01 240), oklch(0.18 0.02 240));
  color:      light-dark(oklch(0.18 0.02 240), oklch(0.95 0.01 240));
}
```

The principle behind a dark palette: it is *not* the light palette inverted. It is a separate palette with its own L / C / h curve. The semantic tokens (`--color-bg`, `--color-text`) map to different primitives in each mode; the components are unchanged. Tailwind v4's `@theme` block and Radix's color scales both ship light/dark pairs constructed this way.

Background hue tint in dark mode: prefer near-black with a slight tint in the dominant brand hue (`oklch(0.18 0.02 240)`) over pure black. Pure black is fine on OLED; on LCD it looks lifeless. The slight tint keeps the surface coherent with the rest of the palette.

`light-dark()` accepts only color values. For images, gradients, or other mode-dependent properties, fall back to `@media (prefers-color-scheme: dark)`.

**Contrast checking by token pair, not by usage.** With the three-layer architecture, the contrast audit is one check per role pair:

- `--color-text` on `--color-bg`: 4.5:1 (WCAG AA, normal text).
- `--color-text-muted` on `--color-bg`: 4.5:1 (still readable text).
- `--color-text` on `--color-bg-elevated`: 4.5:1.
- `--color-link` on `--color-bg`: 4.5:1 against background **and** 3:1 against surrounding text (distinguishable beyond color, per WCAG 1.4.1).
- `--color-focus-ring` on whatever it sits over: 3:1 minimum.
- `--color-danger` / `--color-success` / `--color-warning` as text on `--color-bg`: 4.5:1 each.

OKLCH L is a strong predictor of perceived brightness, so the rough rule "text L ≤ 0.35 on bg L ≥ 0.85 will pass AA" gives a starting palette before the contrast tool confirms it. The tool is still the source of truth — perceptual lightness isn't quite WCAG contrast.

**Tools and reference palettes.** `oklch.com`, `oklch.fyi`, `atmos.style/playground` are interactive OKLCH pickers and palette generators. Radix Colors and Tailwind v4 publish full OKLCH-based palettes (light + dark) you can copy or use as calibration. Evil Martians' "OKLCH in CSS" articles are the practical write-up for migrating from HSL.

### Motion: budget, intent, and the reduced-motion contract

A `transition` is a contract: the browser smooths a property change over time. Honor it deliberately:

- **Transition decorative properties** (`opacity`, `transform`, `background-color`, `box-shadow`) — these are cheap and don't reflow.
- **Avoid transitioning layout properties** (`width`, `height`, `top`, `left`, `padding`) — they reflow. If a size change is part of the motion, use `transform: scale()` over a size transition.
- **Specify the property, not `all`.** `transition: all 200ms` transitions every property the browser detects changing, including ones you didn't intend. `transition: opacity 200ms, transform 200ms` is the explicit contract.
- **`prefers-reduced-motion: reduce` is a hard signal.** Honor it by either disabling the animation entirely or replacing it with an instantaneous state change. A "subtle" animation under reduced-motion is the wrong reading of the preference — the user is asking for no animation, not less animation.

The `@property` registration unlocks transitioning of custom properties (angles, lengths, numbers). The View Transitions API extends transitions across DOM mutations — `document.startViewTransition(() => { /* mutate DOM */ })` produces a cross-fade between the before and after states for free, with `view-transition-name` opting individual elements into named coordinated transitions. View transitions are an engine — they have a range (single-document by default, cross-document with `@view-transition { navigation: auto; }`) and a reduced-motion contract (the browser skips the transition when reduced-motion is set, if the developer doesn't override it).

### `:has()`, `@scope`, native nesting

Three modern selector features that change how rules are written:

- **`:has(...)`** is the parent selector. `article:has(> img)` selects articles that contain a direct-child image; `form:has(:invalid)` selects a form with any invalid field. Specificity follows the most specific selector inside `:has()`. Performance caveat: broad anchors (`body:has(...)`, `*:has(...)`) force the browser to recompute on every subtree change. Use narrow anchors (`.card:has(...)`) and limited combinators (`> child`, `+ sibling`).
- **Native nesting** lets a stylesheet author write child/sibling/pseudo rules under the parent. Differences from Sass nesting: no `&__bem` concatenation (the parser reads `&__bem` as a compound selector `&.__bem`, which is almost never what you want); `&` carries the specificity of `:is(...)` against the parent list (a `&.active` nested under `.btn, .link` has the specificity of `:is(.btn, .link).active`, not the union). Use nesting for genuinely contextual rules; avoid it for grouping unrelated rules under a common parent purely for organization.
- **`@scope`** scopes a block of rules to a starting element and (optionally) a scope-end element, with the implicit `:scope` selector matching the scope root. Useful for "these rules apply to a card's interior but not to nested cards" without the framework-specific scoping mechanisms. As of early 2026 it is **Baseline Newly Available** — Firefox 146 joined Chrome and Safari — so it can be used directly on modern-browser targets, with a fallback (BEM, CSS modules, scoped component styles) only for older support matrices.

### Typography

System font stacks remove a layout shift and a download cost; web fonts buy specific identity. Pick deliberately. When using web fonts:

- **`font-display: swap`** or `optional` — never default. `swap` shows fallback text immediately and swaps when the font loads (one FOUT); `optional` shows fallback and only swaps if the font arrives in a tiny budget (preferred for slower networks; avoids late layout shifts).
- **Variable fonts** collapse multiple font files into one. A variable font with weight, slant, and width axes serves more typographic intent for less network cost than a dozen static face files.
- **Fluid typography** — `font-size: clamp(1rem, 0.95rem + 0.3vw, 1.2rem)` scales between a min and max with viewport. With container query units, the same pattern scales with container width: `clamp(1rem, 0.9rem + 0.5cqi, 1.2rem)`.
- **Line height should be unitless.** `line-height: 1.5` inherits multiplicatively; `line-height: 24px` doesn't.
- **Logical type properties for international support.** `text-align: start` (not `left`) honors writing direction.

### Accessibility surface in CSS

CSS can break accessibility in specific, named ways:

- **`outline: none` on focusable elements without a replacement** removes the keyboard focus indicator. The replacement must be visible at the chosen contrast (3:1 against the background for non-text per WCAG 2.2).
- **`:focus` vs. `:focus-visible`.** `:focus` matches on every focus (including mouse clicks); `:focus-visible` matches only when the browser determines the focus should be visible (keyboard navigation, programmatic focus). Pattern: `outline: none` on `:focus`; full focus ring on `:focus-visible`.
- **`display: none` removes from the accessibility tree.** `visibility: hidden` and `opacity: 0` with `pointer-events: none` may or may not, depending on UA. For "hide from sighted users, keep for screen readers," use the `.visually-hidden` pattern (clip to 1px, position absolute, etc.), not display:none.
- **Forced-colors mode** (Windows high-contrast) overrides most color values. Test the layout under forced-colors; specify `forced-color-adjust: auto` (default) or `none` deliberately.
- **Color contrast** is a CSS concern: 4.5:1 for normal text, 3:1 for large text (24px regular or 18.66px bold) and non-text UI components, per WCAG 2.2 AA. Audit roles, not individual usages — a `--color-text` on `--color-bg` audit covers every place those tokens are used.

### Performance: layout, paint, composite

The CSS performance model is three stages: layout (reflow), paint (rasterize), composite (assemble layers). Properties differ in cost:

- **Composite-only properties** (`transform`, `opacity`, `filter` in some cases) — animations on these skip layout and paint entirely. Cheap.
- **Paint-only properties** (`color`, `background-color`, `box-shadow`) — repaints the affected area. Acceptable for transitions.
- **Layout properties** (`width`, `height`, `top`, `padding`, anything that affects geometry) — reflows the document. Expensive; avoid in animations.

`will-change: transform` hints the browser to promote the element to its own layer in anticipation of a change — useful for animations starting from a user gesture, harmful if applied permanently (the browser allocates a layer even when no change is happening).

Content visibility (`content-visibility: auto`) opts an offscreen subtree out of rendering until needed. For very long pages with many independent sections (a feed, a list of cards), the savings are real. Pair with `contain-intrinsic-size` to give the browser a size estimate so the scrollbar doesn't jump.

### Print, forced-colors, and the other media types

`@media print` is the styling for printed output. Worth at minimum: ensure links print their URL (`a::after { content: " (" attr(href) ")"; }`), hide navigation, set a print-appropriate background (`background: white; color: black;`), specify page margins via `@page`.

`@media (forced-colors: active)` is Windows high-contrast mode. Most color values are overridden; use `forced-color-adjust: none` only when the element must retain its colors (a logo, a color picker) and accept that you've taken on responsibility for legibility.

`@media (update: slow)` is e-ink and similar — avoid animations entirely. `@media (hover: none)` is touch-primary devices — avoid hover-only affordances. `@media (any-pointer: coarse)` reports if any pointing device is coarse; useful for "this layout has touch targets that work for fingers even on a hybrid device."


<!-- ───── pairing: copy-truth ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: Copy Truth

- **Pairs with:** user-facing instructional text as a verification surface — every helper line, tooltip, placeholder, empty state, confirmation prompt, error message, badge title, and onboarding hint a product shows its users. Each one is a *claim about behavior*, and this pairing treats the full set as an auditable contract: instruction must match function. Covers the truthfulness and synchronization of in-product copy. Out of scope: visual presentation of text (a perceptual concern), vocabulary architecture (which words name which concepts — a mental-model concern), and developer-facing comments/docs (covered by code-level doc-drift discipline).
- **Sources:** Jakob Nielsen, *10 Usability Heuristics* (NN/g) — #1 "visibility of system status", #2 "match between system and the real world", #9 "help users recognize... errors", #10 "help and documentation"; Microsoft Writing Style Guide (ongoing); GOV.UK Content Design guidance (ongoing); Torrey Podmajersky, *Strategic Writing for UX* (O'Reilly, 2019); opinion.
- **Date:** 2026-06-11
- **Touches principles:** #2, #7, #9, #12, #13

Instructional copy is the one part of the system users actually read, and the one part no compiler checks. A tooltip that says "never invoiced" while the engine invoices anyway isn't a typo — it's a false statement of behavior delivered at the exact moment of a decision, with the product's full authority behind it. Code that drifts from comments wastes developers' time; copy that drifts from function makes *users* wrong, and they have no way to debug the discrepancy. The discipline: every instructional string is a claim; claims get verified against the code path they describe, and re-verified when that path changes.

## Per-principle commentary

### #2 — Upfront anticipation over reactive patching
Enumerate where instructional claims live before auditing or writing them — the inventory is finite and greppable: helper paragraphs under headings, `placeholder=` text, `title=` tooltips, `confirm()` strings, empty-state messages, error strings (client and server `fail()` messages), notification copy (push/SMS/email bodies), button labels that assert behavior ("Save draft" claims a draft exists), and settings descriptions. A copy audit that only reads visible page text misses the tooltips and confirms — which are precisely where behavioral promises concentrate, because that's where designers put the fine print.

### #7 — Clean boundaries, owned state
A behavioral fact stated in copy is that fact represented *twice*: once in code, once in prose. Twice is the minimum (users must be told things), but every restatement multiplies drift surface. So: state each behavioral claim in the fewest places that serve the user, and when one behavior is described on several surfaces (a tooltip, a settings hint, a notification), treat those strings as a named set that changes together. The strongest form is structural: derive the copy from the same constant the code uses (a shared limit, a shared label map, a shared duration) so prose and behavior cannot disagree. "The session times out after 30 minutes" hardcoded in copy while `TIMEOUT_MS` lives elsewhere is the canonical violation.

### #9 — Honest bounds over universal claims
Copy loves absolutes — "never", "always", "automatically", "instantly", "secure" — and every absolute is a universal claim requiring a constructive argument. Audit them by strength: "never invoiced" must be enforced on every code path, not just the visible one; "syncs automatically" must state or honestly imply the cadence; "saved" must mean durably saved, not optimistically rendered (the honest version when queued is "saved — will sync", and only if the queue can actually deliver it). Where behavior is conditional, the copy carries the condition ("admins can..." / "once published..."). Weasel-soft copy is the opposite failure: "may take some time" where the code has a fixed 45-second deadline is vagueness where precision was free. Say what the code does; the code is sitting right there.

### #12 — Surface conflicts, never resolve silently
When an audit finds copy contradicting code, there are always two fixes — change the words or change the behavior — and choosing is a *product decision*, not a copy edit. The string may be the spec ("non-billable jobs are never invoiced" was the intent; the engine was wrong) or the fossil (the behavior moved on; the words didn't). An auditor who silently rewrites copy to match drifted behavior may be laundering a regression into documentation. Surface the pair — claim, behavior, cites for both — and let the owner pick the truth. The same applies between two pieces of copy that disagree with each other: both can't be right, and averaging them helps no one.

### #13 — Done means demonstrable
A copy claim is verified when you can point to the code path that makes it true — `file:line` for the enforcement, not vibes about intent. "This tooltip is accurate" means: the guard exists, on every route to the behavior, including the ones the UI doesn't expose (direct POST, API, scheduled job). Inventory coverage is also demonstrable: report claims-checked / true / false / stale / unverifiable, like any audit. And the contract runs forward: a behavior change isn't done until the strings describing that behavior were grepped for and updated — "find the copy" belongs in the definition of done for any user-visible behavior change.

## Addenda

### The claim taxonomy

Audit verdicts that keep findings honest:

- **TRUE** — claim matches behavior; cite the enforcing code.
- **FALSE** — claim contradicts behavior; this is a product decision (see #12), severity scales with what the user risks by believing it (money, data loss, security > convenience).
- **STALE** — was true, behavior moved; usually a copy fix, but confirm the behavior change was intentional before blessing it.
- **PARTIAL** — true on the happy path, false on edge paths (the "never" that's mostly never).
- **UNVERIFIABLE** — depends on runtime/config/external services; either make it verifiable or soften the claim to what is.
- **VACUOUS** — claims nothing checkable ("powerful", "seamless"); not a defect, but flag it where users needed an actual instruction.

### Where the lies concentrate

Empirically, the highest-yield surfaces: **tooltips and `title=` attributes** (fine print nobody re-reads after writing), **confirmation dialogs** (consequence statements drift as consequences change), **empty states** (written before the feature matured), **offline/sync messaging** (the gap between optimistic UI and durable truth), **permission hints** ("only admins can..." after a role model changes), and **stale counts or limits** baked into prose. Start there.

### Writing copy that stays true

- Prefer copy that describes the *user's situation* over the *system's mechanism* — mechanisms change more often ("We'll text you if this doesn't reach your phone" survives a transport rewrite; "uses Web Push with SMS fallback via the 45-second escalation sweep" does not).
- When the mechanism matters to the user, bind the number to the code's constant or accept a standing audit obligation for it.
- Date-stamp nothing in UI copy; "new" is a countdown to a lie.
- Every `confirm()` states the consequence, and the consequence stated is the consequence implemented — including reversibility ("This cannot be undone" is a claim about the database, verify it).


<!-- ───── pairing: jobs-to-be-done ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: Jobs to Be Done

- **Pairs with:** Product and feature work seen through the *user's lived perspective* — the jobs-to-be-done lens and its companions (personas, goal-directed design, mental models). A reasoning discipline for *which feature, and for whom*, not a UI surface-design method.
- **Sources:** Clayton Christensen et al., *Competing Against Luck* (HarperBusiness, 2016 — JTBD, "progress in a circumstance"); Anthony Ulwick, *Jobs to Be Done: Theory to Practice* (Idea Bite Press, 2016) and *What Customers Want* (McGraw-Hill, 2005 — Outcome-Driven Innovation, the job-statement form); Alan Cooper, *The Inmates Are Running the Asylum* (Sams, 1999 — personas, goal-directed design); Indi Young, *Mental Models* (Rosenfeld Media, 2008 — mental-model audits, the user's task structure); opinion.
- **Date:** 2026-06-25
- **Touches principles:** #1, #2, #6, #7, #10, #12

A feature is never the thing the user wants; it is the mechanism you hope serves
the thing they want. The job-to-be-done lens forces a slowdown before any
mechanism gets built: a product is *hired* to make **progress in a
circumstance**, so the design starts from the **job and the person's lived
context** — who they are, what progress they are reaching for, and what a domain
word means *to them* — not from the feature you were about to ship. The
discipline's sharpest single move is naming **who** the user is (including the
user who wears **two roles at once**) and then watching for a **domain word that
means two different things** to that user: an overloaded term is the tell that
two jobs — or two roles — have been quietly collapsed onto one axis. The
principles below show where that lens already lives in this collection, and where
reasoning from the user's side catches an axis you cannot see from the feature's
side.

## Per-principle commentary

### #1 — Vision down to detail
The "overall picture" that tells you which axes exist is **who the product is for
and the job they're getting done** — not the feature list. Christensen's framing
is exactly vision-down-to-detail aimed at the user: name the progress someone is
trying to make in a circumstance, *then* the surfaces and controls decompose
under it. The decisive case is the **dual-role user** — an axis you can only see
from the user's side. From the feature's side, "show the user their work" looks
like one job; from the person's side, the admin who *dispatches a board* and the
technician who *does the jobs* are two circumstances wearing one body. Miss that
vision and you build detail-up: a screen with no person above it, locally
sensible and globally aimed at no one.

### #2 — Upfront anticipation over reactive patching
This is where the lens earns its keep. The classic smell: a need surfaces — "let
me see just *my* stuff" — and it gets stapled on as a **"My / All" filter**. The
filter is the reactive patch; it encodes a role distinction as a UI toggle
instead of naming the role. Anticipation is the JTBD move: enumerate *who* uses
this and *what job each is doing* before building the mechanism, and the dual
role appears as an axis to model, not a flag to add later. The rule of thumb —
**a flag or filter that quietly encodes a role or persona distinction is patching
where you should have modeled.** Re-enumerate from the person; don't re-staple
onto the nearest screen.

### #6 — Modules do one job
One user-job per surface, the way one responsibility lives per module. The split
test transfers directly: do two uses of a surface vary independently (different
jobs — split) or only together (one job — keep)? The dual-role "work" is the
user-facing version of the "and" smell — when one capability description needs an
*and* to be true (*dispatch the board* **and** *do the jobs*), it is usually two
jobs glued to one card, here in the user's mental model rather than in the code.
The signal that you've glued two jobs together is usually a single label
straining to cover both; the antidote is to give each job its own surface (or at
least its own clearly-named mode), so neither has to pretend to be the other.

### #7 — Clean boundaries, owned state
A **role is a real boundary**, and the persona/role model is the single place
"who does what" is authored. When each screen re-derives "is this person an admin
or a tech?" from whatever's handy — a flag here, a permission check there, an
inferred default elsewhere — the same fact lives in several places and drifts.
Define the roles and their jobs once; every surface reads that model rather than
re-inventing a local notion of the user. A screen that needs to *re-decide* who
the user is, instead of *reading* it from the owned role model, is reaching
across the boundary — the same single-source violation this principle names,
expressed in personas.

### #10 — Explicit exclusions over vague coverage
"For everyone" is the user-facing hand-wave this principle forbids. A finished
product decision names **which users and jobs are out of scope, and why** — a
non-user is a real design decision, not an oversight. JTBD makes this concrete:
the jobs you are *not* serving are stated ("we don't serve the dispatcher's job
here, because this surface is the technician's"), and an exclusion that might
return names its re-entry condition ("not the admin's job yet; revisit when a
single user holds both roles"). Naming the non-user sharpens the job you *are*
serving; "works for any user" usually means it was designed for none.

### #12 — Surface conflicts, never resolve silently
An **overloaded domain term is a surfaced conflict waiting to be named**. When
"work" means *the board I dispatch* to one role and *the jobs I personally do* to
another, the word is silently resolving a conflict — and shipping it lets one
term mean two things, drifting the whole product around the ambiguity. The
discipline is the same as for two disagreeing decisions: stop, name the collision
out loud ("'work' is carrying two jobs"), and force the split — two terms, or one
term with an explicit role qualifier — recorded so it stays split. The glossary
of *what each key word means to whom* is where that resolution lives durably; an
un-audited domain vocabulary is where collapsed roles hide.

## Addenda

### The job statement, and how to write one
A job is stated as **progress + circumstance**, not as a feature or a
demographic: *"when I'm mid-route between calls, help me see only the jobs
assigned to me, so I don't waste a stop on someone else's ticket."* The form is
`when [situation], I want to [motivation], so I can [expected outcome]`
(Ulwick/Christensen lineage). The discipline of writing it this way is that it
*cannot* be satisfied by naming a feature — it forces the circumstance and the
outcome into view, which is exactly where the dual-role split tends to reveal
itself. If two plausible job statements both claim the same surface, that surface
is serving two jobs (see #6).

### Personas and roles — and the user who is more than one
A persona is a named, durable model of a user's goals and context, not a
demographic sketch; its job is to be *re-read before feature work* so the
slowdown fires by construction rather than by luck. The case this lens exists to
catch is the **multi-role / dual-role user**: one human who, in different
circumstances, is doing different jobs. Model the *roles* and the *jobs*, and let
a person map to more than one — rather than treating "the user" as a single
undifferentiated actor. The dispatch-admin who is also a field technician is one
user and two roles; the product that models them as one role will reach for a
filter (see #2) exactly where it should have reached for a role.

### The overloaded-term audit
Before building, run the key domain nouns past a single question: *does this word
mean the same thing to every role, in every circumstance?* "Work," "job,"
"account," "owner," "team" are the usual offenders — each tends to mean one thing
to the person who *administers* and another to the person who *operates*. A word
that fails the test is not a naming nitpick; it is a structural signal that two
jobs or two roles have been collapsed onto one axis (#12), and the cheapest
moment to split them is before the mechanism is built around the collapsed term.


<!-- ───── pairing: svelte ───── -->
<!-- GENERATED-BY: pairings/bundle.sh -->

# Pairing: Svelte

- **Pairs with:** Svelte the language and compiler (versions 3–5, with the runes-based reactivity model as the canonical model in Svelte 5). Component-authoring concerns: reactivity primitives, props, snippets, lifecycle, scoped styles, transitions, actions, component-level state.
- **Sources:** Svelte documentation, svelte.dev/docs/svelte (ongoing); Rich Harris, *Rethinking Reactivity* (You Gotta Love Frontend, 2019) and *Computer, build me an app* (JSConf EU, 2018); Svelte 5 runes announcement (2023) and migration guide; opinion.
- **Date:** 2026-05-27
- **Touches principles:** #4, #5, #6, #7, #8

Svelte compiles components to imperative DOM operations rather than diffing a virtual DOM at runtime. That shifts where the work lands: more decisions move to author-time and compile-time, fewer to render-time. The principles below show where Svelte's compilation model and reactivity primitives change how axes get drawn. This pairing covers **the component language only** — framework concerns (routing, load, adapters, hooks, env) are out of scope.

## Per-principle commentary

### #4 — Engines handle every possibility

A Svelte component's engine surface is its props (declared via `$props()`), its bindable props (declared via `$bindable()`), its event callbacks (declared as props of function type), and its snippets (declared as props of `Snippet` type, including the implicit `children` snippet). The full range includes: the prop defaults, the absent-optional-prop case, the all-props-supplied case, every snippet absent and every snippet present, every callback fired and not fired. A component that renders correctly only when every prop is supplied has a narrower range than its API claims. Use TypeScript prop types on the `$props()` destructure to make the range explicit at the boundary.

The range also includes reactivity edge cases the compiler models for you and the ones it doesn't:

- A `$derived` of a `$state` that is later reassigned to a new object is tracked. A `$derived` over a deep property of an object that is mutated in place but not reassigned needs `$state` on the inner reference (or `$state.raw` if you're intentionally opting out of deep proxy).
- An `$effect` reads dependencies *synchronously*. Anything after `await` or inside `setTimeout` is not tracked. The "I expected this to re-run" bug is almost always this.
- An `$effect` returns a teardown function that runs before re-execution and on destroy. A component that allocates a resource in `$effect` and forgets the teardown leaks across re-runs.

### #5 — Instructions don't extend engines

Parent components communicate through the child's declared surface — props in (including callback props for events and snippet props for content), bindings via `$bindable()` for explicit two-way grants. Reaching past that surface — binding a DOM element ref and reading the child's internal state through it, importing a `.svelte` file's non-exported function, mutating a prop the child did not declare bindable — is the same coupling violation as monkey-patching in any other framework. If the parent needs something the child doesn't expose, the child is missing a capability — add the export.

`$bindable()` is the explicit grant of mutation rights. It is *not* the default; props are read-only unless the child declares them bindable. Treat unbindable state as the child's owned state. The same applies to snippets: the parent renders the snippet (`{@render children()}`), it does not reach into the snippet's lexical scope.

### #6 — Modules do one job

A `.svelte` file does one job: render one piece of UI with the state and behavior that piece needs. A file with three `<script>` blocks of mixed concerns, ten `$state` declarations spanning unrelated domains, and a 200-line `<style>` block is three components glued together. Split by responsibility, not by line count, but treat anything past ~300 lines as a smell worth a second look.

`.svelte.js` / `.svelte.ts` modules (the convention for using runes outside component contexts) follow the same rule: one module = one job. A `state.svelte.ts` grab-bag that exports five unrelated reactive objects is the canonical anti-pattern — the file's job becomes "everything reactive" instead of one named thing.

Snippets are the right unit for "this markup pattern repeats inside this component but isn't a separate component." A repeated markup block that would have been a snippet is the within-component analog of a copy-pasted function body.

### #7 — Clean boundaries, owned state

Svelte 5's reactivity primitives carry ownership semantics that the principle leans on:

- **`$state`** is owned by the component (or module) that declares it. Mutations from outside that boundary are explicit grants — `$bindable()` for components, `export`ed setter functions for modules. Uninvited mutation is a violation.
- **`$state.raw`** opts out of deep reactivity. Use it for state where deep proxying would be wasteful (large arrays you reassign rather than mutate, immutable data shapes) — but be explicit about the trade-off.
- **`$derived`** is read-only by contract. Computed views over state belong here, not in `$effect` blocks that imperatively assign. A derived value is a function of its inputs; if you reach for `$effect` to compute it, you've drawn the wrong boundary.
- **`$effect`** is for synchronization with the outside world — DOM APIs the compiler doesn't model, timers, network, third-party libraries. It is not the right tool for reactive computation. The `$effect.pre` variant runs before DOM updates (use for autoscroll, pre-render measurement); `$effect.root` creates a manually-controlled scope for effects outside component initialization.

A common anti-pattern: `$effect(() => { doubled = count * 2 })`. That is `$derived(count * 2)`. If you find yourself using `$effect` to assign a `$state`, you have almost certainly drawn the wrong boundary — the value is derived, not synchronized.

For derivations that don't fit a single expression — multiple statements, branching, accumulator loops — use `$derived.by(() => { ... })`. It accepts a function and is read-only by the same contract as `$derived`. Reach for it when an expression would be a contortion; do not reach for `$effect` to assign a `$state`.

### #8 — Architectural consistency

Three areas where Svelte projects accumulate scattered parallels:

- **Reactivity model.** Pre-Svelte-5 reactivity (`let x = 0` with implicit reactivity, `$:` for derived, `export let` for props) and Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) can coexist during migration, but a finished codebase should be on one. Enforce runes mode globally via `svelte.config.js` `compilerOptions.runes: true` so the compiler rejects mixed files. Files mixed across both models force every reader to know the rules of each.
- **State scope.** Component-local `$state`, module-level `$state` in `.svelte.ts` files, and context (`setContext`/`getContext`) are three different scopes for stateful data. Pick which scope owns which kind of state and hold it. Per-instance state belongs in components; per-app singletons belong in `.svelte.ts` modules; per-tree state that depends on which subtree you're in belongs in context.
- **Snippet vs component.** Repeated markup with shared scope: snippet. Self-contained reusable UI unit with its own surface: component. The two are not interchangeable — using a component where a snippet would do scatters the state model; using a snippet where a component would do leaks the host's internals.

## Addenda

### Compilation moves decisions earlier

Svelte's compile-time model means certain mistakes surface earlier than in runtime-VDOM frameworks: unused `$state` warnings, accidental shadowing, unknown component imports, malformed reactive declarations, missing snippet renders. Treat compiler warnings as errors in CI; suppressing them ("we'll fix it later") accumulates the same dead wiring the compilation model was supposed to prevent.

The compiler produces meaningful sourcemaps. When debugging, step through the compiled output once or twice to build an intuition for what the framework actually does — the abstraction is leakier than React's because there is less runtime between author code and DOM operations.

### Snippets replace slots

Svelte 5 deprecates slots in favor of snippets. Migration shape:

- `<slot />` → `{@render children?.()}`
- Named slot `<slot name="header" />` → `{@render header?.()}` reading `header` from `$props()`
- Slot props (`<slot {value} />`) → snippet parameters (`{#snippet item(value)} ... {/snippet}` then `{@render item(value)}`)

For mechanical slot-to-snippet rewrites in a Svelte-4 codebase mid-migration, `npx sv migrate svelte-5` does most of the work. Treat it as a starting point — review its output for snippet-identity regressions and missed `let:` directives before merging.

Snippets are values: they can be passed as props, stored in `$state`, returned from functions. That makes them more flexible than slots, but also makes "snippet identity" a concern — a parent that re-creates a snippet on every render forces the child to re-render content that didn't conceptually change.

### Scoped styles and `:global()`

Svelte's `<style>` block is scoped to the component by default. The compiler rewrites selectors to target component-owned elements and elides unused rules. Two consequences:

- A selector that targets a child component's internal DOM gets scoped to the parent and matches nothing. Use `:global(...)` to opt out of scoping, but treat that as a coupling violation against the child's surface — the child should expose a styling hook (a class prop, a CSS custom property contract) instead.
- Unused selectors are dropped silently. A class name typo in markup gets a "unused CSS selector" warning; suppress it at your peril.

CSS custom properties (`--name`) pass through component boundaries cleanly; they are the canonical mechanism for "let the parent theme the child" without breaking style scoping. The child declares the custom properties it reads; the parent sets them.

### Transitions, actions, and the imperative escape hatch

Three places where Svelte exposes imperative DOM control through a declarative surface:

- **`transition:`** declares an animation tied to mount/unmount. The transition function returns CSS or a tick callback; the compiler wires it to the DOM lifecycle. Same engine-range thinking applies — what does this transition do when interrupted, when `prefers-reduced-motion` is set, when the element re-mounts under a different key?
- **`use:`** (actions) gives an imperative function access to the bare DOM node on mount, with optional update and destroy callbacks. Use it for integrating libraries that demand a DOM ref (focus traps, sortable lists, charting libraries). The action owns the side-effect; the component owns the slot it lives in.
- **`bind:this`** captures the DOM ref directly. Necessary for measurement, focus, and integration; a smell when used for state the compiler should manage.

Each of these is the right answer when the declarative model genuinely can't express the requirement. Each is the wrong answer when used to avoid learning the declarative model.

### The store contract is a public API (legacy)

A store exported from a `.ts` module (`writable`, `readable`, `derived` from `svelte/store`) is part of that module's public surface. The same is true of an exported reactive object from a `.svelte.ts` module. Changing the store/object shape — renaming a field, narrowing a type, changing the update semantics — breaks every subscriber. Treat shape changes the same as breaking function-signature changes: dated decision, supersede chain, callers updated in the same PR.

Stores from `svelte/store` are legacy in a runes-mode codebase. New shared state belongs in `.svelte.ts` modules using `$state`. Stores remain useful for interop with non-runes code and for cases where the subscription model (versus the proxy-based reactivity of `$state`) is a better fit (RxJS-style streams, observables).

### Legacy `$:` ambiguity

In pre-Svelte-5 code, the `$:` label has two uses that look the same and behave differently:

- **Derivations:** `$: total = items.reduce(...)` — a pure computation, re-runs when dependencies change.
- **Effects:** `$: console.log(total)` — a side effect, re-runs when dependencies change.

The Svelte 5 split into `$derived` and `$effect` makes the distinction syntactic. In legacy code (or code mid-migration), the ambiguity hides bugs: a derivation that secretly mutates external state, or an effect treated as a pure value. When auditing reactivity, classify each `$:` line as one or the other before changing anything.

<!-- ───── CLAUDE-OPERATING-MANUAL-SLIM.md ───── -->

# Claude Operating Manual (Slim)

How you (Claude) operate inside one of my projects.

## File hierarchy

Five layers, read in order. More specific wins on conflict.

1. **`PERSONAL-PRINCIPLES.md`** — cross-project design philosophy.
2. **`INTERACTION-STYLE.md`** — cross-project communication style.
3. **Pairings** — domain specializations. Additive only; selected in `PROJECT-SCOPE.md`.
4. **`PROJECT-SCOPE.md`** — this project's constraints, priorities, out-of-scope.
5. **This manual** — runtime protocols. Project scope can override by name.

Conflicts: project scope > pairings > principles > manual defaults. Name the conflict (Principle 12).

## Session start

1. Read `PROJECT-SCOPE.md` **down to the `## Reference` marker only** — the session-read core (active milestone, hard constraints, out-of-scope, rubric, check-in mode); the reference tail below is **not read at session start** (D-0072 precedent), open on demand. If it names pairings, load them via `dotagent_get_pairing`.
2. Read `.agent/PROJECT-STATE.md` if it exists — the **current state**. Rotated historical narrative lives in `.agent/PROJECT-STATE-HISTORY.md`, **not read at session start** (D-0072).
3. Glance at `.agent/CHECKINS/` for pending questions.
4. Glance at `.agent/REPORTS/` root — undispositioned reports are open work (a dispositioned report is archived to `ARCHIVED/`; the root directory is the inbox).
5. Glance at `.agent/DECISIONS/RECENT.md` — derived session window (newest ~15 rows + all `Status: Proposed`), engine-emitted on every decision-log write; full index `README.md` on demand (canonical, audit-owned).
6. Glance at `.agent/IDEAS/` if present — raw pre-decision idea inbox, one file per idea (background, not a to-do).
7. Read `.agent/ROADMAP.md` if present — the **active frontier** (Active/Loose/Backlog) of the work-structure tree (milestone → task + `depends:` edges, per D-0050); the active milestone's task tree is the plan. `.agent/TODO.md` is its **derived** ready-frontier (the live "work the queue" obligations — `## Now`, top-down); never hand-edit TODO, it regenerates from ROADMAP via `roadmap-render.sh`. Shipped history is in `.agent/ROADMAP-SHIPPED.md`, **not read at start** (the renderer still reads it for done-resolution).
8. Surface contradictions between the request and scope before starting.

## Pull the full canon for consequential work

This file is a **slim projection** of the operating discipline — summarized
to stay lean (D-0040/41). For routine work it's enough. For **consequential
work** — architecture, scope changes, governance, anything you'd file a
DECISION for, or whenever the slim text feels thin — pull the full canon
*first* via `dotagent_get_principles` and `dotagent_get_manual_section` (and
`dotagent_get_pairing` for a selected pairing), then proceed. The full
discipline is one MCP call away; don't operate on the digest when the
decision matters (DECISION-0044, raise-the-floor).

## Check-in protocol

The criticality rubric in `PROJECT-SCOPE.md` decides halt vs continue.

- **Critical:** hard-stop, write concern, wait for user.
- **Material:** continue independent work, avoid downstream of the unresolved issue.
- **Minor:** note in passing, keep working.
- **No rubric yet:** hard-stop on scope/architecture/data-shape; continue on everything else.

## Verification protocol

Reported work is an input, not evidence (Principle 13).

- Before marking done: point to the file, line, or observable behavior.
- Subagent summaries describe intent, not outcome — verify at source.
- A green claim names the real artifact the real path consumes (not a stand-in) and shows *that* artifact exercised on that path — a check that skips the failing path is false confidence, not evidence.
- **Premise gate at dispatch:** before briefing a lane on a task line, verify that line's load-bearing premise **at source** (for "build X", that X doesn't already exist) and cite what was verified in the brief. **The premise is not only factual — it is also whether the thing is already ruled:** name the surface the task touches and check what governs it, because a task can be perfectly accurate about the code and still contradict a Binding decision (2026-08-10: a brief added provider flags a decision had ruled out of that layer three weeks earlier; the flags genuinely didn't exist, so every factual check passed). That is D-0113's question asked one step earlier. A board line is a claim *about* the code; a stale one has already produced briefs ordering lanes to rebuild shipped, tested code — Principle 18 triggered by a stale board rather than a human, and invisible to the pre-commit removal gate, which reads diffs, not briefs. A false premise goes back to the board, not into the brief (D-0106 part 4).
- 2nd identical failure, no information gain: stop theorizing, instrument the real path (Principle 17).
- Milestone completion requires demonstrating definition-of-done, not a roll-up.
- **No join closes on a roll-up (D-0114).** The anti-roll-up rule above is the milestone-scoped case of a general one: N lanes each green against its own brief is a claim about N briefs, not about the assembled result. Every join demonstrates the thing itself — the `Exit:` fact or the observable behavior — because a lane's reported greenness is an input, not evidence (Principle 13).
- **Lane disjointness is an output, not an objective (D-0114).** It falls out of cutting along the axes the vision actually has (Principles 1/6), and it is a diagnostic on that cut: lanes that will not come apart cleanly mean the axis is wrong. When disjointness and coherence appear to trade against each other, re-cut along the axis — never isolate harder, and never accept a seam nobody owns. A decomposition chosen for scheduler convenience ("what can four lanes do at once") is out of order by construction, however cleanly it parallelizes.

## Scope change protocol

- Out-of-scope work or hard-constraint violation: hard-stop and ask.
- Scope changes: append to `PROJECT-SCOPE.md` with date. Don't edit history.

## Prior-art gate (before scoping)

Before starting any scoping-class artifact — a scope, prescope, design doc, decision draft, or architecture proposal — **sweep the repo's own record first**, and **every decision is scoping-class** (D-0113 amending D-0100).

The sweep is **surface-anchored and read whole**, not keyword-grepped:

1. **Name the surface** the artifact changes — the thing future work will touch, not the words the request happened to use.
2. **Read the whole title list** (`decision-log list`) plus `.agent/REPORTS/` (root + `ARCHIVED/` filenames). A keyword grep only finds what you already thought to call it; the corpus rarely uses your vocabulary for your problem.
3. **Cite what the sweep found** in the artifact's `## Prior art` — including an explicit "no prior art found" when empty. The sweep that finds nothing is recorded exactly like the one that finds five.

Two enforcement points, deliberately asymmetric: an advisory `scoping-without-prior-art` drift check while drafting, and a **blocking gate at `decision-log.sh ratify`** that refuses the silent skip and asks what surface the decision changes and what already governs it. Drafting stays advisory; ratification is the gate.

The same sweep is the conversational reflex — "should we scope X?" is answered by sweeping first, not by a fresh scoping offer.

## Conflict resolution

- User request vs scope: name it, ask which wins, write resolution.
- Personal vs project principle: project wins; say so.
- Pairing vs principle: bug in pairing — revise or escalate to scope.
- Two pairings: surface, force choice in scope. Don't silently merge.
- Memory vs file: file wins. Update memory.

## State persistence

State lives in files (Principle 14). Decisions go in `.agent/DECISIONS/`. Progress uses task tools. Cross-session facts use memory. Nothing important exists only in chat.

Raw, pre-decision ideas go in `.agent/IDEAS/` (the idea inbox, one file per idea — a folder with `ARCHIVED/`, parallel to CHECKINS/REPORTS, per D-0028) — one axis: *unratified ideas*. Not the ROADMAP (ratified/sequenced work-structure), not CHECKINS (blocking questions). An idea isn't a commitment; record design forks, don't resolve them. When ratified, an idea graduates to a `DECISION-NNNN` + a ROADMAP task/scope entry, gets a pointer appended, and is **moved to `IDEAS/ARCHIVED/`** (archived, not deleted) — never goes straight into the ROADMAP. Created on demand, not required at bootstrap.

Ratified, sequenced work-structure goes in `.agent/ROADMAP.md` (canonical, per D-0050) — one axis: the **milestone → task tree** with `depends:` edges (the task→task dependency primitive), a `## Loose` bucket (milestone-less one-liners), a `## Backlog` (future/parked work — absorbs the old "remaining candidates" + the dissolved STATE §4 deferrals), and `## Shipped` history. Work-unit = **task** (dotagent-native, not a heavyweight "slice"); the `depends:` edge has one home here (never duplicated). `.agent/TODO.md` is the **derived ready-task frontier** — generated by `roadmap-render.sh`, never hand-edited: `## Now` = ready (deps met), `## Next` = blocked, `## Parked` = Backlog; each line cites its task. To change the queue, edit ROADMAP and re-render. (Projects not using ROADMAP may hand-author TODO as the flat D-0035 queue.) Lifecycle rules: Material work may ship while its decision is Proposed **only** with a same-commit `ratify D-NNNN` task (Critical still pre-ratifies); every report finding gets a disposition (fixed | queued | idea'd | dismissed-with-reason) in the report file (D-0036); and **session end is the sync boundary (D-0110, superseding D-0037)** — code commits flow freely; the `.agent/` delta is reconciled once per session by the end-of-session sweep (`recipes/button-up-project.sh`). Same-commit deltas are a demoted convention, welcome when natural, never mandated; `githooks/pre-commit` warns only. `delegate finish` still requires a tracking delta before a worktree branch lands (D-0101 part 2).

## Governance vocabulary boundary

Governance and code are orthogonal axes (D-0042). Decision IDs (`D-NNNN`, `DECISION-NNNN`), `.agent/` paths, and the tracking filenames `PROJECT-SCOPE`/`PROJECT-STATE`/`ROADMAP`/`TODO.md` are tracking-surface language — they **never appear in source code comments or runtime strings**. Code comments explain *what the code does and why* in domain terms (not "out of scope per D-0001" but the actual domain reason). Traceability points one way: a DECISION's Consequences cites the code; the code never cites the decision back (citing it couples the axes and rots on supersession). Sole exception: a project whose domain *is* this governance system (dotagent itself). Enforced warn-only by `githooks/pre-commit`, which flags a staged non-`.md`/non-`.agent/` file that introduces these tokens.

## MCP tools

**Markdown is canonical for decisions (D-0010, D-0027); the MCP db is a derived read index, never committed (`*.db` is gitignored).** For **reads/queries**, prefer MCP tool calls when connected — fast structured index over the markdown (decision lookups, authority map, drift, context). For **writes**, decisions go only through `decision-log/decision-log.sh` (or the panel, which shells out to it) — that does the three-surface markdown sync (file + index + PROJECT-STATE). The MCP write tools are not a canonical write path and redirect to `decision-log.sh`.

If the MCP server is unavailable, fall back to reading markdown directly:
- Decisions: `.agent/DECISIONS/DECISION-*.md`
- Authority map: `.agent/PROJECT-STATE.md` §1
- Decision index: `.agent/DECISIONS/README.md`
- Pairings: **not project-local** — `dotagent_get_pairing` serves them from
  the dotagent install's `pairings/<name>.md`. With no MCP and no inlined
  pairings, a slim project has no local pairing text; re-publish with
  `bootstrap-project.sh --publish --inline-pairings` for a self-contained
  CLAUDE.md instead.

## Multi-agent isolation

When more than one agent may touch a repo, one worktree per writing agent (D-0043). An agent that *writes* works in its own `git worktree` on its own branch; the primary checkout (`~/Projects/<repo>`) is never an agent's edit surface (read-only reference only). **Pre-flight (hard precondition):** before the first edit, run `git worktree list` + `git branch --show-current` + `git log --oneline -5`; if the checkout is on a feature/agent branch or shows active work, don't edit it — `git worktree add -b <branch> <path> HEAD` and work there. `git worktree list` is the self-maintaining coordination record — no hand-kept registry (it would drift, Principle 7). Integration is explicit: a writing agent commits only on its own branch and never self-merges to main; the human or a PR integrates. Prefer the harness's `isolation: "worktree"` on spawned write agents.

## Automated / non-interactive workflows

- Same file hierarchy applies. Read scope before acting.
- "Continue parallel" for material issues — halt only on critical.
- Write check-in concerns to decision files for post-run review.
- Do not silently broaden scope (Principle 11).
- **Never end a turn to passively "wait."** Harness-tracked background work (spawned agents, hooks, scheduled wakeups) re-invokes you automatically — so don't narrate "waiting"; end on other useful work and you'll be woken. Untracked work (a suite/build/command started in-turn, external CI, a remote queue) must be *driven to completion in-turn* — run it synchronously and read the result, or poll/re-check — before ending; if you truly can't finish in-turn, hand back a concrete runnable next step, never a passive "waiting for X." A turn that ends "waiting" for something nothing wakes is a stalled thread wearing a progress report. Bake this into delegate/worker **dispatch prompts**: workers run verification to completion and report the *observed* result, never end-turn-to-wait.

## Extended reference

For detailed documentation on pairings, composition, cold-read inspection, scope elicitation, and pairing proposals, use `dotagent_get_manual_section` or read the tool READMEs directly.


