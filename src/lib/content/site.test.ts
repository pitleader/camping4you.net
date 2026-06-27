import { describe, it, expect } from 'vitest';
import { site, formatPrice, formattedAddress } from './site';

describe('formatPrice (copy-truth)', () => {
	it('returns a real price unchanged', () => {
		expect(formatPrice('$45.00')).toBe('$45.00');
		expect(formatPrice('Included')).toBe('Included');
	});

	it('renders an honest fallback for an unconfirmed (null) price', () => {
		expect(formatPrice(null)).toBe('Call for rates');
		expect(formatPrice(null, 'Ask us')).toBe('Ask us');
	});
});

describe('site content invariants', () => {
	it('never exposes an invented placeholder price ($XX.XX et al.)', () => {
		const allPrices = [...site.rates.categories, ...site.rates.extras]
			.map((r) => r.price)
			.filter((p): p is string => p !== null);
		for (const p of allPrices) {
			expect(p).not.toMatch(/x{2,}|\?|tbd|placeholder/i);
		}
	});

	it('formats the address from its parts', () => {
		expect(formattedAddress()).toBe('5805 S Lafayette Ave, Bartonville, IL 61607');
	});

	it('keeps the SMS program service-only (no marketing wording)', () => {
		const corpus = (site.sms.intro + ' ' + site.sms.details.join(' ')).toLowerCase();
		expect(corpus).not.toMatch(/\b(sale|discount|promo|deal|offer)\b/);
	});
});
