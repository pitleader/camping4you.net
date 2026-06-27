<script lang="ts">
	import { ScrollText, LogIn, LogOut, Moon, Gauge, Check } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { site } from '$lib/content/site';

	const quick = [
		{ icon: LogIn, label: 'Check-in', value: site.rules.checkIn },
		{ icon: LogOut, label: 'Check-out', value: site.rules.checkOut },
		{ icon: Moon, label: 'Quiet hours', value: site.rules.quietHours },
		{ icon: Gauge, label: 'Speed limit', value: site.rules.speedLimit }
	];
</script>

<PageHeader
	eyebrow="Park rules"
	icon={ScrollText}
	title="Campground rules"
	lead="A few simple rules keep Leisure Oaks quiet, clean, and safe for everyone. Thanks for helping us keep the park a great place to stay."
/>

<section class="mx-auto max-w-4xl px-5 py-14 sm:py-16">
	<dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each quick as q (q.label)}
			<div class="rounded-2xl border border-line bg-surface/60 p-5">
				<dt class="flex items-center gap-2 text-sm text-muted">
					<q.icon size={16} class="text-brand" />
					{q.label}
				</dt>
				<dd class="mt-2 font-display text-xl font-semibold">{q.value}</dd>
			</div>
		{/each}
	</dl>

	<div class="mt-12 grid gap-8 sm:grid-cols-2">
		{#each site.rules.sections as section (section.heading)}
			<section class="rounded-2xl border border-line bg-surface/40 p-6">
				<h2 class="font-display text-lg font-semibold text-brand-strong">{section.heading}</h2>
				<ul class="mt-4 space-y-3">
					{#each section.rules as rule (rule)}
						<li class="flex gap-2.5 text-sm leading-relaxed text-muted">
							<Check size={16} class="mt-0.5 shrink-0 text-brand" />
							<span>{rule}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>
