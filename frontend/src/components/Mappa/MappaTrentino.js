import React from "react";
import {MapContainer,TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const MappaTrentino = () => {

    //coodinatre di centro trento
    const centroTrento = [46.0667, 11.1167]

    return(

        <MapContainer 
            center={centroTrento} 
            zoom={9} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
            {/*OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>

    );

}

export default MappaTrentino;