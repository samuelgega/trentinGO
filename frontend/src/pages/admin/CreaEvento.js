import React, { useState,useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertController';

// Costanti per validazione immagini
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_IMG = 10
const TIPI_IMG = ['image/jpeg', 'image/png', 'image/webp']

// Stato iniziale del form
const statoInizialeForm ={
    nome: '',
    descrizione: '',
    categoria: '',
    prezzo: '',
    dataInizio: '',
    dataFine: '',
    longitudine: '',
    latitudine: '',
    pdiCollegato: ''
}

const CreaEvento = () => {

    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState(statoInizialeForm)
    const [immagini, setImmagini] = useState([])
    const [errori, setErrori] = useState({})
    const { showAlert } = useAlert()
    const [menuPdiAperto, setMenuPdiAperto] = useState(false); 

    //prendo la lista dei PDI per poterli collegare all'evento
    const [listaPDI, setListaPDI] = useState([])

    useEffect(() => {
        const fetchPDI = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/pdi');
                if (response.ok) {
                    const json = await response.json();
                    setListaPDI(json.data);
                }
            } catch (error) {
                console.error("Impossibile caricare i PDI:", error);
            }
        };
        fetchPDI();
    }, []);

    //filtro listaPDI
    const [ricercaPDI, setRicercaPDI] = useState("");
    const pdiFiltrati = listaPDI.filter(pdi => 
        pdi.properties.nome.toLowerCase().includes(ricercaPDI.toLowerCase())
    );

    //funzione validazione dei dati
    const validazioneDati = (dati) => {
        const error = {}

        if (!dati.nome.trim()) error.nome = "Il nome è obbligatorio"
        if (!dati.categoria) error.categoria = "Seleziona una categoria"
        if (dati.descrizione.length > 500) error.descrizione = "La descrizione deve avere al massimo 500 caratteri"
        if (dati.prezzo !== '' && (isNaN(dati.prezzo) || dati.prezzo < 0))
            error.prezzo = "Inserisci un prezzo valido (0 o più)"

        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0); 

        if (!dati.dataInizio) {
            error.dataInizio = "La data di inizio è obbligatoria";
        } else {
            const dataInizioObj = new Date(dati.dataInizio);
            dataInizioObj.setHours(0, 0, 0, 0);
            if (dataInizioObj < oggi) error.dataInizio = "La data di inizio non può essere passata";
        }

        if (!dati.dataFine) {
            error.dataFine = "La data di fine è obbligatoria";
        } else {
            const dataInizioObj = new Date(dati.dataInizio);
            dataInizioObj.setHours(0,0,0,0);
            const dataFineObj = new Date(dati.dataFine);
            dataFineObj.setHours(0,0,0,0);
            
            if (dataFineObj < dataInizioObj) error.dataFine = "La data di fine deve essere uguale o successiva alla data di inizio";
        }

        if (dati.latitudine === '' || isNaN(dati.latitudine) || dati.latitudine < -90 || dati.latitudine > 90)
            error.latitudine = "Inserisci una latitudine valida (-90 a 90)"

        if (dati.longitudine === '' || isNaN(dati.longitudine) || dati.longitudine < -180 || dati.longitudine > 180)
            error.longitudine = "Inserisci una longitudine valida (-180 a 180)"

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

    //handle per il menu a tendina dei PDI collegabili
    const handlePdiChange = (e) => {
        const pdiSelezionatoId = e.target.value;
        
        if (!pdiSelezionatoId) {
            setFormData(prev => ({ ...prev, pdiCollegato: '', latitudine: '', longitudine: '' }));
            return;
        }

        //Trovo il PDI completo dalla lista
        const pdi = listaPDI.find(p => p._id === pdiSelezionatoId);
        
        if (pdi && pdi.geometry && pdi.geometry.coordinates) {
            const [longitudine, latitudine] = pdi.geometry.coordinates;
            
            setFormData(prev => ({
                ...prev,
                pdiCollegato: pdiSelezionatoId,
                latitudine: latitudine,
                longitudine: longitudine
            }));
            
            //Tolgo eventuali errori legati al PDI con latitudine e longitudine
            setErrori(prev => ({ ...prev, pdiCollegato: undefined, latitudine: undefined, longitudine: undefined }));
        }
    }


    //submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        //validazione dei dati
        const nuoviErrori = validazioneDati(formData)      
        setErrori(nuoviErrori)

        if (Object.keys(nuoviErrori).length > 0) {
            console.log("ATTENZIONE: Salvataggio bloccato. Errori trovati:", nuoviErrori);
            return;
        }

        //FormData necessario per inviare files
        const submitData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value)
        })
        immagini.forEach((img) => submitData.append('immagine', img))
        
        try{
            const response = await fetch('http://localhost:3001/api/v1/eventi', {
                method: 'POST',
                body: submitData
            })

            if (response.status === 201) {
                console.log("Evento creato con successo!")
                showAlert("Operazione completata.", "L'evento è stato creato con successo", "success")
                navigate(-1)
            } else if (response.status === 500) {
                console.error("Errore interno del server durante la creazione dell'evento.")
                showAlert("Operazione non riuscita.", "Errore interno al server", "danger")
            } else {
                console.error("Errore sconosciuto durante la creazione dell'evento. Status code:", response.status)
                showAlert("Operazione non riuscita.", "Controllare i dati inseriti o riprovare", "danger")
            } 
        }catch (error) {
            console.error("Errore di connessione durante la creazione dell'evento:", error)
            showAlert("Errore di connessione.", "Controllare la connessione o riprovare più tardi", "danger")
        }
    
        
    
   }

   return (
        <>
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Crea nuovo evento</h2>
                    <button
                        className="btn btn-trentingo-outline"
                        onClick={() => navigate(-1)}
                    >
                        &larr; Annulla e torna indietro
                    </button>
                </div>
                
                <div className="card evento-card shadow border-0">
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} onReset={handleReset}>
                            {/* Informazioni base */}
                            <h5 className="text-trentingo mb-3">1. Informazioni Generali</h5>
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
                                        name="categoria"
                                        value={formData.categoria}
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
                                    <small className="text-danger">{errori.categoria}</small>
                                </div>
                            </div>
                            <div className="row g-3 mb-4">
                                <div className="col-12">
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
                            </div>
                            <hr />

                            {/* Dettagli */}
                            <h5 className="text-trentingo mb-3">2. Dettagli</h5>
                            <div className="row g-3 mb-4">
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
                            <h5 className="text-trentingo mb-3">3. Date</h5>
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
                            <h5 className="text-trentingo mb-3">4. Posizione Geografica</h5>
                            <div className="row g-3 mb-3">
                                <div className="col-12 position-relative">
                                    <label className="form-label fw-bold">Collega a un PDI esistente</label>
                                    <div 
                                        className="form-select shadow-sm" 
                                        onClick={() => setMenuPdiAperto(!menuPdiAperto)}
                                        style={{ cursor: 'pointer', borderColor: 'var(--primary)' }}
                                    >
                                        {formData.pdiCollegato 
                                            ? listaPDI.find(p => p._id === formData.pdiCollegato)?.properties.nome 
                                            : "-- Nessun PDI (Inserire le coordinate manualmente) --"}
                                    </div>
                                    {menuPdiAperto && (
                                        <div 
                                            className="card evento-card position-absolute w-100 shadow mt-1" 
                                            style={{ top: '100%', left: 0, zIndex: 1000, border: '1px solid var(--primary)' }}
                                        >
                                            <div className="card-body p-2">
                                                <input 
                                                    type="text" 
                                                    className="evento-search-input mb-2" 
                                                    placeholder="Cerca PDI per nome"
                                                    value={ricercaPDI}
                                                    onChange={(e) => setRicercaPDI(e.target.value)}
                                                    autoFocus
                                                />
                                                
                                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                    <div 
                                                        className="p-2 border-bottom text-trentingo fw-bold" 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => { 
                                                            handlePdiChange({ target: { value: '' } }); 
                                                            setMenuPdiAperto(false); 
                                                        }}
                                                    >
                                                        -- Nessun PDI --
                                                    </div>
                                                    
                                                    {pdiFiltrati.length > 0 ? (
                                                        pdiFiltrati.map(pdi => (
                                                            <div 
                                                                key={pdi._id} 
                                                                className="p-2 border-bottom" 
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => { 
                                                                    handlePdiChange({ target: { value: pdi._id } }); 
                                                                    setMenuPdiAperto(false); 
                                                                    setRicercaPDI("");
                                                                }}
                                                            >
                                                                {pdi.properties.nome} <small className="text-muted">({pdi.properties.categoria})</small>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-2 text-muted">Nessun PDI trovato...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                <button type="submit" 
                                className="btn btn-trentingo px-5" 
                                onClick={handleSubmit}>
                                    Salva Evento</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default CreaEvento