import ProductCard from './ProductCard.jsx'

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <p className="empty-state">No products match this filter.</p>
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
