import { describe, it, expect } from 'vitest';
import { contentSchema } from './content-schema';
import current from '../content/content.json';

describe('contentSchema', () => {
	it('accepts the live content.json', () => {
		const r = contentSchema.safeParse(current);
		expect(r.success).toBe(true);
	});

	it('coerces an empty price to null (copy-truth)', () => {
		const draft = structuredClone(current);
		draft.rates.categories[0].price = '' as never;
		const r = contentSchema.parse(draft);
		expect(r.rates.categories[0].price).toBeNull();
	});

	it('rejects a missing required field', () => {
		const draft = structuredClone(current) as Record<string, unknown>;
		delete draft.email;
		expect(contentSchema.safeParse(draft).success).toBe(false);
	});

	it('rejects a bad email', () => {
		const draft = structuredClone(current);
		draft.email = 'not-an-email';
		expect(contentSchema.safeParse(draft).success).toBe(false);
	});
});
