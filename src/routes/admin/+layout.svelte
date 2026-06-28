<script lang="ts">
	import { Trees, LogOut } from '@lucide/svelte';
	import { site } from '$lib/content/site';

	let { children, data } = $props();
</script>

<div class="flex min-h-dvh flex-col bg-canvas text-ink">
	<header class="border-b border-line bg-surface/60">
		<div class="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3.5">
			<a href="/admin" class="flex items-center gap-2.5 font-display font-semibold">
				<span class="grid size-8 place-items-center rounded-full bg-brand text-on-brand">
					<Trees size={18} />
				</span>
				{site.name} <span class="text-muted">· Admin</span>
			</a>
			{#if data.user}
				<div class="ml-auto flex items-center gap-4 text-sm">
					<span class="hidden text-muted sm:inline">{data.user.email}</span>
					<form method="POST" action="/admin/logout">
						<button
							class="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-line-strong hover:text-ink"
						>
							<LogOut size={15} /> Sign out
						</button>
					</form>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
		{@render children()}
	</main>
</div>
