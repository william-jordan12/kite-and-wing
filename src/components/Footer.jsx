import { Link } from 'react-router-dom'
import { CATEGORIES, STORE_INFO } from '../data/store'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Kite &amp; Wind Supply</h4>
          <p>Premium kiteboarding, wing foiling and windsurfing gear for riders in the USA and Europe.</p>
        </div>
        <div>
          <h4>Shop</h4>
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/shop/${cat.id}`}>
              {cat.name}
            </Link>
          ))}
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/reviews">Reviews</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>
          {STORE_INFO.locations.map((loc) => (
            <span key={loc}>{loc}</span>
          ))}
        </div>
      </div>
      <p className="footer-bottom">
        &copy; {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
      </p>
    </footer>
  )
}
