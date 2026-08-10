/**
 * Build responsive derivatives for the declared texture slots.
 * Run with `npm run img`.
 *
 * Originals live untracked in assets/source/; the AVIF + WebP derivatives this
 * writes are committed, and Vite fingerprints them at build time. Slots without
 * an original are reported and skipped — the components that consume them render
 * nothing when their files are absent, so a partly-filled set is a valid state
 * rather than a broken build.
 *
 * The share card is not built here; it has its own composition step in
 * gen-assets.mjs.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { OUT_DIR, SLOTS, findSource, repoRoot } from './images.config.mjs';

/** Quality settings — texture, viewed at ~8% opacity, tolerates aggressive compression. */
const AVIF = { quality: 45, effort: 6 };
const WEBP = { quality: 62, effort: 5 };

const outDir = join(repoRoot, OUT_DIR);
await mkdir(outDir, { recursive: true });

const textureSlots = SLOTS.filter((s) => Array.isArray(s.widths) && s.widths.length > 0);
const written = [];
const missing = [];

for (const s of textureSlots) {
	const source = findSource(s.id);
	if (!source) {
		missing.push(s);
		continue;
	}

	for (const width of s.widths) {
		const height = s.aspect ? Math.round(width / s.aspect) : null;
		const base = sharp(source).resize(
			width,
			height,
			height ? { fit: 'cover', position: 'attention' } : undefined
		);

		for (const [ext, encode] of [
			['avif', (p) => p.avif(AVIF)],
			['webp', (p) => p.webp(WEBP)]
		]) {
			const name = `${s.id}-${width}.${ext}`;
			const buf = await encode(base.clone()).toBuffer();
			await writeFile(join(outDir, name), buf);
			written.push({ name, bytes: buf.length });
		}
	}
}

// Retire derivatives whose slot or width no longer exists, so the committed
// output directory can't accumulate orphans.
if (existsSync(outDir)) {
	const expected = new Set(written.map((w) => w.name));
	for (const name of await readdir(outDir)) {
		if (name.startsWith('.') || expected.has(name)) continue;
		const ownedBySlot = textureSlots.some((s) => name.startsWith(`${s.id}-`));
		if (ownedBySlot) {
			await rm(join(outDir, name));
			console.log(`  – removed stale ${name}`);
		}
	}
}

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;
for (const w of written) console.log(`✓ ${OUT_DIR}/${w.name} (${kb(w.bytes)})`);

for (const s of missing) {
	console.log(`· ${s.id}: no original in assets/source/ — skipped.`);
	console.log(`    wanted for: ${s.consumer}`);
}

if (!written.length && !missing.length) console.log('No texture slots declared.');
