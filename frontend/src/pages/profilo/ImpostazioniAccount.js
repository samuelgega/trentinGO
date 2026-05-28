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

    //dati da eliminare
    const mockGiocatore = {
        _id: "111",
        username: "mario_rossi99",
        email: "mario.rossi@email.com",
        ruolo: "giocatore"
    };

    const mockGestore = {
        _id: "222",
        nome: "Museo MUSE",
        email: "info@muse.it",
        partitaIva: "00264570226",
        abilitato: true,
        ruolo: "gestore"
    };

    const mockAdmin = {
        _id: "333",
        username: "admin_master",
        email: "admin@trentingo.it",
        ruolo: "amministratore"
    };

    useEffect(() => {

        //decommentare per vedere la visualizzazione dei vari utenti
        setProfilo(mockGiocatore);
        //setProfilo(mockGestore);
        //setProfilo(mockAdmin);
    },[]);

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

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ImpostazioniAccount;
