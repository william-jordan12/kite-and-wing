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

export function productImage(product) {
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
