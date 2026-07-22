# The Factory Food Truck website

A single-page customer-facing landing site for The Factory at 1521 AR-161 in Jacksonville, Arkansas.

## Preview

From this folder, run:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173`.

## Business details

- Walk-up pickup only
- Monday through Saturday, 11 AM–5 PM or sellout
- Closed Sunday
- Instagram: `@thefactorylr`

Menu prices and descriptions were transcribed from the supplied menu board on June 27, 2026.

## Deployment

This static site is published through GitHub Pages from the repository's `main` branch.

## Catering email handoff

The native catering form is ready for a server-side Resend connection. The Cloudflare Worker in `resend-worker/` handles validation and delivery without exposing the Resend API key in GitHub Pages browser code. Follow `resend-worker/README.md` when the business recipient and sender addresses are ready.
