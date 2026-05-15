import React, {useEffect, useState} from 'react'
import { useAlert } from '../../contexts/AlertController'

const ListaPDI = ({PdiSelezionatoLista, pdiSelezionatoMappa }) =>{


const {showAlert} = useAlert();

    //lista PDI
    const [listaPDI, setListaPDI] = useState([])
    const recuperoPDI = async () => {

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

    useEffect(()=>{
        recuperoPDI()
    }, []);


    //fuznione di quando viene selezionato un pdi dalla mappa
    useEffect(() => {
        if (pdiSelezionatoMappa) {
            const elementoCard = document.getElementById(`card-pdi-${pdiSelezionatoMappa._id}`);
            if (elementoCard) {
                elementoCard.scrollIntoView({ behavior: 'smooth',block: 'start' });
            }
        }
    }, [pdiSelezionatoMappa]);


    return (
        <div className="h-100 d-flex flex-column p-4">
            {/*Barra di ricerca e filtri da fare*/}
            <h3 className="fw-bold mb-4">Cerca nel trentino</h3>
            {/*card pdi*/}
            <div className="flex-grow-1 overflow-auto pdi-scroll-container pb-4">
                {listaPDI.map((pdi) => {
                    const isSelezionato = pdiSelezionatoMappa && pdiSelezionatoMappa._id === pdi._id;

                    return (
                        <div 
                            id={`card-pdi-${pdi._id}`} 
                            key={pdi._id} 
                            className={`pdi-card user-select-none ${isSelezionato ? 'border-success border-2 shadow' : 'shadow-sm'}`} 
                            style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }} 
                            onClick={() => PdiSelezionatoLista(pdi)}
                        > <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="mb-0 fw-semibold" style={{ color: '#1e293b' }}>
                                        {pdi.properties.nome}
                                    </h5>
                                </div>
                                <p className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                    {pdi.properties.descrizione} 
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ListaPDI;