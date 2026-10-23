import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router'
import { selectTotalItems } from '../features/cart/cartSlice'
import { setSearch } from '../features/products/productsSlice'
import { selectWishlistCount } from '../features/wishlist/wishlistSlice'

function Header() {
  const dispatch = useDispatch()
  const totalItems = useSelector(selectTotalItems)
  const wishlistCount = useSelector(selectWishlistCount)
  const search = useSelector((state) => state.products.search)

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Shop<span>Kart</span>
        </Link>

        <div className="search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>

        <nav className="header-nav">
          <NavLink to="/" className="nav-link">
            Products
          </NavLink>
          <NavLink to="/orders" className="cart-btn" aria-label="Orders">
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
            <span className="nav-label">Orders</span>
          </NavLink>
          <NavLink to="/wishlist" className="cart-btn" aria-label="Wishlist">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 21s-7.5-4.7-9.8-9C.7 9.2 1.6 5.6 4.7 4.5c2-.7 4.2-.1 5.4 1.5.5.7 1.4.7 1.9 0 1.2-1.6 3.4-2.2 5.4-1.5 3.1 1.1 4 4.7 2.5 7.5-2.3 4.3-7.9 9-7.9 9Z" />
            </svg>
            <span className="nav-label">Wishlist</span>
            <span key={wishlistCount} className="badge">
              {wishlistCount}
            </span>
          </NavLink>
          <NavLink to="/cart" className="cart-btn" aria-label="Cart">
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
            <span className="nav-label">Cart</span>
            <span key={totalItems} className="badge">
              {totalItems}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
