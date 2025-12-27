import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProfileBar from './components/ProfileBar.jsx';
import './OrderHistory.css';
import axios from './utils/auth.jsx';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch {
            alert('Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderDetails = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: '#FFA500',
            PROCESSING: '#2196F3',
            SHIPPED: '#9C27B0',
            DELIVERED: '#4CAF50',
            CANCELLED: '#F44336'
        };
        return colors[status] || '#666';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div id="page-container">
            <Navbar />
            <div id="content-wrapper">
                <ProfileBar />

                <div id="main-content">
                    {loading ? (
                        <div className="loading-message">Loading orders...</div>
                    ) : (
                        <>
                            <h2>Order History</h2>

                            {orders.length === 0 ? (
                                <div id="empty-state">
                                    <p>You haven&apos;t placed any orders yet.</p>
                                    <button onClick={() => navigate('/mainpage')} className="shop-now-btn">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order.id} className="order-card">
                                            <div
                                                className="order-header"
                                                onClick={() => toggleOrderDetails(order.id)}
                                            >
                                                <div className="order-info">
                                                    <h3>Order #{order.orderNumber}</h3>
                                                    <p className="order-date">{formatDate(order.createdAt)}</p>
                                                </div>
                                                <div className="order-summary">
                                                    <span
                                                        className="order-status"
                                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                    <span className="order-total">
                                                        ${order.totalAmount.toFixed(2)}
                                                    </span>
                                                    <span id="expand-icon">
                                                        {expandedOrder === order.id ? '▲' : '▼'}
                                                    </span>
                                                </div>
                                            </div>

                                            {expandedOrder === order.id && (
                                                <div className="order-details">
                                                    <div className="payment-info">
                                                        <p><strong>Payment Method:</strong> Card ending in {order.paymentCardLastFour}</p>
                                                    </div>

                                                    <div className="order-items">
                                                        <h4>Items:</h4>
                                                        {order.items.map(item => (
                                                            <div key={item.id} className="order-item">
                                                                <img
                                                                    src={item.productImage || '/placeholder.png'}
                                                                    alt={item.productName}
                                                                    className="item-image"
                                                                />
                                                                <div className="item-details">
                                                                    <h5>{item.productName}</h5>
                                                                    {item.selectedSize && (
                                                                        <p className="item-size">Size: {item.selectedSize}</p>
                                                                    )}
                                                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                                                </div>
                                                                <div className="item-price">
                                                                    <p className="unit-price">${item.price.toFixed(2)} each</p>
                                                                    <p className="subtotal">${item.subtotal.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="order-total-section">
                                                        <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderHistory;
