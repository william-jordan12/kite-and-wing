import { Link } from 'react-router-dom'
import { formatPrice } from '../data/store'
import { productImage } from '../utils/placeholder.js'

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card__media">
        <img src={productImage(product)} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card__body">
        <span className="product-brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <span className="product-type">{product.type}</span>
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
    </Link>
  )
}
