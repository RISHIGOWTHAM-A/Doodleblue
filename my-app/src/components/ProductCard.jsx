import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import {
  addToCart,
  decrease,
  increase,
  selectQtyById,
} from '../features/cart/cartSlice'
import { addToast } from '../features/ui/uiSlice'
import QuantityStepper from './QuantityStepper'
import Stars from './Stars'
import WishlistButton from './WishlistButton'

function ProductCard({ product, style }) {
  const dispatch = useDispatch()
  const qty = useSelector((state) => selectQtyById(state, product.id))

  const handleAdd = () => {
    dispatch(addToCart({ product, qty: 1 }))
    dispatch(addToast('Added to cart'))
  }

  return (
    <article className="card" style={style}>
      <Link to={`/product/${product.id}`} className="card-image">
        <img src={product.image} alt={product.title} loading="lazy" />
        <WishlistButton product={product} />
      </Link>
      <div className="card-body">
        <p className="card-category">{product.category}</p>
        <Link to={`/product/${product.id}`} className="card-title">
          {product.title}
        </Link>
        <p className="card-rating">
          <Stars rate={product.rating?.rate ?? 0} />
          <span className="rating-value">{product.rating?.rate}</span>
          <span className="rating-count">
            ({product.rating?.count ?? 0} reviews)
          </span>
        </p>
        <div className="card-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          {qty > 0 ? (
            <QuantityStepper
              qty={qty}
              onDecrease={() => dispatch(decrease(product.id))}
              onIncrease={() => dispatch(increase(product.id))}
            />
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
