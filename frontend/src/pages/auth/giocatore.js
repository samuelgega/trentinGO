import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'

const statoInizialeForm = {
    username: '',
    email: '',
    password: '',
    confermaPassword: '',
    iscrittoNewsletter: false,
}

const AuthGiocatore = () => {

    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [formData, setFormData] = useState(statoInizialeForm)
    const [errori, setErrori] = useState({})

    const validazioneDati = (dati) => {
        const error = {}

        if (!dati.username.trim()) error.username = "Il nome utente è obbligatorio"
        else if (dati.username.trim().length < 3) error.username = "Il nome utente deve avere almeno 3 caratteri"

        if (!dati.email.trim()) error.email = "L'email è obbligatoria"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dati.email)) error.email = "Inserisci un'email valida"

        if (!dati.password) error.password = "La password è obbligatoria"
        else if (dati.password.length < 8) error.password = "La password deve avere almeno 8 caratteri"

        if (!dati.confermaPassword) error.confermaPassword = "Conferma la password"
        else if (dati.password !== dati.confermaPassword) error.confermaPassword = "Le password non coincidono"

        return error
    }

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

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

        try {
            const response = await fetch('http://localhost:3001/api/v1/giocatori/registrazione', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    iscrittoNewsletter: formData.iscrittoNewsletter,
                })
            })

            if (response.status === 201) {
                showAlert("Registrazione completata.", "Account creato con successo", "success")
                navigate('/')
            } else if (response.status === 409) {
                showAlert("Registrazione non riuscita.", "Username o email già in uso", "danger")
            } else {
                showAlert("Registrazione non riuscita.", "Controllare i dati inseriti o riprovare", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione.", "Controllare la connessione o riprovare più tardi", "danger")
        }
    }

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
<div className="col-11 col-sm-8 col-md-6 col-lg-5">
                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <h2 className="mb-4 text-center">Registrati come Giocatore</h2>

                            <form onSubmit={handleSubmit} onReset={handleReset}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome utente*</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        className="form-control"
                                        placeholder="es. mario_rossi"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.username}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        className="form-control"
                                        placeholder="es. mario@email.com"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.email}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Password*</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        className="form-control"
                                        placeholder="Almeno 8 caratteri"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.password}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Conferma password*</label>
                                    <input
                                        type="password"
                                        name="confermaPassword"
                                        value={formData.confermaPassword}
                                        className="form-control"
                                        placeholder="Ripeti la password"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.confermaPassword}</small>
                                </div>

                                <div className="mb-4 form-check">
                                    <input
                                        type="checkbox"
                                        name="iscrittoNewsletter"
                                        id="iscrittoNewsletter"
                                        checked={formData.iscrittoNewsletter}
                                        className="form-check-input"
                                        onChange={handleInput}
                                    />
                                    <label className="form-check-label" htmlFor="iscrittoNewsletter">
                                        Iscrivimi alla newsletter
                                    </label>
                                </div>

                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button type="reset" className="btn btn-light me-md-2">Svuota Campi</button>
                                    <button type="submit" className="btn btn-primary px-5">Registrati</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AuthGiocatore
