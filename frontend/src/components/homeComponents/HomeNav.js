import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../assets/home.css';

const HomeNav = () => {
    //capire quale link è attivo
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    const navigate = useNavigate();

    return (
        <header className="home-navbar">
            <div className="d-flex align-items-center">
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
                <button
                    className='icon-button'
                    title='Profilo'
                    onClick={() => navigate('/profilo')}
                    style={{
                        'width': '4em',  /* Forza una dimensione fissa */
                        'height': '4em',
                        'overflow': 'hidden', /* Impedisce alla scritta "account_circle" di allargare il bottone */
                        'display': 'inline-flex',
                        'align-items': 'center',
                        'justify-content': 'center'
                    }}
                >
                    <span className="material-symbols-outlined nav-icon">account_circle</span>
                </button>
            </div>
        </header>
    )
}

export default HomeNav;