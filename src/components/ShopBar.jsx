// eslint-disable-next-line no-unused-vars
import React from 'react';
import './ShopBar.css';

const ShopBar = ({ className, onFilterChange }) => {
    const handleCheckboxChange = (event, filterType) => {
        const { value } = event.target;
        onFilterChange(filterType, value);
    };

    return (
        <div className={`shop-bar ${className}`}>
            {/* Section for SIZE */}
            <div className="filter-section">
                <h3>SIZE</h3>
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <label key={size}>
                        <input type="checkbox" value={size} onChange={e => handleCheckboxChange(e, 'size')} /> {size}
                    </label>
                ))}
            </div>

            {/* Section for PET */}
            <div className="filter-section">
                <h3>PET</h3>
                {['Dog', 'Cat', 'Rodents'].map(pet => (
                    <label key={pet}>
                        <input type="checkbox" value={pet} onChange={e => handleCheckboxChange(e, 'pet')} /> {pet}
                    </label>
                ))}
            </div>

            {/* Section for COLOR */}
            <div className="filter-section">
                <h3>COLOR</h3>
                {['Blue', 'Yellow', 'Purple', 'Pink', 'Black'].map(color => (
                    <label key={color}>
                        <input type="checkbox" value={color} onChange={e => handleCheckboxChange(e, 'color')} /> {color}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ShopBar;