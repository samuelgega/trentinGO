const express = require("express");
const router = express.Router();

//importare il controller del PDI
const PDI = require("../controllers/pdiController");

//importare il middleware per l'upload delle immagini
const upload = require("../middlewares/upload");

//route per visualizzare tutti i PDI
router.get("/", PDI.visualizzaTuttiPDI);


//Route per creare un nuovo PDI
router.post("/", upload.array("immagine",10), PDI.creaPDI);


module.exports = router;