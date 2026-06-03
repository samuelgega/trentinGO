import React from "react";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import HomeNav from "../../components/homeComponents/HomeNav";
import { useAlert } from '../../contexts/AlertController';
import '../../assets/home.css'


const HomeProfilo = () =>{

    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [profilo, setProfilo] = useState(null);
    const [modificaNome, setModificaNome] = useState(false)
    const [nuovoNome, setNuovoNome] = useState('')
    const [modificaEmail, setModificaEmail] = useState(false)
    const [nuovaEmail, setNuovaEmail] = useState('')
    const [modificaPassword, setModificaPassword] = useState(false)
    const [datiPassword, setDatiPassword] = useState({ attuale: '', nuova: '', conferma: '' })
    const [erroriPassword, setErroriPassword] = useState({})


    useEffect(() => {
        const recuperaDati = async () => {
            const token = localStorage.getItem('token');

            if(!token){
                navigate('/auth/login');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/v1/datiUtente`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const json = await response.json();
                    setProfilo(json.data);
                } else {
                    showAlert("Errore", "Impossibile recuperare i dati", "danger");
                }
            } catch (error) {
                console.error("Errore di rete:", error);
                showAlert("Errore", "Server non raggiungibile", "danger");
            }
        };

        recuperaDati();
    }, [navigate, showAlert]);

    const salvaNome = async () => {
        if (!nuovoNome.trim()) {
            showAlert("Errore", "Il nome non può essere vuoto", "warning")
            return
        }
        if (nuovoNome.trim() === (profilo.username || profilo.nome)) return

        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')

        const endpoint = profilo.ruolo === 'giocatore'
            ? `http://localhost:3001/api/v1/giocatori/modificaUtente/${userId}`
            : profilo.ruolo === 'gestore'
            ? `http://localhost:3001/api/v1/gestori/modificaUtente/${userId}`
            : `http://localhost:3001/api/v1/amministratori/modificaUtente/${userId}`

        const campo = profilo.ruolo === 'gestore' ? { nome: nuovoNome } : { username: nuovoNome }

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campo)
            })
            const json = await response.json()

            if (response.ok) {
                setProfilo(p => ({ ...p, ...campo }))
                setModificaNome(false)
                showAlert("Successo", "Nome aggiornato con successo", "success")
            } else {
                showAlert("Errore", json.error || "Impossibile aggiornare il nome", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
        }
    }

    const salvaEmail = async () => {
        if (!nuovaEmail.trim()) {
            showAlert("Errore", "L'email non può essere vuota", "warning")
            return
        }
        if (nuovaEmail.trim() === profilo.email) return

        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')

        const endpoint = profilo.ruolo === 'giocatore'
            ? `http://localhost:3001/api/v1/giocatori/modificaUtente/${userId}`
            : profilo.ruolo === 'gestore'
            ? `http://localhost:3001/api/v1/gestori/modificaUtente/${userId}`
            : `http://localhost:3001/api/v1/amministratori/modificaUtente/${userId}`

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: nuovaEmail.trim() })
            })
            const json = await response.json()

            if (response.ok) {
                setProfilo(p => ({ ...p, email: nuovaEmail.trim() }))
                setModificaEmail(false)
                showAlert("Successo", "Email aggiornata con successo", "success")
            } else {
                showAlert("Errore", json.error || "Impossibile aggiornare l'email", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
        }
    }

    const validaPassword = () => {
        const errori = {}
        if (!datiPassword.attuale) errori.attuale = "Inserisci la password attuale"
        if (!datiPassword.nuova) errori.nuova = "Inserisci la nuova password"
        else if (datiPassword.nuova === datiPassword.attuale) errori.nuova = "La nuova password deve essere diversa da quella attuale"
        else if (datiPassword.nuova.length < 8) errori.nuova = "La password deve essere di almeno 8 caratteri"
        if (!datiPassword.conferma) errori.conferma = "Conferma la nuova password"
        else if (datiPassword.nuova && datiPassword.nuova !== datiPassword.conferma) errori.conferma = "Le password non corrispondono"
        setErroriPassword(errori)
        return Object.keys(errori).length === 0
    }

    const salvaPassword = async () => {
        if (!validaPassword()) return

        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/v1/cambiaPassword', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attuale: datiPassword.attuale, nuova: datiPassword.nuova })
            })
            const json = await response.json()

            if (response.ok) {
                setModificaPassword(false)
                setDatiPassword({ attuale: '', nuova: '', conferma: '' })
                showAlert("Successo", "Password aggiornata con successo", "success")
            } else {
                if (response.status === 401) {
                    setErroriPassword(p => ({ ...p, attuale: json.error }))
                } else {
                    showAlert("Errore", json.error || "Impossibile aggiornare la password", "danger")
                }
            }
        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
        }
    }

    //funzione per il cambio password
    const handleCambiaPassword = async () => {

        showAlert("Elaborazione in corso...", "Stiamo preparando l'email per te.", "info");

        try {
            // Chiamata api
            const response = await fetch('http://localhost:3001/api/v1/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: profilo.email })
            });
            
            if (response.ok) {
                showAlert("Email Inviata!", `Controlla la casella ${profilo.email} per il link di ripristino.`, "success");
            } else {
                const json = await response.json();
                showAlert("Errore", json.error || "Impossibile inviare l'email", "warning");
            }

        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server.", "danger");
        }
    };


    if(!profilo) return null;

    return (
        <>
            <HomeNav />
            <div className="min-vh-100 pt-4 pb-4" style={{ backgroundColor: '#f0f2f5' }}>
        
                <div className="container">
                    
                    {/*Header*/}
                    <div className="mb-4 text-start">
                        <h2 className="fw-bold mb-1 text-dark">
                            Ciao, {profilo.username || profilo.nome}
                        </h2>
                        <p className="text-muted">Gestisci il tuo account</p>
                    </div>

                    <div className="row">
                        
                        {/*sezione dati*/}
                        <div className="col-12 col-lg-6 mb-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="text-muted fw-bold mb-0 small">DATI REGISTRATI</h6>
                                    </div>

                                    <ul className="list-group list-group-flush mb-0">
                                        <li className="list-group-item px-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-secondary fw-semibold">
                                                    {profilo.ruolo === 'gestore' ? 'Nome Struttura' : 'Username'}
                                                </span>
                                                {!modificaNome && (
                                                    <button
                                                        className="btn btn-sm btn-link text-secondary p-0"
                                                        onClick={() => { setModificaNome(true); setNuovoNome(profilo.username || profilo.nome) }}
                                                    >
                                                        <i className="bi bi-pencil-square fs-6"></i>
                                                    </button>
                                                )}
                                            </div>
                                            {modificaNome ? (
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        className="form-control mb-2"
                                                        value={nuovoNome}
                                                        onChange={e => setNuovoNome(e.target.value)}
                                                        style={{ borderRadius: '10px' }}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm fw-semibold"
                                                            style={{ backgroundColor: '#037149', color: 'white', borderRadius: '8px' }}
                                                            onClick={salvaNome}
                                                            disabled={nuovoNome.trim() === (profilo.username || profilo.nome)}
                                                        >
                                                            Salva
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-secondary fw-semibold" style={{ borderRadius: '8px' }} onClick={() => setModificaNome(false)}>
                                                            Annulla
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="fw-bold">{profilo.username || profilo.nome}</span>
                                            )}
                                        </li>

                                        <li className="list-group-item px-0 py-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-secondary fw-semibold">Email Registrata</span>
                                                {!modificaEmail && (
                                                    <button
                                                        className="btn btn-sm btn-link text-secondary p-0"
                                                        onClick={() => { setModificaEmail(true); setNuovaEmail(profilo.email) }}
                                                    >
                                                        <i className="bi bi-pencil-square fs-6"></i>
                                                    </button>
                                                )}
                                            </div>
                                            {modificaEmail ? (
                                                <div className="mt-2">
                                                    <input
                                                        type="email"
                                                        className="form-control mb-2"
                                                        value={nuovaEmail}
                                                        onChange={e => setNuovaEmail(e.target.value)}
                                                        style={{ borderRadius: '10px' }}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm fw-semibold"
                                                            style={{ backgroundColor: '#037149', color: 'white', borderRadius: '8px' }}
                                                            onClick={salvaEmail}
                                                            disabled={nuovaEmail.trim() === profilo.email}
                                                        >
                                                            Salva
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-secondary fw-semibold" style={{ borderRadius: '8px' }} onClick={() => setModificaEmail(false)}>
                                                            Annulla
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="fw-medium text-muted">{profilo.email}</span>
                                            )}
                                        </li>

                                        {profilo.ruolo === 'giocatore' && (
                                            <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                                <span className="text-secondary fw-semibold mb-1 mb-sm-0">Newsletter</span>
                                                {profilo.iscrittoNewsletter ? (
                                                    <span className="text-success fw-bold align-self-start align-self-sm-center">
                                                        Iscritto
                                                    </span>
                                                ) : (
                                                    <span className="text-secondary fw-bold align-self-start align-self-sm-center">
                                                        Non Iscritto
                                                    </span>
                                                )}
                                            </li>
                                        )}

                                        {profilo.ruolo === 'gestore' && (
                                            <>
                                                <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                                    <span className="text-secondary fw-semibold mb-1 mb-sm-0">Partita IVA</span>
                                                    <span className="fw-medium text-muted">{profilo.partitaIva}</span>
                                                </li>
                                                <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                                    <span className="text-secondary fw-semibold mb-1 mb-sm-0">Stato Account</span>
                                                    {profilo.abilitato ? (
                                                        <span className="text-success fw-bold align-self-start align-self-sm-center"><i className="bi bi-check-circle-fill me-1"></i>Approvato</span>
                                                    ) : (
                                                        <span className="text-warning fw-bold align-self-start align-self-sm-center"><i className="bi bi-hourglass-split me-1"></i>In Attesa</span>
                                                    )}
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        {/*sezione sicurezza*/}
                        <div className="col-12 col-lg-6 mb-4">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '14px' }}>
                                <div className="card-body p-4">
                                    <h6 className="text-muted fw-bold mb-3 small">SICUREZZA E ACCESSO</h6>
                                    <div className="d-grid gap-2">
                                        {modificaPassword ? (
                                            <div className="border rounded p-3" style={{ borderRadius: '10px' }}>
                                                <div className="mb-2">
                                                    <label className="form-label small fw-semibold text-secondary">PASSWORD ATTUALE</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${erroriPassword.attuale ? 'is-invalid' : ''}`}
                                                        value={datiPassword.attuale}
                                                        onChange={e => { setDatiPassword(p => ({ ...p, attuale: e.target.value })); setErroriPassword(p => ({ ...p, attuale: undefined })) }}
                                                        style={{ borderRadius: '10px' }}
                                                    />
                                                    {erroriPassword.attuale && <div className="invalid-feedback">{erroriPassword.attuale}</div>}
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label small fw-semibold text-secondary">NUOVA PASSWORD</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${erroriPassword.nuova ? 'is-invalid' : ''}`}
                                                        value={datiPassword.nuova}
                                                        onChange={e => { setDatiPassword(p => ({ ...p, nuova: e.target.value })); setErroriPassword(p => ({ ...p, nuova: undefined })) }}
                                                        style={{ borderRadius: '10px' }}
                                                    />
                                                    {erroriPassword.nuova && <div className="invalid-feedback">{erroriPassword.nuova}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label small fw-semibold text-secondary">CONFERMA NUOVA PASSWORD</label>
                                                    <input
                                                        type="password"
                                                        className={`form-control ${erroriPassword.conferma ? 'is-invalid' : ''}`}
                                                        value={datiPassword.conferma}
                                                        onChange={e => { setDatiPassword(p => ({ ...p, conferma: e.target.value })); setErroriPassword(p => ({ ...p, conferma: undefined })) }}
                                                        style={{ borderRadius: '10px' }}
                                                    />
                                                    {erroriPassword.conferma && <div className="invalid-feedback">{erroriPassword.conferma}</div>}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm fw-semibold" style={{ backgroundColor: '#037149', color: 'white', borderRadius: '8px' }} onClick={salvaPassword}>
                                                        Salva
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary fw-semibold"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => { setModificaPassword(false); setDatiPassword({ attuale: '', nuova: '', conferma: '' }) }}
                                                    >
                                                        Annulla
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-light border text-start py-3 fw-semibold text-dark"
                                                onClick={() => setModificaPassword(true)}
                                            >
                                                Cambia Password
                                            </button>
                                        )}
                                        <button className="btn btn-outline-danger py-3 fw-semibold text-start" >
                                            Elimina l'account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeProfilo;