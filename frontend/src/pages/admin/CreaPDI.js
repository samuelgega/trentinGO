import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import AdminNav from '../../components/adminComponents/AdminNav'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_IMG = 10
const TIPI_IMG = ['image/jpeg', 'image/png', 'image/webp']

const statoInizialeForm = {
    nome: '',
    categoria: '',
    latitudine: '',
    longitudine: '',
    descrizione: '',
    prezzo: '',
    punteggio: ''
}

const CreaPDI = () => {
    const navigate = useNavigate()

    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState(statoInizialeForm)
    const [immagini, setImmagini] = useState([])
    const [errori, setErrori] = useState({})
    const { showAlert } = useAlert()

    //funzione di validazione dei dati
    const validaDati = (dati) => {
        const err = {}

        if (!dati.nome.trim()) err.nome = "Il nome è obbligatorio"

        if (!dati.categoria) err.categoria = "Seleziona una tipologia"

        if (dati.descrizione.length > 500) err.descrizione = "La descrizione deve avere al massimo 500 caratteri"

        if (dati.latitudine === '' || isNaN(dati.latitudine) || dati.latitudine < -90 || dati.latitudine > 90)
            err.latitudine = "Inserisci una latitudine valida (-90 a 90)"

        if (dati.longitudine === '' || isNaN(dati.longitudine) || dati.longitudine < -180 || dati.longitudine > 180)
            err.longitudine = "Inserisci una longitudine valida (-180 a 180)"

        if (dati.punteggio === '' || isNaN(dati.punteggio) || dati.punteggio < 10)
            err.punteggio = "Il punteggio minimo è di 10 punti"

        if (dati.prezzo !== '' && (isNaN(dati.prezzo) || dati.prezzo < 0))
            err.prezzo = "Inserisci un prezzo valido (0 o più)"

        return err
    }

    //handle degli input
    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        //pulisce l'errore se l'utente corregge
        if (errori[name]) {
            setErrori(prev => ({ ...prev, [name]: undefined }))
        }
    }

    // handler immagini
    const handleImg = (e) => {
        const filesArray = Array.from(e.target.files).slice(0, MAX_IMG)
        const immaginiValide = filesArray.filter(f => f.size < MAX_SIZE && TIPI_IMG.includes(f.type))
        setImmagini(immaginiValide)
    }

    //reset del form
    const handleReset = () => {
        setFormData(statoInizialeForm)
        setErrori({})
        setImmagini([])
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        //validazione dei dati
        const nuoviErrori = validaDati(formData)
        setErrori(nuoviErrori)
        if (Object.keys(nuoviErrori).length > 0) return

        //FormData necessario per inviare files
        const submitData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value)
        })
        immagini.forEach((img) => submitData.append('immagine', img))

        //chiamata API
        try {
            const response = await fetch('/api/v1/pdi', {
                method: 'POST',
                body: submitData,
                headers: {
                    //TODO: header di autenticazione
                }
            })

            if (response.status === 201) {
                showAlert("Operazione completata.", "Il punto di interesse è stato creato con successo", "success")
                navigate(-1)
            } else if (response.status === 500) {
                showAlert("Operazione non riuscita.", "Errore interno al server", "danger")
            } else {
                showAlert("Operazione non riuscita.", "Controllare i dati inseriti o riprovare", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione.", "Controllare la connessione o riprovare più tardi", "danger")
        }
    }

    return (
        <>
            <div className="container mt-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Crea nuovo punto di interesse</h2>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(-1)}
                    >
                        &larr; Annulla e torna indietro
                    </button>
                </div>

                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} onReset={handleReset}>

                            {/* Informazioni base */}
                            <h5 className="text-primary mb-3">1. Informazioni Generali</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-8">
                                    <label className="form-label fw-bold">Nome del punto di interesse*</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        className="form-control"
                                        placeholder="es. Piazza Duomo"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.nome}</small>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Tipologia*</label>
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        className="form-select"
                                        onChange={handleInput}
                                    >
                                        <option value="">Selezionare tipologia</option>
                                        <option value="Monumento">Monumento</option>
                                        <option value="Museo">Museo</option>
                                        <option value="Parco">Parco</option>
                                        <option value="Sentiero">Sentiero</option>
                                        <option value="Lago">Lago</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                    <small className="text-danger">{errori.categoria}</small>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <label className="form-label fw-bold">Descrizione Estesa</label>
                                <textarea
                                    name="descrizione"
                                    value={formData.descrizione}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Inserisci una descrizione dettagliata..."
                                    onChange={handleInput}
                                ></textarea>
                                <small className="text-danger">{errori.descrizione}</small>
                            </div>

                            <hr />

                            {/* Posizione */}
                            <h5 className="text-primary mb-3">2. Posizione Geografica</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Latitudine*</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitudine"
                                        value={formData.latitudine}
                                        className="form-control"
                                        placeholder="Inserire latitudine"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.latitudine}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Longitudine*</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="longitudine"
                                        value={formData.longitudine}
                                        className="form-control"
                                        placeholder="Inserire longitudine"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.longitudine}</small>
                                </div>
                            </div>

                            <hr />

                            {/* Dettagli */}
                            <h5 className="text-primary mb-3">3. Dettagli</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Punteggio*</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="punteggio"
                                        value={formData.punteggio}
                                        className="form-control"
                                        placeholder="Inserire punteggio"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.punteggio}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Prezzo</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="prezzo"
                                        value={formData.prezzo}
                                        className="form-control"
                                        placeholder="Inserire prezzo"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.prezzo}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Foto (URL o File)</label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={handleImg}
                                            accept="image/jpeg, image/png, image/webp"
                                        />
                                        <button
                                            className="btn btn-outline-danger"
                                            type="button"
                                            onClick={() => {
                                                setImmagini([])
                                                if (fileInputRef.current) fileInputRef.current.value = ""
                                            }}
                                        >
                                            Rimuovi foto
                                        </button>
                                    </div>
                                    <small className="text-muted">Puoi selezionare più file contemporaneamente (max. 2MB per file)</small><br />
                                    <small className="text-muted">Tipi di file ammessi: JPEG, PNG, WEBP. Massimo 10 immagini</small>
                                </div>
                            </div>

                            {/* Tasti azione */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <button type="reset" className="btn btn-light me-md-2">Svuota Campi</button>
                                <button type="submit" className="btn btn-primary px-5">Salva PDI</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreaPDI