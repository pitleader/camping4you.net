<script lang="ts">
	import { Tag, Phone, Tent } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { site, formatPrice } from '$lib/content/site';

	const { categories, extras } = site.rates;
</script>

<PageHeader
	eyebrow="Rates"
	icon={Tag}
	title="Campground rates"
	lead="Stays for a night, a week, a month, or the whole season. Call the office for current rates and availability — we're happy to help you find the right fit."
/>

<section class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
	<h2 class="text-xl font-semibold">Stays</h2>
	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		{#each categories as c (c.name)}
			<div
				class="flex items-center justify-between rounded-2xl border border-line bg-surface/60 p-5"
			>
				<div>
					<h3 class="font-display text-lg font-semibold">{c.name}</h3>
					<p class="mt-0.5 text-sm text-muted">{c.note}</p>
				</div>
				<span class="text-sm font-semibold text-brand">{formatPrice(c.price)}</span>
			</div>
		{/each}
	</div>

	<h2 class="mt-12 text-xl font-semibold">Hookups & extras</h2>
	<ul
		class="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/60"
	>
		{#each extras as e (e.name)}
			<li class="flex items-center justify-between px-5 py-4">
				<span class="text-sm">{e.name}</span>
				<span class="text-sm font-medium {e.price !== null ? 'text-brand' : 'text-muted'}">
					{formatPrice(e.price)}
				</span>
			</li>
		{/each}
	</ul>

	<div
		class="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-line-strong bg-pine-900/40 p-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<p class="flex items-center gap-2.5 text-sm text-muted">
			<Tent size={18} class="shrink-0 text-accent" />
			Rates vary by season and availability — call for today's pricing and to reserve your site.
		</p>
		<a
			href="tel:{site.phone.href}"
			class="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong"
		>
			<Phone size={16} />
			{site.phone.display}
		</a>
	</div>
</section>
