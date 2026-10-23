import { useDispatch, useSelector } from 'react-redux'
import { addToast } from '../features/ui/uiSlice'
import {
  selectIsWishlisted,
  toggleWishlist,
} from '../features/wishlist/wishlistSlice'

function WishlistButton({ product }) {
  const dispatch = useDispatch()
  const active = useSelector((state) => selectIsWishlisted(state, product.id))

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(product))
    dispatch(
      addToast(
        active ? 'Removed from wishlist' : 'Added to wishlist',
      ),
    )
  }

  return (
    <button
      type="button"
      className={active ? 'wishlist-btn active' : 'wishlist-btn'}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 21s-7.5-4.7-9.8-9C.7 9.2 1.6 5.6 4.7 4.5c2-.7 4.2-.1 5.4 1.5.5.7 1.4.7 1.9 0 1.2-1.6 3.4-2.2 5.4-1.5 3.1 1.1 4 4.7 2.5 7.5-2.3 4.3-7.9 9-7.9 9Z" />
      </svg>
    </button>
  )
}

export default WishlistButton
