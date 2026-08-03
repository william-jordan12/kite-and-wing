import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import { productImage } from '../utils/placeholder.js'
import { useCart } from '../context/CartContext.jsx'
import { formatUSD, formatEUR, getVariants, variantPrice } from '../utils/pricing.js'
import ProductGrid from '../components/ProductGrid.jsx'

export default function ProductPage() {
  const { productId } = useParams()
  const { getProduct, byCategory } = useProducts()
  const product = getProduct(productId)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

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
  const [size, setSize] = useState(
    () => variants.find((v) => v.size === product.size)?.size || variants[0].size
  )
  const price = variantPrice(product, size)
  const related = byCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addItem(product.id, qty, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-media">
          <img src={productImage(product)} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <span className="product-type">
            {product.type} &middot; {size}
          </span>
          <p className="product-detail-price">{formatUSD(price)}</p>
          <p className="product-detail-price-eur">{formatEUR(price)}</p>
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
            <li>Ships from California, USA or Vilnius, Lithuania — whichever is closer to you</li>
            <li>Prices shown in USD and EUR</li>
            <li>Pay by Revolut, Cards, Google Pay, PayPal, Venmo and more</li>
            <li>14-day returns on unused gear</li>
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
