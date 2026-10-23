import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import ProductCard from '../components/ProductCard'

function WishlistPage() {
  const items = useSelector((state) => state.wishlist.items)

  if (items.length === 0) {
    return (
      <main className="page">
        <h1>
          Wishlist <span className="muted">(0 items)</span>
        </h1>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 21s-7.5-4.7-9.8-9C.7 9.2 1.6 5.6 4.7 4.5c2-.7 4.2-.1 5.4 1.5.5.7 1.4.7 1.9 0 1.2-1.6 3.4-2.2 5.4-1.5 3.1 1.1 4 4.7 2.5 7.5-2.3 4.3-7.9 9-7.9 9Z" />
            </svg>
          </div>
          <h2>Your wishlist is empty</h2>
          <p className="muted">
            Tap the heart on any product to save it here for later.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>
          Wishlist <span className="muted">({items.length} items)</span>
        </h1>
      </div>
      <div className="grid">
        {items.map((product, i) => (
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

export default WishlistPage
