import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/adminComponents/AdminNav'
import { useAlert } from '../../contexts/AlertController'
import PopUpElimina from '../../contexts/EliminaController'

const GestisciPDI = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()

    // dati dal backend
    const [listaPDI, setListaPDI] = useState([])

    //popup elimina
    const [popupAperto, setPopupAperto] = useState(false)
    const [pdiDaEliminare, setPdiDaEliminare] = useState(null)

    const recuperaDatiDalDatabase = useCallback(async () => {
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
    },[showAlert])

    useEffect(() => {
        recuperaDatiDalDatabase()
    }, [recuperaDatiDalDatabase])

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
        if (!pdiDaEliminare) return;

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3001/api/v1/pdi/${pdiDaEliminare._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showAlert(`PDI ${pdiDaEliminare.properties.nome} eliminato!`)
                //aggiorno la lista dei PDI 
                recuperaDatiDalDatabase();
            } else {
                showAlert("Errore", "impossibile eliminare il PDI", "danger");
            }
        } catch (error) {
            showAlert("Errore di connessione. Assicurati che il backend sia acceso!", "Controlla la console per maggiori dettagli", "danger");
        } finally {
            chiudiPopupElimina();
        }
    }

    return (
        <>
            <AdminNav />

            <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }} className="pb-5">
                <div className="container pt-4">

                    {/* Header di pagina */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-0">Gestione Punti di Interesse</h4>
                            <p className="text-muted small mb-0">Aggiungi, modifica o elimina i PDI dalla mappa</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-trentingo btn-sm fw-semibold px-3" onClick={goToCreaPdi}>
                                + Nuovo PDI
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={goToHome}>
                                &larr; Torna alla Home
                            </button>
                        </div>
                    </div>

                    {/*tabella*/}
                    <div className="card border-0 shadow-sm pdi-card" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                        <tr>
                                            <th className="px-4 py-3 text-secondary fw-semibold small">NOME</th>
                                            <th className="py-3 text-secondary fw-semibold small">CATEGORIA</th>
                                            <th className="py-3 text-secondary fw-semibold small text-end px-4" style={{ width: '200px' }}>AZIONI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaPDI.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center text-muted py-5">
                                                    Nessun PDI trovato nel database.
                                                </td>
                                            </tr>
                                        ) : (
                                            listaPDI.map((pdi) => (
                                                <tr key={pdi._id}>
                                                    <td className="px-4 fw-semibold">{pdi.properties.nome}</td>
                                                    <td>
                                                        <span className="pdi-badge-categoria">
                                                            {pdi.properties.categoria}
                                                        </span>
                                                    </td>
                                                    <td className="text-end px-4">
                                                        <button
                                                            className="btn btn-sm btn-trentingo-outline me-2"
                                                            onClick={() => gestisciModifica(pdi)}
                                                        >
                                                            Modifica
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => apriPopupElimina(pdi)}
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
                nomeElemento={pdiDaEliminare ? pdiDaEliminare.properties.nome : ""}
            />
        </>
    )
}


export default GestisciPDI