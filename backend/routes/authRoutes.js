const express = require('express')
const router = express.Router()

const Auth = require('../controllers/authController')

router.post('/login', Auth.login)

//recupero password
router.post('/richiestaResetPassword', Auth.richiestaResetPassword)
router.post('/resetPassword/:token', Auth.resetPassword)

module.exports = router
