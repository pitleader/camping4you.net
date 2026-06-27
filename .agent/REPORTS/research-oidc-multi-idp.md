# Research: Multi-Provider OIDC Auth for the M3 Control Panel

**Date:** 2026-06-27
**Scope:** Auth-gating the operator control panel for camping4you.net (SvelteKit 5
on the Cloudflare adapter). One operator (a few known users), Google + Microsoft
(Entra) + Cloudflare Access desired. Admin gating, not public signup.

---

## TL;DR + Recommendation

**Recommended: Cloudflare Access (Zero Trust free tier) as the auth layer, with
the SvelteKit app validating the Access JWT in `hooks.server.ts`.**

Rationale, in one breath: the workload is *one operator*, the site is already
Cloudflare-hosted, and the requirement names Google + Microsoft + Cloudflare
Access — which is *exactly* Access's job. Access federates all three IdPs
upstream, handles the entire login/session/cookie dance itself, and hands your
Worker a signed JWT. The app's only auth code is ~40 lines that verify that JWT
against the team JWKS and check the `aud` tag and the email allowlist. No OAuth
client registration in the app, no PKCE flow to own, no session store, no
secrets beyond the team domain + AUD (which aren't even secret). Free tier
covers up to 50 users — vastly more than needed. This directly serves the
project's "secrets are server-only" and "edge runtime" hard constraints because
there are almost no secrets and the verification is pure Web Crypto / `jose`.

**Runner-up: App-level OIDC with `arctic` (v3) in `hooks.server.ts`.** Arctic is
explicitly runtime-agnostic, needs *no* Web Crypto polyfill on Workers, supports
Google and Microsoft Entra ID, and implements authorization-code + PKCE. Choose
this only if you want auth decoupled from Cloudflare Zero Trust (portability to
another host) or need login UX/branding inside the app. The cost is real: you
own client registration for each IdP, the callback flow, the signed session
cookie, and the allowlist — more code on the Critical auth boundary.

**Why Access wins here:** the runner-up's main advantage (host portability) is
low-value for a project whose scope *locks* the Cloudflare adapter and edge
runtime. Access removes the most error-prone, security-Critical code from the
app entirely. Keep Arctic as the documented fallback if Access ever becomes a
constraint (see Open Questions on the redirect-only edge case).

---

## 1. Cloudflare Access (Zero Trust free tier) — primary candidate

### How it works as an auth layer

Access sits *in front of* your Pages/Workers routes as a reverse-proxy gate. You
define an **Access application** (a hostname + path, e.g.
`camping4you.net/admin*`) and an **Access policy** (e.g. "allow emails in this
list"). Unauthenticated requests to that path get redirected to a Cloudflare-
hosted login page that offers the configured IdPs (Google, Microsoft, one-time
PIN, etc.). After login, Cloudflare sets a `CF_Authorization` cookie and, on
every proxied request to your origin/Worker, injects a signed JWT.

Because the whole login + session lifecycle lives in Cloudflare's edge, your app
never sees OAuth tokens, never registers an OAuth client, and never stores a
session. It only *reads and verifies* the identity Cloudflare asserts.

### Reading the authenticated identity

Cloudflare passes the app token in two places:
- **`Cf-Access-Jwt-Assertion` request header** — recommended; always present on
  proxied requests.
- **`CF_Authorization` cookie** — fallback; *not guaranteed* to be forwarded, so
  validate the header, not the cookie.

The JWT payload carries the user identity, including the `email` claim, which is
what you allowlist against.

### Validating the Access JWT (the security-Critical part)

Cloudflare signs the token with an account-unique RS256 key pair. You must
verify it — a request could otherwise be forged if it reached the Worker without
going through Access.

- **JWKS / certs endpoint:**
  `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/certs`
  Returns `keys` (JWK format), `public_cert`, and `public_certs` (PEM).
- **Issuer (`iss`):** `https://<team-name>.cloudflareaccess.com`
- **Audience (`aud`):** the unique **AUD tag** Access assigns to *this*
  application. Found in dashboard under **Zero Trust → Access → Applications →
  (app) → Configure → Additional settings**. Verifying `aud` is essential — it
  pins the token to *your* app, so a token minted for a different Access app in
  your account can't be replayed against the control panel.
- **Key rotation:** Access rotates the signing key **every 6 weeks**; the
  previous key stays valid **7 days** after rotation. Don't hardcode keys — fetch
  the JWKS (and let `jose`'s `createRemoteJWKSet` cache + refresh it, matching the
  token's `kid` against `public_certs`).

**Worker / edge validation with `jose` (runs on Workers, pure Web Crypto):**

```ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const TEAM_DOMAIN = "https://<team-name>.cloudflareaccess.com";
const AUD = env.ACCESS_AUD; // the application's AUD tag

const JWKS = createRemoteJWKSet(
  new URL(`${TEAM_DOMAIN}/cdn-cgi/access/certs`)
);

const token = request.headers.get("Cf-Access-Jwt-Assertion");
if (!token) throw new Error("no Access token");

const { payload } = await jwtVerify(token, JWKS, {
  issuer: TEAM_DOMAIN,
  audience: AUD,
});
// payload.email -> check against operator allowlist
```

`jose` is the library Cloudflare's own docs use for Workers; it is edge-safe and
needs no Node polyfills. (A hand-rolled Web Crypto `crypto.subtle.verify`
equivalent is possible but `jose` handles `kid` matching, JWKS caching, and
rotation for you — fewer ways to get the Critical path wrong.)

### Configuring Google + Microsoft (Entra) as upstream IdPs *inside* Access

You add IdPs once at the Zero Trust account level, then Access offers them on the
login page for any protected app.

- **Google:** Zero Trust → Settings/Integrations → Authentication → Login methods
  → Add new → **Google**. Works with *any* Google account (no Google Workspace
  required); the Access *policy* (email allowlist) is what restricts who gets in.
- **Microsoft Entra ID:** Add new → **Microsoft Entra ID**. Requires App
  (client) ID, client secret, and Directory (tenant) ID from an Entra app
  registration. Supports SCIM group sync (not needed for one operator).
- **Multiple IdPs simultaneously** are supported — the operator picks Google or
  Microsoft at the login screen. You can also add **One-time PIN** (email code)
  as a zero-config backup login method.

The actual gate is the **Access policy**: set it to *include* the specific
operator email address(es). Even though "any Google account" can authenticate,
only allowlisted emails pass the policy.

### Free-tier limits

- **Up to 50 users free** (most generous in the SASE market); beyond 50 it's
  pay-as-you-go at ~$7/user/month with no partial billing. One operator is
  trivially within free.
- Free tier also caps: ~24-hour log retention, community-only support, and
  protects up to 50 applications. None of these bite for a single admin gate.
- (These are Zero Trust *seat* limits; serving the public marketing site through
  Cloudflare is unaffected — Access only gates the `/admin*` paths you define.)

---

## 2. App-level OIDC (if not using Access)

If auth must live in the app (host-portable, custom login UX), use an
edge-compatible relying-party flow in SvelteKit.

### Library: `arctic` v3 (recommended for this stack)

- **Edge compatibility — confirmed:** Arctic is "runtime-agnostic," built on the
  Fetch API + Web Crypto, and **does not require a Web Crypto polyfill on
  Cloudflare Workers** (only Node 18 needs one; Workers/Bun/Deno/Node 20 don't).
  This is the cleanest fit for the locked Cloudflare adapter + edge constraint.
- **Providers:** Google and Microsoft Entra ID are both in its 70+ providers.
- **Flow:** Arctic gives you `createAuthorizationURL()` (with PKCE +
  state/nonce) and `validateAuthorizationCode()`; authorization-code is the only
  grant. Arctic is *just* the OAuth/OIDC client — it deliberately does **not**
  manage sessions or cookies; you own that (which is the point of the trade-off).
- Arctic is the modern successor to the Lucia-era stack. (`oslo`, the old
  crypto/JWT helper, has been largely split/deprecated into smaller packages;
  prefer `jose` for any JWT work and the Web Crypto API directly for session
  signing rather than pulling in `oslo` — verify current package status before
  adopting, see Open Questions.)

### Authorization-code + PKCE flow at the edge (SvelteKit)

1. **Login route** (`/admin/login`): generate `state` + PKCE `codeVerifier`,
   build the authorization URL via Arctic, store `state` + `codeVerifier` in
   short-lived, `httpOnly`, `secure`, `sameSite=lax` cookies, redirect to the IdP.
2. **Callback route** (`/admin/auth/callback`): read `code` + `state`, compare
   `state` to the cookie, call `validateAuthorizationCode(code, codeVerifier)`,
   fetch/decode the ID token (`email`), **check email against the operator
   allowlist**, then mint your own signed session.
3. **Session:** sign a session token (e.g. a JWT via `jose`, or a random opaque
   ID stored in KV/D1) and set it as an `httpOnly` `secure` cookie. Verify it in
   `hooks.server.ts` on each request. With one operator, a stateless signed JWT
   cookie avoids needing a session store entirely.

### Allowlisting operator emails

Keep the allowlist in a server-only env var (e.g. `ADMIN_EMAILS` read via
`$env/dynamic/private` / `event.platform.env`) and reject any authenticated
email not in it. This is the same allowlist concept whether using Access (in the
policy) or app-OIDC (in the callback) — but with app-OIDC *you* enforce it, so it
must be tested.

### Alternative: `@auth/sveltekit` (Auth.js)

- **Works on Cloudflare**, but requires care: use **lazy initialization** —
  `SvelteKitAuth(async (event) => ({...}))` — so it can read secrets from
  `event.platform.env` (Workers don't expose env at module load). Set
  `AUTH_TRUST_HOST=true` and provide `AUTH_SECRET`. Official Cloudflare Pages
  demos exist (e.g. `nextauthjs/sveltekit-auth-cloudflare`,
  `jschlesser/authjs-sveltekit-cloudflare-pages`).
- Heavier and more opinionated than Arctic; its database adapters (D1) are
  alpha. For a single-operator allowlist it's more machinery than needed. Arctic
  gives more direct control with less edge-runtime surprise.

---

## 3. Trade-off and recommendation

| Axis | Cloudflare Access | App-level OIDC (Arctic) |
|---|---|---|
| Auth code in app | ~40 lines: verify JWT + allowlist | Login + callback + session + allowlist; you own the Critical flow |
| Secrets in app | None secret (team domain + AUD) | Per-IdP client ID/secret + session signing secret |
| Session mgmt | Cloudflare owns it | You own cookie/session lifecycle |
| IdP setup | Once, in Zero Trust dashboard (Google, Entra, OTP) | Per-IdP app registration in app config |
| Google + MS + CF Access | All native (Access *is* the CF option) | Google + MS yes; "CF Access" N/A (that's the other model) |
| Edge compatibility | High — `jose` verify, no Node APIs | High — Arctic needs no polyfill on Workers |
| Coupling | Ties admin access to CF Zero Trust | Portable across hosts |
| Failure surface | Small, mostly Cloudflare's | Larger, mostly yours (Critical boundary) |
| Cost | Free ≤50 users | Free (just IdP apps) |

**Recommendation: Cloudflare Access**, because it collapses the most
security-Critical, easiest-to-botch code (login redirect, PKCE, session signing,
cookie hardening) into Cloudflare's edge and leaves the app with a small,
testable verify-and-allowlist function. The project's scope already *locks* the
Cloudflare adapter and edge runtime, so the runner-up's portability advantage is
nearly worthless here, while Access's reduction in auth-boundary code is directly
valuable against the Critical-rubric "auth/authorization boundary" risk.

**Runner-up: Arctic-based app OIDC**, kept as the documented fallback. Adopt it
if (a) auth must be decoupled from Cloudflare Zero Trust, (b) you need login
branding/UX inside the app, or (c) Access's redirect behavior conflicts with a
needed non-interactive/API path (see Open Questions).

Note: these aren't mutually exclusive long-term. You can ship Access now (fast,
minimal code) and migrate to Arctic later if a decoupling need appears — the
SvelteKit enforcement point (`hooks.server.ts` + `event.locals.user`) is
identical for both, so only the "how identity is obtained" half changes.

---

## 4. SvelteKit integration

Enforcement lives in **`src/hooks.server.ts`** via the `handle` hook, populating
`event.locals.user`, for *both* models. The difference is only how `handle`
derives the user.

**With Cloudflare Access:**

```ts
// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "$env/dynamic/private"; // server-only

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/admin")) {
    const token = event.request.headers.get("Cf-Access-Jwt-Assertion");
    const TEAM = env.CF_ACCESS_TEAM_DOMAIN;     // https://<team>.cloudflareaccess.com
    const AUD = env.CF_ACCESS_AUD;
    const allow = (env.ADMIN_EMAILS ?? "").split(",").map(s => s.trim());

    try {
      const JWKS = createRemoteJWKSet(new URL(`${TEAM}/cdn-cgi/access/certs`));
      const { payload } = await jwtVerify(token ?? "", JWKS, {
        issuer: TEAM, audience: AUD,
      });
      const email = String(payload.email ?? "");
      if (!allow.includes(email)) throw new Error("not allowlisted");
      event.locals.user = { email };
    } catch {
      // Access normally redirects before reaching here; this is defense-in-depth
      return new Response("Forbidden", { status: 403 });
    }
  }
  return resolve(event);
};
```

Key points:
- **Protect the route group** by guarding the `/admin` path prefix in `handle`
  (and/or re-check `event.locals.user` in the `+layout.server.ts` of the
  `(admin)` route group so individual loaders fail closed).
- **`event.locals.user`** is the single canonical identity surface the control
  panel reads; type it in `src/app.d.ts` (`App.Locals`).
- **Secrets stay server-only:** read `CF_ACCESS_*` / `ADMIN_EMAILS` via
  `$env/dynamic/private` (or `event.platform.env` on Workers). Never import these
  into anything client-reachable. The Access team domain + AUD aren't strictly
  secret, but keeping them in private env is tidy and matches the constraint.
- **Validate the JWT payload with Zod** at the boundary (the project's hard
  constraint: external input is runtime-validated, no `any` at seams) — the
  `email` claim is external input.
- On the marketing/public routes, `handle` does nothing — auth only touches
  `/admin*`, so the brochure site stays fully public and fast.

For the Arctic model, `handle` instead verifies *your own* session cookie (via
`jose` or KV/D1 lookup) and the login/callback live as SvelteKit routes/form
actions under `/admin/login` and `/admin/auth/callback`. Everything downstream
(`event.locals.user`, route-group guard, Zod validation, server-only secrets) is
identical.

---

## Open questions / to verify

1. **Access redirect vs. JSON/API paths.** Cloudflare Access redirects
   unauthenticated *browser* requests to its login page. If the control panel has
   any non-interactive endpoints (e.g. a future Telnyx-adjacent admin API or
   fetch-based calls expecting JSON, not an HTML redirect), confirm how Access
   handles them — you may need a **service token** (bypass) policy for those
   paths, or scope Access to interactive routes only. Verify before relying on it
   for anything beyond browser-driven admin pages.
2. **Custom domain vs. team subdomain for the JWKS issuer.** Confirm the exact
   `iss` value once the Zero Trust team name is chosen
   (`https://<team>.cloudflareaccess.com`) and that the app on `camping4you.net`
   is configured as an Access application with its own AUD. Pin both in config.
3. **`oslo` package status (only if going app-OIDC).** `oslo` has been
   splitting/deprecating into smaller packages; before adopting, verify current
   maintained packages for session-cookie signing — prefer `jose` + Web Crypto
   directly. Arctic itself is current and maintained.
4. **`jose` on the Cloudflare adapter — confirm at build.** `jose` is edge-safe
   and used in Cloudflare's own docs, but verify it bundles cleanly under the
   SvelteKit Cloudflare adapter (`vitest` + a real `wrangler dev` smoke test)
   rather than assuming. This is the one library both models share.
5. **Pages vs. Workers deployment target.** The scope says "Cloudflare adapter";
   confirm whether deploying as Pages or the newer Workers-static-assets target,
   since Access application setup and the `event.platform.env` access path are
   slightly different between them. (Access works in front of both.)
6. **Entra app registration ownership.** If using Microsoft via Access *or*
   Arctic, the operator needs an Entra tenant + app registration (client ID,
   secret, tenant ID). Confirm the operator has/wants a Microsoft tenant; if not,
   Google + OTP alone may suffice and Entra can be deferred (tracked exclusion).

---

## Sources

- [Validate JWTs — Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Validating JSON Web Tokens — Cloudflare Access docs](https://developers.cloudflare.com/access/setting-up-access/validate-jwt-tokens)
- [Configure the Worker for JWT validation — Cloudflare API Shield docs](https://developers.cloudflare.com/api-shield/security/jwt-validation/jwt-worker/)
- [One-click Cloudflare Access for Workers — Changelog (2025-10-03)](https://developers.cloudflare.com/changelog/post/2025-10-03-one-click-access-for-workers/)
- [Account limits — Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/account-limits/)
- [Zero Trust & SASE Plans & Pricing — Cloudflare](https://www.cloudflare.com/plans/zero-trust-services/)
- [Cloudflare Zero Trust Free Plan 2026: What 50 Users Get — Costbench](https://costbench.com/software/business-vpn/cloudflare-zero-trust/free-plan/)
- [Identity providers — Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/)
- [Microsoft Entra ID — Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/entra-id/)
- [Google — Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/)
- [Arctic v3 documentation](https://arcticjs.dev/)
- [Auth.js — SvelteKit reference](https://authjs.dev/reference/sveltekit)
- [nextauthjs/sveltekit-auth-cloudflare (example repo)](https://github.com/nextauthjs/sveltekit-auth-cloudflare)
- [jschlesser/authjs-sveltekit-cloudflare-pages (demo repo)](https://github.com/jschlesser/authjs-sveltekit-cloudflare-pages)
- [Cloudflare adapter — SvelteKit docs](https://svelte.dev/docs/kit/adapter-cloudflare)
- [SvelteKit — Cloudflare Workers framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/sveltekit/)
- [Protecting APIs with JWT Validation — Cloudflare blog](https://blog.cloudflare.com/protecting-apis-with-jwt-validation/)
</content>
</invoke>
