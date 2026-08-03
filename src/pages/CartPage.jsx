import { Link } from 'react-router-dom'
import { formatPrice } from '../data/store'
import { productImage } from '../utils/placeholder.js'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const { detail, total, updateQty, removeItem } = useCart()

  if (!detail.length) {
    return (
      <div className="page">
        <div className="empty-state-block">
          <h1>Your cart is empty</h1>
          <p>Add some gear to get started.</p>
          <Link to="/" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your cart</h1>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {detail.map(({ product, qty }) => (
            <div className="cart-item" key={product.id}>
              <Link to={`/product/${product.id}`} className="cart-item-media">
                <img src={productImage(product)} alt={product.name} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <span className="product-brand">{product.brand}</span>
                <span className="product-type">{product.size}</span>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQty(product.id, qty - 1)}>&minus;</button>
                <span>{qty}</span>
                <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
              </div>
              <div className="cart-item-price">{formatPrice(product.price * qty)}</div>
              <button className="cart-remove" onClick={() => removeItem(product.id)}>
                &times;
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated after contact</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to checkout
          </Link>
          <Link to="/" className="text-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
