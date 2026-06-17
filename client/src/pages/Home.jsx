import { useNavigate } from 'react-router-dom'
import BannerSlider from '../components/BannerSlider'

function Home() {
    const navigate = useNavigate()

    const features = [
        { icon: '🔍', title: 'Easy Discovery', desc: 'Browse hundreds of products with powerful search and filters' },
        { icon: '🔒', title: 'Secure Checkout', desc: 'Your payments and personal data are always protected' },
        { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered at lightning speed' },
        { icon: '💎', title: 'Premium Quality', desc: 'Only the best products from verified sellers' }
    ]

    const categories = [
        { name: 'Bracelets', icon: '📿', color: '#D1FAE5' },
        { name: 'Necklaces', icon: '💎', color: '#FEF3C7' },
        { name: 'Earrings', icon: '✨', color: '#DBEAFE' },
        { name: 'Rings', icon: '💍', color: '#FCE7F3' },
        { name: 'Handbags', icon: '👜', color: '#E0E7FF' },
        { name: 'Accessories', icon: '🧣', color: '#FEE2E2' }
    ]

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <div style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroBadge}>New Arrivals Every Week</div>
                    <h1 style={styles.heroTitle}>
                        Shop Smarter with <span style={styles.highlight}>ShopEZ</span>
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Discover thousands of premium fashion accessories at unbeatable prices
                    </p>
                    <div style={styles.heroBtns}>
                        <button style={styles.primaryBtn} onClick={() => navigate('/products')}>
                            Shop Now →
                        </button>
                        <button style={styles.secondaryBtn} onClick={() => navigate('/register')}>
                            Join Free
                        </button>
                    </div>
                    <div style={styles.heroStats}>
                        <div style={styles.stat}>
                            <h3 style={styles.statNum}>500+</h3>
                            <p style={styles.statLabel}>Products</p>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.stat}>
                            <h3 style={styles.statNum}>1000+</h3>
                            <p style={styles.statLabel}>Happy Customers</p>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.stat}>
                            <h3 style={styles.statNum}>50+</h3>
                            <p style={styles.statLabel}>Brands</p>
                        </div>
                    </div>
                </div>
                <div style={styles.heroRight}>
                    <div style={styles.heroCard}>
                        <div style={styles.heroCardInner}>
                            <p style={styles.heroCardLabel}>Today's Deal</p>
                            <h3 style={styles.heroCardTitle}>Up to 50% OFF</h3>
                            <p style={styles.heroCardSub}>On all fashion accessories</p>
                            <button
                                style={styles.heroCardBtn}
                                onClick={() => navigate('/products')}
                            >
                                Grab Deal →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Slider */}
            <BannerSlider />

            {/* Categories */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Shop by Category</h2>
                    <button
                        style={styles.viewAllBtn}
                        onClick={() => navigate('/products')}
                    >
                        View All →
                    </button>
                </div>
                <div style={styles.categoriesGrid}>
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            style={{...styles.categoryCard, backgroundColor: cat.color}}
                            onClick={() => navigate('/products')}
                        >
                            <span style={styles.categoryIcon}>{cat.icon}</span>
                            <p style={styles.categoryName}>{cat.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div style={styles.featuresSection}>
                <h2 style={styles.featuresSectionTitle}>Why Choose ShopEZ?</h2>
                <div style={styles.featuresGrid}>
                    {features.map(feature => (
                        <div key={feature.title} style={styles.featureCard}>
                            <div style={styles.featureIconBox}>
                                <span style={styles.featureIcon}>{feature.icon}</span>
                            </div>
                            <h3 style={styles.featureTitle}>{feature.title}</h3>
                            <p style={styles.featureDesc}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div style={styles.cta}>
                <h2 style={styles.ctaTitle}>Ready to Start Shopping?</h2>
                <p style={styles.ctaSubtitle}>Join thousands of happy customers today</p>
                <button style={styles.ctaBtn} onClick={() => navigate('/register')}>
                    Create Free Account →
                </button>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p style={styles.footerText}>
                    © 2024 ShopEZ. All rights reserved. Built with the MERN Stack.
                </p>
            </div>
        </div>
    )
}

const styles = {
    page: {
        backgroundColor: '#F8F9FA'
    },
    hero: {
        backgroundColor: 'white',
        padding: '4rem 4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        borderBottom: '1px solid #E9ECEF'
    },
    heroContent: {
        flex: 1,
        maxWidth: '600px'
    },
    heroBadge: {
        display: 'inline-block',
        backgroundColor: '#F0FDF4',
        color: '#16A34A',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '700',
        marginBottom: '1rem',
        border: '1px solid #BBF7D0'
    },
    heroTitle: {
        fontSize: '3rem',
        fontWeight: '800',
        color: '#1a1a2e',
        marginBottom: '1rem',
        lineHeight: '1.2'
    },
    highlight: {
        color: '#2ECC71'
    },
    heroSubtitle: {
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '2rem',
        lineHeight: '1.7'
    },
    heroBtns: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
    },
    primaryBtn: {
        padding: '0.9rem 2rem',
        backgroundColor: '#2ECC71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer'
    },
    secondaryBtn: {
        padding: '0.9rem 2rem',
        backgroundColor: 'white',
        color: '#1a1a2e',
        border: '2px solid #E9ECEF',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer'
    },
    heroStats: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    stat: {
        textAlign: 'center'
    },
    statNum: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#2ECC71'
    },
    statLabel: {
        color: '#888',
        fontSize: '0.8rem'
    },
    statDivider: {
        width: '1px',
        height: '30px',
        backgroundColor: '#E9ECEF'
    },
    heroRight: {
        flexShrink: 0
    },
    heroCard: {
        width: '280px',
        background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(46,204,113,0.3)'
    },
    heroCardInner: {
        textAlign: 'center'
    },
    heroCardLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.85rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '0.5rem'
    },
    heroCardTitle: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '0.5rem'
    },
    heroCardSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.9rem',
        marginBottom: '1.5rem'
    },
    heroCardBtn: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'white',
        color: '#2ECC71',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '0.9rem'
    },
    section: {
        padding: '3rem 4rem',
        backgroundColor: 'white',
        marginTop: '1rem'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        color: '#1a1a2e',
        fontSize: '1.5rem',
        fontWeight: '700'
    },
    viewAllBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #2ECC71',
        color: '#2ECC71',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.85rem'
    },
    categoriesGrid: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
    },
    categoryCard: {
        width: '130px',
        height: '130px',
        borderRadius: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid rgba(0,0,0,0.05)'
    },
    categoryIcon: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
    },
    categoryName: {
        fontWeight: '600',
        fontSize: '0.85rem',
        color: '#1a1a2e'
    },
    featuresSection: {
        padding: '3rem 4rem',
        backgroundColor: '#F8F9FA',
        marginTop: '1rem'
    },
    featuresSectionTitle: {
        color: '#1a1a2e',
        fontSize: '1.5rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '2rem'
    },
    featuresGrid: {
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    featureCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        width: '220px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #E9ECEF'
    },
    featureIconBox: {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        backgroundColor: '#F0FDF4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
    },
    featureIcon: {
        fontSize: '1.5rem'
    },
    featureTitle: {
        color: '#1a1a2e',
        fontWeight: '700',
        marginBottom: '0.5rem',
        fontSize: '0.95rem'
    },
    featureDesc: {
        color: '#888',
        fontSize: '0.82rem',
        lineHeight: '1.5'
    },
    cta: {
        backgroundColor: '#2ECC71',
        color: 'white',
        textAlign: 'center',
        padding: '4rem 2rem',
        marginTop: '1rem'
    },
    ctaTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '0.5rem'
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        marginBottom: '1.5rem'
    },
    ctaBtn: {
        padding: '1rem 2.5rem',
        backgroundColor: 'white',
        color: '#2ECC71',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer'
    },
    footer: {
        backgroundColor: '#1a1a2e',
        padding: '1.5rem',
        textAlign: 'center'
    },
    footerText: {
        color: '#888',
        fontSize: '0.85rem'
    }
}

export default Home