import { error, redirect } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import {
	entraClient,
	decodeIdTokenClaims,
	isAllowed,
	createSession,
	SESSION_COOKIE,
	sessionTtlSeconds
} from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');
	const codeVerifier = cookies.get('oauth_verifier');
	const from = cookies.get('oauth_from') ?? '/admin';

	// Clear the short-lived flow cookies regardless of outcome.
	for (const c of ['oauth_state', 'oauth_verifier', 'oauth_from']) {
		cookies.delete(c, { path: '/admin' });
	}

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		error(400, 'Invalid or expired sign-in attempt. Please try again.');
	}

	let claims: Record<string, unknown>;
	try {
		const tokens = await entraClient(url.origin).validateAuthorizationCode(code, codeVerifier);
		claims = decodeIdTokenClaims(tokens.idToken());
	} catch (e) {
		if (e instanceof OAuth2RequestError) error(401, 'Microsoft sign-in failed.');
		throw e;
	}

	const email = String(claims.email ?? claims.preferred_username ?? claims.upn ?? '').toLowerCase();
	const name = String(claims.name ?? email);
	const sub = String(claims.oid ?? claims.sub ?? email);

	if (!email || !isAllowed(email)) {
		error(403, 'This Microsoft account is not authorized for the Leisure Oaks admin.');
	}

	const session = await createSession({ sub, email, name }, Math.floor(Date.now() / 1000));
	cookies.set(SESSION_COOKIE, session, {
		path: '/',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'lax',
		maxAge: sessionTtlSeconds
	});

	redirect(303, from.startsWith('/admin') ? from : '/admin');
};
