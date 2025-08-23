## Google Merchant Center Feed – Implementation & Operations

### Overview
- **Feed URL (public fetch for GMC)**: `https://ryanosmunphoto.com/feeds/merchant_feed.csv`
- **Source of truth (editable)**: `ryanosmunphoto_gmc_feed.csv` in the project root
- **Generated output (do not edit)**: `feeds/merchant_feed.csv`
- **Generator script**: `scripts/generate-merchant-feed.js`
- **Search protections**:
  - `_headers` sets `X-Robots-Tag: noindex, nofollow` for `/feeds/*`
  - `robots.txt` disallows `/feeds/`

Google Merchant Center (GMC) can still fetch the feed even with `noindex` and `Disallow`; those are for search engines, not for GMC’s direct fetch.

### File Paths
- `ryanosmunphoto_gmc_feed.csv` – CSV you maintain with products
- `feeds/merchant_feed.csv` – generated feed GMC reads
- `scripts/generate-merchant-feed.js` – Node script that copies/normalizes the source CSV into the `feeds/` directory
- `netlify.toml` – build and dev commands that run the generator
- `_headers` – sets `X-Robots-Tag: noindex, nofollow` on `/feeds/*`
- `robots.txt` – `Disallow: /feeds/`

### Build and Dev Integration
In `netlify.toml` the following commands run automatically:
- Build: `node scripts/generate-gallery.js && node scripts/generate-merchant-feed.js && echo 'Build complete'`
- Dev: `node scripts/generate-gallery.js && node scripts/generate-merchant-feed.js`

This ensures the feed is regenerated on every deploy and when running locally.

### Local Usage (Manual)
From the project root:
```bash
node scripts/generate-merchant-feed.js
```
Then verify the generated file exists at `feeds/merchant_feed.csv`.

### Source CSV Format
File: `ryanosmunphoto_gmc_feed.csv`
Columns (headers must exist and be in this order):
- id, title, description, link, image_link, availability, price, brand, condition, google_product_category, item_group_id, product_type

Notes:
- **link** should point to your cart/landing URL with query params, for example:
  - `https://ryanosmunphoto.com/cart.html?img=abstract.jpg&finish=metal&title=Abstract&size=16x24`
- **image_link** should be the public image URL GMC can fetch (e.g., `https://ryanosmunphoto.com/images/abstract.jpg`).
- **price** must include currency, e.g., `70.00 USD`.
- **availability** commonly `in stock`.
- **condition** commonly `new`.

### How Generation Works
`scripts/generate-merchant-feed.js`:
- Ensures `feeds/` exists.
- Reads `ryanosmunphoto_gmc_feed.csv` (if missing, writes just the header for a valid empty feed).
- Writes the resulting CSV to `feeds/merchant_feed.csv`.

### Adding or Updating Products
1) Edit `ryanosmunphoto_gmc_feed.csv` and add/update rows.
2) Commit changes and deploy (Netlify will regenerate the feed automatically), or run locally with the command above.
3) The feed is then available at `/feeds/merchant_feed.csv` for GMC.

### Submitting to Google Merchant Center
- Feed type: Scheduled fetch (recommended)
- Fetch URL: `https://ryanosmunphoto.com/feeds/merchant_feed.csv`
- Schedule: Daily or your preferred cadence

### Privacy / Indexing Considerations
- `_headers` adds `X-Robots-Tag: noindex, nofollow` to all `/feeds/*` files
- `robots.txt` includes `Disallow: /feeds/`
- GMC fetch is unaffected by these settings; search engines are discouraged from indexing

### Troubleshooting
- Feed does not exist: ensure `ryanosmunphoto_gmc_feed.csv` is present and rebuild; check `feeds/` folder.
- CSV validation errors in GMC: confirm header names and column order; ensure valid currency format (e.g., `120.00 USD`).
- Image not rendering in GMC: verify `image_link` resolves publicly and the URL is correct.
- Feed cached by CDN: Netlify typically serves static assets with caching. If you need frequent updates, keep the scheduled fetch cadence reasonable or consider a Netlify Function to generate on request.

### Optional Enhancements (Future)
- Sheet-driven feed: Pull a Google Sheet or Airtable at build time and output `merchant_feed.csv` (no manual CSV edits).
- Generated from product JSON: Maintain a `products.json` and generate both the site UI and the GMC feed from one source.
- Scheduled regeneration: Add a scheduled Netlify build or serverless function to re-generate without manual deploys.

### Version Control
- `feeds/merchant_feed.csv` is generated during build. You don’t need to commit it. If desired, add `feeds/merchant_feed.csv` to `.gitignore` to avoid accidental commits.

### Related
- Gallery list generation: `scripts/generate-gallery.js` outputs `gallery-list.json` for the UI; it’s independent from the GMC feed but runs in the same build pipeline.


