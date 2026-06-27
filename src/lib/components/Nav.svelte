<script lang="ts">
	import { Phone, Trees } from '@lucide/svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { site } from '$lib/content/site';

	const links = [
		{ href: '/', label: 'The Park' },
		{ href: '/rates', label: 'Rates' },
		{ href: '/rules', label: 'Rules' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<header
	class="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur supports-[backdrop-filter]:bg-canvas/65"
>
	<nav class="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3.5" aria-label="Primary">
		<a href="/" class="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
			<span class="grid size-9 place-items-center rounded-full bg-brand text-on-brand">
				<Trees size={20} />
			</span>
			Leisure&nbsp;Oaks
		</a>

		<ul class="ml-auto hidden items-center gap-7 text-sm font-medium text-muted md:flex">
			{#each links as link (link.href)}
				<li>
					<a href={link.href} class="transition-colors hover:text-ink">{link.label}</a>
				</li>
			{/each}
		</ul>

		<div class="ml-auto flex items-center gap-2 md:ml-2">
			<a
				href="tel:{site.phone.href}"
				class="hidden items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong sm:inline-flex"
			>
				<Phone size={16} />
				{site.phone.display}
			</a>
			<ThemeToggle />
		</div>
	</nav>
</header>
