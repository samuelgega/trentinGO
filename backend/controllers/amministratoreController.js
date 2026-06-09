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


const modificaProfilo = async (req, res) => {
    try {
        const { id } = req.params
        let utente = await Amministratore.findById(id).select('-password -resetToken -scadenzaResetToken')
        if (!utente) {
            return res.status(404).json({ error: "Utente non trovato" })
        }

        const { username, email } = req.body

        if (username) {
            const usernameFormattato = String(username).toLowerCase();
            const u = await Amministratore.findOne({ username: usernameFormattato, _id: { $ne: id } }) || 
                      await Gestore.findOne({ username: usernameFormattato }) || 
                      await Giocatore.findOne({ username: usernameFormattato })
            if (u) {
                return res.status(409).json({ error: "Username già in uso" })
            }
            utente.username = username
        }

        if (email) {
            const emailFormattata = String(email).toLowerCase();
            const u = await Giocatore.findOne({ email: emailFormattata }) || 
                      await Gestore.findOne({ email: emailFormattata }) || 
                      await Amministratore.findOne({ email: emailFormattata, _id: { $ne: id } })
            if (u) {
                return res.status(409).json({ error: "Email già registrata" })
            }
            utente.email = email
        }

        await utente.save()
        return res.status(200).json({ message: "Utente aggiornato con successo", data: utente })
    }
    catch (error) {
        console.error("Errore nella modifica dell'amministratore: ", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const eliminaProfilo = async (req,res) => {
    try {
        const idDaEliminare = req.params.id; 
        
        const eliminato = await Amministratore.findByIdAndDelete(idDaEliminare);
        
        if (!eliminato) return res.status(404).json({ error: "Amministratore non trovato" });
        
        res.status(200).json({ message: "Amministratore eliminato con successo" });
    } catch (error) {
        res.status(500).json({ error: "Errore interno" });
    }
}

module.exports = { creaAmministratore, visualizzaAmministratori, modificaProfilo, eliminaProfilo }
