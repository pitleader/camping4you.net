<script lang="ts">
	import { FileText } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LegalContact from '$lib/components/LegalContact.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/content/site';
</script>

<Seo
	title="Terms & Conditions | {site.name}"
	description="The terms for using Leisure Oaks Park's website and services, including our service-only SMS terms."
	path="/terms"
/>

<PageHeader
	eyebrow="Effective {site.legal.effectiveDate}"
	icon={FileText}
	title="Terms & Conditions"
	lead="By using our website or services, you agree to the following terms."
/>

<section class="mx-auto max-w-3xl px-5 py-14 sm:py-16">
	<article class="legal-prose prose max-w-none prose-headings:font-display">
		<h2>Services</h2>
		<p>
			Leisure Oaks Park provides park facilities, reservations, event hosting, and related services.
			Service availability and features may vary depending on scheduling and capacity.
		</p>

		<h2>Payments</h2>
		<p>
			Payment is due at the time of booking unless otherwise stated. Failure to pay may result in
			cancellation of reservations.
		</p>

		<h2>Limitation of liability</h2>
		<p>
			Leisure Oaks Park is not liable for indirect, incidental, or consequential damages arising
			from the use of our facilities or services. Visitors are responsible for their personal
			belongings and conduct while on the premises.
		</p>

		<h2>SMS terms of service</h2>
		<p>
			By opting into SMS communications from Leisure Oaks Park, you agree to receive service-related
			text messages only. We do not send marketing or promotional messages.
		</p>
		<ul>
			<li>Message frequency varies.</li>
			<li>Message and data rates may apply.</li>
			<li>Text <strong>STOP</strong> to unsubscribe.</li>
			<li>Text <strong>HELP</strong> for assistance.</li>
		</ul>
		<p>Consent to receive SMS messages is not a condition of purchase.</p>

		<h2>Modifications</h2>
		<p>
			We may update these Terms &amp; Conditions at any time. Updates will be posted on this page
			with a revised effective date.
		</p>
	</article>

	<LegalContact />
</section>
