/**
 * Single source of truth for every editable park fact (PROJECT-SCOPE: copy-truth
 * — "never invent park facts"). Pages, the SEO graph, and the footer all read
 * from here; nothing about the park is hardcoded in a template. The M3 control
 * panel edits this content.
 *
 * COPY-TRUTH CONTRACT: a fact the owner has not yet confirmed is `null`, never a
 * plausible guess. `null` renders as an honest fallback ("Call for rates"), so a
 * placeholder is structurally impossible to mistake for a real value.
 */

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

export const site = {
	name: 'Leisure Oaks Park',
	legalName: 'Leisure Oaks Park',
	tagline: 'Your Home Away From Home',
	description:
		'Leisure Oaks Park is a quiet, shaded campground for RVs and travelers in Bartonville, Illinois — full hookups, easy access, and a friendly office that makes every stay simple.',
	url: 'https://camping4you.net',

	email: 'info@camping4you.net',
	phone: { display: '(309) 697-4871', href: '+13096974871' },

	address: {
		street: '5805 S Lafayette Ave',
		city: 'Bartonville',
		region: 'Illinois',
		regionCode: 'IL',
		postalCode: '61607',
		country: 'US'
	},

	/** Lat/long not yet owner-confirmed — omit from the SEO graph until it is. */
	geo: null as { lat: number; lng: number } | null,

	hours: {
		display: 'Mon–Sat 8:00 AM – 6:00 PM',
		specification: [
			{
				days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				opens: '08:00',
				closes: '18:00'
			}
		] as OpeningHours[]
	},

	/** No public social profiles confirmed yet. */
	social: [] as string[],

	rates: {
		// Prices are null until the owner confirms them (copy-truth). The note is
		// the stable, true part; the number is what we will not invent.
		categories: [
			{ name: 'Nightly', price: null, note: 'per site, per night' },
			{ name: 'Weekly', price: null, note: '7 consecutive nights' },
			{ name: 'Monthly', price: null, note: '30 days' },
			{ name: 'Seasonal', price: null, note: 'the full season' }
		] as RateCategory[],
		extras: [
			{ name: 'Electric Hookup (30 amp)', price: null, note: '' },
			{ name: 'Electric Hookup (50 amp)', price: null, note: '' },
			{ name: 'Water & Sewer', price: 'Included', note: '' },
			{ name: 'Extra Vehicle', price: null, note: '' },
			{ name: 'Guest Day Pass', price: null, note: '' }
		] as RateCategory[]
	},

	rules: {
		checkIn: '2:00 PM',
		checkOut: '12:00 PM',
		quietHours: '10:00 PM – 7:00 AM',
		speedLimit: '5 MPH',
		sections: [
			{
				heading: 'General',
				rules: [
					'All guests must register at the office upon arrival.',
					'Management reserves the right to refuse service or evict guests for rule violations.'
				]
			},
			{
				heading: 'Site & Facilities',
				rules: [
					'Keep your site clean and free of trash at all times.',
					'Do not move picnic tables, fire rings, or park equipment.',
					'All trash must be placed in designated dumpsters.',
					'No washing vehicles or equipment at campsites.'
				]
			},
			{
				heading: 'Fires',
				rules: [
					'Fires are permitted in designated fire rings only.',
					'Never leave a fire unattended.',
					'Fires must be fully extinguished before leaving your site or going to sleep.'
				]
			},
			{
				heading: 'Pets',
				rules: [
					'Pets must be leashed at all times.',
					'Owners must clean up after their pets immediately.',
					'Aggressive or excessively noisy animals must be removed from the park.'
				]
			},
			{
				heading: 'Vehicles',
				rules: [
					'Observe the posted speed limit at all times.',
					'One vehicle per site unless otherwise approved.',
					'ATVs, golf carts, and off-road vehicles are not permitted unless authorized.'
				]
			},
			{
				heading: 'Noise & Conduct',
				rules: [
					'Quiet hours are strictly enforced.',
					'No excessive noise, music, or disruptive behavior at any time.',
					'Fireworks and firearms are prohibited.'
				]
			}
		] as RuleSection[]
	},

	/** Service-only A2P 10DLC program (PROJECT-SCOPE glossary: never marketing). */
	sms: {
		effectiveDate: 'March 2, 2026',
		intro:
			'All messages are service-related only — we do not send marketing or promotional messages.',
		samples: [
			{
				label: 'Reservation Confirmation',
				body: 'Leisure Oaks Park: Your reservation for Site #12 is confirmed for June 14–17. Check-in begins at 2:00 PM. Reply STOP to opt out.'
			},
			{
				label: 'Check-In Reminder',
				body: 'Leisure Oaks Park: Reminder — your stay begins tomorrow, June 14. Check-in is 2:00 PM at the front office. See you soon! Reply STOP to opt out.'
			},
			{
				label: 'Check-Out Reminder',
				body: 'Leisure Oaks Park: Friendly reminder — check-out is by 11:00 AM today. Thank you for staying with us! Reply STOP to opt out.'
			},
			{
				label: 'Park Notice',
				body: 'Leisure Oaks Park: Due to weather, the pool area will close at 5:00 PM today. Stay safe and enjoy your evening! Reply STOP to opt out.'
			},
			{
				label: 'Reservation Update',
				body: 'Leisure Oaks Park: Your reservation has been updated. New dates: June 15–18, Site #8. Questions? Call (309) 697-4871. Reply STOP to opt out.'
			}
		] as SmsSample[],
		details: [
			'Message frequency varies based on your reservations and park activity.',
			'Message and data rates may apply depending on your carrier and plan.',
			'Reply STOP at any time to unsubscribe from SMS messages.',
			'Reply HELP for assistance, or contact us at (309) 697-4871.',
			'Consent to receive SMS is not a condition of purchase or service.'
		]
	},

	legal: {
		/** Effective date shown on privacy / terms / SMS pages. */
		effectiveDate: 'March 2, 2026'
	}
} as const;

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
