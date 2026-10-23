import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import QuantityStepper from '../components/QuantityStepper'
import {
  clearCart,
  decrease,
  increase,
  removeFromCart,
  selectTotalItems,
  selectTotalPrice,
} from '../features/cart/cartSlice'

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((state) => state.cart.items)
  const totalItems = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = subtotal >= 100 ? 0 : 5
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="page">
        <h1>
          Your cart <span className="muted">(0 items)</span>
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
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path d="M3 3h2l2.4 12.4a1 1 0 0 0 1 .6h8.9a1 1 0 0 0 1-.8L20 8H6" />
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p className="muted">
            Looks like you haven't added anything yet. Browse the products and
            add your favourites.
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
          Your cart <span className="muted">({totalItems} items)</span>
        </h1>
        <Link to="/" className="continue">
          ‹ Continue shopping
        </Link>
      </div>

      <div className="cart-layout">
        <section className="cart-list card-panel">
          <div className="cart-list-head">
            <span>Product</span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => dispatch(clearCart())}
            >
              Clear cart
            </button>
          </div>

          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <div className="cart-thumb">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-info">
                <p className="cart-title">{item.title}</p>
                <p className="card-category">{item.category}</p>
                <p className="muted">${item.price.toFixed(2)} each</p>
              </div>
              <QuantityStepper
                qty={item.qty}
                onDecrease={() => dispatch(decrease(item.id))}
                onIncrease={() => dispatch(increase(item.id))}
              />
              <span className="cart-line-total">
                ${(item.price * item.qty).toFixed(2)}
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Remove item"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13h8l1-13" />
                </svg>
              </button>
            </div>
          ))}
        </section>

        <aside className="card-panel summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Items</dt>
              <dd>{totalItems}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd className={shipping === 0 ? 'free' : ''}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to checkout
          </button>
          <p className="muted summary-note">
            Cart is saved with redux-persist. Refresh and it stays.
          </p>
        </aside>
      </div>
    </main>
  )
}

export default CartPage
