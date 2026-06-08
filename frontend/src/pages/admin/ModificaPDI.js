import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'

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

const ModificaPDI = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState(statoInizialeForm)
    const [immagini, setImmagini] = useState([])
    const [errori, setErrori] = useState({})
    //bottone salva 
    const [datiModificati, setDatiModificati] = useState(false)

    const { showAlert } = useAlert()

    //Recupero i dati del PDI all'avvio della pagina
    useEffect(() => {
        const fetchPDI = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/v1/pdi/${id}`)
                if (response.ok) {
                    const json = await response.json()
                    const pdi = json.data
                    
                    //Pre-compipilazione del form con i dati del PDI selezionato
                    setFormData({
                        nome: pdi.properties.nome || '',
                        categoria: pdi.properties.categoria || '',
                        descrizione: pdi.properties.descrizione || '',
                        latitudine: pdi.geometry.coordinates[1] || '',
                        longitudine: pdi.geometry.coordinates[0] || '',
                        prezzo: pdi.properties.prezzo || 0,
                        punteggio: pdi.properties.punteggio || 0
                    })
                } else {
                    showAlert("Errore", "PDI non trovato", "danger")
                    navigate(-1)
                }
            } catch (error) {
                showAlert("Errore di rete", "Impossibile recuperare i dati", "danger")
            } 
        }

        fetchPDI()
    }, [id, navigate, showAlert])

    // Funzione di validazione dei dati
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

    // Handler degli input
    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setDatiModificati(true) 

        if (errori[name]) {
            setErrori(prev => ({ ...prev, [name]: undefined }))
        }
    }

    // Handler immagini
    const handleImg = (e) => {
        const filesArray = Array.from(e.target.files).slice(0, MAX_IMG)
        const immaginiValide = filesArray.filter(f => f.size < MAX_SIZE && TIPI_IMG.includes(f.type))
        setImmagini(immaginiValide)
        
        if(immaginiValide.length > 0) {
            setDatiModificati(true)
        }
    }

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        const nuoviErrori = validaDati(formData)
        setErrori(nuoviErrori)
        if (Object.keys(nuoviErrori).length > 0) return

        const submitData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value)
        })
        
        immagini.forEach((img) => submitData.append('immagine', img))

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3001/api/v1/pdi/${id}`, {
                method: 'PUT', 
                headers: { 'Authorization': `Bearer ${token}` },
                body: submitData
            })

            const data = await response.json()

            if (response.status === 200) {
                showAlert("Operazione completata.", "Il punto di interesse è stato modificato con successo", "success")
                navigate(-1)
            } else if (response.status === 400) {
                showAlert("Errore di validazione.", data.error || "Controlla i dati inseriti", "danger")
            } else {
                showAlert("Operazione non riuscita.", "Errore interno al server", "danger")
            }
        } catch (error) {
            showAlert("Errore di connessione.", "Controllare la connessione o riprovare più tardi", "danger")
        }
    }

    return (
        <>
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Modifica PDI: {formData.nome}</h2>
                    <button
                        className="btn btn-trentingo-outline"
                        onClick={() => navigate(-1)}
                    >
                        &larr; Torna indietro
                    </button>
                </div>

                <div className="card shadow pdi-card border-0">
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} noValidate>
                            {/*Nome */}
                            <h5 className="text-trentingo mb-3">1. Informazioni Generali</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-8">
                                    <label className="form-label fw-bold">Nome del punto di interesse*</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        className="form-control"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.nome}</small>
                                </div>
                                {/*Tipologia */}
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Tipologia*</label>
                                    <select
                                        name="categoria"
                                        value={formData.categoria}
                                        className="form-select"
                                        onChange={handleInput}
                                    >
                                        <option value="">Selezionare tipologia</option>
                                        <option value="Chiesa">Chiesa</option>
                                        <option value="Castello">Castello</option>
                                        <option value="Monumento">Monumento</option>
                                        <option value="Museo">Museo</option>
                                        <option value="Parco">Parco</option>
                                        <option value="Montagna">Montagna</option>
                                        <option value="Lago">Lago</option>
                                        <option value="Santuario">Santuario</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                    <small className="text-danger">{errori.categoria}</small>
                                </div>
                            </div>
                            {/*Descrizione */}
                            <div className="row g-3 mb-4">
                                <label className="form-label fw-bold">Descrizione Estesa</label>
                                <textarea
                                    name="descrizione"
                                    value={formData.descrizione}
                                    className="form-control"
                                    rows="4"
                                    onChange={handleInput}
                                ></textarea>
                                <small className="text-danger">{errori.descrizione}</small>
                            </div>

                            <hr />
                            {/*Posizione */}
                            <h5 className="text-trentingo mb-3">2. Posizione Geografica</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Latitudine*</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="latitudine"
                                        value={formData.latitudine}
                                        className="form-control"
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
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.longitudine}</small>
                                </div>
                            </div>

                            <hr />
                            {/*Punteggio */}
                            <h5 className="text-trentingo mb-3">3. Dettagli e Immagini aggiuntive</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Punteggio*</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="punteggio"
                                        value={formData.punteggio}
                                        className="form-control"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.punteggio}</small>
                                </div>
                                {/*Prezzo */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Prezzo</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="prezzo"
                                        value={formData.prezzo}
                                        className="form-control"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.prezzo}</small>
                                </div>
                                {/*Immagini */}
                                <div className="col-md-12 mt-4">
                                    <label className="form-label fw-bold">Aggiungi nuove foto a quelle esistenti</label>
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
                                            Annulla foto
                                        </button>
                                    </div>
                                    <small className="text-muted">Seleziona i file per AGGIUNGERE foto a quelle che hai già salvato nel database.</small>
                                </div>
                            </div>

                            {/* Tasti azione */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                {datiModificati ? (
                                    <button type="submit" className="btn btn-trentingo px-5 fw-bold">
                                        Salva Modifiche
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-secondary px-5" disabled>
                                        Nessuna modifica rilevata
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default ModificaPDI