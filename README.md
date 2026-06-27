# camping4you.net — Leisure Oaks Park

Marketing + SMS-compliance website for **Leisure Oaks Park**, an RV park and
campground in Bartonville, Illinois. SvelteKit 5 + TypeScript + Tailwind v4,
deployed to **Cloudflare Pages**.

## Stack

- **SvelteKit 5** (runes) + **TypeScript** (`strict`), `@sveltejs/adapter-cloudflare`
- **Tailwind v4** design system (OKLCH tokens, dark/light themes)
- Typed schema.org JSON-LD, `sitemap.xml`, `llms.txt`, `robots.txt`
- All editable park facts live in one source of truth: `src/lib/content/site.ts`

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Quality gates (run before pushing)

```bash
npm run check      # svelte-check / tsc
npm run lint       # prettier + eslint
npm test           # vitest
npm run build      # production build → .svelte-kit/cloudflare/
```

CI (`.github/workflows/ci.yml`) runs all four on every push/PR.

## Deploy (Cloudflare Pages)

Account + token live in `.cf.env` (gitignored). First deploy creates the
project; subsequent pushes to `main` deploy via `.github/workflows/deploy.yml`
(set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repo secrets).

Manual deploy:

```bash
set -a && source .cf.env && set +a
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare --project-name=camping4you
```

## Content & truth

`src/lib/content/site.ts` is the single source of truth for every park fact.
A value the owner has not confirmed is `null` and renders as an honest
fallback (e.g. "Call for rates") — placeholders are never filled with guesses.

## Roadmap

- **M1** — this rebuild (marketing site + SEO on Cloudflare). _In progress._
- **M2** — Telnyx service-only SMS (A2P 10DLC) + STOP/HELP webhooks.
- **M3** — OIDC-gated operator control panel for editing `site.ts` content.

Governance, decisions, and the task tree live in `.agent/`.
The previous Hugo site is archived under `archive/hugo/`.
