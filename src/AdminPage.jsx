import './AdminPage.css';
import {useEffect, useState} from 'react';
import axios from './utils/auth.jsx';
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import imageMap from "./utils/imageMap.js"

axios.defaults.withCredentials = true;

function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const emptyProduct = {
        name: '',
        price: '',
        size: '',
        pet: '',
        color: '',
        img: ''
    };

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (isAuthorized) fetchProducts();
    }, [isAuthorized]);

    const handleLogin = async () => {
        try {
            const res = await axios.get(`api/admin?password=${encodeURIComponent(password)}`);

            if (res.status === 200 && res.data === "Welcome to Admin Panel") {
                setIsAuthorized(true);
                setError("");
            } else {
                setError("Wrong password");
                globalThis.location.href = '/login';
            }
        } catch {
            setError("Wrong password");
            setIsAuthorized(false);
            globalThis.location.href = '/login';
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/products/filter");
            setProducts(response.data);
        } catch {
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const getImage = (name) => {
        if (!name) return null;
        if (name.startsWith('data:image')) return name;
        if (name.includes('/') || name.startsWith('http')) return name;
        return imageMap[name] || null;
    };

    const handleEdit = (product) => {
        setEditingProduct({ ...product });
        setIsAddingNew(false);
        const img = getImage(product.img);
        setImagePreview(img);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const closeView = () => {
        setSelectedProduct(null);
    };

    const handleAddNew = () => {
        setEditingProduct({ ...emptyProduct });
        setIsAddingNew(true);
        setImagePreview(null);
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setIsAddingNew(false);
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const calculateDimensions = (width, height, maxWidth = 800, maxHeight = 800) => {
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

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size should be less than 10MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            const compressedBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const img = new Image();
                    img.onload = () => {
                        try {
                            const compressedDataUrl = compressImage(img);
                            resolve(compressedDataUrl);
                        } catch (error) {
                            reject(error);
                        }
                    };
                    img.onerror = () => reject(new Error('Failed to load image'));
                    img.src = reader.result;
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
            });

            setEditingProduct(prev => ({ ...prev, img: compressedBase64 }));

            alert('Image loaded successfully');
        } catch {
            alert(`Image loading error`);

            if (imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(null);
        }
    };

    const handleInputChange = (field, value) => {
        setEditingProduct({ ...editingProduct, [field]: value });
    };

    const handleSave = async () => {
        try {
            if (!editingProduct.name || !editingProduct.price) {
                alert('Please fill in required fields: name and price');
                return;
            }

            const price = parseFloat(editingProduct.price);
            if (isNaN(price) || price <= 0) {
                alert('Please enter a valid price');
                return;
            }

            const productData = {
                name: editingProduct.name,
                price: price,
                size: editingProduct.size || null,
                pet: editingProduct.pet || null,
                color: editingProduct.color || null,
                img: editingProduct.img || ''
            };

            if (isAddingNew) {
                await axios.post('/api/products', productData);
                alert('Product added successfully');
            } else {
                await axios.put(`/api/products/${editingProduct.id}`, productData);
                alert('Product updated successfully');
            }

            handleCancel();
            await fetchProducts();
        } catch (err) {
            const errorMsg = err.response?.data?.message
                || err.response?.data?.error
                || 'Failed to save product';
            alert(errorMsg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/products/${id}`);
            alert('Product deleted successfully');
            fetchProducts();
        } catch (err) {
            alert('Delete error: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.color?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAuthorized) {
        return (
            <div className="admin-login-container">
                <h2 className="admin-login-title">Enter Admin Password</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-login-input"
                />
                <button onClick={handleLogin} className="admin-login-button">Login</button>
                {error && <div className="admin-login-error">{error}</div>}
            </div>
        );
    }

    return (
        <div className="admin-page-container">
            <Navbar />

            <div className="admin-header">
                <div className="admin-header-content">
                    <h1 className="admin-page-title">Product Management</h1>
                </div>
            </div>

            <div className="admin-content">
                {error && (
                    <div className="admin-message admin-message-error">
                        {error}
                    </div>
                )}

                <div className="admin-actions-bar">
                    <input
                        type="text"
                        placeholder="Search by name, pet or color..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                    />
                    <button onClick={handleAddNew} className="admin-add-button">
                        + Add Product
                    </button>
                </div>

                {editingProduct && (
                    <div className="admin-edit-form">
                        <div className="admin-form-header">
                            <h3 className="admin-form-title">
                                {isAddingNew ? 'New Product' : 'Edit Product'}
                            </h3>
                            <button onClick={handleCancel} className="admin-close-button">
                                ×
                            </button>
                        </div>

                        <div className="admin-form-grid">
                            <div className="admin-form-field">
                                <div className="admin-field-label">Name *</div>
                                <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="admin-field-input"
                                    placeholder="Product name"
                                />
                            </div>
                            <div className="admin-form-field">
                                <div className="admin-field-label">Price *</div>
                                <input
                                    type="text"
                                    value={editingProduct.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    className="admin-field-input"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="admin-form-field">
                                <div className="admin-field-label">Size</div>
                                <select
                                    value={editingProduct.size}
                                    onChange={(e) => handleInputChange('size', e.target.value)}
                                    className="admin-field-select"
                                >
                                    <option value="">Select size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>
                            <div className="admin-form-field">
                                <div className="admin-field-label">Pet</div>
                                <select
                                    value={editingProduct.pet}
                                    onChange={(e) => handleInputChange('pet', e.target.value)}
                                    className="admin-field-select"
                                >
                                    <option value="">Select pet</option>
                                    <option value="DOG">DOG</option>
                                    <option value="CAT">CAT</option>
                                    <option value="RODENTS">RODENTS</option>
                                </select>
                            </div>
                            <div className="admin-form-field admin-form-field-full">
                                <div className="admin-field-label">Color</div>
                                <input
                                    type="text"
                                    value={editingProduct.color}
                                    onChange={(e) => handleInputChange('color', e.target.value)}
                                    className="admin-field-input"
                                    placeholder="e.g., Red, Blue, Black"
                                />
                            </div>
                        </div>

                        <div className="admin-image-section">
                            <div className="admin-field-label">Image</div>
                            <div className="admin-file-input-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="admin-file-input"
                                />
                                <div className="admin-file-hint">
                                    Supports JPEG, PNG, GIF. Max 10MB. Or enter URL/filename below.
                                </div>
                            </div>
                        </div>

                        {imagePreview && (
                            <div className="admin-image-preview-container">
                                <div className="admin-preview-label">Preview:</div>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="admin-image-preview"
                                />
                            </div>
                        )}

                        <div className="admin-form-actions">
                            <button onClick={handleCancel} className="admin-cancel-button">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="admin-save-button">
                                {isAddingNew ? 'Add Product' : 'Update Product'}
                            </button>
                        </div>
                    </div>
                )}

                {selectedProduct && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modalTitle"
                        className="admin-modal-overlay"
                        onClick={closeView}
                    >
                        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="admin-modal-header">
                                <h2 className="admin-modal-title">{selectedProduct.name}</h2>
                                <button onClick={closeView} className="admin-close-button">
                                    ×
                                </button>
                            </div>

                            {getImage(selectedProduct.img) && (
                                <div className="admin-modal-image-container">
                                    <img
                                        src={getImage(selectedProduct.img)}
                                        alt={selectedProduct.name}
                                        className="admin-modal-image"
                                    />
                                </div>
                            )}

                            <div className="admin-modal-details">
                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">ID</span>
                                    <p className="admin-modal-detail-value">{selectedProduct.id}</p>
                                </div>

                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">Price</span>
                                    <p className="admin-modal-detail-price">${selectedProduct.price}</p>
                                </div>

                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">Size</span>
                                    <p className="admin-modal-detail-text">
                                        {selectedProduct.size || 'Not specified'}
                                    </p>
                                </div>

                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">Pet</span>
                                    <p className="admin-modal-detail-text">
                                        {selectedProduct.pet || 'Not specified'}
                                    </p>
                                </div>

                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">Color</span>
                                    <p className="admin-modal-detail-text">
                                        {selectedProduct.color || 'Not specified'}
                                    </p>
                                </div>

                                <div className="admin-modal-detail-item">
                                    <span className="admin-modal-detail-label">Image Source</span>
                                    <p className="admin-modal-detail-code">
                                        {(() => {
                                            if (!selectedProduct.img) return 'No image';
                                            if (selectedProduct.img.length > 100)
                                                return selectedProduct.img.substring(0, 100) + '...';
                                            return selectedProduct.img;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="admin-loading">
                        Loading products...
                    </div>
                ) : (
                    <>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                <tr className="admin-table-header">
                                    <th className="admin-table-header-cell admin-table-header-photo">Photo</th>
                                    <th className="admin-table-header-cell">Name</th>
                                    <th className="admin-table-header-cell admin-table-header-price">Price</th>
                                    <th className="admin-table-header-cell admin-table-header-size">Size</th>
                                    <th className="admin-table-header-cell admin-table-header-pet">Pet</th>
                                    <th className="admin-table-header-cell admin-table-header-color">Color</th>
                                    <th className="admin-table-header-cell admin-table-header-actions">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="admin-table-row">
                                        <td className="admin-table-cell-photo">
                                            {getImage(product.img) ? (
                                                <img
                                                    src={getImage(product.img)}
                                                    alt={product.name}
                                                    className="admin-product-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        if (e.target.nextSibling) {
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                            <div className="admin-product-image-placeholder"
                                                 style={{display: getImage(product.img) ? 'none' : 'flex'}}>
                                                {product.img && !getImage(product.img) ? '❌' : '📷'}
                                            </div>
                                        </td>
                                        <td className="admin-table-cell admin-table-cell-name">{product.name}</td>
                                        <td className="admin-table-cell admin-table-cell-price">${product.price}</td>
                                        <td className="admin-table-cell">{product.size || '-'}</td>
                                        <td className="admin-table-cell">{product.pet || '-'}</td>
                                        <td className="admin-table-cell">{product.color || '-'}</td>
                                        <td className="admin-table-cell admin-table-cell-actions">
                                            <div className="admin-table-actions-group">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    className="admin-view-button"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="admin-edit-button"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="admin-delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="admin-empty-state">
                                <div className="admin-empty-state-title">No products found</div>
                                <div className="admin-empty-state-text">
                                    {searchQuery
                                        ? `No results for "${searchQuery}"`
                                        : 'Add your first product using the "Add Product" button'}
                                </div>
                            </div>
                        )}

                        <div className="admin-footer-info">
                            <span>Showing {filteredProducts.length} of {products.length} products</span>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="admin-clear-search-button"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default AdminPage;
