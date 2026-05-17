import React from "react"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../contexts/AlertController'
import HomeNav from "../../components/homeComponents/HomeNav";

import 'bootstrap/dist/css/bootstrap.min.css'

const HomeEventi = () => {
    const { showAlert } = useAlert()
    const [listaEventi, setListaEventi] = useState([])
    const [cardsData, setCardsData] = useState([])
    const oggi = new Date('5/22/2026')
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
            setCardsData(jsonResponse.data.filter(ev => (new Date(ev.properties.dataFine)).getTime() >= oggi.getTime()))
        } catch (error) {
            console.error("Errore di connessione:", error);
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!");
        }
    }

    useEffect(() => {
        recuperaDatiDalDatabase()
    }, [])

    const handleCardClick = (title) => {
        alert(`Hai cliccato sull'evento: ${title}`)
    }

    const handleEvPassClick = () => {
        if (isEvPassAttivo)
            setCardsData(listaEventi.filter(ev => (new Date(ev.properties.dataFine)).getTime() >= oggi.getTime()))
        else
            setCardsData(listaEventi)
        setEvPassAttivo(!isEvPassAttivo)
    }

    return (
      <>
        <div className="container-fluid py-5 px-4 px-md-5 bg-light min-vh-100">
            <HomeNav />
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">I prossimi eventi</h2>
                    <p className="text-muted fs-5 mb-0">Scopri i meravigliosi eventi che si terranno nel trentino</p>
                </div>
                <div>
                    <button
                        className={`btn btn-${isEvPassAttivo ? 'secondary' : 'primary'} px-4 py-2 fw-semibold shadow-sm`}
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
                            onClick={() => handleCardClick(card.properties.nome)}
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
                            <div className="card-body p-4">
                                <h4 className="card-title fw-semibold mb-3">{card.properties.nome}</h4>
                                <p className="card-text text-secondary" style={{ lineHeight: '1.6' }}>
                                    {card.properties.descrizione}
                                </p>
                                <h5 className="card-text text-secondary" style={{ lineHeight: '1.6' }}>
                                    <b>Data: </b>
                                    {(new Date(card.properties.dataInizio)).toLocaleDateString('it-IT')}
                                </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        </>
    )
}

export default HomeEventi