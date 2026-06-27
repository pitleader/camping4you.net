<script lang="ts">
	import {
		Phone,
		ArrowRight,
		Tent,
		Plug,
		Trees,
		MessageSquareText,
		Clock,
		LogIn,
		LogOut,
		Moon,
		Gauge,
		MapPin,
		Mail
	} from '@lucide/svelte';
	import { site, formatPrice } from '$lib/content/site';
	import Seo from '$lib/components/Seo.svelte';
	import { graph, jsonLdScript } from '$lib/seo/structured-data';

	// Marketing copy — presentational, lives with the page.
	const features = [
		{
			icon: Trees,
			title: 'Shaded oak sites',
			body: 'Spacious, quiet sites under mature oaks — room to relax, close to everything in the Peoria area.'
		},
		{
			icon: Plug,
			title: 'Full hookups',
			body: '30- and 50-amp electric with water and sewer, so your rig is set the moment you arrive.'
		},
		{
			icon: Phone,
			title: 'Simple to book',
			body: 'One call to the office reserves your stay — nightly, weekly, monthly, or for the whole season.'
		},
		{
			icon: MessageSquareText,
			title: 'Opt-in text updates',
			body: 'Choose to get reservation confirmations and check-in reminders by text. Service messages only — reply STOP anytime.'
		}
	];

	// Facts come from the single source of truth (copy-truth).
	const stays = site.rates.categories;
	const rules = [
		{ icon: LogIn, label: 'Check-in', value: site.rules.checkIn },
		{ icon: LogOut, label: 'Check-out', value: site.rules.checkOut },
		{ icon: Moon, label: 'Quiet hours', value: site.rules.quietHours },
		{ icon: Gauge, label: 'Speed limit', value: site.rules.speedLimit }
	];
</script>

<Seo
	title="Leisure Oaks Park — RV Park & Campground in Bartonville, IL"
	description="A quiet, shaded RV park and campground in Bartonville, Illinois. Full hookups, nightly to seasonal stays, and a friendly office. Call to reserve."
	path="/"
	jsonLd={jsonLdScript(graph())}
/>

<!-- ===== Hero ===================================================== -->
<section id="stay" class="relative isolate overflow-hidden">
	<!-- dusk sky -->
	<div
		class="absolute inset-0 -z-10"
		style="background:
			radial-gradient(120% 90% at 50% -10%, var(--color-pine-800) 0%, transparent 55%),
			radial-gradient(80% 60% at 80% 5%, color-mix(in oklab, var(--color-amber-500) 28%, transparent) 0%, transparent 50%),
			linear-gradient(var(--color-canvas), var(--color-canvas));"
	></div>
	<!-- stars (decorative) -->
	<svg
		class="absolute inset-0 -z-10 h-full w-full opacity-60 dark:opacity-80"
		aria-hidden="true"
		preserveAspectRatio="xMidYMid slice"
	>
		<g fill="white">
			<circle cx="12%" cy="18%" r="1" /><circle cx="22%" cy="34%" r="0.8" />
			<circle cx="38%" cy="14%" r="1.1" /><circle cx="54%" cy="26%" r="0.7" />
			<circle cx="68%" cy="12%" r="1" /><circle cx="83%" cy="30%" r="0.9" />
			<circle cx="91%" cy="18%" r="0.7" /><circle cx="46%" cy="40%" r="0.6" />
			<circle cx="7%" cy="40%" r="0.7" /><circle cx="75%" cy="42%" r="0.6" />
		</g>
	</svg>

	<div class="mx-auto max-w-6xl px-5 pt-20 pb-28 sm:pt-28 sm:pb-36">
		<p
			class="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/50 px-3.5 py-1.5 text-sm text-muted"
		>
			<MapPin size={15} class="text-accent" />
			{site.address.city}, {site.address.region}
		</p>
		<h1 class="mt-6 max-w-3xl text-5xl leading-[1.05] font-semibold text-balance sm:text-7xl">
			Your home away <span class="text-brand-strong">from home</span>.
		</h1>
		<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
			Leisure Oaks Park is a quiet, shaded campground for RVs and travelers — full hookups, easy
			access, and a friendly office that makes every stay simple.
		</p>
		<div class="mt-9 flex flex-wrap items-center gap-3">
			<a
				href="tel:{site.phone.href}"
				class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-brand shadow-lg shadow-pine-950/30 transition-colors hover:bg-brand-strong"
			>
				<Phone size={18} /> Call to reserve
			</a>
			<a
				href="#rates"
				class="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-semibold text-ink transition-colors hover:bg-surface"
			>
				View rates <ArrowRight size={18} />
			</a>
		</div>
	</div>

	<!-- pine treeline -->
	<svg
		class="block h-20 w-full text-pine-900 sm:h-28"
		viewBox="0 0 1200 120"
		preserveAspectRatio="none"
		aria-hidden="true"
		fill="currentColor"
	>
		<path
			d="M0 120 V70 l40-22 18 14 30-30 26 22 34-34 22 26 40-40 24 30 36-30 28 26 40-34 26 28 34-30 30 26 40-32 24 26 38-28 30 24 40-30 26 24 36-26 28 22 40-26 V120 Z"
		/>
	</svg>
</section>

<!-- ===== Features ================================================= -->
<section class="mx-auto max-w-6xl px-5 py-20 sm:py-24">
	<h2 class="text-3xl font-semibold sm:text-4xl">Made for an easy stay</h2>
	<p class="mt-3 max-w-xl text-muted">A simple, well-kept park with the essentials done right.</p>
	<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each features as f (f.title)}
			<article
				class="group rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong"
			>
				<span
					class="grid size-11 place-items-center rounded-xl bg-brand/12 text-brand transition-colors group-hover:bg-brand/20"
				>
					<f.icon size={22} />
				</span>
				<h3 class="mt-5 text-lg font-semibold">{f.title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
			</article>
		{/each}
	</div>
</section>

<!-- ===== Rates teaser ============================================ -->
<section id="rates" class="border-y border-line bg-surface/40">
	<div class="mx-auto max-w-6xl px-5 py-20 sm:py-24">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h2 class="text-3xl font-semibold sm:text-4xl">Stays for every season</h2>
				<p class="mt-3 max-w-lg text-muted">
					From a single night to the whole season. Call the office for current rates and
					availability.
				</p>
			</div>
			<a
				href="/rates"
				class="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-2"
			>
				Full rate sheet <ArrowRight size={16} />
			</a>
		</div>
		<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each stays as s (s.name)}
				<div class="rounded-2xl border border-line bg-canvas/60 p-6">
					<Tent size={20} class="text-accent" />
					<h3 class="mt-4 font-display text-xl font-semibold">{s.name}</h3>
					<p class="mt-1 text-sm text-muted">{s.note}</p>
					<p class="mt-5 text-sm font-medium text-brand">{formatPrice(s.price)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Rules teaser ============================================ -->
<section id="rules" class="mx-auto max-w-6xl px-5 py-20 sm:py-24">
	<div class="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
		<div>
			<h2 class="text-3xl font-semibold sm:text-4xl">A calm, well-kept park</h2>
			<p class="mt-3 max-w-md text-muted">
				A few simple rules keep Leisure Oaks quiet and clean for everyone. Here are the essentials —
				the full list is posted at the office and online.
			</p>
			<a
				href="/rules"
				class="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
			>
				Read all park rules <ArrowRight size={16} />
			</a>
		</div>
		<dl class="grid grid-cols-2 gap-4">
			{#each rules as r (r.label)}
				<div class="rounded-2xl border border-line bg-surface/60 p-5">
					<dt class="flex items-center gap-2 text-sm text-muted">
						<r.icon size={16} class="text-brand" />
						{r.label}
					</dt>
					<dd class="mt-2 font-display text-2xl font-semibold">{r.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!-- ===== Contact CTA ============================================= -->
<section id="contact" class="border-t border-line bg-surface/40">
	<div class="mx-auto max-w-6xl px-5 py-20 sm:py-24">
		<div
			class="relative isolate overflow-hidden rounded-3xl border border-line-strong bg-pine-900 px-6 py-14 text-center sm:px-12"
		>
			<div
				class="absolute inset-0 -z-10 opacity-90"
				style="background: radial-gradient(90% 120% at 50% 0%, color-mix(in oklab, var(--color-amber-500) 22%, transparent), transparent 60%);"
			></div>
			<h2 class="font-display text-3xl font-semibold text-pine-50 sm:text-4xl">
				Come stay a while.
			</h2>
			<p class="mx-auto mt-3 max-w-md text-pine-100/80">
				Reach the office by phone, email, or stop by — we'd love to hear from you.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-3">
				<a
					href="tel:{site.phone.href}"
					class="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-semibold text-on-brand transition-transform hover:scale-[1.02]"
				>
					<Phone size={18} />
					{site.phone.display}
				</a>
				<a
					href="mailto:{site.email}"
					class="inline-flex items-center gap-2 rounded-full border border-pine-50/25 px-6 py-3 font-semibold text-pine-50 transition-colors hover:bg-pine-50/10"
				>
					<Mail size={18} /> Email us
				</a>
			</div>
			<p class="mt-8 flex items-center justify-center gap-2 text-sm text-pine-100/70">
				<Clock size={15} /> Office hours: {site.hours.display}
			</p>
		</div>
	</div>
</section>
