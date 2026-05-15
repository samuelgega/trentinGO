import React, {useEffect, useState}from "react";
import {MapContainer,TileLayer,Marker,Pin, Popup, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useAlert } from "../../contexts/AlertController";


//prendo l'icona del pin verde
const pinVerde = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//funzione per lo zoom su pdi selezionato
const ChangeView = ({ center, zoom }) => {
  const map = useMap(); 
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}


const MappaTrentino = ({pdiSelezionato}) => {

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
    

    //coodinatre di centro trento
    const centroTrento = [46.0667, 11.1167]

    return(

        <MapContainer 
            center={centroTrento} 
            zoom={9} 
            minZoom={8}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
            {/*OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/*PDI selezionato */}
            {pdiSelezionato && (
                <ChangeView
                    center={[pdiSelezionato.geometry.coordinates[1], pdiSelezionato.geometry.coordinates[0]]}
                    zoom={15}
                />
            )}

            {/*Pin dei vari PDI (Prova) */}
            {listaPDI.map((pdi) => (
                <tr key={pdi.id}>
                    {/*latitudine [1] e longitudine [0] */}
                    <Marker
                        position={[pdi.geometry.coordinates[1], pdi.geometry.coordinates[0]]}
                        icon={pinVerde}
                    >
                        <Popup>
                            <strong>{pdi.properties.nome}</strong>
                        </Popup>
                    </Marker>
                </tr>
            )
            )}
        </MapContainer>

    );

}

export default MappaTrentino;