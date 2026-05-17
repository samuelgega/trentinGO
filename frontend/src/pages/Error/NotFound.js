import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3">
            <h1 className="display-1 fw-bold text-success" style={{ fontSize: '120px' }}>404</h1>
            <h2 className="mb-3 fw-bold text-dark">Ops! Pagina non trovata</h2>
            <button 
                className="btn btn-success px-5 py-3 fw-bold shadow-sm rounded-pill"
                onClick={() => navigate('/')}
            >
                <i className="bi bi-house-door me-2"></i> Torna alla Home
            </button>
        </div>
    );
};

export default NotFound;