<script lang="ts">
	import { Snowflake, Phone, Plug, CalendarDays, Trees, ArrowRight, Mail } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site, formatPrice } from '$lib/content/site';
	import { pageGraph, jsonLdScript, type Faq } from '$lib/seo/structured-data';

	const path = '/winter-camping';
	const title = `Winter Camping & Year-Round RV Sites in Bartonville, IL | ${site.name}`;
	const description = `${site.name} is open year-round. Winter campsites with electric hookups near Peoria, Illinois — monthly winter stays welcome. Call the office to reserve.`;

	// Copy-truth: only facts the owner has confirmed are stated outright
	// (year-round operation, 30/50-amp electric, water & sewer, monthly stays).
	// Everything winter-specific that is not yet confirmed says "call the office".
	const askOffice = 'Call the office';

	const highlights = [
		{
			icon: CalendarDays,
			title: 'Open 12 months a year',
			body: 'We take campers through the winter — a night, a month, or the whole cold season.'
		},
		{
			icon: Plug,
			title: '30- and 50-amp electric',
			body: 'Run your furnace, heated hoses, and tank heaters. Ask the office which sites are set up for winter stays.'
		},
		{
			icon: Trees,
			title: 'Quiet and close to Peoria',
			body: 'A calm park minutes from Peoria, Bartonville, and the I-474 corridor — handy for work assignments and long stays.'
		}
	];

	const monthly = site.rates.categories.find((c) => c.name === 'Monthly');

	const faqs: Faq[] = [
		{
			q: 'Is Leisure Oaks Park open in the winter?',
			a: `Yes. ${site.name} is open year-round, including winter. Call ${site.phone.display} to check availability for your dates.`
		},
		{
			q: 'Do you have winter campsites available?',
			a: `Yes, we take winter campers. Which sites are set up for cold-weather stays can change through the season, so call the office at ${site.phone.display} for current availability.`
		},
		{
			q: 'Are water and sewer available in winter?',
			a: `Water and sewer are included at our sites in season. For winter hookups — including whether water is available at your site during hard freezes — call the office before you arrive so we can match you to the right site.`
		},
		{
			q: 'How much is a monthly winter stay?',
			a: `Monthly rates: ${formatPrice(monthly?.price ?? null, askOffice)}. Rates vary by season and hookup, so call ${site.phone.display} for today's winter pricing.`
		},
		{
			q: 'Do you offer long-term or year-round stays?',
			a: `Yes — nightly, weekly, monthly, and seasonal stays are all available, and monthly stays can run through the winter. Call the office to arrange a long-term site.`
		},
		{
			q: 'Where is the park?',
			a: `${site.address.street}, ${site.address.city}, ${site.address.regionCode} ${site.address.postalCode} — just south of Peoria, Illinois. Office hours are ${site.hours.display}.`
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
	eyebrow="Open year-round"
	icon={Snowflake}
	title="Winter camping near Peoria, Illinois"
	lead="Leisure Oaks Park stays open through the winter. Electric hookups, quiet shaded sites, and monthly stays for campers who need a place to park the rig when the weather turns."
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
		<h2 class="text-2xl font-semibold sm:text-3xl">What to know before a winter stay</h2>
		<p class="mt-3 max-w-2xl text-muted">
			Winter camping in central Illinois means real cold. A few things worth a quick call to the
			office before you book:
		</p>
		<dl class="mt-8 grid gap-4 sm:grid-cols-2">
			{#each [['Winter-ready sites', 'Which sites are set up for cold-weather stays'], ['Water in a freeze', 'Whether water is on at your site during hard freezes'], ['Electric on monthly stays', 'How electric is handled on a monthly winter stay'], ['Winter rates', "Today's pricing for a winter month"]] as [label, what] (label)}
				<div class="rounded-2xl border border-line bg-canvas/60 p-5">
					<dt class="font-display text-lg font-semibold">{label}</dt>
					<dd class="mt-1 text-sm text-muted">
						{what} — <span class="text-brand">{askOffice}</span>
					</dd>
				</div>
			{/each}
		</dl>
		<div class="mt-8 flex flex-wrap items-center gap-3">
			<a
				href="tel:{site.phone.href}"
				class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
			>
				<Phone size={18} />
				{site.phone.display}
			</a>
			<a
				href="/rates"
				class="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
			>
				See all rates <ArrowRight size={16} />
			</a>
		</div>
	</div>
</section>

<section class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
	<h2 class="text-2xl font-semibold sm:text-3xl">Winter camping FAQ</h2>
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
	<p class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
		<span class="inline-flex items-center gap-1.5"><Mail size={15} /> {site.email}</span>
		<span>Office hours: {site.hours.display}</span>
	</p>
</section>
