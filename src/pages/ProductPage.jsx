import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { productImage } from '../utils/placeholder.js'
import { useCart } from '../context/CartContext.jsx'
import { getProductFull } from '../api.js'
import { formatUSD, formatNumberEUR, productEUR, getVariants, variantPrice } from '../utils/pricing.js'
import ProductGrid from '../components/ProductGrid.jsx'

export default function ProductPage() {
  const { productId } = useParams()
  const { getProduct, byCategory } = useProducts()
  const light = getProduct(productId)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [full, setFull] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const lightVariants = light ? getVariants(light) : []
  const [size, setSize] = useState(
    () =>
      lightVariants.find((v) => v.size === (light && light.size))?.size || lightVariants[0]?.size || ''
  )

  useEffect(() => {
    setFull(null)
    setLoaded(false)
    setImgIdx(0)
    let active = true
    getProductFull(productId)
      .then((data) => {
        if (!active) return
        setFull(data)
        setLoaded(true)
      })
      .catch(() => {
        if (active) setLoaded(true)
      })
    return () => {
      active = false
    }
  }, [productId])

  const product = full || light

  if (!product) {
    return (
      <div className="page">
        <h1>Product not found</h1>
        <Link to="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    )
  }

  const variants = getVariants(product)
  const price = variantPrice(product, size)
  const related = byCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)
  const images = Array.isArray(product.images) && product.images.length ? product.images : [productImage(product)]

  const handleAdd = () => {
    addItem(product.id, qty, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-media">
          <div className="product-detail-media__main">
            {!full && !loaded ? (
              <span className="product-image-loading">Loading photo…</span>
            ) : (
              <img src={images[Math.min(imgIdx, images.length - 1)]} alt={product.name} />
            )}
          </div>
          {images.length > 1 && (
            <div className="product-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`product-thumb ${i === imgIdx ? 'active' : ''}`}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-info">
          <span className="product-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <span className="product-type">
            {product.type} &middot; {size}
          </span>
          <p className="product-detail-price">{formatUSD(price)}</p>
          <p className="product-detail-price-eur">{formatNumberEUR(productEUR(product, price))}</p>
          <p className="product-description">{product.description}</p>

          {variants.length > 1 && (
            <div className="size-row">
              <span>Size</span>
              <div className="size-options">
                {variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    className={`size-option ${v.size === size ? 'active' : ''}`}
                    onClick={() => setSize(v.size)}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="qty-row">
            <span>Quantity</span>
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>&minus;</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleAdd}>
            {added ? 'Added to cart ✓' : 'Add to cart'}
          </button>

          <ul className="product-perks">
            <li>✓ Worldwide Shipping — Ships from our locations in USA and Lithuania.</li>
            <li>✓ Secure Payment Options — Pay safely with trusted payment methods.</li>
            <li>✓ Premium Watersports Gear — Quality equipment from leading brands.</li>
            <li>✓ 30-Day Returns — Easy returns on eligible unused gear within 30 days.</li>
            <li>✓ Trusted Customer Service — Professional support before and after your purchase.</li>
          </ul>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">Related products</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  )
}
