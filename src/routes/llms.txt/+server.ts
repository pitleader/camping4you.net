import { site, formatPrice } from '$lib/content/site';
import type { RequestHandler } from './$types';

export const prerender = true;

/**
 * llms.txt — a plain-markdown brief that helps AI crawlers (ChatGPT, Perplexity,
 * etc.) understand and accurately cite the park. Convention from llmstxt.org.
 * Every value traces to `site.ts`, so it can never drift from the canonical
 * facts — including the copy-truth rule that unconfirmed prices say "Call".
 */
export const GET: RequestHandler = () => {
	const u = (path: string) => `${site.url}${path}`;
	const stays = site.rates.categories
		.map((c) => `- **${c.name}** (${c.note}): ${formatPrice(c.price)}`)
		.join('\n');

	const body = `# ${site.name}

> ${site.description}

${site.name} is an RV park and campground in ${site.address.city}, ${site.address.region}, offering nightly, weekly, monthly, and seasonal sites with full hookups.

## Pages

- [Home](${u('/')}): overview of the park.
- [Rates](${u('/rates')}): stay types and hookups (call for current pricing).
- [Rules](${u('/rules')}): campground rules and quiet hours.
- [Contact](${u('/contact')}): phone, email, address, and hours.
- [Privacy Policy](${u('/privacy')})
- [Terms & Conditions](${u('/terms')})
- [Sample SMS Messages](${u('/sms-sample')}): examples of our service-only texts.

## Stays

${stays}

## SMS program

Service-only (transactional) text messages — reservation confirmations, check-in/out reminders, and park notices. We do not send marketing or promotional messages. Reply STOP to opt out, HELP for assistance. Consent is not a condition of service.

## Contact

- Phone: ${site.phone.display}
- Email: ${site.email}
- Address: ${site.address.street}, ${site.address.city}, ${site.address.regionCode} ${site.address.postalCode}
- Hours: ${site.hours.display}
- Website: ${site.url}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
