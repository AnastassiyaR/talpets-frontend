import { useState, useEffect } from "react";
import axios from '../utils/auth.jsx';
import like from "../assets/like_img.png";


// eslint-disable-next-line react/prop-types
function WishlistButton({ productId }) {
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        checkWishlistStatus();
    }, [productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await axios.get(`/api/wishlist/check/${productId}`);
            setInWishlist(response.data);
        } catch {
            console.error("Error checking wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        try {
            if (inWishlist) {
                await axios.delete(`/api/wishlist/remove/${productId}`);
                setInWishlist(false);
            } else {
                await axios.post(`/api/wishlist/add/${productId}`);
                setInWishlist(true);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("You are not authorized!");
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("Wishlist error");
            }
        }
    };

    if (loading) {
        return null;
    }

    return (
        <button
            type="button"
            style={{
                padding: '15px 40px',
                background: inWishlist ? '#f1a469' : '#ffb637',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s ease, transform 0.1s ease',
                fontFamily: "'Verdana', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
            }}
            onClick={handleToggle}
        >
            <img
                src={like}
                alt="Wishlist status"
                className="like_icon"
                style={{
                    filter: inWishlist
                        ? "brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)"
                        : "none"
                }}
            />
            <span>{inWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}</span>
        </button>

    );
}

export default WishlistButton;
