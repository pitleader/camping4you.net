<script lang="ts">
	import { MapPin, Phone, Mail, Trees, Star } from '@lucide/svelte';
	import { site } from '$lib/content/site';

	const year = 2026;
</script>

<footer class="border-t border-line bg-surface/60">
	<div class="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
		<div class="lg:col-span-2">
			<div class="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
				<span class="grid size-8 place-items-center rounded-full bg-brand text-on-brand">
					<Trees size={18} />
				</span>
				Leisure Oaks Park
			</div>
			<p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">
				Your home away from home — a quiet, shaded campground in Bartonville, Illinois.
			</p>
			{#if site.reviewUrl}
				<a
					href={site.reviewUrl}
					target="_blank"
					rel="noopener"
					class="mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2"
				>
					<Star size={15} class="text-accent" /> Leave us a review
				</a>
			{/if}
		</div>

		<div>
			<h2 class="text-xs font-semibold tracking-wider text-muted uppercase">Visit</h2>
			<ul class="mt-4 space-y-3 text-sm text-muted">
				<li class="flex gap-2.5">
					<MapPin size={16} class="mt-0.5 shrink-0 text-brand" />
					<span
						>{site.address.street}<br />{site.address.city}, {site.address.regionCode}
						{site.address.postalCode}</span
					>
				</li>
				<li>
					<a href="tel:{site.phone.href}" class="flex gap-2.5 transition-colors hover:text-ink">
						<Phone size={16} class="shrink-0 text-brand" />
						{site.phone.display}
					</a>
				</li>
				<li>
					<a href="mailto:{site.email}" class="flex gap-2.5 transition-colors hover:text-ink">
						<Mail size={16} class="shrink-0 text-brand" />
						{site.email}
					</a>
				</li>
			</ul>
		</div>

		<div>
			<h2 class="text-xs font-semibold tracking-wider text-muted uppercase">Policies</h2>
			<ul class="mt-4 space-y-3 text-sm text-muted">
				<li><a href="/privacy" class="transition-colors hover:text-ink">Privacy Policy</a></li>
				<li><a href="/terms" class="transition-colors hover:text-ink">Terms of Service</a></li>
				<li>
					<a href="/sms-sample" class="transition-colors hover:text-ink">Sample SMS Messages</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-line">
		<p class="mx-auto max-w-6xl px-5 py-6 text-xs text-muted">
			© {year} Leisure Oaks Park. All rights reserved.
		</p>
	</div>
</footer>
