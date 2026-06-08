import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GestoreNav from '../../components/gestoreComponents/GestoreNav'
import { useAlert } from '../../contexts/AlertController'
import PopUpElimina from '../../contexts/EliminaController'

const GestisciEventiCreati = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    const [listaEventi, setListaEventi] = useState([])
    const [loading, setLoading] = useState(true)
    const [popupAperto, setPopupAperto] = useState(false)
    const [eventoDaEliminare, setEventoDaEliminare] = useState(null)

    //Recupero dati dal backend
    const recuperaMieiEventi = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/v1/eventi/gestore', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 404) {
                setListaEventi([]);
                return;
            }

            if (!response.ok) {
                throw new Error("Errore nel recupero degli eventi");
            }

            const jsonResponse = await response.json();
            setListaEventi(jsonResponse.data);
            
        } catch (error) {
            console.error("Errore di connessione:", error);
            showAlert("Errore di connessione al server.", "danger");
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        recuperaMieiEventi();
    }, [recuperaMieiEventi]);


    const goToHome = () => {
        navigate('/gestore-home')
    }

    const goToCreaEvento = () => {
        navigate('/gestore-home/crea-evento') 
    }

    const gestisciModifica = (evento) => {
        navigate(`/modifica-evento/${evento._id}`) 
    }

    //apertura/chiusura popup
    const apriPopupElimina = (evento) => {
        setEventoDaEliminare(evento)
        setPopupAperto(true)
    }

    const chiudiPopupElimina = () => {
        setEventoDaEliminare(null)
        setPopupAperto(false)
    }

    //eliminazione
    const gestisciEliminazione = async () => {
        if (!eventoDaEliminare) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/v1/eventi/${eventoDaEliminare._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                showAlert(`Evento "${eventoDaEliminare.properties.nome}" eliminato con successo!`, "success");
                recuperaMieiEventi();
            } else {
                showAlert("Errore", "Impossibile eliminare l'evento", "danger");
            }
        } catch (error) {
            console.error(error);
            showAlert("Errore di connessione.", "Assicurati che il backend sia acceso", "danger");
        } finally {
            chiudiPopupElimina();
        }
    }

    // Calcolo stato
    const getStatoEvento = (dataInizio, dataFine) => {
        if (!dataInizio || !dataFine) return null;

        const oggi = new Date();
        const inizio = new Date(dataInizio);
        const fine = new Date(dataFine);

        oggi.setHours(0, 0, 0, 0);
        inizio.setHours(0, 0, 0, 0);
        fine.setHours(0, 0, 0, 0);

        if (oggi < inizio) {
            return <span className="badge bg-warning text-dark ms-2">In arrivo</span>;
        } else if (oggi > fine) {
            return <span className="badge bg-secondary ms-2">Concluso</span>;
        } else {
            return <span className="badge bg-success ms-2">In corso</span>;
        }
    }

    return (
        <>
            <GestoreNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">I Miei Eventi</h4>
                            <p className="text-muted small mb-0">Gestisci gli eventi che hai creato</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-trentingo btn-sm fw-semibold px-3" onClick={goToCreaEvento}>
                                + Nuovo Evento
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={goToHome}>
                                &larr; Torna alla Home
                            </button>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm evento-card" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                            <th className="px-4 py-3 text-secondary fw-semibold small">NOME</th>
                                            <th className="py-3 text-secondary fw-semibold small">CATEGORIA</th>
                                            <th className="py-3 text-secondary fw-semibold small">STATO</th>
                                            <th className="py-3 text-secondary fw-semibold small text-end px-4" style={{ width: '200px' }}>AZIONI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status"></div>
                                                </td>
                                            </tr>
                                        ) : listaEventi.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-5">
                                                    Nessun evento trovato. Inizia creandone uno!
                                                </td>
                                            </tr>
                                        ) : (
                                            listaEventi.map((evento) => (
                                                <tr key={evento._id}>
                                                    <td className="px-4 fw-semibold">{evento.properties.nome}</td>
                                                    <td>
                                                        <span className="pdi-badge-categoria">
                                                            {evento.properties.categoria}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {getStatoEvento(evento.properties.dataInizio, evento.properties.dataFine)}
                                                    </td>
                                                    <td className="text-end px-4">
                                                        <button
                                                            className="btn btn-sm btn-trentingo-outline me-2"
                                                            onClick={() => gestisciModifica(evento)}
                                                        >
                                                            Modifica
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => apriPopupElimina(evento)}
                                                        >
                                                            Elimina
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PopUpElimina
                isOpen={popupAperto}
                onClose={chiudiPopupElimina}
                onConfirm={gestisciEliminazione}
                nomeElemento={eventoDaEliminare ? eventoDaEliminare.properties.nome : ""}
            />
        </>
    )

}

export default GestisciEventiCreati