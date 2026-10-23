import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await fetch('https://fakestoreapi.com/products')
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  },
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`)
    if (!res.ok) throw new Error('Failed to fetch product')
    return res.json()
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    detail: null,
    detailStatus: 'idle',
    detailError: null,
    search: '',
    category: 'all',
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading'
        state.detailError = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded'
        state.detail = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed'
        state.detailError = action.error.message
      })
  },
})

export const { setSearch, setCategory } = productsSlice.actions
export default productsSlice.reducer
