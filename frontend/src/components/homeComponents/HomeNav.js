import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../assets/home.css';

const HomeNav = () => {
    //capire quale link è attivo
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';
    const [isLoggato, setLoggato] = useState(false)
    const [isTendinaAperta, setTendina] = useState(false)
    const [ruolo, setRuolo] = useState('')
    const [nome, setNome] = useState('')

    useEffect(() => {
        const tk = localStorage.getItem('token')
        if (tk) {
            setLoggato(true)
            setRuolo(localStorage.getItem('ruolo'))
            setNome(localStorage.getItem('nome') || '')
        }
    }, [])

    const navigate = useNavigate();

    return (
        <header className="home-navbar">
            <div className="d-flex align-items-center">
                {/*Titolo*/}
                <Link to='/home' className="nav-logo">
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
            <div className="nav-actions">
                {isLoggato ? (
                    <div className="dropdown position-relative d-inline-block">
                        <button
                            className="btn shadow-none d-flex align-items-center gap-2 p-0 profile-btn"
                            title="Profilo"
                            onClick={() => { setTendina(!isTendinaAperta) }}
                            style={{
                                height: '3.5rem',
                                backgroundColor: 'transparent',
                                color: '#037149',
                                border: 'none',
                                paddingLeft: '8px',
                                paddingRight: '4px'
                            }}
                        >
                            <span className="material-symbols-outlined fs-2" style={{ pointerEvents: 'none' }}>
                                account_circle
                            </span>
                            {nome && (
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', pointerEvents: 'none', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {nome}
                                </span>
                            )}
                        </button>

                        {/* tendina */}
                        <ul
                            className={`dropdown-menu shadow border-0 mt-2 ${isTendinaAperta ? 'show' : ''}`}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                minWidth: '200px',
                                borderRadius: '10px'
                            }}
                        >
                            {(ruolo === 'gestore' || ruolo === 'amministratore') && (
                                <li>
                                    <button
                                        className="dropdown-item custom-item d-flex align-items-center gap-2 py-2"
                                        onClick={() => {
                                            if (ruolo === 'gestore') navigate('/gestore-home')
                                            else if (ruolo === 'amministratore') navigate('/admin-home')
                                        }}
                                    >
                                        <span className="material-symbols-outlined fs-5">dashboard</span>
                                        Vai alla dashboard
                                    </button>
                                </li>
                            )}
                            <li>
                                <button
                                    className="dropdown-item custom-item d-flex align-items-center gap-2 py-2"
                                    onClick={() => { navigate('/profilo') }}
                                >
                                    <span className="material-symbols-outlined fs-5">person</span>
                                    Vai al profilo
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item custom-item d-flex align-items-center gap-2 py-2"
                                    onClick={() => { navigate('/profilo/impostazioni') }}
                                >
                                    <span className="material-symbols-outlined fs-5">settings</span>
                                    Impostazioni account
                                </button>
                            </li>

                            <li><hr className="dropdown-divider" /></li>

                            <li>
                                <button
                                    className="dropdown-item custom-item-logout text-danger d-flex align-items-center gap-2 py-2"
                                    onClick={() => {
                                        localStorage.clear()
                                        navigate('/')
                                    }}
                                >
                                    <span className="material-symbols-outlined fs-5">logout</span>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn p-0 border-0 bg-transparent fw-bold text-decoration-none register-text-btn"
                            onClick={() => navigate('/auth/giocatore')}
                            style={{ color: '#6c757d' }}
                        >
                            Registrati
                        </button>
                        <button
                            className="btn px-4 py-2 rounded-pill fw-bold login-btn"
                            onClick={() => navigate('/auth/login')}
                            style={{
                                backgroundColor: '#037149',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            Log-in
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default HomeNav;