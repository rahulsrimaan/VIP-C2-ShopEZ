import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function AdminDashboard() {
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [banners, setBanners] = useState([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', price: '', category: '',
        image: '', stock: '', discount: '', brand: '',
        imagesText: '', highlightsText: '',
        material: '', weight: '', dimensions: '', color: '', warranty: ''
    })
    const [newBanner, setNewBanner] = useState({
        title: '', subtitle: '', image: '', link: '/products', bgColor: '#1a1a2e'
    })
    const navigate = useNavigate()
    const admin = JSON.parse(localStorage.getItem('admin'))
    const adminToken = localStorage.getItem('adminToken')

    useEffect(() => {
        if (!adminToken) { navigate('/admin'); return }
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [ordersRes, usersRes, productsRes, bannersRes] = await Promise.all([
                API.get('/admin/orders', { headers: { Authorization: `Bearer ${adminToken}` }}),
                API.get('/admin/users', { headers: { Authorization: `Bearer ${adminToken}` }}),
                API.get('/products'),
                API.get('/admin/banners')
            ])
            setOrders(ordersRes.data)
            setUsers(usersRes.data)
            setProducts(productsRes.data)
            setBanners(bannersRes.data)
        } catch (err) { console.log(err) }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        try {
            const images = newProduct.imagesText
                ? newProduct.imagesText.split(/[\n,]/).map(url => url.trim()).filter(url => url !== '')
                : []
            const highlights = newProduct.highlightsText
                ? newProduct.highlightsText.split('\n').map(h => h.trim()).filter(h => h !== '')
                : []
            const specifications = {}
            if (newProduct.material) specifications['Material'] = newProduct.material
            if (newProduct.weight) specifications['Weight'] = newProduct.weight
            if (newProduct.dimensions) specifications['Dimensions'] = newProduct.dimensions
            if (newProduct.color) specifications['Color'] = newProduct.color
            if (newProduct.warranty) specifications['Warranty'] = newProduct.warranty

            await API.post('/products/add', {
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price),
                category: newProduct.category,
                image: newProduct.image,
                images,
                stock: Number(newProduct.stock),
                discount: Number(newProduct.discount),
                brand: newProduct.brand,
                highlights,
                specifications
            }, { headers: { Authorization: `Bearer ${adminToken}` }})

            alert('Product added successfully!')
            setNewProduct({
                name: '', description: '', price: '', category: '',
                image: '', stock: '', discount: '', brand: '',
                imagesText: '', highlightsText: '',
                material: '', weight: '', dimensions: '', color: '', warranty: ''
            })
            fetchData()
        } catch (err) { alert('Failed to add product') }
    }

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return
        try {
            await API.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${adminToken}` }})
            fetchData()
        } catch (err) { alert('Failed to delete') }
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`/admin/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${adminToken}` }})
            fetchData()
        } catch (err) { console.log(err) }
    }

    const handleAddBanner = async (e) => {
        e.preventDefault()
        try {
            await API.post('/admin/banners', newBanner, { headers: { Authorization: `Bearer ${adminToken}` }})
            alert('Banner added!')
            setNewBanner({ title: '', subtitle: '', image: '', link: '/products', bgColor: '#1a1a2e' })
            fetchData()
        } catch (err) { alert('Failed to add banner') }
    }

    const handleDeleteBanner = async (id) => {
        if (!window.confirm('Delete this banner?')) return
        try {
            await API.delete(`/admin/banners/${id}`, { headers: { Authorization: `Bearer ${adminToken}` }})
            fetchData()
        } catch (err) { alert('Failed to delete banner') }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('admin')
        navigate('/login')
    }

    const totalRevenue = orders.reduce((sum, o) => sum + o.price * o.quantity, 0)
    const pendingOrders = orders.filter(o => o.status === 'Pending').length
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'orders', label: 'Orders' },
        { id: 'products', label: 'Products' },
        { id: 'addProduct', label: 'Add Product' },
        { id: 'banners', label: 'Banners' },
        { id: 'users', label: 'Users' }
    ]

    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return { bg: '#FFF3CD', text: '#856404' }
            case 'Processing': return { bg: '#CCE5FF', text: '#004085' }
            case 'Shipped': return { bg: '#D4EDDA', text: '#155724' }
            case 'Delivered': return { bg: '#D4EDDA', text: '#155724' }
            default: return { bg: '#F8F9FA', text: '#6C757D' }
        }
    }

    return (
        <div style={s.container}>
            {/* Sidebar */}
           <div style={s.sidebar}>
    <div style={s.sidebarScroll}>
        <div style={s.sidebarTop}>
            <div style={s.logoBox}>
                <div style={s.logoIcon}>S</div>
                <div>
                    <h2 style={s.logoText}>ShopEZ</h2>
                    <p style={s.logoSub}>Admin Portal</p>
                </div>
            </div>
            <div style={s.adminInfo}>
                <div style={s.adminAvatar}>
                    {admin?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p style={s.adminName}>{admin?.username}</p>
                    <p style={s.adminRole}>Administrator</p>
                </div>
            </div>
        </div>

        <nav style={s.nav}>
            <p style={s.navLabel}>MAIN MENU</p>
            {navItems.map(item => (
                <button
                    key={item.id}
                    style={{
                        ...s.navBtn,
                        ...(activeTab === item.id ? s.navBtnActive : {})
                    }}
                    onClick={() => setActiveTab(item.id)}
                >
                    <span style={{
                        ...s.navIndicator,
                        ...(activeTab === item.id ? s.navIndicatorActive : {})
                    }} />
                    {item.label}
                    {item.id === 'orders' && pendingOrders > 0 && (
                        <span style={s.navBadge}>{pendingOrders}</span>
                    )}
                </button>
            ))}
        </nav>
    </div>

    <div style={s.logoutWrapper}>
        <button style={s.logoutBtn} onClick={handleLogout}>
            Sign Out
        </button>
    </div>
</div>

            {/* Main */}
            <div style={s.main}>
                {/* Top Bar */}
                <div style={s.topBar}>
                    <div>
                        <h1 style={s.pageTitle}>
                            {navItems.find(n => n.id === activeTab)?.label}
                        </h1>
                        <p style={s.pageDate}>{new Date().toDateString()}</p>
                    </div>
                    <div style={s.topBarRight}>
                        <div style={s.topBarAdmin}>
                            <div style={s.topBarAvatar}>
                                {admin?.username?.charAt(0).toUpperCase()}
                            </div>
                            <span style={s.topBarName}>{admin?.username}</span>
                        </div>
                    </div>
                </div>

                <div style={s.content}>

                    {/* DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div style={s.statsGrid}>
                                {[
                                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, color: '#2ECC71' },
                                    { label: 'Total Orders', value: orders.length, sub: `${pendingOrders} pending`, color: '#3498DB' },
                                    { label: 'Products', value: products.length, sub: 'In catalog', color: '#9B59B6' },
                                    { label: 'Customers', value: users.length, sub: 'Registered', color: '#E67E22' },
                                    { label: 'Delivered', value: deliveredOrders, sub: 'Completed', color: '#1ABC9C' },
                                    { label: 'Pending', value: pendingOrders, sub: 'To process', color: '#E74C3C' },
                                ].map(stat => (
                                    <div key={stat.label} style={s.statCard}>
                                        <div style={{...s.statAccent, backgroundColor: stat.color}} />
                                        <div style={s.statContent}>
                                            <p style={s.statLabel}>{stat.label}</p>
                                            <h2 style={{...s.statValue, color: stat.color}}>{stat.value}</h2>
                                            <p style={s.statSub}>{stat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={s.card}>
                                <h3 style={s.cardTitle}>Recent Orders</h3>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            {['Product', 'Price', 'Qty', 'Payment', 'Status', 'Date'].map(h => (
                                                <th key={h} style={s.th}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order, i) => {
                                            const sc = getStatusColor(order.status)
                                            return (
                                                <tr key={order._id} style={{backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white'}}>
                                                    <td style={s.td}>{order.productName}</td>
                                                    <td style={s.td}>₹{order.price}</td>
                                                    <td style={s.td}>{order.quantity}</td>
                                                    <td style={s.td}>{order.paymentMethod}</td>
                                                    <td style={s.td}>
                                                        <span style={{...s.badge, backgroundColor: sc.bg, color: sc.text}}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td style={s.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ORDERS */}
                    {activeTab === 'orders' && (
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>All Orders ({orders.length})</h3>
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['Product', 'Price', 'Qty', 'Address', 'Payment', 'Status', 'Update'].map(h => (
                                            <th key={h} style={s.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => {
                                        const sc = getStatusColor(order.status)
                                        return (
                                            <tr key={order._id} style={{backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white'}}>
                                                <td style={s.td}>{order.productName}</td>
                                                <td style={s.td}>₹{order.price}</td>
                                                <td style={s.td}>{order.quantity}</td>
                                                <td style={{...s.td, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{order.address}</td>
                                                <td style={s.td}>{order.paymentMethod}</td>
                                                <td style={s.td}>
                                                    <span style={{...s.badge, backgroundColor: sc.bg, color: sc.text}}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td style={s.td}>
                                                    <select
                                                        style={s.select}
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                    >
                                                        <option>Pending</option>
                                                        <option>Processing</option>
                                                        <option>Shipped</option>
                                                        <option>Delivered</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PRODUCTS */}
                    {activeTab === 'products' && (
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>All Products ({products.length})</h3>
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['Image', 'Name', 'Category', 'Price', 'Stock', 'Discount', 'Action'].map(h => (
                                            <th key={h} style={s.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (
                                        <tr key={product._id} style={{backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white'}}>
                                            <td style={s.td}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={s.tableImg}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                                />
                                            </td>
                                            <td style={s.td}>{product.name}</td>
                                            <td style={s.td}>{product.category}</td>
                                            <td style={s.td}>₹{product.price}</td>
                                            <td style={s.td}>
                                                <span style={{
                                                    ...s.badge,
                                                    backgroundColor: product.stock > 10 ? '#D4EDDA' : '#F8D7DA',
                                                    color: product.stock > 10 ? '#155724' : '#721C24'
                                                }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td style={s.td}>{product.discount}%</td>
                                            <td style={s.td}>
                                                <button
                                                    style={s.deleteBtn}
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ADD PRODUCT */}
                    {activeTab === 'addProduct' && (
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>Add New Product</h3>
                            <form onSubmit={handleAddProduct}>
                                <div style={s.formGrid}>
                                    {[
                                        { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Gold Bangle' },
                                        { label: 'Price (₹)', key: 'price', type: 'number', placeholder: 'e.g. 1499' },
                                        { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. bracelets' },
                                        { label: 'Brand', key: 'brand', type: 'text', placeholder: 'e.g. Tanishq' },
                                        { label: 'Stock', key: 'stock', type: 'number', placeholder: 'e.g. 50' },
                                        { label: 'Discount (%)', key: 'discount', type: 'number', placeholder: 'e.g. 10' },
                                    ].map(field => (
                                        <div key={field.key} style={s.formGroup}>
                                            <label style={s.formLabel}>{field.label}</label>
                                            <input
                                                style={s.formInput}
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={newProduct[field.key]}
                                                onChange={(e) => setNewProduct({...newProduct, [field.key]: e.target.value})}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.formLabel}>Main Image URL</label>
                                    <input
                                        style={s.formInput}
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                        required
                                    />
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.formLabel}>Additional Images (one URL per line)</label>
                                    <textarea
                                        style={{...s.formInput, height: '80px', resize: 'none'}}
                                        placeholder="https://image2.jpg&#10;https://image3.jpg"
                                        value={newProduct.imagesText}
                                        onChange={(e) => setNewProduct({...newProduct, imagesText: e.target.value})}
                                    />
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.formLabel}>Highlights (one per line)</label>
                                    <textarea
                                        style={{...s.formInput, height: '80px', resize: 'none'}}
                                        placeholder="100% Pure Gold&#10;Free Shipping&#10;Easy Returns"
                                        value={newProduct.highlightsText}
                                        onChange={(e) => setNewProduct({...newProduct, highlightsText: e.target.value})}
                                    />
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.formLabel}>Specifications</label>
                                    <div style={s.formGrid}>
                                        {[
                                            { label: 'Material', key: 'material', placeholder: 'e.g. 18K Gold' },
                                            { label: 'Weight', key: 'weight', placeholder: 'e.g. 10g' },
                                            { label: 'Dimensions', key: 'dimensions', placeholder: 'e.g. 6cm x 2cm' },
                                            { label: 'Color', key: 'color', placeholder: 'e.g. Gold' },
                                            { label: 'Warranty', key: 'warranty', placeholder: 'e.g. 1 Year' },
                                        ].map(field => (
                                            <div key={field.key} style={s.formGroup}>
                                                <label style={s.formLabel}>{field.label}</label>
                                                <input
                                                    style={s.formInput}
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    value={newProduct[field.key]}
                                                    onChange={(e) => setNewProduct({...newProduct, [field.key]: e.target.value})}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={s.formGroup}>
                                    <label style={s.formLabel}>Description</label>
                                    <textarea
                                        style={{...s.formInput, height: '100px', resize: 'none'}}
                                        placeholder="Enter detailed product description..."
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                        required
                                    />
                                </div>

                                {newProduct.image && (
                                    <div style={s.previewBox}>
                                        <label style={s.formLabel}>Image Preview</label>
                                        <img
                                            src={newProduct.image}
                                            alt="preview"
                                            style={s.previewImg}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}

                                <button style={s.submitBtn} type="submit">
                                    Add Product
                                </button>
                            </form>
                        </div>
                    )}

                    {/* BANNERS */}
                    {activeTab === 'banners' && (
                        <div>
                            <div style={s.card}>
                                <h3 style={s.cardTitle}>Add New Banner</h3>
                                <form onSubmit={handleAddBanner}>
                                    <div style={s.formGrid}>
                                        <div style={s.formGroup}>
                                            <label style={s.formLabel}>Banner Title</label>
                                            <input style={s.formInput} type="text" placeholder="e.g. Summer Sale!" value={newBanner.title} onChange={(e) => setNewBanner({...newBanner, title: e.target.value})} required />
                                        </div>
                                        <div style={s.formGroup}>
                                            <label style={s.formLabel}>Subtitle</label>
                                            <input style={s.formInput} type="text" placeholder="e.g. Up to 50% off" value={newBanner.subtitle} onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})} />
                                        </div>
                                        <div style={s.formGroup}>
                                            <label style={s.formLabel}>Link</label>
                                            <input style={s.formInput} type="text" placeholder="/products" value={newBanner.link} onChange={(e) => setNewBanner({...newBanner, link: e.target.value})} />
                                        </div>
                                        <div style={s.formGroup}>
                                            <label style={s.formLabel}>Background Color</label>
                                            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                                                <input type="color" value={newBanner.bgColor} onChange={(e) => setNewBanner({...newBanner, bgColor: e.target.value})} style={{width:'50px', height:'40px', cursor:'pointer', border:'1px solid #ddd', borderRadius:'6px'}} />
                                                <span style={{color:'#888', fontSize:'0.85rem'}}>{newBanner.bgColor}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={s.formGroup}>
                                        <label style={s.formLabel}>Banner Image URL</label>
                                        <input style={s.formInput} type="text" placeholder="https://images.unsplash.com/..." value={newBanner.image} onChange={(e) => setNewBanner({...newBanner, image: e.target.value})} required />
                                    </div>
                                    {newBanner.image && (
                                        <div style={{...s.previewBox, marginBottom:'1rem'}}>
                                            <label style={s.formLabel}>Preview</label>
                                            <div style={{backgroundColor: newBanner.bgColor, borderRadius:'8px', padding:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                <div>
                                                    <p style={{color:'rgba(255,255,255,0.7)', fontSize:'0.8rem'}}>{newBanner.subtitle}</p>
                                                    <h3 style={{color:'white'}}>{newBanner.title}</h3>
                                                </div>
                                                <img src={newBanner.image} alt="preview" style={{width:'80px', height:'60px', objectFit:'contain', borderRadius:'5px'}} onError={(e) => e.target.style.display='none'} />
                                            </div>
                                        </div>
                                    )}
                                    <button style={s.submitBtn} type="submit">Add Banner</button>
                                </form>
                            </div>

                            <div style={s.card}>
                                <h3 style={s.cardTitle}>Active Banners ({banners.length})</h3>
                                {banners.length === 0 ? (
                                    <p style={{color:'#888', textAlign:'center', padding:'2rem'}}>No banners yet</p>
                                ) : banners.map(banner => (
                                    <div key={banner._id} style={{...s.bannerRow, backgroundColor: banner.bgColor}}>
                                        <img src={banner.image} alt={banner.title} style={{width:'70px', height:'50px', objectFit:'contain', borderRadius:'5px'}} onError={(e) => e.target.style.display='none'} />
                                        <div style={{flex:1}}>
                                            <p style={{color:'rgba(255,255,255,0.7)', fontSize:'0.75rem'}}>{banner.subtitle}</p>
                                            <p style={{color:'white', fontWeight:'600'}}>{banner.title}</p>
                                        </div>
                                        <button style={s.deleteBtn} onClick={() => handleDeleteBanner(banner._id)}>Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* USERS */}
                    {activeTab === 'users' && (
                        <div style={s.card}>
                            <h3 style={s.cardTitle}>All Users ({users.length})</h3>
                            <table style={s.table}>
                                <thead>
                                    <tr>
                                        {['Avatar', 'Username', 'Email', 'Joined'].map(h => (
                                            <th key={h} style={s.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => (
                                        <tr key={user._id} style={{backgroundColor: i % 2 === 0 ? '#FAFAFA' : 'white'}}>
                                            <td style={s.td}>
                                                <div style={s.userAvatar}>
                                                    {user.username?.charAt(0).toUpperCase()}
                                                </div>
                                            </td>
                                            <td style={s.td}>{user.username}</td>
                                            <td style={s.td}>{user.email}</td>
                                            <td style={s.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const s = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        fontFamily: 'Segoe UI, sans-serif'
    },
    sidebar: {
        width: '240px',
        backgroundColor: 'white',
        borderRight: '1px solid #E9ECEF',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        justifyContent: 'space-between'
    },
    sidebarScroll: {
    flex: 1,
    overflowY: 'auto'
},
    sidebarTop: {
        padding: '1.5rem'
    },
    logoBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #E9ECEF'
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '800',
        fontSize: '1.2rem'
    },
    logoText: {
        color: '#1a1a2e',
        fontSize: '1.1rem',
        fontWeight: '800'
    },
    logoSub: {
        color: '#888',
        fontSize: '0.7rem',
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    adminInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#F8F9FA',
        borderRadius: '10px'
    },
    adminAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.9rem',
        flexShrink: 0
    },
    adminName: {
        color: '#1a1a2e',
        fontWeight: '600',
        fontSize: '0.85rem'
    },
    adminRole: {
        color: '#888',
        fontSize: '0.75rem'
    },
    nav: {
    padding: '1rem',
    flex: 1,
    overflowY: 'auto'
},
    navLabel: {
        color: '#aaa',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        marginBottom: '0.75rem',
        paddingLeft: '0.75rem'
    },
    navBtn: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: 'transparent',
        color: '#555',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.25rem',
        transition: 'all 0.15s'
    },
    navBtnActive: {
        backgroundColor: '#F0FDF4',
        color: '#16A34A',
        fontWeight: '600'
    },
    navIndicator: {
        width: '4px',
        height: '16px',
        borderRadius: '2px',
        backgroundColor: 'transparent',
        flexShrink: 0
    },
    navIndicatorActive: {
        backgroundColor: '#2ECC71'
    },
    navBadge: {
        marginLeft: 'auto',
        backgroundColor: '#EF4444',
        color: 'white',
        borderRadius: '10px',
        padding: '0.1rem 0.5rem',
        fontSize: '0.7rem',
        fontWeight: '700'
    },
   logoutBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'white',
    color: '#EF4444',
    border: '1px solid #FEE2E2',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
},
logoutWrapper: {
    padding: '1rem',
    borderTop: '1px solid #E9ECEF',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white'
},
    main: {
        marginLeft: '240px',
        flex: 1
    },
    topBar: {
        backgroundColor: 'white',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #E9ECEF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    pageTitle: {
        color: '#1a1a2e',
        fontSize: '1.3rem',
        fontWeight: '700'
    },
    pageDate: {
        color: '#888',
        fontSize: '0.8rem',
        marginTop: '0.2rem'
    },
    topBarRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    topBarAdmin: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: '#F8F9FA',
        borderRadius: '8px'
    },
    topBarAvatar: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.75rem'
    },
    topBarName: {
        color: '#1a1a2e',
        fontSize: '0.85rem',
        fontWeight: '600'
    },
    content: {
        padding: '1.5rem 2rem'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '1.5rem'
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex'
    },
    statAccent: {
        width: '4px',
        flexShrink: 0
    },
    statContent: {
        padding: '1.25rem'
    },
    statLabel: {
        color: '#888',
        fontSize: '0.8rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.4rem'
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: '800',
        marginBottom: '0.2rem'
    },
    statSub: {
        color: '#aaa',
        fontSize: '0.75rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: '1.5rem'
    },
    cardTitle: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #F0F0F0'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '0.75rem 1rem',
        color: '#888',
        fontSize: '0.75rem',
        fontWeight: '700',
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #F0F0F0'
    },
    td: {
        padding: '0.85rem 1rem',
        color: '#444',
        fontSize: '0.875rem',
        borderBottom: '1px solid #F8F8F8'
    },
    badge: {
        display: 'inline-block',
        padding: '0.25rem 0.65rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },
    select: {
        padding: '0.4rem 0.6rem',
        borderRadius: '6px',
        border: '1px solid #E9ECEF',
        fontSize: '0.8rem',
        color: '#444',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    tableImg: {
        width: '45px',
        height: '45px',
        objectFit: 'cover',
        borderRadius: '6px'
    },
    deleteBtn: {
        padding: '0.4rem 0.85rem',
        backgroundColor: 'white',
        color: '#EF4444',
        border: '1px solid #FEE2E2',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '0.5rem'
    },
    formGroup: {
        marginBottom: '1rem'
    },
    formLabel: {
        display: 'block',
        color: '#555',
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '0.4rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    formInput: {
        width: '100%',
        padding: '0.7rem 0.9rem',
        border: '1px solid #E9ECEF',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#333',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAFA'
    },
    previewBox: {
        marginBottom: '1rem'
    },
    previewImg: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginTop: '0.5rem',
        border: '1px solid #E9ECEF'
    },
    submitBtn: {
        padding: '0.85rem 2rem',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '700',
        cursor: 'pointer'
    },
    bannerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '0.75rem'
    },
    userAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#2ECC71',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '0.8rem'
    }
}

export default AdminDashboard