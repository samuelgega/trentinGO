const express = require("express");
const router = express.Router();

const Gestore = require("../controllers/gestoreController");

//route per la visualizzazione di tutti i gestori
router.get("/", Gestore.visualizzaGestori);

//route per la registrazione di un nuovo gestore
router.post("/registrazione", Gestore.registrazioneGestore);

module.exports = router;
