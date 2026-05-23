const express = require('express');
const router = express.Router();

const richAssPDI = require('../controllers/richAssPDIController');

//rotta per visualizzare tutte le richieste
router.get("/", richAssPDI.visualizzaRichieste);

//rotta per creare una nuova richiesta
router.post("/", richAssPDI.creaRichiesta);

//rotta per visualizzare una singola richiesta
router.get("/:id", richAssPDI.visualizzaRichiesta);

//rotta per gestire la richiesta
router.put("/:id", richAssPDI.gestisciRichiesta);

module.exports = router;