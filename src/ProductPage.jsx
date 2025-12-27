import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './ProductPage.css';
import WishlistButton from './components/WishlistButton.jsx';
import CommentsSection from './components/CommentsSection.jsx';
import axios from './utils/auth.jsx';
import imageMap from "./utils/imageMap.js"

function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`);
                const data = response.data;
                setProduct(data);
                setSelectedSize(data.size);
                setError(null);
            } catch {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const showNotification = (action) => {
        setNotification(action);
        setTimeout(() => setNotification(''), 2000);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const getImage = (imgName) => {
        if (!imgName) return null;
        if (imgName.includes('/')) return imgName;
        return imageMap[imgName] || null;
    };

    const addToCart = async () => {
        if (!selectedSize) {
            alert('Please choose size.');
            return;
        }

        try {
            await axios.post('/api/cart/add', {
                productId: product.id,
                quantity: 1,
                selectedSize: selectedSize
            });
            showNotification('Added to CartPage');
        } catch {
            alert('Error adding to cart. Check authorization!');
        }
    };

    return (
        <div className="productpage-container">
            <Navbar />

            {loading && (
                <div className="loading-message">Loading...</div>
            )}

            {error && (
                <div className="error-message">{error}</div>
            )}

            {!loading && !error && product && (
                <>
                    <div className="product-container">
                        <div className="product-image">
                            <img
                                src={getImage(product.img)}
                                alt={product.name}
                                className="product-text"
                            />
                        </div>

                        <div className="information-container">
                            <div className="product-details">
                                <h1>{product.name.toUpperCase()}</h1>
                                <p>
                                    Introducing our premium {product.name}—designed for comfort and security.
                                    Made from breathable, lightweight materials, it ensures your pet&#39;s comfort.
                                    Adjustable straps provide a perfect fit, and quick-release buckles make it easy
                                    to put on and take off. Available in {product.color} color.
                                </p>
                                <div className="product-price">
                                    <strong>{product.price} €</strong>
                                </div>
                                <div className="product-sizes">
                                    <span>SIZE</span>
                                    {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeClick(size)}
                                            className={selectedSize === size ? 'selected' : ''}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <div className="cart-container">
                                    <button className="add-to-cart" onClick={addToCart}>
                                        ADD TO CART
                                    </button>
                                    <WishlistButton productId={product.id} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="comments-wrapper">
                        <CommentsSection productId={product.id} />
                    </div>
                </>
            )}

            {notification && (
                <div className="notification">{notification}</div>
            )}

            <Footer />
        </div>
    );
}

export default ProductPage;
