import { useState } from 'react'
import { Link } from 'react-router'

function OrdersPage() {
  const [orders] = useState(() =>
    (JSON.parse(localStorage.getItem('shopkart:orders') ?? '[]')).reverse(),
  )

  if (orders.length === 0) {
    return (
      <main className="page">
        <h1>
          My orders <span className="muted">(0)</span>
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
              <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
              <path d="m3 8 9 5 9-5" />
              <path d="M12 13v8" />
            </svg>
          </div>
          <h2>No orders yet</h2>
          <p className="muted">
            You haven't placed any orders. Browse the products and treat
            yourself to something nice.
          </p>
          <Link to="/" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>
          My orders <span className="muted">({orders.length})</span>
        </h1>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="card-panel order-card">
            <header className="order-head">
              <div>
                <strong>{order.id}</strong>
                <p className="muted">
                  {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>
              <span className="order-status">Placed</span>
            </header>

            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <div className="cart-thumb">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-info">
                    <p className="cart-title">{item.title}</p>
                    <p className="muted">
                      ${item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <span className="cart-line-total">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <footer className="order-foot">
              <span className="muted">
                Ship to: {order.customer.fullName}, {order.customer.city}{' '}
                {order.customer.zip}
              </span>
              <strong>
                Total: ${order.total.toFixed(2)}
                {order.shipping === 0 && (
                  <span className="free"> · FREE shipping</span>
                )}
              </strong>
            </footer>
          </article>
        ))}
      </div>
    </main>
  )
}

export default OrdersPage
