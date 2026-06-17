import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'

const PrivateRoute = ({ children }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" />
}

function App() {
    const location = useLocation()
    const isAdminPage = location.pathname.startsWith('/admin')

    return (
        <>
            {!isAdminPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={
                    <PrivateRoute><Cart /></PrivateRoute>
                } />
                <Route path="/checkout" element={
                    <PrivateRoute><Checkout /></PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute><Profile /></PrivateRoute>
                } />
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </>
    )
}

export default App