/**
 * Admin authentication: Microsoft Entra OIDC (authorization-code + PKCE via
 * arctic) and a signed session cookie (HMAC-SHA256, Web Crypto — edge-safe).
 * Access is gated to an allowlist of operator identities. Secrets are read at
 * runtime from `$env/dynamic/private` (Cloudflare Pages secrets / `.dev.vars`)
 * and never reach the client bundle.
 */
import { MicrosoftEntraId } from 'arctic';
import { env } from '$env/dynamic/private';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_S = 60 * 60 * 8; // 8 hours

export interface AdminUser {
	sub: string;
	email: string;
	name: string;
}

interface SessionPayload extends AdminUser {
	exp: number;
}

/** Redirect URI registered in the Entra app; derived from the request origin. */
export function redirectUri(origin: string): string {
	return `${origin}/admin/auth/callback`;
}

export function entraClient(origin: string): MicrosoftEntraId {
	const tenant = env.ENTRA_TENANT_ID;
	const clientId = env.ENTRA_CLIENT_ID;
	const clientSecret = env.ENTRA_CLIENT_SECRET;
	if (!tenant || !clientId || !clientSecret) {
		throw new Error('Entra OIDC is not configured (ENTRA_TENANT_ID/CLIENT_ID/CLIENT_SECRET).');
	}
	return new MicrosoftEntraId(tenant, clientId, clientSecret, redirectUri(origin));
}

/** Is this identity allowed into the panel? Allowlist = comma/space-separated emails. */
export function isAllowed(email: string): boolean {
	const list = (env.ADMIN_ALLOWLIST ?? '')
		.split(/[,\s]+/)
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
	return list.includes(email.trim().toLowerCase());
}

/** Decode (not verify) a JWT payload — the ID token came straight from Entra's
 * token endpoint over TLS, so we read its claims directly (arctic's pattern). */
export function decodeIdTokenClaims(idToken: string): Record<string, unknown> {
	const part = idToken.split('.')[1];
	if (!part) throw new Error('Malformed ID token');
	// Decode base64url → bytes → UTF-8 (so accented names like "Stéphen" survive;
	// a plain atob() would mangle multi-byte characters).
	const json = new TextDecoder().decode(fromB64url(part));
	return JSON.parse(json);
}

// ── Signed session cookie (HMAC-SHA256 via Web Crypto) ──

function b64url(bytes: Uint8Array): string {
	let s = '';
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s: string): Uint8Array<ArrayBuffer> {
	const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
	const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
	const u = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
	return u;
}

async function hmacKey(): Promise<CryptoKey> {
	const secret = env.SESSION_SECRET;
	if (!secret) throw new Error('SESSION_SECRET is not set.');
	return crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
}

/** Create a signed session token for an authenticated, allow-listed user. */
export async function createSession(user: AdminUser, nowS: number): Promise<string> {
	const payload: SessionPayload = { ...user, exp: nowS + SESSION_TTL_S };
	const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
	const sig = await crypto.subtle.sign('HMAC', await hmacKey(), new TextEncoder().encode(body));
	return `${body}.${b64url(new Uint8Array(sig))}`;
}

/** Verify a session token; returns the user if valid + unexpired, else null. */
export async function readSession(
	token: string | undefined,
	nowS: number
): Promise<AdminUser | null> {
	if (!token || !token.includes('.')) return null;
	const [body, sig] = token.split('.');
	let ok: boolean;
	try {
		ok = await crypto.subtle.verify(
			'HMAC',
			await hmacKey(),
			fromB64url(sig),
			new TextEncoder().encode(body)
		);
	} catch {
		return null;
	}
	if (!ok) return null;
	try {
		const p = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
		if (typeof p.exp !== 'number' || p.exp < nowS) return null;
		return { sub: p.sub, email: p.email, name: p.name };
	} catch {
		return null;
	}
}

export const sessionTtlSeconds = SESSION_TTL_S;
