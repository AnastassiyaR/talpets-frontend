// eslint-disable-next-line no-unused-vars
import React from 'react';
import SignupBlank from './components/SignupBlank.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './Signup.css';
import annemari from "/src/assets/Annemari.svg";

function Signup() {
    return (
        <div className="signup-container">
            <div className="background">
                <Navbar/>
                <h1 className="signup-input-group">Become our MEOWber</h1>
                <SignupBlank/>
                <img src={annemari} alt="Annemari image" className="annemari-image"/>
            </div>
            <Footer/>
        </div>
    );
}

export default Signup;