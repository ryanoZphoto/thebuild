## Wild West Wall Art – Developer Guide

This document explains the structure of the site, what each file does, and where to edit specific behaviors and styles. It is intended for day‑to‑day development and maintenance.

### Quick start
- Edit pages: `index.html`, `photo-detail.html`, `cart.html`
- Global styles: `styles.css`
- Images: `gallery_images/` for gallery thumbnails; `<finish>_previews/` for finish previews (`canvas_previews/`, `metal_previews/`, `acrylic_previews/`)
- Build step generates `gallery-list.json` automatically from `gallery_images/`
- Deploy via Netlify; build command is configured in `netlify.toml`

### File tree (top-level)
- `index.html` – Landing page (hero, About, 3D shelf gallery, pricing). No checkout code here.
- `photo-detail.html` – Per‑photo detail page with finish tabs and preview grid. “Order This Print” routes to cart.
- `cart.html` – Standalone checkout form + PayPal buttons.
- `styles.css` – Global theme, nav, hero slider, 3D shelf styles, preview grids, CTA button, etc.
- `scripts/generate-gallery.js` – Build-time script that creates `gallery-list.json` based on images present in `gallery_images/`.
- `gallery-list.json` – Generated at build; consumed by `index.html` to populate the gallery.
- `netlify.toml` – Netlify build config.
- `README.md` – Product/readme overview. See this document for dev details.

### Navigation (all pages)
- The header uses `.nav` and `.nav-inner` with a brand link and three menu items: `Gallery`, `Cart`, `Contact`.
- Mobile toggle button `.nav-toggle` controls `#nav-menu` visibility (added on all pages).
- Update labels/links in each page’s `<nav>` block to change the menu; styles live under “Navigation (new)” in `styles.css`.

### index.html – Landing page
- Sections (in order):
  - `<nav class="nav">` – Brand + menu. Brand href points to `index.html`.
  - `#hero` – Minimal image slider. Slides are `.slide` divs with background-image URLs pointing to files in `gallery_images/`.
  - `#about` – Short intro and a CTA linking to `#gallery`.
  - `#gallery` – 3D shelf gallery. Structure:
    - `.shelf-container` → `.shelf` (visual shelf) and `.items` (JS injects cards here).
    - Each card is a `.shelf-item` containing an `<img.canvas-img>`.
    - Clicking a card navigates to `photo-detail.html?img=<filename>`.
  - `#pricing` – Static pricing card(s) for quick reference (not tied to checkout logic).
  - `<footer>` – Copyright.

- Scripts (bottom of file):
  - Mobile nav toggle IIFE.
  - Hero slider IIFE: rotates `.slide.active` every 5 seconds.
  - Gallery init IIFE:
    - Fetches `gallery-list.json` generated at build time.
    - Creates `.shelf-item` elements with the image as `gallery_images/<file>`.
    - Adds hover tilt and click → navigates to `photo-detail.html` with `img` query param.
  - Note: There is no PayPal or checkout UI on this page by design.

### photo-detail.html – Photo detail and finish previews
- Purpose: Show a single photo with different finishes and multiple preview variants per finish.
- Key DOM:
  - `#photo-title` – Humanized title from the `img` query param.
  - `.finish-tabs` – Three buttons with `data-finish="canvas|metal|acrylic"`.
  - `#preview-container.preview-container` – Responsive grid that holds preview images.
  - `#order-btn.order-cta` – Routes to `cart.html` with `img`, `finish`, and `title` in the query string.
- Script:
  - Parses `?img=<filename>` and derives `baseName` + readable title.
  - `loadFinishVariants(finish)` builds a candidate list of preview files and checks them, only rendering those that exist.
    - Folder is `<finish>_previews/`
    - Accepted patterns (any may be used):
      - `<base>_<finish>.{jpg|jpeg|png}`
      - `<base>_<finish>1.{jpg|jpeg|png}`, `<base>_<finish>2.{jpg|jpeg|png}`, … up to `10`
      - `<base>_<finish>_variant.{jpg|jpeg|png}`
    - If none exist, falls back to `gallery_images/<img>`.
  - Adjusts `grid-template-columns` based on number of variants to keep previews large and viewable.
  - The Order button builds a URL to `cart.html` with the selected `finish`.

### cart.html – Checkout
- Purpose: Collect shipping details and process payment with PayPal, then submit a Netlify form.
- Form:
  - Netlify form: `<form name="order" data-netlify="true" action="/thankyou.html">`.
  - Hidden inputs capture `photo_title`, `paypal_order_id`, `paypal_payer_email`.
  - Shipping fields are required; client-side validation runs before PayPal order creation.
- Pricing logic:
  - `prices` constant defines per-finish price tables.
  - `shippingCost` is a flat rate used for totals and PayPal breakdown.
  - `updateTotal()` recomputes the total when `finish`, `size`, or `quantity` changes.
- Preview:
  - `#item-preview` shows a single image representing the selected finish.
  - Attempts `<finish>_previews/<base>_<finish>.jpg` first and falls back to `gallery_images/<img>` if not found.
- PayPal:
  - SDK is loaded dynamically on this page only.
  - `renderPayPalButtons()` creates an order with item line, total, and shipping address.
  - On approval, the capture response is used to fill hidden inputs, then the Netlify form is submitted.
  - Live Client ID constant is inside `cart.html` (search for `LIVE_CLIENT_ID`). Replace with your own.

### styles.css – Global styles
- Theme and base: body colors, earthy palette.
- Navigation: `.nav`, `.nav-inner`, `.nav-links`, `.nav-toggle` including mobile breakpoint at 720px.
- Hero slider: `.hero-slider`, `.slide`, `.slide.active`.
- About: `#about` and `.about-content`.
- 3D shelf: `.shelf-container`, `.shelf`, `.items`, `.shelf-item`, `.canvas-img` with hover/tilt effects and responsive sizes.
- Finish tabs: `.finish-tabs` and `.finish-tabs button.active`.
- Preview grid: `.preview-container` sized for large, viewable images.
- CTA: `.order-cta` polished button styles.
- Form/grid helpers: `.grid-2`, inputs, and basic button styles.

### scripts/generate-gallery.js – Build‑time gallery list
- Node script invoked by Netlify (`netlify.toml`).
- Ensures `gallery_images/` exists; if missing or unreadable, it creates the folder and writes an empty `gallery-list.json` so the build won’t fail.
- Generates a sorted list of image filenames with extensions `.jpg`, `.jpeg`, `.png` and writes to `gallery-list.json`.

### netlify.toml – Netlify build
- Build command: `node scripts/generate-gallery.js && echo 'Build complete'`
- This runs on deploy and during `netlify dev` (see the `[dev]` block if set).

### Images and folder conventions
- Gallery thumbnails (landing page shelf): `gallery_images/` – any `.jpg`, `.jpeg`, `.png` files. These become the clickable cards.
- Per‑finish previews (detail page):
  - `canvas_previews/`
  - `metal_previews/`
  - `acrylic_previews/`
- Naming patterns for previews (pick any):
  - `<base>_<finish>.jpg`
  - `<base>_<finish>1.jpg`, `<base>_<finish>2.jpg`, … `<base>_<finish>10.jpg`
  - `<base>_<finish>_variant.jpg`
- `<base>` must match the gallery image name without extension. Example:
  - Gallery image: `gallery_images/superstitionmtn.jpg`
  - Previews:
    - `canvas_previews/superstitionmtn_canvas.jpg`
    - `metal_previews/superstitionmtn_metal1.jpg`
    - `metal_previews/superstitionmtn_metal2.jpg`
    - `acrylic_previews/superstitionmtn_acrylic.jpg`

### Where to change common things
- Hero slider images: in `index.html`, update the three `.slide` background-image URLs under `#hero`.
- Prices and shipping: in `cart.html`, edit the `prices` object and `shippingCost` constant.
- PayPal client ID (Live): in `cart.html`, search for `LIVE_CLIENT_ID`.
- Menu labels/links: in each page’s `<nav>`; consistent structure is already present across all pages.
- Card sizes/spacing/tilt: `styles.css` under the “3D Shelf Styles” section (`.shelf-container`, `.shelf-item`, `.canvas-img`).
- Preview sizing: `styles.css` under “Larger photo previews” and base `.preview-container` rules.

### Local development
- Simply open `index.html` in a browser to preview. The gallery will read `gallery-list.json`; if it doesn’t exist yet, run `node scripts/generate-gallery.js` once or add an image to `gallery_images/` and redeploy on Netlify.
- For live PayPal testing, consider using a separate Live client/app in your PayPal account to avoid impacting production.

### Deployment and caching
- Netlify runs the generator to produce `gallery-list.json` from the current repo state.
- After changing images or preview assets, redeploy. Use a hard refresh if assets seem cached.

### Troubleshooting
- Empty gallery: ensure `gallery_images/` exists and contains images; check `gallery-list.json` was generated.
- Finish previews not showing: verify file names and folders match the accepted patterns; confirm `base` name matches the gallery image (without extension).
- PayPal “Missing shipping fields”: required shipping inputs must be filled before the PayPal window opens.
- Build failed: confirm `scripts/generate-gallery.js` exists and Node can run it; the script is resilient and should not hard‑fail the build.

### Notes
- The landing page intentionally contains no checkout logic to keep it lightweight and focus on discovery. All ordering happens on `cart.html`.
- The site is static and framework‑free for simplicity and speed; everything runs in the browser with minimal JS.


