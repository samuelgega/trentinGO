const express = require("express");
const router = express.Router();

//importare il controller del PDI
const PDI = require("../controllers/pdiController");

//importare il middleware per l'upload delle immagini
const upload = require("../middlewares/upload");
const { verificaToken, requireRuolo } = require("../middlewares/authMiddleware");

//route per visualizzare tutti i PDI
router.get("/", PDI.visualizzaTuttiPDI);

//visualizza un PDI specifico
router.get("/:id", PDI.visualizzaPDI);

//Route per creare un nuovo PDI
router.post("/", verificaToken, requireRuolo('amministratore'), upload.array("immagine",10), PDI.creaPDI);

//route per modificare un PDI esistente
router.put("/:id", verificaToken, requireRuolo('amministratore'), upload.array("immagine",10), PDI.modificaPDI);

//route per eliminare un PDI esistente
router.delete("/:id", verificaToken, requireRuolo('amministratore'), PDI.eliminaPDI);


module.exports = router;