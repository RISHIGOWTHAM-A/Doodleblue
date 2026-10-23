import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { z } from 'zod'
import { setCategory, setSearch } from '../features/products/productsSlice'
import { addToast } from '../features/ui/uiSlice'

const emailSchema = z.email()

function Footer() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => [
    ...new Set(state.products.items.map((p) => p.category)),
  ])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const goToCategory = (category) => {
    dispatch(setSearch(''))
    dispatch(setCategory(category))
    window.scrollTo({ top: 0 })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    const result = emailSchema.safeParse(email)
    if (!result.success) {
      setError('Enter a valid email address')
      return
    }

    const subs = JSON.parse(localStorage.getItem('shopkart:subs') ?? '[]')
    if (subs.includes(email)) {
      setError('This email is already subscribed')
      return
    }
    localStorage.setItem('shopkart:subs', JSON.stringify([...subs, email]))

    setSubscribed(true)
    setError('')
    setEmail('')
    dispatch(addToast('Subscribed — welcome aboard!'))
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo">
            Shop<span>Kart</span>
          </Link>
          <p>
            Everything you love, delivered. Quality products, honest prices and
            free shipping on orders over $100.
          </p>
          <div className="footer-badges">
            <span>Free returns</span>
            <span>Secure checkout</span>
            <span>24/7 support</span>
          </div>
        </div>

        <nav className="footer-col" aria-label="Shop">
          <h3>Shop</h3>
          <Link to="/">All products</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My orders</Link>
        </nav>

        <nav className="footer-col" aria-label="Categories">
          <h3>Categories</h3>
          {categories.length === 0 && <span className="muted">Loading...</span>}
          {categories.map((c) => (
            <Link key={c} to="/" onClick={() => goToCategory(c)}>
              {c.replace(/(^|\s)\w/g, (m) => m.toUpperCase())}
            </Link>
          ))}
        </nav>

        <div className="footer-col">
          <h3>Stay in the loop</h3>
          <p className="footer-news-text">
            New drops and exclusive deals, straight to your inbox.
          </p>
          {subscribed ? (
            <p className="footer-subscribed">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
              You're on the list — see you soon!
            </p>
          ) : (
            <form className="footer-news" onSubmit={handleSubscribe}>
              <div className="footer-news-field">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  className={error ? 'invalid' : ''}
                />
                {error && <em className="field-error">{error}</em>}
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ShopKart. All rights reserved.</span>
        <span>Built with React · Redux Toolkit · Fake Store API</span>
      </div>
    </footer>
  )
}

export default Footer
