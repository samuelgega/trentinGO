const express = require("express");
const router = express.Router();

const Giocatore = require("../controllers/giocatoreController");
const { verificaToken, requireRuolo, autorizzaModifica, autorizzaEliminazione } = require("../middlewares/authMiddleware");

//route per la visualizzazione di tutti i giocatori
router.get("/", verificaToken, requireRuolo('amministratore'), Giocatore.visualizzaGiocatori);

//route per la registrazione di un nuovo giocatore
router.post("/", Giocatore.registrazioneGiocatore);

//modifica utente
router.put('/:id', verificaToken, autorizzaModifica('giocatore'), Giocatore.modificaProfilo)

//elimina utente
router.delete('/:id', verificaToken, autorizzaEliminazione('giocatore'), Giocatore.eliminaProfilo)

//visualizza giocatore
router.get("/:id", verificaToken, requireRuolo('giocatore', 'amministratore'), Giocatore.visualizzaGiocatore)

module.exports = router;