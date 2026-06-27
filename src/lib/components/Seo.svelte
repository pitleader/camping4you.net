<script lang="ts">
	import { site } from '$lib/content/site';

	type Props = {
		title: string;
		description: string;
		/** Canonical path, e.g. "/" — resolved against site.url. */
		path?: string;
		/** OG/Twitter share image path or absolute URL. Falls back to site.ogImage. */
		image?: string | null;
		type?: 'website' | 'article';
		/** Pre-serialized JSON-LD (use jsonLdScript from $lib/seo). */
		jsonLd?: string;
		/** Set false to noindex. Default: indexable. */
		index?: boolean;
	};

	let {
		title,
		description,
		path = '/',
		image,
		type = 'website',
		jsonLd,
		index = true
	}: Props = $props();

	const abs = (p: string) => (p.startsWith('http') ? p : new URL(p, site.url).href);

	const canonical = $derived(abs(path));
	const shareImage = $derived(image ?? site.ogImage);
	const ogImage = $derived(shareImage ? abs(shareImage) : null);
	const robots = $derived(index ? 'index, follow' : 'noindex, follow');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta name="robots" content={robots} />

	{#if site.verification.google}
		<meta name="google-site-verification" content={site.verification.google} />
	{/if}
	{#if site.verification.bing}
		<meta name="msvalidate.01" content={site.verification.bing} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="en_US" />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta
			property="og:image:alt"
			content={`${site.name} — ${site.address.city}, ${site.address.region}`}
		/>
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}

	<!-- Local / geo signals -->
	<meta name="geo.region" content={`US-${site.address.regionCode}`} />
	<meta name="geo.placename" content={site.address.city} />
	{#if site.geo}
		<meta name="geo.position" content={`${site.geo.lat};${site.geo.lng}`} />
		<meta name="ICBM" content={`${site.geo.lat}, ${site.geo.lng}`} />
	{/if}

	{#if jsonLd}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- code-controlled JSON-LD; no user input -->
		{@html `<script type="application/ld+json">${jsonLd}</` + `script>`}
	{/if}
</svelte:head>
