const express = require('express')
const router = express.Router()

const Amministratore = require('../controllers/amministratoreController')
const { verificaToken, requireRuolo } = require('../middlewares/authMiddleware')

//rotta per la visualizzazione degli amministratori
router.get('/', verificaToken, requireRuolo('amministratore'), Amministratore.visualizzaAmministratori)

// route per la creazione di un nuovo amministratore
router.post('/', verificaToken, requireRuolo('amministratore'), Amministratore.creaAmministratore)

// route per il login di un amministratore
router.post('/login', Amministratore.loginAmministratore)

module.exports = router
