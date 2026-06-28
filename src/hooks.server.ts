import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { SESSION_COOKIE, readSession } from '$lib/server/auth';

/** Public /admin paths reachable without a session (the login round-trip itself). */
const ADMIN_PUBLIC = ['/admin/login', '/admin/auth', '/admin/logout'];

/** Resolve the session → event.locals.user, then gate the protected /admin area. */
const auth: Handle = async ({ event, resolve }) => {
	const nowS = Math.floor(Date.now() / 1000);
	event.locals.user = await readSession(event.cookies.get(SESSION_COOKIE), nowS);

	const { pathname } = event.url;
	if (pathname.startsWith('/admin') && !ADMIN_PUBLIC.some((p) => pathname.startsWith(p))) {
		if (!event.locals.user) {
			redirect(303, `/admin/login?from=${encodeURIComponent(pathname)}`);
		}
	}
	return resolve(event);
};

/** Security headers on every response (static pages also get them via _headers). */
const securityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const h = response.headers;
	h.set('X-Content-Type-Options', 'nosniff');
	h.set('X-Frame-Options', 'DENY');
	h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
	h.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	h.set('Cross-Origin-Opener-Policy', 'same-origin');
	return response;
};

export const handle = sequence(auth, securityHeaders);
