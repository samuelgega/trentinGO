const express = require("express");
const router = express.Router();

const Gestore = require("../controllers/gestoreController");
const { verificaToken, requireRuolo, autorizzaModifica, autorizzaEliminazione } = require("../middlewares/authMiddleware");

//route per la visualizzazione di tutti i gestori
router.get("/", verificaToken, requireRuolo('amministratore'), Gestore.visualizzaGestori);

//route per la registrazione di un nuovo gestore
router.post("/", Gestore.registrazioneGestore);

//rotta per visualizzare i pdi collegati ad un gestore
router.get("/pdiGestore", verificaToken, requireRuolo('gestore'), Gestore.visualizzaGestorePDI);

//rotta per visualizzare un gestore
router.get("/:id", verificaToken, requireRuolo('amministratore'), Gestore.visualizzaGestore);

//rotta per abilitare un gestore
router.put("/abilitato/:id", verificaToken, requireRuolo('amministratore'), Gestore.abilitaGestore);

//modifica utente
router.put('/:id', verificaToken, autorizzaModifica('gestore'), Gestore.modificaProfilo)

//elimina utente
router.delete('/:id', verificaToken, autorizzaEliminazione('gestore'), Gestore.eliminaProfilo)


module.exports = router;
