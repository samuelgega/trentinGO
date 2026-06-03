const express = require("express");
const router = express.Router();

const Giocatore = require("../controllers/giocatoreController");
const { verificaToken, requireRuolo, autorizzaModifica } = require("../middlewares/authMiddleware");

//route per la visualizzazione di tutti i giocatori
router.get("/", verificaToken, requireRuolo('amministratore'), Giocatore.visualizzaGiocatori);

//route per la registrazione di un nuovo giocatore
router.post("/registrazione", Giocatore.registrazioneGiocatore);

//route per il login di un giocatore
router.post("/login", Giocatore.loginGiocatore);

//modifica utente
router.put('/:idUtente', verificaToken, autorizzaModifica('giocatore'), Giocatore.modificaProfilo)

module.exports = router;