import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Cart() {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        setLoading(true)
        try {
            const res = await API.get('/cart')
            setCartItems(res.data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const removeFromCart = async (id) => {
        try {
            await API.delete(`/cart/${id}`)
            fetchCart()
        } catch (err) {
            console.log(err)
        }
    }

    const updateQuantity = async (item, newQty) => {
        if (newQty < 1) return
        try {
            await API.delete(`/cart/${item._id}`)
            await API.post('/cart/add', {
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: newQty,
                image: item.image
            })
            fetchCart()
        } catch (err) {
            console.log(err)
        }
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const savings = cartItems.reduce((sum, item) => sum + (item.originalPrice || 0) * item.quantity, 0)

    if (loading) return (
        <div style={styles.loadingContainer}>
            <p className="loading-pulse" style={styles.loadingText}>⏳ Loading your cart...</p>
        </div>
    )

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>🛒 Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <div style={styles.emptyBox}>
                        <p style={styles.emptyIcon}>🛒</p>
                        <h2 style={styles.emptyTitle}>Your cart is empty!</h2>
                        <p style={styles.emptyText}>
                            Looks like you haven't added anything to your cart yet
                        </p>
                        <button
                            style={styles.shopBtn}
                            onClick={() => navigate('/products')}
                        >
                            Start Shopping →
                        </button>
                    </div>
                </div>
            ) : (
                <div style={styles.cartLayout}>
                    {/* Cart Items */}
                    <div style={styles.itemsSection}>
                        <div style={styles.itemsHeader}>
                            <p style={styles.itemsCount}>
                                {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
                            </p>
                            <button
                                style={styles.continueBtn}
                                onClick={() => navigate('/products')}
                            >
                                ← Continue Shopping
                            </button>
                        </div>

                        {cartItems.map(item => (
                            <div key={item._id} style={styles.cartCard}>
                                <img
                                    src={item.image}
                                    alt={item.productName}
                                    style={styles.itemImage}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/120'}
                                />
                                <div style={styles.itemDetails}>
                                    <h3 style={styles.itemName}>{item.productName}</h3>
                                    <p style={styles.itemPrice}>₹{item.price} per item</p>
                                    <p style={styles.itemSubtotal}>
                                        Subtotal: <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                                    </p>
                                    <div style={styles.itemActions}>
                                        <div style={styles.quantityControl}>
                                            <button
                                                style={styles.qtyBtn}
                                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                            >−</button>
                                            <span style={styles.qtyNum}>{item.quantity}</span>
                                            <button
                                                style={styles.qtyBtn}
                                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                        <button
                                            style={styles.removeBtn}
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                                <div style={styles.itemTotal}>
                                    <h3 style={styles.itemTotalPrice}>
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={styles.summarySection}>
                        <div style={styles.summaryBox}>
                            <h2 style={styles.summaryTitle}>Order Summary</h2>

                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>
                                    Price ({totalItems} item{totalItems > 1 ? 's' : ''})
                                </span>
                                <span style={styles.summaryValue}>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Delivery Charges</span>
                                <span style={{...styles.summaryValue, color: '#007600', fontWeight: '600'}}>
                                    FREE
                                </span>
                            </div>
                            <div style={styles.divider} />
                            <div style={styles.summaryRow}>
                                <span style={styles.totalLabel}>Total Amount</span>
                                <span style={styles.totalValue}>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <p style={styles.savingsText}>
                                🎉 You save ₹0 on this order!
                            </p>

                            <button
                                style={styles.checkoutBtn}
                                onClick={() => navigate('/checkout', { state: { cartItems } })}
                            >
                                Proceed to Checkout →
                            </button>

                            <div style={styles.secureInfo}>
                                🔒 Safe and Secure Payments
                            </div>

                            {/* Accepted Payments */}
                            <div style={styles.paymentMethods}>
                                <p style={styles.paymentTitle}>We Accept all Payment Methods:</p>
                                <div style={styles.paymentIcons}>
                                    <span style={styles.paymentIcon}>💳</span>
                                    
                                    <span style={styles.paymentIcon}>📱</span>
                                    <span style={styles.paymentIcon}>💵</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: '#f0f2f2',
        minHeight: '100vh',
        padding: '2rem'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh'
    },
    loadingText: {
        color: '#888',
        fontSize: '1.1rem'
    },
    pageTitle: {
        color: '#1a1a2e',
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '1.5rem'
    },
    emptyContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
    },
    emptyBox: {
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '400px'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    },
    emptyTitle: {
        color: '#1a1a2e',
        fontSize: '1.3rem',
        marginBottom: '0.75rem'
    },
    emptyText: {
        color: '#888',
        fontSize: '0.9rem',
        marginBottom: '1.5rem',
        lineHeight: '1.6'
    },
    shopBtn: {
        padding: '0.85rem 2rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer'
    },
    cartLayout: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start'
    },
    itemsSection: {
        flex: 1
    },
    itemsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    },
    itemsCount: {
        color: '#1a1a2e',
        fontWeight: '600',
        fontSize: '1rem'
    },
    continueBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #e94560',
        color: '#e94560',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    cartCard: {
        display: 'flex',
        gap: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s'
    },
    itemImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '8px',
        flexShrink: 0
    },
    itemDetails: {
        flex: 1
    },
    itemName: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.4rem'
    },
    itemPrice: {
        color: '#888',
        fontSize: '0.85rem',
        marginBottom: '0.3rem'
    },
    itemSubtotal: {
        color: '#444',
        fontSize: '0.9rem',
        marginBottom: '0.75rem'
    },
    itemActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    qtyBtn: {
        width: '32px',
        height: '32px',
        backgroundColor: '#f0f2f2',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '700',
        color: '#333'
    },
    qtyNum: {
        width: '36px',
        textAlign: 'center',
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#0f1111'
    },
    removeBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #ffcdd6',
        color: '#e94560',
        padding: '0.4rem 0.85rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '500'
    },
    itemTotal: {
        textAlign: 'right',
        flexShrink: 0
    },
    itemTotalPrice: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '700'
    },
    summarySection: {
        width: '320px',
        flexShrink: 0
    },
    summaryBox: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: '80px'
    },
    summaryTitle: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '700',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #f0f0f0'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
    },
    summaryLabel: {
        color: '#555',
        fontSize: '0.9rem'
    },
    summaryValue: {
        color: '#0f1111',
        fontSize: '0.9rem',
        fontWeight: '500'
    },
    divider: {
        height: '1px',
        backgroundColor: '#f0f0f0',
        margin: '1rem 0'
    },
    totalLabel: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '700'
    },
    totalValue: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '800'
    },
    savingsText: {
        color: '#007600',
        fontSize: '0.85rem',
        fontWeight: '500',
        marginBottom: '1rem',
        marginTop: '0.5rem'
    },
    checkoutBtn: {
        width: '100%',
        padding: '1rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '0.75rem'
    },
    secureInfo: {
        textAlign: 'center',
        color: '#888',
        fontSize: '0.8rem',
        marginBottom: '1rem'
    },
    paymentMethods: {
        borderTop: '1px solid #f0f0f0',
        paddingTop: '1rem'
    },
    paymentTitle: {
        color: '#888',
        fontSize: '0.8rem',
        marginBottom: '0.5rem'
    },
    paymentIcons: {
        display: 'flex',
        gap: '0.5rem'
    },
    paymentIcon: {
        fontSize: '1.5rem'
    }
}

export default Cart