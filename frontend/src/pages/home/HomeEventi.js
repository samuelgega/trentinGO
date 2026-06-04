import React from "react"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import HomeNav from "../../components/homeComponents/HomeNav"
import NotificaVisita from "../../components/homeComponents/NotificaVisita"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../assets/home.css'

const HomeEventi = () => {
    const { showAlert } = useAlert()
    const navigate = useNavigate()

    const [listaEventi, setListaEventi] = useState([])
    const [cardsData, setCardsData] = useState([])
    const [isEvPassAttivo, setEvPassAttivo] = useState(false)
    const oggi = new Date()

    const ruolo = localStorage.getItem('ruolo')
    const [eventiVisitati, setEventiVisitati] = useState(new Set())
    const [notifica, setNotifica] = useState(null)
    const [caricamentoId, setCaricamentoId] = useState(null)

    const registraVisita = (card) => {
        const token = localStorage.getItem('token')
        const idGiocatore = localStorage.getItem('userId')
        const haCoordinate = card.geometry?.coordinates?.length === 2

        const eseguiPost = async (posizione) => {
            const body = { idGiocatore, idEvento: card._id }
            if (posizione) body.posizione = posizione
            try {
                const response = await fetch('/api/v1/visite/evento', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })
                const json = await response.json()
                if (response.ok) {
                    setEventiVisitati(prev => new Set([...prev, card._id]))
                    setNotifica({ nome: card.properties.nome, punteggio: 10, levelUp: json.levelUp })
                } else if (response.status === 409) {
                    setEventiVisitati(prev => new Set([...prev, card._id]))
                    showAlert("Già visitato", "Hai già registrato una visita per questo evento", "warning")
                } else if (response.status === 422) {
                    showAlert("Troppo lontano", json.error, "warning")
                } else {
                    showAlert("Errore", json.error || "Impossibile registrare la visita", "danger")
                }
            } catch {
                showAlert("Errore di connessione", "Impossibile collegarsi al server", "danger")
            } finally {
                setCaricamentoId(null)
            }
        }

        if (haCoordinate) {
            if (!navigator.geolocation) {
                showAlert("Errore", "Il tuo dispositivo non supporta la geolocalizzazione", "danger")
                return
            }
            setCaricamentoId(card._id)
            navigator.geolocation.getCurrentPosition(
                (pos) => eseguiPost([pos.coords.longitude, pos.coords.latitude]),
                (err) => {
                    setCaricamentoId(null)
                    if (err.code === err.PERMISSION_DENIED)
                        showAlert("Permesso negato", "Abilita la geolocalizzazione per registrare la visita", "warning")
                    else
                        showAlert("Errore", "Impossibile ottenere la posizione", "danger")
                },
                { enableHighAccuracy: true, timeout: 10000 }
            )
        } else {
            setCaricamentoId(card._id)
            eseguiPost(null)
        }
    }

    const recuperaDatiDalDatabase = async () => {
        try {
            const response = await fetch('/api/v1/eventi')
            if (!response.ok) {
                showAlert("Errore nel recupero dati", "Riprovare riaggiornando la pagina", 'danger')
                return
            }
            const jsonResponse = await response.json()
            const ordinati = jsonResponse.data.sort((a, b) =>
                new Date(a.properties.dataInizio) - new Date(b.properties.dataInizio)
            )
            setListaEventi(ordinati)
            setCardsData(ordinati.filter(ev => {
                const fine = new Date(ev.properties.dataFine)
                fine.setHours(23, 59, 59, 999)
                return fine.getTime() >= oggi.getTime()
            }))
        } catch (error) {
            console.error("Errore di connessione:", error)
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!")
        }
    }

    useEffect(() => {
        recuperaDatiDalDatabase()
    }, [])

    useEffect(() => {
        if (ruolo !== 'giocatore') return
        const token = localStorage.getItem('token')
        fetch('/api/v1/visite/giocatore', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(json => {
                const ids = new Set(json.data?.filter(v => v.idEvento).map(v => v.idEvento))
                setEventiVisitati(ids)
            })
            .catch(() => {})
    }, [])

    const handleCardClick = (id) => {
        navigate(`/dettagli-evento/${id}`)
    }

    const getStatoEvento = (dataInizio, dataFine) => {
        const ora = new Date()
        const inizio = dataInizio ? new Date(dataInizio) : null
        const fine = dataFine ? new Date(dataFine) : null
        if (fine) fine.setHours(23, 59, 59, 999)
        if (fine && ora > fine) return { colore: '#dc3545', sfondo: '#fff0f0', label: 'Terminato' }
        if (inizio && ora < inizio) return { colore: '#6c757d', sfondo: '#f1f3f5', label: 'Non iniziato' }
        return { colore: '#28a745', sfondo: '#edfbf0', label: 'In corso' }
    }

    const formatData = (dataStr) => {
        if (!dataStr) return null
        return new Date(dataStr).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const handleEvPassClick = () => {
        if (isEvPassAttivo)
            setCardsData(listaEventi.filter(ev => {
                const fine = new Date(ev.properties.dataFine)
                fine.setHours(23, 59, 59, 999)
                return fine.getTime() >= oggi.getTime()
            }))
        else
            setCardsData(listaEventi)
        setEvPassAttivo(!isEvPassAttivo)
    }

    return (
        <>
            <div className='vh-100 d-flex flex-column overflow-hidden'>
                <div className="container-fluid">
                    <HomeNav />
                </div>

                <div className="container-fluid py-5 px-4 px-md-5 bg-light flex-grow-1" style={{ overflowY: 'auto' }}>

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">I prossimi eventi</h2>
                            <p className="text-muted fs-5 mb-0">Scopri i meravigliosi eventi che si terranno nel Trentino</p>
                        </div>
                        <button
                            className={`btn ${isEvPassAttivo ? 'btn-trentingo-outline' : 'btn-trentingo'} px-4 py-2 fw-semibold shadow-sm`}
                            onClick={handleEvPassClick}
                        >
                            {isEvPassAttivo ? 'Nascondi eventi passati' : 'Mostra eventi passati'}
                        </button>
                    </div>

                    {/* Griglia card */}
                    <div className="row g-4">
                        {cardsData.map((card) => {
                            const stato = getStatoEvento(card.properties.dataInizio, card.properties.dataFine)
                            const visitato = eventiVisitati.has(card._id)
                            const terminato = stato.label === 'Terminato'
                            const nonAncoraIniziato = stato.label === 'In corso' === false && stato.label !== 'Terminato'

                            return (
                                <div key={card._id} className="col-12 col-md-6 col-xl-4">
                                    <div
                                        className={`card h-100 border-0 ${visitato ? 'evento-card--visitato' : 'shadow-sm'}`}
                                        style={{
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            opacity: terminato ? 0.6 : 1
                                        }}
                                        onClick={() => handleCardClick(card._id)}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                                    >
                                        {/* Immagine con badge sovrapposti */}
                                        <div className="position-relative">
                                            <img
                                                src={card.properties.immagine[0] ?? 'http://localhost:3001/uploads/eventoGenerico.png'}
                                                className="w-100"
                                                alt={card.properties.nome}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            {/* Gradiente scuro in basso sull'immagine */}
                                            <div className="position-absolute bottom-0 start-0 w-100"
                                                style={{ height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)' }} />

                                            {/* Badge stato (in basso a sinistra sull'immagine) */}
                                            <div className="position-absolute d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                                                style={{ bottom: '10px', left: '12px', backgroundColor: stato.sfondo }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stato.colore, display: 'inline-block', flexShrink: 0 }} />
                                                <span className="fw-semibold" style={{ color: stato.colore, fontSize: '0.75rem' }}>{stato.label}</span>
                                            </div>

                                            {/* Badge VISITATO (in alto a destra) */}
                                            {visitato && ruolo === 'giocatore' && (
                                                <div className="position-absolute d-flex align-items-center gap-1 px-2 py-1 shadow"
                                                    style={{ top: '10px', right: '10px', backgroundColor: '#037149', borderRadius: '999px' }}>
                                                    <span className="material-symbols-outlined fill text-white" style={{ fontSize: '0.9rem' }}>thumb_up</span>
                                                    <span className="text-white fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.03em' }}>VISITATO</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="card-body p-4 d-flex flex-column">
                                            {/* Categoria + XP */}
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <span className="badge rounded-pill px-3 py-1 fw-semibold"
                                                    style={{ backgroundColor: 'rgba(3,113,73,0.1)', color: '#037149', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    {card.properties.categoria || 'Evento'}
                                                </span>
                                                <span className="d-flex align-items-center gap-1 fw-semibold"
                                                    style={{ color: '#137b52', fontSize: '0.8rem' }}>
                                                    <span className="material-symbols-outlined fill" style={{ fontSize: '1rem' }}>star</span>
                                                    10 XP
                                                </span>
                                            </div>

                                            {/* Titolo */}
                                            <h5 className="fw-bold text-dark mb-2" style={{ letterSpacing: '-0.01em' }}>
                                                {card.properties.nome}
                                            </h5>

                                            {/* Descrizione troncata */}
                                            <p className="text-secondary flex-grow-1 mb-3"
                                                style={{ fontSize: '0.9rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {card.properties.descrizione || 'Nessuna descrizione disponibile.'}
                                            </p>

                                            {/* Footer: data + bottone */}
                                            <div className="mt-auto pt-3 border-top">
                                                <div className="d-flex align-items-center gap-1 text-muted mb-3" style={{ fontSize: '0.82rem' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>calendar_month</span>
                                                    <span>{formatData(card.properties.dataInizio)}</span>
                                                    {card.properties.dataFine && (
                                                        <>
                                                            <span>→</span>
                                                            <span>{formatData(card.properties.dataFine)}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {ruolo === 'giocatore' && (
                                                    <button
                                                        className="btn w-100 fw-semibold rounded-3 py-2"
                                                        style={{
                                                            backgroundColor: visitato || terminato ? '#6c757d' : '#037149',
                                                            color: 'white',
                                                            fontSize: '0.9rem',
                                                            opacity: nonAncoraIniziato ? 0.45 : 1
                                                        }}
                                                        disabled={visitato || terminato || nonAncoraIniziato || caricamentoId === card._id}
                                                        onClick={e => { e.stopPropagation(); registraVisita(card) }}
                                                    >
                                                        {caricamentoId === card._id ? 'Attendere...' : visitato ? 'Già visitato' : terminato ? 'Evento terminato' : 'Registra visita'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <NotificaVisita notifica={notifica} onHide={() => setNotifica(null)} />
        </>
    )
}

export default HomeEventi
