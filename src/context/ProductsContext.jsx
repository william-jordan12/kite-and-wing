import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getProducts, fetchCatalog } from '../api'
import { PRODUCTS as SEED } from '../data/store'

const seen = new Set()
export const FALLBACK = [...SEED].filter((p) => {
  if (!p || !p.id || seen.has(p.id)) return false
  seen.add(p.id)
  return true
})

const ProductsContext = createContext(null)

async function loadWithFallback() {
  try {
    const data = await getProducts()
    if (Array.isArray(data)) return { data, source: 'database' }
  } catch {
    // database unavailable — try the published catalog file
  }
  try {
    const data = await fetchCatalog()
    if (Array.isArray(data) && data.length) return { data, source: 'catalog' }
  } catch {
    // catalog file unavailable — use the bundled seed
  }
  return { data: FALLBACK, source: 'seed' }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('seed')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    let active = true
    loadWithFallback().then((result) => {
      if (!active) return
      setProducts(result.data)
      setSource(result.source)
      setLoading(false)
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
        const result = await loadWithFallback()
        setProducts(result.data)
        setSource(result.source)
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
