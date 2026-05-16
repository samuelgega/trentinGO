import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'
import {useAlert} from '../../contexts/AlertController'
import PopUpElimina from '../../contexts/EliminaController'

const GestisciEventi = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    // dati prova
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
        if(!eventoDaEliminare) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/v1/eventi/${eventoDaEliminare._id}`, {
                method: 'DELETE',
            });
        if (response.ok) {
            showAlert(`Evento ${eventoDaEliminare._id} eliminato!`)
            //aggiorno la lista degli eventi
            recuperaDatiDalDatabase();
        } else {
            showAlert("Errore", "impossibile eliminare l'evento", "danger");
        }
        }catch (error) {
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
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Eventi</h2>
                    <div>   
                        <button className="btn btn-primary me-2" onClick={goToCreaEvento}>
                            + Aggiungi Nuovo Evento
                        </button>
                        <button className="btn btn-secondary" onClick={goToHome}>
                            &larr; Torna alla Home
                        </button>
                    </div>
                </div>
                

                <div className="card shadow-sm p-4 text-center text-muted">
                    <h4>Interfaccia in costruzione</h4>
                    <p>Qui verrà inserita la tabella o la mappa per gestire gli eventi</p>

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th>Stato</th>
                                            <th className="text-end" style={{ width: '200px' }}>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaEventi.map((evento) => (
                                            <tr key={evento._id}>
                                                <td className="fw-body">{evento.properties.nome}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{evento.properties.categoria}</span>
                                                </td>
                                                <td>
                                                    {getStatoEvento(evento.properties.dataInizio, evento.properties.dataFine)}
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-secondary me-2"
                                                        onClick={() => gestisciModifica(evento)}
                                                    >
                                                        Modifica
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => apriPopupElimina(evento)}
                                                    >
                                                        Elimina
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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