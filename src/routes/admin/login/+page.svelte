<script lang="ts">
	import { site } from '$lib/content/site';
</script>

<svelte:head><title>Sign in · {site.name} Admin</title></svelte:head>

<div class="mx-auto max-w-sm py-10 text-center">
	<h1 class="font-display text-2xl font-semibold">Admin sign-in</h1>
	<p class="mt-2 text-sm text-muted">
		Sign in with your authorized Microsoft account to manage park content.
	</p>
	<a
		href="/admin/auth/start"
		data-sveltekit-reload
		class="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
	>
		<svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
			<rect x="1" y="1" width="9" height="9" fill="#f25022" />
			<rect x="11" y="1" width="9" height="9" fill="#7fba00" />
			<rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
			<rect x="11" y="11" width="9" height="9" fill="#ffb900" />
		</svg>
		Sign in with Microsoft
	</a>
</div>
