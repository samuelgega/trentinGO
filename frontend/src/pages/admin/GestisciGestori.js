import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'

const GestisciGestori = () => {
    const navigate = useNavigate()
    const [listaGestori, setListaGestori] = useState([])
    const [richiesteAssociazione, setRichiesteAssociazione] = useState([])

    const token = localStorage.getItem('token')

    useEffect(() => {
        const recuperaGestori = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/gestori', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setListaGestori(json.data)
            } catch (error) {
                console.error("Errore nel recupero dei gestori", error)
            }
        }

        const recuperaRichiesteAssociazione = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/richAssPDI', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setRichiesteAssociazione(json.data)
            } catch (error) {
                console.error("Errore nel recupero delle richieste di associazione", error)
            }
        }

        recuperaGestori()
        recuperaRichiesteAssociazione()
    }, [])

    const cardHeader = (label, color) => (
        <div
            className="card-header border-0 fw-semibold py-3 px-3"
            style={{ backgroundColor: color, color: 'white' }}
        >
            {label}
        </div>
    )

    const badgeStato = (stato) => {
        const map = {
            in_attesa: { cls: 'text-bg-warning', label: 'In attesa' },
            approvata: { cls: 'text-bg-success', label: 'Approvata' },
            rifiutata: { cls: 'text-bg-danger', label: 'Rifiutata' },
        }
        const s = map[stato] ?? { cls: 'text-bg-secondary', label: stato }
        return <span className={`badge ${s.cls}`}>{s.label}</span>
    }

    return (
        <>
            <AdminNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container-fluid px-4 pt-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione Gestori</h4>
                            <p className="text-muted small mb-0">Visualizza i gestori e le richieste PDI</p>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin-home')}>
                            &larr; Torna alla Home
                        </button>
                    </div>

                    <div className="row g-4">

                        {/* Colonna sinistra: Lista Gestori */}
                        <div className="col-12 col-lg-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Gestori', '#0d6efd')}
                                <div className="card-body p-0" style={{ overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {listaGestori.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessun gestore</li>
                                        ) : listaGestori.map(g => (
                                            <li key={g._id} className="list-group-item p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-bold">{g.nome}</div>
                                                        <div className="text-muted small">{g.email}</div>
                                                        <div className="text-muted small">P.IVA: {g.partitaIva}</div>
                                                        <div className="text-muted small">PDI collegati: {g.pdiCollegati?.length ?? 0}</div>
                                                    </div>
                                                    <div>
                                                        {g.abilitato
                                                            ? <span className="badge text-bg-success">Abilitato</span>
                                                            : <span className="badge text-bg-warning">Non abilitato</span>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Colonna destra: Richieste */}
                        <div className="col-12 col-lg-6 d-flex flex-column gap-4">

                            {/* Richieste Associazione PDI */}
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Richieste Associazione PDI', '#037149')}
                                <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {richiesteAssociazione.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessuna richiesta</li>
                                        ) : richiesteAssociazione.map(r => (
                                            <li key={r._id} className="list-group-item p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-bold">{r.idPDI?.properties?.nome ?? r.idPDI}</div>
                                                        <div className="text-muted small">{r.idGestore?.nome ?? r.idGestore}</div>
                                                        {r.motivazione && (
                                                            <div className="text-muted small fst-italic mt-1">"{r.motivazione}"</div>
                                                        )}
                                                    </div>
                                                    <div>{badgeStato(r.stato)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Richieste Creazione PDI */}
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Richieste Creazione PDI', '#6c757d')}
                                <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item text-center text-muted py-4">
                                            Funzionalità non ancora disponibile
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default GestisciGestori
