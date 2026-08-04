import { Link } from 'react-router-dom'
import { ABOUT_STORY, CATEGORY_STORIES } from '../data/about.js'
import { CATEGORIES, STORE_INFO } from '../data/store.js'
import { paymentLogo } from '../utils/placeholder.js'

export default function AboutPage() {
  return (
    <div className="page">
      <div className="page-head">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <span>About us</span>
        </nav>
        <h1>Our story</h1>
        <p>{ABOUT_STORY.intro}</p>
      </div>

      <section className="section">
        <div className="promise">
          <h2 dangerouslySetInnerHTML={{ __html: ABOUT_STORY.claim }} />
          <p>{ABOUT_STORY.tagline}</p>
        </div>
        <div className="about-grid">
          <div className="about-media">
            <img src="/images/products/edge-2026.jpg" alt="Riding on the water" />
          </div>
          <div className="about-text">
            {ABOUT_STORY.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            <Link to="/shop/kiteboarding" className="btn btn-primary">
              Shop the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <h2 className="section-title section-title--center">What we stand for</h2>
        <div className="values-grid">
          {ABOUT_STORY.values.map((v) => (
            <div className="value-card" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title section-title--center">Where we ship from</h2>
        <p className="section-sub section-sub--center">
          Two warehouses, one team. We dispatch from the location closest to you.
        </p>
        <div className="location-grid">
          {ABOUT_STORY.locations.map((loc) => (
            <div className="location-card" key={loc.name}>
              <div className="location-card__media">
                <img src={loc.image} alt={loc.name} loading="lazy" />
              </div>
              <h3>{loc.name}</h3>
              <p>{loc.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title section-title--center">Our sports</h2>
        <div className="about-sports">
          {CATEGORIES.map((cat) => {
            const story = CATEGORY_STORIES[cat.id]
            return (
              <Link to={`/shop/${cat.id}`} className="about-sport" key={cat.id}>
                <div
                  className="about-sport__media"
                  style={{ backgroundImage: `url(${story.image})` }}
                />
                <div className="about-sport__body">
                  <h3 dangerouslySetInnerHTML={{ __html: story.headline }} />
                  <p dangerouslySetInnerHTML={{ __html: story.text }} />
                  <span className="text-link">Shop {cat.name} &rarr;</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section section--ink">
        <div className="newsletter">
          <h2>Pay your way</h2>
          <p>
            We ship from California, USA and Vilnius, Lithuania and accept every payment method
            below — in both US dollars and euros.
          </p>
          <div className="payment-strip" style={{ marginTop: 20 }}>
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
