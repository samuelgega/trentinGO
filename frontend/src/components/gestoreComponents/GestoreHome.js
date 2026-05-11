import React from "react";
import { useNavigate } from 'react-router-dom'
import GestoreNav from "./GestoreNav";

const GestoreHome = () => {
    const navigate = useNavigate()

    return (
        <div>
            <GestoreNav />
            <div className="container">
                <h2 className="mb4">Benvenuto, Gestore</h2>
                <div className="row g-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Gestione PDI</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza e gestisci i PDI (Punti di Interesse) presenti sulla mappa.
                                </p>
                                {/* bottome da implementare */}
                                <button
                                    className="btn btn-outline-secondary mt-auto"
                                    onClick={() => navigate('/gestisci-pdi')}
                                >
                                    Gestisci PDI
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Gestione Eventi</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza e gestisci gli eventi presenti nel sistema.
                                </p>
                                {/* bottome da implementare */}
                                <button
                                    className="btn btn-outline-secondary mt-auto"
                                    onClick={() => navigate('/gestisci-eventi')}
                                >
                                    Gestisci Eventi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GestoreHome