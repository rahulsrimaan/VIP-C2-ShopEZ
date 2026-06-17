import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function BannerSlider() {
    const [banners, setBanners] = useState([])
    const [current, setCurrent] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        fetchBanners()
    }, [])

    useEffect(() => {
        if (banners.length <= 1) return
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [banners])

    const fetchBanners = async () => {
        try {
            const res = await API.get('/admin/banners')
            setBanners(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    if (banners.length === 0) return null

    return (
        <div style={styles.container}>
            {/* Main Banner */}
            <div
                style={{
                    ...styles.banner,
                    backgroundColor: banners[current]?.bgColor || '#1a1a2e'
                }}
            >
                <div style={styles.bannerContent}>
                    <div style={styles.bannerText}>
                        <p style={styles.bannerSubtitle}>{banners[current]?.subtitle}</p>
                        <h2 style={styles.bannerTitle}>{banners[current]?.title}</h2>
                        <button
                            style={styles.bannerBtn}
                            onClick={() => navigate(banners[current]?.link || '/products')}
                        >
                            Shop Now →
                        </button>
                    </div>
                    <img
                        src={banners[current]?.image}
                        alt={banners[current]?.title}
                        style={styles.bannerImage}
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>

                {/* Dots */}
                <div style={styles.dots}>
                    {banners.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.dot,
                                ...(i === current ? styles.dotActive : {})
                            }}
                            onClick={() => setCurrent(i)}
                        />
                    ))}
                </div>

                {/* Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            style={{...styles.arrow, left: '1rem'}}
                            onClick={() => setCurrent(prev => (prev - 1 + banners.length) % banners.length)}
                        >
                            ‹
                        </button>
                        <button
                            style={{...styles.arrow, right: '1rem'}}
                            onClick={() => setCurrent(prev => (prev + 1) % banners.length)}
                        >
                            ›
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        width: '100%'
    },
    banner: {
        position: 'relative',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'background-color 0.5s ease'
    },
    bannerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '2rem 4rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    bannerText: {
        flex: 1,
        zIndex: 1
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '1rem',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
    },
    bannerTitle: {
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '1.5rem',
        lineHeight: '1.2'
    },
    bannerBtn: {
        padding: '0.85rem 2rem',
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer'
    },
    bannerImage: {
        width: '300px',
        height: '250px',
        objectFit: 'contain',
        borderRadius: '10px'
    },
    dots: {
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    dotActive: {
        backgroundColor: 'white',
        width: '24px',
        borderRadius: '4px'
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

export default BannerSlider