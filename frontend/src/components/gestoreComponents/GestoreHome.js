import React from "react";
import { useNavigate } from 'react-router-dom'
import GestoreNav from "./GestoreNav";


const GestoreHome = () => {
    const navigate = useNavigate()


    //hander per la gestione dei pdi associati
    const goToGestionePDIAssociati = () => {
        navigate('/gestore-home/gestisci-pdi-associati')
    }

    //handler per la gestione degli eventi creati
    const goToGestioneEventiCreati = () => {
        navigate('/gestore-home/gestisci-eventi-creati')
    }

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
                                    Visualizza e gestisci i PDI (Punti di Interesse) associati a te.
                                </p>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={goToGestionePDIAssociati}
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
                                    Visualizza e gestisci gli eventi creati da te.
                                </p>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={goToGestioneEventiCreati}
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