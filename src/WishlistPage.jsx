import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import axios from './utils/auth.jsx';
import imageMap from "./utils/imageMap.js"

function WishlistPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/wishlist`);
            setItems(response.data);
            setError(null);
        } catch {
            setError("Error loading wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await axios.delete(`/api/wishlist/remove/${productId}`);
            setItems(items.filter(i => i.productId !== productId));
        } catch {
            alert("Error removing from wishlist");
        }
    };

    const getImage = (imgName) => {
        if (imgName?.includes('/')) {
            return imgName;
        }
        return imageMap[imgName] || null;
    };

    if (loading) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="cart-content">
                    <p className="loading-message">Loading wishlist...</p>
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
                <h2 className="cart-title">Your Wishlist</h2>

                {items.length === 0 ? (
                    <p className="empty-cart">Your wishlist is empty 🖤</p>
                ) : (
                    <div className="cart-items">
                        {items.map(prod => (
                            <div key={prod.id} className="cart-item">
                                <img
                                    src={getImage(prod.img)}
                                    alt={prod.name}
                                    className="cart-item-img"
                                />
                                <div className="cart-item-details">
                                    <h3>{prod.name}</h3>
                                    <p>€{prod.price}</p>
                                    <p className="item-size">Size: {prod.size}</p>
                                    <p className="item-color">Color: {prod.color}</p>

                                    <div className="cart-item-quantity">
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(prod.productId)}
                                        >
                                            Remove
                                        </button>

                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/productpage/${prod.productId}`)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default WishlistPage;
