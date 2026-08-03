# Kite and Wind Supply

A responsive e-commerce website for **Kite and Wind Supply** — premium kiteboarding, wing foiling and windsurfing gear. Shipping from California, USA and Vilnius, Lithuania.

Built with **React + Vite**. No backend required: orders are finalized manually over WhatsApp or email.

## Pages

- **Home** — hero, categories and featured products (no Reviews/FAQ sections)
- **Shop** — `Kiteboarding`, `Wing & Foiling`, `Windsurfing` with per-brand filtering
- **Product** — detail view, quantity, add to cart
- **Cart** — line items, quantities, order summary
- **Checkout** — Full Name, Email, Phone, Shipping/Billing Address + 10 payment methods
- **Payment** — choose WhatsApp or Email to proceed with payment
- **Confirmation** — formatted, copyable payment request text (no automated email is sent)
- **Reviews** — dedicated reviews page
- **FAQ** — dedicated FAQ page

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production build (outputs to dist/)
npm run preview  # preview the production build
```

## Configuration

Edit `src/data/store.js`:

| Setting | What it controls |
| --- | --- |
| `STORE_INFO.email` | Order email address |
| `STORE_INFO.whatsapp` | WhatsApp number used for the "Send via WhatsApp" link — **replace the placeholder** `+15551234567` with your real number |
| `STORE_INFO.paymentMethods` | The payment methods shown at checkout |
| `CATEGORIES` / `PRODUCTS` | Navigation, brand filters and product catalog |

## Order flow

1. Customer adds items to the cart and completes the checkout form.
2. They pick a payment method, then choose **WhatsApp** or **Email** to proceed.
3. No SMTP email is sent. The confirmation screen displays a ready-to-send message (copy button + one-tap WhatsApp/mailto link) containing the item list, total, and customer details.

## Deployment

`npm run build` produces a fully static site in `dist/` — host it on any static host (Netlify, Vercel, GitHub Pages).
