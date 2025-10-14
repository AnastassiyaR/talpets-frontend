// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './ShopPage.css';
import ShopBar from './components/ShopBar.jsx';
import { Link } from "react-router-dom";
import balls from "./assets/balls.png";
import bow from "./assets/bow.png";
import catoutfit from "./assets/cat's outfit.png";
import catoutfit2 from "./assets/cat's outfit2.png";
import collar from "./assets/collar.png";
import collar2 from "./assets/collar2.png";
import dogoutfit3 from "./assets/dog's outfit3.png";
import dogoutfit2 from "./assets/Dogs’ Outfit2.png";
import dogoutfit from "./assets/Dogs’ Outfit.png";
import foodbowl from "./assets/Foodbowl.png";
import foodbowl2 from "./assets/food bowl2.png";
import rabbitoutfit2 from "./assets/rabbit outfit2.png";
import rabbitoutfit from "./assets/Rabbits’ Outfit.png";
import sunglases from "./assets/sunglases.png";

function Shop() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filters, setFilters] = useState({
        size: [],
        pet: [],
        color: [],
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prevFilters => {
            const currentFilterValues = prevFilters[filterType];
            const newFilterValues = currentFilterValues.includes(value)
                ? currentFilterValues.filter(v => v !== value)
                : [...currentFilterValues, value];

            return { ...prevFilters, [filterType]: newFilterValues };
        });
    };

    const items = [
        { id: 1, name: 'Collar', size: 'M', pet: 'Cat', color: 'Yellow', img: collar },
        { id: 2, name: 'Bow', size: 'S', pet: 'Dog', color: 'Pink', img: bow },
        { id: 3, name: 'Sunglasses', size: 'XS', pet: 'Cat', color: 'Pink', img: sunglases },
        { id: 4, name: 'Balls', size: 'L', pet: 'Dog', color: 'Yellow', img: balls },
        { id: 5, name: 'Collar', size: 'S', pet: 'Cat', color: 'Purple', img: collar2 },
        { id: 6, name: 'Cat\'s outfit', size: 'M', pet: 'Cat', color: 'Pink', img: catoutfit },
        { id: 7, name: 'Cat\'s outfit', size: 'M', pet: 'Cat', color: 'Yellow', img: catoutfit2 },
        { id: 8, name: 'Dog\'s outfit', size: 'L', pet: 'Dog', color: 'Yellow', img: dogoutfit },
        { id: 9, name: 'Dog\'s outfit', size: 'L', pet: 'Dog', color: 'Blue', img: dogoutfit2 },
        { id: 10, name: 'Dog\'s outfit', size: 'L', pet: 'Dog', color: 'Black', img: dogoutfit3 },
        { id: 11, name: 'Rabbit\'s outfit', size: 'S', pet: 'Rodents', color: 'Pink', img: rabbitoutfit },
        { id: 12, name: 'Rabbit\'s outfit', size: 'M', pet: 'Rodents', color: 'Yellow', img: rabbitoutfit2 },
        { id: 13, name: 'Food bowl', size: 'M', pet: 'Cat', color: 'Blue', img: foodbowl },
        { id: 14, name: 'Food bowl', size: 'S', pet: 'Dog', color: 'Yellow', img: foodbowl2 }
    ];

    const filterItems = () => {
        return items.filter(item => {
            const sizeMatch = filters.size.length ? filters.size.includes(item.size) : true;
            const petMatch = filters.pet.length ? filters.pet.includes(item.pet) : true;
            const colorMatch = filters.color.length ? filters.color.includes(item.color) : true;
            return sizeMatch && petMatch && colorMatch;
        });
    };

    const filteredItems = filterItems();

    return (
        <div className="shop-container">
            <Navbar />

            <div className="shop-content">
                <ShopBar className={isMenuOpen ? 'show' : ''} onFilterChange={handleFilterChange} />
                <div className="shop-button-container">
                    <button
                        type="button"
                        className="shop-button"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? 'Close filter' : 'Filter'}
                    </button>
                </div>

                <div className={`profile-column-container ${isMenuOpen ? 'show' : ''}`}>
                    {filteredItems.map(item => (
                        <div key={item.id} className="profile item">
                            <Link to="/productpage" className="profile-link">
                                <img src={item.img} alt={item.name} className="profile-text" />
                                <p>{item.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Shop;