import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './auth.jsx';
import LoginPage from '../LoginPage.jsx';
import SignupPage from '../SignupPage.jsx';
import MainPage from '../MainPage.jsx';
import ProfilePage from '../ProfilePage.jsx';
import PaymentPage from '../PaymentPage.jsx';
import ShopPage from '../ShopPage.jsx';
import ProductPage from '../ProductPage.jsx';
import CartPage from '../CartPage.jsx';
import WishlistPage from "../WishlistPage.jsx";
import ManagePaymentMethods from "../ManagePaymentMethods.jsx";
import OrderHistory from "../OrderHistory.jsx";
import PetProfilePage from "../PetProfile.jsx";
import AdminPage from "../AdminPage.jsx"

// eslint-disable-next-line react-refresh/only-export-components
function AppWrapper() {
    useEffect(() => {
        const token = localStorage.getItem("user-token");
        if (token) {
            console.log("Token restored from localStorage");
        } else {
            console.log("No token found in localStorage");
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/productpage/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/manage-payment-methods" element={<ManagePaymentMethods />} />
                <Route path="/pets" element={<PetProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>,
);
