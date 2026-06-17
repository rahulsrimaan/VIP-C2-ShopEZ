import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api/axios'

const CATEGORIES = [
    { id: 'all', label: 'All Products', icon: '🛍️' },
    { id: 'bracelets', label: 'Bracelets', icon: '📿' },
    { id: 'necklaces', label: 'Necklaces', icon: '💎' },
    { id: 'earrings', label: 'Earrings', icon: '✨' },
    { id: 'rings', label: 'Rings', icon: '💍' },
    { id: 'handbags', label: 'Handbags', icon: '👜' },
    { id: 'accessories', label: 'Accessories', icon: '🧣' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
    { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'clothing', label: 'Clothing', icon: '👗' },
    { id: 'footwear', label: 'Footwear', icon: '👟' },
    { id: 'watches', label: 'Watches', icon: '⌚' },
    { id: 'sunglasses', label: 'Sunglasses', icon: '🕶️' },
]

function Products() {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('default')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const cat = searchParams.get('category')
        if (cat) setActiveCategory(cat)
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [activeCategory])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = {}
            if (activeCategory !== 'all') params.category = activeCategory
            if (search) params.search = search
            const res = await API.get('/products', { params })
            setProducts(res.data)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchProducts()
    }

    const getSortedProducts = () => {
        const sorted = [...products]
        if (sortBy === 'price-low') return sorted.sort((a, b) => a.price - b.price)
        if (sortBy === 'price-high') return sorted.sort((a, b) => b.price - a.price)
        if (sortBy === 'discount') return sorted.sort((a, b) => b.discount - a.discount)
        return sorted
    }

    const finalPrice = (product) => {
        return Math.round(product.price - (product.price * product.discount / 100))
    }

    return (
        <div style={styles.container}>
            {/* Top Search Bar */}
            <div style={styles.searchBar}>
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <input
                        style={styles.searchInput}
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button style={styles.searchBtn} type="submit">🔍 Search</button>
                </form>
                <select
                    style={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="default">Sort By</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Best Discount</option>
                </select>
            </div>

            <div style={styles.mainLayout}>
                {/* Sidebar Categories */}
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>Categories</h3>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            style={{
                                ...styles.catBtn,
                                ...(activeCategory === cat.id ? styles.catBtnActive : {})
                            }}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span style={styles.catIcon}>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div style={styles.productsSection}>
                    {/* Results Header */}
                    <div style={styles.resultsHeader}>
                        <h2 style={styles.resultsTitle}>
                            {CATEGORIES.find(c => c.id === activeCategory)?.label}
                        </h2>
                        <p style={styles.resultsCount}>
                            {getSortedProducts().length} products found
                        </p>
                    </div>

                    {loading ? (
                        <div style={styles.loadingBox}>
                            <p style={styles.loadingText}>⏳ Loading products...</p>
                        </div>
                    ) : getSortedProducts().length === 0 ? (
                        <div style={styles.emptyBox}>
                            <p style={styles.emptyIcon}>🔍</p>
                            <h3 style={styles.emptyTitle}>No products found</h3>
                            <p style={styles.emptyText}>Try a different category or search term</p>
                            <button
                                style={styles.resetBtn}
                                onClick={() => { setActiveCategory('all'); setSearch('') }}
                            >
                                View All Products
                            </button>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {getSortedProducts().map(product => (
                                <div
                                    key={product._id}
                                    style={styles.card}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                >
                                    <div style={styles.imageBox}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={styles.image}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                                        />
                                        {product.discount > 0 && (
                                            <div style={styles.discountTag}>
                                                {product.discount}% off
                                            </div>
                                        )}
                                    </div>
                                    <div style={styles.cardInfo}>
                                        <p style={styles.productBrand}>{product.brand || 'ShopEZ'}</p>
                                        <h3 style={styles.productName}>{product.name}</h3>
                                        <div style={styles.stars}>
                                            {'★'.repeat(Math.floor(product.ratings || 4))}
                                            {'☆'.repeat(5 - Math.floor(product.ratings || 4))}
                                            <span style={styles.reviewCount}>({product.numReviews || 0})</span>
                                        </div>
                                        <div style={styles.priceRow}>
                                            <span style={styles.finalPrice}>₹{finalPrice(product)}</span>
                                            {product.discount > 0 && (
                                                <span style={styles.originalPrice}>₹{product.price}</span>
                                            )}
                                        </div>
                                        {product.stock < 10 && product.stock > 0 && (
                                            <p style={styles.lowStock}>Only {product.stock} left!</p>
                                        )}
                                        {product.stock === 0 && (
                                            <p style={styles.outOfStock}>Out of Stock</p>
                                        )}
                                    </div>
                                </div>
                            ))}
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
    searchBar: {
        backgroundColor: '#1a1a2e',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    searchForm: {
        display: 'flex',
        flex: 1,
        gap: '0'
    },
    searchInput: {
        flex: 1,
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: '5px 0 0 5px',
        fontSize: '0.95rem',
        outline: 'none'
    },
    searchBtn: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        fontWeight: '600'
    },
    sortSelect: {
        padding: '0.75rem 1rem',
        borderRadius: '5px',
        border: 'none',
        fontSize: '0.9rem',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    mainLayout: {
        display: 'flex',
        gap: '0'
    },
    sidebar: {
        width: '200px',
        backgroundColor: 'white',
        padding: '1rem',
        minHeight: '100vh',
        borderRight: '1px solid #e7e7e7',
        flexShrink: 0
    },
    sidebarTitle: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #e94560'
    },
    catBtn: {
        width: '100%',
        padding: '0.6rem 0.75rem',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '0.85rem',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.2rem',
        transition: 'all 0.2s'
    },
    catBtnActive: {
        backgroundColor: '#fff0f3',
        color: '#e94560',
        fontWeight: '600'
    },
    catIcon: {
        fontSize: '1rem'
    },
    productsSection: {
        flex: 1,
        padding: '1.5rem'
    },
    resultsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        backgroundColor: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
    },
    resultsTitle: {
        color: '#1a1a2e',
        fontSize: '1.2rem',
        fontWeight: '700'
    },
    resultsCount: {
        color: '#888',
        fontSize: '0.9rem'
    },
    loadingBox: {
        textAlign: 'center',
        padding: '3rem'
    },
    loadingText: {
        color: '#888',
        fontSize: '1.1rem'
    },
    emptyBox: {
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'white',
        borderRadius: '10px'
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem'
    },
    emptyTitle: {
        color: '#1a1a2e',
        fontSize: '1.3rem',
        marginBottom: '0.5rem'
    },
    emptyText: {
        color: '#888',
        marginBottom: '1.5rem'
    },
    resetBtn: {
        padding: '0.75rem 2rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '600'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    imageBox: {
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '180px',
        objectFit: 'cover'
    },
    discountTag: {
        position: 'absolute',
        top: '8px',
        left: '8px',
        backgroundColor: '#e94560',
        color: 'white',
        padding: '0.2rem 0.5rem',
        borderRadius: '3px',
        fontSize: '0.75rem',
        fontWeight: '700'
    },
    cardInfo: {
        padding: '0.75rem'
    },
    productBrand: {
        color: '#888',
        fontSize: '0.75rem',
        marginBottom: '0.2rem'
    },
    productName: {
        color: '#0f1111',
        fontSize: '0.9rem',
        fontWeight: '500',
        marginBottom: '0.3rem',
        lineHeight: '1.3'
    },
    stars: {
        color: '#FFA41C',
        fontSize: '0.8rem',
        marginBottom: '0.4rem'
    },
    reviewCount: {
        color: '#888',
        fontSize: '0.75rem',
        marginLeft: '0.3rem'
    },
    priceRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    finalPrice: {
        fontWeight: '700',
        color: '#0f1111',
        fontSize: '1rem'
    },
    originalPrice: {
        color: '#888',
        fontSize: '0.8rem',
        textDecoration: 'line-through'
    },
    lowStock: {
        color: '#e94560',
        fontSize: '0.75rem',
        marginTop: '0.3rem'
    },
    outOfStock: {
        color: '#888',
        fontSize: '0.75rem',
        marginTop: '0.3rem'
    }
}

export default Products