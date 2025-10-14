// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PaymentBlank from './components/PaymentBlank.jsx';
import './PaymentPage.css';

const Payment = () => {
    const [notification, setNotification] = useState('');
    const navigate = useNavigate();

    const handlePaymentComplete = () => {
        setNotification('Complete');
        setTimeout(() => {
            setNotification('');
            navigate("/mainpage");
        }, 2000);
    };

    return (
        <div className="payment-container">
            <Navbar />
            <div id="content">
                <PaymentBlank />
                <button className="buy-button" onClick={handlePaymentComplete}>BUY</button>
            </div>

            {notification && (
                <div id="notification">
                    {notification}
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Payment;
