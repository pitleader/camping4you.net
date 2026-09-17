/**
 * Google Ads image assets — the three files an asset group requires, in the
 * share card's visual language (dusk sky, star field, treeline, park mark) but
 * WITHOUT a phone number, which Google's ad policy disallows in creative.
 *
 *   assets/ads/landscape.png  1200×628  (1.91:1)
 *   assets/ads/square.png     1200×1200 (1:1)
 *   assets/ads/logo.png       1200×1200 (1:1, mark only)
 *
 * Copy is the winter campaign's pitch; every claim is one the site already makes
 * on /winter-camping. Run: `node scripts/gen-ads.mjs`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { repoRoot } from './images.config.mjs';

// Palette mirrors src/routes/layout.css (SVG rasterizers can't read CSS vars).
const C = {
	canvas: '#030704',
	sky: '#113a1f',
	treeline: '#021409',
	ink: '#f5f1ea',
	brandStrong: '#82c795',
	pine100: '#d4f0dc',
	amber300: '#ffc667',
	amber500: '#f49329',
	amber700: '#b65a18',
	mark: '#2f6b46'
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const TREELINE_PATH =
	'M0 120 V70 l40-22 18 14 30-30 26 22 34-34 22 26 40-40 24 30 36-30 28 26 40-34 ' +
	'26 28 34-30 30 26 40-32 24 26 38-28 30 24 40-30 26 24 36-26 28 22 40-26 V120 Z';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Park mark (favicon geometry) at a given scale, top-left at (x, y). */
const mark = (x, y, k) => `
  <g transform="translate(${x} ${y}) scale(${k})">
    <rect width="32" height="32" rx="8" fill="${C.mark}"/>
    <path d="M16 5 L22 14 H19 L24 22 H8 L13 14 H10 Z" fill="#f0b35b"/>
    <rect x="14.6" y="21" width="2.8" height="5" rx="0.6" fill="#9a6b3a"/>
  </g>`;

/** Dusk canvas + stars + treeline for a W×H card. */
const scene = (W, H) => `
  <defs>
    <radialGradient id="sky" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(${W / 2} -60) scale(${W * 0.63} ${H * 0.92})">
      <stop stop-color="${C.sky}"/><stop offset="1" stop-color="${C.canvas}"/>
    </radialGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(${W * 0.8} 30) scale(${W * 0.39} ${H * 0.6})">
      <stop stop-color="${C.amber500}" stop-opacity="0.20"/>
      <stop offset="1" stop-color="${C.amber500}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C.amber300}"/><stop offset="0.55" stop-color="${C.amber500}"/>
      <stop offset="1" stop-color="${C.amber700}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.canvas}"/>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g fill="#ffffff" opacity="0.55">
    <circle cx="${W * 0.12}" cy="${H * 0.18}" r="1.6"/><circle cx="${W * 0.22}" cy="${H * 0.34}" r="1.3"/>
    <circle cx="${W * 0.38}" cy="${H * 0.14}" r="1.8"/><circle cx="${W * 0.54}" cy="${H * 0.26}" r="1.1"/>
    <circle cx="${W * 0.68}" cy="${H * 0.12}" r="1.6"/><circle cx="${W * 0.83}" cy="${H * 0.3}" r="1.4"/>
    <circle cx="${W * 0.91}" cy="${H * 0.18}" r="1.1"/><circle cx="${W * 0.07}" cy="${H * 0.4}" r="1.1"/>
  </g>
  <g transform="translate(0 ${H - 78}) scale(${W / 730} 0.65)">
    <path d="${TREELINE_PATH}" fill="${C.treeline}"/>
  </g>`;

const landscape = () => {
	const W = 1200,
		H = 628;
	return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${scene(W, H)}
  ${mark(80, 64, 2.4)}
  <text x="184" y="121" font-family="${SANS}" font-size="38" font-weight="700" letter-spacing="-0.5" fill="${C.ink}">Leisure Oaks Park</text>
  <text x="82" y="292" font-family="${SERIF}" font-size="72" font-weight="700" letter-spacing="-1" fill="${C.ink}">${esc('Open All Winter')}</text>
  <text x="82" y="372" font-family="${SERIF}" font-size="72" font-weight="700" letter-spacing="-1" fill="${C.brandStrong}">${esc('RV Sites Near Peoria')}</text>
  <rect x="82" y="418" width="200" height="6" rx="3" fill="url(#rule)"/>
  <text x="82" y="472" font-family="${SANS}" font-size="27" font-weight="600" fill="${C.pine100}">${esc('30/50-amp electric · Monthly winter stays · Bartonville, IL')}</text>
</svg>`;
};

const square = () => {
	const W = 1200,
		H = 1200;
	return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${scene(W, H)}
  ${mark(96, 96, 3.2)}
  <text x="232" y="170" font-family="${SANS}" font-size="46" font-weight="700" letter-spacing="-0.5" fill="${C.ink}">Leisure Oaks Park</text>
  <text x="96" y="560" font-family="${SERIF}" font-size="104" font-weight="700" letter-spacing="-2" fill="${C.ink}">${esc('Open All')}</text>
  <text x="96" y="676" font-family="${SERIF}" font-size="104" font-weight="700" letter-spacing="-2" fill="${C.ink}">${esc('Winter.')}</text>
  <text x="96" y="792" font-family="${SERIF}" font-size="84" font-weight="700" letter-spacing="-1.5" fill="${C.brandStrong}">${esc('RV Sites Near Peoria')}</text>
  <rect x="96" y="846" width="200" height="6" rx="3" fill="url(#rule)"/>
  <text x="96" y="912" font-family="${SANS}" font-size="34" font-weight="600" fill="${C.pine100}">${esc('30/50-amp electric · Monthly stays')}</text>
  <text x="96" y="962" font-family="${SANS}" font-size="34" font-weight="600" fill="${C.pine100}">${esc('Bartonville, Illinois')}</text>
</svg>`;
};

const logo = () => {
	const W = 1200;
	return `<svg width="${W}" height="${W}" viewBox="0 0 ${W} ${W}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${W}" fill="${C.mark}"/>
  ${mark(0, 0, W / 32)}
</svg>`;
};

const out = join(repoRoot, 'assets/ads');
await mkdir(out, { recursive: true });
for (const [name, svg] of [
	['landscape.png', landscape()],
	['square.png', square()],
	['logo.png', logo()]
]) {
	const size = name === 'landscape.png' ? [1200, 628] : [1200, 1200];
	const png = await sharp(Buffer.from(svg), { density: 144 })
		.resize(...size)
		.png({ compressionLevel: 9 })
		.toBuffer();
	await writeFile(join(out, name), png);
	const m = await sharp(png).metadata();
	console.log(`✓ assets/ads/${name} ${m.width}×${m.height} ${(png.length / 1024).toFixed(0)} KB`);
}
