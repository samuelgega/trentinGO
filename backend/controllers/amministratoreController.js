const Amministratore = require('../models/Amministratore')
const Giocatore = require('../models/Giocatore')
const Gestore = require('../models/Gestore')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const creaAmministratore = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email e password sono obbligatori" })
        }

        const usernameEsistente = await Amministratore.findOne({ username })
        if (usernameEsistente) {
            return res.status(409).json({ error: "Username già esistente" })
        }

        const emailEsistente = await Amministratore.findOne({ email: email.toLowerCase() })
        if (emailEsistente) {
            return res.status(409).json({ error: "Email già esistente" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const nuovoAmministratore = await Amministratore.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        })

        res.status(201).json({
            message: "Amministratore creato con successo",
            data: {
                id: nuovoAmministratore._id,
                username: nuovoAmministratore.username,
                email: nuovoAmministratore.email,
            }
        })

    } catch (error) {
        console.error("Errore nella creazione dell'amministratore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const visualizzaAmministratori = async (req, res) => {

    try {
        const amministratori = await Amministratore.find({}).select('-password')

        res.status(200).json({
            message: "Lista degli Amministratori",
            data: amministratori
        });
    } catch (error) {
        console.error("Errore nel recupero degli Amministratori", error);
        res.status(500).json({ error: "Errore interno del server" });
    }

}

const loginAmministratore = async (req, res) => {
    try {
        const { credenziale, password } = req.body

        if (!credenziale || !password) {
            return res.status(400).json({ error: "Credenziale e password sono obbligatorie" })
        }

        const isEmail = credenziale.includes('@')
        const amministratore = await Amministratore.findOne(
            isEmail ? { email: credenziale.toLowerCase() } : { username: credenziale }
        )

        if (!amministratore) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const passwordCorretta = await bcrypt.compare(password, amministratore.password)
        if (!passwordCorretta) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const token = jwt.sign(
            { id: amministratore._id, ruolo: 'amministratore' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: "Login effettuato con successo",
            token,
            data: {
                id: amministratore._id,
                username: amministratore.username,
                email: amministratore.email,
                ruolo: 'amministratore'
            }
        })

    } catch (error) {
        console.error("Errore nel login dell'amministratore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const modificaProfilo = async (req, res) => {
    try {
        const { idUtente } = req.params
        let utente = await Amministratore.findById(idUtente).select('-password -resetToken -scadenzaResetToken')
        if (!utente) {
            return res.status(404).json({ error: "Utente non trovato" })
        }

        const { username, email } = req.body

        if (username) {
            const u = await Amministratore.findOne({ username: String(username).toLocaleLowerCase() }) || await Gestore.findOne({ username: String(username).toLocaleLowerCase() }) || await Amministratore.findOne({ username: String(username).toLocaleLowerCase() })
            if (u) {
                return res.status(409).json({ error: "Username già in uso" })
            }
            utente.username = username
        }

        if (email) {
            const u = await Giocatore.findOne({ email: String(email).toLocaleLowerCase() }) || await Gestore.findOne({ email: String(email).toLocaleLowerCase() }) || await Amministratore.findOne({ email: String(email).toLocaleLowerCase() })
            if (u) {
                return res.status(409).json({ error: "Email già registrata" })
            }
            utente.email = email
        }

        utente.save()
        return res.status(200).json({ message: "Utente aggiornato con successo", data: utente })
    }
    catch (error) {
        console.error("Errore nella modifica dell'amministratore: ", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const eliminaProfilo = async (req,res) => {
    try {
        const idDaEliminare = req.params.idUtente; 
        
        const eliminato = await Amministratore.findByIdAndDelete(idDaEliminare);
        
        if (!eliminato) return res.status(404).json({ error: "Amministratore non trovato" });
        
        res.status(200).json({ message: "Amministratore eliminato con successo" });
    } catch (error) {
        res.status(500).json({ error: "Errore interno" });
    }
}

module.exports = { creaAmministratore, visualizzaAmministratori, loginAmministratore, modificaProfilo, eliminaProfilo }
