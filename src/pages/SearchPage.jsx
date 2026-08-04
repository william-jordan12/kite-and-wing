import { useSearchParams, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductGrid from '../components/ProductGrid.jsx'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const { products } = useProducts()

  const term = q.toLowerCase()
  const results = q
    ? products.filter((p) =>
        [p.name, p.brand, p.type, p.category, p.size]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term))
      )
    : []

  return (
    <div className="page">
      <div className="page-head">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <span>Search</span>
        </nav>
        <h1>{q ? `Results for "${q}"` : 'Search'}</h1>
        <p>{q ? `${results.length} product${results.length === 1 ? '' : 's'} found` : 'Search for a product, brand or size.'}</p>
      </div>

      {!q ? (
        <p className="empty-state">Type something in the search bar to find gear.</p>
      ) : results.length ? (
        <ProductGrid products={results} />
      ) : (
        <p className="empty-state">No products matched &quot;{q}&quot;. Try another name, brand or size.</p>
      )}
    </div>
  )
}
