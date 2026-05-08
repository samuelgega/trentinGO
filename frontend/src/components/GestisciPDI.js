import React, { Component } from 'react'
import { withNavigation } from './withNavigation'

class GestisciPDI extends Component {
    constructor(props) {
        super(props)
        // dati provvisori
        this.state = {
            listaPDI: [
                { id: 1, nome: "Castello del Buonconsiglio", tipo: "Monumento" },
                { id: 2, nome: "MUSE - Museo delle Scienze", tipo: "Museo" }
            ]
        }
    }

    //handler per tornare alla home dell'admin
    goToHome = () => {
        this.props.navigate('/admin-home')
    }

    //handler per andare alla pagina crea PDI
    goToCreaPdi = () => {
        this.props.navigate('/crea-pdi')
    }

    //TODO: Handlers per gestire i pulsanti delle righe dei pdi (modifica ed elimina), al momento c'è un alert provvisorio
    gestisciModifica = (pdi) => {
        alert(`Hai cliccato MODIFICA sul PDI: ${pdi.nome} (ID: ${pdi.id})`)
    }

    gestisciElimina = (pdi) => {
        const conferma = window.confirm(`Sei sicuro di voler eliminare ${pdi.nome}?`)
        if (conferma) {
            alert(`PDI ${pdi.id} eliminato!`)
        }
    }

    render() {
        return (
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Punti di Interesse (PDI)</h2>
                    <button
                        className="btn btn-secondary"
                        onClick={this.goToHome}
                    >
                        &larr; Torna alla Home
                    </button>
                </div>

                <div className="card shadow-sm p-4 text-center text-muted">
                    <h4>Interfaccia in costruzione</h4>
                    <p>Qui verrà inserita la tabella o la mappa per gestire i PDI.</p>

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th className="text-end" style={{ width: '200px' }}>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* TODO: caricare la lista dei PDI dal db, questa è una soluzione provvisoria */}
                                        {this.state.listaPDI.map((pdi) => (
                                            <tr key={pdi.id}>
                                                <td className="fw">{pdi.nome}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{pdi.tipo}</span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-secondary me-2"
                                                        onClick={() => this.gestisciModifica(pdi)}
                                                    >
                                                        Modifica
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => this.gestisciElimina(pdi)}
                                                    >
                                                        Elimina
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="btn btn-primary me-2" onClick={this.goToCreaPdi}>Aggiungi Nuovo PDI</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigation(GestisciPDI)