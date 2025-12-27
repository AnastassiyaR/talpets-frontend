import 'react';
import './ShopBar.css';

const FILTERS = {
    size: ['XS', 'S', 'M', 'L', 'XL'],
    pet: ['DOG', 'CAT', 'RODENTS'],
    color: ['Blue', 'Yellow', 'Purple', 'Pink', 'Black']
};

// eslint-disable-next-line react/prop-types
const ShopBar = ({ className, onFilterChange, onSearchChange, onClose }) => {
    const handleChange = (filterType, value) => {
        onFilterChange(filterType, value);
    };

    return (
        <div className={`shop-bar ${className}`}>
            <button id="close-btn" onClick={onClose}>
                Close filter
            </button>

            <div id="search-section">
                <input
                    type="text"
                    placeholder="Search products..."
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {Object.entries(FILTERS).map(([filterType, options]) => (
                <div key={filterType} id="filter-section">
                    <h3>{filterType.toUpperCase()}</h3>
                    {options.map(option => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                value={option}
                                onChange={e => handleChange(filterType, option)}
                                className="filter-checkbox"
                            />
                            {option}
                        </label>

                    ))}
                </div>
            ))}
        </div>
    );
};

export default ShopBar;
