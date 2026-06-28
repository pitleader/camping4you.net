<script lang="ts">
	import { Phone, Mail, MapPin, Clock, Navigation, Star } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site, formattedAddress } from '$lib/content/site';

	const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
		formattedAddress()
	)}`;
</script>

<Seo
	title="Contact | {site.name}"
	description="Reach Leisure Oaks Park by phone or email, or stop by. {formattedAddress()}. Office hours {site
		.hours.display}."
	path="/contact"
/>

<PageHeader
	eyebrow="Contact"
	icon={Phone}
	title="Get in touch"
	lead="Reach the office by phone or email, or stop by — we'd love to hear from you and help plan your stay."
/>

<section class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="tel:{site.phone.href}"
			class="group flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong"
		>
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
				<Phone size={20} />
			</span>
			<span>
				<span class="block text-sm text-muted">Call the office</span>
				<span class="mt-0.5 block font-display text-lg font-semibold">{site.phone.display}</span>
			</span>
		</a>

		<a
			href="mailto:{site.email}"
			class="group flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong"
		>
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
				<Mail size={20} />
			</span>
			<span>
				<span class="block text-sm text-muted">Email us</span>
				<span class="mt-0.5 block font-display text-lg font-semibold break-all">{site.email}</span>
			</span>
		</a>

		<div class="flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6">
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
				<MapPin size={20} />
			</span>
			<div>
				<span class="block text-sm text-muted">Visit</span>
				<span class="mt-0.5 block font-medium">
					{site.address.street}<br />
					{site.address.city}, {site.address.regionCode}
					{site.address.postalCode}
				</span>
				<a
					href={directions}
					target="_blank"
					rel="noopener"
					class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-strong"
				>
					<Navigation size={14} /> Get directions
				</a>
			</div>
		</div>

		<div class="flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6">
			<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/12 text-brand">
				<Clock size={20} />
			</span>
			<div>
				<span class="block text-sm text-muted">Office hours</span>
				<span class="mt-0.5 block font-medium">{site.hours.display}</span>
			</div>
		</div>

		{#if site.reviewUrl}
			<a
				href={site.reviewUrl}
				target="_blank"
				rel="noopener"
				class="group flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong sm:col-span-2"
			>
				<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
					<Star size={20} />
				</span>
				<span>
					<span class="block text-sm text-muted">Enjoyed your stay?</span>
					<span class="mt-0.5 block font-display text-lg font-semibold"
						>Leave us a Google review</span
					>
				</span>
			</a>
		{/if}
	</div>
</section>
