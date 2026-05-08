import react, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminHome from './components/AdminHome';
import GestisciPDI from './components/GestisciPDI';
import CreaPDI from './components/creaPDI'

class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-dark bg-dark mb-4">
          <div className="container">
            <span className="navbar-brand mb-0 h1">Admin Dashboard</span>
          </div>
        </nav>

        <Routes>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/gestisci-pdi" element={<GestisciPDI />} />
          <Route path="/crea-pdi" element={<CreaPDI />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
