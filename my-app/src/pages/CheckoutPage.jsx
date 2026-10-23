import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { z } from 'zod'
import OrderSuccessModal from '../components/OrderSuccessModal'
import {
  clearCart,
  selectTotalItems,
  selectTotalPrice,
} from '../features/cart/cartSlice'
import { addToast } from '../features/ui/uiSlice'

const checkoutSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .regex(/^[0-9+\-\s]{8,15}$/, 'Enter a valid phone number'),
    address: z.string().min(5, 'Enter your street address'),
    city: z.string().min(2, 'Enter your city'),
    zip: z.string().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid ZIP code'),
    payment: z.enum(['cod', 'card']),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payment !== 'card') return
    if (!/^\d{16}$/.test((data.cardNumber ?? '').replace(/\s/g, ''))) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardNumber'],
        message: 'Enter a 16-digit card number',
      })
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry ?? '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['expiry'],
        message: 'Use MM/YY format',
      })
    }
    if (!/^\d{3,4}$/.test(data.cvv ?? '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['cvv'],
        message: 'Enter a 3–4 digit CVV',
      })
    }
  })

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  payment: 'cod',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

function Field({ label, name, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} {...props} className={error ? 'invalid' : ''} />
      {error && <em className="field-error">{error}</em>}
    </label>
  )
}

function CheckoutPage() {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const totalItems = useSelector(selectTotalItems)
  const subtotal = useSelector(selectTotalPrice)
  const shipping = subtotal >= 100 ? 0 : 5
  const total = subtotal + shipping

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(null)

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = checkoutSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      dispatch(addToast('Please fix the highlighted fields'))
      return
    }

    const order = {
      id: `SK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      items,
      totalItems,
      subtotal,
      shipping,
      total,
      customer: result.data,
      placedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('shopkart:orders') ?? '[]')
    localStorage.setItem(
      'shopkart:orders',
      JSON.stringify([...existing, order]),
    )

    dispatch(clearCart())
    dispatch(addToast('Order placed successfully'))
    setPlaced(order)
    window.scrollTo({ top: 0 })
  }

  if (placed) {
    return (
      <main className="page">
        <OrderSuccessModal order={placed} />
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="page">
        <div className="state-msg">
          <p>Your cart is empty — add some products first.</p>
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
        <h1>Checkout</h1>
        <Link to="/cart" className="continue">
          ‹ Back to cart
        </Link>
      </div>

      <div className="cart-layout">
        <form className="card-panel checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>

          <Field
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={update}
            error={errors.fullName}
            placeholder="Priya Kumar"
          />
          <div className="field-row">
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              error={errors.email}
              placeholder="priya@example.com"
            />
            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={update}
              error={errors.phone}
              placeholder="+91 98765 43210"
            />
          </div>
          <Field
            label="Street address"
            name="address"
            value={form.address}
            onChange={update}
            error={errors.address}
            placeholder="12, Gandhi Street"
          />
          <div className="field-row">
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={update}
              error={errors.city}
              placeholder="Chennai"
            />
            <Field
              label="ZIP code"
              name="zip"
              value={form.zip}
              onChange={update}
              error={errors.zip}
              placeholder="600001"
            />
          </div>

          <h2>Payment</h2>
          <div className="pay-options">
            <label className={form.payment === 'cod' ? 'pay active' : 'pay'}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={form.payment === 'cod'}
                onChange={update}
              />
              Cash on delivery
            </label>
            <label className={form.payment === 'card' ? 'pay active' : 'pay'}>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={form.payment === 'card'}
                onChange={update}
              />
              Card
            </label>
          </div>

          {form.payment === 'card' && (
            <div className="card-fields">
              <Field
                label="Card number"
                name="cardNumber"
                value={form.cardNumber}
                onChange={update}
                error={errors.cardNumber}
                placeholder="4242 4242 4242 4242"
                inputMode="numeric"
              />
              <div className="field-row">
                <Field
                  label="Expiry"
                  name="expiry"
                  value={form.expiry}
                  onChange={update}
                  error={errors.expiry}
                  placeholder="MM/YY"
                />
                <Field
                  label="CVV"
                  name="cvv"
                  value={form.cvv}
                  onChange={update}
                  error={errors.cvv}
                  placeholder="123"
                  inputMode="numeric"
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block">
            Place order · ${total.toFixed(2)}
          </button>
        </form>

        <aside className="card-panel summary">
          <h2>Order summary</h2>
          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
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
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
