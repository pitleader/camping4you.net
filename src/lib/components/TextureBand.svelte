<!--
	Decorative texture layer for a section backdrop.

	Renders nothing at all when the slot has no generated derivatives, so the site
	is complete with or without photography — drop an original in assets/source/,
	run `npm run img`, and the band appears.

	It is purely ornamental: aria-hidden with an empty alt, lazily loaded so it
	never competes for the largest paint, and absolutely positioned inside its
	section so it cannot contribute layout shift.
-->
<script lang="ts">
	let { name, class: className = '' }: { name: string; class?: string } = $props();

	type UrlMap = Record<string, string>;

	// Eager URL globs: Vite resolves these at build time, so an absent slot costs
	// nothing at runtime and ships no markup.
	const avifFiles = import.meta.glob('/src/lib/assets/img/*.avif', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as UrlMap;

	const webpFiles = import.meta.glob('/src/lib/assets/img/*.webp', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as UrlMap;

	/** Collect `<name>-<width>.<ext>` entries into a width-ordered srcset. */
	const srcsetFor = (files: UrlMap): { srcset: string; widest: string } | null => {
		const pattern = new RegExp(`/${name}-(\\d+)\\.[a-z0-9]+$`);
		const found = Object.entries(files)
			.map(([path, url]) => {
				const match = pattern.exec(path);
				return match ? { width: Number(match[1]), url } : null;
			})
			.filter((entry): entry is { width: number; url: string } => entry !== null)
			.sort((a, b) => a.width - b.width);

		if (!found.length) return null;
		return {
			srcset: found.map((f) => `${f.url} ${f.width}w`).join(', '),
			widest: found[found.length - 1].url
		};
	};

	const avif = $derived(srcsetFor(avifFiles));
	const webp = $derived(srcsetFor(webpFiles));
	const fallback = $derived(webp?.widest ?? avif?.widest ?? null);
</script>

{#if fallback}
	<div
		class="band pointer-events-none absolute inset-0 -z-10 overflow-hidden {className}"
		aria-hidden="true"
	>
		<picture>
			{#if avif}
				<source type="image/avif" srcset={avif.srcset} sizes="100vw" />
			{/if}
			{#if webp}
				<source type="image/webp" srcset={webp.srcset} sizes="100vw" />
			{/if}
			<img src={fallback} alt="" loading="lazy" decoding="async" />
		</picture>
	</div>
{/if}

<style>
	.band img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Held well back: the texture is a surface the content sits on, never
		   something competing with it. Tuned per theme because the night canvas
		   swallows detail the morning canvas exaggerates. */
		opacity: 0.08;
		filter: grayscale(0.7);
		mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
	}

	/* Inverted for the light theme so a dark original reads as light relief on
	   the warm canvas instead of a grey smudge. */
	:global(html[data-theme='light']) .band img {
		opacity: 0.05;
		filter: grayscale(0.85) invert(1);
	}
</style>
