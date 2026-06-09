import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertController';
import '../../assets/home.css';

const ReimpostaPassword = () => {
    //Legge il token dall'URL
    const { token } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({ password: '', confermaPassword: '' });
    const [errori, setErrori] = useState({});

    const validazioneDati = (dati) => {
        const err = {};
        const regex = /(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-[\]\\/])/;

        if (!dati.password) {
            err.password = "La password è obbligatoria";
        } else if (dati.password.length < 8 || !regex.test(dati.password)) {
            err.password = "Deve contenere almeno 8 caratteri, un numero e un simbolo";
        }

        if (!dati.confermaPassword) {
            err.confermaPassword = "Conferma la tua password";
        } else if (dati.password !== dati.confermaPassword) {
            err.confermaPassword = "Le password non coincidono";
        }

        return err;
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errori[name]) {
            setErrori(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuoviErrori = validazioneDati(formData);
        setErrori(nuoviErrori);

        if (Object.keys(nuoviErrori).length > 0) return;

        //chiamata api
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/resetPassword/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nuovaPassword: formData.password })
            });

            const json = await response.json();

            if (response.ok) {
                showAlert("Operazione completata", "Password aggiornata con successo! Ti stiamo reindirizzando...", "success");
                setTimeout(() => navigate('/auth/login'), 2500);
            } else {
                showAlert("Errore", json.error || "Impossibile aggiornare la password.", "danger");
            }

        } catch (error) {
            showAlert("Errore di connessione", "Impossibile comunicare con il server. Riprova più tardi.", "danger");
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4f1 100%)' }}>
            <div className="col-11 col-sm-8 col-md-6 col-lg-4">

                {/* Header */}
                <div className="text-center mb-4">
                    <span className="nav-logo" style={{ fontSize: '2rem' }}>TrentinGO</span>
                    <p className="text-muted mt-2 mb-0">Crea Nuova Password</p>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} noValidate>

                            {/*Nuova Password */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small">NUOVA PASSWORD</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    className={`form-control ${errori.password ? 'is-invalid' : ''}`}
                                    placeholder="Inserisci la nuova password"
                                    onChange={handleInput}
                                    style={{ borderRadius: '10px' }}
                                />
                                {errori.password && (
                                    <div className="invalid-feedback">
                                        {errori.password}
                                    </div>
                                )}
                            </div>

                            {/*Conferma Password */}
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
                                {errori.confermaPassword && (
                                    <div className="invalid-feedback">
                                        {errori.confermaPassword}
                                    </div>
                                )}
                            </div>

                            {/*Salva password */}
                            <button
                                type="submit"
                                className="btn w-100 fw-semibold py-2"
                                style={{ backgroundColor: '#037149', color: 'white', borderRadius: '10px' }}
                            >
                                Salva Password
                            </button>
                        </form>

                        <hr className="my-4" />

                        {/*Torna indietro*/}
                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                                style={{ borderRadius: '10px' }}
                                onClick={() => navigate('/auth/login')}
                            >
                                Annulla e vai al Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReimpostaPassword;