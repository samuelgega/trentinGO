import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAlert } from '../../contexts/AlertController';

const InfoPDI = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    
    const [pdi, setPdi] = useState(null);
   const [fotoGrandeIndex, setFotoGrandeIndex] = useState(0);

    // Prendo i dati del singolo PDI
    useEffect(() => {
        const fetchPDI = async () => {
            try {
                console.log("ID del PDI:", id);
                const response = await fetch(`http://localhost:3001/api/v1/pdi/${id}`)
                
                if (response.ok) {
                    const json = await response.json()
                    setPdi(json.data || json)
                } else {
                    showAlert("Errore", "PDI non trovato", "danger")
                    navigate(-1)
                }
            } catch (error) {
                console.error(error);
                showAlert("Errore di rete", "Impossibile recuperare i dati", "danger")
            } 
        }
    
        fetchPDI()
    }, [id, navigate, showAlert])

    //guardia per completare i dati di pdi
    if (!pdi) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                </div>
            </div>
        );
    }

    //funzioni per il carosello di immagini
    const immagini = pdi.properties.immagine || [];
    

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/*Mostra la prima foto*/}
            <div className="position-relative" style={{ height: '40vh', minHeight: '300px' }}>
                <img 
                    src={immagini.length > 0 ? immagini[fotoGrandeIndex] : 'http://localhost:3001/uploads/eventoGenerico.png'} 
                    alt={pdi.properties.nome}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'all 0.3s ease' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 50%)' }}></div>
                
                {/* Pulsante Torna Indietro */}
                <button 
                    className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{ top: '20px', left: '20px', width: '45px', height: '45px', zIndex: 10, border: 'none' }}
                    onClick={() => navigate(-1)}
                    title="Torna indietro"
                >
                    <span className="material-symbols-outlined text-dark">arrow_back</span>
                </button>
            </div>

            {/* Informazioni */}
            <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 5 }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-9">
                        <div className="card border-0 shadow-sm p-4 p-md-5" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
                            
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-4 border-bottom">
                                {/*Categoria */}
                                <div>
                                    <span className="badge text-uppercase px-3 py-2 mb-2 rounded-pill fw-semibold" style={{ backgroundColor: 'rgba(3, 113, 73, 0.1)', color: '#037149', fontSize: '0.8rem' }}>
                                        {pdi.properties.categoria || 'Punto di interesse'}
                                    </span>
                                    {/*Nome */}
                                    <h1 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.02em' }}>{pdi.properties.nome}</h1>
                                </div>
                                
                                {/*Punteggio*/}
                                <div 
                                    className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill align-self-start align-self-sm-center shadow-sm"
                                    style={{ backgroundColor: '#e6f4ea', color: '#137b52', fontWeight: '700', fontSize: '1.1rem' }}
                                >
                                    {pdi.properties.punteggio}
                                </div>
                            </div>

                            {/*Descrizione */}
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3" style={{ color: '#012d1d' }}>Descrizione</h4>
                                <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                    {pdi.properties.descrizione || "Nessuna descrizione dettagliata disponibile al momento per questo splendido luogo del Trentino."}
                                </p>
                            </div>

                            {/*Box per il prezzo */}
                            <div className="row g-4 mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0' }}>
                                        <div className="p-3 rounded-3 text-white d-flex" style={{ backgroundColor: '#037149' }}>
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>PREZZO INGRESSO</small>
                                            <span className="fw-bold text-dark fs-5">
                                                {pdi.properties.prezzo === 0 || !pdi.properties.prezzo ? 'Gratuito' : `${pdi.properties.prezzo} €`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*Tutte le foto */}
                            {immagini.length > 0 && (
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3" style={{ color: '#012d1d' }}>Galleria Fotografica</h4>
                                <div className="row g-3">
                                    {immagini.map((urlFoto, index) => {
                                        const isSelezionata = index === fotoGrandeIndex;
                                        return (
                                            <div key={index} className="col-6 col-sm-4 col-md-3">
                                                <div 
                                                    className="rounded-3 overflow-hidden shadow-sm ratio ratio-4x3" 
                                                    style={{ 
                                                        cursor: 'pointer',
                                                        border: isSelezionata ? '3px solid #137b52' : '3px solid transparent',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onClick={() => setFotoGrandeIndex(index)}
                                                >
                                                    <img 
                                                        src={urlFoto} 
                                                        alt={`${pdi.properties.nome} - ${index + 1}`} 
                                                        className="w-100 h-100 object-fit-cover"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            )}
                            {/* Pulsanti in fondo alla pagina */}
                            <div className="d-flex flex-wrap gap-3 mt-4 pt-4 border-top justify-content-between align-items-center">
                                <button className="btn btn-outline-secondary px-4 py-2 fw-semibold rounded-3" onClick={() => navigate(-1)}>
                                    Torna alla mappa
                                </button>
                                <button 
                                    className="btn text-white px-5 py-2 fw-semibold rounded-3 shadow-sm" 
                                    style={{ backgroundColor: '#137b52' }}
                                    onClick={() => {
                                        const lat = pdi.geometry.coordinates[1];
                                        const lng = pdi.geometry.coordinates[0];
                                        //pulisce il nome del luogo
                                        const nomeLuogo = encodeURIComponent(pdi.properties.nome);
                                        //Url per google maps 
                                        let linkMaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                        //apre maps in una nuova scheda
                                        window.open(linkMaps, '_blank');
                                    }}
                                >
                                    Ottieni indicazioni
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPDI;