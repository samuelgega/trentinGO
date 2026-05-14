import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AlertProvider } from '../src/contexts/AlertController';
import { AdminHome, GestisciPDI, CreaPDI, CreaEvento, GestisciEventi, ModificaPDI, ModificaEvento } from './pages/admin';
import { GestoreHome, GestisciPDIAssociati, GestisciEventiCreati } from './pages/gestore';
import { Homepage, HomeEventi } from './pages/home';
import Error404 from './pages/Error/NotFound';

const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/home/eventi" element={<HomeEventi />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-home/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
          <Route path="/crea-evento" element={<CreaEvento />} />
          <Route path="/admin-home/gestisci-eventi" element={<GestisciEventi />} />
          <Route path="/gestore-home" element={<GestoreHome />} />
          <Route path="/gestore-home/gestisci-pdi-associati" element={<GestisciPDIAssociati />} />
          <Route path="/gestore-home/gestisci-eventi-creati" element={<GestisciEventiCreati />} />
          <Route path="/modifica-pdi/:id" element={<ModificaPDI />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/modifica-evento/:id" element={<ModificaEvento />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
