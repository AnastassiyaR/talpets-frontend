import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import MainPage from './MainPage.jsx'
import ProfilePage from './ProfilePage.jsx'
import PaymentPage from './PaymentPage.jsx'
import ShopPage from './ShopPage.jsx'
import ProductPage from './ProductPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/productpage" element={<ProductPage />} />
      </Routes>
    </Router>
  </StrictMode>,
);