import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertController'

// Mappa ogni categoria alla relativa icona Material Symbols
const ICONE_CATEGORIA = {
    lago: 'water',
    montagna: 'landscape',
    castello: 'castle',
    museo: 'museum',
    santuario: 'church',
    chiesa: 'church',
}

const ListaPDI = ({ pdiFiltrati, categorie, ricerca, setRicerca, categoriaSelezionata, setCategoriaSelezionata, PdiSelezionatoLista, pdiSelezionatoMappa }) => {

    const navigate = useNavigate();
    const { showAlert } = useAlert()
    const ruolo = localStorage.getItem('ruolo')
    const [pdiInCaricamento, setPdiInCaricamento] = useState(null)
    const [pdiVisitati, setPdiVisitati] = useState(new Set())

    useEffect(() => {
        if (ruolo !== 'giocatore') return
        const token = localStorage.getItem('token')
        fetch('http://localhost:3001/api/v1/visite/giocatore', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(json => {
                const ids = new Set(json.data?.map(v => v.idPDI).filter(Boolean))
                setPdiVisitati(ids)
            })
            .catch(() => {})
    }, [ruolo])

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
                        if (json.levelUp) {
                            showAlert("Sei salito di livello!", `Complimenti! Hai raggiunto il livello ${json.levelUp} 🎉`, "success")
                        } else {
                            showAlert("Visita registrata!", `Hai guadagnato ${pdi.properties.punteggio} XP`, "success")
                        }
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

            {/* Chip filtro categoria: "Tutti" resetta il filtro, gli altri lo impostano (click doppio deseleziona) */}
            <div className="pdi-filtri-wrapper mb-3">
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

            {/* Contatore dei risultati visibili dopo l'applicazione dei filtri */}
            <p className="pdi-risultati-count">
                {pdiFiltrati.length} {pdiFiltrati.length === 1 ? 'risultato' : 'risultati'}
            </p>

            {/* Lista delle card PDI filtrate */}
            <div className="flex-grow-1 overflow-auto pdi-scroll-container pb-4">
                {/* Se nessun PDI corrisponde ai filtri mostra un messaggio vuoto */}
                {pdiFiltrati.length === 0 ? (
                    <div className="pdi-empty-state">
                        <span className="material-symbols-outlined pdi-empty-icon">search_off</span>
                        <p>Nessun punto di interesse trovato</p>
                    </div>
                ) : (
                    pdiFiltrati.map((pdi) => {
                        // La card viene evidenziata se corrisponde al marker selezionato sulla mappa
                        const isSelezionato = pdiSelezionatoMappa && pdiSelezionatoMappa._id === pdi._id;
                        return (
                            <div
                                id={`card-pdi-${pdi._id}`}
                                key={pdi._id}
                                className={`pdi-card user-select-none ${isSelezionato ? 'border-success border-2 shadow' : 'shadow-sm'}`}
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
                                            <span className="pdi-badge-categoria">
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
        </div>
    );
}

export default ListaPDI;
