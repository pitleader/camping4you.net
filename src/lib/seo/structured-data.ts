/**
 * Typed schema.org JSON-LD builders. Everything traces back to `site.ts` (one
 * source of truth) and optional fields are emitted ONLY when the underlying
 * fact exists — no invented geo, ratings, or hours. The page renders one
 * `<script type="application/ld+json">` holding a linked `@graph`, so entities
 * `@id`-reference each other.
 */
import { site } from '$lib/content/site';

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const BUSINESS_ID = `${site.url}/#campground`;
const WEBSITE_ID = `${site.url}/#website`;

function postalAddress(): JsonLd {
	const a = site.address;
	return {
		'@type': 'PostalAddress',
		streetAddress: a.street,
		addressLocality: a.city,
		addressRegion: a.regionCode,
		postalCode: a.postalCode,
		addressCountry: a.country
	};
}

function openingHours(): JsonLd[] {
	return site.hours.specification.map((s) => ({
		'@type': 'OpeningHoursSpecification',
		dayOfWeek: s.days.map((d) => `https://schema.org/${d}`),
		opens: s.opens,
		closes: s.closes
	}));
}

/** Confirmed on-site amenities → amenityFeature (only the ones we actually have). */
function amenities(): JsonLd[] {
	const features = [
		'Electric Hookup (30 amp)',
		'Electric Hookup (50 amp)',
		'Water & Sewer',
		'Shaded sites',
		...(site.yearRound ? ['Open year-round', 'Winter camping'] : [])
	];
	return features.map((name) => ({
		'@type': 'LocationFeatureSpecification',
		name,
		value: true
	}));
}

export function organization(): JsonLd {
	const org: JsonLd = {
		'@type': 'Organization',
		'@id': ORG_ID,
		name: site.legalName,
		alternateName: site.name,
		url: site.url,
		email: site.email,
		telephone: site.phone.href,
		address: postalAddress()
	};
	if (site.social.length) org.sameAs = site.social;
	return org;
}

export function campground(): JsonLd {
	const biz: JsonLd = {
		'@type': ['Campground', 'LodgingBusiness', 'LocalBusiness'],
		'@id': BUSINESS_ID,
		name: site.name,
		description: site.description,
		url: site.url,
		email: site.email,
		telephone: site.phone.href,
		address: postalAddress(),
		areaServed: { '@type': 'City', name: `${site.address.city}, ${site.address.region}` },
		openingHoursSpecification: openingHours(),
		amenityFeature: amenities(),
		parentOrganization: { '@id': ORG_ID }
		// priceRange omitted: not owner-confirmed (copy-truth).
	};
	if (site.geo) {
		biz.geo = { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng };
	}
	return biz;
}

export function website(): JsonLd {
	return {
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: site.name,
		url: site.url,
		publisher: { '@id': ORG_ID }
	};
}

export interface Faq {
	q: string;
	a: string;
}

/** FAQPage entity for a page's Q&A section (answers are plain text). */
export function faqPage(pagePath: string, faqs: Faq[]): JsonLd {
	return {
		'@type': 'FAQPage',
		'@id': `${site.url}${pagePath}#faq`,
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/** A sub-page's graph: the shared entities plus the page's own WebPage (+ FAQ). */
export function pageGraph(
	pagePath: string,
	opts: { name: string; description: string; faqs?: Faq[] }
): JsonLd {
	const webPage: JsonLd = {
		'@type': 'WebPage',
		'@id': `${site.url}${pagePath}`,
		url: `${site.url}${pagePath}`,
		name: opts.name,
		description: opts.description,
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': BUSINESS_ID }
	};
	const nodes = [organization(), campground(), website(), webPage];
	if (opts.faqs?.length) nodes.push(faqPage(pagePath, opts.faqs));
	return { '@context': 'https://schema.org', '@graph': nodes };
}

/** The full linked graph for the home page. */
export function graph(): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@graph': [organization(), campground(), website()]
	};
}

/** Serialize a JSON-LD object for embedding, escaping the `<` that could break out. */
export function jsonLdScript(data: JsonLd): string {
	return JSON.stringify(data).replace(/</g, '\\u003c');
}
