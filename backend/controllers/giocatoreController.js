const Giocatore = require("../models/Giocatore")
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Gestore = require('../models/Gestore')
const Amministratore = require('../models/Amministratore')

const registrazioneGiocatore = async (req, res) => {
    try {

        //dati dal frontend
        const { username, email, password, iscrittoNewsletter } = req.body

        //controllo se mancano dati
        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email e password sono obbligatori" });
        }

        //controllo se username esiste gia
        const usernameEsistente = await Giocatore.findOne({ username: username })
        if (usernameEsistente) {
            return res.status(409).json({ error: "Username gia esistente" });
        }

        //controllo se l'email esiste gia
        const emailEsistente = await Giocatore.findOne({ email: email.toLowerCase() })
        if (emailEsistente) {
            return res.status(409).json({ error: "Email gia esistente" });
        }

        //hashing della password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        //creazione nuovo giocatore
        const nuovoGiocatore = await Giocatore.create({
            username: username,
            email: email.toLowerCase(),
            password: hashedPassword,
            iscrittoNewsletter: iscrittoNewsletter ?? false
        })

        await nuovoGiocatore.save()
        res.status(201).json({
            message: "Giocatore registrato con successo",
            data: {
                id: nuovoGiocatore.id,
                username: nuovoGiocatore.username,
                email: nuovoGiocatore.email
            }
        });

    } catch (error) {
        console.error("Errore nella registrazione del giocatore", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

const visualizzaGiocatori = async (req, res) => {
    try {
        const giocatori = await Giocatore.find({}).select('-password -resetToken -scadenzaResetToken');

        res.status(200).json({
            message: "Lista dei giocatori",
            data: giocatori
        });
    } catch (error) {
        console.error("Errore nel recupero dei Giocatori", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

const loginGiocatore = async (req, res) => {
    try {
        const { credenziale, password } = req.body

        if (!credenziale || !password) {
            return res.status(400).json({ error: "Credenziale e password sono obbligatorie" })
        }

        const isEmail = credenziale.includes('@')
        const giocatore = await Giocatore.findOne(
            isEmail ? { email: credenziale.toLowerCase() } : { username: credenziale }
        )

        if (!giocatore) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const passwordCorretta = await bycrypt.compare(password, giocatore.password)
        if (!passwordCorretta) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const token = jwt.sign(
            { id: giocatore._id, ruolo: 'giocatore' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: "Login effettuato con successo",
            token,
            data: {
                id: giocatore._id,
                username: giocatore.username,
                email: giocatore.email,
                ruolo: 'giocatore'
            }
        })

    } catch (error) {
        console.error("Errore nel login del giocatore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { registrazioneGiocatore, visualizzaGiocatori, loginGiocatore };
