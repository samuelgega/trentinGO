import React, { Component } from 'react'
import { withNavigation } from './withNavigation'

class AdminHome extends Component {
    //handler per andare alla pagina gestione pdi
    goToGestionePDI = () => {
        this.props.navigate('/gestisci-pdi')
    }

    render() {
        return (
            <div className="container">
                <h2 className="mb-4">Benvenuto, Amministratore</h2>

                <div className="row g-4">
                    {/* Card: Gestisci PDI */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Punti di Interesse</h5>
                                <p className="card-text text-muted mb-4">
                                    Aggiungi, modifica o elimina i PDI (Punti di Interesse) presenti sulla mappa.
                                </p>
                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={this.goToGestionePDI}
                                >
                                    Gestisci PDI
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card: Gestione Utenti */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Gestione Utenti</h5>
                                <p className="card-text text-muted mb-4">
                                    Visualizza la lista degli utenti registrati e gestisci i loro permessi.
                                </p>
                                <button className="btn btn-outline-secondary mt-auto">
                                    Gestisci Utenti
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card: Statistiche */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Statistiche App</h5>
                                <p className="card-text text-muted mb-4">
                                    Controlla gli analytics, gli accessi giornalieri e le metriche di utilizzo.
                                </p>
                                <button className="btn btn-outline-secondary mt-auto">
                                    Vedi Statistiche
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card: Impostazioni */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Impostazioni di Sistema</h5>
                                <p className="card-text text-muted mb-4">
                                    Configura i parametri globali del server e le preferenze dell'applicazione.
                                </p>
                                <button className="btn btn-outline-secondary mt-auto">
                                    Impostazioni
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Esporta il componente avvolto nel wrapper per poter navigare
export default withNavigation(AdminHome);