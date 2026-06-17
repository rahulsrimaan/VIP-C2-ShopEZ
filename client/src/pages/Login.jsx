import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Login() {
    const [mode, setMode] = useState('user')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (mode === 'user') {
                const res = await API.post('/users/login', { email, password })
                login(res.data.user, res.data.token)
                navigate('/products')
            } else {
                const res = await API.post('/admin/login', { email, password })
                localStorage.setItem('adminToken', res.data.token)
                localStorage.setItem('admin', JSON.stringify(res.data.admin))
                navigate('/admin/dashboard')
            }
        } catch (err) {
            setError(mode === 'user' ? 'Invalid email or password' : 'Invalid admin credentials')
        }
        setLoading(false)
    }

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                {/* Logo */}
                <h1 style={styles.logo}> ShopEZ</h1>
                <p style={styles.tagline}>Your one-stop shopping destination</p>

                {/* Toggle */}
                <div style={styles.toggle}>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            ...(mode === 'user' ? styles.toggleBtnActive : {})
                        }}
                        onClick={() => { setMode('user'); setError('') }}
                    >
                        👤 User Login
                    </button>
                    <button
                        style={{
                            ...styles.toggleBtn,
                            ...(mode === 'admin' ? styles.toggleBtnActive : {})
                        }}
                        onClick={() => { setMode('admin'); setError('') }}
                    >
                         Admin Login
                    </button>
                </div>

                {/* Form */}
                <div style={styles.formBox}>
                    <h2 style={styles.formTitle}>
                        {mode === 'user' ? 'Welcome Back! 👋' : 'Admin Portal '}
                    </h2>
                    <p style={styles.formSubtitle}>
                        {mode === 'user'
                            ? 'Sign in to continue shopping'
                            : 'Sign in to manage ShopEZ'}
                    </p>

                    {error && (
                        <div style={styles.errorBox}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder={mode === 'user' ? 'Enter your email' : 'Enter admin email'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            style={{
                                ...styles.loginBtn,
                                backgroundColor: mode === 'user' ? '#e94560' : '#1a1a2e'
                            }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? '⏳ Signing in...' : mode === 'user' ? '→ Sign In' : '→ Admin Sign In'}
                        </button>
                    </form>

                    {mode === 'user' && (
                        <p style={styles.registerText}>
                            New to ShopEZ?{' '}
                            <Link to="/register" style={styles.registerLink}>
                                Create an account
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '2rem'
    },
    box: {
        width: '420px',
        textAlign: 'center'
    },
    logo: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '0.3rem'
    },
    tagline: {
        color: '#aaa',
        fontSize: '0.9rem',
        marginBottom: '2rem'
    },
    toggle: {
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '1.5rem'
    },
    toggleBtn: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: 'transparent',
        color: '#aaa',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.2s'
    },
    toggleBtnActive: {
        backgroundColor: 'white',
        color: '#1a1a2e'
    },
    formBox: {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    formTitle: {
        color: '#1a1a2e',
        fontSize: '1.4rem',
        fontWeight: '700',
        marginBottom: '0.3rem'
    },
    formSubtitle: {
        color: '#888',
        fontSize: '0.85rem',
        marginBottom: '1.5rem'
    },
    errorBox: {
        backgroundColor: '#fff0f3',
        border: '1px solid #ffcdd6',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: '#e94560',
        fontSize: '0.85rem',
        marginBottom: '1rem',
        textAlign: 'left'
    },
    inputGroup: {
        marginBottom: '1rem',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        color: '#555',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '0.4rem'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        color: '#333'
    },
    loginBtn: {
        width: '100%',
        padding: '0.9rem',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'all 0.2s'
    },
    registerText: {
        color: '#888',
        fontSize: '0.875rem',
        marginTop: '1.25rem'
    },
    registerLink: {
        color: '#e94560',
        fontWeight: '600',
        textDecoration: 'none'
    }
}

export default Login