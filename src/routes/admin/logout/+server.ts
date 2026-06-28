import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/auth';
import type { RequestHandler } from './$types';

/** POST to sign out (clears the session). GET also supported for a simple link. */
const signOut: RequestHandler = ({ cookies }) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
	redirect(303, '/admin/login');
};

export const POST = signOut;
export const GET = signOut;
