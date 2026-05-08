const express = require("express");
const router = express.Router();

//importare il controller del PDI
const PDI = require("../controllers/pdiController");

//route per visualizzare tutti i PDI
router.get("/", PDI.visualizzaTuttiPDI);


//Route per creare un nuovo PDI
router.post("/", PDI.creaPDI);


module.exports = router;