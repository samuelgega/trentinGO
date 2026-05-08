const express = require("express");
const router = express.Router();

//importare il controller del PDI
const creaPDI = require("../controllers/pdiController");

//Route per creare un nuovo PDI
router.post("/", creaPDI);


module.exports = router;