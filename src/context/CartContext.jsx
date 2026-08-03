import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProducts } from './ProductsContext.jsx'
import { variantPrice } from '../utils/pricing.js'

const CartContext = createContext(null)

const KEY = 'kws_cart_v1'

const keyOf = (productId, size) => `${productId}::${size || ''}`

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load)
  const { products } = useProducts()

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const getProduct = (id) => products.find((p) => p.id === id)

  const addItem = (productId, qty = 1, size = null) => {
    const k = keyOf(productId, size)
    setItems((prev) => {
      const found = prev.find((i) => keyOf(i.productId, i.size) === k)
      if (found) {
        return prev.map((i) => (keyOf(i.productId, i.size) === k ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { productId, qty, size: size || null }]
    })
  }

  const updateQty = (productId, size, qty) => {
    const k = keyOf(productId, size)
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => keyOf(i.productId, i.size) !== k)
        : prev.map((i) => (keyOf(i.productId, i.size) === k ? { ...i, qty } : i))
    )
  }

  const removeItem = (productId, size) => {
    const k = keyOf(productId, size)
    setItems((prev) => prev.filter((i) => keyOf(i.productId, i.size) !== k))
  }

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  const detail = useMemo(
    () =>
      items
        .map((i) => {
          const product = getProduct(i.productId)
          if (!product) return null
          const size = i.size || product.size || null
          return { ...i, size, product, unitPrice: variantPrice(product, size) }
        })
        .filter(Boolean),
    [items, products]
  )

  const total = useMemo(() => detail.reduce((s, i) => s + i.qty * i.unitPrice, 0), [detail])

  return (
    <CartContext.Provider
      value={{ items, detail, count, total, addItem, updateQty, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
