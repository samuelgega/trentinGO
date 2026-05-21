import React from "react"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import HomeNav from "../../components/homeComponents/HomeNav";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../assets/home.css'

const HomeEventi = () => {
    const { showAlert } = useAlert()
    const [listaEventi, setListaEventi] = useState([])
    const [cardsData, setCardsData] = useState([])
    const oggi = new Date()
    const [isEvPassAttivo, setEvPassAttivo] = useState(false)

    const recuperaDatiDalDatabase = async () => {
        try {
            const response = await fetch('/api/v1/eventi');
            if (!response.ok) {
                showAlert("Errore nel recupero dati", "Riprovare riaggiornando la pagina", 'danger')
            }
            const jsonResponse = await response.json()
            setListaEventi(jsonResponse.data.sort((a, b) => {
                return new Date(a.properties.dataInizio) - new Date(b.properties.dataInizio)
            }))
            setCardsData(jsonResponse.data.filter(ev => {
                const fine = new Date(ev.properties.dataFine)
                fine.setHours(23, 59, 59, 999)
                return fine.getTime() >= oggi.getTime()
            }))
        } catch (error) {
            console.error("Errore di connessione:", error);
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!");
        }
    }

    useEffect(() => {
        recuperaDatiDalDatabase()
    }, [])

    const navigate = useNavigate()

    const handleCardClick = (id) => {
        navigate(`/dettagli-evento/${id}`)
    }

    const getStatoEvento = (dataInizio, dataFine) => {
        const ora = new Date()
        const inizio = dataInizio ? new Date(dataInizio) : null
        const fine = dataFine ? new Date(dataFine) : null
        if (fine) fine.setHours(23, 59, 59, 999)
        if (fine && ora > fine) return { colore: '#dc3545', label: 'Terminato' }
        if (inizio && ora < inizio) return { colore: '#6c757d', label: 'Non iniziato' }
        return { colore: '#28a745', label: 'In corso' }
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
                <HomeNav />
                <div className="container-fluid py-5 px-4 px-md-5 bg-light flex-grow-1" style={{ overflowY: 'auto' }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">I prossimi eventi</h2>
                            <p className="text-muted fs-5 mb-0">Scopri i meravigliosi eventi che si terranno nel trentino</p>
                        </div>
                        <div>
                            <button
                                className={`btn ${isEvPassAttivo ? 'btn-trentingo-outline' : 'btn-trentingo'} px-4 py-2 fw-semibold shadow-sm`}
                                onClick={handleEvPassClick}
                            >
                                {isEvPassAttivo ? 'Nascondi eventi passati' : 'Mostra eventi passati'}
                            </button>
                        </div>
                    </div>

                    {/* g-4 imposta un gap (spaziatura) tra le card */}
                    <div className="row g-4">
                        {cardsData.map((card) => (
                            // Su schermi medi ne mostriamo 2 per riga, su quelli larghi 3 per riga (così risultano "belle larghe")
                            <div key={card._id} className="col-12 col-md-6 col-xl-4">
                                <div
                                    className={`card h-100 border-0 
                                ${(new Date(card.properties.dataFine)).getTime() < oggi.getTime()
                                            ? 'bg-light text-muted opacity-50'
                                            : 'bg-white shadow-sm'
                                        }
                            `}
                                    style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                                    onClick={() => handleCardClick(card._id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.classList.replace('shadow-sm', 'shadow');
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.classList.replace('shadow', 'shadow-sm');
                                    }}
                                >
                                    <img
                                        src={(card.properties.immagine[0] !== undefined) ? card.properties.immagine[0] : 'http://localhost:3001/uploads/eventoGenerico.png'}
                                        className="card-img-top"
                                        alt={card.properties.nome}
                                        style={{ height: '220px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body p-4 d-flex flex-column">
                                        <h4 className="card-title fw-semibold mb-2">{card.properties.nome}</h4>
                                        <p className="card-text text-secondary flex-grow-1" style={{ lineHeight: '1.6' }}>
                                            {card.properties.descrizione}
                                        </p>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-3 border-top">
                                            {/* Stato */}
                                            {(() => {
                                                const stato = getStatoEvento(card.properties.dataInizio, card.properties.dataFine)
                                                return (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stato.colore, display: 'inline-block', flexShrink: 0 }} />
                                                        <span className="fw-semibold" style={{ color: stato.colore, fontSize: '0.85rem' }}>{stato.label}</span>
                                                    </div>
                                                )
                                            })()}
                                            {/* Date */}
                                            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.82rem' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>calendar_month</span>
                                                <span>{formatData(card.properties.dataInizio)}</span>
                                                {card.properties.dataFine && (
                                                    <>
                                                        <span>→</span>
                                                        <span>{formatData(card.properties.dataFine)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeEventi