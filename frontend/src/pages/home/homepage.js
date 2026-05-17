import React, {useState} from 'react';
import HomeNav from '../../components/homeComponents/HomeNav';
import MappaTrentino from '../../components/homeComponents/MappaTrentino';
import ListaPDI from '../../components/homeComponents/ListaPDI';
import '../../assets/home.css'

const Homepage = () => {
  
  //controllo quele pdi viene selezionato
  const [pdiSelezionato, setPdiSelezionato] = useState(null);

  return (
      <div className='vh-100 d-flex flex-column overflow-hidden'>
      <HomeNav />
        <div className='container-fluid p-0 w-100 flex-grow-1 overflow-hidden'>
          <div className='row g-0 h-100'>
            {/*Parte sisnistra riservata alla mappa */}
            <div className="col-12 col-lg-8 col-mappa position-relative p-0">
              <MappaTrentino 
                pdiSelezionatoLista={pdiSelezionato}
                PdiSelezionatoMappa={setPdiSelezionato}
              />

            </div>
            {/*Parte destra riservata alla lista e al filtro dei PDI */}
            <div className="col-12 col-lg-4 bg-light overflow-hidden border-start col-lista p-0">
              <ListaPDI 
                  PdiSelezionatoLista={setPdiSelezionato} 
                  pdiSelezionatoMappa={pdiSelezionato} 
              />
            </div>

          </div>
        </div>
      </div>
  );
};

export default Homepage;