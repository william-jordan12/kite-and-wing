import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProduct } from '../data/store'

const CartContext = createContext(null)

const KEY = 'kws_cart_v1'

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

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const addItem = (productId, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId)
      if (found) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { productId, qty }]
    })
  }

  const updateQty = (productId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    )
  }

  const removeItem = (productId) => setItems((prev) => prev.filter((i) => i.productId !== productId))

  const clear = () => setItems([])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])

  const total = useMemo(
    () => items.reduce((s, i) => s + i.qty * (getProduct(i.productId)?.price || 0), 0),
    [items]
  )

  const detail = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        product: getProduct(i.productId),
      })),
    [items]
  )

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
