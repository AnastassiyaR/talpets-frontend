// eslint-disable-next-line no-unused-vars
import React from 'react';
import LoginBlank from './components/LoginBlank.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './Login.css';
import tuhkur from '/src/assets/Keili tuhkur.png';

const Login = () => {
    return (
        <div className="login-container">
            <div className="background">
                <Navbar />
                <h1 className="login-title">Log into the account</h1>
                <LoginBlank />
                <div>
                    <img src={tuhkur} className="tuhkur-image1" />
                    <img src={tuhkur} className="tuhkur-image2" />
                </div>
            </div>
            <Footer />
        </div>
    );
}


export default Login;