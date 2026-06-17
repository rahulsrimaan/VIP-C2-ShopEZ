import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await API.post('/admin/login', { email, password })
            localStorage.setItem('adminToken', res.data.token)
            localStorage.setItem('admin', JSON.stringify(res.data.admin))
            navigate('/admin/dashboard')
        } catch (err) {
            setError('Invalid admin credentials')
        }
    }

return (
    <div style={styles.container}>
        <div style={styles.box}>
            <div style={styles.logoBox}>
                <div style={styles.logoIcon}>S</div>
                <h2 style={styles.title}>Admin Portal</h2>
                <p style={styles.subtitle}>Sign in to manage ShopEZ</p>
            </div>
            {error && <p style={styles.error}>⚠️ {error}</p>}
            <form onSubmit={handleLogin}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Enter admin email"
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
                <button style={styles.btn} type="submit">
                    → Admin Sign In
                </button>
            </form>
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
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '15px',
        width: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #E9ECEF'
    },
    logoBox: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    logoIcon: {
        width: '55px',
        height: '55px',
        borderRadius: '15px',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '800',
        fontSize: '1.5rem',
        margin: '0 auto 0.75rem'
    },
    title: {
        textAlign: 'center',
        marginBottom: '0.3rem',
        color: '#1a1a2e',
        fontSize: '1.4rem',
        fontWeight: '700'
    },
    subtitle: {
        textAlign: 'center',
        color: '#888',
        fontSize: '0.85rem',
        marginBottom: '1.5rem'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid #E9ECEF',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA',
        color: '#333'
    },
    label: {
        display: 'block',
        color: '#555',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '0.4rem'
    },
    inputGroup: {
        marginBottom: '0.5rem'
    },
    btn: {
        width: '100%',
        padding: '0.9rem',
        backgroundColor: '#1a1a2e',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '0.5rem'
    },
    error: {
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '0.85rem',
        backgroundColor: '#FFF0F3',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #FFCDD6'
    }
}


export default AdminLogin