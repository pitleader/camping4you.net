<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/content/site';

	let { children } = $props();

	// The /admin area brings its own chrome — no public marketing nav/footer.
	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	// Cloudflare Web Analytics beacon (cookieless), rendered only when a token is
	// set. Emitted via {@html} so Svelte doesn't parse the inline <script>.
	const beaconTag = site.analytics.cfBeaconToken
		? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='${JSON.stringify(
				{ token: site.analytics.cfBeaconToken }
			)}'></` + `script>`
		: '';

	// Google Ads conversion tag, rendered only when an Ads id is configured.
	// The tel: click conversion is wired below via a document-level listener.
	const ads = site.ads;
	const gtagTag = ads.conversionId
		? `<script async src="https://www.googletagmanager.com/gtag/js?id=${ads.conversionId}"></` +
			`script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ads.conversionId}');</` +
			`script>`
		: '';

	// Every phone-number tap is the site's one conversion. Delegated so it
	// covers tel: links on every page without touching each anchor.
	function onTelClick(e: MouseEvent) {
		if (!ads.conversionId || !ads.callLabel) return;
		const a = (e.target as Element | null)?.closest('a[href^="tel:"]');
		if (!a) return;
		const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
		g?.('event', 'conversion', { send_to: `${ads.conversionId}/${ads.callLabel}` });
	}
</script>

<svelte:document onclick={onTelClick} />

<svelte:head>
	{#if beaconTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- code-controlled beacon tag, no user input -->
		{@html beaconTag}
	{/if}
	{#if gtagTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- code-controlled Ads tag, no user input -->
		{@html gtagTag}
	{/if}
</svelte:head>

<a
	href="#main"
	class="sr-only rounded-full bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
>
	Skip to content
</a>

{#if isAdmin}
	{@render children()}
{:else}
	<div id="top" class="flex min-h-dvh flex-col">
		<Nav />
		<main id="main" class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
