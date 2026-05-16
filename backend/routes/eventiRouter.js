const express = require("express")
const EventiController = require('../controllers/eventiController')
const upload = require("../middlewares/upload")

const router = express.Router()

//route per visualizzare gli eventi
router.get("/", EventiController.visualizzaTuttiEventi)
router.get('/:idEvento', EventiController.visualizzaEvento)

//route per creare eventi
router.post('/', upload.array('immagine', 10), EventiController.creaEvento)

//modifica degli eventi
router.put('/:idEvento', upload.array('immagine', 10), EventiController.modificaEvento)
//route per eliminare un singolo evento
router.delete('/:id', EventiController.eliminaEvento)

module.exports = router

