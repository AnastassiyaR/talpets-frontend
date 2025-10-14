// eslint-disable-next-line no-unused-vars
import React from 'react';
import './ProfileBar.css';

const ProfileBar = ({ className }) => {
    return (
        <div className={`profile-bar ${className}`}>
            <div className="profile-bar-section">
                <h3>ORDERS</h3>
                <ul>
                    <li>Order history</li>
                    <li>Track orders</li>
                    <li>Reorder</li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>WISHLIST</h3>
                <ul>
                    <li>View Wishlist</li>
                    <li>Add to Wishlist</li>
                    <li>Move to cart</li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>PET PROFILES</h3>
                <ul>
                    <li>Add/edit pet information</li>
                    <li>Pet medical records</li>
                </ul>
            </div>

            <div className="profile-bar-section">
                <h3>PAYMENT METHODS</h3>
                <ul>
                    <li>Manage payment methods</li>
                    <li>Add new card</li>
                </ul>
            </div>
        </div>
    );
};

export default ProfileBar;
