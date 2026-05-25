import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import '../../assets/home.css'

const AuthLogin = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [errori, setErrori] = useState({})
    const [credenziali, setCredenziali] = useState({ email: '', password: '' })

    const validazioneDati = (dati) => {
        const error = {}

        if (!dati.email.trim()) error.email = "L'email è obbligatoria"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dati.email)) error.email = "Inserisci un'email valida"

        if (!dati.password) error.password = "La password è obbligatoria"

        return error
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setCredenziali(prev => ({ ...prev, [name]: value }))

        if (errori[name]) {
            setErrori(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const nuoviErrori = validazioneDati(credenziali)
        setErrori(nuoviErrori)

        if (Object.keys(nuoviErrori).length > 0) return

        try {
            const body = {
                credenziale: credenziali.email,
                password: credenziali.password,
            }

            const response = await fetch('http://localhost:3001/api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (response.status === 200) {
                localStorage.setItem('token', response.token)
                localStorage.setItem('ruolo', response.data.ruolo)
                localStorage.setItem('userId', response.data.id)
                showAlert("Registrazione completata.", "Account creato con successo", "success")
                navigate(-1)
            } else if (response.status === 400) {
                showAlert("Login fallito", "Username o password mancanti", "danger")
            } else {
                showAlert("Login fallito", "Username o password errati", "danger")
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
                    <p className="text-muted mt-2 mb-0">Login</p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">MAIL O USERNAME</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={credenziali.email}
                                    className={`form-control ${errori.email ? 'is-invalid' : ''}`}
                                    placeholder=""
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
                                    value={credenziali.password}
                                    className={`form-control ${errori.password ? 'is-invalid' : ''}`}
                                    placeholder=""
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.password && <div className="invalid-feedback">{errori.password}</div>}
                            </div>
                            <div className="text-end mt-2">
                                <span
                                    className="small fw-semibold text-decoration-none"
                                    style={{ color: '#037149', cursor: 'pointer' }}
                                    onClick={() => navigate('/auth/recupero-password')}
                                >
                                    Hai dimenticato la password?
                                </span>
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 fw-semibold py-2 mb-2"
                                style={{ backgroundColor: '#037149', color: 'white', borderRadius: '10px' }}
                            >
                                Accedi
                            </button>
                        </form>

                        <hr />
                        <div className="mb-4">
                            <p className="text-center text-muted small mb-2">Non sei registrato?</p>
                            <button
                                className="btn btn-outline-secondary w-100 py-2"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate('/auth/giocatore')}
                            >
                                Registrati
                            </button>
                        </div>
                        <div className="mb-4">
                            <button
                                className="btn btn-outline-secondary btn-sn w-30 py-2"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate(-1)}
                            >
                                ← Torna indietro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLogin
