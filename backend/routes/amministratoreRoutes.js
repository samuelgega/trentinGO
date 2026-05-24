const express = require('express')
const router = express.Router()

const Amministratore = require('../controllers/amministratoreController')

// route per la creazione di un nuovo amministratore
router.post('/', Amministratore.creaAmministratore)

module.exports = router
