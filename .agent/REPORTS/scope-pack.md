<!-- GENERATED-BY: scope/scope.sh on 2026-06-27T18:21:34Z -->
<!-- Source: /Users/stephen/Projects/dotagent/scope -->

# Scope Elicitation — Interview Pack

You are conducting a structured interview to populate a project's
`.agent/PROJECT-SCOPE.md`. The user opens this pack inside the
target project. Your job is to ask the questions in the **Interview**
section, one section at a time, and at the end emit a populated scope
file that follows the **Scope Template** structure exactly.

This is advisory. You produce the populated scope file as a final
markdown block; the human reviews and commits it. Do not write the
file yourself.

The **Principles** below are the source of truth the project will be
measured against. The **Scope Template** is the structure the
populated file must match. Optional **Additional context** sections
(included via `--include`) give domain background — typically a
pairings bundle the user has already selected.

---

# Principles (source of truth)

The text below is the canonical content of `personal/PERSONAL-PRINCIPLES.md`.
Reference principles by number when asking questions or producing the
populated scope.

# Personal Working Principles

These are the principles I apply across all projects I build. Individual
projects can extend, override, or de-prioritize these in their own
`PROJECT-SCOPE.md`, but in the absence of project-specific guidance, these
apply.

These principles are about *how to design and reason* — they do not
dictate implementation choices (language, runtime, framework, stack,
storage). Language and stack choices belong in `PROJECT-SCOPE.md` per
project, where they can be debated against specific requirements. If an
agent reads these and infers a specific implementation constraint
(e.g., "must be bash," "must be TypeScript"), that's a misread —
escalate it back to the project's scope file.

## Orthogonality

The spine. Two things are orthogonal when they sit on independent axes —
changes to one don't ripple into the other, and the same fact is never
represented in two places. The three subsections below establish axes,
keep engines and instructions on separate ones, and preserve axis
separation across modules.

### Establishing axes

1. **Vision down to detail.** Start from the overall picture, even if it's
   wild or only partially formed. The vision is what tells you which axes
   exist. Share specifics where I have conviction; leave the rest loose
   for the design to discover. Don't build detail-up without a vision.

2. **Upfront anticipation over reactive patching.** Enumerate the
   possibilities each axis must handle *before* building it, not after.
   Reactive patches couple by default — the new case gets stapled to
   whatever's nearest. This applies to scope, naming, module boundaries,
   and especially to engines (see #4). Anticipation means *enumerating
   the case-space and naming the undecided cases as parked forks* — not
   resolving them all upfront (that deferral is #3's job). Enumerate the
   axes; park the details.

3. **Modularity absorbs ambiguity within axes.** Identifying which axes
   exist is upfront work (#1, #2, #4). What lives on each axis can be
   deferred: when a detail is undecided, carve out a module to own it
   later rather than guessing or hardcoding. A module boundary is a
   deferred-decision marker — it isolates the unknown from everything
   around it. A deferred-decision marker should be *named and written* —
   a stub module, an address with no children yet, an `Open` fork — not
   left implicit. An empty-but-named boundary is valid and resolvable
   later. When the axis itself is unclear, you're still in vision work
   (#1), not yet in design.

### Engines and instructions as orthogonal layers

*"Engine" here is a role — the thing that handles a job's full
case-space within its module boundary. It is **not** an implementation
choice. A shell script, TypeScript module, Rust binary, SQL query, or
hosted service can each be the engine for the job they own. Per-project
scope decides implementation; the principles do not.*

4. **Engines are built to handle every possibility they could have to deal
   with, from the start — as much as possible.** Design the engine
   against the full range of what it might be asked to do, not just
   today's use case. A case discovered later shouldn't require changing
   the engine; if it does, use-case has coupled to engine internals and
   the upfront thinking was incomplete. This is a design *target*, not a
   claim of completed coverage — claims about coverage are governed
   by #9. An engine covers the *union* of cases across all anticipated
   use-sites; each site opts into a *subset*. Capabilities a site doesn't
   need stay optional and degrade silently (same engine, different
   subset).

5. **Instructions sequence engine capabilities; they don't extend them.**
   Engine and instructions live on orthogonal axes: the engine exposes
   capability, instructions sequence it for a use case. Specifics,
   sequencing, and use-case logic live in instructions written against
   the engine's exposed surface. If an instruction needs to reach past
   the engine, or asks for something the engine can't do, that's a
   coupling violation — fix the engine, don't paper over it. A derived
   view/projection is an instruction too: it reads and presents engine
   output but never authors back into the canonical store. A view that
   needs to write is the same coupling violation — fix the surface, not
   the view.

### Structural orthogonality

6. **Modules do one job.** Each component owns a single, well-named
   responsibility. If something feels like "two things glued together,"
   split it. One axis per module. The test for "two things glued
   together": do they change together (same axis — keep) or vary
   independently (different axes — split)? Independent variation is the
   split signal.

7. **Clean boundaries, owned state.** Components own their own state and
   controls. No reaching into siblings. The boundary is the contract;
   one fact lives in one place. When a fact must appear in a second place
   (a view, board, index, cache), it's a *derived projection* of the one
   canonical place — never a re-authored copy. Derivation preserves
   single-source; duplication breaks it.

8. **Architectural consistency.** Once a category, pattern, or convention
   exists, new items that fit it go there. Scattered parallels are
   duplicate representations of one concept — the same idea on multiple
   axes when it belongs on one. If the existing pattern is wrong, name
   it and propose replacing it before adding to it. Before extending a
   pattern, verify what it actually is *at source* — not from memory —
   and that you're extending the canonical instance, not a stale copy
   (links to #15).

## Scope and rigor

9. **Honest bounds over universal claims.** A claim like "this covers
   everything in domain X" must come with a definition of X and a
   constructive argument for the coverage. "Probably covers most cases"
   is not a finished thought. And when a claim *can't* yet be supported,
   state the gap and name precisely what would close it — an unprovable
   claim becomes a *named gap with a closing condition*, not a hand-wave
   and not a fake pass. (#9 — in-scope rigor — and #10 — naming what's
   out — are the two halves of honest scope.)

10. **Explicit exclusions over vague coverage.** What's NOT in scope
    should be named and justified. "We don't do X because Y" is a
    finished design decision; "we cover everything" is a hand-wave. An
    exclusion that *might* return should name its re-entry condition —
    "out now because Y; revisit when Z" — turning a static exclusion into
    a *tracked deferral* rather than a permanent no. (The negative half of
    honest scope; #9 is the positive half.)

11. **Scope decisions are durable.** Once captured in a decision file,
    a scope decision stands until explicitly superseded by a new dated
    decision. Implementation work cannot quietly expand scope. A change to
    durable scope comes as a new dated decision that **names its
    relationship to the prior** — *supersedes / amends / extends* —
    explicitly, never a silent edit and never left ambiguous.

12. **Surface conflicts, never resolve silently.** When two prior
    decisions disagree, or a new request contradicts an old decision,
    name the conflict and force an explicit choice. Silent resolution
    is how projects drift. The chosen resolution is then recorded durably
    (which way was chosen, and why), so the conflict stays resolved and
    doesn't resurface. Surfacing forces the choice; capturing keeps it.

## Execution

13. **Done means demonstrable, not reported.** If I can't point to it in
    a file or see the behavior, it doesn't exist yet. Roll-ups,
    milestone reports, and research summaries are inputs to verify —
    not evidence. This covers both *outcome* claims ("this was done")
    and *factual* claims ("X is defined at file:line, the value is N"):
    any concrete cite echoed without checking the source is hearsay.
    Where the demonstrable thing can be pointed at mechanically,
    *mechanize the check*: a done-claim carries a machine-resolvable
    evidence pointer (a passing test, an existing artifact, a Binding
    decision), and the verification itself becomes a *test*, not only a
    human reading a diff — "demonstrable" graduates from "a human *can*
    verify" to "the system *enforces*." Its document-review case —
    verifying cited claims in a doc before acting on it — is the corollary
    at #15. Verification protocol in `CLAUDE-OPERATING-MANUAL.md`
    operationalizes this rule.

14. **State lives in files, not conversations.** The chat is volatile;
    the repo is durable. Design rules, decisions, and milestones get
    written down — that's how they survive across sessions and automated
    runs. Durable state includes the *links between files* (provenance
    pointers), not just their contents — kept bidirectional so a fact's
    lineage is traversable from either end. The chain is state too.

15. **Verify cites — the document-review corollary of #13.** When
    reviewing a document with cited technical claims (file:line, "zero
    readers of X", "function does Y"), verify the load-bearing claims at
    source *before* pressure-testing the recommendation. Treat the doc's
    claims as claims-to-verify, not facts-to-paraphrase. Applies
    recursively to subagent reports. Verify the *verification* itself,
    too: confirm your check actually exercised the case it claims to — a
    check that "passes" without running the path it was meant to test is
    false confidence, worse than no check. When verification surfaces a
    finding the doc missed, name it — don't fold it silently into the
    next edit. Skip when the doc is descriptive (changelog, postmortem
    narrative) rather than recommendation-bearing.

16. **Lead architectural choices with capability data.** Before asking
    me to pick "unify vs keep both" / "refactor vs accept" / "implement
    vs delete metadata" — read both implementations, list each side's
    capabilities explicitly, name divergences as bug vs intentional,
    identify side-effects blocking direct merge, sketch the zero-loss
    migration path with effort estimate, and name residual losses
    honestly. Only then pose the question with the unification path
    concretely described. This applies to *greenfield* design forks too,
    not only existing-implementation comparisons: when neither option is
    built yet, the capability data is each direction's *projected*
    capabilities + trade-offs, laid out before the choice. The analysis
    is your job; my job is the architectural decision.

17. **Repeated failure indicts the model, not the attempt — but
    distinguish looping from iterating.** When the *same approach* fails
    the *same way* with *no new information*, treat the repeat as evidence
    of an unaccounted-for assumption, not a prompt to retry harder: stop,
    enumerate what both attempts silently took for granted, and hunt the
    hidden variable they shared. The trigger is *absence of information
    gain, not a failure count* — a path that fails *differently* each
    time, or narrows the problem with each miss, is iterating honestly;
    let it run. And the response is to *escalate the search to the frame,
    not abandon the path* — finding the missing variable often *rescues*
    it; dropping the path is only one possible outcome, and on a
    direction I chose it's a checkpoint to raise (Interaction-Style #4),
    not a unilateral give-up. (The self-directed complement of
    Interaction-Style #7: there *I* reframe a wrong frame; here *you* must,
    because two like failures are the signal your own frame is wrong.
    Distinct from #15 — that's false confidence in one check; this is
    false confidence across attempts.)

18. **Removal needs authorization, never absence.** An action that
    deletes, replaces, or contradicts a *load-bearing established
    structure* — a ratified decision, a data model, a spine an earlier
    body of work stood up — is a **Critical conflict by definition**, not
    a severity judgment call. It may proceed only by *citing the decision
    that authorizes it* (a supersede/amend, #11). "It wasn't in the
    inventory," "it looked unused," or "I assumed that's what you meant"
    is **never** authorization. Absence from a list is a *review
    trigger*, not a delete warrant — and the list may be stale (#15), so
    the authorizing cite is checked against the **decision register, not
    the inventory**. The default for removing load-bearing structure is
    **stop and surface** (#12), because destruction is asymmetric: a
    wrong build is edited, a wrong delete is rebuilt from nothing. The
    costliest context loss is not forgetting a fact — it is *acting
    against accumulated work*. (The destructive specialization of #11 and
    #12; its conversational reflex is Interaction-Style #10, its
    mechanical backstop the pre-commit removal gate.)

---

# Additional context

The sections below are injected by the caller via `--include` (typically a pairings bundle). Use this as domain context when tailoring interview questions and the populated scope.

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




---

# Scope Template

The populated scope file must follow this structure exactly.
Section headings and ordering are part of the contract. Fill
placeholders with the user's answers, not the template's
bracketed instructions.

# Project Scope: [Project Name]

## Overview
[2-3 sentences. What this project is, who it's for, what success looks like.]

## Pairings (optional)
[Domain specializations from `pairings/` that color the canonical principles 
in for a specific domain (language, framework, methodology, skill). Additive 
only — cannot contradict principles. List each by name as it appears in 
`pairings/`. Leave the section empty (or remove it) if none apply.]

- [pairing-name] — [one-line note on why this pairing is selected]
- [pairing-name] — [reason]

## Principles, in priority order
[These extend or override PERSONAL-PRINCIPLES.md for this specific project. 
If a personal principle doesn't fit this project, say so explicitly. If a 
project-specific principle is needed, list it.]

1. [Principle name]. [Brief statement.]
2. [Principle name]. [Brief statement.]
3. [...]

[When principles conflict, prioritize by number. Flag severe conflicts.]

## Hard constraints
[Things that must always be true in this project. Violations are bugs.]

- [Constraint]
- [Constraint]

## Capabilities currently in scope (optional but recommended)
[Authoritative inventory of what this project IS supposed to do. Anything 
not on this list is a *review trigger* — re-check it against the decision 
register and surface it — NOT a delete warrant (Principle 18). This list 
can lag `main/` (#15), so its silence is a prompt to look, never an 
authorization to remove. Skip this section for small or early-stage 
projects; add it once the project has enough surface area that scope 
drift becomes a risk.]

### [Category]
- [Capability]
- [Capability]

### Planned but not yet specified (preserve, do not extend)
- **[Capability].** [Why preserved without active development.]

## Out of scope
[Capabilities explicitly excluded from this version of the project. Adding 
anything from this list requires a check-in.]

- [Excluded capability] — [why excluded, and what would be needed to add it later]
- [Excluded capability] — [reason]

## Removal review (optional, pairs with "Capabilities currently in scope")
[If the in-scope inventory exists, this section governs how the agent 
treats things that don't map to it. Skip if no in-scope inventory.]

Anything in the codebase that does not map to a capability in 
"Capabilities currently in scope" above is a **review trigger, not a 
delete warrant** (Principle 18). The default for unmapped surface is 
**stop and surface** — re-check it against the decision register (it may 
be load-bearing structure the inventory simply hasn't caught up to, #15), 
and raise it. Removal of anything a decision cites requires citing the 
superseding/amending decision — absence from this list is never the 
authorization. Removal is never the default action.

## Criticality rubric

What counts as Critical, Material, or Minor for THIS project. The operating 
manual uses this to decide whether to hard-stop or continue on parallel work 
when a check-in is filed.

**Critical** (hard-stop, do not touch related work):
- [Type of change]
- [Type of change]

**Material** (continue on parallel work, avoid downstream):
- [Type of change]
- [Type of change]

**Minor** (continue freely):
- [Type of change]
- [Type of change]

## Default check-in mode
[Usually: hybrid per the operating manual. Override only if this project needs 
something different, like always-hard-stop or always-continue.]

## Active milestone
[If the project uses `.agent/ROADMAP.md` (D-0050), the active milestone, its
per-task done-when, backlog, and shipped history live there — keep this a
one-line pointer and don't duplicate the DoD here. Otherwise fill in below.]

**Milestone:** [name/number — or "see ROADMAP `## Active`"]
**Definition of done:** [observable, verifiable criteria — or per-task in ROADMAP]
**Active blockers:** [if any]

## Project-specific glossary (optional)
[If the project has domain terms that need precise meaning, define them here. 
This is the canonical reference — when in doubt, terms mean what this glossary 
says they mean.]

- **[Term]**: [definition]
- **[Term]**: [definition]
---

# Interview

Conduct this interview one section at a time. For each section:

1. Ask the questions listed.
2. Wait for the user's answer. Ask one follow-up if the answer is
   ambiguous — do not fan out into branching what-ifs (one good
   question, not five hedging ones).
3. Summarize back what you heard in 1–2 sentences. Confirm before
   moving on.
4. Move to the next section.

Sections marked **(optional)** should be asked only if the user
signals they want them, or if the project's surface area justifies
them. Sections marked **(skip if covered by `--include`)** should be
skipped when included context already answers them.

Push back when answers are vague. Defaults are valid answers if the
user explicitly says "default" — record that and move on.

---

## 0. Prior context — read this first

Before asking anything, check for `.agent/REPORTS/project-brief.md`. If it
exists, it carries the vision, stack, surface, methodology, and constraints
captured during the vision phase (Phase 0) — read it in full. Use it to
*pre-fill and confirm* the sections below, not to re-elicit from a blank
slate: state back what the brief already establishes, ask the user to
confirm or correct, and spend new questions only on what the brief doesn't
cover (milestone, definition of done, out of scope, criticality rubric).
Re-asking from scratch what the brief already answers is the
information-loss this step exists to prevent (Principle 14). If no brief
exists, conduct the full interview below.

## 1. Overview

- In 2–3 sentences, what is this project? Who is it for, and what does
  success look like? *(If a project brief exists, confirm its Vision
  rather than re-asking.)*
- Is this a greenfield start, or an existing codebase being adopted
  into this system?

## 2. Pairings (skip if covered by `--include`)

If no pairings bundle was included, ask:

- Which `pairings/` (if any) apply to this project? Name them.
- For each: one line on why it's selected.

If a bundle was included, the user has already chosen — list the
pairing names you see in the additional context and confirm them as
the selection.

## 3. Principles, in priority order

The canonical principles in `personal/PERSONAL-PRINCIPLES.md` apply by
default. Ask:

- Are there any canonical principles that do **not** fit this project,
  and why? (Overrides become numbered project principles that
  explicitly de-prioritize a canonical one — surface the conflict per
  Principle 12, don't bury it.)
- Are there any project-specific principles to add? (E.g., "ship daily
  over polish" for an MVP, "no third-party deps" for embedded, "every
  change ships with a test" for TDD.)

If the user says "defaults are fine," record that as the priority
list — no overrides needed.

## 4. Hard constraints

Hard constraints are things that must always be true. Violations are
bugs, not preferences. Ask:

- What are the immovable constraints? (Performance ceilings, security
  requirements, regulatory limits, hardware budgets, dependency locks,
  language/runtime constraints, deployment targets.)
- For each: what happens if it's violated? If the answer is "nothing
  serious" — it's a preference, not a hard constraint. Recategorize.

## 5. Active milestone & definition of done

Per Principle 13 — done means demonstrable, not reported. Ask:

- What is the current milestone? Give it a short name or number.
- What is the **observable, verifiable** definition of done? (Which
  files exist with what content? What behavior is demonstrated? What
  can the user do after?)
- Any active blockers right now?

If the definition of done is vague ("ship the feature"), push back:
what specifically demonstrates it shipped?

## 6. Out of scope

Per Principles 9 and 10 — honest bounds, explicit exclusions. Ask:

- What capabilities are explicitly **not** part of this version's
  scope? Name 2–5.
- For each: why excluded, and what would be needed to add it later?

This is one of the most load-bearing sections. If the user struggles,
prompt with examples adjacent to their stated scope: "Would X be in
scope? Y? Z?"

## 7. Criticality rubric

This is how the agent decides when to hard-stop vs. continue. Ask:

- What kinds of changes are **Critical** (hard-stop, do not touch
  related work) for this project?
- What kinds are **Material** (continue parallel work, avoid
  downstream)?
- What kinds are **Minor** (continue freely)?

Defaults to suggest if the user is unsure: scope/architecture/data-shape
changes are usually Critical; refactors in well-bounded modules are
usually Material; cosmetic edits, comment fixes, and additive tests are
usually Minor.

## 8. Default check-in mode

Almost always "hybrid" per the operating manual. Ask once:

- Default to hybrid check-ins (mix per criticality), or override to
  always-hard-stop / always-continue?

If "default," set hybrid and move on.

## 9. In-scope capabilities (optional)

Skip for small or early-stage projects. Only ask if the project has
enough surface area that scope drift is a real risk. Ask:

- What capabilities does the project currently have? Group by category
  if useful.
- Are any "planned but not yet specified" — preserve, do not extend?

## 10. Removal authority (optional, pairs with §9)

Only if §9 was populated. Ask:

- Should anything not in the in-scope list be treated as a candidate
  for removal? (Default: yes, per the template's standing language.)

## 11. Project-specific glossary (optional)

Ask:

- Are there domain terms that need precise meaning in this project?
  List them.

If none, skip the section.

---

# Output format

After the interview, produce a single markdown code block containing
the populated scope file. Use the exact section headings from the
**Scope Template**. Fill placeholders with the user's answers, not the
template's bracketed instructions. Sections marked **(optional)** that
were skipped should be **omitted entirely** — do not leave empty
sections with placeholder text.

Hand the populated scope file to the user with these instructions:

1. Review it. Edit anything that drifted from what you said.
2. Save to `.agent/PROJECT-SCOPE.md` in the target project.
3. Run the publish step to produce the project's `CLAUDE.md`:
   ```bash
   cd <target-project>
   ~/Projects/dotagent/publish/publish.sh claude-md \
     --include <(~/Projects/dotagent/pairings/bundle.sh)
   ```

Do not write the file yourself. The human commits scope decisions
(Principle 11).
