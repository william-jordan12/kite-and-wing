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
            <img src="/logo.jpg" alt="Kite and Wing Supply logo" className="footer__logo" />
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
              <Link to="/about">About us</Link>
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
              <span>Prices in USD and EUR</span>
            </div>

            <div className="footer__col">
              <h4>Follow us</h4>
              <a
                href={settings.facebook || 'https://www.facebook.com/kiteandwindsupply'}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
              >
                <FacebookIcon />
                Facebook
              </a>
              <a
                href={settings.instagram || 'https://www.instagram.com/kiteandwindsupply'}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
              >
                <InstagramIcon />
                Instagram
              </a>
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
          &copy; {new Date().getFullYear()} {settings.name || 'Kite and Wing Supply'}. All rights reserved.
          {' · '}
          <Link to="/faq">Shipping &amp; Returns</Link>
          {' · '}
          <Link to="/reviews">Reviews</Link>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
