import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, formatPrice, getProductsByCategory } from '../data/store'
import { productImage } from '../utils/placeholder.js'
import { useCart } from '../context/CartContext.jsx'
import ProductGrid from '../components/ProductGrid.jsx'

export default function ProductPage() {
  const { productId } = useParams()
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

  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addItem(product.id, qty)
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
          <span className="product-type">{product.type} &middot; {product.size}</span>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-description">{product.description}</p>

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
            <li>Ships from California, USA or Vilnius, Lithuania</li>
            <li>Pay by Cash App, PayPal, Venmo, Zelle, Bitcoin and more</li>
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
