import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AlertProvider } from '../src/contexts/AlertController';
import { AdminHome, GestisciPDI, CreaPDI, CreaEvento, GestisciEventi, ModificaPDI, ModificaEvento } from './pages/admin';
import { GestoreHome, GestisciPDIAssociati, GestisciEventiCreati } from './pages/gestore';
import { Homepage, HomeEventi } from './pages/home';
import HomeProfilo from './pages/profilo/HomeProfilo';
import Error404 from './pages/Error/NotFound';
import InfoPDI from './pages/pdi/InfoPDI'
import InfoEvento from './pages/eventi/InfoEvento'
import AuthGiocatore from './pages/auth/giocatore'
import AuthGestore from './pages/auth/gestore'

const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/home/eventi" element={<HomeEventi />} />
          <Route path="/profilo" element={<HomeProfilo />} />
          <Route path='/dettagli/:id' element={<InfoPDI />} />
          <Route path='/dettagli-evento/:id' element={<InfoEvento />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-home/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
          <Route path="/crea-evento" element={<CreaEvento />} />
          <Route path="/admin-home/gestisci-eventi" element={<GestisciEventi />} />
          <Route path="/gestore-home" element={<GestoreHome />} />
          <Route path="/gestore-home/gestisci-pdi-associati" element={<GestisciPDIAssociati />} />
          <Route path="/gestore-home/gestisci-eventi-creati" element={<GestisciEventiCreati />} />
          <Route path="/modifica-pdi/:id" element={<ModificaPDI />} />
          <Route path="/auth/giocatore" element={<AuthGiocatore />} />
          <Route path="/auth/gestore" element={<AuthGestore />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/modifica-evento/:id" element={<ModificaEvento />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
