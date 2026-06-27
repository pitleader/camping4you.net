import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode project-wide (except libraries). Removable in Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Cloudflare Pages: SSR + form actions / API routes run as Pages
			// Functions on the Workers runtime.
			adapter: adapter(),

			// Inline page CSS into <head> instead of a render-blocking <link> —
			// removes the critical-path request before first paint.
			inlineStyleThreshold: 60000,

			prerender: {
				// The home page already links to these pages; M1.T3 builds them.
				// Tolerate ONLY these known-pending routes — any other broken
				// link still fails the build.
				handleHttpError: ({ path, message }) => {
					const pending = ['/rates', '/rules', '/contact', '/privacy', '/terms', '/sms-sample'];
					if (pending.includes(path)) return;
					throw new Error(message);
				}
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
