import React, { useEffect, useState, useRef } from "react"; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAlert } from "../../contexts/AlertController";

// Prendo l'icona del pin verde
const pinVerde = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Funzione per lo zoom su PDI selezionato
const ChangeView = ({ center, zoom }) => {
  const map = useMap(); 
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

//Componente marker
const MarkerPDI = ({ pdi, isSelezionato, onPinClick }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (isSelezionato && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelezionato]);

  return (
    <Marker 
      position={[pdi.geometry.coordinates[1], pdi.geometry.coordinates[0]]} 
      icon={pinVerde}
      ref={markerRef}
      eventHandlers={{
        click: () => onPinClick(pdi)
      }}
    >
      <Popup>
        <div>
          <strong>{pdi.properties.nome}</strong>
        </div>
      </Popup>
    </Marker>
  );
};


// COMPONENTE PRINCIPALE
const MappaTrentino = ({ pdiSelezionatoLista, PdiSelezionatoMappa }) => {

    const { showAlert } = useAlert();
    const [listaPDI, setListaPDI] = useState([]);

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
    
    // Coordinate di centro trento
    const centroTrento = [46.0667, 11.1167]

    return(
        <MapContainer 
            center={centroTrento} 
            zoom={9} 
            minZoom={8}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
            {/* OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* PDI selezionato: esegue lo zoom se cambia */}
            {pdiSelezionatoLista && (
                <ChangeView
                    center={[pdiSelezionatoLista.geometry.coordinates[1], pdiSelezionatoLista.geometry.coordinates[0]]}
                    zoom={15}
                />
            )}

            {/*lista pdi*/}
            {listaPDI.map((pdi) => {
                
                const isSelezionato = pdiSelezionatoLista && pdiSelezionatoLista._id === pdi._id;

                return (
                    <MarkerPDI 
                        key={pdi._id}
                        pdi={pdi}
                        isSelezionato={isSelezionato}
                        onPinClick={PdiSelezionatoMappa} 
                    />
                );
            })}
        </MapContainer>
    );
}

export default MappaTrentino;