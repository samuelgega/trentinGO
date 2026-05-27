import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'

const GestisciGestori = () => {
    const navigate = useNavigate()
    const [listaGestori, setListaGestori] = useState([])
    const [richiesteAssociazione, setRichiesteAssociazione] = useState([])
    const [filtroStato, setFiltroStato] = useState('in_attesa')

    const token = localStorage.getItem('token')

const toggleAbilitazione = async (id, abilitatoAttuale) => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/gestori/abilitato/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ abilitato: !abilitatoAttuale })
            })
            if (!response.ok) return
            const json = await response.json()
            setListaGestori(prev => prev.map(g => g._id === id ? { ...g, abilitato: json.data.abilitato } : g))
        } catch (error) {
            console.error("Errore nell'aggiornamento del gestore", error)
        }
    }

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

    const gestisciRichiesta = async (id, statoRichiesta) => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/richAssPDI/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ statoRichiesta })
            })
            if (!response.ok) return
            setRichiesteAssociazione(prev => prev.filter(r => r._id !== id))
        } catch (error) {
            console.error("Errore nella gestione della richiesta", error)
        }
    }

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
                                            <li key={g._id} className="list-group-item px-3 py-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="fw-bold">{g.nome}</div>
                                                        <div className="text-muted small">{g.email}</div>
                                                        <div className="text-muted small">P.IVA: {g.partitaIva}</div>
                                                        <div className="text-muted small">
                                                            PDI collegati: {g.pdiCollegati?.length ?? 0}
                                                            {g.pdiCollegati?.length > 0 && (
                                                                <ul className="mb-0 ps-3 mt-1">
                                                                    {g.pdiCollegati.map(pdi => (
                                                                        <li key={pdi._id}>{pdi.properties?.nome ?? pdi._id}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className={`btn fw-semibold ${g.abilitato ? 'btn-success' : 'btn-outline-secondary'}`}
                                                            onClick={() => toggleAbilitazione(g._id, false)}
                                                        >
                                                            Abilitato
                                                        </button>
                                                        <button
                                                            className={`btn fw-semibold ${!g.abilitato ? 'btn-danger' : 'btn-outline-secondary'}`}
                                                            onClick={() => toggleAbilitazione(g._id, true)}
                                                        >
                                                            Non abilitato
                                                        </button>
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
                                <div className="px-3 pt-3">
                                    <div className="btn-group btn-group-sm w-100">
                                        {[
                                            { val: 'tutti', label: 'Tutti' },
                                            { val: 'in_attesa', label: 'In attesa' },
                                            { val: 'approvata', label: 'Approvate' },
                                            { val: 'rifiutata', label: 'Rifiutate' },
                                        ].map(f => (
                                            <button
                                                key={f.val}
                                                onClick={() => setFiltroStato(f.val)}
                                                className={`btn btn-sm fw-semibold ${filtroStato === f.val ? 'btn-dark' : 'btn-outline-secondary'}`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-body p-0 mt-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {richiesteAssociazione.filter(r => filtroStato === 'tutti' || r.stato === filtroStato).length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessuna richiesta</li>
                                        ) : richiesteAssociazione.filter(r => filtroStato === 'tutti' || r.stato === filtroStato).map(r => (
                                            <li key={r._id} className="list-group-item p-3">
                                                <div className="d-flex justify-content-between align-items-center gap-3">
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center gap-2 mb-1">
                                                            <span className="fw-bold">{r.idPDI?.properties?.nome ?? '—'}</span>
                                                            {badgeStato(r.stato)}
                                                        </div>
                                                        <div className="text-muted small">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>home</span>
                                                            {' '}{r.idGestore?.nome ?? r.idGestore ?? '—'}
                                                        </div>
                                                        <div className="text-muted small">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px', verticalAlign: 'middle' }}>schedule</span>
                                                            {' '}{r.dataRichiesta ? new Date(r.dataRichiesta).toLocaleString('it-IT') : '—'}
                                                        </div>
                                                        {r.motivazione && (
                                                            <div className="text-muted small fst-italic mt-1">"{r.motivazione}"</div>
                                                        )}
                                                    </div>
                                                    {r.stato === 'in_attesa' && (
                                                        <div className="d-flex flex-column gap-2">
                                                            <button
                                                                className="btn btn-sm btn-success fw-semibold"
                                                                onClick={() => gestisciRichiesta(r._id, 'approvata')}
                                                            >
                                                                Approva
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger fw-semibold"
                                                                onClick={() => gestisciRichiesta(r._id, 'rifiutata')}
                                                            >
                                                                Rifiuta
                                                            </button>
                                                        </div>
                                                    )}
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
                                            In arrivo
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
