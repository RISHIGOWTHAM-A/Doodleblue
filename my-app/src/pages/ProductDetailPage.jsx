import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router'
import ProductCard from '../components/ProductCard'
import QuantityStepper from '../components/QuantityStepper'
import Stars from '../components/Stars'
import WishlistButton from '../components/WishlistButton'
import { addToCart } from '../features/cart/cartSlice'
import { addToast } from '../features/ui/uiSlice'
import {
  fetchProductById,
  fetchProducts,
} from '../features/products/productsSlice'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, status, detail, detailStatus, detailError } = useSelector(
    (state) => state.products,
  )
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const product =
    items.find((p) => p.id === Number(id)) ??
    (detail?.id === Number(id) ? detail : null)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
    if (!product) dispatch(fetchProductById(id))
  }, [id, product, status, dispatch])

  const [prevId, setPrevId] = useState(id)
  if (prevId !== id) {
    setPrevId(id)
    setQty(1)
    setActiveImg(0)
  }

  if (!product) {
    if (detailStatus === 'failed') {
      return (
        <main className="page">
          <div className="state-msg">
            <p>Could not load product: {detailError}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(fetchProductById(id))}
            >
              Try again
            </button>
          </div>
        </main>
      )
    }
    return (
      <main className="page">
        <p className="state-msg">Loading products...</p>
      </main>
    )
  }

  const related = items
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <main className="page">
      <nav className="breadcrumb">
        <Link to="/">Products</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <strong>{product.title}</strong>
      </nav>

      <section className="pdp">
        <div className="pdp-gallery">
          <div className="pdp-image">
            <img
              key={activeImg}
              className="pdp-main-img"
              src={product.image}
              alt={product.title}
            />
          </div>
          <div className="pdp-thumbs">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                className={i === activeImg ? 'thumb active' : 'thumb'}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={product.image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <span className="badge-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="card-rating">
            <Stars rate={product.rating?.rate ?? 0} />
            <span className="rating-value">{product.rating?.rate}</span>
            <span className="rating-count">
              ({product.rating?.count ?? 0} reviews)
            </span>
          </p>
          <p className="pdp-price">${product.price.toFixed(2)}</p>
          <p className="pdp-desc">{product.description}</p>

          <hr />

          <div className="pdp-qty">
            <span className="muted">Quantity</span>
            <QuantityStepper
              qty={qty}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
              onIncrease={() => setQty((q) => q + 1)}
            />
            <WishlistButton product={product} />
          </div>

          <div className="pdp-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => {
                dispatch(addToCart({ product, qty }))
                dispatch(addToast(`Added ${qty} item${qty > 1 ? 's' : ''} to cart`))
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path d="M3 3h2l2.4 12.4a1 1 0 0 0 1 .6h8.9a1 1 0 0 0 1-.8L20 8H6" />
              </svg>
              Add to cart
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/cart')}
            >
              Go to cart
            </button>
          </div>

          <ul className="pdp-perks">
            <li>Free shipping on orders of $100 or more</li>
            <li>30-day easy returns</li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related">
          <h2>You may also like</h2>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductDetailPage
