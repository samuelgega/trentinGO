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

    const [nuovoPDI, setNuovoPDI] = useState({ nome: '', categoria: '', descrizione: '' })

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
        setNuovoPDI({ nome: '', categoria: '', descrizione: '' })
    }

    const CATEGORIE = ['Museo', 'Parco', 'Ristorante', 'Hotel', 'Monumento', 'Altro']

    return (
        <>
            <GestoreNav />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione PDI</h2>
                    <button className="btn btn-secondary" onClick={() => navigate('/gestore-home')}>
                        &larr; Torna alla Home
                    </button>
                </div>

                {/* Sezione richieste: affiancate su schermi grandi */}
                <div className="row g-4 mb-4">

                    {/* Richiesta associazione */}
                    <div className="col-12 col-lg-6">
                        <div className="card shadow-sm h-100" style={{ borderLeft: '4px solid #037149' }}>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title mb-1">Richiedi associazione a un PDI</h5>
                                <p className="text-muted small mb-3">Seleziona un PDI esistente a cui vuoi essere associato.</p>
                                <form onSubmit={handleRichiestaAssociazione} className="d-flex flex-column flex-grow-1">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">SELEZIONA PDI</label>
                                        <select
                                            className="form-select"
                                            value={pdiSelezionato}
                                            onChange={e => setPdiSelezionato(e.target.value)}
                                            required
                                            style={{ borderRadius: '10px' }}
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
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn fw-semibold px-4 mt-auto"
                                        style={{ backgroundColor: '#037149', color: 'white', borderRadius: '10px' }}
                                    >
                                        Invia richiesta
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Richiesta creazione nuovo PDI */}
                    <div className="col-12 col-lg-6">
                        <div className="card shadow-sm h-100" style={{ borderLeft: '4px solid #0d6efd' }}>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title mb-1">Richiedi creazione di un nuovo PDI</h5>
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
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">CATEGORIA</label>
                                        <select
                                            className="form-select"
                                            value={nuovoPDI.categoria}
                                            onChange={e => setNuovoPDI(p => ({ ...p, categoria: e.target.value }))}
                                            required
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <option value="">-- Seleziona categoria --</option>
                                            {CATEGORIE.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold text-secondary small">DESCRIZIONE (opzionale)</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            placeholder="Descrivi brevemente il punto di interesse..."
                                            value={nuovoPDI.descrizione}
                                            onChange={e => setNuovoPDI(p => ({ ...p, descrizione: e.target.value }))}
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary fw-semibold px-4 mt-auto"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Invia richiesta
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista PDI associati */}
                <div className="card shadow-sm">
                    <div className="card-header fw-semibold">PDI attualmente associati</div>
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
                                    {listaPDI.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted py-4">Nessun PDI associato.</td>
                                        </tr>
                                    ) : listaPDI.map((pdi) => (
                                        <tr key={pdi._id}>
                                            <td>{pdi.properties.nome}</td>
                                            <td>
                                                <span className="badge bg-info text-dark">{pdi.properties.categoria}</span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => showAlert(`Modifica PDI: ${pdi.properties.nome}`)}
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
        </>
    )
}

export default GestisciPDIAssociati
