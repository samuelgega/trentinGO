import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/home.css';

const HomeNav = () => {

    //capire quale link è attivo
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <header className="home-navbar">  
            <div className="d-flex allign-items-center">
                {/* logo di trentinGo */}
                <Link to="/home" className='nav-logo'>
                    TrentinGo
                </Link>
                {/* link di navigazione */}
                <nav className="nav-links">
                    <Link to="/home" className={`nav-item ${isActive('/home')}`}>
                        Mappa
                    </Link>
                    <Link to="/home/eventi" className={`nav-item ${isActive('/home/eventi')}`}>
                        Eventi
                    </Link>
                </nav>
            </div>
            {/* pulsante del profilo */}
            <div className='nav-actions'>
                <button className='icon-button' title='Profilo'>
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>
        </header>
    );
}

export default HomeNav;