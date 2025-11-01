## Google Merchant Center Feed – Implementation & Operations

### Overview
- **Feed URL (public fetch for GMC)**: `https://ryanosmunphoto.com/feeds/merchant_feed.csv`
- **Source of truth (editable)**: `ryanosmunphoto_gmc_feed.csv` in the project root
- **Generated output (do not edit)**: `feeds/merchant_feed.csv`
- **Generator scripts**:
  - `scripts/copy-images.js` – copies `gallery_images/*` into public `images/`
  - `scripts/generate-photo-pages.js` – creates `photos/<basename>.html` per image
  - `scripts/generate-merchant-feed.js` – builds the final feed with normalized links and images
- **Search protections**:
  - `_headers` sets `X-Robots-Tag: noindex, nofollow` for `/feeds/*`
  - `robots.txt` disallows `/feeds/`

Google Merchant Center (GMC) can still fetch the feed even with `noindex` and `Disallow`; those are for search engines, not for GMC’s direct fetch.

### File Paths
- `ryanosmunphoto_gmc_feed.csv` – CSV you maintain with products
- `feeds/merchant_feed.csv` – generated feed GMC reads
- `images/` – public copies of your `gallery_images/*` for GMC (`.jpg`, `.jpeg`, `.png`, `.gif`)
- `photos/` – static landing pages for each image (used for the product `link`)
- `scripts/copy-images.js` – copies gallery images to `images/`
- `scripts/generate-photo-pages.js` – generates static photo pages under `photos/`
- `scripts/generate-merchant-feed.js` – normalizes and writes the final feed
- `netlify.toml` – build and dev commands that run all generators
- `_headers` – sets `X-Robots-Tag: noindex, nofollow` on `/feeds/*`
- `robots.txt` – `Disallow: /feeds/`

### Build and Dev Integration
In `netlify.toml` the following commands run automatically (in order):
- Build: `node scripts/generate-gallery.js && node scripts/copy-images.js && node scripts/generate-photo-pages.js && node scripts/generate-merchant-feed.js && echo 'Build complete'`
- Dev: `node scripts/generate-gallery.js && node scripts/copy-images.js && node scripts/generate-photo-pages.js && node scripts/generate-merchant-feed.js`

This ensures the feed is regenerated on every deploy and when running locally.

### Local Usage (Manual)
From the project root:
```bash
node scripts/copy-images.js
node scripts/generate-photo-pages.js
node scripts/generate-merchant-feed.js
```
Then verify the generated file exists at `feeds/merchant_feed.csv`.

### Source CSV Format
File: `ryanosmunphoto_gmc_feed.csv`
Columns (headers must exist and be in this order):
- id, title, description, link, image_link, availability, price, brand, condition, google_product_category, item_group_id, product_type

Notes:
- **link (required: includes ?img=)**: The generator expects `link` to include `?img=<filename>` (e.g., `?img=abstract.jpg`). It will rewrite this to your generated static photo page: `https://ryanosmunphoto.com/photos/abstract.html`.
- **image_link (auto-normalized)**: The generator overwrites `image_link` to `https://ryanosmunphoto.com/images/<encoded-filename>` (e.g., `https://ryanosmunphoto.com/images/abstract.jpg`) when `img` is present in `link`.
- **Accepted image formats**: `.jpg`, `.jpeg`, `.png`, `.gif`. Files are copied from `gallery_images/` into `images/` for public access.
- **price** must include currency, e.g., `70.00 USD`.
- **availability** commonly `in stock`.
- **condition** commonly `new`.

### How Generation Works
`scripts/copy-images.js`:
- Ensures `images/` exists.
- Copies all `gallery_images/*.(jpg|jpeg|png|gif)` to `images/` with the same filenames.

`scripts/generate-photo-pages.js`:
- Ensures `photos/` exists.
- For each `gallery_images/<file>`, creates `photos/<basename>.html` with a basic detail page and an Order CTA.

`scripts/generate-merchant-feed.js`:
- Ensures `feeds/` exists.
- Reads `ryanosmunphoto_gmc_feed.csv` (if missing, writes header only for a valid empty feed).
- Parses rows and looks for `img` in the `link` column.
- Rewrites `link` to `https://ryanosmunphoto.com/photos/<encoded-basename>.html`.
- Normalizes `image_link` to `https://ryanosmunphoto.com/images/<encoded-filename>`.
- Writes the final CSV to `feeds/merchant_feed.csv`.

### Adding or Updating Products
1) Edit `ryanosmunphoto_gmc_feed.csv` and add/update rows.
   - Make sure the `link` column includes `?img=<exact filename from gallery_images/>` (case-sensitive on many CDNs/hosts).
2) Commit changes and deploy (Netlify will regenerate the pages, image copies, and feed automatically), or run locally with the commands above.
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
- Unsupported image type (GMC):
  - Confirm the file truly is a JPEG/PNG/GIF (not mislabeled). Re-export if needed.
  - Verify `image_link` points to `/images/<file>` and that `/images/` contains the file (script copies from `gallery_images/`).
  - Confirm the extension matches the actual format (`.jpg` for JPEG, etc.).
- Photo page 404s: make sure `photos/<basename>.html` exists; run `generate-photo-pages` or redeploy.
- Feed cached by CDN: Netlify typically serves static assets with caching. If you need frequent updates, keep the scheduled fetch cadence reasonable or consider a Netlify Function to generate on request.

### Optional Enhancements (Future)
- Sheet-driven feed: Pull a Google Sheet or Airtable at build time and output `merchant_feed.csv` (no manual CSV edits).
- Generated from product JSON: Maintain a `products.json` and generate both the site UI and the GMC feed from one source.
- Scheduled regeneration: Add a scheduled Netlify build or serverless function to re-generate without manual deploys.

### Version Control
- `feeds/merchant_feed.csv` is generated during build. You don’t need to commit it. If desired, add `feeds/merchant_feed.csv` to `.gitignore` to avoid accidental commits.
- `images/` and `photos/` are generated from `gallery_images/`; you can avoid committing them if you prefer clean diffs.

### Related
- Gallery list generation: `scripts/generate-gallery.js` outputs `gallery-list.json` for the UI; it’s independent from the GMC feed but runs in the same build pipeline.

### Example Row Transformation (Conceptual)
- Input CSV row (excerpt):
  - link: `https://ryanosmunphoto.com/cart.html?img=abstract.jpg&finish=metal&title=Abstract&size=16x24`
  - image_link: any value (ignored if `img` present)
- Output feed row (excerpt):
  - link: `https://ryanosmunphoto.com/photos/abstract.html`
  - image_link: `https://ryanosmunphoto.com/images/abstract.jpg`


