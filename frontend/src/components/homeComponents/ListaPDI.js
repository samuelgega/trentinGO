import React, {useEffect, useState} from 'react'
import { useAlert } from '../../contexts/AlertController'

const ListaPDI = () =>{


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


    return (
        <div className="h-100 d-flex flex-column p-4">
            {/*Barra di ricerca e filtri da fare*/}
            <h3 className="fw-bold mb-4">Cerca nel trentino</h3>
            {/*card pdi*/}
            <div className="flex-grow-1 overflow-auto pdi-scroll-container pb-4">
                {listaPDI.map((pdi) => (
                    <div key={pdi._id} className="pdi-card shadow-sm">
                        <div className="p-3">
                            {/*Nome*/}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0 fw-semibold">{pdi.properties.nome}</h5>
                            </div>
                            {/*Descrizione*/}
                            <p className="text-muted mb-3">
                                {pdi.properties.descrizione.type}
                            </p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaPDI;