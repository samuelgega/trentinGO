const express = require('express');
const router = express.Router();

const richAssPDI = require('../controllers/richAssPDIController');

//rotta per visualizzare tutte le richieste
router.get("/", richAssPDI.visualizzaRichieste);


module.exports = router;