import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from './AdminNav'

const GestisciEventi = () => {
    const navigate = useNavigate()

    // dati prova
    const [listaEventi, setListaEventi] = useState([
        {
            _id: '1',
            properties: { nome: 'Evento 1' },
            categoria: 'Cultura'
        },
        {
            _id: '2',
            properties: { nome: 'Evento 2' },
            categoria: 'Sport'
        },
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

    return (
        <>
            <AdminNav />
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Eventi</h2>
                    <button
                        className="btn btn-secondary"
                        onClick={goToHome}
                    >
                        &larr; Torna alla Home
                    </button>
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

                    <div className="mt-4">
                        <button className="btn btn-primary me-2" onClick={goToCreaEvento}>
                            Aggiungi Nuovo Evento
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

// Esportazione pulita e diretta, senza wrapper vecchi
export default GestisciEventi