const express = require('express')
const router = express.Router()

const Amministratore = require('../controllers/amministratoreController')

//rotta per la vizzazione degli amministratori
router.get('/', Amministratore.visualizzaAmministratori);

// route per la creazione di un nuovo amministratore
router.post('/', Amministratore.creaAmministratore)

// route per il login di un amministratore
router.post('/login', Amministratore.loginAmministratore)

module.exports = router
