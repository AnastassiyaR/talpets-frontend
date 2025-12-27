import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import "./CartPage.css";
import axios from './utils/auth.jsx';
import imageMap from "./utils/imageMap.js"

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    // useEffect(() => {
    //     document.body.style.backgroundColor = "#ffffff";
    //     return () => {
    //         document.body.style.backgroundColor = null;
    //     };
    // }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            setCartItems(response.data);
            setError(null);
        } catch {
            alert('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        try {
            await axios.put(`api/cart/items/${cartId}`, null, {
                params: { quantity: newQuantity }
            });
            await fetchCart();
        } catch {
            alert('Error updating quantity');
        }
    };

    const removeItem = async (cartId) => {
        try {
            await axios.delete(`api/cart/items/${cartId}`);
            await fetchCart();
        } catch {
            alert('Error removing item');
        }
    };

    const handleCheckout = () => {
        navigate("/payment");
    };

    const getImage = (imgName) => {
        if (imgName?.includes('/')) {
            return imgName;
        }
        return imageMap[imgName] || null;
    };

    const total = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    if (loading) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="cart-content">
                    <p className="loading-message">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="cart-content">
                    <p className="error-message">{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Navbar />

            <div className="cart-content">
                <h2 className="cart-title">Your Shopping Cart</h2>

                {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty 😿</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={getImage(item.productImage)}
                                        alt={item.productName}
                                        className="cart-item-img"
                                    />
                                    <div className="cart-item-details">
                                        <h3>{item.productName}</h3>
                                        <p>€{item.price.toFixed(2)}</p>
                                        <p className="item-size">Size: {item.selectedSize}</p>
                                        <div className="cart-item-quantity">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-total">
                                        €{item.totalPrice.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Total: €{total.toFixed(2)}</h3>
                            <button
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                                className="checkout-btn"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CartPage;
