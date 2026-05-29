import React from "react";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import HomeNav from "../../components/homeComponents/HomeNav";
import { useAlert } from '../../contexts/AlertController';
import '../../assets/home.css'


const ImpostazioniAccount = () =>{

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
        
                {/* Header pagina */}
                <div className="mb-4 text-center">
                    <h4 className="fw-bold mb-0 text-dark">Impostazioni Account</h4>
                </div>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            
                            {/*Sezione dati */}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '14px' }}>
                                <div className="card-body p-4">
                                    <h6 className="text-muted fw-bold mb-3 small">DATI REGISTRATI</h6>
                                    
                                    <ul className="list-group list-group-flush mb-0">
                                        {/*nome/username */}
                                        <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                            <span className="text-secondary fw-semibold mb-1 mb-sm-0">
                                                {profilo.ruolo === 'gestore' ? 'Nome Struttura' : 'Username'}
                                            </span>
                                            <span className="fw-bold">{profilo.username || profilo.nome}</span>
                                        </li>

                                        {/*email */}
                                        <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                            <span className="text-secondary fw-semibold mb-1 mb-sm-0">Email Registrata</span>
                                            <span className="fw-medium text-muted">{profilo.email}</span>
                                        </li>

                                        {/*dati solo per i giocatori */}
                                        {profilo.ruolo === 'giocatore' && (
                                            <li className="list-group-item d-flex flex-column flex-sm-row justify-content-between px-0 py-3">
                                                <span className="text-secondary fw-semibold mb-1 mb-sm-0">Newsletter</span>
                                                {profilo.iscrittoNewsletter ? (
                                                    <span className="text-success fw-bold align-self-start align-self-sm-center">
                                                        <i className="bi bi-envelope-check-fill me-1"></i>Iscritto
                                                    </span>
                                                ) : (
                                                    <span className="text-secondary fw-bold align-self-start align-self-sm-center">
                                                        <i className="bi bi-envelope-x-fill me-1"></i>Non Iscritto
                                                    </span>
                                                )}
                                            </li>
                                        )}

                                        {/*dati solo per i gestori */}
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
                            
                            {/* Sicurezza*/}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '14px' }}>
                                <div className="card-body p-4">
                                    <h6 className="text-muted fw-bold mb-3 small">SICUREZZA E ACCESSO</h6>
                                    <div className="d-grid gap-2">
                                        {/*da implementare */}
                                        <button 
                                            className="btn btn-light border text-start py-3 fw-semibold text-dark"
                                            onClick={handleCambiaPassword}
                                        >
                                            <i className="bi bi-key-fill me-2 text-warning"></i>Cambia Password
                                        </button>
                                        {/*da implementare */}
                                        <button className="btn btn-outline-danger py-3 fw-semibold" >
                                            <i className="bi bi-box-arrow-right me-2"></i>Elimina dall'account
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

export default ImpostazioniAccount;
