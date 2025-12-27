// eslint-disable-next-line no-unused-vars
import React from 'react';
import LoginBlank from './components/LoginBlank.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './LoginPage.css';
import tuhkur from './assets/Keili tuhkur.png';

const LoginPage = () => {
    return (
        <div id="login-container">
            <div id="login-background">
                <Navbar />

                <h1 id="login-title">Log into the account</h1>

                <LoginBlank id="login-form" />

                <div id="tuhkur-wrapper">
                    <img src={tuhkur} id="tuhkur-image1" alt="" aria-hidden="true" />
                    <img src={tuhkur} id="tuhkur-image2" alt="" aria-hidden="true" />
                </div>
            </div>

            <Footer id="footer" />
        </div>
    );
}

export default LoginPage;
