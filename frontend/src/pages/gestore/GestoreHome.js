import React from "react";
import { useNavigate } from 'react-router-dom'
import GestoreNav from "../../components/gestoreComponents/GestoreNav";


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
    <>
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <GestoreNav />
            <div className="container pb-5 pt-4">
                
                <div className="mb-4">
                    <h2 className="fw-bold mb-0">Benvenuto, Gestore</h2>
                    <p className="text-muted small mb-0">Scegli la sezione da gestire dal pannello di controllo.</p>
                </div>

                <div className="row g-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold text-trentingo">Gestione PDI</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza e gestisci i PDI (Punti di Interesse) associati a te.
                                </p>
                                <button
                                    className="btn btn-trentingo mt-auto fw-semibold"
                                    onClick={goToGestionePDIAssociati}
                                >
                                    Gestisci PDI
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100 border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold text-trentingo">Gestione Eventi</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza e gestisci gli eventi creati da te.
                                </p>
                                <button
                                    className="btn btn-trentingo mt-auto fw-semibold"
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
    </>
    )
}

export default GestoreHome