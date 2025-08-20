# Wild West Wall Art

Static site for Wild West Wall Art showcasing metal, acrylic, and canvas prints with PayPal checkout.

For a full developer walkthrough of the codebase (file-by-file, what to edit, build system, and image conventions), see `DEV_README.md`.

### How the checkout works
- **Dynamic PayPal SDK loading**: `index.html` loads the PayPal JS SDK at runtime and renders buttons only after the SDK finishes loading. This prevents race conditions and fixes “paypal is not defined”.
- **Live-only environment**: The page always loads the SDK with the configured Live client ID. No sandbox fallback is used.
- **Order details**: Product selection and totals are calculated client-side. Shipping address is validated before showing the PayPal window. On approval, we capture the transaction and submit the Netlify form with hidden fields for `paypal_order_id` and `paypal_payer_email`.
- **Netlify form handling**: The order form posts to Netlify (`data-netlify="true"`) and redirects to `thankyou.html` via the form `action` attribute.

### Configure PayPal (Live)
1. In your PayPal Dashboard, go to My Apps & Credentials and switch the toggle to **Live**.
2. Copy your Live app’s **Client ID**.
3. In `index.html`, set the constant:
   - `const LIVE_CLIENT_ID = '<your live client id>';`
4. Hard refresh the site and verify in your browser Console that the SDK URL includes `intent=capture` and your client ID. The PayPal popup should open on `www.paypal.com` (not sandbox).

### Development
- Open `index.html` directly in a browser to preview the site locally.
- The SDK will still use your Live client ID. Use a test/staging PayPal app if you want to avoid live charges.

### Deployment
- Deploy the repository to Netlify. The `netlify.toml` publishes the project root. Netlify forms will collect submissions for the `order` form.

### Updating Prices
- Prices and the $10 flat shipping fee are defined in the `prices` constant within `index.html`.
- Update those values to change product pricing. Orders are currently limited to the United States.

### Thank You Page
- Successful purchases redirect to `thankyou.html`.
