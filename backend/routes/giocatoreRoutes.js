const express = require("express");
const router = express.Router();

const Giocatore = require("../controllers/giocatoreController");

//route per la visualizzazione di tutti i giocatori
router.get("/", Giocatore.visualizzaGiocatori);

//route per la registrazione di un nuovo giocatore
router.post("/", Giocatore.registrazioneGiocatore);

module.exports = router;