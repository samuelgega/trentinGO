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
                                        <button className="btn btn-sm btn-link text-secondary p-0" title="Modifica dati">
                                            <i className="bi bi-pencil-square fs-5"></i>
                                        </button>
                                    </div>
                                    
                                    <ul className="list-group list-group-flush mb-0">
                                        <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                            <span className="text-secondary fw-semibold mb-1 mb-sm-0">
                                                {profilo.ruolo === 'gestore' ? 'Nome Struttura' : 'Username'}
                                            </span>
                                            <span className="fw-bold">{profilo.username || profilo.nome}</span>
                                        </li>

                                        <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                            <span className="text-secondary fw-semibold mb-1 mb-sm-0">Email Registrata</span>
                                            <span className="fw-medium text-muted">{profilo.email}</span>
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
                                        <button 
                                            className="btn btn-light border text-start py-3 fw-semibold text-dark"
                                            onClick={handleCambiaPassword}
                                        >
                                            Cambia Password
                                        </button>
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