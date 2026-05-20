import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Prendo l'icona del pin verde
const pinVerde = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const CENTRO_DEFAULT = [46.0667, 11.1167];
const ZOOM_DEFAULT = 9;

const ChangeView = ({ pdiSelezionato, resetKey }) => {
  const map = useMap();
  const precedente = useRef(null);
  const primoRender = useRef(true);

  useEffect(() => {
    if (pdiSelezionato) {
      map.flyTo(
        [pdiSelezionato.geometry.coordinates[1], pdiSelezionato.geometry.coordinates[0]],
        15,
        { duration: 1.5 }
      );
    } else if (precedente.current !== null) {
      map.flyTo(CENTRO_DEFAULT, ZOOM_DEFAULT, { duration: 1.5 });
    }
    precedente.current = pdiSelezionato;
  }, [pdiSelezionato, map]);

  useEffect(() => {
    if (primoRender.current) { primoRender.current = false; return; }
    map.flyTo(CENTRO_DEFAULT, ZOOM_DEFAULT, { duration: 1.5 });
  }, [resetKey, map]);

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
const MappaTrentino = ({ pdiFiltrati, pdiSelezionatoLista, PdiSelezionatoMappa, resetMappaKey }) => {

    return(
        <MapContainer
            center={CENTRO_DEFAULT}
            zoom={ZOOM_DEFAULT}
            minZoom={8}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ChangeView pdiSelezionato={pdiSelezionatoLista} resetKey={resetMappaKey} />

            {pdiFiltrati.map((pdi) => {
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