<script lang="ts">
	import { MapPin, Phone, Plug, CalendarDays, Trees, ArrowRight, Navigation } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site, formattedAddress } from '$lib/content/site';
	import { pageGraph, jsonLdScript, type Faq } from '$lib/seo/structured-data';

	const path = '/rv-park-peoria';
	const title = `RV Park Near Peoria, IL — 15 Minutes from Downtown | ${site.name}`;
	const description = `${site.name} is an RV park just south of Peoria in Bartonville, IL — about 15 minutes from downtown Peoria and 10 from Pekin. Full hookups, monthly stays, open year-round.`;

	// Drive times: OSRM driving route from the park's geocode, rounded
	// (measured 2026-09-21). Keep these approximate — they are not live traffic.
	const nearby = [
		{ place: 'Pekin (downtown)', time: 'about 10 min', miles: '5 mi' },
		{ place: 'Peoria International Airport', time: 'about 15 min', miles: '6 mi' },
		{ place: 'Downtown Peoria', time: 'about 15 min', miles: '8 mi' },
		{ place: 'East Peoria', time: 'about 15 min', miles: '8 mi' },
		{ place: 'Bradley University', time: 'about 15 min', miles: '8 mi' },
		{ place: 'OSF Saint Francis Medical Center', time: 'about 17 min', miles: '8 mi' }
	];

	const highlights = [
		{
			icon: MapPin,
			title: 'Just south of Peoria',
			body: 'In Bartonville, off the I-474 corridor — close to Peoria, Pekin, and East Peoria without the city noise.'
		},
		{
			icon: Plug,
			title: 'Full hookups',
			body: '30- and 50-amp electric, with water and sewer at the site.'
		},
		{
			icon: CalendarDays,
			title: 'Nightly to seasonal',
			body: 'Stay a night, a week, a month, or the season. Open 12 months a year.'
		}
	];

	const faqs: Faq[] = [
		{
			q: 'How far is Leisure Oaks Park from Peoria?',
			a: `About 8 miles — roughly 15 minutes to downtown Peoria. The park is at ${formattedAddress()}, just south of the city.`
		},
		{
			q: 'Is there an RV park near Peoria that takes monthly stays?',
			a: `Yes. ${site.name} offers nightly, weekly, monthly, and seasonal stays, including monthly stays through the winter. Call ${site.phone.display} for availability.`
		},
		{
			q: 'Is it a good base for work in Peoria or Pekin?',
			a: `Many of our guests are workcampers and people on work assignments. Downtown Peoria, the hospitals, and Pekin are all within about 15–20 minutes.`
		},
		{
			q: 'Are you open year-round?',
			a: `Yes — 365 days a year. See our winter camping page for how the park runs in the cold months.`
		}
	];
</script>

<Seo
	{title}
	{description}
	{path}
	jsonLd={jsonLdScript(pageGraph(path, { name: title, description, faqs }))}
/>

<PageHeader
	eyebrow="Bartonville, IL"
	icon={Trees}
	title="RV park near Peoria, Illinois"
	lead="Leisure Oaks Park sits just south of Peoria in Bartonville — about 15 minutes from downtown. Full hookups, quiet shaded sites, and stays from a night to a full season."
/>

<section class="mx-auto max-w-6xl px-5 py-14 sm:py-16">
	<div class="grid gap-5 sm:grid-cols-3">
		{#each highlights as h (h.title)}
			<article class="rounded-2xl border border-line bg-surface/60 p-6">
				<span class="grid size-11 place-items-center rounded-xl bg-brand/12 text-brand">
					<h.icon size={22} />
				</span>
				<h2 class="mt-5 text-lg font-semibold">{h.title}</h2>
				<p class="mt-2 text-sm leading-relaxed text-muted">{h.body}</p>
			</article>
		{/each}
	</div>
</section>

<section class="border-y border-line bg-surface/40">
	<div class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
		<h2 class="text-2xl font-semibold sm:text-3xl">Drive times from the park</h2>
		<p class="mt-3 max-w-2xl text-muted">Approximate, without traffic.</p>
		<ul class="mt-8 divide-y divide-line rounded-2xl border border-line bg-canvas/60">
			{#each nearby as n (n.place)}
				<li class="flex items-center justify-between gap-4 px-5 py-3.5">
					<span class="inline-flex items-center gap-2 font-medium">
						<Navigation size={16} class="text-brand" />
						{n.place}
					</span>
					<span class="text-sm text-muted">{n.time} · {n.miles}</span>
				</li>
			{/each}
		</ul>
		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a
				href="tel:{site.phone.href}"
				class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
			>
				<Phone size={18} />
				{site.phone.display}
			</a>
			<a
				href="/winter-camping"
				class="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
			>
				Winter camping <ArrowRight size={16} />
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
	<h2 class="text-2xl font-semibold sm:text-3xl">Peoria-area RV stays: FAQ</h2>
	<div class="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface/60">
		{#each faqs as f (f.q)}
			<details class="group px-5 py-4">
				<summary class="cursor-pointer list-none font-medium text-ink marker:content-none">
					{f.q}
				</summary>
				<p class="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
			</details>
		{/each}
	</div>
</section>
