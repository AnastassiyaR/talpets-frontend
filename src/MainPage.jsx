// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link} from "react-router-dom";
import './MainPage.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MainPicture from './components/MainPicture.jsx';
import iaib from '/src/assets/INIT.png';
import cats from "./assets/catsshopping.png";
import shop from '/src/assets/e-pood.png';
import racket from '/src/assets/racket.png';

function MainPage() {
    return (
        <div className="mainpage-container">
            <Navbar/>
            <MainPicture/>

            <div className="circles">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>

            <div className="squares-container">
                <div className="square-container">
                    <Link to="https://taltech.ee/en" target="_blank" id="square" className="taltech">
                        <img src={racket} className="square-picture-container"/>
                    </Link>
                </div>
                <div className="square-container">
                    <Link to="https://www.instagram.com/informaatikud/" target="_blank" id="square" className="iaib">
                        <img src={iaib} className="square-picture-container"/>
                    </Link>
                </div>
                <div className="square-container">
                    <Link to="https://shop.taltech.ee/" target="_blank" id="square" className="e-pood">
                        <img src={shop} className="square-picture-container"/>
                    </Link>
                </div>
            </div>

            <Link to="/shop" className="cats-container">
                <img src={cats} className="cat-picture shop"/>
            </Link>


            <Footer/>
        </div>
    );
}

export default MainPage;
