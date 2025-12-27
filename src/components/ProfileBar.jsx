// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileBar.css';

// eslint-disable-next-line react/prop-types
const ProfileBar = ({ className, onClose }) => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className={`profile-bar ${className}`}>
            <button id="profile-close-btn" onClick={onClose}>
                ✕ Close
            </button>

            <div className="profile-bar-section">
                <h3>ORDERS</h3>
                <ul>
                    <li>
                        <button
                            onClick={() => handleNavigate('/order-history')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            Order history
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavigate('/track-orders')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            Track orders
                        </button>
                    </li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>WISHLIST</h3>
                <ul>
                    <li>
                        <button
                            onClick={() => handleNavigate('/wishlist')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            View Wishlist
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavigate('/move-to-cart')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            Move to cart
                        </button>
                    </li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>PET PROFILES</h3>
                <ul>
                    <li>
                        <button
                            onClick={() => handleNavigate('/pets')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            View own pets information
                        </button>
                    </li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>PAYMENT METHODS</h3>
                <ul>
                    <li>
                        <button
                            onClick={() => handleNavigate('/manage-payment-methods')}
                            style={{ all: 'unset', cursor: 'pointer' }}
                        >
                            Manage payment methods
                        </button>
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default ProfileBar;
