import React from 'react';
import HomeNav from '../../components/homeComponents/HomeNav';
import MappaTrentino from '../../components/Mappa/MappaTrentino';

const Homepage = () => {
  return (
      <div className='vh-100 d-flex flex-column overflow-hidden'>
      <HomeNav />
        <div className='container-fluid p-0 w-100 flex-grow-1'>
          <div className='row g-0 h-100'>
            {/*Parte sisnistra riservata alla mappa */}
            <div className="col-12 col-lg-8 col-mappa position-relative">
              <MappaTrentino />

            </div>
            {/*Parte destra riservata alla lista e al filtro dei PDI */}
            <div className="col-12 col-lg-4 col-lista bg-light overflow-auto border-start shadow-sm p-4">
              <h3 className="fw-bold mb-4">Lista PDI</h3>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Homepage;