import { Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import ToastHost from './components/Toast'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import ProfilePage from './pages/ProfilePage'
import SignInPage from './pages/SignInPage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
      <ToastHost />
    </>
  )
}

export default App
