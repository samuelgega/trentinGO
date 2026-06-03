const express = require('express')
const router = express.Router()

const Auth = require('../controllers/authController')
const { verificaToken } = require('../middlewares/authMiddleware')

router.post('/login', Auth.login)

//recupero password
router.post('/resetPassword', Auth.richiestaResetPassword)
router.put('/resetPassword/:token', Auth.resetPassword)

//rotta per la visualizzazione dei dati dell'utente
router.get('/datiUtente', verificaToken, Auth.visualizzaProfilo)


module.exports = router
