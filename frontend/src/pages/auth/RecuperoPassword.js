import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import '../../assets/home.css'


const RecuperoPassword = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [errori, setErrori] = useState({})
    const [datiEmail, setEmail] = useState('')

    const validazioneDati = (dati) => {
        const error = {}

        if (!datiEmail.trim()) {
            error.email = "L'email è obbligatoria"
        } else if (!/\S+@\S+\.\S+/.test(datiEmail)) {
            error.email = "Inserisci un indirizzo email valido"
        }

        return error;

    }


    const handleInput = (e) => {
        setEmail(e.target.value)
        if (errori.email) {
            setErrori({})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const nuoviErrori = validazioneDati(datiEmail)
        setErrori(nuoviErrori)

        if (Object.keys(nuoviErrori).length > 0) return

        //backend da implementare
        try{

            //Simulazione successo
            showAlert("Operazione completata", "Se l'email esiste, ti abbiamo inviato un link di recupero.", "success")
            setEmail('')
            
        } catch (error) {
            showAlert("Errore di connessione", "Impossibile collegarsi al server.", "danger")
        }
    
    }



    return(
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4f1 100%)' }}>
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">

                {/* Header */}
                <div className="text-center mb-4">
                    <span className="nav-logo" style={{ fontSize: '2rem' }}>TrentinGO</span>
                    <p className="text-muted mt-2 mb-0">Recupera Password</p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">E-MAIL</label>
                                <p className="text-muted small ">
                                    Inserisci l'email associata al tuo account per ricevere le istruzioni di ripristino.
                                </p>
                                <input
                                    type="email"
                                    name="email"
                                    value={datiEmail}
                                    className={`form-control ${errori.email ? 'is-invalid' : ''}`}
                                    placeholder=""
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.email && (
                                    <div className="invalid-feedback">
                                        {errori.email}
                                    </div>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                className="btn w-100 fw-semibold py-2"
                                style={{ backgroundColor: '#037149', color: 'white', borderRadius: '10px' }}
                            >
                                Invia Link di Recupero
                            </button>
                        </form>

                        <hr className="my-4" />
                        
                        <div>
                            <button
                                className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate(-1)}
                            >
                                &larr; Torna indietro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default RecuperoPassword;