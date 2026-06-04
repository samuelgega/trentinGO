import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAlert } from '../../contexts/AlertController';
import NotificaVisita from '../../components/homeComponents/NotificaVisita';

const InfoEvento = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const [evento, setEvento] = useState(null);
    const [fotoGrandeIndex, setFotoGrandeIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const ruolo = localStorage.getItem('ruolo');
    const [caricamento, setCaricamento] = useState(false);
    const [giaVisitato, setGiaVisitato] = useState(false);
    const [notifica, setNotifica] = useState(null);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const response = await fetch(`/api/v1/eventi/${id}`);
                if (response.ok) {
                    const json = await response.json();
                    setEvento(json.data || json);
                } else {
                    showAlert("Errore", "Evento non trovato", "danger");
                    navigate(-1);
                }
            } catch (error) {
                console.error(error);
                showAlert("Errore di rete", "Impossibile recuperare i dati", "danger");
            }
        };
        fetchEvento();
    }, [id, navigate, showAlert]);

    if (!evento) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                </div>
            </div>
        );
    }

    const immagini = evento.properties.immagine || [];

    const prossimaFoto = () => {
        setFotoGrandeIndex((prev) => (prev + 1) % immagini.length);
    };

    const fotoPrecedente = () => {
        setFotoGrandeIndex((prev) => (prev - 1 + immagini.length) % immagini.length);
    };

    const formatData = (dataStr) => {
        if (!dataStr) return '—';
        return new Date(dataStr).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const calcolaStato = () => {
        const ora = new Date();
        const inizio = evento.properties.dataInizio ? new Date(evento.properties.dataInizio) : null;
        const fine = evento.properties.dataFine ? new Date(evento.properties.dataFine) : null;
        if (fine) fine.setHours(23, 59, 59, 999);
        if (fine && ora > fine) return { colore: '#dc3545', label: 'Concluso' };
        if (inizio && ora < inizio) return { colore: '#6c757d', label: 'Non ancora iniziato' };
        return { colore: '#28a745', label: 'In corso' };
    };

    const calcolaProgresso = () => {
        if (!evento.properties.dataFine) return null;
        const ora = new Date();
        const fine = new Date(evento.properties.dataFine);
        fine.setHours(23, 59, 59, 999);
        const inizio = evento.properties.dataInizio ? new Date(evento.properties.dataInizio) : fine;
        if (ora < inizio) {
            const giorni = Math.ceil((inizio - ora) / 86400000);
            return { percent: 0, label: `Inizia tra ${giorni} giorn${giorni === 1 ? 'o' : 'i'}`, colore: '#13677b' };
        }
        if (ora > fine) {
            return { percent: 100, label: 'Concluso', colore: '#6c757d' };
        }
        const totale = fine - inizio;
        const trascorso = ora - inizio;
        const percent = totale > 0 ? Math.round((trascorso / totale) * 100) : 100;
        const giorniRimasti = Math.ceil((fine - ora) / 86400000);
        return { percent, label: `${giorniRimasti} giorn${giorniRimasti === 1 ? 'o' : 'i'} rimast${giorniRimasti === 1 ? 'o' : 'i'}`, colore: '#037149' };
    };

    return (
        <div className="bg-light min-vh-100 pb-5">
            {/* Immagine di copertina */}
            <div className="position-relative" style={{ height: '40vh', minHeight: '300px' }}>
                <img
                    src={immagini.length > 0 ? immagini[fotoGrandeIndex] : 'http://localhost:3001/uploads/eventoGenerico.png'}
                    alt={evento.properties.nome}
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

                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 pb-4 border-bottom">
                                {/* Categoria e nome */}
                                <div>
                                    <span className="badge text-uppercase px-3 py-2 mb-2 rounded-pill fw-semibold" style={{ backgroundColor: 'rgba(3, 113, 73, 0.1)', color: '#037149', fontSize: '0.8rem' }}>
                                        {evento.properties.categoria || 'Evento'}
                                    </span>
                                    <h1 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.02em' }}>{evento.properties.nome}</h1>
                                </div>

                                {/* Date in evidenza */}
                                <div
                                    className="d-flex flex-column align-items-center px-3 py-2 rounded-3 align-self-start align-self-sm-center shadow-sm text-center"
                                    style={{ backgroundColor: '#e6f4ea', color: '#137b52', minWidth: '130px' }}
                                >
                                    <span className="material-symbols-outlined mb-1" style={{ fontSize: '1.4rem' }}>calendar_month</span>
                                    <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{formatData(evento.properties.dataInizio)}</span>
                                    {evento.properties.dataFine && evento.properties.dataFine !== evento.properties.dataInizio && (
                                        <>
                                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>fino al</span>
                                            <span className="fw-bold" style={{ fontSize: '0.9rem' }}>{formatData(evento.properties.dataFine)}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Descrizione */}
                            <div className="mb-5">
                                <h4 className="fw-bold mb-3" style={{ color: '#012d1d' }}>Descrizione</h4>
                                <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                    {evento.properties.descrizione || "Nessuna descrizione dettagliata disponibile al momento per questo evento."}
                                </p>
                            </div>

                            {/* Box prezzo */}
                            <div className="row g-4 mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="p-3 rounded-4 d-flex align-items-center gap-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0' }}>
                                        <div className="p-3 rounded-3 text-white d-flex" style={{ backgroundColor: '#037149' }}>
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <small className="text-muted d-block fw-semibold" style={{ fontSize: '0.75rem' }}>PREZZO BIGLIETTO</small>
                                            <span className="fw-bold text-dark fs-5">
                                                {evento.properties.prezzo === 0 || !evento.properties.prezzo ? 'Gratuito' : `${evento.properties.prezzo} €`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Galleria fotografica */}
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
                                                            alt={`${evento.properties.nome} - ${index + 1}`}
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

                            {/* Stato + Slider tempo rimasto */}
                            {calcolaProgresso() && (() => {
                                const prog = calcolaProgresso();
                                const stato = calcolaStato();
                                return (
                                    <div className="mb-4 d-flex align-items-stretch gap-3">
                                        {/* Box stato */}
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-center px-3 py-2 rounded-4 shadow-sm text-center flex-shrink-0"
                                            style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0', minWidth: '130px' }}
                                        >
                                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: stato.colore, display: 'inline-block', marginBottom: '6px' }} />
                                            <span className="fw-bold" style={{ color: stato.colore, fontSize: '0.9rem' }}>{stato.label}</span>
                                        </div>
                                        {/* Barra progresso */}
                                        <div className="p-4 rounded-4 flex-grow-1" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0' }}>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <small className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>TEMPO RIMASTO</small>
                                                <small className="fw-bold" style={{ color: prog.colore, fontSize: '0.85rem' }}>{prog.label}</small>
                                            </div>
                                            <div className="progress rounded-pill" style={{ height: '10px', backgroundColor: '#e2e8f0' }}>
                                                <div
                                                    className="progress-bar rounded-pill"
                                                    style={{ width: `${prog.percent}%`, backgroundColor: prog.colore, transition: 'width 0.6s ease' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Pulsanti in fondo */}
                            <div className="d-flex flex-wrap gap-3 mt-4 pt-4 border-top justify-content-between align-items-center">
                                <button className="btn btn-outline-secondary px-4 py-2 fw-semibold rounded-3" onClick={() => navigate(-1)}>
                                    Torna agli eventi
                                </button>
                                <div className="d-flex gap-2">
                                    {ruolo === 'giocatore' && (
                                        <button
                                            className="btn text-white px-5 py-2 fw-semibold rounded-3 shadow-sm"
                                            style={{ backgroundColor: giaVisitato ? '#6c757d' : '#037149' }}
                                            disabled={caricamento || giaVisitato}
                                        >
                                            {caricamento ? 'Attendere...' : giaVisitato ? 'Già visitato' : 'Registra visita'}
                                        </button>
                                    )}
                                    {evento.geometry?.coordinates?.length === 2 && (
                                        <button
                                            className="btn btn-outline-secondary px-5 py-2 fw-semibold rounded-3"
                                            onClick={() => {
                                                const lat = evento.geometry.coordinates[1];
                                                const lng = evento.geometry.coordinates[0];
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
                                            }}
                                        >
                                            Ottieni indicazioni
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <NotificaVisita notifica={notifica} onHide={() => setNotifica(null)} />

            {/* Lightbox */}
            {isLightboxOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 2000, transition: 'opacity 0.3s ease', cursor: 'pointer' }}
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className="position-relative d-flex flex-column align-items-center"
                        style={{ cursor: 'default', maxWidth: '90%', maxHeight: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ top: '-25px', right: '-25px', width: '40px', height: '40px', zIndex: 20, border: 'none' }}
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <span className="material-symbols-outlined text-dark">close</span>
                        </button>

                        <img
                            src={immagini[fotoGrandeIndex]}
                            alt={`${evento.properties.nome} - Visualizzazione Completa`}
                            className="img-fluid rounded-3 shadow"
                            style={{ maxHeight: '80vh', objectFit: 'contain' }}
                        />

                        {immagini.length > 1 && (
                            <>
                                <button
                                    className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                    style={{ top: '50%', left: '-25px', transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10, border: 'none' }}
                                    onClick={(e) => { e.stopPropagation(); fotoPrecedente(); }}
                                >
                                    <span className="material-symbols-outlined text-dark">chevron_left</span>
                                </button>

                                <button
                                    className="position-absolute btn bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                    style={{ top: '50%', right: '-25px', transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10, border: 'none' }}
                                    onClick={(e) => { e.stopPropagation(); prossimaFoto(); }}
                                >
                                    <span className="material-symbols-outlined text-dark">chevron_right</span>
                                </button>

                                <div className="position-absolute start-50 translate-middle-x mt-3 p-2 bg-dark rounded-pill text-white shadow" style={{ bottom: '-50px', fontSize: '0.85rem' }}>
                                    {fotoGrandeIndex + 1} / {immagini.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoEvento;
