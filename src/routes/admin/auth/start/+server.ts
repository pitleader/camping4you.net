import { redirect } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { entraClient } from '$lib/server/auth';
import type { RequestHandler } from './$types';

const TEN_MIN = 60 * 10;

/** Begin the OIDC flow: stash state + PKCE verifier, redirect to Entra. */
export const GET: RequestHandler = ({ url, cookies, locals }) => {
	if (locals.user) redirect(303, '/admin');

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const authUrl = entraClient(url.origin).createAuthorizationURL(state, codeVerifier, [
		'openid',
		'profile',
		'email'
	]);

	const opts = {
		path: '/admin',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'lax' as const,
		maxAge: TEN_MIN
	};
	cookies.set('oauth_state', state, opts);
	cookies.set('oauth_verifier', codeVerifier, opts);
	cookies.set('oauth_from', url.searchParams.get('from') ?? '/admin', opts);

	redirect(302, authUrl.toString());
};
