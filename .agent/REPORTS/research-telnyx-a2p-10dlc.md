# Research: Compliant Service-Only SMS with Telnyx on SvelteKit/Cloudflare (M2)

_Research date: 2026-06-27. Scope: A2P 10DLC + Telnyx integration for Leisure Oaks Park, a small Illinois RV campground sending **service/transactional SMS only** (reservation confirmations, check-in/out reminders, park notices). Never marketing._

## TL;DR

A small US business sending service-only SMS must register an **A2P 10DLC Brand** (~$4.50 one-time) and one **Campaign** (~$15 one-time review + ~$1.50–$10/mo carrier pass-through) through Telnyx, which relays to The Campaign Registry (TCR). For this volume the best-fit campaign is **Low Volume Mixed** (≤6,000 msg/mo, ≤2,000 T-Mobile segments/day, cheapest at ~$1.50/mo) — or `ACCOUNT_NOTIFICATION`/`CUSTOMER_CARE` if higher throughput is needed; if the park has no EIN, use the **Sole Proprietor** path. Brand vetting is largely automated; per-carrier campaign provisioning is roughly instant (T-Mobile) to 1–5 business days (AT&T/Verizon/US Cellular). Telnyx **automatically** enforces STOP/UNSUBSCRIBE/CANCEL/END/QUIT/STOPALL (opt-out), START/UNSTOP (opt-in), and HELP at the messaging-profile level and returns error `40300` if you try to message an opted-out number — so the app's main job on the inbound webhook is to **mirror** opt-out/opt-in state (via the `autoresponse_type` field) into its own consent ledger, verify the **Ed25519 webhook signature** (`telnyx-signature-ed25519` + `telnyx-timestamp` headers over the string `` `${timestamp}|${rawBody}` ``), and dedupe on `data.id`. Outbound send is a single `POST https://api.telnyx.com/v2/messages` with a Bearer API key — fully `fetch`-based and edge-safe. The two real Cloudflare gotchas: use **Web Crypto `Ed25519`** (or legacy `NODE-ED25519`) for verification (no Node `crypto`/`Buffer`), and read the API key + public key from Worker secrets, never the client bundle. **Honest unknowns:** exact best-fit use-case approval odds, whether Telnyx's default auto-responses suffice for HELP wording, and the precise messaging-webhook signing details all need a final confirm in the Telnyx console (see Open Questions).

---

## 1. A2P 10DLC registration (Brand + Campaign via Telnyx)

A2P 10DLC = Application-to-Person messaging over standard 10-digit long codes. As of **Feb 3, 2025**, unregistered 10DLC traffic is blocked by carriers ([Telnyx](https://telnyx.com/resources/unregistered-10dlc-is-ending)), so registration is mandatory, not optional.

**Two-step flow, both done in the Telnyx Mission Control Portal (or API), relayed to TCR:**

1. **Brand registration** (one-time, per legal entity). Submit the business's legal name, EIN/Tax ID, address, contact, website, vertical. TCR runs automated identity vetting and assigns a **trust/vetting score** that caps campaign throughput. Brand registration is a one-time per-entity step.
2. **Campaign registration** (per messaging program). References the approved `brandId` and declares the use case + content.

**Use-case fit for service-only campground messaging** (campaign `usecase` values per [Telnyx campaign-registration docs](https://developers.telnyx.com/docs/messaging/10dlc/campaign-registration)):

| Use case | Fit for this project | Notes |
|---|---|---|
| `LOW_VOLUME` / **Low Volume Mixed** | **Recommended default** | <6,000 msg/mo, simplified registration, cheapest (~$1.50/mo). Capped at **2,000 T-Mobile segments/day** and lower throughput regardless of trust score — fine for one small campground. |
| `ACCOUNT_NOTIFICATION` | Strong alternative | Purpose-built for transactional account/reservation notices; standard ~$10/mo, higher throughput. |
| `CUSTOMER_CARE` | Alternative | Two-way support/service conversations. |
| `MIXED` | Fallback | Use only if messages span multiple categories; standard ~$10/mo. |
| `SOLE_PROPRIETOR` | Use if **no EIN** | For very small businesses/individuals without a registered tax ID; lowest throughput. |
| `MARKETING` | **Out of scope** | Never — project is service-only by hard constraint. |

> Recommendation: register **Low Volume Mixed** unless the owner expects to exceed ~6k msg/mo or hit the 2k/day T-Mobile cap on a busy weekend; then `ACCOUNT_NOTIFICATION`. Confirm the park has an EIN (it should as a registered IL business) — if not, fall back to Sole Proprietor.

**Required campaign fields** (from the campaign-registration doc):
- `brandId`, `usecase`
- `description` — 2–4 sentences on what the campaign does.
- `sample1`, `sample2` (3–5 samples recommended) — real example messages that **match the use case** and **include opt-out language** (e.g. "Reply STOP to unsubscribe, HELP for help").
- `messageFlow` — how users opt in (the consent mechanism, in words). This is the field carriers scrutinize most.
- `helpMessage` — the HELP keyword response (must name the business and give contact info).
- `optinKeywords`, `optoutKeywords`, `helpKeywords` — comma-separated.
- Optional flags: embedded link, embedded phone, age-gating, number-pool, direct-lending.
- A **privacy policy URL** and **terms URL**: not a single discrete TCR field, but carriers/TCR vetting expects the opt-in CTA and message flow to reference a public privacy policy stating you don't share opt-in data and how to opt out. **This is why the project already hosts `/privacy`, `/terms`, and an SMS-sample page** — they are the public compliance host for exactly this. Link them in the `messageFlow`/CTA.

**Vetting / approval timeline** (per Telnyx docs):
- TCR brand vetting: largely automated, typically minutes to a day.
- MNO (carrier) campaign provisioning, per carrier: **T-Mobile** instant–24h; **AT&T** 1–3 business days; **Verizon** 1–3 business days; **US Cellular** 3–5 business days. The campaign is usable as each carrier provisions; full coverage in roughly a week.

**Fees** (Telnyx passes TCR/carrier fees through at cost — [10DLC Fees & Charges](https://support.telnyx.com/en/articles/5634625-10dlc-fees-and-charges)):
- Brand registration: **~$4.50** one-time.
- Campaign review: **~$15** one-time.
- Monthly campaign carrier fee: **~$1.50/mo (Low Volume Mixed)** vs **~$10/mo** (most standard use cases incl. Account Notification / Customer Care / Mixed).
- Per-message carrier pass-through (registered): T-Mobile ~$0.003 send+receive; AT&T ~$0.003 send / free receive; Verizon ~$0.0031 send / free receive; US Cellular ~$0.005 send / free receive.
- (These figures move; treat as planning estimates and confirm live in the portal.)

---

## 2. Consent / opt-in (valid consent for transactional SMS)

**Legal floor (TCPA):** transactional/informational messages (reservation confirmations, appointment/check-in reminders) require **prior express consent**, which may be **oral or written** — a lower bar than the *prior express written consent* required for marketing. ([Bloomreach TCPA/CTIA overview](https://www.bloomreach.com/en/blog/understanding-tcpa-and-ctia-compliance-for-sms-marketing-in-the-us), [Holland & Knight, 2026](https://www.hklaw.com/en/insights/publications/2026/05/beyond-tcpa-compliance-why-ctia-messaging-principles)).

**Carrier/industry floor (CTIA + 10DLC vetting):** despite the lighter TCPA standard, **CTIA Messaging Principles & Best Practices** and carrier enforcement expect **documented consent for virtually all commercial programs**, including transactional. Treat "document the consent regardless" as the operative rule. ([CTIA Messaging Principles](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms)).

**What counts as valid consent here:** the camper affirmatively provides their mobile number for a stated service purpose (e.g. a reservation/contact form with an unchecked, explicit SMS opt-in), where the call-to-action discloses:
- the **program/sender identity** (Leisure Oaks Park),
- the **message purpose & type** (service/transactional reservation & park notices),
- **message frequency** ("message frequency varies" is acceptable),
- **"Message and data rates may apply,"**
- **STOP/HELP** instructions, and
- a link to the **privacy policy** and **terms**.

**What must be recorded** (the consent ledger — store durably, e.g. in D1/KV):
- phone number (E.164), timestamp, IP/user-agent of the opt-in submission,
- the **exact CTA text/version** shown at opt-in (so you can reproduce what they agreed to),
- the source/page, and subsequent **opt-out/opt-in state changes** (mirrored from inbound webhooks, §3).
Consent **cannot be shared across brands or purchased** — each sender obtains its own. Keep records for the life of the relationship + a retention buffer.

**"Consent is not a condition of service" satisfied by:**
- The SMS opt-in checkbox is **separate, unchecked by default, and optional** — reservations/contact/service must complete fully whether or not SMS is selected.
- The CTA explicitly states consent to texts is **not required to book/stay/transact**.
- No gating logic anywhere ties a service outcome to SMS opt-in. (Aligns with the project's hard constraint: "consent is never a condition of purchase or service.")

---

## 3. STOP / HELP keyword handling (Telnyx auto vs. app)

**Telnyx handles automatically** at the **messaging-profile level** (default on account creation — [Advanced Opt-In/Out](https://developers.telnyx.com/docs/messaging/messages/advanced-opt-in-out), [Opt-Out Keywords](https://support.telnyx.com/en/articles/1270091-sms-opt-out-keywords-and-stop-words)):
- **Opt-out:** `STOP`, `STOPALL`, `STOP ALL`, `UNSUBSCRIBE`, `CANCEL`, `END`, `QUIT` → adds the number to the profile's block list. Subsequent sends to that number return error **`40300` "Blocked due to STOP message."**
- **Opt-in:** `START`, `UNSTOP` → removes the block.
- **Help:** `HELP` (and `INFO` as a common help synonym — confirm it's enabled).
- Keywords are recognized **only when they are the sole content** of the message ("stop" yes; "please stop all messages" no).
- Telnyx can also send **default auto-responses** for these keywords; custom responses/extra keywords (≤20 total) are configured via the **keywords management** UI or the `autoresp_configs` API, per country (ISO 3166-1 alpha-2; use `Global`).

**What the app MUST do on the inbound webhook:**
- **Mirror state, don't re-implement blocking.** Telnyx is the enforcement source of truth; the app keeps its **own consent ledger in sync** so analytics/UX and the legal record stay correct. Read the inbound webhook's **`autoresponse_type`** field (values include `STOP`, `START`, `HELP`) and update the ledger's opt-in/opt-out state for `from.phone_number`.
- **Don't send to opted-out numbers** from app logic either (defense in depth) — and handle `40300` gracefully if a race occurs.
- **Decide HELP wording ownership:** either rely on Telnyx's default HELP auto-response or configure a custom one that names the park and gives contact info. The campaign's `helpMessage` field must match whatever actually goes out. (Confirm in console which is active — see Open Questions.)
- Because opt-out is **profile-wide**, keep this campground's service number on its **own messaging profile** so its opt-out list isn't entangled with any other program.

---

## 4. Telnyx webhooks (inbound payload, signature, idempotency)

**Inbound payload shape** (`POST` to your webhook URL — [Receive Message](https://developers.telnyx.com/docs/messaging/messages/receive-message)):
```jsonc
{
  "data": {
    "event_type": "message.received",
    "id": "uuid",                 // event id — use for idempotency
    "occurred_at": "2026-…Z",
    "record_type": "event",
    "payload": {
      "id": "uuid",               // message id — also dedupe key
      "direction": "inbound",
      "from": { "phone_number": "+1815…", "carrier": "…", "line_type": "long_code" },
      "to":   [ { "phone_number": "+1309…", "status": "webhook_delivered" } ],
      "text": "STOP",
      "type": "SMS",
      "encoding": "GSM-7",
      "parts": 1,
      "messaging_profile_id": "uuid",
      "received_at": "2026-…Z",
      "autoresponse_type": "STOP", // STOP | START | HELP | null
      "media": []
    }
  },
  "meta": { "attempt": 1, "delivered_to": "https://…/webhooks/telnyx" }
}
```
Delivery (DLR) events use `event_type` like `message.sent` / `message.finalized` with `direction: "outbound"`; route by `event_type`. `meta.attempt` is the retry counter (1–3).

**Signature verification (Ed25519):** All Telnyx v2 webhooks are signed with **Ed25519 public-key crypto** ([How to Leverage Webhooks](https://support.telnyx.com/en/articles/4334722-how-to-leverage-webhooks)). Two headers:
- `telnyx-signature-ed25519` — base64-encoded signature.
- `telnyx-timestamp` — Unix seconds.

The **signed message** is the string `` `${telnyx-timestamp}|${rawRequestBody}` `` (timestamp, a literal pipe, then the **raw, unparsed** JSON body). Verify that signature against your account **Public Key** (Mission Control Portal → **Account Settings → Keys & Credentials → Public Key**). Also reject if `timestamp` is older than a tolerance (e.g. 5 min) to blunt replay.

> ⚠️ Verify against the **raw body bytes**, not a re-serialized object — in SvelteKit read `await request.text()` and use that exact string for both verification and parsing. Re-stringifying a parsed object will change bytes and break the signature.

**TypeScript / Web Crypto (edge/Workers — no Node `Buffer`):**
```ts
// Telnyx public key from the portal is base64-encoded raw 32-byte Ed25519 key.
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function verifyTelnyx(
  rawBody: string, sigB64: string, timestamp: string, publicKeyB64: string,
  toleranceSec = 300,
): Promise<boolean> {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > toleranceSec) return false;

  const key = await crypto.subtle.importKey(
    "raw", b64ToBytes(publicKeyB64),
    { name: "Ed25519" },          // standard Secure-Curves name; fallback: "NODE-ED25519" + namedCurve
    false, ["verify"],
  );
  const signed = new TextEncoder().encode(`${timestamp}|${rawBody}`);
  return crypto.subtle.verify({ name: "Ed25519" }, key, b64ToBytes(sigB64), signed);
}
```
Cloudflare Workers support both the **standard `Ed25519`** algorithm (Secure Curves) and the **legacy `NODE-ED25519`** (with `namedCurve: "NODE-ED25519"`) ([Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)). Prefer `Ed25519`; keep `NODE-ED25519` as a fallback if an older `compatibility_date` is pinned. Raw **private** key import is disallowed on Workers — irrelevant here since you only ever import the **public** key to verify.

**Idempotency:** Telnyx retries (up to ~3 attempts) and can deliver out of order, so the handler must be idempotent:
- Dedupe on `data.id` (event id) or `data.payload.id` (message id) — store seen IDs in **KV/D1** with a TTL and short-circuit duplicates.
- Make ledger writes upsert/state-converging (set opt-out state, don't blindly append).
- **Return `2xx` quickly** even on duplicates so Telnyx stops retrying; do heavier work async (`waitUntil`) where possible.

---

## 5. Sending API (outbound from a Cloudflare Worker)

Single endpoint, plain `fetch`, no SDK needed ([Send a Message](https://developers.telnyx.com/docs/messaging/messages/send-message)):
```ts
const res = await fetch("https://api.telnyx.com/v2/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.TELNYX_API_KEY}`,
  },
  body: JSON.stringify({
    from: env.TELNYX_FROM_NUMBER,            // E.164, assigned to the messaging profile
    to: "+1815XXXXXXX",                      // E.164
    text: "Leisure Oaks Park: your site is confirmed for 7/4. Reply STOP to opt out, HELP for help.",
    messaging_profile_id: env.TELNYX_MESSAGING_PROFILE_ID, // optional but recommended
    // webhook_url / webhook_failover_url optional (else profile default DLR webhook is used)
  }),
});
```
- **Auth:** `Authorization: Bearer <API key>` (create a V2 API key in the portal).
- **`from` vs `messaging_profile_id`:** the `from` number must be **purchased and assigned to a messaging profile** in the portal; that profile is what carries the approved 10DLC campaign association and the opt-out list. Passing `messaging_profile_id` explicitly is optional (Telnyx derives it from `from`) but makes intent explicit and is good practice. For number-pool sending you'd pass the profile and omit a fixed `from`.
- **Setup order:** buy a local 10DLC number → create a **messaging profile** → assign the number to it → attach the approved **campaign** to the profile → set the profile's inbound/DLR **webhook URL** (your Worker route) and the Ed25519 public key expectation.
- Outbound returns a message `id`; track delivery via DLR webhooks (`message.sent`/`message.finalized`). Respect the campaign's throughput cap (esp. Low Volume Mixed's 2k/day T-Mobile segments).

---

## 6. Cloudflare edge gotchas (Telnyx-specific)

1. **No Node crypto / `Buffer`.** Use **Web Crypto** (`crypto.subtle`) and `atob`/`Uint8Array` for base64, as in §4. Don't reach for `crypto.createVerify`, `Buffer.from`, or the Node `telnyx` SDK's `webhooks.constructEvent` (it assumes Node). Reimplement verification with Web Crypto.
2. **`Ed25519` algorithm availability is `compatibility_date`-sensitive.** The standard `Ed25519` name needs a recent compatibility date; otherwise use `NODE-ED25519`/`{ name, namedCurve }`. Pick one, pin `compatibility_date` in `wrangler.toml`, and test the actual verify path against a real Telnyx webhook before trusting it (a verifier that always returns `false` — or always `true` — is the classic silent failure).
3. **Raw-body discipline.** SvelteKit/Workers: call `await request.text()` once, verify on that exact string, then `JSON.parse` it. Don't let any middleware re-serialize the body. Validate the parsed object with **Zod** (project hard constraint: external input is runtime-validated; no `any` at seams).
4. **Secrets handling.** `TELNYX_API_KEY` and `TELNYX_PUBLIC_KEY` (+ profile/from) are **Worker secrets** — set via `wrangler secret put` / Pages env (encrypted), read server-side through `$env/static/private` or `$env/dynamic/private`. Never import into a client bundle, never inline in `+page` client code, never log them. The public key is not secret but still belongs in config, not the repo's client code.
5. **Idempotency store.** Workers are stateless per request — use **KV or D1** (or Durable Objects) for the seen-event set and the consent ledger; in-memory dedupe won't survive across isolates.
6. **Webhook must return fast `2xx`.** Edge sub-request and CPU limits mean heavy synchronous work risks timeouts and Telnyx retries; acknowledge then defer with `ctx.waitUntil`.
7. **Outbound retries/limits.** Telnyx's API works fine from `fetch`; just handle non-2xx (incl. `40300` blocked) and rate/throughput caps without crashing the request.

---

## Open questions to confirm in console / with owner

1. **Use case decision:** Low Volume Mixed (cheapest, capped) vs `ACCOUNT_NOTIFICATION` (higher throughput, ~$10/mo). Need the owner's realistic monthly volume + peak-day estimate. _Owner input._
2. **EIN present?** Confirm Leisure Oaks Park has an EIN for standard Brand registration; if not, register as **Sole Proprietor**. _Owner input._
3. **Exact current fees:** the $4.50 brand / $15 review / $1.50–$10 monthly figures move over time — confirm live numbers in the Telnyx portal at registration. _Console._
4. **HELP/STOP response ownership:** does Telnyx's default auto-response satisfy the campaign `helpMessage`, or do we configure a custom one (keywords management / `autoresp_configs`)? Whatever ships must match the registered `helpMessage`/`optoutKeywords`. _Console._
5. **`INFO` and other synonyms:** confirm exactly which help/opt-out synonyms are auto-handled on the profile vs. need adding. _Console._
6. **Messaging-webhook signing specifics:** confirm the messaging webhook uses the same `telnyx-signature-ed25519`/`telnyx-timestamp` + `timestamp|rawBody` scheme as the general v2 webhook docs (vs. any legacy v1 inbound-message HMAC). Test against a live webhook before relying on it. _Console + live test._
7. **`autoresponse_type` exact value set & null behavior:** verify the full enumeration (STOP/START/HELP and any others) and that it's `null`/absent for normal inbound texts. _Live test._
8. **Whether to pin standard `Ed25519` vs `NODE-ED25519`** given the chosen `compatibility_date`. _Engineering / test._
9. **Privacy/terms URL linkage:** confirm the public `/privacy`, `/terms`, `/sms` pages are referenced in the campaign `messageFlow`/opt-in CTA exactly as carriers expect. _Project + console._

## Sources

- [10DLC Campaign Registration — Telnyx Developers](https://developers.telnyx.com/docs/messaging/10dlc/campaign-registration)
- [10DLC Fees and Charges — Telnyx Help Center](https://support.telnyx.com/en/articles/5634625-10dlc-fees-and-charges)
- [Unregistered 10DLC is ending — Telnyx](https://telnyx.com/resources/unregistered-10dlc-is-ending)
- [What is 10DLC — Telnyx](https://telnyx.com/resources/what-is-10dlc)
- [Receive SMS and MMS Messages — Telnyx Developers](https://developers.telnyx.com/docs/messaging/messages/receive-message)
- [Send Your First Message / Send a Message — Telnyx Developers](https://developers.telnyx.com/docs/messaging/messages/send-message)
- [Send a message API reference — Telnyx](https://developers.telnyx.com/api/messaging/send-message)
- [How to Leverage Webhooks (Ed25519 signing) — Telnyx Help Center](https://support.telnyx.com/en/articles/4334722-how-to-leverage-webhooks)
- [Update Webhook Sign Key Guide — Telnyx Help Center](https://support.telnyx.com/en/articles/8370064-update-webhook-sign-key-guide)
- [Advanced Opt-In/Out Management — Telnyx Developers](https://developers.telnyx.com/docs/messaging/messages/advanced-opt-in-out)
- [SMS Opt-Out Keywords and Stop Words — Telnyx Help Center](https://support.telnyx.com/en/articles/1270091-sms-opt-out-keywords-and-stop-words)
- [Standards for US Short Code Keywords (HELP/STOP/Opt-In) — Telnyx Help Center](https://support.telnyx.com/en/articles/9311492-standards-for-us-short-code-keywords-help-stop-and-opt-in-confirmation)
- [Web Crypto — Cloudflare Workers docs](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [WebCrypto support for Ed25519 — Cloudflare Community](https://community.cloudflare.com/t/webcrypto-support-for-ed25519/228897)
- [CTIA Messaging Principles & Best Practices](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms)
- [Beyond TCPA Compliance: CTIA Messaging Principles — Holland & Knight (2026)](https://www.hklaw.com/en/insights/publications/2026/05/beyond-tcpa-compliance-why-ctia-messaging-principles)
- [Understanding TCPA and CTIA Compliance for SMS — Bloomreach](https://www.bloomreach.com/en/blog/understanding-tcpa-and-ctia-compliance-for-sms-marketing-in-the-us)
- [How Much Does 10DLC Registration Cost? (2025) — Telgorithm](https://www.telgorithm.com/news/how-much-does-10dlc-registration-cost-2025-guide-for-isvs)

_Note on verification honesty: per project Principle 13/15, the code snippets and the `timestamp|rawBody` signing string are derived from Telnyx's general v2 webhook docs and Cloudflare's Web Crypto docs but were **not** run against a live Telnyx messaging webhook in this research. Treat §4's verifier and the `autoresponse_type` enumeration as **to-be-tested** against a real inbound event before marking the webhook handler done._
