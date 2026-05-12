import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from './AdminNav'

const GestisciEventi = () => {
    const navigate = useNavigate()

    // dati prova
    const [listaEventi, setListaEventi] = useState([
        {
            _id: '1',
            properties: { 
                nome: 'Marcatini di natale',
                categoria: 'Cultura',
                dataInizio: '2026-05-01', // Passato
                dataFine: '2026-05-20'    // Futuro
            }
        },
        {
            _id: '2',
            properties: { 
                nome: 'Mercato',
                categoria: 'Sport',
                dataInizio: '2026-04-10', // Passato
                dataFine: '2026-04-15'    // Passato
            }
        },
        {
            _id: '3',
            properties: { 
                nome: 'Festival dello sport',
                categoria: 'Musica',
                dataInizio: '2026-06-01', // Futuro
                dataFine: '2026-06-10'    // Futuro
            }
        }
    ])


    // handler per tornare alla home 
    const goToHome = () => {
        navigate('/admin-home')
    }

    // handler per andare alla pagina crea evento
    const goToCreaEvento = () => {
        navigate('/crea-evento')
    }

    // handler per gestire la modifica
    const gestisciModifica = (evento) => {
        alert(`Hai cliccato MODIFICA sull'Evento: ${evento.properties.nome} (ID: ${evento._id})`)
    }

    // handler per gestire l'eliminazione (ora aggiorna anche l'interfaccia)
    const gestisciElimina = (evento) => {
        const conferma = window.confirm(`Sei sicuro di voler eliminare ${evento.properties.nome}?`)
        if (conferma) {
            alert(`Evento ${evento._id} eliminato!`)
        }
    }

    //ricordasi di cambiarlo in base al backend
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
            <AdminNav />
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Eventi</h2>
                    <div>   
                        <button className="btn btn-primary me-2" onClick={goToCreaEvento}>
                            + Aggiungi Nuovo Evento
                        </button>
                        <button className="btn btn-secondary" onClick={goToHome}>
                            &larr; Torna alla Home
                        </button>
                    </div>
                </div>
                

                <div className="card shadow-sm p-4 text-center text-muted">
                    <h4>Interfaccia in costruzione</h4>
                    <p>Qui verrà inserita la tabella o la mappa per gestire gli eventi</p>

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Stato</th>
                                            <th className="text-end" style={{ width: '200px' }}>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaEventi.map((evento) => (
                                            <tr key={evento._id}>
                                                <td className="fw-body">{evento.properties.nome}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{evento.properties.categoria}</span>
                                                </td>
                                                <td>
                                                    {getStatoEvento(evento.properties.dataInizio, evento.properties.dataFine)}
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-secondary me-2"
                                                        onClick={() => gestisciModifica(evento)}
                                                    >
                                                        Modifica
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => gestisciElimina(evento)}
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
                </div>
            </div>
        </>
    )
}


export default GestisciEventi