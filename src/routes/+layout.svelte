<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/content/site';

	let { children } = $props();

	// Cloudflare Web Analytics beacon (cookieless), rendered only when a token is
	// set. Emitted via {@html} so Svelte doesn't parse the inline <script>.
	const beaconTag = site.analytics.cfBeaconToken
		? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify(
				{ token: site.analytics.cfBeaconToken }
			)}'></` + `script>`
		: '';
</script>

<svelte:head>
	{#if beaconTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- code-controlled beacon tag, no user input -->
		{@html beaconTag}
	{/if}
</svelte:head>

<a
	href="#main"
	class="sr-only rounded-full bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
>
	Skip to content
</a>

<div id="top" class="flex min-h-dvh flex-col">
	<Nav />
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
