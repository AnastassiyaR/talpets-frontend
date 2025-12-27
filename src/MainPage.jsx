import 'react';
import { Link } from "react-router-dom";
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
        <div id="mainpage-container">
            <Navbar id="navbar" />
            <MainPicture id="main-picture" />

            <div id="circles">
                <div id="circle1" className="circle"></div>
                <div id="circle2" className="circle"></div>
                <div id="circle3" className="circle"></div>
                <div id="circle4" className="circle"></div>
            </div>

            <div id="squares-container">
                <div id="square1-container" className="square-container">
                    <Link to="https://taltech.ee/en" target="_blank" id="square1">
                        <img src={racket} id="square1-img"/>
                    </Link>
                </div>
                <div id="square2-container" className="square-container">
                    <Link to="https://www.instagram.com/informaatikud/" target="_blank" id="square2">
                        <img src={iaib} id="square2-img"/>
                    </Link>
                </div>
                <div id="square3-container" className="square-container">
                    <Link to="https://shop.taltech.ee/" target="_blank" id="square3">
                        <img src={shop} id="square3-img"/>
                    </Link>
                </div>
            </div>

            <Link to="/shop" id="cats-container">
                <img src={cats} id="cat-picture"/>
            </Link>

            <Footer id="footer" />
        </div>
    );
}

export default MainPage;
