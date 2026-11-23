# CanvasPrints — Apple-language redesign prototype

A complete redesign concept for **mycanvasprints.com.my**: a modern, contemporary storefront built on
Apple's actual design system (extracted via [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md),
`design-md/apple/DESIGN.md`), with a working order-flow prototype.

## Run it

Open `index.html` in any browser — no build step, no dependencies.
(Or serve the folder: `npx serve .`)

## What's inside

| File | Purpose |
|---|---|
| `index.html` | Full single-page redesign + 5-step order modal |
| `assets/css/styles.css` | Apple token implementation (colors, type scale, radii, frosted bars) |
| `assets/js/app.js` | Order flow, pricing engine, scroll motion, configurator |
| `DESIGN.md` | The brand design system (Stitch DESIGN.md format) — drop it into any AI agent |
| `preview.html` | Token & component catalog — light surfaces (colors, type, buttons, chips, cards, forms, bars, radius/shadow, do's & don'ts) |
| `preview-dark.html` | Same catalog on dark tiles (tile system, Sky Link Blue rules, card-dark, FAQ, dark sticky bar) |

## Highlights

- **Apple design language, faithfully applied** — single Action Blue accent (#0066cc), 17px body copy,
  weight-600 tight-tracked headlines, alternating white/parchment/near-black full-bleed tiles,
  exactly one product shadow (imagery only), frosted sub-nav and sticky bars, scale(0.95) press states.
- **Two-row navigation** — pure-black global nav + frosted product sub-nav with persistent CTA.
- **Scroll-driven format showcase** — sticky horizontal strip that scrubs with page scroll.
- **Live configurator** — size/frame/finish chips morph the canvas preview (incl. triptych mode) and price.
- **Floating sticky bars** — running total + primary CTA, on page and inside checkout (Apple's
  `floating-sticky-bar` pattern).
- **Smooth 5-step checkout** — upload (drag & drop works locally) → size → frame & finish →
  Malaysian address → FPX / TNG / GrabPay / Atome / card → confirmation with ETA.
- **Copywriting** — full rewrite in the short, confident Apple register (see `DESIGN.md` + page copy).

## Notes

- Prices, stats and reviews are **illustrative** — edit the `SIZES`/`FRAMES`/`FINISHES` objects in `app.js`.
- Canvas "photography" is rendered as CSS gradient artwork so the prototype is fully self-contained;
  swap the `.a1–.a6` classes for real product/lifestyle photography in production.
- Checkout is a demo — wire the flow to real endpoints (upload storage, price API, payment gateway
  such as iPay88/Billpliz/Stripe) before launch.
