import 'react';
import SignupBlank from './components/SignupBlank.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './SignupPage.css';
import annemari from "/src/assets/Annemari.svg";

function SignupPage() {
    return (
        <div id="signup-container">
            <div id="signup-background">
                <Navbar />
                <h1 id="signup-title">Become our MEOWber</h1>
                <SignupBlank />
                <img
                    src={annemari}
                    alt="Annemari"
                    id="annemari-image"
                />
            </div>

            <Footer />
        </div>
    );
}

export default SignupPage;
