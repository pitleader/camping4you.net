/**
 * Declared image slots — the single place a photographic asset is described.
 *
 * Every consumer (the share-card composer, the derivative generator, the Svelte
 * texture band) reads this file rather than hard-coding a filename, so adding or
 * retiring a slot is one edit here.
 *
 * Originals are dropped in `assets/source/` (untracked — see the README there)
 * and are never served. The generators write optimized, committed derivatives.
 *
 * Licensing note carried with the data, because it constrains what may fill a
 * slot: these are Unsplash+ downloads, used under the Unsplash+ license
 * (download once, use forever, commercial, no credit line required). They are
 * self-hosted deliberately — the Unsplash *API* requires hotlinking its own
 * URLs, which would put a third-party origin in the largest-paint path of a
 * prerendered site and force an `img-src` exception in the CSP that `_headers`
 * pins to `'self' data:`. Nothing here talks to Unsplash at build or run time.
 *
 * Hard rule for what may fill any slot: **non-representational imagery only.**
 * No people, no campsites, no RVs, no storefronts, no staff. Anything a visitor
 * could read as "this is Leisure Oaks' park / guests / rigs" is a trust claim
 * the owner has not made, and the project's copy-truth constraint rules out
 * facts the owner has not supplied. Texture, material, weather, and abstraction
 * only. The same rule is why none of these may go on the Google Business
 * Profile, which requires media captured at the business.
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Where hand-downloaded originals live (untracked). */
export const SOURCE_DIR = 'assets/source';

/** Where generated derivatives land (committed; Vite hashes and serves them). */
export const OUT_DIR = 'src/lib/assets/img';

/** Extensions accepted for a source original, in preference order. */
export const SOURCE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tif', 'tiff'];

/**
 * @typedef {object} Slot
 * @property {string}   id          Stable slot name; also the source basename.
 * @property {string}   consumer    What reads the output — for the missing-source message.
 * @property {string}   intent      What the picture must be, in plain terms.
 * @property {number[]} [widths]    Derivative widths in px. Omitted for the share-card
 *                                  slot, which the card composer sizes itself.
 * @property {number}   [aspect]    Target aspect ratio (w / h) for the crop.
 */

/** @type {Slot[]} */
export const SLOTS = [
	{
		id: 'og-backdrop',
		consumer: 'scripts/gen-assets.mjs → static/og.png',
		aspect: 1200 / 630,
		intent:
			'Abstract dark texture sitting behind the share card. It is desaturated and ' +
			'then covered by a ~76% ink scrim, so it must read as material rather than ' +
			'subject: night sky grain, dark bark or weathered timber, deep forest canopy ' +
			'blur, rain on a dark window, woven canvas. Busy focal points and anything ' +
			'recognisable as a place are wrong here — the wordmark and headline sit over ' +
			'the left half and must stay legible at thumbnail size, and a pine treeline ' +
			'silhouette occupies the bottom sixth of the card.'
	},
	{
		id: 'texture-rates',
		consumer: 'src/lib/components/TextureBand.svelte (Rates section on the home page)',
		aspect: 16 / 6,
		widths: [1920, 1280, 800],
		intent:
			'Wide, quiet texture band behind the rates cards. Rendered at ~8% opacity and ' +
			'mostly desaturated under the cards in both themes, so contrast inside the ' +
			'image barely matters and repeating structure is the only thing that survives: ' +
			'woven canvas weave, fine wood grain, a soft geometric relief, coarse paper. ' +
			'A horizon, a focal point, or a strong colour cast will fight the pine green ' +
			'and the amber accent and read as a smudge in the light theme.'
	}
];

/** @param {string} id */
export const slot = (id) => {
	const found = SLOTS.find((s) => s.id === id);
	if (!found)
		throw new Error(
			`Unknown image slot "${id}". Declared slots: ${SLOTS.map((s) => s.id).join(', ')}`
		);
	return found;
};

/** Repository root, resolved from this file's location. */
export const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Resolve the original backing a slot, or null when none has been dropped yet.
 * Absence is a normal state — every consumer falls back rather than failing, so
 * the build is green before any photography exists.
 *
 * @param {string} id
 * @returns {string | null} absolute path to the original
 */
export const findSource = (id) => {
	for (const ext of SOURCE_EXTENSIONS) {
		const candidate = join(repoRoot, SOURCE_DIR, `${id}.${ext}`);
		if (existsSync(candidate)) return candidate;
	}
	return null;
};
