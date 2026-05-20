import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icona del pin verde per i marker sulla mappa
const pinVerde = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Centro e zoom della mappa al caricamento iniziale
const CENTRO_DEFAULT = [46.0667, 11.1167];
const ZOOM_DEFAULT = 9;

// Componente interno che controlla la posizione e lo zoom della mappa:
// - zooma sul PDI selezionato
// - torna al centro default quando il PDI viene deselezionato
// - torna al centro default quando si clicca un chip categoria (resetKey)
const ChangeView = ({ pdiSelezionato, resetKey }) => {
  const map = useMap();
  const precedente = useRef(null);  // tiene traccia del PDI precedentemente selezionato
  const primoRender = useRef(true); // impedisce il flyTo al primo mount del componente

  // Reagisce alla selezione/deselezione di un PDI dalla lista
  useEffect(() => {
    if (pdiSelezionato) {
      map.flyTo(
        [pdiSelezionato.geometry.coordinates[1], pdiSelezionato.geometry.coordinates[0]],
        15,
        { duration: 1.5 }
      );
    } else if (precedente.current !== null) {
      // Torna al centro solo se c'era un PDI selezionato prima (non al caricamento iniziale)
      map.flyTo(CENTRO_DEFAULT, ZOOM_DEFAULT, { duration: 1.5 });
    }
    precedente.current = pdiSelezionato;
  }, [pdiSelezionato, map]);

  // Reagisce al click su qualsiasi chip categoria: torna sempre al centro default
  useEffect(() => {
    if (primoRender.current) { primoRender.current = false; return; }
    map.flyTo(CENTRO_DEFAULT, ZOOM_DEFAULT, { duration: 1.5 });
  }, [resetKey, map]);

  return null;
}

// Componente marker singolo: apre il popup automaticamente se è il PDI selezionato
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
// Riceve pdiFiltrati (già filtrati da Homepage) invece di fare un fetch proprio,
// così mappa e lista mostrano sempre gli stessi PDI
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

            {/* Gestisce zoom e posizione in risposta a selezione PDI e cambio filtro */}
            <ChangeView pdiSelezionato={pdiSelezionatoLista} resetKey={resetMappaKey} />

            {/* Renderizza solo i marker dei PDI che passano il filtro attivo */}
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
