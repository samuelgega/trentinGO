import React, { useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../AlertController';
import AdminNav from './AdminNav';

// Costanti per validazione immagini
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_IMG = 10
const TIPI_IMG = ['image/jpeg', 'image/png', 'image/webp']

// Stato iniziale del form
const statoInizialeForm ={
    nome: '',
    descrizione: '',
    categoria: '',
    punteggio: '',
    prezzo: '',
    dataInizio: '',
    dataFine: '',
    longitudine: '',
    latitudine: ''
}

const CreaEvento = () => {

    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState(statoInizialeForm)
    const [immagini, setImmagini] = useState([])
    const [errori, setErrori] = useState({})
    const { showAlert } = useAlert()

    //funzione validazione dei dati
    const validazioneDati = (dati) => {
        const error = {}

        if (!dati.nome.trim()) error.nome = "Il nome è obbligatorio"
        else if (dati.nome.trim().length < 3) error.nome = "Il nome deve avere almeno 3 caratteri"
        else if (dati.nome.trim().length > 30) error.nome = "Il nome deve avere al massimo 30 caratteri"

        if (!dati.categoria) error.categoria = "Seleziona una categoria"

        if (dati.descrizione.length > 500) error.descrizione = "La descrizione deve avere al massimo 500 caratteri"

        if (dati.punteggio === '' || isNaN(dati.punteggio) || dati.punteggio < 10)
            error.punteggio = "Il punteggio minimo è di 10 punti"

        if (dati.prezzo !== '' && (isNaN(dati.prezzo) || dati.prezzo < 0))
            error.prezzo = "Inserisci un prezzo valido (0 o più)"

        if(!dati.dataInizio) error.dataInizio = "La data di inizio è obbligatoria"
        else if (new Date(dati.dataInizio) < new Date()) error.dataInizio = "La data di inizio deve essere futura"

        if(!dati.dataFine) error.dataFine = "La data di fine è obbligatoria"
        else if (new Date(dati.dataFine) <= new Date(dati.dataInizio)) error.dataFine = "La data di fine deve essere successiva alla data di inizio"

        if(!dati.longitudine && (isNaN(dati.longitudine) || dati.longitudine < -180 || dati.longitudine > 180))
            error.longitudine = "La longitudine deve essere compresa tra -180 e 180"

        if(!dati.latitudine && (isNaN(dati.latitudine) || dati.latitudine < -90 || dati.latitudine > 90))
            error.latitudine = "La latitudine deve essere compresa tra -90 e 90"

        return error
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

        //alidazione dei dati
        const nuoviErrori = validazioneDati(formData)
        setErrori(nuoviErrori)
        if (Object.keys(nuoviErrori).length > 0) return

        //FormData necessario per inviare files
        const submitData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value)
        })
        immagini.forEach((img) => submitData.append('immagini', img))
        
        //aspettare che la api venga fatta
        

   }

   return (
        <>
            <AdminNav />
            <div className="container mt-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Crea nuovo evento</h2>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/gestisci-eventi')}
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
                                    <label className="form-label fw-bold">Nome dell'evento*</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        className="form-control"
                                        placeholder="es. Mercatini di Natale a Trento"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.nome}</small>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Tipologia*</label>
                                    <select
                                        name="tipo"
                                        value={formData.tipo}
                                        className="form-select"
                                        onChange={handleInput}
                                    >   
                                        <option value="">Seleziona categoria</option>
                                        <option value="Musica e Concerti">Musica e Concerti</option>
                                        <option value="Sport e Natura">Sport e Natura</option>
                                        <option value="Arte e Cultura">Arte e Cultura</option>
                                        <option value="Enogastronomia">Enogastronomia</option>
                                        <option value="Fiere e Mercati">Fiere e Mercati</option>
                                        <option value="Famiglia e Bambini">Famiglia e Bambini</option>
                                        <option value="Altro">Altro</option>
                                    </select>
                                    <small className="text-danger">{errori.tipo}</small>
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

                            {/* Dettagli */}
                            <h5 className="text-primary mb-3">2. Dettagli</h5>
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
                            <hr />
                            {/* Date */}
                            <h5 className="text-primary mb-3">3. Date</h5>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Data di Inizio*</label>
                                    <input
                                        type="date"
                                        name="dataInizio"
                                        value={formData.dataInizio}
                                        className="form-control"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.dataInizio}</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Data di Fine*</label>
                                    <input
                                        type="date"
                                        name="dataFine"
                                        value={formData.dataFine}
                                        className="form-control"
                                        onChange={handleInput}
                                    />
                                    <small className="text-danger">{errori.dataFine}</small>
                                </div>
                            </div>
                            <hr />
                            {/* Posizione */}
                            <h5 className="text-primary mb-3">4. Posizione Geografica</h5>
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

export default CreaEvento