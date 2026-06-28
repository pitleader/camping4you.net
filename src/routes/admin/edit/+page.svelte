<script lang="ts">
	import { enhance } from '$app/forms';
	import { Save, ExternalLink, CircleCheck, CircleAlert } from '@lucide/svelte';
	import { site } from '$lib/content/site';

	let { data, form } = $props();
	const c = $derived(data.content);

	let saving = $state(false);

	const field =
		'w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none';
	const label = 'block text-xs font-medium text-muted mb-1.5';
	const card = 'rounded-2xl border border-line bg-surface/60 p-6';
</script>

<svelte:head><title>Edit content · {site.name} Admin</title></svelte:head>

<div class="flex items-end justify-between gap-4">
	<div>
		<h1 class="font-display text-2xl font-semibold">Edit park content</h1>
		<p class="mt-1 text-sm text-muted">
			Saving commits the change and rebuilds the site (live in ~1–2 minutes).
		</p>
	</div>
	<a href="/admin" class="text-sm text-muted hover:text-ink">← Dashboard</a>
</div>

{#if form?.success}
	<div
		class="mt-6 flex items-center gap-2.5 rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm"
	>
		<CircleCheck size={18} class="text-brand" />
		Saved — the site is rebuilding.
		<a
			href={form.commitUrl}
			target="_blank"
			rel="noopener"
			class="ml-1 inline-flex items-center gap-1 font-medium text-brand hover:underline"
		>
			view commit <ExternalLink size={13} />
		</a>
	</div>
{:else if form?.saveError}
	<div
		class="mt-6 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
	>
		<CircleAlert size={18} class="text-amber-500" /> Save failed: {form.saveError}
	</div>
{:else if form?.validation}
	<div
		class="mt-6 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
	>
		<CircleAlert size={18} class="text-amber-500" /> Some fields need fixing — check required values.
	</div>
{/if}

<form
	method="POST"
	action="?/save"
	class="mt-8 space-y-6"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update({ reset: false });
			saving = false;
		};
	}}
>
	<!-- Contact & hours -->
	<section id="contact" class={card}>
		<h2 class="font-display text-lg font-semibold">Contact & hours</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2">
			<div>
				<label class={label} for="phone_display">Phone (shown)</label><input
					class={field}
					id="phone_display"
					name="phone_display"
					value={c.phone.display}
				/>
			</div>
			<div>
				<label class={label} for="phone_href">Phone (dial)</label><input
					class={field}
					id="phone_href"
					name="phone_href"
					value={c.phone.href}
				/>
			</div>
			<div class="sm:col-span-2">
				<label class={label} for="email">Email</label><input
					class={field}
					id="email"
					name="email"
					value={c.email}
				/>
			</div>
			<div class="sm:col-span-2">
				<label class={label} for="hours_display">Office hours (shown)</label><input
					class={field}
					id="hours_display"
					name="hours_display"
					value={c.hours.display}
				/>
			</div>
			<div>
				<label class={label} for="hours_opens">Opens (HH:MM, for SEO)</label><input
					class={field}
					id="hours_opens"
					name="hours_opens"
					value={c.hours.specification[0]?.opens ?? ''}
				/>
			</div>
			<div>
				<label class={label} for="hours_closes">Closes (HH:MM)</label><input
					class={field}
					id="hours_closes"
					name="hours_closes"
					value={c.hours.specification[0]?.closes ?? ''}
				/>
			</div>
			<div>
				<label class={label} for="addr_street">Street</label><input
					class={field}
					id="addr_street"
					name="addr_street"
					value={c.address.street}
				/>
			</div>
			<div>
				<label class={label} for="addr_city">City</label><input
					class={field}
					id="addr_city"
					name="addr_city"
					value={c.address.city}
				/>
			</div>
			<div>
				<label class={label} for="addr_region">State</label><input
					class={field}
					id="addr_region"
					name="addr_region"
					value={c.address.region}
				/>
			</div>
			<div>
				<label class={label} for="addr_regionCode">State code</label><input
					class={field}
					id="addr_regionCode"
					name="addr_regionCode"
					value={c.address.regionCode}
				/>
			</div>
			<div>
				<label class={label} for="addr_postalCode">ZIP</label><input
					class={field}
					id="addr_postalCode"
					name="addr_postalCode"
					value={c.address.postalCode}
				/>
			</div>
			<div>
				<label class={label} for="addr_country">Country</label><input
					class={field}
					id="addr_country"
					name="addr_country"
					value={c.address.country}
				/>
			</div>
		</div>
		<input type="hidden" name="tagline" value={c.tagline} />
		<input type="hidden" name="description" value={c.description} />
	</section>

	<!-- Rates -->
	<section id="rates" class={card}>
		<h2 class="font-display text-lg font-semibold">Rates</h2>
		<p class="mt-1 text-xs text-muted">Leave a price blank to show "Call for rates".</p>
		<div class="mt-4 space-y-3">
			{#each c.rates.categories as cat, i (cat.name)}
				<div class="grid grid-cols-[1fr_auto_2fr] items-center gap-3">
					<span class="text-sm font-medium">{cat.name}</span>
					<input
						class="{field} w-32"
						name="cat_price_{i}"
						value={cat.price ?? ''}
						placeholder="$00.00"
					/>
					<input class={field} name="cat_note_{i}" value={cat.note} placeholder="note" />
				</div>
			{/each}
		</div>
		<h3 class="mt-6 text-sm font-semibold text-muted">Hookups & extras</h3>
		<div class="mt-3 space-y-3">
			{#each c.rates.extras as ex, i (ex.name)}
				<div class="grid grid-cols-[2fr_1fr] items-center gap-3">
					<input class={field} name="extra_name_{i}" value={ex.name} />
					<input
						class={field}
						name="extra_price_{i}"
						value={ex.price ?? ''}
						placeholder="Included / $00.00 / blank"
					/>
				</div>
			{/each}
		</div>
	</section>

	<!-- Rules -->
	<section id="rules" class={card}>
		<h2 class="font-display text-lg font-semibold">Rules</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-4">
			<div>
				<label class={label} for="rule_checkIn">Check-in</label><input
					class={field}
					id="rule_checkIn"
					name="rule_checkIn"
					value={c.rules.checkIn}
				/>
			</div>
			<div>
				<label class={label} for="rule_checkOut">Check-out</label><input
					class={field}
					id="rule_checkOut"
					name="rule_checkOut"
					value={c.rules.checkOut}
				/>
			</div>
			<div>
				<label class={label} for="rule_quietHours">Quiet hours</label><input
					class={field}
					id="rule_quietHours"
					name="rule_quietHours"
					value={c.rules.quietHours}
				/>
			</div>
			<div>
				<label class={label} for="rule_speedLimit">Speed limit</label><input
					class={field}
					id="rule_speedLimit"
					name="rule_speedLimit"
					value={c.rules.speedLimit}
				/>
			</div>
		</div>
		<div class="mt-5 space-y-4">
			{#each c.rules.sections as sec, i (sec.heading)}
				<div>
					<input
						class="{field} mb-2 font-semibold"
						name="section_heading_{i}"
						value={sec.heading}
					/>
					<textarea
						class="{field} min-h-24"
						name="section_rules_{i}"
						rows={sec.rules.length}
						value={sec.rules.join('\n')}></textarea>
					<p class="mt-1 text-xs text-muted">One rule per line.</p>
				</div>
			{/each}
		</div>
	</section>

	<div class="sticky bottom-4 flex justify-end">
		<button
			type="submit"
			disabled={saving}
			class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-on-brand shadow-lg shadow-pine-950/30 transition-colors hover:bg-brand-strong disabled:opacity-60"
		>
			<Save size={18} />
			{saving ? 'Saving…' : 'Save & publish'}
		</button>
	</div>
</form>
