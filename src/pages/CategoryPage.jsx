import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getCategory } from '../data/store'
import { CATEGORY_STORIES } from '../data/about.js'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductGrid from '../components/ProductGrid.jsx'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { byCategory, byBrand } = useProducts()
  const category = getCategory(categoryId)

  if (!category) {
    return (
      <div className="page">
        <h1>Category not found</h1>
        <Link to="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    )
  }

  const activeBrand = searchParams.get('brand')
  const shown = activeBrand ? byBrand(category.id, activeBrand) : byCategory(category.id)
  const story = CATEGORY_STORIES[category.id]

  const selectBrand = (brand) => {
    setSearchParams(brand ? { brand } : {})
  }

  return (
    <div className="page">
      <div className="page-head">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <span>{category.name}</span>
        </nav>
        <h1>{category.name}</h1>
        <p>{category.tagline}</p>
      </div>

      {story && (
        <div className="category-story">
          <div className="category-story__media">
            <img src={story.image} alt={category.name} />
          </div>
          <div className="category-story__body">
            <h2 dangerouslySetInnerHTML={{ __html: story.headline }} />
            <blockquote dangerouslySetInnerHTML={{ __html: story.quote }} />
            <p dangerouslySetInnerHTML={{ __html: story.text }} />
            <div className="category-story__actions">
              <Link to="/about" className="btn btn-primary btn-sm">
                Read our story
              </Link>
              <a href="#products" className="text-link">
                Shop the collection &darr;
              </a>
            </div>
          </div>
        </div>
      )}

      <div id="products">
        <div className="brand-filter">
          <button
            className={`chip ${!activeBrand ? 'chip-active' : ''}`}
            onClick={() => selectBrand(null)}
          >
            All brands
          </button>
          {category.brands.map((brand) => (
            <button
              key={brand}
              className={`chip ${activeBrand === brand ? 'chip-active' : ''}`}
              onClick={() => selectBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>

        <p className="result-count">
          {shown.length} product{shown.length === 1 ? '' : 's'}
          {activeBrand ? ` from ${activeBrand}` : ''}
        </p>

        <ProductGrid products={shown} />
      </div>
    </div>
  )
}
