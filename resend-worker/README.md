# The Factory catering mailer

This Cloudflare Worker is the server-side bridge for the static GitHub Pages form. It keeps the Resend API key and business email addresses out of browser code.

## Configure and deploy

From this directory:

```sh
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CATERING_TO_EMAIL
npx wrangler secret put CATERING_FROM_EMAIL
npx wrangler deploy
```

After deployment, put the Worker URL in the root `catering-config.js` file:

```js
window.FACTORY_CATERING_ENDPOINT = "https://your-worker-url.workers.dev";
```

The browser form already sends the catering fields as JSON to that endpoint. The Worker validates the required fields, builds the business email, and sends it through Resend with the customer’s email as the reply-to address.

The Worker returns a configuration error until all three server-side values are set, so the site does not claim a submission was delivered before Resend is ready.
