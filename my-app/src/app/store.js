import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/es/storage'
import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import uiReducer from '../features/ui/uiSlice'
import authReducer from '../features/auth/authSlice'

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
  auth: authReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'wishlist', 'auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
