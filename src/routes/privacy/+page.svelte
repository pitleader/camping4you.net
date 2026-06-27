<script lang="ts">
	import { Shield } from '@lucide/svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LegalContact from '$lib/components/LegalContact.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { site } from '$lib/content/site';
</script>

<Seo
	title="Privacy Policy | {site.name}"
	description="How Leisure Oaks Park collects, uses, and protects your information, including our service-only SMS communications."
	path="/privacy"
/>

<PageHeader
	eyebrow="Effective {site.legal.effectiveDate}"
	icon={Shield}
	title="Privacy Policy"
	lead="Leisure Oaks Park values your privacy. This policy explains how we collect, use, and protect your information."
/>

<section class="mx-auto max-w-3xl px-5 py-14 sm:py-16">
	<article class="legal-prose prose max-w-none prose-headings:font-display">
		<h2>Information we collect</h2>
		<p>We may collect the following information:</p>
		<ul>
			<li>Name</li>
			<li>Email address</li>
			<li>Phone number</li>
			<li>Reservation or service-related details you provide</li>
			<li>Communication preferences</li>
		</ul>

		<h2>How we use your information</h2>
		<p>We use your information to:</p>
		<ul>
			<li>Manage reservations, bookings, and park services</li>
			<li>Send confirmations and updates</li>
			<li>Respond to inquiries</li>
			<li>Provide customer support</li>
			<li>Improve our services</li>
		</ul>

		<h2>SMS communications</h2>
		<p>If you opt in to receive SMS messages from Leisure Oaks Park:</p>
		<ul>
			<li>Message frequency may vary.</li>
			<li>Message and data rates may apply.</li>
			<li>You can opt out at any time by replying <strong>STOP</strong>.</li>
			<li>You can reply <strong>HELP</strong> for assistance.</li>
		</ul>
		<p>
			We do <strong>not</strong> send marketing or promotional messages. All SMS communications are strictly
			service-related, such as reservation confirmations, check-in details, and park notifications.
		</p>

		<h2>Information sharing</h2>
		<p>
			We do <strong>not</strong> sell, rent, or share your personal information with third parties for
			marketing purposes. We may share information only:
		</p>
		<ul>
			<li>To comply with legal obligations</li>
			<li>To protect our rights or property</li>
			<li>With service providers necessary to deliver our services</li>
		</ul>

		<h2>Data security</h2>
		<p>We implement reasonable safeguards to protect your personal information.</p>
	</article>

	<LegalContact />
</section>
