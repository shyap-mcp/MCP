# CanvasPrints — Design System (DESIGN.md)

> Brand design language for the CanvasPrints redesign, derived from Apple's extracted design system
> (source: [VoltAgent/awesome-design-md · apple/DESIGN.md](https://github.com/VoltAgent/awesome-design-md)).
> Canvas artwork gradients are **content** ("photography"), not chrome — all UI chrome is monochrome + one accent.

```yaml
version: alpha
name: CanvasPrints-design-system
description: >
  An Apple-language storefront for a Malaysian canvas printing studio. Edge-to-edge tiles alternate
  white, parchment and near-black canvases. SF-style typography with negative tracking at display sizes.
  A single Action Blue carries every interactive element. Exactly one product shadow, reserved for
  canvas imagery. Frosted sticky bars carry the running total and the primary CTA through the order flow.

colors:
  primary: "#0066cc"          # Action Blue — every interactive element
  primary-focus: "#0071e3"    # Focus rings + selected chips
  primary-on-dark: "#2997ff"  # Links on dark tiles
  ink: "#1d1d1f"
  ink-muted-80: "#333333"
  ink-muted-48: "#7a7a7a"
  body-on-dark: "#ffffff"
  body-muted-dark: "#cccccc"
  canvas: "#ffffff"
  canvas-parchment: "#f5f5f7"
  surface-pearl: "#fafafc"
  surface-tile-1: "#272729"
  surface-tile-2: "#2a2a2c"   # used when adjacent to tile-1 (micro-step separation)
  surface-black: "#000000"    # global nav + final CTA void
  chip-translucent: "rgba(210,210,215,0.64)"
  hairline: "#e0e0e0"
  divider-soft: "#f0f0f0"

typography:
  hero-display: {size: 56px, weight: 600, lh: 1.07, ls: -0.28px}
  display-lg:   {size: 40px, weight: 600, lh: 1.10, ls: 0}
  lead:         {size: 28px, weight: 400, lh: 1.14, ls: +0.196px}
  lead-airy:    {size: 24px, weight: 300, lh: 1.5}          # rare, airy moments only
  tagline:      {size: 21px, weight: 600, lh: 1.19, ls: +0.231px}
  body:         {size: 17px, weight: 400, lh: 1.47, ls: -0.374px}   # 17px, never 16px
  caption:      {size: 14px, weight: 400, lh: 1.43, ls: -0.224px}
  caption-strong:{size: 14px, weight: 600}
  fine-print:   {size: 12px, ls: -0.12px}
  nav-link:     {size: 12px, ls: -0.12px}
  dense-link:   {size: 17px, lh: 2.41}                      # footer columns
  # weight ladder: 300 / 400 / 600 only — 500 is deliberately absent

rounded:
  sm: 8px      # inner imagery, utility buttons
  md: 11px     # pearl capsules, inputs
  lg: 18px     # utility cards, modal
  pill: 9999px # primary CTAs, chips, search, sticky-bar CTA

spacing:
  base: 8px
  card-padding: 24px
  section: 80px
  grid-gap: 24px

elevation:
  product-shadow: "rgba(0,0,0,0.22) 3px 5px 30px"  # the ONLY shadow — canvas imagery only
  frosted-bars: "parchment @ 80% + saturate(180%) blur(20px)"

components:
  global-nav: {bg: "#000000", height: 44px, links: 12px/400}
  sub-nav-frosted: {bg: parchment @80% + blur, height: 52px, cat: 21px/600, cta: blue pill}
  product-tile: {full-bleed, radius: 0, padding: 80px, centered stack: headline → lead → 2 pills → render}
  store-utility-card: {bg: white, border: 1px hairline, radius: 18px, padding: 24px}
  configurator-chip: {pill, white, caption text; selected = 2px solid #0071e3}
  floating-sticky-bar: {frost, 64px, left: running total, right: blue pill}
  footer: {bg: parchment, dense-link columns, fine-print legal}
```

## Do's
- One accent (Action Blue) for every "click me" signal. Links on dark tiles use #2997ff.
- Headlines 600 weight with negative tracking. Body at 17px/1.47.
- Press feedback everywhere: `scale(0.95)`. Focus rings 2px #0071e3.
- Section rhythm via surface change — white → parchment → dark (tile-1 → tile-2 when adjacent).
- Frosted sticky bars carry price + CTA through the configurator and checkout.

## Don'ts
- No second accent color. No shadows on cards/buttons/text — imagery only.
- No decorative gradients in UI chrome (artwork gradients are content).
- No weight 500. No rounded full-bleed tiles.

## Order-flow spec (implemented in `index.html` + `app.js`)
1. **Photo** — drag/drop or browse; FileReader preview; demo fallback.
2. **Size** — configurator chips (Classic/Statement/Grand/Triptych, RM).
3. **Frame & finish** — mirror/black/white/walnut/noir + matte/satin/gloss; live preview morphs.
4. **Details** — validated Malaysian address form.
5. **Payment** — Card / FPX / TNG eWallet / GrabPay / Atome.
6. **Success** — order number, ETA, receipt card.
Sticky bar (in-modal and on-page) always shows running total per Apple's floating-sticky-bar.
