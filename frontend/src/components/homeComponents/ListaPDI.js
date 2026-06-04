import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertController'
import NotificaVisita from './NotificaVisita'

// Mappa ogni categoria alla relativa icona Material Symbols
const ICONE_CATEGORIA = {
    lago: 'water',
    montagna: 'landscape',
    castello: 'castle',
    museo: 'museum',
    santuario: 'church',
    chiesa: 'church',
}

const ListaPDI = ({ pdiFiltrati, categorie, ricerca, setRicerca, categoriaSelezionata, setCategoriaSelezionata, PdiSelezionatoLista, pdiSelezionatoMappa, pdiVisitati, setPdiVisitati }) => {

    const navigate = useNavigate();
    const { showAlert } = useAlert()
    const ruolo = localStorage.getItem('ruolo')
    const [pdiInCaricamento, setPdiInCaricamento] = useState(null)
    const [notifica, setNotifica] = useState(null)
    const [filtroVisita, setFiltroVisita] = useState('tutti')
    const [filtriAperti, setFiltriAperti] = useState(false)

    const registraVisita = (pdi) => {
        if (!navigator.geolocation) {
            showAlert("Errore", "Il tuo dispositivo non supporta la geolocalizzazione", "danger")
            return
        }
        setPdiInCaricamento(pdi._id)
        navigator.geolocation.getCurrentPosition(
            async (posizione) => {
                const lon = posizione.coords.longitude
                const lat = posizione.coords.latitude
                const token = localStorage.getItem('token')
                const idGiocatore = localStorage.getItem('userId')
                try {
                    const response = await fetch('http://localhost:3001/api/v1/visite/pdi', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idGiocatore, idPDI: pdi._id, posizione: [lon, lat] })
                    })
                    const json = await response.json()
                    if (response.ok) {
                        setPdiVisitati(prev => new Set([...prev, pdi._id]))
                        setNotifica({ nome: pdi.properties.nome, punteggio: pdi.properties.punteggio, levelUp: json.levelUp })
                    } else if (response.status === 409) {
                        setPdiVisitati(prev => new Set([...prev, pdi._id]))
                        showAlert("Già visitato", "Hai già registrato una visita per questo PDI", "warning")
                    } else if (response.status === 422) {
                        showAlert("Troppo lontano", json.error, "warning")
                    } else {
                        showAlert("Errore", json.error || "Impossibile registrare la visita", "danger")
                    }
                } catch {
                    showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
                } finally {
                    setPdiInCaricamento(null)
                }
            },
            (errore) => {
                setPdiInCaricamento(null)
                if (errore.code === errore.PERMISSION_DENIED) {
                    showAlert("Permesso negato", "Abilita la geolocalizzazione per registrare la visita", "warning")
                } else {
                    showAlert("Errore", "Impossibile ottenere la posizione", "danger")
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    // Quando la mappa seleziona un PDI, scrolla automaticamente alla card corrispondente nella lista
    useEffect(() => {
        if (pdiSelezionatoMappa) {
            const elementoCard = document.getElementById(`card-pdi-${pdiSelezionatoMappa._id}`);
            if (elementoCard) {
                elementoCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [pdiSelezionatoMappa]);

    return (
        <div className="h-100 d-flex flex-column p-4">
            <h3 className="fw-bold mb-3">Cerca nel trentino</h3>

            {/* Barra di ricerca: filtra i PDI per nome in tempo reale */}
            <div className="pdi-search-wrapper mb-3">
                <span className="material-symbols-outlined pdi-search-icon">search</span>
                <input
                    type="text"
                    className="pdi-search-input"
                    placeholder="Cerca un posto..."
                    value={ricerca}
                    onChange={e => setRicerca(e.target.value)}
                />
                {/* Bottone X visibile solo quando c'è testo nella barra */}
                {ricerca && (
                    <button className="pdi-search-clear" onClick={() => setRicerca('')}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                )}
            </div>

            {/* Filtri collassabili */}
            <div className="mb-3">
                <button
                    onClick={() => setFiltriAperti(p => !p)}
                    style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: filtriAperti ? '14px 14px 0 0' : '14px',
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        transition: 'border-radius 0.2s'
                    }}
                >
                    <div className="d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#037149' }}>tune</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>Filtri</span>
                        {(categoriaSelezionata || filtroVisita !== 'tutti') && (
                            <span style={{
                                backgroundColor: '#037149', color: 'white',
                                borderRadius: '999px', fontSize: '0.7rem',
                                fontWeight: 700, padding: '1px 7px'
                            }}>
                                {(categoriaSelezionata ? 1 : 0) + (filtroVisita !== 'tutti' ? 1 : 0)}
                            </span>
                        )}
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#94a3b8', transition: 'transform 0.25s', transform: filtriAperti ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                    </span>
                </button>

                {filtriAperti && (
                    <div className="d-flex gap-2" style={{
                        alignItems: 'stretch',
                        border: '1px solid #e2e8f0', borderTop: 'none',
                        borderRadius: '0 0 14px 14px',
                        padding: '10px 10px 12px',
                        backgroundColor: '#fafafa'
                    }}>

                {/* Box filtro categoria */}
                <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 12px', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                        Categoria
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        <button
                            className={`pdi-chip ${!categoriaSelezionata ? 'pdi-chip--attivo' : ''}`}
                            onClick={() => setCategoriaSelezionata(null)}
                        >
                            Tutti
                        </button>
                        {categorie.map(cat => (
                            <button
                                key={cat}
                                className={`pdi-chip ${categoriaSelezionata === cat ? 'pdi-chip--attivo' : ''}`}
                                onClick={() => setCategoriaSelezionata(prev => prev === cat ? null : cat)}
                            >
                                <span className="material-symbols-outlined pdi-chip-icon">
                                    {ICONE_CATEGORIA[cat] || 'place'}
                                </span>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Box filtro visita — solo per giocatori */}
                {ruolo === 'giocatore' && (
                    <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 12px', backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                            Stato visita
                        </span>
                        <div className="d-flex flex-column gap-1">
                            {[
                                { valore: 'tutti', label: 'Tutti', icona: null },
                                { valore: 'visitati', label: 'Visitati', icona: 'thumb_up' },
                                { valore: 'nonVisitati', label: 'Da visitare', icona: 'flag' },
                            ].map(({ valore, label, icona }) => (
                                <button
                                    key={valore}
                                    className={`pdi-chip ${filtroVisita === valore ? 'pdi-chip--attivo' : ''}`}
                                    onClick={() => setFiltroVisita(valore)}
                                >
                                    {icona && <span className="material-symbols-outlined pdi-chip-icon">{icona}</span>}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                    </div>
                )}
            </div>

            {/* Contatore risultati */}
            {(() => {
                const pdiFiltrati2 = pdiFiltrati.filter(p => {
                    if (filtroVisita === 'visitati') return pdiVisitati.has(p._id)
                    if (filtroVisita === 'nonVisitati') return !pdiVisitati.has(p._id)
                    return true
                })
                return (
                    <>
                        <p className="pdi-risultati-count">
                            {pdiFiltrati2.length} {pdiFiltrati2.length === 1 ? 'risultato' : 'risultati'}
                        </p>
                        <div className="flex-grow-1 overflow-auto pdi-scroll-container pb-4">
                            {pdiFiltrati2.length === 0 ? (
                                <div className="pdi-empty-state">
                                    <span className="material-symbols-outlined pdi-empty-icon">search_off</span>
                                    <p>Nessun punto di interesse trovato</p>
                                </div>
                            ) : (
                                pdiFiltrati2.map((pdi) => {
                        // La card viene evidenziata se corrisponde al marker selezionato sulla mappa
                        const isSelezionato = pdiSelezionatoMappa && pdiSelezionatoMappa._id === pdi._id;
                        const visitato = ruolo === 'giocatore' && pdiVisitati.has(pdi._id)
                        return (
                            <div
                                id={`card-pdi-${pdi._id}`}
                                key={pdi._id}
                                className={`pdi-card user-select-none ${isSelezionato ? 'border-success border-2 shadow' : visitato ? 'pdi-card--visitato shadow-sm' : 'shadow-sm'}`}
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onClick={() => PdiSelezionatoLista(pdi)}
                            >
                                <div className="p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>
                                            {pdi.properties.nome}
                                        </h5>
                                        {/* Badge categoria mostrato solo se il campo è valorizzato */}
                                        {pdi.properties.categoria && (
                                            <span
                                                className="pdi-badge-categoria"
                                                style={ruolo === 'giocatore' ? {
                                                    backgroundColor: visitato ? 'rgba(3, 113, 73, 0.15)' : 'rgba(108, 117, 125, 0.12)',
                                                    color: visitato ? '#037149' : '#6c757d'
                                                } : {}}
                                            >
                                                {pdi.properties.categoria}
                                            </span>
                                        )}
                                </div>
                                        {isSelezionato && (
                                            <div className="mt-3 pt-3 border-top style-fade-in">
                                                <p className="text-secondary mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                                {pdi.properties.descrizione || "Nessuna descrizione disponibile per questo luogo."}
                                                </p>
                                        
                                        {/* Pulsanti azione */}
                                            <div className="d-flex justify-content-end gap-2">
                                                    {ruolo === 'giocatore' && (
                                                        <button
                                                            className="btn text-white px-3 py-2 fw-semibold shadow-sm"
                                                            style={{ backgroundColor: pdiVisitati.has(pdi._id) ? '#6c757d' : '#037149', borderRadius: '10px', fontSize: '0.9rem' }}
                                                            onClick={(e) => { e.stopPropagation(); registraVisita(pdi) }}
                                                            disabled={pdiInCaricamento === pdi._id || pdiVisitati.has(pdi._id)}
                                                        >
                                                            {pdiInCaricamento === pdi._id ? 'Localizzazione...' : pdiVisitati.has(pdi._id) ? 'Già visitato' : 'Registra visita'}
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-outline-secondary px-3 py-2 fw-semibold shadow-sm d-flex align-items-center gap-1"
                                                        style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/dettagli/${pdi._id}`) }}
                                                    >
                                                        Visualizza dettagli
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    
                                </div>
                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )
                })()}
            <NotificaVisita notifica={notifica} onHide={() => setNotifica(null)} />
        </div>
    );
}

export default ListaPDI;
