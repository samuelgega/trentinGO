import React from "react"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../contexts/AlertController'

import 'bootstrap/dist/css/bootstrap.min.css'

const ListaEventi = () => {
    const { showAlert } = useAlert()
    const [cardsData, setCardsData] = useState([])

    const recuperaDatiDalDatabase = async () => {
        try {
            const response = await fetch('/api/v1/eventi');
            if (!response.ok) {
                showAlert("Errore nel recupero dati", "Riprovare riaggiornando la pagina", 'danger')
            }
            const jsonResponse = await response.json();
            setCardsData(jsonResponse.data);

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

    return (
        <div className="container-fluid py-5 px-4 px-md-5 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">I prossimi eventi</h2>
                    <p className="text-muted fs-5 mb-0">Scopri i meravigliosi eventi che si terranno nel trentino</p>
                </div>
                <div>
                    <button
                        className="btn btn-secondary px-4 py-2 fw-semibold shadow-sm"
                    >
                        Eventi passati
                    </button>
                </div>
            </div>

            {/* g-4 imposta un gap (spaziatura) tra le card */}
            <div className="row g-4">
                {cardsData.map((card) => (
                    // Su schermi medi ne mostriamo 2 per riga, su quelli larghi 3 per riga (così risultano "belle larghe")
                    <div key={card.__id} className="col-12 col-md-6 col-xl-4">
                        <div
                            className="card h-100 shadow-sm border-0 bg-white"
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
                                src={card.properties.immagine[0]}
                                className="card-img-top"
                                alt={card.properties.nome}
                                style={{ height: '220px', objectFit: 'cover' }}
                            />
                            <div className="card-body p-4">
                                <h4 className="card-title fw-semibold mb-3">{card.properties.nome}</h4>
                                <p className="card-text text-secondary" style={{ lineHeight: '1.6' }}>
                                    {card.properties.descrizione}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ListaEventi