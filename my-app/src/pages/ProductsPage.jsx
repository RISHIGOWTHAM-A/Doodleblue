import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import SortSelect from '../components/SortSelect'
import { fetchProducts, setCategory } from '../features/products/productsSlice'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
]

function ProductsPage() {
  const dispatch = useDispatch()
  const { items, status, error, search, category } = useSelector(
    (state) => state.products,
  )
  const [sort, setSort] = useState('featured')

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const categories = useMemo(
    () => ['all', ...new Set(items.map((p) => p.category))],
    [items],
  )

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = items.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        p.title.toLowerCase().includes(term),
    )
    if (sort === 'low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'high') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [items, category, sort, search])

  return (
    <main className="page">
      <div className="page-head">
        <div>
          <h1>All products</h1>
          <p className="muted">Showing {visible.length} products</p>
        </div>
        <div className="sort">
          Sort by
          <SortSelect options={SORTS} value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? 'chip active' : 'chip'}
            onClick={() => dispatch(setCategory(c))}
          >
            {c === 'all' ? 'All' : c.replace(/(^|\s)\w/g, (m) => m.toUpperCase())}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <>
          <p className="state-text">Loading products...</p>
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card skeleton-card">
                <div className="skeleton skeleton-img" />
                <div className="card-body">
                  <div className="skeleton skeleton-line w-40" />
                  <div className="skeleton skeleton-line w-90" />
                  <div className="skeleton skeleton-line w-60" />
                  <div className="skeleton skeleton-line w-70" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {status === 'failed' && (
        <div className="state-msg">
          <p>Could not load products: {error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch(fetchProducts())}
          >
            Try again
          </button>
        </div>
      )}

      {status === 'succeeded' && visible.length === 0 && (
        <p className="state-msg">No products match your filters.</p>
      )}

      <div className="grid">
        {status === 'succeeded' &&
          visible.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
            />
          ))}
      </div>
    </main>
  )
}

export default ProductsPage
