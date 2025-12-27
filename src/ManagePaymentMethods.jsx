import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProfileBar from './components/ProfileBar.jsx';
import './ManagePaymentMethods.css';
import axios from './utils/auth.jsx';

const ManagePaymentMethods = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', cvv: '', isDefault: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => { fetchCards(); }, []);

    const fetchCards = async () => {
        try {
            const response = await axios.get('/api/payment-cards');
            setCards(response.data);
        } catch {
            alert('Failed to load cards');
        } finally {
            setLoading(false);
        }
    };

    const validate = () => {
        const e = {};
        const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = newCard;

        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber))
            e.cardNumber = 'Card number must contain 16 digits';

        if (!cardHolderName.trim())
            e.cardHolderName = 'Enter cardholder name';

        const m = Number.parseInt(expiryMonth, 10), y = Number.parseInt(expiryYear, 10);
        const now = new Date(), cy = now.getFullYear(), cm = now.getMonth() + 1;
        if (m < 1 || m > 12 || y < cy || (y === cy && m < cm) || y > cy + 10)
            e.expiry = 'Invalid or expired date';

        if (!/^\d{3,4}$/.test(cvv))
            e.cvv = 'CVV must contain 3-4 digits';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const limits = { cardNumber: 16, expiryMonth: 2, expiryYear: 4, cvv: 4 };
        const v = limits[name] ? value.replaceAll(/\D/g, '').slice(0, limits[name]) : value;
        setNewCard(p => ({ ...p, [name]: type === 'checkbox' ? checked : v }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await axios.post('/api/payment-cards', {
                ...newCard,
                expiryMonth: Number.parseInt(newCard.expiryMonth, 10),
                expiryYear: Number.parseInt(newCard.expiryYear, 10)
            });
            setCards([...cards, res.data]);
            setShowAddCard(false);
            setNewCard({ cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', cvv: '', isDefault: false });
            setErrors({});
            alert('Card added successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding card');
        }
    };

    const handleDelete = async (id) => {
        if (!globalThis.confirm('Delete this card?')) return;
        try {
            await axios.delete(`/api/payment-cards/${id}`);
            setCards(cards.filter(c => c.id !== id));
            alert('Card deleted');
        } catch {
            alert('Error deleting card');
        }
    };

    const handleDefault = async (id) => {
        try {
            await axios.put(`/api/payment-cards/${id}/default`);
            setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
            alert('Default card updated');
        } catch {
            alert('Error setting default');
        }
    };

    const format = (n) => n ? (n.match(/.{1,4}/g)?.join(' ') || n) : '';

    if (loading) {
        return (
            <div id="page">
                <Navbar />
                <div id="wrapper">
                    <ProfileBar />
                    <div id="content">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div id="page">
            <Navbar />
            <div id="wrapper">
                <ProfileBar />
                <div id="content">
                    <h2>Manage Payment Methods</h2>
                    <div id="cards">
                        {cards.map(c => (
                            <div key={c.id} className="card">
                                <header>
                                    {c.isDefault && <span className="badge">DEFAULT</span>}
                                    <button className="del" onClick={() => handleDelete(c.id)}>✕</button>
                                </header>
                                <div className="num">**** **** **** {c.lastFourDigits}</div>
                                <div className="name">{c.cardHolderName}</div>
                                <div className="exp">Expires: {String(c.expiryMonth).padStart(2, '0')}/{c.expiryYear}</div>
                                {!c.isDefault && <button className="btn" onClick={() => handleDefault(c.id)}>Set as Default</button>}
                            </div>
                        ))}

                        {!showAddCard && (
                            <button
                                id="add"
                                type="button"
                                onClick={() => setShowAddCard(true)}
                                className="add-button"
                            >
                                <div className="icon">+</div>
                                <p>Add New Card</p>
                            </button>
                        )}

                    </div>

                    {showAddCard && (
                        <div id="modal">
                            <div>
                                <h3>Add New Card</h3>
                                <form onSubmit={handleAdd}>
                                    <div className="fg">
                                        <label>
                                            <span>Card Number</span>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={format(newCard.cardNumber)}
                                                onChange={handleChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                        </label>
                                        {errors.cardNumber && <div className="err">{errors.cardNumber}</div>}
                                    </div>

                                    <div className="fg">
                                        <label htmlFor="cardHolderName">Cardholder Name</label>
                                        <input
                                            type="text"
                                            id="cardHolderName"
                                            name="cardHolderName"
                                            value={newCard.cardHolderName}
                                            onChange={handleChange}
                                            placeholder="JOHN DOE"
                                        />
                                        {errors.cardHolderName && <div className="err">{errors.cardHolderName}</div>}
                                    </div>

                                    <div id="row">
                                        <div className="fg">
                                            <label>
                                                <span>Month</span>
                                                <input
                                                    type="text"
                                                    name="expiryMonth"
                                                    value={newCard.expiryMonth}
                                                    onChange={handleChange}
                                                    placeholder="MM"
                                                    maxLength={2}
                                                />
                                            </label>
                                        </div>

                                        <div className="fg">
                                            <label>
                                                <span>Year</span>
                                                <input
                                                    type="text"
                                                    name="expiryYear"
                                                    value={newCard.expiryYear}
                                                    onChange={handleChange}
                                                    placeholder="YYYY"
                                                    maxLength={4}
                                                />
                                            </label>
                                        </div>

                                        <div className="fg">
                                            <label>
                                                <span>CVV</span>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={newCard.cvv}
                                                    onChange={handleChange}
                                                    placeholder="123"
                                                    maxLength={4}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {errors.expiry && <div className="err">{errors.expiry}</div>}
                                    {errors.cvv && <div className="err">{errors.cvv}</div>}

                                    <label id="check">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={newCard.isDefault}
                                            onChange={handleChange}
                                        />
                                        <span>Set as default card</span>
                                    </label>


                                    <div id="btns">
                                        <button type="submit" id="submit">Add Card</button>
                                        <button type="button" id="cancel" onClick={() => { setShowAddCard(false); setErrors({}); }}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ManagePaymentMethods;
