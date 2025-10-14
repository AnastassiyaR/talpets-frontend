import './SignupBlank.css';
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function SignupBlank() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signUp = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/signup",
                { email, password, firstName, lastName },
                { headers: { "Content-Type": "application/json" } }
            );

            localStorage.setItem("user", JSON.stringify(response.data));

            // To profile page
            navigate("/profile");
        } catch {
            setError("Something went wrong...");
        }
    };

    return (
        <form className="account-form">
            <div id="input-row">
                <div id="firstname-container">
                    <label id="label">First name</label>
                    <input
                        type="text"
                        className="name-input-field"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div id="lastname-container">
                    <label id="label">Last name</label>
                    <input
                        type="text"
                        className="name-input-field"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>

            <div id="input-column">
                <div id="email-container">
                    <label id="label">Email</label>
                    <input
                        type="email"
                        id="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div id="password-container">
                    <label id="label">Password</label>
                    <input
                        type="password"
                        id="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

                {error && <div className="error-message">{error}</div>}

                <div className="signup-button-container">
                    <Link type="button" className="haveacc-button-group" to="/login">
                        HAVE ACCOUNT?
                    </Link>
                    <button type="button" className="signup-button-group" onClick={signUp}>
                        SIGN UP
                    </button>
                </div>
        </form>
    );
}

export default SignupBlank;
