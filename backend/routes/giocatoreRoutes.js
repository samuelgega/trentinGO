const express = require("express");
const router = express.Router();

const Giocatore = require("../controllers/giocatoreController");

router.post("/", Giocatore.registrazioneGiocatore);

module.exports = router;