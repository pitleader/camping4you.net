<script lang="ts">
	import { MessageSquareText } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LegalContact from '$lib/components/LegalContact.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/content/site';
</script>

<Seo
	title="Sample SMS Messages | {site.name}"
	description="Examples of the service-only text messages Leisure Oaks Park sends after you opt in — confirmations, reminders, and park notices. Reply STOP anytime."
	path="/sms-sample"
/>

<PageHeader
	eyebrow="Effective {site.sms.effectiveDate}"
	icon={MessageSquareText}
	title="Sample SMS messages"
	lead="Examples of the messages you may receive from Leisure Oaks Park after opting in. {site.sms
		.intro}"
/>

<section class="mx-auto max-w-3xl px-5 py-14 sm:py-16">
	<ul class="space-y-4">
		{#each site.sms.samples as sample (sample.label)}
			<li class="rounded-2xl border border-line bg-surface/60 p-5">
				<p class="text-xs font-semibold tracking-wider text-accent uppercase">{sample.label}</p>
				<blockquote
					class="mt-3 border-l-2 border-brand/50 pl-4 text-sm leading-relaxed text-ink italic"
				>
					{sample.body}
				</blockquote>
			</li>
		{/each}
	</ul>

	<div class="mt-10 rounded-2xl border border-line bg-surface/40 p-6">
		<h2 class="font-display text-lg font-semibold">Message details</h2>
		<ul class="mt-4 space-y-2.5">
			{#each site.sms.details as detail (detail)}
				<li class="flex gap-2.5 text-sm leading-relaxed text-muted">
					<span class="mt-2 size-1.5 shrink-0 rounded-full bg-brand"></span>
					<span>{detail}</span>
				</li>
			{/each}
		</ul>
	</div>

	<LegalContact />
</section>
