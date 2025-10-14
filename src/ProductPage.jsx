// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './ProductPage.css';
import catImg from "./assets/cat_product.jpg";
import like from "./assets/like_img.png";

function ProductPage() {
    // State to control visibility of the notification
    const [notification, setNotification] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);

    // Function to handle button click and show the notification
    const showNotification = (action) => {
        setNotification(`${action}`);

        // Hide the notification after 2 seconds
        setTimeout(() => {
            setNotification('');
        }, 2000);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    return (
        <div className="productpage-container">
            <Navbar />
            <div className="product-container">
                <div className="product-image">
                    <img src={catImg} alt="Collar" className="product-text" />
                </div>

                <div className='information-container'>
                    <div className="product-details">
                        <h1>HARNESS FOR KITTENS</h1>
                        <p>
                            Introducing our premium Cat Harness—designed for comfort and security. Made from
                            breathable, lightweight materials, it ensures your cat's comfort during walks.
                            Adjustable straps provide a perfect fit, and quick-release buckles make it easy
                            to put on and take off. With a sturdy D-ring for leash attachment, your cat stays
                            secure. Available in various colors and patterns, our harness combines functionality
                            with style. Give your cat the freedom to explore safely!
                        </p>
                        <div className="product-price">
                            <strong>15.00 €</strong>
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
                            <button
                                className="add-to-cart"
                                onClick={() => showNotification('Added to Cart')}
                            >
                                ADD TO CART
                            </button>
                            <div
                                className="add-to-wishlist-container"
                                onClick={() => showNotification('Added to Wishlist')}
                            >
                                <img src={like} alt="Like icon" className="like_icon" />
                                <span className="add-to-wishlist">ADD TO WISHLIST</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Popup */}
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default ProductPage;
