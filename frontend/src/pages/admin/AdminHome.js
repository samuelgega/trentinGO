import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'

const AdminHome = () => {
    const navigate = useNavigate()

    // handler per andare alla pagina gestione pdi
    const goToGestionePDI = () => {
        navigate('/admin-home/gestisci-pdi')
    }

    //handler per andare alla pagina gestione eventi
    const goToGestioneEventi = () => {
        navigate('/admin-home/gestisci-eventi')
    }

    const goToGestioneUtenti = () => {
        navigate('/admin-home/gestisci-utenti')
    }

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <AdminNav />
            <div className="container pb-5">
                
                <div className="mb-4 pt-3">
                    <h2 className="fw-bold">Benvenuto, Amministratore</h2>
                    <p className="text-muted">Scegli la sezione da gestire dal pannello di controllo.</p>
                </div>

                <div className="row g-4">
                    {/* Card: Gestisci PDI */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold" >Punti di Interesse</h5>
                                <p className="card-text text-muted mb-4">
                                    Aggiungi, modifica o elimina i PDI (Punti di Interesse) presenti sulla mappa.
                                </p>
                                <button
                                    className="btn btn-trentingo mt-auto fw-semibold"
                                    onClick={goToGestionePDI}
                                >
                                    Gestisci PDI
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card: Eventi */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold" >Eventi</h5>
                                <p className="card-text text-muted mb-4">
                                    Aggiungi, modifica o elimina eventi presenti nel sistema.
                                </p>
                                <button 
                                    className="btn btn-trentingo mt-auto fw-semibold"
                                    onClick={goToGestioneEventi}
                                >
                                    Gestisci Eventi
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gestione utenti */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold" >Gestione Utenti</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza la lista degli utenti registrati e gestisci i loro permessi.
                                </p>
                                <button 
                                    className="btn btn-trentingo mt-auto fw-semibold"
                                    onClick={goToGestioneUtenti}
                                >
                                    Gestisci Utenti
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistiche */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold text-secondary">Statistiche App</h5>
                                <p className="card-text text-muted mb-4">
                                    Controlla gli analytics, gli accessi giornalieri e le metriche di utilizzo.
                                </p>
                                <button className="btn btn-outline-secondary mt-auto fw-semibold" disabled>
                                    Prossimamente
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Impostazioni */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card pdi-card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold text-secondary">Impostazioni di Sistema</h5>
                                <p className="card-text text-muted mb-4">
                                    Configura i parametri globali del server e le preferenze dell'applicazione.
                                </p>
                                <button className="btn btn-outline-secondary mt-auto fw-semibold" disabled>
                                    Prossimamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome