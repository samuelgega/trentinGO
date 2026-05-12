const express = require("express")
const EventiController = require('../controllers/eventiController')
const upload = require("../middlewares/upload")

const router = express.Router()

//route per visualizzare tutti gli eventi
router.get("/", EventiController.visualizzaTuttiEventi)

//route per creare eventi
router.post('/', upload.array('immagine', 10), EventiController.creaEvento)

module.exports = router

