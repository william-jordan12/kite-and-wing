export const EUR_RATE = 0.92

export const formatUSD = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

export const formatNumberEUR = (n) =>
  Number(n).toLocaleString('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })

export const formatEUR = (n) => formatNumberEUR(Number(n) * EUR_RATE)

const num = (n) => {
  if (n == null || n === '') return null
  const v = Number(n)
  return Number.isFinite(v) ? v : null
}

export function getVariants(product) {
  if (Array.isArray(product && product.variants) && product.variants.length) {
    return product.variants.map((v) => ({
      size: String(v.size || '').trim() || 'One Size',
      price: num(v.price) || 0,
      priceEur: num(v.priceEur),
    }))
  }
  return [
    {
      size: product && product.size ? String(product.size).trim() : 'One Size',
      price: num(product && product.price) || 0,
      priceEur: num(product && product.priceEur),
    },
  ]
}

const normalize = (s) => String(s || '').toLowerCase().replace(/[\s./-]/g, '')

export function variantPrice(product, size) {
  const v = getVariants(product).find((x) => normalize(x.size) === normalize(size))
  return v ? v.price : num(product && product.price) || 0
}

export function variantEUR(product, size) {
  const v = getVariants(product).find((x) => normalize(x.size) === normalize(size))
  const eur = num(v && v.priceEur)
  if (eur > 0) return eur
  const usd = v ? v.price : num(product && product.price)
  return Math.round(Number(usd || 0) * EUR_RATE * 100) / 100
}

export const productEUR = (product, usd, size) => {
  if (size) {
    const v = getVariants(product).find((x) => normalize(x.size) === normalize(size))
    const vEur = num(v && v.priceEur)
    const vUsd = num(v && v.price) || num(product && product.price)
    if (vEur > 0 && vUsd > 0) {
      return Math.round((Number(usd) / vUsd) * vEur * 100) / 100
    }
  }
  const eur = num(product && product.priceEur)
  const baseUsd = num(product && product.price) || 0
  if (eur > 0 && baseUsd > 0) {
    return Math.round((Number(usd) / baseUsd) * eur * 100) / 100
  }
  return Number(usd) * EUR_RATE
}

export const formatBoth = (n) => `${formatUSD(n)} / ${formatEUR(n)}`
