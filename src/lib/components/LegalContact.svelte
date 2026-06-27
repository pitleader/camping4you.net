<script lang="ts">
	import { site } from '$lib/content/site';
</script>

<div class="mt-10 rounded-2xl border border-line bg-surface/60 p-6 not-prose">
	<h2 class="font-display text-lg font-semibold text-ink">Contact information</h2>
	<address class="mt-3 space-y-1 text-sm text-muted not-italic">
		<div class="font-medium text-ink">{site.legalName}</div>
		<div>
			Email:
			<a href="mailto:{site.email}" class="text-brand hover:text-brand-strong">{site.email}</a>
		</div>
		<div>
			Phone:
			<a href="tel:{site.phone.href}" class="text-brand hover:text-brand-strong"
				>{site.phone.display}</a
			>
		</div>
		<div>
			Address: {site.address.street}, {site.address.city}, {site.address.regionCode}
			{site.address.postalCode}
		</div>
	</address>
</div>
