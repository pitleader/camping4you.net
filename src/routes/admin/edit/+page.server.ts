import { fail } from '@sveltejs/kit';
import currentContent from '$lib/content/content.json';
import type { EditableContent } from '$lib/content/site';
import { contentSchema } from '$lib/server/content-schema';
import { commitContent } from '$lib/server/github';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ content: currentContent });

/** Build the next content object by overlaying the form onto the current content.
 * Un-edited sections (sms samples, legal) are preserved as-is. */
function reconstruct(form: FormData): unknown {
	const s = (k: string) => String(form.get(k) ?? '').trim();
	const base = structuredClone(currentContent) as unknown as EditableContent;

	base.tagline = s('tagline');
	base.description = s('description');
	base.email = s('email');
	base.reviewUrl = s('reviewUrl');
	base.phone = { display: s('phone_display'), href: s('phone_href') };
	base.address = {
		street: s('addr_street'),
		city: s('addr_city'),
		region: s('addr_region'),
		regionCode: s('addr_regionCode'),
		postalCode: s('addr_postalCode'),
		country: s('addr_country')
	};
	base.hours.display = s('hours_display');
	if (base.hours.specification[0]) {
		base.hours.specification[0].opens = s('hours_opens');
		base.hours.specification[0].closes = s('hours_closes');
	}

	base.rates.categories = base.rates.categories.map((c, i) => ({
		name: c.name,
		price: s(`cat_price_${i}`) || null,
		note: s(`cat_note_${i}`)
	}));
	base.rates.extras = base.rates.extras.map((e, i) => ({
		name: s(`extra_name_${i}`) || e.name,
		price: s(`extra_price_${i}`) || null,
		note: e.note
	}));

	base.rules.checkIn = s('rule_checkIn');
	base.rules.checkOut = s('rule_checkOut');
	base.rules.quietHours = s('rule_quietHours');
	base.rules.speedLimit = s('rule_speedLimit');
	base.rules.sections = base.rules.sections.map((sec, i) => ({
		heading: s(`section_heading_${i}`) || sec.heading,
		rules: s(`section_rules_${i}`)
			.split('\n')
			.map((r) => r.trim())
			.filter(Boolean)
	}));

	return base;
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const draft = reconstruct(await request.formData());
		const parsed = contentSchema.safeParse(draft);
		if (!parsed.success) {
			return fail(400, { validation: parsed.error.flatten().fieldErrors });
		}
		try {
			const res = await commitContent(parsed.data, locals.user?.email ?? 'unknown');
			return { success: true as const, commitUrl: res.commitUrl };
		} catch (e) {
			return fail(500, { saveError: (e as Error).message });
		}
	}
};
