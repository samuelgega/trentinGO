import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'
import { useAlert } from '../../contexts/AlertController'
import PopUpElimina from '../../contexts/EliminaController'

const GestisciEventi = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    const [listaEventi, setListaEventi] = useState([])

    //popup elimina
    const [popupAperto, setPopupAperto] = useState(false)
    const [eventoDaEliminare, setEventoDaEliminare] = useState(null)

    const recuperaDatiDalDatabase = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/eventi');
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const jsonResponse = await response.json();
            setListaEventi(jsonResponse.data);

        } catch (error) {
            console.error("Errore di connessione:", error);
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!");
        }
    }

    useEffect(() => {
        recuperaDatiDalDatabase()
    }, [])



    // handler per tornare alla home 
    const goToHome = () => {
        navigate('/admin-home')
    }

    // handler per andare alla pagina crea evento
    const goToCreaEvento = () => {
        navigate('/crea-evento')
    }

    // handler per gestire la modifica
    const gestisciModifica = (evento) => {
        navigate(`/modifica-evento/${evento._id}`)
    }

    //popup conferma eliminazione
    const apriPopupElimina = (evento) => {
        setEventoDaEliminare(evento)
        setPopupAperto(true)
    }

    const chiudiPopupElimina = () => {
        setEventoDaEliminare(null)
        setPopupAperto(false)
    }

    //handler per l'eliminazione del PDI

    const gestisciEliminazione = async () => {
        if (!eventoDaEliminare) return;

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3001/api/v1/eventi/${eventoDaEliminare._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showAlert(`Evento ${eventoDaEliminare.properties.nome} eliminato!`)
                //aggiorno la lista degli eventi
                recuperaDatiDalDatabase();
            } else {
                showAlert("Errore", "impossibile eliminare l'evento", "danger");
            }
        } catch (error) {
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!", "Controlla la console per maggiori dettagli", "danger");
        } finally {
            chiudiPopupElimina();
        }
    }

    //funzione per determinare lo stato dell'evento in base alle date
    const getStatoEvento = (dataInizio, dataFine) => {
        if (!dataInizio || !dataFine) return null;

        const oggi = new Date();
        const inizio = new Date(dataInizio);
        const fine = new Date(dataFine);

        //Azzero le ore per confrontare solo le date
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
            <AdminNav />
            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione Eventi</h4>
                            <p className="text-muted small mb-0">Aggiungi, modifica o elimina eventi</p>
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
                                            <th className="py-3 text-secondary fw-semibold small">TIPO</th>
                                            <th className="py-3 text-secondary fw-semibold small">STATO</th>
                                            <th className="py-3 text-secondary fw-semibold small text-end px-4" style={{ width: '200px' }}>AZIONI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaEventi.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-5">
                                                    Nessun evento trovato nel database.
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


export default GestisciEventi