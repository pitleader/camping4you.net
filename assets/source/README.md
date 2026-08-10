# `assets/source/` — original images, untracked

Drop hand-downloaded originals here at full resolution. Git ignores everything
in this folder except this README: originals are large, and nothing is served
from here. The generators read these and write optimized derivatives that _are_
committed.

## Where the files come from

Unsplash+ (the paid subscription), downloaded through the website — **not**
through the Unsplash API.

That is a deliberate choice. The Unsplash+ license permits downloading once and
using the image forever, commercially, with no credit line required, and images
are model- and property-released. The Unsplash **API**, by contrast, requires
that the image URLs it returns be embedded directly — which would put a
third-party origin in the largest-paint path of a prerendered site and force an
`img-src` exception in the Content-Security-Policy that `_headers` pins to
`'self' data:`. So: download by hand, optimize, self-host.

## What may go in a slot

**Non-representational imagery only.** No people, no campsites, no RVs or tow
vehicles, no cabins, no office, no storefront. A stock photo of a family at a
picnic table reads as _this is Leisure Oaks, these are our guests_ — a claim the
owner has not made, and one the project's copy-truth rule forbids. Texture,
material, weather, and abstraction are safe; anything with a subject is not.

The same rule is why **none of these belong on the Google Business Profile**.
Google's photo guidelines require media captured at the business; stock imagery
there gets rejected as misleading. GBP photos have to be real ones, taken at the
park.

## Filenames

One file per declared slot, named for the slot id, any common extension
(`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.tif`):

| File              | Fills                                               |
| ----------------- | --------------------------------------------------- |
| `og-backdrop.*`   | the backdrop of the share card (`static/og.png`)    |
| `texture-rates.*` | the texture band behind the rates cards (home page) |

Slots are declared in `scripts/images.config.mjs`. **Both are optional** — with
no file present the generators fall back to the pure-CSS look and say so, and
the band renders no markup at all, so the site is complete and the build is
green either way.

---

## Slot 1 — `og-backdrop`

### What the build does to it, in order

`scripts/gen-assets.mjs`:

1. **Cover-crop to 1200×630** with sharp's `attention` strategy (it keeps the
   region with the most detail, so you do not control the crop — assume any
   quadrant may survive).
2. **Desaturate and darken**: `saturation → 0.45`, `brightness → 0.85`. Colour
   is more than halved. An image whose whole appeal is its colour arrives grey.
3. **76% ink scrim** — a near-black diagonal wash laid over the whole frame.
   This is the big one: three quarters of the image's tone is gone.
4. **Star field, golden-hour glow, and a pine treeline silhouette** on top. The
   treeline is opaque and occupies the bottom ~15% of the card.
5. **Wordmark, headline, accent rule, and two detail lines** over the left ~60%.

### What to search for

Pre-filtered Unsplash links (Plus, landscape):

- [dark forest canopy](https://unsplash.com/s/photos/dark-forest-canopy?license=plus&orientation=landscape)
- [night sky stars texture](https://unsplash.com/s/photos/night-sky-stars-texture?license=plus&orientation=landscape)
- [dark wood grain](https://unsplash.com/s/photos/dark-wood-grain?license=plus&orientation=landscape)
- [tree bark texture](https://unsplash.com/s/photos/tree-bark-texture?license=plus&orientation=landscape)
- [pine needles macro](https://unsplash.com/s/photos/pine-needles-macro?license=plus&orientation=landscape)
- [rain on dark window](https://unsplash.com/s/photos/rain-on-dark-window?license=plus&orientation=landscape)
- [dark canvas tent fabric](https://unsplash.com/s/photos/dark-canvas-tent-fabric?license=plus&orientation=landscape)

### Reject if

- It contains a person, an RV, a tent in use, a building, or a vehicle.
- It reads as a **place** a visitor could believe is Leisure Oaks. A recognisable
  lake, mountain, or named park is a false claim about the property.
- The **left half is bright or busy** — the wordmark and headline sit there and
  must stay readable at the ~320px-wide thumbnail social clients render.
- It is already dark and flat. Under a 76% scrim it becomes a black rectangle
  and you have paid for nothing; there must be structure to survive.
- It has one strong focal point. Under the scrim that becomes an unexplained
  bright blob behind the text.
- Its appeal is a saturated colour (a sunset, autumn leaves). Step 2 removes it.

### How to judge one

Do not judge it from the original. Drop it in, run `npm run assets`, and open
`static/og.png` — then shrink that window until the card is about 320px wide.
If the headline is still crisp and the backdrop reads as _material_, it works.

---

## Slot 2 — `texture-rates`

### What the build does to it, in order

`scripts/gen-img.mjs` writes derivatives; `TextureBand.svelte` renders them.

1. **Cover-crop to 16:6** at widths 1920 / 1280 / 800, `attention` strategy.
2. **Encode** to AVIF q45 and WebP q62 — lossy enough that fine noise dissolves.
3. **`opacity: 0.08`** in the night theme. This is the decisive step.
4. **`grayscale(0.7)`** — nearly all colour gone.
5. In the **morning (light) theme**: `opacity: 0.05` plus `grayscale(0.85)` and
   **`invert(1)`** — a dark original becomes pale relief, not a grey smudge.
6. **Vertical fade mask** — fully transparent at the section's top and bottom
   edges, full strength between 20% and 80%.

### The rule that decides this slot

**At 8% opacity, geometry survives and tone does not.** Repeating structure — a
weave, a grain, a ruled or diagonal pattern, a relief — still reads. Scratches,
mottling, stains, and soft cloudy surfaces vanish completely. A picture that
looks like a perfect neutral texture in the browser is usually invisible once
these filters land. Pick for _pattern_, not for _surface quality_.

### What to search for

- [canvas fabric texture](https://unsplash.com/s/photos/canvas-fabric-texture?license=plus&orientation=landscape)
- [wood grain texture](https://unsplash.com/s/photos/wood-grain-texture?license=plus&orientation=landscape)
- [woven basket pattern](https://unsplash.com/s/photos/woven-basket-pattern?license=plus&orientation=landscape)
- [diagonal line pattern](https://unsplash.com/s/photos/diagonal-line-pattern?license=plus&orientation=landscape)
- [corrugated metal texture](https://unsplash.com/s/photos/corrugated-metal-texture?license=plus&orientation=landscape)
- [rough paper grain](https://unsplash.com/s/photos/rough-paper-grain?license=plus&orientation=landscape)

### Reject if

- It has **no repeating structure**. A mottled concrete wall, a rust patina, or
  a soft bokeh will be gone at 8% and you will have shipped bytes for nothing.
- It has a **horizon or a focal point**. The band spans the full page width; a
  horizon line cutting across it reads as a rendering bug.
- It has a **strong colour cast**. It will fight the pine green and the campfire
  amber, and the light theme inverts it into something unpredictable.
- Its structure is **finer than a couple of pixels** at 1920 wide. AVIF q45 will
  eat it, and it will alias into moiré on a retina screen.
- It is interesting on its own. If it draws the eye on the page, it is wrong.

### How to judge one

Drop it in, run `npm run img`, `npm run dev`, and look at the **rates section**
of the home page in **both themes** (the toggle is in the nav). Judging it from
the original file will mislead you every time — the filters above are severe.

---

## Regenerating

```sh
npm run assets   # share card  → static/og.png
npm run img      # derivatives → src/lib/assets/img/
```

`npm run assets` also re-reads `src/lib/content/content.json`, so run it after
the operator edits the tagline, phone, or address in the control panel — that is
what keeps the card from drifting from the site.
