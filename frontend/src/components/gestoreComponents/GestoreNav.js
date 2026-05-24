import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/home.css'; 

const GestoreNav = () => {
    return (
        <header className="home-navbar">
            <div className="d-flex align-items-center">
                {/*Titolo*/}
                <Link to='/gestore-home' className="nav-logo">
                    Gestore Dashboard
                </Link>
            </div>
        </header>
    );
}

export default GestoreNav