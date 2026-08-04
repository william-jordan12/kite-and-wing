import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { CATEGORIES } from '../data/store'
import { useCart } from '../context/CartContext.jsx'
import SearchBar from './SearchBar.jsx'

const TOOLBAR_BRANDS = ['Duotone', 'North', 'Cabrinha', 'Slingshot', 'Reedin', 'F-One', 'Airush', 'Eleveight']

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <div className="toolbar">
        <div className="container toolbar__inner">
          <div className="toolbar__brands">
            {TOOLBAR_BRANDS.map((brand) => (
              <Link
                key={brand}
                to={`/shop/kiteboarding?brand=${encodeURIComponent(brand)}`}
                className="toolbar__brand"
                title={brand}
              >
                {brand}
              </Link>
            ))}
          </div>
          <div className="toolbar__note">
            <strong>Free</strong> worldwide shipping on orders over $99
          </div>
        </div>
      </div>

      <div className="navbar">
        <div className="container navbar__content">
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="main-nav" className={`main-nav ${open ? 'is-open' : ''}`}>
            <SearchBar onSearch={close} />
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={close}
            >
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
            <Link to="/about" className="nav-link" onClick={close}>
              About
            </Link>
          </nav>

          <Link to="/" className="logo" onClick={close} aria-label="Kite and Wing Supply home">
            <img src="/logo.jpg" alt="Kite and Wing Supply" className="logo-mark" />
          </Link>

          <div className="navbar__actions">
            <SearchBar onSearch={close} />
            <Link to="/cart" className="cart-link" aria-label="Cart" onClick={close}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.6L5 3H2" />
                <circle cx="9" cy="21" r="1.4" />
                <circle cx="18" cy="21" r="1.4" />
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </div>

      <div className={`nav-backdrop ${open ? 'visible' : ''}`} onClick={close} aria-hidden="true" />
    </>
  )
}
