import 'react';
import './Navbar.css';
import logo from '../assets/logo.png';
import cartIcon from '../assets/shoppingcart.svg';
import userIcon from '../assets/account.svg';
import wishlistIcon from '../assets/heart.svg';
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Navbar = ({ className }) => {
    const token = localStorage.getItem("user-token");
    const userLink = token ? "/profile" : "/login";

    return (
        <nav id="navbar-container" className={className}>
            {/* Brand */}
            <ul id="navbar-brand">
                <li id="logo-item">
                    <Link to="/mainpage" id="logo-link">
                        <img src={logo} alt="Logo" id="logo"/>
                        <span id="brand-name">TalPets</span>
                    </Link>
                </li>
            </ul>

            {/* Menu */}
            <ul id="nav-links">
                <li><Link to="/mainpage" id="nav-home">HOME</Link></li>
                <li><Link to="/shop" id="nav-shop">SHOP</Link></li>
            </ul>

            {/* Icons */}
            <div id="navbar-icons">
                <Link to="/cart" id="cart-link">
                    <img src={cartIcon} alt="CartPage" id="cart-icon" />
                </Link>

                <Link to="/wishlist" id="wishlist-link">
                    <img src={wishlistIcon} alt="Wishlist" id="wishlist-icon" />
                </Link>

                <Link to={userLink} id="user-link">
                    <img src={userIcon} alt="User" id="user-icon" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
