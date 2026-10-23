import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart(state, action) {
      const { product, qty = 1 } = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      if (existing) {
        existing.qty += qty
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          qty,
        })
      }
    },
    increase(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (item) item.qty += 1
    },
    decrease(state, action) {
      const item = state.items.find((item) => item.id === action.payload)
      if (!item) return
      if (item.qty <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload)
      } else {
        item.qty -= 1
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, increase, decrease, removeFromCart, clearCart } =
  cartSlice.actions

export const selectTotalItems = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0)

export const selectTotalPrice = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.qty * item.price, 0)

export const selectQtyById = (state, id) =>
  state.cart.items.find((item) => item.id === id)?.qty ?? 0

export default cartSlice.reducer
