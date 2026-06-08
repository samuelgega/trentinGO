import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import GestoreNav from "../../components/gestoreComponents/GestoreNav";


const GestoreHome = () => {
    const navigate = useNavigate()
    const [Gestore, setGestore] = useState(null)
    const [loading, setLoading] = useState(true)

    //hander per la gestione dei pdi associati
    const goToGestionePDIAssociati = () => {
        navigate('/gestore-home/gestisci-pdi-associati')
    }

    //handler per la gestione degli eventi creati
    const goToGestioneEventiCreati = () => {
        navigate('/gestore-home/gestisci-eventi-creati')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const recuperaGestore = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/datiUtente', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setGestore(json.data)
            } catch (error) {
                console.error("Errore nel recupero dei gestori", error)
            } finally {
                setLoading(false);
            }
        }
        recuperaGestore()
    }, [])
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                </div>
            </div>
        );
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

                    

                        {Gestore && !Gestore.abilitato ? (

                            /* Schermata di attesa */
                            <div className="row justify-content-center my-5">
                                <div className="col-12 col-md-10 col-lg-7 text-center">
                                    <div className="card border-0 shadow-sm py-5 px-4" style={{ borderRadius: '18px', backgroundColor: '#fff' }}>
                                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                            <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-4 mb-4 d-inline-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px' }}>
                                                <span style={{ fontSize: '2.5rem' }}>⏳</span>
                                            </div>
                                            <h2 className="card-title fw-bold text-dark mb-3 fs-1">
                                                Account in attesa di abilitazione
                                            </h2>
                                            <p className="card-text text-muted fs-5 mb-4" style={{ maxWidth: '550px' }}>
                                                Il tuo profilo è stato registrato con successo. Tuttavia, per poter interagire con la piattaforma,
                                                un amministratore deve prima verificare e abilitare il tuo account.
                                            </p>
                                            <div className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-pill">
                                                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                                                <span className="text-muted small fw-medium">Verifica in corso...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ) : (

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
                        )}
                    
                </div>
            </div>
        </>
    )
}

export default GestoreHome