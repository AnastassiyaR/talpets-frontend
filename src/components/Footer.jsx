// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Footer.css';
import FacebookIcon from '/src/assets/facebook.svg';
import InstagramIcon from '/src/assets/instagram.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>From Monday-Sunday 24/7</div>
        <div>Ehitajate tee 5, Tallinn 19086, Estonia</div>
        <div><a href="mailto:taltech.pets@taltech.ee">taltech.pets@taltech.ee</a></div>
        <div>+372 555 7777</div>
        <div className="social-media">
          <a href="https://www.facebook.com/ylikool/?locale=et_EE" target="_blank" rel="noopener noreferrer">
            <img src={FacebookIcon} alt="Facebook" className="social-icon1" />
          </a>
          <a href="https://www.instagram.com/taltech.eesti/?hl=en" target="_blank" rel="noopener noreferrer">
            <img src={InstagramIcon} alt="Instagram" className="social-icon2" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

