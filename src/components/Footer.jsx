import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/store'
import { useSettings } from '../context/SettingsContext.jsx'

export default function Footer() {
  const { settings } = useSettings()

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
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
          {settings.facebook && (
            <a href={settings.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          )}
          {settings.locations?.map((loc) => (
            <span key={loc}>{loc}</span>
          ))}
        </div>
      </div>
      <p className="footer-bottom">
        &copy; {new Date().getFullYear()} {settings.name || 'Kite and Wind Supply'}. All rights reserved.
      </p>
    </footer>
  )
}
