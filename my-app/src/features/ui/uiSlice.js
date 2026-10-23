import { createSlice, nanoid } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts.push(action.payload)
        if (state.toasts.length > 4) state.toasts.shift()
      },
      prepare(message) {
        return { payload: { id: nanoid(), message } }
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer
