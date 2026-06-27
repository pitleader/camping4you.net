# Research: Cloudflare content-storage options for the M3 operator control panel

**Status:** Research (advisory) · **Date:** 2026-06-27 · **Milestone:** M3 (OIDC control panel)
**Question:** Where should the operator-editable site content (rates, hours, rules, contact, notices) live, given a SvelteKit 5 app on `adapter-cloudflare`, a single small park, one operator, infrequent edits, a read-heavy public site, and a stated want for an audit trail?

---

## TL;DR + Recommendation

**Recommended: Git-backed / build-time store.** Keep the typed `$lib/content/site.ts` module that M1/T2 already makes the single source of truth. The control-panel form action validates the edit with Zod, commits it back to the repo (GitHub Contents API), and the push (or a Cloudflare Pages **Deploy Hook**) triggers a rebuild. This is the only option where the **audit trail is free** (it *is* git history — who/when/what diff, revertable), the SEO-critical public pages **stay fully prerendered** (no SSR, no runtime datastore on the hot path), there is **no new data store to secure, validate at runtime, or pay for**, and the content stays the exact typed module the rest of the codebase is built against. The single real cost — a ~1–2 minute rebuild before an edit goes live — is irrelevant for a one-operator brochure site that changes rarely.

**Runner-up: D1 (SQLite).** Switch to D1 when edit immediacy outgrows rebuild latency, when the content must change *without* a deploy, or when you add relational/queryable content (e.g. the deferred tier-C reservations). D1 is the better *runtime* runner-up than KV here specifically because it satisfies the **audit-trail** requirement natively (a `content_versions` history table) and is **strongly consistent** (the operator sees their own edit immediately), where KV is eventually consistent and ships no versioning. KV is the honorable-mention (cheapest, most read-optimized) but you'd be hand-building the audit log it lacks. Durable Objects and R2 are wrong-fit here (see below).

---

## Comparison table

| Option | Consistency | Free tier (2025–26) | Write path latency to "live" | Audit trail | Prerender public pages? | Fit for this workload |
|---|---|---|---|---|---|---|
| **Git-backed / build** | Build-time snapshot (immutable per deploy) | Pages: 500 builds/mo, unlimited static requests | **~1–2 min** (rebuild) | **Free — git history**, revertable | **Yes — fully prerendered** | **Best.** Audit free, no runtime store, SEO-fast |
| **D1 (SQLite)** | **Strong** (single primary) | 5M rows read/day, 100k rows written/day, 5 GB (500 MB/DB free) | Instant | Build it (history table) — easy in SQL | No — content routes become SSR | **Runner-up.** Runtime edits + queryable audit |
| **Workers KV** | **Eventual** (~up to 60 s global) | 100k reads/day, 1k writes/day, 1 GB; value ≤ 25 MB | Instant write, ~secs to propagate | None native — hand-roll | No — content routes become SSR | Good read fit; no audit, stale-read window |
| **Durable Objects** | **Strong**, transactional per object | SQLite-backed DO on Free; storage billing from Jan 2026 | Instant | Build it | No — SSR | Overkill — coordination engine for 1 doc |
| **R2** | Strong (read-after-write for new objects) | 10 GB, 1M Class A/mo, 10M Class B/mo, **zero egress** | Instant | Object versioning, but coarse | No — SSR (or fetch at build) | Only if content is a large blob / media |

Pricing beyond free tier is summarized per-option below; for a single park, **every option stays inside the free tier indefinitely**, so cost is not the deciding axis — operational fit is.

---

## How bindings work in `adapter-cloudflare` (applies to KV / D1 / DO / R2)

All runtime stores are reached the same way — through the `platform` parameter, which carries `platform.env.<BINDING>`. `platform` is **`undefined` during prerender and during plain `vite dev`** unless emulated, which is the crux of the prerender interaction (below).

`+page.server.ts` read (load):
```ts
export async function load({ platform }) {
  // KV:
  const json = await platform?.env.SITE_KV.get('site-content');
  // D1:
  const row = await platform?.env.DB.prepare(
    'SELECT json FROM content WHERE key = ?').bind('site').first();
  return { content: /* parse + Zod-validate */ };
}
```

Form-action write:
```ts
export const actions = {
  save: async ({ request, platform }) => {
    const data = parseAndValidate(await request.formData()); // Zod
    await platform?.env.SITE_KV.put('site-content', JSON.stringify(data));        // KV
    // or D1: platform.env.DB.prepare('UPDATE content ...').bind(...).run();
  }
};
```

`wrangler.jsonc` (one block per store you bind):
```jsonc
{
  "name": "camping4you",
  "compatibility_date": "2025-01-01",
  "kv_namespaces":  [{ "binding": "SITE_KV", "id": "<namespace-id>" }],
  "d1_databases":   [{ "binding": "DB", "database_name": "site", "database_id": "<id>" }],
  "r2_buckets":     [{ "binding": "SITE_R2", "bucket_name": "site-content" }],
  "durable_objects": { "bindings": [{ "name": "SITE_DO", "class_name": "SiteContent" }] }
}
```

Typed in `src/app.d.ts`:
```ts
declare global {
  namespace App {
    interface Platform {
      env: { SITE_KV: KVNamespace; DB: D1Database; SITE_R2: R2Bucket };
    }
  }
}
```

**Prerender interaction (the key architectural fact).** Bindings are runtime-only; they don't exist at build time. So:
- With a **runtime store (KV/D1/DO/R2)**, any route whose content comes from that store **cannot be prerendered** — it must be SSR (`export const prerender = false`), reading the binding on each request (edge-cacheable, but no longer a static asset). For Leisure Oaks' SEO-first brochure pages this is a real downgrade vs. M1's prerendered baseline.
- With the **git-backed** approach, content is baked into `site.ts` at build time, so **every public page stays prerendered** exactly as M1/T4 intend. Only the auth-gated `/admin` control panel is dynamic, and it's behind Cloudflare Access anyway.

---

## Per-option detail

### 1. Workers KV — read-heavy, eventually consistent
- **Consistency:** eventual. A write propagates globally within seconds and **may return stale data for up to ~60 s**, and is unreliable if a key is written more than once a minute. For a one-operator edit cadence this staleness is harmless, but it means the operator can briefly see the old value after saving.
- **Latency:** reads are edge-cached and fast (hot reads sub-ms to low-ms); designed for read-heavy.
- **Limits:** value ≤ **25 MB**, key ≤ 512 B — a whole `site.ts` JSON is tiny, fits as one key.
- **Pricing:** Free = 100k reads/day, 1k writes + 1k deletes + 1k lists/day, 1 GB storage. Paid (within the $5/mo Workers min) = 10M reads/mo then $0.50/M; 1M writes/mo then $5/M; 1 GB then $0.50/GB-mo. **This workload never leaves free.**
- **Fit:** technically ideal for the read pattern and nearly free, but **no native audit/versioning** (you'd store timestamped copies yourself) and it **forces content routes to SSR**. Good fit only if you accept building your own change log and giving up prerender.

### 2. D1 (SQLite) — relational, strongly consistent
- **Consistency:** strong, single-primary SQLite — operator reads back their own write immediately.
- **Limits/pricing:** Free (limits enforced since **2025-02-10**) = 5M rows read/day, 100k rows written/day, 5 GB total, 500 MB/DB, 10 DBs. Paid storage $0.75/GB-mo with generous included read/write allowances. **Never leaves free here.**
- **Binding:** `platform.env.DB` with `.prepare(sql).bind(...).first()/.all()/.run()`.
- **Migrations:** first-class — `wrangler d1 migrations create`, then `wrangler d1 migrations apply` (local and remote); schema lives in versioned SQL files in the repo.
- **Audit:** trivial to satisfy the requirement — a `content_versions(id, json, edited_by, edited_at)` table gives a queryable, timestamped history with diff/rollback in SQL.
- **Fit:** **the runtime runner-up.** Relational is mild overkill for "one structured document," but D1 is the cleanest path if you want instant edits *and* an audit trail in one store, and it's the natural home if tier-C reservations later need real relations.

### 3. Durable Objects — strongly consistent coordination engine
- **What it's for:** per-object strongly-consistent, transactional state with single-threaded coordination (counters, rooms, rate-limiters, agents). SQLite-backed DOs are on the Free plan; SQLite-storage billing begins Jan 2026.
- **Why it's overkill here:** there is no concurrency to coordinate — one operator, one document. You'd take on a class definition, ID routing, and a stateful actor to store a JSON blob that KV or D1 holds with far less ceremony. Strong consistency is real but D1 already provides it without the actor model.
- **Verdict:** not recommended for this content store.

### 4. R2 — object storage for a JSON/MDX blob
- **Pricing:** Free = 10 GB storage, 1M Class A (writes) + 10M Class B (reads) ops/mo, **zero egress**. Beyond: $0.015/GB-mo, Class A $4.50/M, Class B $0.36/M.
- **When it makes sense:** when content is a **large blob or binary** — bundled MDX, images, PDFs (park map, rules sheet) — where you want cheap, egress-free object storage. Object versioning gives a coarse history.
- **Why not for the structured fields:** for small structured data (rates/hours/contact), R2 adds a fetch+parse round-trip and SSR with no upside over KV/D1, and a weaker query/audit story. Reasonable as a *companion* for operator-uploaded media, not as the primary content store.

### 5. Git-backed / build-time — operator edits commit to the repo
- **Mechanism:** the `/admin` form action (behind Cloudflare Access + OIDC) validates the edit with Zod, then commits the updated `site.ts` (or a `content.json` it reads) via the **GitHub Contents API** using a fine-grained PAT stored as a Worker secret. The push triggers the existing Pages build; alternatively a **Cloudflare Pages Deploy Hook** (a unique POST URL, no auth header) triggers the rebuild directly.
- **Audit trail:** **native and free** — every edit is a commit with author, timestamp, and a full diff; `git revert` is the rollback. This is exactly the "audit trail of changes" the brief asks for, with zero extra schema.
- **Prerender:** **public site stays 100% prerendered** — content is baked at build, so the SEO milestone's static, edge-served pages are preserved. No content route drops to SSR.
- **Trade-offs:** (a) **rebuild latency** — an edit is live only after a build (~1–2 min on Pages), not instant; (b) needs a **commit mechanism** — a GitHub token + Contents API call (or a small Worker), one more secret to manage; (c) Pages Free allows 500 builds/mo, ample for infrequent edits but a real ceiling if editing became frequent; (d) concurrent edits would need a simple lock, but with one operator that's moot.
- **Fit:** **best for this workload.** It keeps the typed single source M1 is built on, gives the requested audit trail for free, costs nothing, and doesn't compromise the prerendered SEO site. The only thing it trades away — instant publish — is the thing this user cares about least.

---

## Recommendation rationale (for THIS workload)

The brief's distinguishing requirements are **infrequent edits**, **read-heavy public site**, and **wants an audit trail** — and the surrounding constraints are **SEO-first prerendering (M1/T4)** and **a typed single content source (M1/T2)**. Git-backed dominates on exactly those axes: audit trail is free and richer than anything you'd build on KV/D1; the public pages stay prerendered (no SSR regression); the content stays the typed `site.ts` the whole app already imports; and there is no runtime datastore to secure, runtime-validate, or reason about for consistency. The lone weakness — publish latency — is the dimension a one-operator brochure site weighs least.

**Switch to D1 (runner-up) when** any of: edits become frequent enough that ~minute rebuilds or the 500-builds/mo ceiling chafe; content must update without a deploy; or you add relational/queryable data (tier-C reservations). At that point D1's strong consistency + a `content_versions` table recreate the audit trail at runtime, and content routes move from prerendered to SSR. **KV** is the choice only if you want the absolute cheapest read path and are willing to hand-build versioning and accept the eventual-consistency stale-read window. **DO and R2** are not contenders for the structured content store (R2 stays useful for operator-uploaded media).

---

## Sources

- [Workers KV — Limits](https://developers.cloudflare.com/kv/platform/limits/)
- [Workers KV — Pricing](https://developers.cloudflare.com/kv/platform/pricing/)
- [Workers KV free tier (blog)](https://blog.cloudflare.com/workers-kv-free-tier/)
- [Workers — Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1 — Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 — Limits](https://developers.cloudflare.com/d1/platform/limits/)
- [D1 — Release notes (free-tier enforcement)](https://developers.cloudflare.com/d1/platform/release-notes/)
- [Query D1 from SvelteKit](https://developers.cloudflare.com/d1/examples/d1-and-sveltekit/)
- [Durable Objects — Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Durable Objects SQLite storage billing (changelog)](https://developers.cloudflare.com/changelog/2025-12-12-durable-objects-sqlite-storage-billing/)
- [R2 — Pricing](https://developers.cloudflare.com/r2/pricing/)
- [SvelteKit — adapter-cloudflare docs](https://svelte.dev/docs/kit/adapter-cloudflare)
- [Cloudflare Pages — Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Cloudflare Pages — Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [GitHub REST API — Contents (create/update file)](https://docs.github.com/en/rest/repos/contents)
