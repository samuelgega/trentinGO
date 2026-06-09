import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import '../../assets/home.css'

const statoInizialeForm = {
    username: '',
    email: '',
    password: ''
}

const AuthAdmin = () => {

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

        const body = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        }
        console.log("JSON inviato:", body)

        //chiamata api
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/amministratori`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (response.status === 201) {
                showAlert("Registrazione completata.", "Account creato con successo", "success")
                navigate(-1)
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
                    <p className="text-muted mt-2 mb-0">Crea account Admin</p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">NOME UTENTE</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    className={`form-control ${errori.username ? 'is-invalid' : ''}`}
                                    placeholder="es. mario_rossi"
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.username && <div className="invalid-feedback">{errori.username}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">EMAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className={`form-control ${errori.email ? 'is-invalid' : ''}`}
                                    placeholder="es. mario@email.com"
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.email && <div className="invalid-feedback">{errori.email}</div>}
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
                                Crea account
                            </button>
                            <button
                                type="reset"
                                className="btn btn-light w-100 py-2"
                                style={{ borderRadius: '10px' }}
                            >
                                Svuota campi
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthAdmin
