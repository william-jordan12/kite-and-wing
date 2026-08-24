import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getProducts } from '../api'
import { PRODUCTS as SEED } from '../data/store'
import CATALOG_BACKUP from '../data/catalog-backup.json'

const seen = new Set()
export const FALLBACK = [...SEED, ...CATALOG_BACKUP].filter((p) => {
  if (!p || !p.id || seen.has(p.id)) return false
  seen.add(p.id)
  return true
})

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('seed')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    let active = true
    getProducts()
      .then((data) => {
        if (!active) return
        if (Array.isArray(data)) {
          setProducts(data)
          setSource('database')
        } else {
          setSource('seed')
        }
      })
      .catch(() => {
        if (active) setSource('seed')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      products,
      loading,
      source,
      reload: async () => {
        try {
          const data = await getProducts()
          if (Array.isArray(data)) {
            setProducts(data)
            setSource('database')
          } else {
            setProducts(FALLBACK)
            setSource('seed')
          }
        } catch {
          setProducts(FALLBACK)
          setSource('seed')
        }
      },
      getProduct: (id) => products.find((p) => p.id === id),
      byCategory: (categoryId) => products.filter((p) => p.category === categoryId),
      byBrand: (categoryId, brand) =>
        products.filter(
          (p) =>
            p.category === categoryId &&
            String(p.brand).trim().toLowerCase() === String(brand).trim().toLowerCase()
        ),
    }),
    [products, loading, source]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  return useContext(ProductsContext)
}
