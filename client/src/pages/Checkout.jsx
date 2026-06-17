import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'

function Checkout() {
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        street: '',
        city: '',
        state: '',
        landmark: ''
    })
    const [paymentMethod, setPaymentMethod] = useState('Credit Card')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const cartItems = location.state?.cartItems || []

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const formatAddress = () => {
        return `${address.fullName}, ${address.phone}, ${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`
    }

    const handleOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formattedAddress = formatAddress()
            for (const item of cartItems) {
                await API.post('/orders/place', {
                    productId: item.productId,
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    address: formattedAddress,
                    paymentMethod
                })
            }
            await API.delete('/cart/clear/all')
            setSuccess(true)
            setTimeout(() => navigate('/profile'), 3000)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const paymentOptions = [
        { id: 'Credit Card', icon: '💳', label: 'Credit Card' },
        { id: 'Debit Card', icon: '🏧', label: 'Debit Card' },
        { id: 'UPI', icon: '📱', label: 'UPI Payment' },
        { id: 'Cash on Delivery', icon: '💵', label: 'Cash on Delivery' },
    ]

    if (success) {
        return (
            <div style={styles.successContainer}>
                <div style={styles.successBox}>
                    <div style={styles.successIconBox}>✓</div>
                    <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
                    <p style={styles.successText}>Thank you for shopping with ShopEZ!</p>
                    <p style={styles.successText}>Your order is being processed.</p>
                    <div style={styles.successDivider} />
                    <p style={styles.redirectText}>Redirecting to your orders...</p>
                    <button style={styles.viewOrdersBtn} onClick={() => navigate('/profile')}>
                        View My Orders →
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>Checkout</h1>
            <div style={styles.checkoutLayout}>

                {/* Left — Form */}
                <div style={styles.formSection}>

                    {/* Delivery Address */}
                    <div style={styles.formCard}>
                        <div style={styles.cardTitleRow}>
                            <div style={styles.cardStep}>1</div>
                            <h2 style={styles.cardTitle}>Delivery Address</h2>
                        </div>

                        <div style={styles.addressGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={address.fullName}
                                    onChange={(e) => setAddress({...address, fullName: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Phone Number *</label>
                                <input
                                    style={styles.input}
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={address.phone}
                                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Pincode *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="6-digit pincode"
                                    value={address.pincode}
                                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>City *</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="Enter city"
                                    value={address.city}
                                    onChange={(e) => setAddress({...address, city: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Street Address *</label>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="House No., Building, Street, Area"
                                value={address.street}
                                onChange={(e) => setAddress({...address, street: e.target.value})}
                                required
                            />
                        </div>

                        <div style={styles.addressGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Landmark (Optional)</label>
                                <input
                                    style={styles.input}
                                    type="text"
                                    placeholder="e.g. Near City Mall"
                                    value={address.landmark}
                                    onChange={(e) => setAddress({...address, landmark: e.target.value})}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>State *</label>
                                <select
                                    style={styles.input}
                                    value={address.state}
                                    onChange={(e) => setAddress({...address, state: e.target.value})}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu',
                                      'Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan',
                                      'Uttar Pradesh', 'West Bengal', 'Kerala', 'Punjab',
                                      'Haryana', 'Bihar', 'Madhya Pradesh', 'Odisha'].map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Address Preview */}
                        {address.fullName && address.street && (
                            <div style={styles.addressPreview}>
                                <p style={styles.addressPreviewLabel}>Delivery Address Preview:</p>
                                <p style={styles.addressPreviewText}>{formatAddress()}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={styles.formCard}>
                        <div style={styles.cardTitleRow}>
                            <div style={styles.cardStep}>2</div>
                            <h2 style={styles.cardTitle}>Payment Method</h2>
                        </div>
                        <div style={styles.paymentOptions}>
                            {paymentOptions.map(option => (
                                <div
                                    key={option.id}
                                    style={{
                                        ...styles.paymentOption,
                                        ...(paymentMethod === option.id ? styles.paymentOptionActive : {})
                                    }}
                                    onClick={() => setPaymentMethod(option.id)}
                                >
                                    <span style={styles.paymentIcon}>{option.icon}</span>
                                    <span style={styles.paymentLabel}>{option.label}</span>
                                    <div style={{
                                        ...styles.radioCircle,
                                        ...(paymentMethod === option.id ? styles.radioCircleActive : {})
                                    }}>
                                        {paymentMethod === option.id && <div style={styles.radioDot} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right — Summary */}
                <div style={styles.summarySection}>
                    <div style={styles.summaryBox}>
                        <div style={styles.cardTitleRow}>
                            <div style={styles.cardStep}>3</div>
                            <h2 style={styles.summaryTitle}>Order Summary</h2>
                        </div>

                        <div style={styles.itemsList}>
                            {cartItems.map(item => (
                                <div key={item._id} style={styles.summaryItem}>
                                    <img
                                        src={item.image}
                                        alt={item.productName}
                                        style={styles.itemImg}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                    />
                                    <div style={styles.itemInfo}>
                                        <p style={styles.itemName}>{item.productName}</p>
                                        <p style={styles.itemQty}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={styles.itemPrice}>
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={styles.divider} />

                        <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>Price ({totalItems} items)</span>
                            <span style={styles.priceValue}>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div style={styles.priceRow}>
                            <span style={styles.priceLabel}>Delivery</span>
                            <span style={{...styles.priceValue, color: '#16A34A', fontWeight: '600'}}>FREE</span>
                        </div>
                        <div style={styles.divider} />
                        <div style={styles.priceRow}>
                            <span style={styles.totalLabel}>Total Amount</span>
                            <span style={styles.totalValue}>₹{totalPrice.toLocaleString()}</span>
                        </div>

                        <button
                            style={{
                                ...styles.placeOrderBtn,
                                opacity: loading ? 0.7 : 1
                            }}
                            onClick={handleOrder}
                            disabled={loading || !address.fullName || !address.street || !address.pincode}
                        >
                            {loading ? '⏳ Placing Order...' : 'Place Order →'}
                        </button>

                        <p style={styles.secureText}>🔒 100% Secure Payments</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: '#F8F9FA',
        minHeight: '100vh',
        padding: '2rem'
    },
    pageTitle: {
        color: '#1a1a2e',
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '1.5rem'
    },
    checkoutLayout: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start'
    },
    formSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #E9ECEF'
    },
    cardTitleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem'
    },
    cardStep: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '0.85rem',
        flexShrink: 0
    },
    cardTitle: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '700'
    },
    addressGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    inputGroup: {
        marginBottom: '1rem'
    },
    label: {
        display: 'block',
        color: '#555',
        fontSize: '0.82rem',
        fontWeight: '700',
        marginBottom: '0.4rem',
        textTransform: 'uppercase',
        letterSpacing: '0.3px'
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
        color: '#333',
        backgroundColor: '#FAFAFA'
    },
    addressPreview: {
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginTop: '0.5rem'
    },
    addressPreviewLabel: {
        color: '#16A34A',
        fontSize: '0.75rem',
        fontWeight: '700',
        marginBottom: '0.3rem',
        textTransform: 'uppercase'
    },
    addressPreviewText: {
        color: '#1a1a2e',
        fontSize: '0.875rem',
        lineHeight: '1.5'
    },
    paymentOptions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    paymentOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#FAFAFA'
    },
    paymentOptionActive: {
        border: '2px solid #2ECC71',
        backgroundColor: '#F0FDF4'
    },
    paymentIcon: { fontSize: '1.5rem' },
    paymentLabel: {
        flex: 1,
        color: '#1a1a2e',
        fontWeight: '500',
        fontSize: '0.95rem'
    },
    radioCircle: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioCircleActive: { border: '2px solid #2ECC71' },
    radioDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71'
    },
    summarySection: {
        width: '350px',
        flexShrink: 0
    },
    summaryBox: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #E9ECEF',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '700'
    },
    itemsList: { marginBottom: '1rem' },
    summaryItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem'
    },
    itemImg: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '6px',
        flexShrink: 0
    },
    itemInfo: { flex: 1 },
    itemName: {
        color: '#1a1a2e',
        fontSize: '0.85rem',
        fontWeight: '500',
        marginBottom: '0.2rem'
    },
    itemQty: { color: '#888', fontSize: '0.8rem' },
    itemPrice: {
        color: '#1a1a2e',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    divider: {
        height: '1px',
        backgroundColor: '#F0F0F0',
        margin: '1rem 0'
    },
    priceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
    },
    priceLabel: { color: '#555', fontSize: '0.9rem' },
    priceValue: { color: '#0f1111', fontSize: '0.9rem', fontWeight: '500' },
    totalLabel: { color: '#1a1a2e', fontSize: '1rem', fontWeight: '700' },
    totalValue: { color: '#1a1a2e', fontSize: '1.1rem', fontWeight: '800' },
    placeOrderBtn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '1rem',
        marginBottom: '0.75rem'
    },
    secureText: {
        textAlign: 'center',
        color: '#888',
        fontSize: '0.8rem'
    },
    successContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        backgroundColor: '#F8F9FA'
    },
    successBox: {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '420px',
        width: '100%',
        border: '1px solid #E9ECEF'
    },
    successIconBox: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71',
        color: 'white',
        fontSize: '2rem',
        fontWeight: '800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
    },
    successTitle: {
        color: '#1a1a2e',
        fontSize: '1.4rem',
        fontWeight: '700',
        marginBottom: '0.75rem'
    },
    successText: {
        color: '#555',
        fontSize: '0.9rem',
        marginBottom: '0.4rem'
    },
    successDivider: {
        height: '1px',
        backgroundColor: '#F0F0F0',
        margin: '1.5rem 0'
    },
    redirectText: {
        color: '#888',
        fontSize: '0.85rem',
        marginBottom: '1rem'
    },
    viewOrdersBtn: {
        padding: '0.85rem 2rem',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer'
    }
}

export default Checkout