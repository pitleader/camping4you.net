<script lang="ts">
	import { DollarSign, Clock, ScrollText, ExternalLink, Pencil } from '@lucide/svelte';
	import { site } from '$lib/content/site';

	let { data } = $props();

	const sections = [
		{
			icon: DollarSign,
			title: 'Rates & extras',
			body: 'Nightly / weekly / monthly / seasonal prices and hookup add-ons.',
			href: '/admin/edit#rates'
		},
		{
			icon: Clock,
			title: 'Hours & contact',
			body: 'Office hours, phone, email, and address.',
			href: '/admin/edit#contact'
		},
		{
			icon: ScrollText,
			title: 'Rules',
			body: 'Check-in/out, quiet hours, speed limit, and rule sections.',
			href: '/admin/edit#rules'
		}
	];
</script>

<svelte:head><title>Dashboard · {site.name} Admin</title></svelte:head>

<div class="flex items-end justify-between gap-4">
	<div>
		<h1 class="font-display text-2xl font-semibold">
			Welcome back{data.user ? `, ${data.user.name.split(' ')[0]}` : ''}.
		</h1>
		<p class="mt-1 text-sm text-muted">Edit park content — changes publish to the live site.</p>
	</div>
	<a
		href={site.url}
		target="_blank"
		rel="noopener"
		class="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
	>
		View live site <ExternalLink size={15} />
	</a>
</div>

<div class="mt-8 grid gap-4 sm:grid-cols-3">
	{#each sections as s (s.title)}
		<a
			href={s.href}
			class="group rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong"
		>
			<span class="grid size-11 place-items-center rounded-xl bg-brand/12 text-brand">
				<s.icon size={22} />
			</span>
			<h2 class="mt-5 flex items-center gap-1.5 font-semibold">
				{s.title}
				<Pencil size={14} class="text-muted opacity-0 transition-opacity group-hover:opacity-100" />
			</h2>
			<p class="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
		</a>
	{/each}
</div>
