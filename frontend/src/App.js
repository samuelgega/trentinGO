import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AlertProvider } from './components/AlertController'
import { AdminHome, GestisciPDI, CreaPDI, CreaEvento, GestisciEventi } from './components/adminComponents';
import { GestoreHome, GestisciPDIAssociati, GestisciEventiCreati } from './components/gestoreComponents';

const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-home/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
          <Route path="/crea-evento" element={<CreaEvento />} />
          <Route path="/admin-home/gestisci-eventi" element={<GestisciEventi />} />
          <Route path="/gestore-home" element={<GestoreHome />} />
          <Route path="/gestore-home/gestisci-pdi-associati" element={<GestisciPDIAssociati />} />
          <Route path="/gestore-home/gestisci-eventi-creati" element={<GestisciEventiCreati />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
