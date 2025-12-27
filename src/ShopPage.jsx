import './ShopPage.css';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ShopBar from './components/ShopBar.jsx';
import { Link } from "react-router-dom";
import axios from './utils/auth.jsx';

axios.defaults.withCredentials = true;

import imageMap from "./utils/imageMap.js"

function Shop() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filters, setFilters] = useState({ size: [], pet: [], color: [] });
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 800);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchProducts();
    }, [filters, debouncedSearch]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.size.length) params.size = filters.size.join(',');
            if (filters.pet.length) params.pet = filters.pet.join(',');
            if (filters.color.length) params.color = filters.color.join(',');
            if (debouncedSearch) params.search = debouncedSearch;

            const response = await axios.get('/api/products/filter', { params });
            setItems(response.data);
            setError(null);
        } catch {
            setError('Unable to load, please try later.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleFilterChange = (type, value) => {
        setFilters(prev => {
            const updated = prev[type].includes(value)
                ? prev[type].filter(v => v !== value)
                : [...prev[type], value];
            return { ...prev, [type]: updated };
        });
    };

    const getImage = (name) => {
        if (!name) return null;
        if (name.includes('/')) return name;
        return imageMap[name] || null;
    };

    return (
        <div id="shop-container">
            <Navbar className="shop-navbar" />

            <div id="shop-content">
                <ShopBar
                    id="shop-bar"
                    className={isMenuOpen ? 'show' : ''}
                    onFilterChange={handleFilterChange}
                    onSearchChange={setSearchQuery}
                    onClose={toggleMenu}
                />

                <div id="shop-button-container">
                    {!isMenuOpen && (
                        <button id="shop-button" type="button" onClick={toggleMenu}>
                            Filter
                        </button>
                    )}
                </div>

                {loading && <div id="loading-message">Loading of products...</div>}
                {error && <div id="error-message">{error}</div>}

                {!loading && !error && (
                    <div id="products-container" className={isMenuOpen ? 'show' : ''}>
                        {items.length === 0 ? (
                            <div id="no-products">Products are not found</div>
                        ) : items.map(item => (
                            <div key={item.id} id={`product-${item.id}`} className="product-item">
                                <Link id={`product-link-${item.id}`} to={`/productpage/${item.id}`}>
                                    <img id={`product-img-${item.id}`} src={getImage(item.img)} alt={item.name}/>
                                    <p id={`product-name-${item.id}`}>{item.name}</p>
                                    {item.price && <p id={`product-price-${item.id}`}>${item.price}</p>}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Shop;
