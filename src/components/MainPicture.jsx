// eslint-disable-next-line no-unused-vars
import React from 'react';
import agopic from '../assets/AgoMain1.png';
import './MainPicture.css';

const MainPicture = () => {
    return (
        <div className="mainpicture-container">
            <div className="mainpicture-image">
                <img src={agopic}/>
            </div>
            <div className="mainpicture-text">
                <h1 className="mainpicture-title">TALTECHPETS</h1>
                <p className="mainpicture-subtitle">The reasons why you have to buy in our shop:</p>
                <ol className="mainpicture-list">
                    <li>Dogs</li>
                    <li>Taltech</li>
                    <li>Ago</li>
                </ol>
            </div>
        </div>
    );
};

export default MainPicture;
