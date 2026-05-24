const express = require("express");
const router = express.Router();

const Giocatore = require("../controllers/giocatoreController");

//route per la visualizzazione di tutti i giocatori
router.get("/", Giocatore.visualizzaGiocatori);

//route per la registrazione di un nuovo giocatore
router.post("/registrazione", Giocatore.registrazioneGiocatore);

//route per il login di un giocatore
router.post("/login", Giocatore.loginGiocatore);

module.exports = router;