import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AlertProvider } from '../src/contexts/AlertController';
import { AdminHome, GestisciPDI, CreaPDI, CreaEvento, GestisciEventi, ModificaPDI, ModificaEvento } from './pages/admin';
import { GestoreHome, GestisciPDIAssociati, GestisciEventiCreati } from './pages/gestore';
import Mappa from './pages/Mappa'
import ListaEventi from './pages/ListaEventi'



const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Mappa />} />
          <Route path="/eventi" element={<ListaEventi />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-home/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
          <Route path="/crea-evento" element={<CreaEvento />} />
          <Route path="/admin-home/gestisci-eventi" element={<GestisciEventi />} />
          <Route path="/gestore-home" element={<GestoreHome />} />
          <Route path="/gestore-home/gestisci-pdi-associati" element={<GestisciPDIAssociati />} />
          <Route path="/gestore-home/gestisci-eventi-creati" element={<GestisciEventiCreati />} />
          <Route path="/modifica-pdi/:id" element={<ModificaPDI />} />
          <Route path="/modifica-evento/:id" element={<ModificaEvento />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
