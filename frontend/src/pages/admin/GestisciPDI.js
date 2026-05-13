import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertController from '../../contexts/AlertController'
import AdminNav from '../../components/adminComponents/AdminNav'
import { useAlert } from '../../contexts/AlertController'

const GestisciPDI = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    // dati dal backend
    const [listaPDI, setListaPDI] = useState([])

    //popup elimina
    const [popupAperto, setPopupAperto] = useState(false)
    const [pdiDaEliminare, setPdiDaEliminare] = useState(null)

    const recuperaDatiDalDatabase = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/pdi');                
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const jsonResponse = await response.json();
            setListaPDI(jsonResponse.data); 
            
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

    // handler per andare alla pagina crea PDI
    const goToCreaPdi = () => {
        navigate('/crea-pdi')
    }

    // handler per gestire la modifica
    const gestisciModifica = (pdi) => {
        navigate(`/modifica-pdi/${pdi._id}`)
    }
        
    //popup conferma eliminazione
    const apriPopupElimina = (pdi) => {
        setPdiDaEliminare(pdi)
        setPopupAperto(true)
    }

    const chiudiPopupElimina = () => {
        setPdiDaEliminare(null)
        setPopupAperto(false)
       }
    
    //handler per l'eliminazione del PDI

    const gestisciEliminazione = async () => {
        if(!pdiDaEliminare) return;
        
        try {
            const response = await fetch(`http://localhost:3001/api/v1/pdi/${pdiDaEliminare._id}`, {
                method: 'DELETE',
            });
        if (response.ok) {
            showAlert(`PDI ${pdiDaEliminare._id} eliminato!`)
            //aggiorno la lista dei PDI 
            recuperaDatiDalDatabase();
        } else {
            showAlert("Errore", "impossibile eliminare il PDI", "danger");
        }
        }catch (error) {
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!", "Controlla la console per maggiori dettagli", "danger");
        } finally {
            chiudiPopupElimina();
        }
    }

    return (
        <>
            <AdminNav />
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestione Punti di Interesse (PDI)</h2>
                    <div>   
                        <button className="btn btn-primary me-2" onClick={goToCreaPdi}>
                            + Aggiungi Nuovo PDI
                        </button>
                    <button
                        className="btn btn-secondary"
                        onClick={goToHome}
                    >
                        &larr; Torna alla Home
                    </button>
                    </div>
                </div>

                <div className="card shadow-sm p-4 text-center text-muted">
                    <h4>Interfaccia in costruzione</h4>
                    <p>Qui verrà inserita la tabella o la mappa per gestire i PDI</p>

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Tipo</th>
                                            <th className="text-end" style={{ width: '200px' }}>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaPDI.map((pdi) => (
                                            <tr key={pdi._id}>
                                                <td className="fw">{pdi.properties.nome}</td>
                                                <td>
                                                    <span className="badge bg-info text-dark">{pdi.properties.categoria}</span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-secondary me-2"
                                                        onClick={() => gestisciModifica(pdi)}
                                                    >
                                                        Modifica
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => apriPopupElimina(pdi)}
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
                nomeElemento={pdiDaEliminare ? pdiDaEliminare.properties.nome : ""} 
            />
        </>
    )
}


export default GestisciPDI