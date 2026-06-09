import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import '../../assets/home.css'

const statoInizialeForm = {
    nome: '',
    email: '',
    password: '',
    confermaPassword: '',
    partitaIva: '',
}

const AuthGestore = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [formData, setFormData] = useState(statoInizialeForm)
    const [errori, setErrori] = useState({})

    const validazioneDati = (dati) => {
        const error = {}

        if (!dati.nome.trim()) error.nome = "Il nome della struttura è obbligatorio"
        else if (dati.nome.trim().length < 3) error.nome = "Il nome della struttura deve avere almeno 3 caratteri"

        if (!dati.email.trim()) error.email = "L'email è obbligatoria"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dati.email)) error.email = "Inserisci un'email valida"

        if (!dati.password) error.password = "La password è obbligatoria"
        else if (dati.password.length < 8) error.password = "La password deve avere almeno 8 caratteri"

        if (!dati.confermaPassword) error.confermaPassword = "Conferma la password"
        else if (dati.password !== dati.confermaPassword) error.confermaPassword = "Le password non coincidono"

        if (!dati.partitaIva.trim()) error.partitaIva = "La partita IVA è obbligatoria"
        else if (!/^\d{11}$/.test(dati.partitaIva.trim())) error.partitaIva = "La partita IVA deve essere di 11 cifre"

        return error
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errori[name]) {
            setErrori(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleReset = () => {
        setFormData(statoInizialeForm)
        setErrori({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const nuoviErrori = validazioneDati(formData)
        setErrori(nuoviErrori)

        if (Object.keys(nuoviErrori).length > 0) return

        const body = {
            nome: formData.nome,
            email: formData.email,
            password: formData.password,
            partitaIva: formData.partitaIva,
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/gestori`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (response.status === 201) {
                showAlert("Registrazione completata.", "Account creato con successo", "success")
                navigate(-1)
            } else if (response.status === 409) {
                const data = await response.json()
                if (data.error === "Partita IVA già esistente") {
                    showAlert("Registrazione non riuscita.", "Partita IVA già presente nel database", "danger")
                } else {
                    showAlert("Registrazione non riuscita.", "Nome o email già in uso", "danger")
                }
            } else {
                showAlert("Registrazione non riuscita.", "Controllare i dati inseriti o riprovare", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione.", "Controllare la connessione o riprovare più tardi", "danger")
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4f1 100%)' }}>
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">

                {/* Header */}
                <div className="text-center mb-4">
                    <span className="nav-logo" style={{ fontSize: '2rem' }}>TrentinGO</span>
                    <p className="text-muted mt-2 mb-0">Crea il tuo account gestore</p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">NOME STRUTTURA</label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    className={`form-control ${errori.nome ? 'is-invalid' : ''}`}
                                    placeholder=""
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.nome && <div className="invalid-feedback">{errori.nome}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">EMAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className={`form-control ${errori.email ? 'is-invalid' : ''}`}
                                    placeholder=""
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.email && <div className="invalid-feedback">{errori.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">PARTITA IVA</label>
                                <input
                                    type="text"
                                    name="partitaIva"
                                    value={formData.partitaIva}
                                    className={`form-control ${errori.partitaIva ? 'is-invalid' : ''}`}
                                    placeholder="11 cifre"
                                    onChange={handleInput}
                                    maxLength={11}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.partitaIva && <div className="invalid-feedback">{errori.partitaIva}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    className={`form-control ${errori.password ? 'is-invalid' : ''}`}
                                    placeholder="Almeno 8 caratteri"
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.password && <div className="invalid-feedback">{errori.password}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary small">CONFERMA PASSWORD</label>
                                <input
                                    type="password"
                                    name="confermaPassword"
                                    value={formData.confermaPassword}
                                    className={`form-control ${errori.confermaPassword ? 'is-invalid' : ''}`}
                                    placeholder="Ripeti la password"
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.confermaPassword && <div className="invalid-feedback">{errori.confermaPassword}</div>}
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 fw-semibold py-2 mb-2"
                                style={{ backgroundColor: '#037149', color: 'white', borderRadius: '10px' }}
                            >
                                Invia richiesta di creazione account
                            </button>
                            <button
                                type="reset"
                                className="btn btn-light w-100 py-2"
                                style={{ borderRadius: '10px' }}
                            >
                                Svuota campi
                            </button>
                        </form>

                        <hr />
                        <div className="mb-4">
                            <p className="text-center text-muted small mb-2">Sei un giocatore?</p>
                            <button
                                className="btn btn-outline-secondary w-100 py-2"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate('/auth/giocatore')}
                            >
                                Registrati come giocatore
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-center text-muted small mb-2">Hai già un account?</p>
                            <button
                                className="btn btn-outline-secondary w-100 py-2"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate('/auth/login')}
                            >
                                Accedi
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthGestore
