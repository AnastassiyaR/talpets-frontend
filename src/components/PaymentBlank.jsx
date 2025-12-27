import './PaymentBlank.css';
import { Link } from "react-router-dom";
import Bitcoin from '../assets/Bitcoin.svg';
import PayPal from '../assets/PayPal.svg';
import Stripe from '../assets/StripePay.svg';
import Apple from '../assets/ApplePay.svg';

function PaymentBlank() {
    return (
        <div id="payment-form">
            <h2 id="store-name">TalPets Store</h2>

            <div id="order-amount-container">
                <span id="order-number">Order №070490</span>
                <span id="amount">10.00 €</span>
            </div>

            <div id="card-input">
                <input type="text" placeholder="Card number" />
            </div>

            <hr />

            <span id="other-methods-label">Other payment methods</span>

            <div id="payment-image-holder">
                <Link to="https://www.apple.com/apple-pay/" target="_blank"><img src={Apple} alt="ApplePay" /></Link>
                <Link to="https://stripe.com/" target="_blank"><img src={Stripe} alt="StripePay" /></Link>
                <Link to="https://www.paypal.com/" target="_blank"><img src={PayPal} alt="PayPal" /></Link>
                <Link to="https://www.bitcoin.com" target="_blank"><img src={Bitcoin} alt="Bitcoin" /></Link>
            </div>
        </div>
    );
}

export default PaymentBlank;
