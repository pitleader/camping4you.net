<script lang="ts">
	import type { Component } from 'svelte';

	let {
		eyebrow,
		title,
		lead,
		icon: Icon
	}: { eyebrow?: string; title: string; lead?: string; icon?: Component } = $props();
</script>

<header class="relative isolate overflow-hidden border-b border-line">
	<div
		class="absolute inset-0 -z-10"
		style="background:
			radial-gradient(90% 120% at 15% -20%, var(--color-pine-800) 0%, transparent 55%),
			radial-gradient(70% 100% at 95% -10%, color-mix(in oklab, var(--color-amber-500) 18%, transparent) 0%, transparent 55%);"
	></div>
	<div class="mx-auto max-w-4xl px-5 pt-16 pb-12 sm:pt-20 sm:pb-14">
		{#if eyebrow}
			<p class="flex items-center gap-2 text-sm font-medium text-accent">
				{#if Icon}<Icon size={16} />{/if}
				{eyebrow}
			</p>
		{/if}
		<h1 class="mt-3 text-4xl font-semibold text-balance sm:text-5xl">{title}</h1>
		{#if lead}
			<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted text-pretty">{lead}</p>
		{/if}
	</div>
</header>
