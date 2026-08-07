export const EUR_RATE = 0.92

export const formatUSD = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

export const formatNumberEUR = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })

export const formatEUR = (n) => formatNumberEUR(Number(n) * EUR_RATE)

export const productEUR = (product, usd) => {
  const eur = Number(product && product.priceEur)
  if (eur > 0) {
    const baseUsd = Number(product && product.price) || 0
    if (baseUsd > 0) {
      return Math.round((Number(usd) / baseUsd) * eur * 100) / 100
    }
    return eur
  }
  return Number(usd) * EUR_RATE
}

export const formatBoth = (n) => `${formatUSD(n)} / ${formatEUR(n)}`

const LADDERS = [
  { key: 'twin tip board', sizes: ['132cm', '135cm', '138cm', '141cm', '144cm'], step: 0.04 },
  { key: 'control bar', sizes: ['45cm', '50cm', '55cm'], step: 0.04 },
  { key: 'foil wing', sizes: ['1250/250', '1500/250', '1700/250'], step: 0.05 },
  { key: 'foil set', sizes: ['75cm', '90cm', '100cm'], step: 0.06 },
  { key: 'kite', sizes: ['6m', '8m', '10m', '12m', '14m'], step: 0.06 },
  { key: 'wing', sizes: ['3.5m', '4.0m', '4.5m', '5.0m', '5.5m'], step: 0.05 },
  { key: 'sail', sizes: ['4.2m', '4.7m', '5.2m', '5.7m', '6.2m'], step: 0.05 },
  { key: 'board', sizes: ['132cm', '135cm', '138cm', '141cm', '144cm'], step: 0.04 },
]

const normalize = (s) => String(s).toLowerCase().replace(/[\s./-]/g, '')

export function sizeOptions(type) {
  const ladder = LADDERS.find((l) => String(type || '').toLowerCase().includes(l.key))
  return ladder ? ladder.sizes : []
}

export function defaultSize(type) {
  const sizes = sizeOptions(type)
  return sizes.length ? sizes[Math.floor(sizes.length / 2)] : ''
}

export function isValidSize(type, size) {
  if (!size) return false
  return sizeOptions(type).some((s) => normalize(s) === normalize(size))
}

export function getVariants(product) {
  if (Array.isArray(product.variants) && product.variants.length) {
    return product.variants.map((v) => ({ size: v.size, price: Number(v.price) || 0 }))
  }

  const type = String(product.type || '').toLowerCase()
  const ladder = LADDERS.find((l) => type.includes(l.key))

  if (!ladder) {
    return [{ size: product.size || 'One Size', price: product.price }]
  }

  let sizes = ladder.sizes
  const base = Number(product.price) || 0
  let anchor = sizes.findIndex((s) => normalize(s) === normalize(product.size || ''))

  if (anchor === -1) {
    if (product.size) {
      const insertAt = Math.floor(sizes.length / 2)
      sizes = [...sizes.slice(0, insertAt), product.size, ...sizes.slice(insertAt)]
      anchor = insertAt
    } else {
      anchor = Math.floor(sizes.length / 2)
    }
  }

  return sizes.map((size, i) => ({
    size,
    price: Math.max(1, Math.round(base * (1 + (i - anchor) * ladder.step))),
  }))
}

export function variantPrice(product, size) {
  const v = getVariants(product).find((x) => normalize(x.size) === normalize(size))
  return v ? v.price : Number(product.price) || 0
}
