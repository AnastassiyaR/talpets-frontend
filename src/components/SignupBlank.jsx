import './SignupBlank.css';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { saveAuthData } from '../utils/auth.jsx';

function SignupBlank() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signUp = async () => {
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post("/api/auth/signup", {
                email,
                password,
                firstName,
                lastName
            });

            saveAuthData(response.data);
            navigate("/profile");

        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("SignupPage failed. Please try again.");
            }
        }
    };

    return (
        <form id="account-form">

            <div id="row-signup">
                <div id="firstname-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                        id="firstName"
                        type="text"
                        className="name-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div id="lastname-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        id="lastName"
                        type="text"
                        className="name-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>

            <div id="column">
                <div id="email-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div id="password-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div id="confirmPassword-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && <div id="error-message">{error}</div>}

            <div id="actions">
                <Link id="haveacc-btn" to="/login">
                    HAVE ACCOUNT?
                </Link>

                <button id="signup-btn2" type="button" onClick={signUp}>
                    SIGN UP
                </button>
            </div>

        </form>
    );
}

export default SignupBlank;
