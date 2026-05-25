const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Giocatore = require('../models/Giocatore')
const Gestore = require('../models/Gestore')

const login = async (req, res) => {
    try {
        const { credenziale, password } = req.body

        if (!credenziale || !password) {
            return res.status(400).json({ error: "Credenziale e password sono obbligatorie" })
        }

        const isEmail = credenziale.includes('@')
        let utente = null
        let ruolo = null

        if (isEmail) {
            utente = await Giocatore.findOne({ email: credenziale.toLowerCase() })
            if (utente) {
                ruolo = 'giocatore'
            } else {
                utente = await Gestore.findOne({ email: credenziale.toLowerCase() }).select('+password')
                if (utente) ruolo = 'gestore'
            }
        } else {
            utente = await Giocatore.findOne({ username: credenziale })
            if (utente) ruolo = 'giocatore'
        }

        if (!utente) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const passwordCorretta = await bcrypt.compare(password, utente.password)
        if (!passwordCorretta) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const token = jwt.sign(
            { id: utente._id, ruolo },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: "Login effettuato con successo",
            token,
            data: {
                id: utente._id,
                nome: utente.username ?? utente.nome,
                email: utente.email,
                ruolo
            }
        })

    } catch (error) {
        console.error("Errore nel login", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { login }
