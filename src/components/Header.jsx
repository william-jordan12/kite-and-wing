import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/store'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  const close = () => setOpen(false)

  return (
    <header className="header">
      <div className="topbar">
        <span>
          Shipping from {`California, USA`} &amp; {`Vilnius, Lithuania`}
        </span>
        <a href="mailto:kiteandwindsupply@gmail.com">kiteandwindsupply@gmail.com</a>
      </div>

      <div className="header-main">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-kite">Kite &amp; Wind</span>
          <span className="logo-sub">SUPPLY</span>
        </Link>

        <button
          className={`burger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${open ? 'is-open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={close}>
            Home
          </Link>
          {CATEGORIES.map((cat) => (
            <div className="nav-item" key={cat.id}>
              <NavLink
                to={`/shop/${cat.id}`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={close}
              >
                {cat.name}
              </NavLink>
              <div className="dropdown">
                <p className="dropdown-title">Shop by brand</p>
                <div className="dropdown-links">
                  {cat.brands.map((brand) => (
                    <Link
                      key={brand}
                      to={`/shop/${cat.id}?brand=${encodeURIComponent(brand)}`}
                      onClick={close}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link to="/reviews" className="nav-link" onClick={close}>
            Reviews
          </Link>
          <Link to="/faq" className="nav-link" onClick={close}>
            FAQ
          </Link>
        </nav>

        <Link to="/cart" className="cart-link" aria-label="Cart" onClick={close}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.6L5 3H2" />
            <circle cx="9" cy="21" r="1.4" />
            <circle cx="18" cy="21" r="1.4" />
          </svg>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </div>
    </header>
  )
}
