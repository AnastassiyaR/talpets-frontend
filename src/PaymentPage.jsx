import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './PaymentPage.css';
import axios from './utils/auth.jsx';

const PaymentPage = () => {
    const [notification, setNotification] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showAddCard, setShowAddCard] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false); // ← ДОБАВЛЕНО

    const [newCard, setNewCard] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/payment-cards');
            setCards(response.data);

            // Automatically select default card
            const defaultCard = response.data.find(card => card.isDefault);
            if (defaultCard) {
                setSelectedCard(defaultCard.id);
            }
        } catch {
            alert('Error fetching cards');
        } finally {
            setLoading(false);
        }
    };

    const validateCardNumber = (number) => {
        if (number.length !== 16) {
            return 'Card number must contain 16 digits';
        }
        if (!/^\d+$/.test(number)) {
            return 'Card number must contain only digits';
        }
        return null;
    };

    const validateExpiry = (month, year) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        if (month < 1 || month > 12) {
            return 'Invalid month';
        }
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return 'Card has expired';
        }
        if (year > currentYear + 10) {
            return 'Invalid year';
        }
        return null;
    };

    const validateCVV = (cvv) => {
        if (!/^\d{3,4}$/.test(cvv)) {
            return 'CVV must contain 3-4 digits';
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        // Input restrictions
        if (name === 'cardNumber') {
            newValue = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'expiryMonth') {
            newValue = value.replace(/\D/g, '').slice(0, 2);
        } else if (name === 'expiryYear') {
            newValue = value.replace(/\D/g, '').slice(0, 4);
        } else if (name === 'cvv') {
            newValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setNewCard(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : newValue
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const cardError = validateCardNumber(newCard.cardNumber);
        if (cardError) newErrors.cardNumber = cardError;

        if (!newCard.cardHolderName.trim()) {
            newErrors.cardHolderName = 'Enter cardholder name';
        }

        const expiryError = validateExpiry(
            parseInt(newCard.expiryMonth),
            parseInt(newCard.expiryYear)
        );
        if (expiryError) newErrors.expiry = expiryError;

        const cvvError = validateCVV(newCard.cvv);
        if (cvvError) newErrors.cvv = cvvError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCard = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('/api/payment-cards', {
                cardNumber: newCard.cardNumber,
                cardHolderName: newCard.cardHolderName,
                expiryMonth: parseInt(newCard.expiryMonth),
                expiryYear: parseInt(newCard.expiryYear),
                cvv: newCard.cvv,
                isDefault: newCard.isDefault
            });

            setCards([...cards, response.data]);
            setSelectedCard(response.data.id);
            setShowAddCard(false);

            // Reset form
            setNewCard({
                cardNumber: '',
                cardHolderName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                isDefault: false
            });
            setErrors({});

            showNotification('Card added');
        } catch (err) {
            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert('Error adding card');
            }
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Delete card?')) return;

        try {
            await axios.delete(`/api/payment-cards/${cardId}`);
            setCards(cards.filter(card => card.id !== cardId));

            if (selectedCard === cardId) {
                setSelectedCard(null);
            }

            showNotification('Card deleted');
        } catch {
            alert('Error deleting card');
        }
    };


    const handlePaymentComplete = async () => {
        if (!selectedCard) {
            alert('Please select a payment method');
            return;
        }

        if (processing) return;

        try {
            setProcessing(true);

            const response = await axios.post('/api/orders', {
                paymentCardId: selectedCard
            });

            console.log('Order created:', response.data);

            showNotification('Payment successful! Order created');

            setTimeout(() => {
                navigate('/order-history');
            }, 2000);

        } catch (err) {
            setProcessing(false);

            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert('Error processing payment. Please try again');
            }
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification('');
        }, 2000);
    };

    const formatCardNumber = (number) => {
        return number.match(/.{1,4}/g)?.join(' ') || number;
    };

    if (loading) {
        return (
            <div className="payment-container">
                <Navbar />
                <div className="loading-message">Loading...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="payment-container">
            <Navbar />
            <div className="payment-content">
                <h2>Payment Method</h2>

                {/* Saved Cards List */}
                <div className="saved-cards">
                    {cards.map(card => (
                        <div
                            key={card.id}
                            className={`card-item ${selectedCard === card.id ? 'selected' : ''}`}
                            onClick={() => setSelectedCard(card.id)}
                        >
                            <input
                                type="radio"
                                name="selectedCard"
                                checked={selectedCard === card.id}
                                onChange={() => setSelectedCard(card.id)}
                            />
                            <div className="card-details">
                                <p className="card-number">{card.maskedCardNumber}</p>
                                <p className="card-holder">{card.cardHolderName}</p>
                                <p className="card-expiry">
                                    {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                                </p>
                                {card.isDefault && <span className="default-badge">Default</span>}
                            </div>
                            <button
                                className="delete-card-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCard(card.id);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Card Button */}
                {!showAddCard && (
                    <button
                        className="add-card-btn"
                        onClick={() => setShowAddCard(true)}
                    >
                        + Add Card
                    </button>
                )}

                {/* Add Card Form */}
                {showAddCard && (
                    <form className="add-card-form" onSubmit={handleAddCard}>
                        <h3>New Card</h3>

                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formatCardNumber(newCard.cardNumber)}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />
                            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
                        </div>

                        <div className="form-group">
                            <label>Cardholder Name</label>
                            <input
                                type="text"
                                name="cardHolderName"
                                value={newCard.cardHolderName}
                                onChange={handleInputChange}
                                placeholder="JOHN DOE"
                            />
                            {errors.cardHolderName && <span className="error">{errors.cardHolderName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Month</label>
                                <input
                                    type="text"
                                    name="expiryMonth"
                                    value={newCard.expiryMonth}
                                    onChange={handleInputChange}
                                    placeholder="MM"
                                    maxLength={2}
                                />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="text"
                                    name="expiryYear"
                                    value={newCard.expiryYear}
                                    onChange={handleInputChange}
                                    placeholder="YYYY"
                                    maxLength={4}
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={newCard.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        {errors.expiry && <span className="error">{errors.expiry}</span>}
                        {errors.cvv && <span className="error">{errors.cvv}</span>}

                        <label className="default-checkbox-label">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={newCard.isDefault}
                                onChange={handleInputChange}
                                className="default-checkbox"
                            />
                            Set as default card
                        </label>

                        <div className="form-buttons">
                            <button type="submit" className="save-card-btn">
                                Save
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowAddCard(false);
                                    setErrors({});
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Buy Button */}
                <button
                    className="buy-button"
                    onClick={handlePaymentComplete}
                    disabled={!selectedCard || processing}
                >
                    {processing ? 'PROCESSING...' : 'PAY'}
                </button>
            </div>

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default PaymentPage;
