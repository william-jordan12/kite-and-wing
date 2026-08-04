import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getCategory } from '../data/store'
import { CATEGORY_STORIES, CATEGORY_GUIDES } from '../data/about.js'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductGrid from '../components/ProductGrid.jsx'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { byBrand } = useProducts()
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
  const shown = activeBrand ? byBrand(category.id, activeBrand) : []
  const story = CATEGORY_STORIES[category.id]
  const guide = CATEGORY_GUIDES[category.id]

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

      {story && !guide && (
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

      {guide && (
        <section className="category-guide">
          {guide.map((block, i) => {
            if (block.type === 'kicker') {
              return (
                <span key={i} className="category-guide__kicker">
                  {block.text}
                </span>
              )
            }
            if (block.type === 'lead') {
              return (
                <p key={i} className="category-guide__lead">
                  {block.text}
                </p>
              )
            }
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="category-guide__h2">
                  {block.text}
                </h2>
              )
            }
            if (block.type === 'h3') {
              return (
                <div key={i} className="category-guide__h3-block">
                  <h3 className="category-guide__h3">{block.text}</h3>
                  {block.children && <p className="category-guide__p">{block.children}</p>}
                </div>
              )
            }
            if (block.type === 'ul') {
              return (
                <ul key={i} className="category-guide__list">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} className="category-guide__p">
                {block.text}
              </p>
            )
          })}
          <a href="#products" className="btn btn-primary">
            Shop the collection
          </a>
        </section>
      )}

      <div id="products" className="category-shop">
        <div className="brand-filter">
          <span className="brand-filter__label">Shop by brand</span>
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

        {activeBrand ? (
          <>
            <p className="result-count">
              {shown.length} product{shown.length === 1 ? '' : 's'} from {activeBrand}
            </p>
            <ProductGrid products={shown} />
          </>
        ) : (
          <div className="brand-gate">
            <h3>Choose a brand to see its products</h3>
            <p>
              Select one of the {category.brands.length} brands above to browse the {category.name}{' '}
              range we carry.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
