import type { LayoutServerLoad } from './$types';

/** Expose the authenticated operator (or null on the login page) to admin pages. */
export const load: LayoutServerLoad = ({ locals }) => ({ user: locals.user });
