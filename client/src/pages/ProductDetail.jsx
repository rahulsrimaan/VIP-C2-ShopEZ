import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

// Write Review Component
function WriteReview({ productId, onReviewAdded }) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [hoveredStar, setHoveredStar] = useState(0)
    const { user } = useAuth()

    const submitReview = async (e) => {
        e.preventDefault()
        if (!user) {
            alert('Please login to write a review!')
            return
        }
        try {
            await API.post(`/products/${productId}/review`, {
                rating,
                comment,
                username: user.username
            })
            setComment('')
            setRating(5)
            onReviewAdded()
            alert('Review submitted! ✅')
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review')
        }
    }

    return (
        <div style={reviewStyles.container}>
            <h3 style={reviewStyles.title}>✍️ Write a Review</h3>
            <form onSubmit={submitReview}>
                <div style={reviewStyles.starSelect}>
                    <label style={reviewStyles.label}>Your Rating:</label>
                    <div style={reviewStyles.stars}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                style={{
                                    ...reviewStyles.star,
                                    color: star <= (hoveredStar || rating) ? '#FFA41C' : '#ddd'
                                }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                            >
                                ★
                            </span>
                        ))}
                        <span style={reviewStyles.ratingText}>
                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hoveredStar || rating]}
                        </span>
                    </div>
                </div>
                <div style={reviewStyles.inputGroup}>
                    <label style={reviewStyles.label}>Your Review:</label>
                    <textarea
                        style={reviewStyles.textarea}
                        placeholder="Share your experience with this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                    />
                </div>
                <button style={reviewStyles.submitBtn} type="submit">
                    Submit Review →
                </button>
            </form>
        </div>
    )
}

const reviewStyles = {
    container: {
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #e7e7e7'
    },
    title: {
        color: '#1a1a2e',
        marginBottom: '1rem',
        fontSize: '1.1rem'
    },
    starSelect: { marginBottom: '1rem' },
    label: {
        display: 'block',
        color: '#555',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
    },
    stars: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
    },
    star: {
        fontSize: '2rem',
        cursor: 'pointer',
        transition: 'color 0.1s'
    },
    ratingText: {
        color: '#FFA41C',
        fontWeight: '600',
        fontSize: '0.9rem',
        marginLeft: '0.5rem'
    },
    inputGroup: { marginBottom: '1rem' },
    textarea: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '0.95rem',
        boxSizing: 'border-box',
        resize: 'none',
        fontFamily: 'inherit'
    },
    submitBtn: {
        padding: '0.75rem 2rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer'
    }
}

// Related Products Component
function RelatedProducts({ category, currentId }) {
    const [related, setRelated] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await API.get('/products', { params: { category } })
                setRelated(res.data.filter(p => p._id !== currentId).slice(0, 4))
            } catch (err) { console.log(err) }
        }
        fetchRelated()
    }, [category, currentId])

    if (related.length === 0) return (
        <p style={{ color: '#888', fontSize: '0.9rem' }}>No related products found</p>
    )

    return (
        <div style={relatedStyles.grid}>
            {related.map(product => (
                <div
                    key={product._id}
                    style={relatedStyles.card}
                    onClick={() => navigate(`/products/${product._id}`)}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={relatedStyles.image}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                    />
                    <div style={relatedStyles.info}>
                        <p style={relatedStyles.brand}>{product.brand || 'ShopEZ'}</p>
                        <h3 style={relatedStyles.name}>{product.name}</h3>
                        <div style={relatedStyles.stars}>
                            {'★'.repeat(Math.floor(product.ratings || 4))}
                        </div>
                        <p style={relatedStyles.price}>
                            ₹{Math.round(product.price - (product.price * product.discount / 100))}
                        </p>
                        {product.discount > 0 && (
                            <p style={relatedStyles.discount}>{product.discount}% off</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

const relatedStyles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #e7e7e7',
        transition: 'transform 0.2s'
    },
    image: {
        width: '100%',
        height: '150px',
        objectFit: 'cover'
    },
    info: { padding: '0.75rem' },
    brand: {
        color: '#888',
        fontSize: '0.75rem',
        marginBottom: '0.2rem'
    },
    name: {
        color: '#0f1111',
        fontSize: '0.85rem',
        fontWeight: '500',
        marginBottom: '0.3rem',
        lineHeight: '1.3'
    },
    stars: {
        color: '#FFA41C',
        fontSize: '0.8rem',
        marginBottom: '0.3rem'
    },
    price: {
        fontWeight: '700',
        color: '#0f1111',
        fontSize: '0.95rem'
    },
    discount: {
        color: '#e94560',
        fontSize: '0.75rem',
        fontWeight: '600'
    }
}

// Main ProductDetail Component
function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    const fetchProduct = async () => {
        try {
            const res = await API.get(`/products/${id}`)
            setProduct(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [id])

    const allImages = product ? [product.image, ...(product.images || [])] : []

    const addToCart = async () => {
        try {
            await API.post('/cart/add', {
                productId: product._id,
                productName: product.name,
                price: product.price,
                quantity,
                image: product.image
            })
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
        } catch (err) {
            alert('Please login first!')
            navigate('/login')
        }
    }

    const buyNow = async () => {
        try {
            await API.post('/cart/add', {
                productId: product._id,
                productName: product.name,
                price: product.price,
                quantity,
                image: product.image
            })
            navigate('/cart')
        } catch (err) {
            alert('Please login first!')
            navigate('/login')
        }
    }

    const finalPrice = product
        ? Math.round(product.price - (product.price * product.discount / 100))
        : 0

    if (!product) return (
        <div style={styles.loading}>
            <p>⏳ Loading product...</p>
        </div>
    )

    return (
        <div style={styles.container}>
            {/* Breadcrumb */}
            <div style={styles.breadcrumb}>
                <span style={styles.breadcrumbLink} onClick={() => navigate('/')}>Home</span>
                <span style={styles.breadcrumbSep}> › </span>
                <span style={styles.breadcrumbLink} onClick={() => navigate('/products')}>Products</span>
                <span style={styles.breadcrumbSep}> › </span>
                <span style={styles.breadcrumbCurrent}>{product.name}</span>
            </div>

            {/* Top Section */}
            <div style={styles.topSection}>
                {/* Image Column */}
                <div style={styles.imageColumn}>
                    <div style={styles.thumbnailStrip}>
                        {allImages.map((img, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.thumbnail,
                                    ...(selectedImage === index ? styles.thumbnailActive : {})
                                }}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={img}
                                    alt={`view ${index + 1}`}
                                    style={styles.thumbnailImg}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={styles.mainImageBox}>
                        <img
                            src={allImages[selectedImage]}
                            alt={product.name}
                            style={styles.mainImage}
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                        />
                        {product.discount > 0 && (
                            <div style={styles.discountBadge}>{product.discount}% OFF</div>
                        )}
                    </div>
                </div>

                {/* Info Column */}
                <div style={styles.infoColumn}>
                    <p style={styles.brand}>{product.brand || 'ShopEZ'}</p>
                    <h1 style={styles.productName}>{product.name}</h1>
                    <div style={styles.ratingsRow}>
                        <div style={styles.stars}>
                            {'★'.repeat(Math.floor(product.ratings || 4))}
                            {'☆'.repeat(5 - Math.floor(product.ratings || 4))}
                        </div>
                        <span style={styles.reviewCount}>{product.numReviews || 0} ratings</span>
                    </div>
                    <div style={styles.divider} />
                    <div style={styles.priceSection}>
                        {product.discount > 0 && (
                            <p style={styles.originalPrice}>M.R.P: ₹{product.price}</p>
                        )}
                        <div style={styles.priceRow}>
                            <span style={styles.finalPrice}>₹{finalPrice}</span>
                            {product.discount > 0 && (
                                <span style={styles.discountText}>Save {product.discount}%</span>
                            )}
                        </div>
                        <p style={styles.taxNote}>Inclusive of all taxes</p>
                    </div>
                    <div style={styles.divider} />
                    {product.highlights && product.highlights.length > 0 && (
                        <div style={styles.highlightsSection}>
                            <h3 style={styles.sectionHeading}>Highlights</h3>
                            <ul style={styles.highlightsList}>
                                {product.highlights.map((h, i) => (
                                    <li key={i} style={styles.highlightItem}>✅ {h}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div style={styles.descSection}>
                        <h3 style={styles.sectionHeading}>Description</h3>
                        <p style={styles.description}>{product.description}</p>
                    </div>
                    <div style={styles.metaRow}>
                        <span style={styles.metaLabel}>Category:</span>
                        <span style={styles.metaValue}>{product.category}</span>
                    </div>
                </div>

                {/* Buy Column */}
                <div style={styles.buyColumn}>
                    <div style={styles.buyBoxInner}>
                        <h2 style={styles.buyBoxPrice}>₹{finalPrice}</h2>
                        {product.discount > 0 && (
                            <p style={styles.buyBoxSave}>You save ₹{product.price - finalPrice}</p>
                        )}
                        <div style={styles.deliveryInfo}>
                            <p style={styles.deliveryText}>🚚 FREE Delivery</p>
                            <p style={styles.deliveryDate}>
                                Estimated by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString()}
                            </p>
                        </div>
                        <div style={styles.stockInfo}>
                            {product.stock > 0 ? (
                                <p style={styles.inStock}>✅ In Stock ({product.stock} available)</p>
                            ) : (
                                <p style={styles.outOfStock}>❌ Out of Stock</p>
                            )}
                        </div>
                        <div style={styles.quantitySection}>
                            <label style={styles.quantityLabel}>Quantity:</label>
                            <div style={styles.quantityControl}>
                                <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span style={styles.qtyNum}>{quantity}</span>
                                <button style={styles.qtyBtn} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                            </div>
                        </div>
                        <button style={styles.addToCartBtn} onClick={addToCart} disabled={product.stock === 0}>
                            {addedToCart ? '✅ Added to Cart!' : '🛒 Add to Cart'}
                        </button>
                        <button style={styles.buyNowBtn} onClick={buyNow} disabled={product.stock === 0}>
                            ⚡ Buy Now
                        </button>
                        <div style={styles.secureInfo}>🔒 Secure transaction</div>
                    </div>
                </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>📋 Specifications</h2>
                    <table style={styles.specsTable}>
                        <tbody>
                            {Object.entries(product.specifications).map(([key, value], index) => (
                                <tr key={key} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                    <td style={styles.specKey}>{key}</td>
                                    <td style={styles.specValue}>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Related Products */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}> Related Products</h2>
                <RelatedProducts category={product.category} currentId={product._id} />
            </div>

            {/* Reviews */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>⭐ Customer Reviews</h2>
                <div style={styles.ratingSummary}>
                    <div style={styles.bigRating}>
                        <h1 style={styles.bigRatingNum}>
                            {product.ratings ? product.ratings.toFixed(1) : '0.0'}
                        </h1>
                        <div style={styles.bigStars}>
                            {'★'.repeat(Math.floor(product.ratings || 0))}
                            {'☆'.repeat(5 - Math.floor(product.ratings || 0))}
                        </div>
                        <p style={styles.totalReviews}>{product.numReviews} reviews</p>
                    </div>
                    <div style={styles.ratingBars}>
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = product.reviews?.filter(r => Math.floor(r.rating) === star).length || 0
                            const percent = product.reviews?.length ? (count / product.reviews.length) * 100 : 0
                            return (
                                <div key={star} style={styles.ratingBar}>
                                    <span style={styles.ratingBarLabel}>{star} ★</span>
                                    <div style={styles.ratingBarBg}>
                                        <div style={{ ...styles.ratingBarFill, width: `${percent}%` }} />
                                    </div>
                                    <span style={styles.ratingBarCount}>{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <WriteReview productId={product._id} onReviewAdded={fetchProduct} />
                <div style={styles.reviewsList}>
                    <h3 style={styles.reviewsListTitle}>
                        All Reviews ({product.reviews?.length || 0})
                    </h3>
                    {product.reviews?.length === 0 ? (
                        <p style={styles.noReviews}>No reviews yet. Be the first to review!</p>
                    ) : (
                        product.reviews?.map((review, index) => (
                            <div key={index} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <div style={styles.reviewAvatar}>
                                        {review.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={styles.reviewUsername}>{review.username}</p>
                                        <div style={styles.reviewStars}>
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p style={styles.reviewDate}>
                                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <p style={styles.reviewComment}>{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: '#f0f2f2',
        minHeight: '100vh',
        padding: '1rem 2rem'
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        color: '#666'
    },
    breadcrumb: {
        padding: '0.5rem 0',
        marginBottom: '1rem',
        fontSize: '0.9rem'
    },
    breadcrumbLink: {
        color: '#007185',
        cursor: 'pointer'
    },
    breadcrumbSep: {
        color: '#888',
        margin: '0 0.3rem'
    },
    breadcrumbCurrent: { color: '#555' },
    topSection: {
        display: 'flex',
        gap: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '1.5rem'
    },
    imageColumn: {
        display: 'flex',
        gap: '1rem',
        flexShrink: 0
    },
    thumbnailStrip: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    thumbnail: {
        width: '60px',
        height: '60px',
        borderRadius: '5px',
        border: '2px solid transparent',
        overflow: 'hidden',
        cursor: 'pointer'
    },
    thumbnailActive: {
        border: '2px solid #e94560'
    },
    thumbnailImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    mainImageBox: {
        position: 'relative',
        width: '350px',
        height: '350px'
    },
    mainImage: {
        width: '350px',
        height: '350px',
        objectFit: 'contain',
        borderRadius: '10px'
    },
    discountBadge: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#e94560',
        color: 'white',
        padding: '0.3rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '700'
    },
    infoColumn: {
        flex: 1,
        minWidth: '0'
    },
    brand: {
        color: '#007185',
        fontSize: '0.9rem',
        marginBottom: '0.5rem'
    },
    productName: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#0f1111',
        marginBottom: '0.5rem',
        lineHeight: '1.4'
    },
    ratingsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem'
    },
    stars: {
        color: '#FFA41C',
        fontSize: '1.1rem'
    },
    reviewCount: {
        color: '#007185',
        fontSize: '0.9rem'
    },
    divider: {
        height: '1px',
        backgroundColor: '#e7e7e7',
        margin: '1rem 0'
    },
    priceSection: { marginBottom: '0.5rem' },
    originalPrice: {
        color: '#888',
        fontSize: '0.9rem',
        textDecoration: 'line-through',
        marginBottom: '0.3rem'
    },
    priceRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    finalPrice: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#0f1111'
    },
    discountText: {
        color: '#e94560',
        fontWeight: '600',
        fontSize: '1rem'
    },
    taxNote: {
        color: '#888',
        fontSize: '0.8rem',
        marginTop: '0.3rem'
    },
    highlightsSection: { marginBottom: '1rem' },
    sectionHeading: {
        fontSize: '1rem',
        fontWeight: '700',
        color: '#0f1111',
        marginBottom: '0.5rem'
    },
    highlightsList: {
        listStyle: 'none',
        padding: 0
    },
    highlightItem: {
        color: '#444',
        fontSize: '0.9rem',
        marginBottom: '0.4rem',
        lineHeight: '1.5'
    },
    descSection: { marginBottom: '1rem' },
    description: {
        color: '#444',
        fontSize: '0.95rem',
        lineHeight: '1.7'
    },
    metaRow: {
        display: 'flex',
        gap: '0.5rem',
        fontSize: '0.9rem'
    },
    metaLabel: {
        color: '#888',
        fontWeight: '600'
    },
    metaValue: {
        color: '#444',
        textTransform: 'capitalize'
    },
    buyColumn: {
        width: '280px',
        flexShrink: 0,
        borderLeft: '1px solid #e7e7e7',
        paddingLeft: '1.5rem'
    },
    buyBoxInner: {
        position: 'sticky',
        top: '80px'
    },
    buyBoxPrice: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#0f1111',
        marginBottom: '0.3rem'
    },
    buyBoxSave: {
        color: '#e94560',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        fontWeight: '600'
    },
    deliveryInfo: {
        backgroundColor: '#f0f2f2',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '1rem'
    },
    deliveryText: {
        color: '#007600',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    deliveryDate: {
        color: '#555',
        fontSize: '0.8rem',
        marginTop: '0.2rem'
    },
    stockInfo: { marginBottom: '1rem' },
    inStock: {
        color: '#007600',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    outOfStock: {
        color: '#e94560',
        fontSize: '0.9rem',
        fontWeight: '600'
    },
    quantitySection: { marginBottom: '1rem' },
    quantityLabel: {
        display: 'block',
        color: '#555',
        fontSize: '0.85rem',
        marginBottom: '0.5rem',
        fontWeight: '600'
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        width: 'fit-content'
    },
    qtyBtn: {
        width: '36px',
        height: '36px',
        backgroundColor: '#f0f2f2',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#333'
    },
    qtyNum: {
        width: '40px',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#0f1111'
    },
    addToCartBtn: {
        width: '100%',
        padding: '0.85rem',
        backgroundColor: '#FFD814',
        color: '#0f1111',
        border: 'none',
        borderRadius: '20px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '0.75rem'
    },
    buyNowBtn: {
        width: '100%',
        padding: '0.85rem',
        backgroundColor: '#FF9900',
        color: '#0f1111',
        border: 'none',
        borderRadius: '20px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '1rem'
    },
    secureInfo: {
        textAlign: 'center',
        color: '#555',
        fontSize: '0.8rem'
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
        color: '#1a1a2e',
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid #f0f0f0'
    },
    specsTable: {
        width: '100%',
        borderCollapse: 'collapse',
        borderRadius: '8px',
        overflow: 'hidden'
    },
    specKey: {
        padding: '0.75rem 1rem',
        color: '#555',
        fontWeight: '600',
        fontSize: '0.9rem',
        width: '200px',
        borderBottom: '1px solid #e7e7e7',
        backgroundColor: '#f8f9fa'
    },
    specValue: {
        padding: '0.75rem 1rem',
        color: '#0f1111',
        fontSize: '0.9rem',
        borderBottom: '1px solid #e7e7e7'
    },
    ratingSummary: {
        display: 'flex',
        gap: '3rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
    },
    bigRating: {
        textAlign: 'center',
        minWidth: '120px'
    },
    bigRatingNum: {
        fontSize: '3rem',
        fontWeight: '800',
        color: '#1a1a2e'
    },
    bigStars: {
        color: '#FFA41C',
        fontSize: '1.5rem',
        marginBottom: '0.3rem'
    },
    totalReviews: {
        color: '#888',
        fontSize: '0.85rem'
    },
    ratingBars: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        justifyContent: 'center'
    },
    ratingBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    ratingBarLabel: {
        color: '#FFA41C',
        fontSize: '0.85rem',
        width: '30px',
        flexShrink: 0
    },
    ratingBarBg: {
        flex: 1,
        height: '8px',
        backgroundColor: '#e7e7e7',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#FFA41C',
        borderRadius: '4px'
    },
    ratingBarCount: {
        color: '#888',
        fontSize: '0.8rem',
        width: '20px'
    },
    reviewsList: { marginTop: '1rem' },
    reviewsListTitle: {
        color: '#1a1a2e',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '1rem'
    },
    noReviews: {
        color: '#888',
        textAlign: 'center',
        padding: '2rem'
    },
    reviewCard: {
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem'
    },
    reviewHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.75rem'
    },
    reviewAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e94560',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        flexShrink: 0
    },
    reviewUsername: {
        color: '#0f1111',
        fontWeight: '600',
        fontSize: '0.9rem',
        marginBottom: '0.2rem'
    },
    reviewStars: {
        color: '#FFA41C',
        fontSize: '0.85rem'
    },
    reviewDate: {
        color: '#888',
        fontSize: '0.8rem',
        marginLeft: 'auto'
    },
    reviewComment: {
        color: '#444',
        fontSize: '0.9rem',
        lineHeight: '1.6'
    }
}

export default ProductDetail