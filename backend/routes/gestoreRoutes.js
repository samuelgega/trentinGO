const express = require("express");
const router = express.Router();

const Gestore = require("../controllers/gestoreController");
const { verificaToken, requireRuolo } = require("../middlewares/authMiddleware");

//route per la visualizzazione di tutti i gestori
router.get("/",Gestore.visualizzaGestori);

//route per la registrazione di un nuovo gestore
router.post("/registrazione", Gestore.registrazioneGestore);

//route per il login di un gestore
router.post("/login", Gestore.loginGestore);

//rotta per visualizzare un gestore
router.get("/:id", Gestore.visualizzaGestore);

//rotta per abilitare un gestore
router.put("/abilitato/:id", Gestore.abilitaGestore);

//verificaToken, requireRuolo('amministratore')

module.exports = router;
