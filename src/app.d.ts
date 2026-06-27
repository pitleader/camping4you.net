// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}

		/** Cloudflare Pages runtime env (Telnyx/OIDC secrets land here in M2/M3). */
		interface Platform {
			env?: Record<string, string | undefined>;
		}
	}
}

export {};
