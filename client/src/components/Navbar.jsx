import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [hoveredLink, setHoveredLink] = useState(null)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={styles.nav}>
            {/* Logo */}
            <Link to="/" style={styles.brand}>
                <span style={styles.brandIcon}>S</span>
                ShopEZ
            </Link>

            {/* Center Links */}
            <div style={styles.centerLinks}>
                <Link
                    to="/"
                    style={{
                        ...styles.link,
                        ...(hoveredLink === 'home' ? styles.linkHover : {})
                    }}
                    onMouseEnter={() => setHoveredLink('home')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Home
                </Link>
                <Link
                    to="/products"
                    style={{
                        ...styles.link,
                        ...(hoveredLink === 'products' ? styles.linkHover : {})
                    }}
                    onMouseEnter={() => setHoveredLink('products')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Products
                </Link>
            </div>

            {/* Right Side */}
            <div style={styles.rightLinks}>
                {user ? (
                    <>
                        <Link to="/cart" style={styles.cartBtn}>
                            🛒 Cart
                        </Link>
                        <Link to="/profile" style={styles.profileBtn}>
                            👤 {user.username}
                        </Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.loginBtn}>Login</Link>
                        <Link to="/register" style={styles.registerBtn}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.85rem 2rem',
        backgroundColor: 'white',
        borderBottom: '2px solid #2ECC71',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    brand: {
        color: '#1a1a2e',
        textDecoration: 'none',
        fontSize: '1.4rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    brandIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '800',
        fontSize: '1rem'
    },
    centerLinks: {
        display: 'flex',
        gap: '2rem'
    },
    link: {
        color: '#555',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        padding: '0.5rem 0',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s'
    },
    linkHover: {
        color: '#2ECC71',
        borderBottom: '2px solid #2ECC71'
    },
    rightLinks: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
    },
    cartBtn: {
        color: '#1a1a2e',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    profileBtn: {
        color: '#1a1a2e',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#FFFBEB',
        border: '1px solid #FDE68A',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    loginBtn: {
        color: '#1a1a2e',
        textDecoration: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        border: '1px solid #E9ECEF',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    registerBtn: {
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        backgroundColor: '#2ECC71',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    logoutBtn: {
        color: '#EF4444',
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: '1px solid #FEE2E2',
        fontSize: '0.9rem',
        cursor: 'pointer',
        fontWeight: '500'
    }
}

export default Navbar