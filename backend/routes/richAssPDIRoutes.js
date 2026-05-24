const express = require('express');
const router = express.Router();

const richAssPDI = require('../controllers/richAssPDIController');
const { verificaToken, requireRuolo } = require('../middlewares/authMiddleware');

//rotta per visualizzare tutte le richieste
router.get("/", verificaToken, requireRuolo('amministratore'), richAssPDI.visualizzaRichieste);

//rotta per creare una nuova richiesta
router.post("/", verificaToken, requireRuolo('gestore'), richAssPDI.creaRichiesta);

//rotta per visualizzare una singola richiesta
router.get("/:id", verificaToken, richAssPDI.visualizzaRichiesta);

//rotta per gestire la richiesta
router.put("/:id", verificaToken, requireRuolo('amministratore'), richAssPDI.gestisciRichiesta);

module.exports = router;