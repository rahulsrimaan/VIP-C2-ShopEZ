import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Profile() {
    const [orders, setOrders] = useState([])
    const [activeTab, setActiveTab] = useState('orders')
    const [loading, setLoading] = useState(true)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await API.get('/orders/myorders')
            setOrders(res.data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    try {
        await API.put(`/orders/cancel/${orderId}`)
        alert('Order cancelled successfully!')
        fetchOrders()
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel order')
    }
}
    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return '#FFA41C'
            case 'Processing': return '#007185'
            case 'Shipped': return '#45B7D1'
            case 'Delivered': return '#007600'
            default: return '#888'
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Pending': return '⏳'
            case 'Processing': return '⚙️'
            case 'Shipped': return '🚚'
            case 'Delivered': return '✅'
            default: return '📦'
        }
    }

    const totalSpent = orders.reduce((sum, o) => sum + o.price * o.quantity, 0)
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
    const pendingOrders = orders.filter(o => o.status === 'Pending').length

    return (
        <div style={styles.container}>
            {/* Profile Header */}
            <div style={styles.profileHeader}>
                <div style={styles.headerContent}>
                    <div style={styles.avatarSection}>
                        <div style={styles.avatar}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.userInfo}>
                            <h1 style={styles.userName}>Hello, {user?.username}! </h1>
                            <p style={styles.userEmail}>Email: {user?.email}</p>
                            <p style={styles.memberSince}>
                                 Member since {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                         Sign Out
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <h3 style={styles.statNum}>{orders.length}</h3>
                    <p style={styles.statLabel}>Total Orders</p>
                </div>
                <div style={styles.statCard}>
                    <h3 style={styles.statNum}>{deliveredOrders}</h3>
                    <p style={styles.statLabel}>Delivered</p>
                </div>
                <div style={styles.statCard}>
                    <h3 style={styles.statNum}>{pendingOrders}</h3>
                    <p style={styles.statLabel}>Pending</p>
                </div>
                <div style={styles.statCard}>
                    <h3 style={styles.statNum}>₹{totalSpent.toLocaleString()}</h3>
                    <p style={styles.statLabel}>Total Spent</p>
                </div>
            </div>

            <div style={styles.mainContent}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>My Account</h3>
                    {[
                        { id: 'orders', icon: '📦', label: 'My Orders' },
                        { id: 'account', icon: '👤', label: 'Account Details' },
                        { id: 'address', icon: '📍', label: 'Saved Addresses' },
                        { id: 'payments', icon: '💳', label: 'Payment Methods' },
                    ].map(item => (
                        <button
                            key={item.id}
                            style={{
                                ...styles.sidebarBtn,
                                ...(activeTab === item.id ? styles.sidebarBtnActive : {})
                            }}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                    <button
                        style={styles.shopBtn}
                        onClick={() => navigate('/products')}
                    >
                         Continue Shopping
                    </button>
                </div>

                {/* Main Content */}
                <div style={styles.content}>

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={styles.contentTitle}>My Orders</h2>
                            {loading ? (
                                <p style={styles.loadingText}>⏳ Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <div style={styles.emptyBox}>
                                    <p style={styles.emptyIcon}>📦</p>
                                    <h3 style={styles.emptyTitle}>No orders yet!</h3>
                                    <p style={styles.emptyText}>Looks like you haven't ordered anything yet</p>
                                    <button
                                        style={styles.shopNowBtn}
                                        onClick={() => navigate('/products')}
                                    >
                                        Start Shopping →
                                    </button>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order._id} style={styles.orderCard}>
                                        {/* Order Header */}
                                        <div style={styles.orderHeader}>
                                            <div style={styles.orderHeaderLeft}>
                                                <div style={styles.orderMeta}>
                                                    <span style={styles.orderMetaLabel}>ORDER PLACED</span>
                                                    <span style={styles.orderMetaValue}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div style={styles.orderMeta}>
                                                    <span style={styles.orderMetaLabel}>TOTAL</span>
                                                    <span style={styles.orderMetaValue}>
                                                        ₹{(order.price * order.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div style={styles.orderMeta}>
                                                    <span style={styles.orderMetaLabel}>PAYMENT</span>
                                                    <span style={styles.orderMetaValue}>{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                            <div style={styles.orderHeaderRight}>
                                                <span style={styles.orderIdLabel}>ORDER ID</span>
                                                <span style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>

                                        {/* Order Body */}
                                        <div style={styles.orderBody}>
                                            <div style={styles.orderStatus}>
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    backgroundColor: getStatusColor(order.status)
                                                }}>
                                                    {getStatusIcon(order.status)} {order.status}
                                                </span>
                                                {order.status === 'Delivered' && (
                                                    <p style={styles.deliveredMsg}>
                                                        ✅ Delivered successfully
                                                    </p>
                                                )}
                                                {order.status === 'Shipped' && (
                                                    <p style={styles.shippedMsg}>
                                                        🚚 Your order is on the way!
                                                    </p>
                                                )}
                                                {order.status === 'Pending' && (
                                                    <p style={styles.pendingMsg}>
                                                        ⏳ Order is being processed
                                                    </p>
                                                )}
                                            </div>

                                            <div style={styles.orderDetails}>
                                                <h3 style={styles.orderProductName}>{order.productName}</h3>
                                                <p style={styles.orderDetailText}>
                                                    Quantity: {order.quantity}
                                                </p>
                                                <p style={styles.orderDetailText}>
                                                    Price: ₹{order.price} per item
                                                </p>
                                                <p style={styles.orderDetailText}>
                                                    📍 {order.address}
                                                </p>
                                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
    <button
        style={styles.cancelBtn}
        onClick={() => handleCancelOrder(order._id)}
    >
        Cancel Order
    </button>
)}
{order.status === 'Cancelled' && (
    <p style={styles.cancelledText}>Order Cancelled</p>
)}
                                            </div>

                                            {/* Progress Bar */}
                                            <div style={styles.progressSection}>
    {order.status === 'Cancelled' ? (
        <p style={{color: '#EF4444', fontWeight: '600', fontSize: '0.9rem'}}>
            This order has been cancelled
        </p>
    ) : (
        ['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
            const currentIndex = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(order.status)
            return (
                <div key={step} style={styles.progressStep}>
                    <div style={{
                        ...styles.progressDot,
                        backgroundColor: index <= currentIndex ? '#2ECC71' : '#ddd'
                    }}>
                        {index <= currentIndex ? '✓' : index + 1}
                    </div>
                    <p style={{
                        ...styles.progressLabel,
                        color: index <= currentIndex ? '#2ECC71' : '#888'
                    }}>
                        {step}
                    </p>
                    {index < 3 && (
                        <div style={{
                            ...styles.progressLine,
                            backgroundColor: index < currentIndex ? '#2ECC71' : '#ddd'
                        }} />
                    )}
                </div>
            )
        })
    )}
</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <div>
                            <h2 style={styles.contentTitle}>Account Details</h2>
                            <div style={styles.accountCard}>
                                <div style={styles.accountField}>
                                    <label style={styles.fieldLabel}>Full Name</label>
                                    <div style={styles.fieldValue}>{user?.username}</div>
                                </div>
                                <div style={styles.accountField}>
                                    <label style={styles.fieldLabel}>Email Address</label>
                                    <div style={styles.fieldValue}>{user?.email}</div>
                                </div>
                                <div style={styles.accountField}>
                                    <label style={styles.fieldLabel}>Account Type</label>
                                    <div style={styles.fieldValue}>
                                        <span style={styles.accountType}>Standard User</span>
                                    </div>
                                </div>
                                <div style={styles.accountField}>
                                    <label style={styles.fieldLabel}>Member Since</label>
                                    <div style={styles.fieldValue}>{new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ADDRESS TAB */}
                    {activeTab === 'address' && (
                        <div>
                            <h2 style={styles.contentTitle}>Saved Addresses</h2>
                            <div style={styles.comingSoon}>
                                <p style={styles.comingSoonIcon}>📍</p>
                                <h3 style={styles.comingSoonTitle}>No saved addresses yet</h3>
                                <p style={styles.comingSoonText}>
                                    Your addresses will be saved here after your first order
                                </p>
                                {orders.length > 0 && (
                                    <div style={styles.savedAddress}>
                                        <p style={styles.savedAddressLabel}>Last used address:</p>
                                        <p style={styles.savedAddressValue}>{orders[0]?.address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === 'payments' && (
                        <div>
                            <h2 style={styles.contentTitle}>Payment Methods</h2>
                            <div style={styles.comingSoon}>
                                <p style={styles.comingSoonIcon}>💳</p>
                                <h3 style={styles.comingSoonTitle}>Payment Methods</h3>
                                <p style={styles.comingSoonText}>Methods used in your orders:</p>
                                <div style={styles.paymentsList}>
                                    {[...new Set(orders.map(o => o.paymentMethod))].map(method => (
                                        <div key={method} style={styles.paymentItem}>
                                            {method === 'Credit Card' ? '💳' :
                                             method === 'Debit Card' ? '🏧' :
                                             method === 'UPI' ? '📱' : '💵'} {method}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: '#f0f2f2',
        minHeight: '100vh'
    },
    profileHeader: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '2rem',
        color: 'white'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatarSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#e94560',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: '800',
        color: 'white',
        border: '3px solid rgba(255,255,255,0.3)'
    },
    userInfo: {},
    userName: {
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '0.3rem'
    },
    userEmail: {
        color: '#ccc',
        fontSize: '0.9rem',
        marginBottom: '0.2rem'
    },
    memberSince: {
        color: '#aaa',
        fontSize: '0.85rem'
    },
    logoutBtn: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'rgba(233,69,96,0.2)',
        color: 'white',
        border: '1px solid rgba(233,69,96,0.5)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    statsRow: {
        display: 'flex',
        gap: '1rem',
        padding: '1.5rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e7e7e7'
    },
    statCard: {
        flex: 1,
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e7e7e7'
    },
    statNum: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#1a1a2e',
        marginBottom: '0.2rem'
    },
    statLabel: {
        color: '#888',
        fontSize: '0.8rem',
        fontWeight: '500'
    },
    mainContent: {
        display: 'flex',
        maxWidth: '1200px',
        margin: '1.5rem auto',
        gap: '1.5rem',
        padding: '0 1.5rem'
    },
    sidebar: {
        width: '220px',
        flexShrink: 0
    },
    sidebarTitle: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #e94560'
    },
    sidebarBtn: {
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: 'white',
        border: '1px solid #e7e7e7',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.9rem',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem',
        transition: 'all 0.2s'
    },
    sidebarBtnActive: {
        backgroundColor: '#fff0f3',
        borderColor: '#e94560',
        color: '#e94560',
        fontWeight: '600'
    },
    shopBtn: {
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        marginTop: '1rem'
    },
    content: {
        flex: 1
    },
    contentTitle: {
        color: '#1a1a2e',
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '1rem'
    },
    loadingText: {
        color: '#888',
        textAlign: 'center',
        padding: '2rem'
    },
    emptyBox: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '3rem',
        textAlign: 'center',
        border: '1px solid #e7e7e7'
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem'
    },
    emptyTitle: {
        color: '#1a1a2e',
        fontSize: '1.2rem',
        marginBottom: '0.5rem'
    },
    emptyText: {
        color: '#888',
        marginBottom: '1.5rem'
    },
    shopNowBtn: {
        padding: '0.75rem 2rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        marginBottom: '1rem',
        border: '1px solid #e7e7e7',
        overflow: 'hidden'
    },
    orderHeader: {
        backgroundColor: '#f8f9fa',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e7e7e7'
    },
    orderHeaderLeft: {
        display: 'flex',
        gap: '2rem'
    },
    orderMeta: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem'
    },
    orderMetaLabel: {
        color: '#888',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '0.5px'
    },
    orderMetaValue: {
        color: '#0f1111',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    orderHeaderRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.2rem'
    },
    orderIdLabel: {
        color: '#888',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '0.5px'
    },
    orderId: {
        color: '#007185',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    orderBody: {
        padding: '1.5rem'
    },
    orderStatus: {
        marginBottom: '1rem'
    },
    statusBadge: {
        display: 'inline-block',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
    },
    deliveredMsg: {
        color: '#007600',
        fontSize: '0.85rem',
        fontWeight: '500'
    },
    shippedMsg: {
        color: '#007185',
        fontSize: '0.85rem',
        fontWeight: '500'
    },
    pendingMsg: {
        color: '#FFA41C',
        fontSize: '0.85rem',
        fontWeight: '500'
    },
    orderDetails: {
        marginBottom: '1.5rem'
    },
    orderProductName: {
        color: '#0f1111',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
    },
    orderDetailText: {
        color: '#555',
        fontSize: '0.9rem',
        marginBottom: '0.3rem'
    },
    progressSection: {
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        paddingTop: '0.5rem'
    },
    progressStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        position: 'relative'
    },
    progressDot: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        zIndex: 1
    },
    progressLabel: {
        fontSize: '0.75rem',
        fontWeight: '600',
        textAlign: 'center'
    },
    progressLine: {
        position: 'absolute',
        top: '15px',
        left: '50%',
        width: '100%',
        height: '2px',
        zIndex: 0
    },
    accountCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        border: '1px solid #e7e7e7'
    },
    accountField: {
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0'
    },
    fieldLabel: {
        display: 'block',
        color: '#888',
        fontSize: '0.8rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
        marginBottom: '0.4rem',
        textTransform: 'uppercase'
    },
    fieldValue: {
        color: '#0f1111',
        fontSize: '1rem',
        fontWeight: '500'
    },
    accountType: {
        backgroundColor: '#e8f5e9',
        color: '#007600',
        padding: '0.3rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    comingSoon: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '2rem',
        border: '1px solid #e7e7e7',
        textAlign: 'center'
    },
    comingSoonIcon: {
        fontSize: '3rem',
        marginBottom: '1rem'
    },
    comingSoonTitle: {
        color: '#1a1a2e',
        marginBottom: '0.5rem'
    },
    comingSoonText: {
        color: '#888',
        fontSize: '0.9rem',
        marginBottom: '1rem'
    },
    savedAddress: {
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1rem',
        textAlign: 'left'
    },
    savedAddressLabel: {
        color: '#888',
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
    },
    savedAddressValue: {
        color: '#0f1111',
        fontSize: '0.9rem'
    },
    paymentsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginTop: '1rem'
    },
    paymentItem: {
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: '#0f1111',
        fontSize: '0.9rem',
        fontWeight: '500',
        textAlign: 'left',
        border: '1px solid #e7e7e7'

    },btn: {
        padding: '0.75rem 2rem',
        backgroundColor: '#1a1a2e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer'
    },          
    cancelBtn: {
        marginTop: '0.75rem',
        padding: '0.5rem 1.25rem',
        backgroundColor: 'white',
        color: '#EF4444',
        border: '1px solid #FEE2E2',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    cancelledText: {
        marginTop: '0.75rem',
        color: '#EF4444',
        fontSize: '0.85rem',
        fontWeight: '600'
    }
}
    



export default Profile