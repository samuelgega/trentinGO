import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import GestoreNav from '../../components/gestoreComponents/GestoreNav'

const GestisciPDIAssociati = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert()

    const [listaPDI, setListaPDI] = useState([
        { _id: '1', properties: { nome: 'PDI 1', categoria: 'Museo' } },
        { _id: '2', properties: { nome: 'PDI 2', categoria: 'Parco' } },
        { _id: '3', properties: { nome: 'PDI 3', categoria: 'Ristorante' } }
    ])

    const [tuttiPDI, setTuttiPDI] = useState([])
    const [pdiSelezionato, setPdiSelezionato] = useState('')
    const [motivazione, setMotivazione] = useState('')

    const [nuovoPDI, setNuovoPDI] = useState({ nome: '', categoria: '', descrizione: '', latitudine: '', longitudine: '' })

    // TODO: recuperare dal backend GET /api/v1/richieste-associazione?gestore=<id>
    const [listaRichieste, setListaRichieste] = useState([
        { _id: 'r1', tipo: 'associazione', nomePDI: 'Castello del Buonconsiglio', stato: 'in_attesa', dataRichiesta: '2026-05-20' },
        { _id: 'r2', tipo: 'associazione', nomePDI: 'Parco Naturale Adamello', stato: 'approvata', dataRichiesta: '2026-05-10' },
        { _id: 'r3', tipo: 'creazione', nomePDI: 'Rifugio Monte Baldo', stato: 'rifiutata', dataRichiesta: '2026-05-05' },
    ])

    useEffect(() => {
        const recuperaPDI = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/pdi')
                if (!response.ok) return
                const json = await response.json()
                setTuttiPDI(json.data)
            } catch (e) {
                console.error("Errore nel recupero PDI:", e)
            }
        }
        recuperaPDI()
    }, [])

    const handleRichiestaAssociazione = (e) => {
        e.preventDefault()
        if (!pdiSelezionato) return
        // TODO: collegare al backend POST /api/v1/richieste-associazione
        showAlert("Richiesta inviata.", "La tua richiesta di associazione è in attesa di approvazione", "success")
        setPdiSelezionato('')
        setMotivazione('')
    }

    const handleRichiestaCreazione = (e) => {
        e.preventDefault()
        // TODO: collegare al backend POST /api/v1/richieste-creazione-pdi
        showAlert("Richiesta inviata.", "La tua richiesta di creazione PDI è in attesa di approvazione", "success")
        setNuovoPDI({ nome: '', categoria: '', descrizione: '', latitudine: '', longitudine: '' })
    }

    const CATEGORIE = ['Chiesa', 'Castello', 'Monumento', 'Museo', 'Parco', 'Montagna', 'Lago', 'Santuario', 'Altro']

    const cardHeader = (label, color) => (
        <div className="card-header border-0 fw-semibold py-3 px-4" style={{ backgroundColor: color, color: 'white' }}>
            {label}
        </div>
    )

    return (
        <>
            <GestoreNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">

                    {/* Header pagina */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione PDI</h4>
                            <p className="text-muted small mb-0">Associa, crea e monitora i tuoi Punti di Interesse</p>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/gestore-home')}>
                            &larr; Torna alla Home
                        </button>
                    </div>

                    {/* Sezione richieste */}
                    <div className="row g-4 mb-4">

                        {/* Richiesta associazione */}
                        <div className="col-12 col-lg-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Richiedi associazione a un PDI', '#037149')}
                                <div className="card-body d-flex flex-column px-4 py-3">
                                    <p className="text-muted small mb-3">Seleziona un PDI esistente a cui vuoi essere associato.</p>
                                    <form onSubmit={handleRichiestaAssociazione} className="d-flex flex-column flex-grow-1">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-secondary small">SELEZIONA PDI</label>
                                            <select
                                                className="form-select"
                                                value={pdiSelezionato}
                                                onChange={e => setPdiSelezionato(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Scegli un Punto di Interesse --</option>
                                                {tuttiPDI.map(pdi => (
                                                    <option key={pdi._id} value={pdi._id}>
                                                        {pdi.properties.nome} — {pdi.properties.categoria}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-secondary small">MOTIVAZIONE (opzionale)</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Descrivi perché vuoi essere associato a questo PDI..."
                                                value={motivazione}
                                                onChange={e => setMotivazione(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn fw-semibold px-4 mt-auto"
                                            style={{ backgroundColor: '#037149', color: 'white' }}
                                        >
                                            Invia richiesta
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Richiesta creazione nuovo PDI */}
                        <div className="col-12 col-lg-6">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Richiedi creazione di un nuovo PDI', '#0d6efd')}
                                <div className="card-body d-flex flex-column px-4 py-3">
                                    <p className="text-muted small mb-3">Proponi un nuovo Punto di Interesse da aggiungere alla piattaforma.</p>
                                    <form onSubmit={handleRichiestaCreazione} className="d-flex flex-column flex-grow-1">
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-secondary small">NOME PDI</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Es. Castello del Buonconsiglio"
                                                value={nuovoPDI.nome}
                                                onChange={e => setNuovoPDI(p => ({ ...p, nome: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-secondary small">CATEGORIA</label>
                                            <select
                                                className="form-select"
                                                value={nuovoPDI.categoria}
                                                onChange={e => setNuovoPDI(p => ({ ...p, categoria: e.target.value }))}
                                                required
                                            >
                                                <option value="">-- Seleziona categoria --</option>
                                                {CATEGORIE.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <label className="form-label fw-semibold text-secondary small">LATITUDINE</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    placeholder="Es. 46.0748"
                                                    value={nuovoPDI.latitudine}
                                                    onChange={e => setNuovoPDI(p => ({ ...p, latitudine: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label fw-semibold text-secondary small">LONGITUDINE</label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    className="form-control"
                                                    placeholder="Es. 11.1217"
                                                    value={nuovoPDI.longitudine}
                                                    onChange={e => setNuovoPDI(p => ({ ...p, longitudine: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-secondary small">DESCRIZIONE (opzionale)</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                placeholder="Descrivi brevemente il punto di interesse..."
                                                value={nuovoPDI.descrizione}
                                                onChange={e => setNuovoPDI(p => ({ ...p, descrizione: e.target.value }))}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary fw-semibold px-4 mt-auto">
                                            Invia richiesta
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Andamento richieste */}
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Andamento richieste', '#212529')}
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                <tr>
                                                    <th className="px-4 py-3 text-secondary fw-semibold small">PDI</th>
                                                    <th className="py-3 text-secondary fw-semibold small">TIPO</th>
                                                    <th className="py-3 text-secondary fw-semibold small">DATA</th>
                                                    <th className="py-3 text-secondary fw-semibold small">STATO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listaRichieste.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="text-center text-muted py-5">Nessuna richiesta inviata.</td>
                                                    </tr>
                                                ) : listaRichieste.map(r => (
                                                    <tr key={r._id}>
                                                        <td className="px-4 fw-semibold">{r.nomePDI}</td>
                                                        <td>
                                                            <span className={`badge rounded-pill ${r.tipo === 'associazione' ? 'text-bg-success' : 'text-bg-primary'}`}>
                                                                {r.tipo === 'associazione' ? 'Associazione' : 'Creazione'}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted small">{new Date(r.dataRichiesta).toLocaleDateString('it-IT')}</td>
                                                        <td>
                                                            {r.stato === 'in_attesa' && <span className="badge rounded-pill text-bg-warning">In attesa</span>}
                                                            {r.stato === 'approvata' && <span className="badge rounded-pill text-bg-success">Approvata</span>}
                                                            {r.stato === 'rifiutata' && <span className="badge rounded-pill text-bg-danger">Rifiutata</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista PDI associati */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('PDI associati', '#212529')}
                                <div className="card-body p-0">
                                    <ul className="list-group list-group-flush">
                                        {listaPDI.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-5">Nessun PDI associato.</li>
                                        ) : listaPDI.map(pdi => (
                                            <li key={pdi._id} className="list-group-item d-flex justify-content-between align-items-center px-4 py-3">
                                                <div>
                                                    <div className="fw-semibold">{pdi.properties.nome}</div>
                                                    <span className="badge rounded-pill text-bg-info mt-1">{pdi.properties.categoria}</span>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => showAlert(`Modifica PDI: ${pdi.properties.nome}`)}
                                                >
                                                    Modifica
                                                </button>
                                            </li>
                                        ))}
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

export default GestisciPDIAssociati
