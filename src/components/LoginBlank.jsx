import './LoginBlank.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import axios from "axios";
import { saveAuthData } from '../utils/auth.jsx';


const LoginBlank = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signIn = async () => {
        setError(null);
        try {
            const response = await axios.post("/api/auth/login", {
                email,
                password
            });

            saveAuthData(response.data);
            navigate("/profile");

        } catch (err) {
            if (err.response?.status === 401) {
                setError("Email or password is incorrect");
            } else {
                setError(err.response?.data?.message || "LoginPage failed");
            }
        }
    };

    return (
        <form id="login-form">

            <div id="login-input-column">
                <div id="email-container">
                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        type="email"
                        placeholder="Email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div id="password-container">
                    <label htmlFor="password-input">Password</label>
                    <input
                        id="password-input"
                        type="password"
                        placeholder="Password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && <div id="login-error-message">{error}</div>}

            <div id="login-button-container">
                <button id="login-btn" type="button" onClick={signIn}>
                    LOGIN
                </button>
                <Link id="signup-btn" to="/signup">
                    SIGN UP
                </Link>
            </div>

        </form>
    );
};

export default LoginBlank;
