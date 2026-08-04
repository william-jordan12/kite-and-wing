const PALETTES = {
  kiteboarding: ['#0ea5e9', '#2563eb'],
  'wing-foiling': ['#10b981', '#0d9488'],
  windsurfing: ['#f59e0b', '#ea580c'],
}

const TYPES = {
  kite: 'KITE',
  'control bar': 'BAR',
  'twin tip board': 'TWIN TIP',
  board: 'BOARD',
  wing: 'WING',
  'foil set': 'FOIL',
  sail: 'SAIL',
}

const REAL_IMAGES = {
  'Rebel 2026': '/images/products/rebel-2026.png',
  'Click Bar 2026': '/images/products/click-bar-2026.png',
  'XR7': '/images/products/xr7.jpg',
  'Orbit 2026': '/images/products/orbit-2026.png',
  'Switchblade': '/images/products/switchblade.png',
  'Bandit S': '/images/products/bandit.png',
  'Edge 2026': '/images/products/edge-2026.jpg',
  'RS 2026': '/images/products/rs-2026.png',
  'Lithium 2026': '/images/products/lithium.png',
  'Rally': '/images/products/rally.png',
  'Supermodel': '/images/products/supermodel.webp',
  'Jaime Foil': '/images/products/jaime-foil.png',
  'Atmos': '/images/products/atmos.png',
  'XCaliber': '/images/products/xcaliber.png',
  'Unit Wing': '/images/products/unit-wing.png',
  'Swing V4': '/images/products/swing-wing.png',
  'CF Wing': '/images/products/armstrong-wing.jpg',
  'Nova Wing': '/images/products/nova-wing.png',
  'Surf Wing': '/images/products/naish-wing.png',
  'Axis Complete Foil': '/images/products/axis-foil.png',
  'Sabfoil Cruise Set': '/images/products/sabfoil.jpg',
  'KT Foiling Race': '/images/products/kt-foil.jpg',
  'Code Foil Package': '/images/products/code-foil.jpg',
  'Prism Wing': '/images/products/prism-wing.png',
  'Super Hero': '/images/products/super-hero.png',
  'S-1': '/images/products/s1.jpg',
  'RS:Racing': '/images/products/rs-racing.jpg',
  'Evo 100': '/images/products/evo.jpg',
  'A-Sonic 110': '/images/products/jp-air.jpg',
  'Skate 105': '/images/products/skate.png',
  'Banzai 94': '/images/products/banzai.jpg',
  'Wave 5.2': '/images/products/ezzy-wave.jpg',
  'AC-1 5.6': '/images/products/point7.png',
  'Fire 5.8': '/images/products/rrd-fire.png',
  'Rebel D/LAB 2025': '/images/products/rebel-dlab-2025.png',
  'Neo D/LAB 2025': '/images/products/neo-dlab-2025.png',
  'Mono 2025': '/images/products/mono-2025.png',
  'Neo 2025': '/images/products/neo-2025.png',
  'TS Freestyle SLS 2025': '/images/products/ts-freestyle-sls-2025.png',
  'TS Park 2025': '/images/products/ts-park-2025.png',
  'Boardbag Single Surf 2024': '/images/products/boardbag-single-surf-2024.png',
  'Boardbag Single Compact 2025': '/images/products/boardbag-single-compact-2025.png',
  'Traction Pad SLS Front 2025': '/images/products/traction-pad-sls-front-2025.png',
  'Traction Pad Team Front': '/images/products/traction-pad-team-front.png',
  'Mast-Fuselage Set Slim AL QM': '/images/products/mast-fuselage-slim-al-qm.png',
  'Foil Set Complete AL Surf': '/images/products/foil-set-al-surf.png',
  'Foil Set Complete AL GT': '/images/products/foil-set-al-gt.png',
  'Foil Set Complete AL Freeride': '/images/products/foil-set-al-freeride.png',
  'Cap New Era Adjustable UNDYED': '/images/products/cap-new-era-undyed.png',
  'Wing Set Surf': '/images/products/wing-set-surf.png',
  'Tank Duotone Women': '/images/products/tank-women.png',
  'Mast-Fuselage Set AL 3.0 90/67': '/images/products/mast-fuselage-3.0-90-67.png',
  'Mast-Fuselage Set AL 3.0 75/67': '/images/products/mast-fuselage-3.0-75-67.png',
  'Hoody Team Zip Women': '/images/products/hoody-team-zip-women.png',
}

const PAYMENT_LOGOS = {
  'E-Transfer': '/images/payments/e-transfer.svg',
  Revolut: '/images/payments/revolut.svg',
  Cards: '/images/payments/visa.svg',
  'Google Pay': '/images/payments/google-pay.svg',
  'Cash App': '/images/payments/cash-app.svg',
  PayPal: '/images/payments/paypal.svg',
  Venmo: '/images/payments/venmo.svg',
  Zelle: '/images/payments/zelle.svg',
  Bitcoin: '/images/payments/bitcoin.svg',
  'Apple Pay': '/images/payments/apple-pay.svg',
  Chime: '/images/payments/chime.svg',
  'Bank Transfer': '/images/payments/bank-transfer.svg',
  Cryptocurrency: '/images/payments/crypto.svg',
  'Wire Transfer': '/images/payments/wire-transfer.svg',
}

export function paymentLogo(method) {
  return PAYMENT_LOGOS[method] || null
}

export function productImage(product) {
  if (product.image) return product.image

  const real = REAL_IMAGES[product.name]
  if (real) return real

  const [c1, c2] = PALETTES[product.category] || ['#6366f1', '#4338ca']
  const label = TYPES[product.type.toLowerCase()] || product.type.toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="400" cy="280" r="120" fill="rgba(255,255,255,0.10)"/>
  <circle cx="400" cy="280" r="78" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <circle cx="400" cy="280" r="40" fill="rgba(255,255,255,0.20)"/>
  <text x="400" y="505" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
  <text x="400" y="548" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="500" fill="rgba(255,255,255,0.75)" text-anchor="middle">${product.brand}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
