// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProfileBar from "./components/ProfileBar.jsx";
import { useNavigate } from "react-router-dom";
import axios, { clearAuthData } from './utils/auth.jsx';
import "./ProfilePage.css"
import waitt from "./assets/waitt.jpg";

function ProfilePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profilePhoto, setProfilePhoto] = useState("");
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const loadUserData = () => {
            const token = localStorage.getItem("user-token");
            const userId = localStorage.getItem("user-id");
            const email = localStorage.getItem("user-email");
            const firstName = localStorage.getItem("user-firstname");
            const lastName = localStorage.getItem("user-lastname");

            if (!token) {
                navigate("/login");
                return;
            }

            const user = {
                userId,
                email,
                firstName: firstName || "",
                lastName: lastName || "",
                photo: localStorage.getItem("user-photo") || ""
            };

            setUserData(user);
            setEditData(user);
            setProfilePhoto(user.photo);
            setLoading(false);
        };

        loadUserData();
    }, [navigate]);

    const handleSignOut = () => {
        clearAuthData();
        navigate("/login");
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditData({ ...userData, password: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (editData.firstName !== userData.firstName) {
                await axios.put("/api/user/change-firstname", {
                    firstName: editData.firstName
                });
                localStorage.setItem("user-firstname", editData.firstName);

                setUserData(prev => ({
                    ...prev,
                    firstName: editData.firstName
                }));
            }

            if (editData.lastName !== userData.lastName) {
                await axios.put("/api/user/change-lastname", {
                    lastName: editData.lastName
                });
                localStorage.setItem("user-lastname", editData.lastName);

                setUserData(prev => ({
                    ...prev,
                    lastName: editData.lastName
                }));
            }

            if (editData.email !== userData.email) {
                await axios.put("/api/user/change-email", {
                    newEmail: editData.email
                });
                localStorage.setItem("user-email", editData.email);

                setUserData(prev => ({
                    ...prev,
                    email: editData.email
                }));
            }

            if (editData.password?.trim() && userData.password !== editData.password) {
                await axios.put("/api/user/change-password", {
                    newPassword: editData.password.trim()
                });
            }

            if (profilePhoto !== userData.photo) {
                await axios.put("/api/user/change-photo", {
                    photo: profilePhoto
                });
                localStorage.setItem("user-photo", profilePhoto);
                setUserData(prev => ({
                    ...prev,
                    photo: profilePhoto
                }));
            }

            setEditData(prev => ({ ...prev, password: "" }));
            setIsEditing(false);

            if (editData.email !== userData.email) {
                alert("Email changed. Please login again with new email");
                clearAuthData();
                navigate("/login");
            }

        } catch (error) {
            if (error.response?.status === 401) {
                alert("Session expired. Please login again");
                clearAuthData();
                navigate("/login");
            } else {
                alert("Failed to update profile");
            }
        }
    };

    const handleCancel = () => {
        setEditData({ ...userData, password: "" });
        setProfilePhoto(userData.photo);
        setIsEditing(false);
    };

    const calculateDimensions = (width, height, maxWidth = 400, maxHeight = 400) => {
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
        }
        return { width, height };
    };

    const compressImage = (img) => {
        const canvas = document.createElement('canvas');
        const { width, height } = calculateDimensions(img.width, img.height);

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL('image/jpeg', 0.7);
    };

    const loadImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = reader.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const img = await loadImage(file);
            const compressedDataUrl = compressImage(img);
            setProfilePhoto(compressedDataUrl);
            setEditData((prev) => ({ ...prev, photo: compressedDataUrl }));
        } catch {
            alert('Error processing image');
        }
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
        <div id="profile-container">
            <Navbar />

            <div id="profile-content">
                <ProfileBar
                    className={isMenuOpen ? 'show' : ''}
                    onClose={toggleMenu}
                />

                <div id="profile-button-container">
                    {!isMenuOpen && (
                        <button id="profile-button" type="button" onClick={toggleMenu}>
                            Profile
                        </button>
                    )}
                </div>

                <div className="sign-out-container">
                    <button onClick={handleSignOut} className="sign-out">
                        <span>SIGN OUT</span>
                    </button>
                </div>

                <div id="info-container">
                    <h1 style={{textAlign: 'center'}}>PROFILE INFORMATION</h1>

                    <div id="profile-value">
                        <div id="profile-pic">
                            <div className="profile-picture" style={{
                                backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>
                                {!profilePhoto && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '120px'}}>🐱</div>}
                            </div>

                            {isEditing && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    style={{ marginTop: '10px', fontSize: '12px' }}
                                />
                            )}
                        </div>

                        <div style={{ marginLeft: '20px' }}>
                            <div className="profile-greeting">
                                {isEditing ? (
                                    <div>
                                        <div id="profile-edit-item">
                                            <strong>First name:</strong>
                                            <input
                                                name="firstName"
                                                value={editData.firstName || ""}
                                                onChange={handleChange}
                                                placeholder="Enter first name"
                                            />
                                        </div>

                                        <div id="profile-edit-item">
                                            <strong>Last name:</strong>
                                            <input
                                                name="lastName"
                                                value={editData.lastName || ""}
                                                onChange={handleChange}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="profile-profile-greeting">
                                        <h2>Hello, {userData.firstName ? `${userData.firstName} ${userData.lastName}` : "Amogus"}!</h2>
                                    </div>
                                )}
                            </div>

                            {!isEditing && (
                                <div className="profile-details">
                                    <ul>
                                        <li><strong>First name:</strong> {userData.firstName || "-"}</li>
                                        <li><strong>Last name:</strong> {userData.lastName || "-"}</li>
                                        <li><strong>Email:</strong> {userData.email || "-"}</li>
                                    </ul>
                                </div>
                            )}

                            {isEditing && (
                                <div>
                                    <div id="profile-edit-item">
                                        <strong>Email:</strong>
                                        <input
                                            name="email"
                                            type="email"
                                            value={editData.email || ""}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                        />
                                    </div>

                                    <div id="profile-edit-item">
                                        <strong>New Password:</strong>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter password (optional)"
                                            value={editData.password || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pet-buttons">
                                {isEditing ? (
                                    <>
                                        <button type="button" className="pet-btn pet-btn-save" onClick={handleSave}>
                                            Save
                                        </button>
                                        <button type="button" className="pet-btn pet-btn-cancel" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" className="pet-btn pet-btn-edit" onClick={handleEditToggle}>
                                        Edit
                                    </button>
                                )}
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
