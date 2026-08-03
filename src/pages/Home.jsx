import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, STORE_INFO } from '../data/store'
import { paymentLogo } from '../utils/placeholder.js'
import ProductCard from '../components/ProductCard.jsx'

const FEATURED_IDS = [
  'rebel-2026',
  'unit-wing',
  'switchblade',
  'xr7',
  'orbit-2026',
  'rally',
  'super-hero',
  'supermodel',
]

const HERO_CTA = [
  { to: '/shop/kiteboarding', label: 'Kiteboarding' },
  { to: '/shop/windsurfing', label: 'Windsurfing' },
  { to: '/shop/wing-foiling', label: 'Wing Foiling' },
]

const TILE_TEXT = {
  kiteboarding:
    'Kites, bars, twin-tips and harnesses from the world&apos;s best brands — tuned for big air, freestyle and everything in between.',
  'wing-foiling':
    'Wings, foils and complete setups ready to lift off in light wind or full power — the fastest growing way to ride.',
  windsurfing:
    'Sails, boards and rigs built for speed — from wave sailing to racing, matched to the way you ride.',
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)

  const onSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setDone(true)
  }

  return (
    <div className="home">
      <section className="hero-stage">
        <div
          className="hero-stage__bg"
          style={{ backgroundImage: 'url(/images/products/edge-2026.jpg)' }}
        />
        <div className="hero-stage__inner">
          <span className="hero-stage__topline">
            Kiteboarding &middot; Wing &amp; Foiling &middot; Windsurfing
          </span>
          <h1>
            True kiteboarding. True windsurfing. True wing &amp; foiling.
          </h1>
          <p className="hero-stage__subline">
            Premium gear from the leading brands on the water. Hand-picked, tested by riders and
            shipped fast from California and Vilnius to your door.
          </p>
          <div className="hero-stage__actions">
            {HERO_CTA.map((cta) => (
              <Link key={cta.to} to={cta.to} className="btn btn-ghost">
                Shop {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title section-title--center">The world of Kite &amp; Wind Supply</h2>
        <div className="promise">
          <p>
            Welcome to a world where water is our stage and nature is our temple. We are a small
            crew of riders, engineers and shop owners who live on the water — kites, wings and sails
            are not products to us, they are the reason we get up in the morning.
          </p>
        </div>
      </section>

      <section className="section section--gray">
        <div className="story-tiles">
          {CATEGORIES.map((cat) => {
            const image =
              cat.id === 'kiteboarding'
                ? '/images/products/super-hero.png'
                : cat.id === 'wing-foiling'
                  ? '/images/products/unit-wing.png'
                  : '/images/products/ezzy-wave.jpg'
            return (
              <Link to={`/shop/${cat.id}`} className="story-tile" key={cat.id}>
                <div className="story-tile__bg" style={{ backgroundImage: `url(${image})` }} />
                <div className="story-tile__body">
                  <span className="story-tile__tag">{cat.tagline}</span>
                  <h3>{cat.name}</h3>
                  <p dangerouslySetInnerHTML={{ __html: TILE_TEXT[cat.id] }} />
                  <span className="story-tile__link">Shop {cat.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="promise">
          <h2>Our promise</h2>
          <p>
            Every item we sell is ridden and tested by our team before it makes it to the shop. We
            only carry gear we trust with our own lives — and we stand behind every single order with
            honest advice, fast shipping and a no-drama returns policy.
          </p>
        </div>
      </section>

      <section className="section section--gray">
        <div className="section-head">
          <h2 className="section-title">New in</h2>
          <Link to="/shop/kiteboarding" className="text-link">
            View all products &rarr;
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title section-title--center">Trusted by riders worldwide</h2>
        <div className="brand-strip">
          {['Duotone', 'North', 'Cabrinha', 'Slingshot', 'Reedin', 'F-One', 'Airush', 'Eleveight', 'Ozone', 'Core'].map(
            (brand) => (
              <span key={brand} className="brand-strip__item">
                {brand}
              </span>
            )
          )}
        </div>
      </section>

      <section className="section section--ink">
        <div className="newsletter">
          <h2>Wanna stay tuned?</h2>
          <p>Sign up to our newsletter and get 10% off your first order.</p>
          {done ? (
            <p className="newsletter__done">Thanks for subscribing &mdash; see you on the water!</p>
          ) : (
            <form className="newsletter__form" onSubmit={onSubscribe}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" className="btn">
                Sign up
              </button>
            </form>
          )}
          <div className="payment-strip" style={{ marginTop: 44 }}>
            <span className="payment-strip__label">We accept</span>
            {STORE_INFO.paymentMethods.map((method) => {
              const logo = paymentLogo(method)
              if (!logo) return null
              return <img key={method} src={logo} alt={`${method} logo`} loading="lazy" />
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
