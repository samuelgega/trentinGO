import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GestoreNav from './GestoreNav'

const GestisciPDIAssociati = () => {

    const navigate = useNavigate()
    
    // dati di prova da implementare in futuro con il backend
        const [listaPDI, setListaPDI] = useState([
            {
                _id: '1',
                properties: {
                    nome: 'PDI 1',
                    categoria: 'Museo'
                }
            },
            {
                _id: '2',
                properties: {
                    nome: 'PDI 2',
                    categoria: 'Parco'
                }
            },
            {
                _id: '3',
                properties: {
                    nome: 'PDI 3',
                    categoria: 'Ristorante'
                }
            }
        ])

        // handler per tornare alla home 
        const goToHome = () => {
            navigate('/gestore-home')
        }

        // handler per gestire la modifica
        const gestisciModifica = (pdi) => {
            alert(`Hai cliccato MODIFICA sul PDI: ${pdi.properties.nome} (ID: ${pdi._id})`)
        }

        return (
        <>
            <GestoreNav />
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Punti di Interesse (PDI) associati</h2>
                    <div>   
                    <button
                        className="btn btn-secondary"
                        onClick={goToHome}
                    >
                        &larr; Torna alla Home
                    </button>
                    </div>
                </div>

                <div className="card shadow-sm p-4 text-center text-muted">
                    <h4>Interfaccia in costruzione</h4>
                    <p>Qui verrà inserita la tabella o la mappa per gestire i PDI</p>

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
                                        {/* lista dei pdi associati da recuperare dal backend */}
                                        {listaPDI.map((pdi) => (
                                            <tr key={pdi._id}>
                                                <td className="fw">{pdi.properties.nome}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{pdi.properties.categoria}</span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-secondary me-2"
                                                        onClick={() => gestisciModifica(pdi)}
                                                    >
                                                        Modifica
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
export default GestisciPDIAssociati;