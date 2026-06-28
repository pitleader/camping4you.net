/**
 * Single source of truth for every park fact. Pages, the SEO graph, and the
 * footer read from `site`; nothing about the park is hardcoded in a template.
 *
 * Editable content lives in `content.json` — the operator control panel commits
 * that file and the site rebuilds. Infrastructure config (domain, verification +
 * analytics tokens, OG image, geo, social) stays here in code.
 *
 * TRUTH CONTRACT: a fact the owner has not confirmed is `null`, never a
 * plausible guess. `null` renders as an honest fallback ("Call for rates"), so a
 * placeholder is structurally impossible to mistake for a real value.
 */
import contentRaw from './content.json';

export type Price = string | null;

export interface RateCategory {
	name: string;
	/** null until the owner confirms a real price (copy-truth). */
	price: Price;
	note: string;
}

export interface RuleSection {
	heading: string;
	rules: string[];
}

export interface SmsSample {
	label: string;
	body: string;
}

export interface OpeningHours {
	/** Schema.org day names this block applies to. */
	days: string[];
	/** 24h "HH:MM". */
	opens: string;
	closes: string;
}

/** Shape of the operator-editable `content.json` (committed by the panel). */
export interface EditableContent {
	tagline: string;
	description: string;
	email: string;
	/** Google "write a review" link. Empty → the review CTA is hidden. */
	reviewUrl: string;
	phone: { display: string; href: string };
	address: {
		street: string;
		city: string;
		region: string;
		regionCode: string;
		postalCode: string;
		country: string;
	};
	hours: { display: string; specification: OpeningHours[] };
	rates: { categories: RateCategory[]; extras: RateCategory[] };
	rules: {
		checkIn: string;
		checkOut: string;
		quietHours: string;
		speedLimit: string;
		sections: RuleSection[];
	};
	sms: { effectiveDate: string; intro: string; samples: SmsSample[]; details: string[] };
	legal: { effectiveDate: string };
}

const content = contentRaw as EditableContent;

export const site = {
	// ── Infrastructure / brand config (code-owned, not operator-edited) ──
	name: 'Leisure Oaks Park',
	legalName: 'Leisure Oaks Park',
	url: 'https://camping4you.net',

	/** No public social profiles confirmed yet. */
	social: [] as string[],

	/** Search-engine ownership verification tokens (emitted only when set). */
	verification: { google: '', bing: '' },

	/**
	 * Cloudflare Web Analytics (cookieless) site tag. CSP allow-lists
	 * `static.cloudflareinsights.com`. Empty → not rendered.
	 */
	analytics: { cfBeaconToken: '6e2215c17c89425ca0e3ae7ee775748d' },

	/** OG/share image (1200×630). null until the asset exists — no broken card. */
	ogImage: null as string | null,

	/** Lat/long not yet owner-confirmed — omit from the SEO graph until it is. */
	geo: null as { lat: number; lng: number } | null,

	// ── Operator-editable content (from content.json; D-0001) ──
	tagline: content.tagline,
	description: content.description,
	email: content.email,
	reviewUrl: content.reviewUrl,
	phone: content.phone,
	address: content.address,
	hours: content.hours,
	rates: content.rates,
	rules: content.rules,
	sms: content.sms,
	legal: content.legal
};

export type Site = typeof site;

/** Copy-truth helper: a real price, or the honest fallback for an unconfirmed one. */
export function formatPrice(price: Price, fallback = 'Call for rates'): string {
	return price ?? fallback;
}

/** "5805 S Lafayette Ave, Bartonville, IL 61607" */
export function formattedAddress(): string {
	const a = site.address;
	return `${a.street}, ${a.city}, ${a.regionCode} ${a.postalCode}`;
}
