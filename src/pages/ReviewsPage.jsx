import { REVIEWS } from '../data/content.js'

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'star on' : 'star'}>
          &#9733;
        </span>
      ))}
    </span>
  )
}

export default function ReviewsPage() {
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)

  return (
    <div className="page">
      <div className="page-head">
        <h1>Customer reviews</h1>
        <p>
          Real feedback from riders in California, USA and Vilnius, Lithuania.
        </p>
      </div>

      <div className="reviews-summary">
        <span className="reviews-score">{avg}</span>
        <Stars rating={Math.round(Number(avg))} />
        <span className="reviews-count">based on {REVIEWS.length} reviews</span>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((r) => (
          <article className="review-card" key={r.id}>
            <Stars rating={r.rating} />
            <p className="review-text">&ldquo;{r.text}&rdquo;</p>
            <div className="review-meta">
              <strong>{r.author}</strong>
              <span>{r.location}</span>
              <span>Verified purchase &middot; {r.product}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
