// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProfileBar from './components/ProfileBar.jsx';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import waitt from './assets/waitt.jpg';

function ProfilePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
        setLoading(false);
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="loading-container">
                <img src={waitt} alt="Loading" className="loading" />
                <span>Please wait, thank you!</span>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="profilepage-container">
            <Navbar />
            <div className="profile-content">
                <ProfileBar className={isMenuOpen ? 'show' : ''} />
                <div className="profile-button-container">
                    <button type="button" className="profile-button" onClick={toggleMenu}>
                        {isMenuOpen ? 'Close Profile' : 'Profile'}
                    </button>
                </div>

                <div className="sign-out-container">
                    <button onClick={handleSignOut} className="sign-out">
                        <span>SIGN OUT</span>
                    </button>
                </div>

                <div className='info-container'>
                    <div className="profile-header">
                        <div className="header-text">
                            <div className="information">PROFILE<br/>INFORMATION</div>
                            <div className="quote-image"></div>
                        </div>
                    </div>

                    <div className="profile-value">
                        <div className="profile-picture"></div>
                        <div className="profile-info">
                            <div className="profile-text">
                                {Object.entries(userData).map(([key, value]) => (
                                    <div key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProfilePage;
