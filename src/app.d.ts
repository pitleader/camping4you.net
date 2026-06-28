// See https://svelte.dev/docs/kit/types#app.d.ts
import type { AdminUser } from '$lib/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** The authenticated, allow-listed operator, or null. Set in hooks. */
			user: AdminUser | null;
		}
		// interface PageData {}
		// interface PageState {}

		/** Cloudflare Pages runtime env (Entra/GitHub secrets bind here). */
		interface Platform {
			env?: Record<string, string | undefined>;
		}
	}
}

export {};
