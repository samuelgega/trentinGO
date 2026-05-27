import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AlertProvider } from '../src/contexts/AlertController';

import { AdminHome, GestisciPDI, CreaPDI, CreaEvento, GestisciEventi, ModificaPDI, ModificaEvento, GestisciUtenti, GestisciGestori } from './pages/admin';
import { GestoreHome, GestisciPDIAssociati, GestisciEventiCreati } from './pages/gestore';
import { Homepage, HomeEventi } from './pages/home';
import HomeProfilo from './pages/profilo/HomeProfilo';
import Error404 from './pages/Error/NotFound';
import InfoPDI from './pages/pdi/InfoPDI'
import InfoEvento from './pages/eventi/InfoEvento'
import { AuthGiocatore, AuthGestore, AuthAdmim, AuthLogin, RecuperoPassword, ReimpostaPassword } from './pages/auth'

import RottaProtetta from './components/auth/RottaProtetta';
import RottaOspite from './components/auth/RottaOspite';

const App = () => {
  return (
    <AlertProvider>
      <Router>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/home/eventi" element={<HomeEventi />} />
          <Route path='/dettagli/:id' element={<InfoPDI />} />
          <Route path='/dettagli-evento/:id' element={<InfoEvento />} />

          {/* Rotte per utenti loggati */}
          <Route path="/profilo" element={
            <RottaProtetta ruoliAmmessi={['giocatore', 'gestore', 'amministratore']}>
              <HomeProfilo />
            </RottaProtetta>
          } />

          {/* Rotte per l'osservatore */}
          <Route path="/auth/giocatore" element={
            <RottaOspite>
              <AuthGiocatore />
            </RottaOspite>
          } />
          <Route path="/auth/gestore" element={
            <RottaOspite>
              <AuthGestore />
            </RottaOspite>
          } />
          <Route path="/auth/login" element={
            <RottaOspite>
              <AuthLogin />
            </RottaOspite>
          } />
          <Route path="/auth/recupero-password" element={
            <RottaOspite>
              <RecuperoPassword />
            </RottaOspite>
          } />
          <Route path="/auth/reimposta-password/:token" element={
            <RottaOspite>
              <ReimpostaPassword />
            </RottaOspite>
          }/>

          {/* Rotte protette per l'admin */}
          <Route path="/admin-home" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <AdminHome />
            </RottaProtetta>
          } />
          <Route path="/admin-home/gestisci-pdi" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <GestisciPDI />
            </RottaProtetta>
          } />
          <Route path="/admin-home/gestisci-eventi" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <GestisciEventi />
            </RottaProtetta>
          } />
          <Route path="/admin-home/gestisci-utenti" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <GestisciUtenti />
            </RottaProtetta>
          } />
          <Route path="/admin-home/gestisci-gestori" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <GestisciGestori />
            </RottaProtetta>
          } />
          <Route path="/crea-pdi" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <CreaPDI />
            </RottaProtetta>
          } />
          <Route path="/modifica-pdi/:id" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <ModificaPDI />
            </RottaProtetta>
          } />
          <Route path="/auth/admin" element={
            <RottaProtetta ruoliAmmessi={['amministratore']}>
              <AuthAdmim />
            </RottaProtetta>
          } />

          {/* Rotte protette per il gestore */}
          <Route path="/gestore-home" element={
            <RottaProtetta ruoliAmmessi={['gestore']}>
              <GestoreHome />
            </RottaProtetta>
          } />
          <Route path="/gestore-home/gestisci-pdi-associati" element={
            <RottaProtetta ruoliAmmessi={['gestore']}>
              <GestisciPDIAssociati />
            </RottaProtetta>
          } />
          <Route path="/gestore-home/gestisci-eventi-creati" element={
            <RottaProtetta ruoliAmmessi={['gestore']}>
              <GestisciEventiCreati />
            </RottaProtetta>
          } />

          {/* Rotte per admin e gestori */}
          <Route path="/modifica-evento/:id" element={
            <RottaProtetta ruoliAmmessi={['gestore', 'amministratore']}>
              <ModificaEvento />
            </RottaProtetta>
          } />
          <Route path="/crea-evento" element={
            <RottaProtetta ruoliAmmessi={['gestore', 'amministratore']}>
              <CreaEvento />
            </RottaProtetta>
          } />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </AlertProvider>
  );
}

export default App;
