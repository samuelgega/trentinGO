import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAlert } from '../../contexts/AlertController';
import NotificaVisita from '../../components/homeComponents/NotificaVisita';

const InfoPDI = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [pdi, setPdi] = useState(null);
    const [fotoGrandeIndex, setFotoGrandeIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const ruolo = localStorage.getItem('ruolo')
    const [caricamento, setCaricamento] = useState(false)
    const [giaVisitato, setGiaVisitato] = useState(false)
    const [notifica, setNotifica] = useState(null)

    const registraVisita = () => {
        if (!navigator.geolocation) {
            showAlert("Errore", "Il tuo dispositivo non supporta la geolocalizzazione", "danger")
            return
        }
        setCaricamento(true)
        navigator.geolocation.getCurrentPosition(
            async (posizione) => {
                const lon = posizione.coords.longitude
                const lat = posizione.coords.latitude
                const token = localStorage.getItem('token')
                const idGiocatore = localStorage.getItem('userId')
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/visite/pdi`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idGiocatore, idPDI: pdi._id, posizione: [lon, lat] })
                    })
                    const json = await response.json()
                    if (response.ok) {
                        setGiaVisitato(true)
                        setNotifica({ nome: pdi.properties.nome, punteggio: pdi.properties.punteggio, levelUp: json.levelUp })
                    } else if (response.status === 409) {
                        setGiaVisitato(true)
                        showAlert("Già visitato", "Hai già registrato una visita per questo PDI", "warning")
                    } else if (response.status === 422) {
                        showAlert("Troppo lontano", json.error, "warning")
                    } else {
                        showAlert("Errore", json.error || "Impossibile registrare la visita", "danger")
                    }
                } catch {
                    showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
                } finally {
                    setCaricamento(false)
                }
            },
            (errore) => {
                setCaricamento(false)
                if (errore.code === errore.PERMISSION_DENIED) {
                    showAlert("Permesso negato", "Abilita la geolocalizzazione per registrare la visita", "warning")
                } else {
                    showAlert("Errore", "Impossibile ottenere la posizione", "danger")
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    // Prendo i dati del singolo PDI
    useEffect(() => {
        const fetchPDI = async () => {
            try {
                console.log("ID del PDI:", id);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/pdi/${id}`)

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

    useEffect(() => {
        if (!pdi || ruolo !== 'giocatore') return
        const token = localStorage.getItem('token')
        fetch(`${process.env.REACT_APP_API_URL}/api/v1/visite/giocatore?soloId=true`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(json => {
                const visitato = json.data?.some(v => v.idPDI === pdi._id)
                setGiaVisitato(visitato)
            })
            .catch(() => { })
    }, [pdi, ruolo])

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

    const prossimaFoto = () => {
        setFotoGrandeIndex((prevIndex) => (prevIndex + 1) % immagini.length);
    };

    const fotoPrecedente = () => {
        setFotoGrandeIndex((prevIndex) => (prevIndex - 1 + immagini.length) % immagini.length);
    };


    return (
        <div className="bg-light min-vh-100 pb-5">
            {/*Mostra la prima foto*/}
            <div className="position-relative" style={{ height: '40vh', minHeight: '300px' }}>
                <img
                    src={immagini.length > 0 ? immagini[fotoGrandeIndex] : `${process.env.FRONTEND_URL}/uploads/eventoGenerico.png`}
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
                        <div className="card border-0 shadow-sm p-4 p-md-5 position-relative" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>

                            {/* Badge visitato in alto a destra */}
                            {giaVisitato && ruolo === 'giocatore' && (
                                <div className="position-absolute d-flex align-items-center gap-2 px-3 py-2 shadow" style={{
                                    top: '20px', right: '20px',
                                    backgroundColor: '#037149',
                                    borderRadius: '999px',
                                    zIndex: 10
                                }}>
                                    <span className="material-symbols-outlined fill text-white" style={{ fontSize: '1.1rem' }}>thumb_up</span>
                                    <span className="text-white fw-bold" style={{ fontSize: '0.82rem', letterSpacing: '0.03em' }}>VISITATO</span>
                                </div>
                            )}

                            {/* Header: categoria + nome */}
                            <div className="mb-4 pb-4 border-bottom">
                                <span className="badge text-uppercase px-3 py-2 mb-2 rounded-pill fw-semibold" style={{ backgroundColor: 'rgba(3, 113, 73, 0.1)', color: '#037149', fontSize: '0.8rem' }}>
                                    {pdi.properties.categoria || 'Punto di interesse'}
                                </span>
                                <h1 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em' }}>{pdi.properties.nome}</h1>
                            </div>

                            {/* Info rapide: prezzo + XP */}
                            <div className="row g-3 mb-5">
                                <div className="col-6">
                                    <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0' }}>
                                        <div className="p-2 rounded-3 text-white d-flex" style={{ backgroundColor: '#037149' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>payments</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.7rem' }}>INGRESSO</small>
                                            <span className="fw-bold text-dark">
                                                {pdi.properties.prezzo === 0 || !pdi.properties.prezzo ? 'Gratuito' : `${pdi.properties.prezzo} €`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: '#e6f4ea', border: '1px solid #c3e6cb' }}>
                                        <div className="p-2 rounded-3 text-white d-flex" style={{ backgroundColor: '#137b52' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>star</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.7rem' }}>PUNTI XP</small>
                                            <span className="fw-bold" style={{ color: '#137b52' }}>{pdi.properties.punteggio}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*Descrizione */}
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3" style={{ color: '#012d1d' }}>Descrizione</h4>
                                <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                    {pdi.properties.descrizione || "Nessuna descrizione dettagliata disponibile al momento per questo splendido luogo del Trentino."}
                                </p>
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
                                                        onClick={() => { setFotoGrandeIndex(index); setIsLightboxOpen(true); }}
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
                                <div className="d-flex gap-2">
                                    {ruolo === 'giocatore' && (
                                        <button
                                            className="btn text-white px-5 py-2 fw-semibold rounded-3 shadow-sm"
                                            style={{ backgroundColor: giaVisitato ? '#6c757d' : '#037149' }}
                                            onClick={registraVisita}
                                            disabled={caricamento || giaVisitato}
                                        >
                                            {caricamento ? 'Localizzazione...' : giaVisitato ? 'Già visitato' : 'Registra visita'}
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline-secondary px-5 py-2 fw-semibold rounded-3"
                                        onClick={() => {
                                            const lat = pdi.geometry.coordinates[1];
                                            const lng = pdi.geometry.coordinates[0];
                                            let linkMaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
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
            {/*visualizza le immagini */}
            {isLightboxOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 2000,
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    {/* Contenitore Immagine */}
                    <div
                        className="position-relative d-flex flex-column align-items-center"
                        style={{ cursor: 'default', maxWidth: '90%', maxHeight: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tasto Chiudi X */}
                        <button
                            className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ top: '-25px', right: '-25px', width: '40px', height: '40px', zIndex: 20, border: 'none' }}
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <span className="material-symbols-outlined text-dark">close</span>
                        </button>

                        {/* Immagine*/}
                        <img
                            src={immagini[fotoGrandeIndex]}
                            alt={`${pdi.properties.nome} - Visualizzazione Completa`}
                            className="img-fluid rounded-3 shadow"
                            style={{ maxHeight: '80vh', objectFit: 'contain' }}
                        />

                        {/* Frecce di navigazione */}
                        {immagini.length > 1 && (
                            <>
                                {/* Freccia Sinistra */}
                                <button
                                    className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                    style={{ top: '50%', left: '-25px', transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10, border: 'none' }}
                                    onClick={(e) => { e.stopPropagation(); fotoPrecedente(); }}
                                >
                                    <span className="material-symbols-outlined text-dark">chevron_left</span>
                                </button>

                                {/* Freccia Destra */}
                                <button
                                    className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                    style={{ top: '50%', right: '-25px', transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10, border: 'none' }}
                                    onClick={(e) => { e.stopPropagation(); prossimaFoto(); }}
                                >
                                    <span className="material-symbols-outlined text-dark">chevron_right</span>
                                </button>

                                {/* Contatore Immagini in basso */}
                                <div className="position-absolute start-50 translate-middle-x mt-3 p-2 bg-dark rounded-pill text-white shadow" style={{ bottom: "-50px", fontSize: "0.85rem" }}>
                                    {fotoGrandeIndex + 1} / {immagini.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <NotificaVisita notifica={notifica} onHide={() => setNotifica(null)} />
        </div>
    );
};

export default InfoPDI;