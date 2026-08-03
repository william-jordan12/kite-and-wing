import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/store'
import { useSettings } from '../context/SettingsContext.jsx'
import { paymentLogo } from '../utils/placeholder.js'

export default function Footer() {
  const { settings } = useSettings()
  const methods = settings.paymentMethods || []

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="logo-kite">Kite &amp; Wind</span>
            <span className="logo-sub">SUPPLY</span>
            <p className="footer__claim">
              True kiteboarding. True windsurfing. True wing &amp; foiling.
            </p>
          </div>

          <div className="footer__columns">
            <div className="footer__col">
              <h4>Shop</h4>
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} to={`/shop/${cat.id}`}>
                  {cat.name}
                </Link>
              ))}
              <Link to="/shop/kiteboarding">All products</Link>
            </div>

            <div className="footer__col">
              <h4>Help</h4>
              <Link to="/reviews">Reviews</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/checkout">Checkout</Link>
            </div>

            <div className="footer__col">
              <h4>Contact</h4>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
              {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a>}
              {settings.locations?.map((loc) => (
                <span key={loc}>{loc}</span>
              ))}
            </div>

            <div className="footer__col">
              <h4>Payment</h4>
              {methods.slice(0, 6).map((method) => (
                <span key={method}>{method}</span>
              ))}
              <span>{methods.length} payment methods accepted</span>
            </div>
          </div>

          <div className="footer__payments">
            <span className="payment-strip__label">We accept</span>
            <div className="payment-strip">
              {methods.map((method) => {
                const logo = paymentLogo(method)
                if (!logo) return null
                return <img key={method} src={logo} alt={`${method} logo`} loading="lazy" />
              })}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          &copy; {new Date().getFullYear()} {settings.name || 'Kite and Wind Supply'}. All rights reserved.
          {' · '}
          <Link to="/faq">Shipping &amp; Returns</Link>
          {' · '}
          <Link to="/reviews">Reviews</Link>
        </div>
      </div>
    </footer>
  )
}
