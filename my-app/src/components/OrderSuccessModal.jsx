import { Link } from 'react-router'

function OrderSuccessModal({ order }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-check">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="28" />
            <path d="M20 33.5 28.5 42 45 24" />
          </svg>
        </div>
        <h2>Order placed!</h2>
        <p className="muted">
          Thanks, {order.customer.fullName.split(' ')[0]}. Your order{' '}
          <strong>{order.id}</strong> · {order.totalItems} item
          {order.totalItems > 1 ? 's' : ''} · ${order.total.toFixed(2)} is on
          its way to {order.customer.city}.
        </p>
        <div className="modal-actions">
          <Link to="/orders" className="btn btn-primary btn-lg">
            View orders
          </Link>
          <Link to="/" className="btn btn-outline btn-lg">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessModal
