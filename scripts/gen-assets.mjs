/**
 * Compose the share card (→ static/og.png). Run with `npm run assets`.
 *
 * The card is built in three layers so the backdrop and the artwork stay
 * independent:
 *
 *   1. canvas — either a photographic backdrop, cover-cropped and desaturated,
 *      or the dusk-sky gradient when no backdrop has been supplied;
 *   2. scrim  — star field, golden-hour glow, pine treeline, and a darkening
 *      wash whose strength depends on layer 1 (heavy over a photo, absent over
 *      the gradient, which is already the right value);
 *   3. foreground — the park mark, wordmark, tagline headline, accent rule, and
 *      the standing details.
 *
 * Layer 1 is optional on purpose: with no original in assets/source/ the output
 * is the pure-gradient card, and the build stays green.
 *
 * COPY-TRUTH: every park fact on the card is read from content.json — the same
 * operator-editable file the site renders from — so the card cannot drift from
 * the site or state something the owner has not supplied. Re-run this script
 * after the operator edits content; it is deliberately not part of `npm run
 * build`, because the output is a committed static file that social scrapers
 * fetch by URL and the build must stay free of native image dependencies.
 *
 * The published URL is `/og.png` and must stay that way: social platforms cache
 * previews by URL, so renaming it breaks every unfurl already in the wild until
 * those platforms happen to re-scrape.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { findSource, repoRoot, slot } from './images.config.mjs';

const WIDTH = 1200;
const HEIGHT = 630;

/** Alpha of the darkening wash over a photographic backdrop. Tuned so the
 *  wordmark and headline hold up at the thumbnail sizes social clients actually
 *  render, while the texture underneath still reads. */
const PHOTO_SCRIM_ALPHA = 0.76;

/**
 * Design tokens, resolved from the OKLCH values in src/routes/layout.css to
 * sRGB hex. SVG rasterizers do not read our CSS custom properties, so the card
 * mirrors the palette here; the comment on each line names the token it tracks.
 */
const C = {
	canvas: '#030704', // --color-bark-950
	sky: '#113a1f', // --color-pine-800
	treeline: '#021409', // --color-pine-950
	ink: '#f5f1ea', // --color-ink
	brandStrong: '#82c795', // --color-pine-300
	pine100: '#d4f0dc', // --color-pine-100
	muted: '#b2a9a1', // --color-bark-300
	amber300: '#ffc667', // --color-amber-300
	amber500: '#f49329', // --color-amber-500
	amber600: '#de7515', // --color-amber-600
	amber700: '#b65a18' // --color-amber-700
};

/** Typeface stacks. The brand faces (Inter / Fraunces) are web fonts the
 *  rasterizer has no access to, so the card uses their declared CSS fallbacks:
 *  a Georgia-class serif for display, a grotesque for everything else. */
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/**
 * What kind of business this is, in the words the site already uses (the home
 * page's SEO title). It is not a park *fact* the owner maintains, so it is not
 * in content.json — adding a field there would change the content store's data
 * shape, which is a decision the owner owns.
 */
const DESCRIPTOR = 'RV park & campground';

const staticDir = join(repoRoot, 'static');

/** Escape text bound for an SVG text node. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Split a headline into at most two balanced lines. Balanced rather than greedy
 * because a greedy wrap leaves an orphan ("Your Home Away From" / "Home"), and
 * the card is judged at thumbnail size where a lopsided stack reads as an error.
 *
 * @param {string} text
 * @returns {string[]} one or two lines
 */
const balanceLines = (text) => {
	const words = text.trim().split(/\s+/);
	if (words.length < 3) return [words.join(' ')];

	let best = null;
	for (let i = 1; i < words.length; i++) {
		const a = words.slice(0, i).join(' ');
		const b = words.slice(i).join(' ');
		const cost = Math.max(a.length, b.length);
		if (!best || cost < best.cost) best = { cost, lines: [a, b] };
	}
	return best.lines;
};

/**
 * Largest display size at which the longest line still fits the text column.
 * A serif bold advances at roughly 0.52em per character averaged over mixed
 * case, which is close enough to keep any plausible tagline inside the margins.
 *
 * @param {string[]} lines
 */
const fitDisplaySize = (lines) => {
	const longest = Math.max(...lines.map((l) => l.length));
	const column = WIDTH - 82 - 90; // left margin → right margin
	return Math.max(34, Math.min(72, Math.floor(column / (0.52 * longest))));
};

/** The no-photo canvas: the dusk sky from the site's hero, minus the glow
 *  (which the scrim carries, so both canvases get an identical treatment). */
const gradientCanvasSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sky" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(600 -60) scale(760 580)">
      <stop stop-color="${C.sky}"/>
      <stop offset="1" stop-color="${C.canvas}"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.canvas}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)"/>
</svg>`;

/**
 * The pine treeline from the home page hero, reused as the card's bottom edge.
 * The source path spans x 0→730 and y −24→120; the transform stretches it to
 * the full card width and seats the band in the bottom ~94px, spikes included.
 */
const TREELINE_PATH =
	'M0 120 V70 l40-22 18 14 30-30 26 22 34-34 22 26 40-40 24 30 36-30 28 26 40-34 ' +
	'26 28 34-30 30 26 40-32 24 26 38-28 30 24 40-30 26 24 36-26 28 22 40-26 V120 Z';

/**
 * Star field, golden-hour glow behind the trees, the treeline itself, and the
 * darkening wash — as one overlay.
 * @param {number} washAlpha 0 when the canvas is already the dusk gradient.
 */
const scrimSvg = (washAlpha) => `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="${WIDTH}" y2="${HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#050d07" stop-opacity="${washAlpha}"/>
      <stop offset="1" stop-color="#020604" stop-opacity="${Math.min(1, washAlpha + 0.08)}"/>
    </linearGradient>
    <radialGradient id="duskGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(960 30) scale(470 380)">
      <stop stop-color="${C.amber500}" stop-opacity="0.20"/>
      <stop offset="1" stop-color="${C.amber500}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="horizon" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(620 566) scale(660 150)">
      <stop stop-color="${C.amber600}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${C.amber600}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${washAlpha > 0 ? `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>` : ''}
  <g fill="#ffffff" opacity="0.55">
    <circle cx="144" cy="113" r="1.6"/><circle cx="264" cy="214" r="1.3"/>
    <circle cx="456" cy="88" r="1.8"/><circle cx="648" cy="164" r="1.1"/>
    <circle cx="816" cy="76" r="1.6"/><circle cx="996" cy="189" r="1.4"/>
    <circle cx="1092" cy="113" r="1.1"/><circle cx="552" cy="252" r="1"/>
    <circle cx="84" cy="252" r="1.1"/><circle cx="900" cy="264" r="1"/>
  </g>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#duskGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#horizon)"/>
  <g transform="translate(0 551.7) scale(1.6438 0.6528)">
    <path d="${TREELINE_PATH}" fill="${C.treeline}"/>
  </g>
</svg>`;

/**
 * Layer 3. The mark is the site's own favicon geometry, scaled from its 32-unit
 * viewBox; everything else is set from content.json.
 * @param {{lines: string[], size: number, detail1: string, detail2: string}} copy
 */
const foregroundSvg = ({ lines, size, detail1, detail2 }) => {
	// The block below the headline (rule, details, treeline) is anchored to the
	// bottom of the card, so the headline is placed from the top and the one-line
	// case drops to the optical centre of the same gap rather than floating high.
	const leading = Math.round(size * 1.14);
	const firstBaseline = lines.length > 1 ? 300 : 344;

	const headline = lines
		.map(
			(line, i) =>
				`<text x="82" y="${firstBaseline + i * leading}" font-family="${SERIF}" font-size="${size}" ` +
				`font-weight="700" letter-spacing="-1" fill="${i === 0 ? C.ink : C.brandStrong}">${esc(line)}</text>`
		)
		.join('\n  ');

	return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rule" x1="82" y1="0" x2="282" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C.amber300}"/>
      <stop offset="0.55" stop-color="${C.amber500}"/>
      <stop offset="1" stop-color="${C.amber700}"/>
    </linearGradient>
  </defs>

  <!-- park mark: static/favicon.svg geometry, 32-unit viewBox scaled ×2.625 -->
  <g transform="translate(80 72) scale(2.625)">
    <rect width="32" height="32" rx="8" fill="#2f6b46"/>
    <path d="M16 5 L22 14 H19 L24 22 H8 L13 14 H10 Z" fill="#f0b35b"/>
    <rect x="14.6" y="21" width="2.8" height="5" rx="0.6" fill="#9a6b3a"/>
  </g>

  <text x="196" y="134" font-family="${SANS}" font-size="42" font-weight="700"
        letter-spacing="-0.5" fill="${C.ink}">Leisure Oaks Park</text>

  ${headline}

  <rect x="82" y="424" width="200" height="6" rx="3" fill="url(#rule)"/>

  <text x="82" y="474" font-family="${SANS}" font-size="27" font-weight="600"
        fill="${C.pine100}">${esc(detail1)}</text>
  <text x="82" y="513" font-family="${SANS}" font-size="25" font-weight="500"
        fill="${C.muted}">${esc(detail2)}</text>
</svg>`;
};

const rasterize = (svg) =>
	sharp(Buffer.from(svg), { density: 144 }).resize(WIDTH, HEIGHT).png().toBuffer();

// ── Copy, straight from the operator-editable content store ──────────────────
const content = JSON.parse(await readFile(join(repoRoot, 'src/lib/content/content.json'), 'utf8'));

const lines = balanceLines(content.tagline);
const copy = {
	lines,
	size: fitDisplaySize(lines),
	detail1: `${DESCRIPTOR} · ${content.address.city}, ${content.address.region}`,
	detail2: `${content.phone.display} · camping4you.net`
};

const backdrop = findSource(slot('og-backdrop').id);

// Layer 1.
const canvas = backdrop
	? await sharp(backdrop)
			.resize(WIDTH, HEIGHT, { fit: 'cover', position: 'attention' })
			// Pull the colour down so the photo reads as material and the pine green
			// and campfire amber stay the only saturated things on the card.
			.modulate({ saturation: 0.45, brightness: 0.85 })
			.png()
			.toBuffer()
	: await rasterize(gradientCanvasSvg);

// Layers 2 and 3.
const png = await sharp(canvas)
	.composite([
		{ input: await rasterize(scrimSvg(backdrop ? PHOTO_SCRIM_ALPHA : 0)) },
		{ input: await rasterize(foregroundSvg(copy)) }
	])
	// A photographic backdrop takes a default-encoded PNG past 600 KB, so this
	// leans on maximum lossless compression instead — roughly 250 KB. Palette
	// quantization would halve it again but dithers the gradient accent rule, and
	// this file is fetched by social scrapers rather than by visitors, so it never
	// touches a page-load metric. Fidelity wins the trade.
	.png({ compressionLevel: 9, effort: 10 })
	.toBuffer();

await writeFile(join(staticDir, 'og.png'), png);

const kb = `${(png.length / 1024).toFixed(0)} KB`;
console.log(
	backdrop
		? `✓ static/og.png (${WIDTH}×${HEIGHT}, ${kb}) — photographic backdrop from ${backdrop.replace(repoRoot + '/', '')}`
		: `✓ static/og.png (${WIDTH}×${HEIGHT}, ${kb}) — dusk gradient (no assets/source/og-backdrop.* supplied)`
);
console.log(`  headline: ${lines.join(' / ')} @ ${copy.size}px`);
