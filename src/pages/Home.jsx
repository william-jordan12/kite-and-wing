import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/store'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductGrid from '../components/ProductGrid.jsx'

export default function Home() {
  const { byCategory } = useProducts()
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">Kiteboarding &middot; Wing &amp; Foiling &middot; Windsurfing</span>
          <h1>Ride the wind with the best gear on the water.</h1>
          <p>
            Premium equipment from the world&apos;s leading brands. Hand-picked, shipped fast from
            California, USA and Vilnius, Lithuania.
          </p>
          <div className="hero-actions">
            <a href="#categories" className="btn btn-primary">
              Shop the collection
            </a>
            <Link to="/faq" className="btn btn-ghost">
              How to order
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <h2 className="section-title">Shop by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link to={`/shop/${cat.id}`} className="category-card" key={cat.id}>
              <span className="category-name">{cat.name}</span>
              <span className="category-tagline">{cat.tagline}</span>
              <span className="category-cta">Shop now &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {CATEGORIES.map((cat) => (
        <section className="section" key={cat.id}>
          <div className="section-head">
            <h2 className="section-title">{cat.name}</h2>
            <Link to={`/shop/${cat.id}`} className="text-link">
              View all
            </Link>
          </div>
          <ProductGrid products={byCategory(cat.id).slice(0, 4)} />
        </section>
      ))}

      <section className="section cta-banner">
        <h2>Ready to ride?</h2>
        <p>
          Choose your gear, complete a quick checkout, and we&apos;ll send payment details over
          WhatsApp or email.
        </p>
        <Link to="/cart" className="btn btn-primary">
          View cart
        </Link>
      </section>
    </div>
  )
}
