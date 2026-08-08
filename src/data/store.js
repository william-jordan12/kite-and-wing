export const CATEGORIES = [
  {
    id: 'kiteboarding',
    name: 'Kiteboarding',
    tagline: 'Kites, bars, boards and harnesses',
    brands: ['Duotone', 'Core', 'North', 'Cabrinha', 'F-One', 'Ozone', 'Eleveight', 'Airush', 'Slingshot', 'Reedin'],
  },
  {
    id: 'wing-foiling',
    name: 'Wing & Foiling',
    tagline: 'Wings, foils and related gear',
    brands: ['Armstrong', 'Duotone', 'F-One', 'North', 'Axis Foils', 'Naish', 'Cabrinha', 'Code Foils', 'KT Foiling', 'Sabfoil'],
  },
  {
    id: 'windsurfing',
    name: 'Windsurfing',
    tagline: 'Sails, boards and rigs',
    brands: ['Severne', 'Duotone', 'NeilPryde', 'Starboard', 'JP Australia', 'Goya', 'Fanatic', 'Ezzy Sails', 'Point-7', 'RRD'],
  },
]

export const PRODUCTS = [
  // ---------------- Kiteboarding ----------------
  { id: 'rebel-2026', name: 'Rebel 2026', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1899, size: '12m', description: 'The legendary big-air machine, reworked for explosive boosts and smooth landings.' },
  { id: 'click-bar-2026', name: 'Click Bar 2026', brand: 'Duotone', category: 'kiteboarding', type: 'Control Bar', price: 549, size: '55cm', description: 'Tool-free trim and quick release in a compact, durable control bar.' },
  { id: 'xr7', name: 'XR7', brand: 'Core', category: 'kiteboarding', type: 'Kite', price: 1799, size: '12m', description: 'All-round high performance kite with massive hang time and easy relaunch.' },
  { id: 'orbit-2026', name: 'Orbit 2026', brand: 'North', category: 'kiteboarding', type: 'Kite', price: 1849, size: '9m', description: 'Freestyle flagship tuned for unhooked pop and fast, direct handling.' },
  { id: 'switchblade', name: 'Switchblade', brand: 'Cabrinha', category: 'kiteboarding', type: 'Kite', price: 1749, size: '10m', description: 'The go-to do-everything kite with predictable power and relaunch.' },
  { id: 'bandit', name: 'Bandit S', brand: 'F-One', category: 'kiteboarding', type: 'Kite', price: 1699, size: '12m', description: 'Lightweight, lively and forgiving — the rider favorite from F-One.' },
  { id: 'edge-2026', name: 'Edge 2026', brand: 'Ozone', category: 'kiteboarding', type: 'Kite', price: 1829, size: '13m', description: 'Widest wind range and massive hang time for foil and big-air riders.' },
  { id: 'rs-2026', name: 'RS 2026', brand: 'Eleveight', category: 'kiteboarding', type: 'Kite', price: 1649, size: '11m', description: 'Performance freeride kite blending drift, hang time and easy handling.' },
  { id: 'lithium', name: 'Lithium 2026', brand: 'Airush', category: 'kiteboarding', type: 'Kite', price: 1729, size: '10m', description: 'High-aspect all-rounder with great low-end power and stability.' },
  { id: 'rally', name: 'Rally', brand: 'Slingshot', category: 'kiteboarding', type: 'Kite', price: 1599, size: '12m', description: 'Versatile freeride kite with a playful feel and solid boosting.' },
  { id: 'supermodel', name: 'Supermodel', brand: 'Reedin', category: 'kiteboarding', type: 'Kite', price: 1679, size: '11m', description: 'New-school all-rounder designed for loops, surf and everything between.' },
  { id: 'jaime-foil', name: 'Jaime Foil', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 1199, size: '138cm', description: 'Freestyle twintip with light carve and massive pop.' },
  { id: 'atmos', name: 'Atmos', brand: 'North', category: 'kiteboarding', type: 'Twin Tip Board', price: 1099, size: '140cm', description: 'All-terrain twintip built for speed, comfort and durability.' },
  { id: 'xcaliber', name: 'XCaliber', brand: 'Cabrinha', category: 'kiteboarding', type: 'Twin Tip Board', price: 999, size: '138cm', description: 'Big-air twin tip engineered for height and stable landings.' },
  { id: 'duotone-ts-freestyle-sls-2025-140cm', name: 'TS Freestyle SLS 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 915, size: '140cm', description: 'Freestyle twintip with big pop and a light, snappy feel.' },

  // ---------------- Wing & Foiling ----------------
  { id: 'unit-wing', name: 'Unit Wing', brand: 'Duotone', category: 'wing-foiling', type: 'Wing', price: 1099, size: '4.5m', description: 'Compact, powerful wing with excellent drift and featherlight feel.' },
  { id: 'swing-wing', name: 'Swing V4', brand: 'F-One', category: 'wing-foiling', type: 'Wing', price: 1149, size: '5.0m', description: 'Tried-and-tested wing with smooth power delivery and easy control.' },
  { id: 'armstrong-wing', name: 'CF Wing', brand: 'Armstrong', category: 'wing-foiling', type: 'Wing', price: 1199, size: '5.0m', description: "Armstrong's performance wing built for precision foiling." },
  { id: 'nova-wing', name: 'Nova Wing', brand: 'North', category: 'wing-foiling', type: 'Wing', price: 1099, size: '4.5m', description: 'Beginner-friendly yet high-performance wing from North.' },
  { id: 'naish-wing', name: 'Surf Wing', brand: 'Naish', category: 'wing-foiling', type: 'Wing', price: 1049, size: '4.5m', description: 'Lightweight surf-focused wing with huge usable range.' },
  { id: 'prism-wing', name: 'Prism Wing', brand: 'Cabrinha', category: 'wing-foiling', type: 'Wing', price: 1079, size: '5.0m', description: 'Balanced all-round wing with intuitive feel in the air.' },
  { id: 'axis-foil', name: 'Axis Complete Foil', brand: 'Axis Foils', category: 'wing-foiling', type: 'Foil Set', price: 2499, size: 'Mast 85cm', description: 'Complete carbon foil kit with premium performance and range.' },
  { id: 'sabfoil', name: 'Sabfoil Cruise Set', brand: 'Sabfoil', category: 'wing-foiling', type: 'Foil Set', price: 2299, size: 'Mast 80cm', description: 'Versatile full foiling package ideal for wing and windsurf foiling.' },
  { id: 'kt-foil', name: 'KT Foiling Race', brand: 'KT Foiling', category: 'wing-foiling', type: 'Foil Set', price: 2199, size: 'Mast 90cm', description: 'Race-oriented foil set delivering speed and glide.' },
  { id: 'code-foil', name: 'Code Foil Package', brand: 'Code Foils', category: 'wing-foiling', type: 'Foil Set', price: 2099, size: 'Mast 80cm', description: 'Progressive foil package with a wide, confidence-building platform.' },

  // ---------------- Windsurfing ----------------
  { id: 'super-hero', name: 'Super Hero', brand: 'Duotone', category: 'windsurfing', type: 'Sail', price: 999, size: '5.4m', description: 'Wave and freestyle sail with instant power and drift control.' },
  { id: 's1', name: 'S-1', brand: 'Severne', category: 'windsurfing', type: 'Sail', price: 899, size: '5.0m', description: 'Pro wave sail delivering performance and durability.' },
  { id: 'rs-racing', name: 'RS:Racing', brand: 'NeilPryde', category: 'windsurfing', type: 'Sail', price: 1099, size: '7.0m', description: 'High-performance racing sail with incredible range.' },
  { id: 'evo', name: 'Evo 100', brand: 'Starboard', category: 'windsurfing', type: 'Board', price: 2199, size: '100L', description: 'Freemove board that feels fast, loose and forgiving.' },
  { id: 'jp-air', name: 'A-Sonic 110', brand: 'JP Australia', category: 'windsurfing', type: 'Board', price: 2099, size: '110L', description: 'All-round freeride board with easy planing and control.' },
  { id: 'ezzy-wave', name: 'Wave 5.2', brand: 'Ezzy Sails', category: 'windsurfing', type: 'Sail', price: 849, size: '5.2m', description: 'Compact wave sail with forgiving power curve.' },
]

export const STORE_INFO = {
  name: 'Kite and Wing Supply',
  email: 'kiteandwindsupply@gmail.com',
  whatsapp: '+15551234567',
  locations: ['California, USA', 'Vilnius, Lithuania'],
  facebook: '',
  instagram: '',
  paymentMethods: [
    'E-Transfer',
    'Revolut',
    'Cards',
    'Google Pay',
    'Cash App',
    'Venmo',
    'Zelle',
    'Bitcoin',
    'Apple Pay',
    'Chime',
    'Bank Transfer',
    'Cryptocurrency',
    'Wire Transfer',
  ],
}

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id)
}

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByCategory(categoryId) {
  return PRODUCTS.filter((p) => p.category === categoryId)
}

export function getProductsByBrand(categoryId, brand) {
  return getProductsByCategory(categoryId).filter((p) => p.brand === brand)
}

export const formatPrice = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
