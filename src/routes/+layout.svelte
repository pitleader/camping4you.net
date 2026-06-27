<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<a
	href="#main"
	class="sr-only rounded-full bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100]"
>
	Skip to content
</a>

<div id="top" class="flex min-h-dvh flex-col">
	<Nav />
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
