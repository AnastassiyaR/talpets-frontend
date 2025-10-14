import './LoginBlank.css';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";

const LoginBlank = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signIn = async () => {
        setError(null);
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const user = response.data;
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/profile");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Email or password is not correct.");
            }
        }
    };

    return (
        <form className="account-form">
            <div className="login-input-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    className="login-input-field"
                    placeholder="Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="login-input-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className="login-input-field"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="login-button-container">
                <button type="button" className="login-button-group" onClick={signIn}>
                    LOGIN
                </button>
                <Link type="button" className="login-button-group" to="/signup">
                    SIGN UP
                </Link>
            </div>
        </form>

    );
};

export default LoginBlank;
