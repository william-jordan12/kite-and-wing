import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const SLIDES = [
  {
    id: 'hero',
    eyebrow: 'Kiteboarding &middot; Wing &amp; Foiling &middot; Windsurfing',
    title: 'Ride the wind with the best gear on the water.',
    text: 'Premium equipment from the world&apos;s leading brands. Hand-picked, shipped fast from California, USA and Vilnius, Lithuania.',
    cta: { to: '/shop/kiteboarding', label: 'Shop the collection' },
    cta2: { to: '/faq', label: 'How to order' },
    bg: '/images/products/rebel-2026.png',
  },
  {
    id: 'kiteboarding',
    category: 'kiteboarding',
    eyebrow: 'Kiteboarding',
    title: 'Kites, bars & boards for every rider.',
    text: 'The latest kites and twin-tips from the world&apos;s best brands, tuned for performance and fun.',
    cta: { to: '/shop/kiteboarding', label: 'Shop kiteboarding' },
    bg: '/images/products/switchblade.png',
  },
  {
    id: 'wing-foiling',
    category: 'wing-foiling',
    eyebrow: 'Wing & Foiling',
    title: 'Lift off with wings and foils.',
    text: 'Complete wing and foil setups ready to fly in light wind or full power.',
    cta: { to: '/shop/wing-foiling', label: 'Shop wing & foiling' },
    bg: '/images/products/unit-wing.png',
  },
  {
    id: 'windsurfing',
    category: 'windsurfing',
    eyebrow: 'Windsurfing',
    title: 'Sails and boards built for speed.',
    text: 'From wave sailing to racing, find the gear that matches the way you ride.',
    cta: { to: '/shop/windsurfing', label: 'Shop windsurfing' },
    bg: '/images/products/super-hero.png',
  },
  {
    id: 'cta',
    eyebrow: 'Ready to ride?',
    title: 'Fast checkout, easy payment, shipped worldwide.',
    text: 'Choose your gear, complete a quick checkout, and we&apos;ll send payment details over WhatsApp or email.',
    cta: { to: '/cart', label: 'View cart' },
    bg: '/images/products/orbit-2026.png',
  },
]

export default function Home() {
  const { byCategory } = useProducts()
  const [active, setActive] = useState(0)
  const slideRefs = useRef([])

  useEffect(() => {
    document.documentElement.classList.add('home-snap')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index))
          }
        })
      },
      { root: null, threshold: 0.6 }
    )
    slideRefs.current.forEach((el) => el && observer.observe(el))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('home-snap')
    }
  }, [])

  const goTo = (i) => {
    const el = slideRefs.current[i]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      {SLIDES.map((slide, i) => {
        const featured = slide.category ? byCategory(slide.category).slice(0, 3) : []
        return (
          <section
            key={slide.id}
            className={`home-slide ${i === active ? 'is-active' : ''}`}
            ref={(el) => (slideRefs.current[i] = el)}
            data-index={i}
          >
            <div className="home-slide-bg" style={{ backgroundImage: `url(${slide.bg})` }} />
            <div className="home-slide-inner">
              <span className="home-slide-eyebrow" dangerouslySetInnerHTML={{ __html: slide.eyebrow }} />
              <h1 className="home-slide-title">{slide.title}</h1>
              <p className="home-slide-text" dangerouslySetInnerHTML={{ __html: slide.text }} />
              <div className="home-slide-actions">
                <Link to={slide.cta.to} className="btn btn-primary">
                  {slide.cta.label}
                </Link>
                {slide.cta2 && (
                  <Link to={slide.cta2.to} className="btn btn-ghost">
                    {slide.cta2.label}
                  </Link>
                )}
              </div>
              {featured.length > 0 && (
                <div className="home-slide-products">
                  {featured.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}

      <button
        className="home-slide-arrow home-slide-arrow-prev"
        onClick={() => goTo(Math.max(0, active - 1))}
        disabled={active === 0}
        aria-label="Previous slide"
      >
        &uarr;
      </button>
      <button
        className="home-slide-arrow home-slide-arrow-next"
        onClick={() => goTo(Math.min(SLIDES.length - 1, active + 1))}
        disabled={active === SLIDES.length - 1}
        aria-label="Next slide"
      >
        &darr;
      </button>

      <div className="home-slide-dots" role="tablist" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className={`home-slide-dot ${i === active ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === active}
            role="tab"
          />
        ))}
      </div>
    </div>
  )
}
