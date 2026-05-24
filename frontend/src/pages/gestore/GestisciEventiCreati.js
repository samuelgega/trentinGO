import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GestoreNav from '../../components/gestoreComponents/GestoreNav'
import {useAlert} from '../../contexts/AlertController'

const GestisciEventiCreati = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    //dati prova da implementare in futuro con il backend
    const [listaEventi, setListaEventi] = useState([
        {
            _id: '1',
            properties: { 
                nome: 'Marcatini di natale',
                categoria: 'Cultura',
                dataInizio: '2026-05-01', 
                dataFine: '2026-05-20'   
            }
        },
        {
            _id: '2',
            properties: { 
                nome: 'Mercato',
                categoria: 'Sport',
                dataInizio: '2026-04-10',
                dataFine: '2026-04-15'   
            }
        },
        {
            _id: '3',
            properties: { 
                nome: 'Festival dello sport',
                categoria: 'Musica',
                dataInizio: '2026-06-01', 
                dataFine: '2026-06-10'   
            }
        }
    ])

    // handler per tornare alla home 
    const goToHome = () => {
        navigate('/gestore-home')
    }

    // handler per andare alla pagina crea evento
    const goToCreaEvento = () => {
        navigate('/crea-evento')
    }

    // handler per gestire la modifica
    const gestisciModifica = (evento) => {
        showAlert(`Hai cliccato MODIFICA sull'Evento: ${evento.properties.nome} (ID: ${evento._id})`)
    }

    // handler per gestire l'eliminazione (ora aggiorna anche l'interfaccia)
    const gestisciElimina = (evento) => {
        const conferma = window.confirm(`Sei sicuro di voler eliminare ${evento.properties.nome}?`)
        if (conferma) {
            showAlert(`Evento ${evento._id} eliminato!`)
        }
    }

    //funzione per determinare lo stato dell'evento in base alle date
    const getStatoEvento = (dataInizio, dataFine) => {
        if (!dataInizio || !dataFine) return null;

        const oggi = new Date();
        const inizio = new Date(dataInizio);
        const fine = new Date(dataFine);

        //Azzero le ore per confrontare solo le date
        oggi.setHours(0, 0, 0, 0);
        inizio.setHours(0, 0, 0, 0);
        fine.setHours(0, 0, 0, 0);

        if (oggi < inizio) {
            return <span className="badge bg-warning text-dark ms-2">In arrivo</span>;
        } else if (oggi > fine) {
            return <span className="badge bg-secondary ms-2">Concluso</span>;
        } else {
            return <span className="badge bg-success ms-2">In corso</span>;
        }
    }

    return (
        <>
            <GestoreNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione Eventi</h4>
                            <p className="text-muted small mb-0">Aggiungi, modifica o elimina eventi</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-trentingo btn-sm fw-semibold px-3" onClick={goToCreaEvento}>
                                + Nuovo Evento
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={goToHome}>
                                &larr; Torna alla Home
                            </button>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm evento-card" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                            <th className="px-4 py-3 text-secondary fw-semibold small">NOME</th>
                                            <th className="py-3 text-secondary fw-semibold small">TIPO</th>
                                            <th className="py-3 text-secondary fw-semibold small">STATO</th>
                                            <th className="py-3 text-secondary fw-semibold small text-end px-4" style={{ width: '200px' }}>AZIONI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaEventi.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-5">
                                                    Nessun evento trovato.
                                                </td>
                                            </tr>
                                        ) : (
                                            listaEventi.map((evento) => (
                                                <tr key={evento._id}>
                                                    <td className="px-4 fw-semibold">{evento.properties.nome}</td>
                                                    <td>
                                                        <span className="pdi-badge-categoria">
                                                            {evento.properties.categoria}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {getStatoEvento(evento.properties.dataInizio, evento.properties.dataFine)}
                                                    </td>
                                                    <td className="text-end px-4">
                                                        <button
                                                            className="btn btn-sm btn-trentingo-outline me-2"
                                                            onClick={() => gestisciModifica(evento)}
                                                        >
                                                            Modifica
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => gestisciElimina(evento)}
                                                        >
                                                            Elimina
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default GestisciEventiCreati