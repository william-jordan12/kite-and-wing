# Kite and Wind Supply

A responsive e-commerce website for **Kite and Wind Supply** — premium kiteboarding, wing foiling and windsurfing gear. Shipping from California, USA and Vilnius, Lithuania.

Built with **React + Vite** on the frontend and **Vercel Serverless Functions + Neon (Postgres)** for the admin backend. Orders are finalized manually over WhatsApp or email — no SMTP email is sent.

## Pages

- **Home** — hero, categories and featured products (no Reviews/FAQ sections)
- **Shop** — `Kiteboarding`, `Wing & Foiling`, `Windsurfing` with per-brand filtering
- **Product** — detail view, quantity, add to cart
- **Cart** — line items, quantities, order summary
- **Checkout** — Full Name, Email, Phone, Shipping/Billing Address + 10 payment methods
- **Payment** — choose WhatsApp or Email to proceed with payment
- **Confirmation** — formatted, copyable payment request text (no automated email)
- **Reviews** — dedicated reviews page
- **FAQ** — dedicated FAQ page
- **Admin** — `https://your-site.vercel.app/admin` — login-protected dashboard for products and orders

## Architecture

```
Browser (React SPA)
   │  /api/* (same origin)
   ▼
Vercel Serverless Functions   ──►   Neon Postgres
   ├── /api/login        (admin auth → HMAC token)
   ├── /api/products     (GET public, POST admin)
   ├── /api/products/:id (PUT/DELETE admin)
   └── /api/orders       (GET admin, POST public order capture)
```

Products are stored in the database and served to the storefront through `GET /api/products`. The static list in `src/data/store.js` is used only to seed the database and as an offline fallback.

## Getting started

```bash
npm install
cp .env.example .env      # fill in your DATABASE_URL and admin credentials
node scripts/init-db.js   # creates tables and seeds products
npm run dev               # development server
npm run build             # production build (outputs to dist/)
```

### Local API testing

```bash
node scripts/test-api.js  # spins up a local server exercising all endpoints
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `ADMIN_USER` | Admin dashboard username |
| `ADMIN_PASSWORD` | Admin dashboard password |
| `ADMIN_SECRET` | Long random string used to sign admin login tokens |

On **Vercel**: Project → Settings → Environment Variables — add the four values above. Keep them private; never commit `.env`.

## Store configuration

Edit `src/data/store.js`:

| Setting | What it controls |
| --- | --- |
| `STORE_INFO.email` | Order email address |
| `STORE_INFO.whatsapp` | WhatsApp number for the "Send via WhatsApp" link — **replace the placeholder** `+15551234567` |
| `STORE_INFO.paymentMethods` | Payment methods shown at checkout |
| `CATEGORIES` | Navigation + brand filters (seeded brands used by the admin form) |

## Order flow

1. Customer adds items to the cart and completes the checkout form.
2. They pick a payment method, then choose **WhatsApp** or **Email** to proceed.
3. No SMTP email is sent. The confirmation screen displays a ready-to-send message (copy button + one-tap WhatsApp/mailto link).
4. The order is recorded in Neon and appears in the **Admin → Orders** tab.

## Deployment

`npm run build` produces a fully static site in `dist/`. With the `api/` folder present, Vercel builds both the SPA and the serverless functions automatically.
