import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload
      const index = state.items.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
        })
      }
    },
    clearWishlist(state) {
      state.items = []
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions

export const selectWishlistCount = (state) => state.wishlist.items.length

export const selectIsWishlisted = (state, id) =>
  state.wishlist.items.some((item) => item.id === id)

export default wishlistSlice.reducer
