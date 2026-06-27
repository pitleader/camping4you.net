import { site } from '$lib/content/site';
import type { RequestHandler } from './$types';

export const prerender = true;

const pages = [
	{ path: '/', priority: '1.0' },
	{ path: '/rates', priority: '0.9' },
	{ path: '/rules', priority: '0.7' },
	{ path: '/contact', priority: '0.8' },
	{ path: '/privacy', priority: '0.3' },
	{ path: '/terms', priority: '0.3' },
	{ path: '/sms-sample', priority: '0.3' }
];

export const GET: RequestHandler = () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(p) => `	<url>
		<loc>${site.url}${p.path}</loc>
		<changefreq>monthly</changefreq>
		<priority>${p.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
