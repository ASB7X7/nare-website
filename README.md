# NARÉ website

Existing vanilla HTML/CSS/JavaScript storefront, extended without changing framework or replacing its visual system. Serve the repository root with any static HTTP server and open `index.html`. There is no build step or runtime dependency.

## Storefront

- Original Hero and footer markup are preserved. Original CSS remains at the beginning of `styles.css`; extensions follow it and reuse its tokens and classes.
- Hash routes: `#top`, `#coffee`, `#sweets`, `#equipment-catalog`, `#fortune`; existing section links remain supported.
- `script.js` defines the normalized `products` records independently of rendering: 8 coffees, 6 sweets and 16 equipment items. Existing Yirgacheffe, Fazenda and El Diviso lot names and their prices are retained.
- Catalog filters combine without navigation; prices in the coffee catalog refer to the 250 g variant. Quick View offers 250 g / 500 g / 1 kg, six grinds, quantity and taste profiles.
- Cart keys include product, weight and grind. Quantities are bounded by stock across variants. Pair additions are atomic. Cart state is stored on the current device in `nare-cart-v1` and synchronized across tabs; malformed records are normalized. Storage failures leave in-memory shopping available.
- Quiz ranking uses brewing method, flavor and strength. Pairing records explain the recommended sweet.
- Native modal dialogs supply focus containment and Escape handling. The mobile menu exposes expanded state; reduced-motion preferences disable animation.

## Deliberate boundaries

Products, prices, stock and compositions are demonstration content and are identified as such. Actual ordering, payments, delivery calculation and stock synchronization are not connected. Checkout exports a local text request; it does not transmit personal information or claim an order was placed.

The fortune page has local photo preview and a Jenova integration through `server/server.mjs`. Until an HTTPS backend URL, server-only API key and agent slug are configured, submission stays disabled. No canned prediction is presented as AI. See [FORTUNE-SETUP.md](FORTUNE-SETUP.md) for setup and remaining activation steps. GitHub Pages continues to serve the storefront; Node runs separately.

Original social links had `href="#"`; they remain unchanged pending real brand account URLs.

## Assets

- `assets/nare-sweets.webp` and `assets/nare-sweets-small.webp`: WebP conversions of the user's supplied NARÉ SWEETS photograph; the artwork is unchanged.
- `assets/coffee.webp`: generated illustration of the brand packaging, used as a packaging reference in Quick View. Coffee cards retain the existing CSS packaging artwork and identify the selected lot. The photographed example says ETHIOPIA; other lots are explicitly named in product details.
- `assets/chocolates.webp`: generated illustration of an assortment, not a photograph of each production recipe.
- `assets/equipment-atlas.webp`: generated 4×4 catalog atlas in row-major category order. Product records carry the cell index; CSS displays the corresponding illustration. Brand/model specifications are demonstration content.

All generated assets used the built-in ImageGen tool. Generation prompts are in `assets/ASSET-PROMPTS.txt`. No external image hotlinks or image-loading service is required.

## Verification

Run `npm start` with Node 22+ and open `tests/browser.html`, then press **Run checks**. The dependency-free browser suite checks filters, sorting, search, variants, cart totals and stock limits, atomic pair additions, recommendations, persistence, fortune preparation mode and local photo validation/preview, asset loading and layouts at 320, 390, 768, 1024 and 1440 px. It restores the prior local cart when it finishes. Run only against a local development copy without Jenova credentials. `npm test` runs server integration tests with a mocked provider; no paid API calls occur.

Additional checks: `node --check script.js`, `git diff --check`, visual comparison of the original and expanded site, and keyboard checks of the native dialogs. There is no framework build to run.
