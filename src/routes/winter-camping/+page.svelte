<script lang="ts">
	import { Snowflake, Phone, Plug, CalendarDays, Trees, ArrowRight, Mail } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/content/site';
	import { pageGraph, jsonLdScript, type Faq } from '$lib/seo/structured-data';

	const path = '/winter-camping';
	const title = `Winter Camping & Year-Round RV Sites in Bartonville, IL | ${site.name}`;
	const description = `${site.name} is open year-round. Winter campsites with electric hookups near Peoria, Illinois — monthly winter stays welcome. Call the office to reserve.`;

	// Copy-truth: only facts the owner has confirmed are stated outright —
	// year-round operation, a subset of winter-capable sites (count unconfirmed),
	// water from underground spigots (heated hose required), sewer, bathhouse and
	// laundry open weather permitting, gravel roads with limited plowing, metered
	// electric. Site availability and winter rates stay "call the office".
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
			body: 'Run your furnace, heated hose, and tank heaters. Electric is metered, so you pay for what you use.'
		},
		{
			icon: Trees,
			title: 'Quiet and close to Peoria',
			body: 'A calm park minutes from Peoria, Bartonville, and the I-474 corridor — handy for workcampers, work assignments, and long stays.'
		}
	];

	const faqs: Faq[] = [
		{
			q: 'Is Leisure Oaks Park open in the winter?',
			a: `Yes. ${site.name} is open year-round, including winter. Call ${site.phone.display} to check availability for your dates.`
		},
		{
			q: 'Do you have winter campsites available?',
			a: `Yes, but not every site is winter-capable — a limited set of sites is set up for cold-weather stays, so call the office at ${site.phone.display} for current availability.`
		},
		{
			q: 'Are water and sewer available in winter?',
			a: `Yes. Sewer is available all winter, and water comes from underground spigots — bring a heated supply hose to keep your line from freezing.`
		},
		{
			q: 'Are the bathhouse and laundry open in winter?',
			a: `Yes, weather permitting.`
		},
		{
			q: 'Are the roads plowed?',
			a: `Park roads are gravel, so snow clearing is limited. Plan for winter road conditions, especially after a heavy snow.`
		},
		{
			q: 'Is electric included on a winter stay?',
			a: `Electric is metered on every site, all year, so you pay for what you use. We offer 30- and 50-amp service.`
		},
		{
			q: 'How much is a monthly winter stay?',
			a: `Winter rates depend on the length of your rig and your stay, so call ${site.phone.display} for a quote. Electric is metered separately.`
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
			Winter camping in central Illinois means real cold. Here's how the park runs in winter:
		</p>
		<dl class="mt-8 grid gap-4 sm:grid-cols-2">
			{#each [['Winter-ready sites', 'Only some sites are winter-capable', askOffice], ['Water', 'Underground spigots — bring a heated supply hose', null], ['Sewer, bathhouse, laundry', 'Sewer all winter; bathhouse and laundry open weather permitting', null], ['Roads', 'Gravel roads, limited plowing', null], ['Electric', 'Metered — you pay for what you use', null], ['Winter rates', 'Based on rig length and length of stay', askOffice]] as [label, what, cta] (label)}
				<div class="rounded-2xl border border-line bg-canvas/60 p-5">
					<dt class="font-display text-lg font-semibold">{label}</dt>
					<dd class="mt-1 text-sm text-muted">
						{what}{#if cta}
							— <span class="text-brand">{cta}</span>{/if}
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
