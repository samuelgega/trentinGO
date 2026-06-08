const express = require("express")
const EventiController = require('../controllers/eventiController')
const upload = require("../middlewares/upload")
const { verificaToken, requireRuolo } = require("../middlewares/authMiddleware")

const router = express.Router()

//route per visualizzare gli eventi
router.get("/", EventiController.visualizzaTuttiEventi)

//rotta per visualizzare gli eventi creati dal gestore
router.get('/gestore', verificaToken, requireRuolo('gestore'), EventiController.visualizzaEventiGestore)

//rotta per visualizzare un singolo evento
router.get('/:idEvento', EventiController.visualizzaEvento)

//route per creare eventi
router.post('/', verificaToken, requireRuolo('amministratore','gestore'), upload.array('immagine', 10), EventiController.creaEvento)

//modifica degli eventi
router.put('/:idEvento', verificaToken, requireRuolo('amministratore','gestore'), upload.array('immagine', 10), EventiController.modificaEvento)

//route per eliminare un singolo evento
router.delete('/:id', verificaToken, requireRuolo('amministratore','gestore'), EventiController.eliminaEvento)

module.exports = router

