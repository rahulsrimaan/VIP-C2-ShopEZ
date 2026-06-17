import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match!')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters!')
            return
        }

        setLoading(true)
        try {
            await API.post('/users/register', { username, email, password })
            navigate('/login')
        } catch (err) {
            setError('Registration failed. Email may already exist.')
        }
        setLoading(false)
    }

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                {/* Logo */}
                <h1 style={styles.logo}> ShopEZ</h1>
                <p style={styles.tagline}>Join millions of happy shoppers</p>

                <div style={styles.formBox}>
                    <h2 style={styles.formTitle}>Create Account </h2>
                    <p style={styles.formSubtitle}>
                        Sign up to start shopping today
                    </p>

                    {error && (
                        <div style={styles.errorBox}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Enter your full name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder="Enter your email"
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
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <p style={styles.terms}>
                            By creating an account, you agree to our{' '}
                            <span style={styles.termsLink}>Terms of Service</span>
                            {' '}and{' '}
                            <span style={styles.termsLink}>Privacy Policy</span>
                        </p>

                        <button
                            style={{
                                ...styles.registerBtn,
                                opacity: loading ? 0.7 : 1
                            }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? ' Creating Account...' : '→ Create Account'}
                        </button>
                    </form>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>
                            Sign In
                        </Link>
                    </p>
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
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
        padding: '2rem'
    },
    box: {
        width: '420px',
        textAlign: 'center'
    },
    logo: {
        color: '#1a1a2e',
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '0.3rem'
    },
    tagline: {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '2rem'
    },
    formBox: {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #E9ECEF'
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
        backgroundColor: '#FFF0F3',
        border: '1px solid #FFCDD6',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: '#EF4444',
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
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        color: '#333',
        backgroundColor: '#FAFAFA'
    },
    terms: {
        color: '#888',
        fontSize: '0.8rem',
        marginBottom: '1rem',
        textAlign: 'left',
        lineHeight: '1.5'
    },
    termsLink: {
        color: '#2ECC71',
        cursor: 'pointer',
        fontWeight: '500'
    },
    registerBtn: {
        width: '100%',
        padding: '0.9rem',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    loginText: {
        color: '#888',
        fontSize: '0.875rem',
        marginTop: '1.25rem'
    },
    loginLink: {
        color: '#2ECC71',
        fontWeight: '600',
        textDecoration: 'none'
    }
}
export default Register