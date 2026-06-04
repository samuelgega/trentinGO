const express = require('express')
const router = express.Router()

const VisitaController = require('../controllers/visitaController');
const { verificaToken, autorizzaVisita } = require('../middlewares/authMiddleware');

//rotta per la registrazione visita di un PDI
router.post('/pdi', verificaToken, autorizzaVisita, VisitaController.registraPDI)
router.get('/giocatore', verificaToken, VisitaController.getVisiteGiocatore)

//rotta per registrare un visita di un evento
router.post('/evento', verificaToken, autorizzaVisita, VisitaController.registraEvento);

module.exports = router