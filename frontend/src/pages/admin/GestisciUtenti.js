import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'
import { useAlert } from '../../contexts/AlertController'

const GestisciUtenti = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert()


    const [listaGiocatori, setListaGiocatori] = useState([])
    const [listaGestori, setListaGestori] = useState([]);
    const [listaAdmin, setListaAdmin] = useState([]);
    const [utenteSelezionato, setUtenteSelezionato] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const recuperoGiocatori = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/giocatori', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setListaGiocatori(json.data)
            } catch (error) {
                console.error("Errore nel recupero dei Giocatori:", error)
            }
        }

        const recuperoGestori = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/gestori', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setListaGestori(json.data)
            } catch (error) {
                console.error("Errore nel recupero dei Gestori:", error)
            }
        }

        const recuperoAdmin = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/amministratori', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!response.ok) return
                const json = await response.json()
                setListaAdmin(json.data)
            } catch (error) {
                console.error("Errore nel recupero Admin:", error)
            }
        }

        recuperoGiocatori();
        recuperoGestori();
        recuperoAdmin();

    }, [token])

    const eliminaUtente = async () => {
        if (!utenteSelezionato) return
        const { id, tipo } = utenteSelezionato
        const endpoint = tipo === 'giocatore'
            ? `http://localhost:3001/api/v1/giocatori/${id}`
            : `http://localhost:3001/api/v1/gestori/${id}`
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                if (tipo === 'giocatore') setListaGiocatori(p => p.filter(u => u._id !== id))
                else setListaGestori(p => p.filter(u => u._id !== id))
                showAlert("Successo", "Utente eliminato con successo", "success")
            } else {
                const json = await response.json()
                showAlert("Errore", json.error || "Impossibile eliminare l'utente", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
        } finally {
            setUtenteSelezionato(null)
        }
    }

    // Funzione per generare l'intestazione delle Card
    const cardHeader = (label, color, bottoneExtra = null) => (
        <div className="card-header border-0 fw-semibold py-3 px-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: color, color: 'white' }}>
            <span>{label}</span>
            {bottoneExtra}
        </div>
    )

    // Helper per capire se il gestore è abilitato o in attesa
    const renderBadgeGestore = (abilitato) => {
        if (abilitato) {
            return <span className="badge text-bg-success mt-1">Approvato</span>;
        } else {
            return <span className="badge text-bg-warning mt-1">In Attesa</span>;
        }
    }

    return (
        <>
            <AdminNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container-fluid px-4 pt-4">

                    {/* Header di pagina */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione Utenti</h4>
                            <p className="text-muted small mb-0">Gestisci i permessi e gli account di tutti gli utenti</p>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin-home')}>
                            &larr; Torna alla Home
                        </button>
                    </div>

                    {/*Griglia */}
                    <div className="row g-4">

                        {/*Giocatori */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Giocatori', '#037149')}
                                <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {listaGiocatori.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessun giocatore</li>
                                        ) : listaGiocatori.map(u => (
                                            <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <div>
                                                    <div className="fw-bold">{u.username}</div>
                                                    <div className="text-muted small">{u.email}</div>
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setUtenteSelezionato({ id: u._id, nome: u.username, tipo: 'giocatore' })}>
                                                    Elimina
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/*Gestori*/}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Gestori', '#0d6efd')}
                                <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {listaGestori.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessun gestore</li>
                                        ) : listaGestori.map(u => (
                                            <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <div>
                                                    <div className="fw-bold">{u.nome}</div>
                                                    <div className="text-muted small">{u.email}</div>
                                                    {renderBadgeGestore(u.abilitato)}
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => setUtenteSelezionato({ id: u._id, nome: u.nome, tipo: 'gestore' })}>
                                                    Elimina
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/*Amministratori */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                {cardHeader('Amministratori', '#212529',
                                    <button
                                        className="btn btn-sm btn-light text-dark fw-bold"
                                        onClick={() => navigate('/auth/admin')}
                                    >
                                        + Nuovo Admin
                                    </button>
                                )}
                                <div className="card-body p-0" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <ul className="list-group list-group-flush">
                                        {listaAdmin.length === 0 ? (
                                            <li className="list-group-item text-center text-muted py-4">Nessun admin</li>
                                        ) : listaAdmin.map(u => (
                                            <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                <div>
                                                    <div className="fw-bold">{u.username}</div>
                                                    <div className="text-muted small">{u.email}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {utenteSelezionato && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
                            <div className="modal-body p-4">
                                <div className="text-center mb-3">
                                    <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h5 className="fw-bold text-center mb-2">Eliminare l'utente?</h5>
                                <p className="text-muted text-center mb-0">
                                    Stai per eliminare <strong>{utenteSelezionato.nome}</strong>. Questa azione è <strong>irreversibile</strong>.
                                </p>
                            </div>
                            <div className="modal-footer border-0 pt-0 px-4 pb-4 d-flex gap-2">
                                <button
                                    className="btn btn-outline-secondary fw-semibold flex-fill"
                                    style={{ borderRadius: '10px' }}
                                    onClick={() => setUtenteSelezionato(null)}
                                >
                                    Annulla
                                </button>
                                <button
                                    className="btn btn-danger fw-semibold flex-fill"
                                    style={{ borderRadius: '10px' }}
                                    onClick={eliminaUtente}
                                >
                                    Elimina definitivamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GestisciUtenti;