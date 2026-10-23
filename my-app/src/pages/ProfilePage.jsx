import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router'
import { selectUser, signOut } from '../features/auth/authSlice'
import { addToast } from '../features/ui/uiSlice'

function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [orders] = useState(() =>
    (JSON.parse(localStorage.getItem('shopkart:orders') ?? '[]')).reverse(),
  )

  if (!user) return <Navigate to="/signin?next=/profile" replace />

  const initials = user.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const myOrders = orders.filter((o) => o.customer?.email === user.email)
  const spent = myOrders.reduce((s, o) => s + o.total, 0)
  const recent = myOrders.slice(0, 3)

  const handleSignOut = () => {
    dispatch(signOut())
    dispatch(addToast('Signed out'))
    navigate('/')
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>My profile</h1>
        <button type="button" className="btn btn-outline" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="profile-layout">
        <section className="card-panel profile-card">
          <div className="avatar" aria-hidden="true">
            {initials}
          </div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>

          <dl className="profile-stats">
            <div>
              <dt>Orders</dt>
              <dd>{myOrders.length}</dd>
            </div>
            <div>
              <dt>Total spent</dt>
              <dd>${spent.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        <section className="card-panel profile-orders">
          <div className="profile-orders-head">
            <h2>Recent orders</h2>
            <Link to="/orders" className="continue">
              View all orders
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="profile-empty">
              <p className="muted">
                No orders on this account yet — your orders will appear here
                after checkout.
              </p>
              <Link to="/" className="btn btn-primary">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="profile-order-list">
              {recent.map((order) => (
                <li key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <p className="muted">
                      {new Date(order.placedAt).toLocaleString()} ·{' '}
                      {order.totalItems}{' '}
                      {order.totalItems === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="profile-order-right">
                    <strong>${order.total.toFixed(2)}</strong>
                    <span className="order-status">Placed</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProfilePage
