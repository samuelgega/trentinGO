import react, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AlertProvider } from './components/AlertController'

import AdminHome from './components/adminComponents/AdminHome';
import GestisciPDI from './components/adminComponents/GestisciPDI';
import CreaPDI from './components/adminComponents/CreaPDI'

const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
