<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { theme } from '$lib/theme.svelte';
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	class="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
	aria-label="Toggle light and dark theme"
>
	{#if theme.value === 'dark'}
		<Sun size={18} />
	{:else}
		<Moon size={18} />
	{/if}
</button>
