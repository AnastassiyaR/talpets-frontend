import 'react';
import './Footer.css';
import FacebookIcon from '/src/assets/facebook.svg';
import InstagramIcon from '/src/assets/instagram.svg';

const Footer = () => {
    return (
        <footer id="footer">
            <div id="footer-content">
                <div id="footer-hours">From Monday-Sunday 24/7</div>
                <div id="footer-address">Ehitajate tee 5, Tallinn 19086, Estonia</div>
                <div id="footer-email">
                    <a id="footer-email-link" href="mailto:taltech.pets@taltech.ee">talpetstaltech@gmail.com</a>
                </div>
                <div id="footer-phone">+372 555 7777</div>
                <div id="footer-social-media">
                    <a id="facebook-link" href="https://www.facebook.com/ylikool/?locale=et_EE" target="_blank" rel="noopener noreferrer">
                        <img src={FacebookIcon} alt="Facebook" id="facebook-icon" />
                    </a>
                    <a id="instagram-link" href="https://www.instagram.com/taltech.eesti/?hl=en" target="_blank" rel="noopener noreferrer">
                        <img src={InstagramIcon} alt="Instagram" id="instagram-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
