const Giocatore = require("../models/Giocatore")
const bcrypt = require('bcrypt')
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

        if (password.length < 8) {
            return res.status(400).json({ error: "La password deve essere di almeno 8 caratteri" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Inserisci un'email valida" });
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
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //creazione nuovo giocatore
        const nuovoGiocatore = await Giocatore.create({
            username: username,
            email: email.toLowerCase(),
            password: hashedPassword,
            iscrittoNewsletter: iscrittoNewsletter ?? false
        })

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

        const passwordCorretta = await bcrypt.compare(password, giocatore.password)
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

const modificaProfilo = async (req, res) => {
    try {
        const { idUtente } = req.params
        let utente = await Giocatore.findById(idUtente).select('-password -resetToken -scadenzaResetToken')
        if (!utente) {
            return res.status(404).json({ error: "Utente non trovato" })
        }

        const { username, email } = req.body

        if (username) {
            const usernameFormattato = String(username).toLowerCase();
            const u = await Giocatore.findOne({ username: usernameFormattato, _id: { $ne: idUtente } }) || 
                      await Gestore.findOne({ username: usernameFormattato }) || 
                      await Amministratore.findOne({ username: usernameFormattato })
            if (u) {
                return res.status(409).json({ error: "Username già in uso" })
            }
            utente.username = username
        }

        if (email) {
            const emailFormattata = String(email).toLowerCase();
            const u = await Giocatore.findOne({ email: emailFormattata, _id: { $ne: idUtente } }) || 
                      await Gestore.findOne({ email: emailFormattata }) || 
                      await Amministratore.findOne({ email: emailFormattata })
            if (u) {
                return res.status(409).json({ error: "Email già registrata" })
            }
            utente.email = emailFormattata
        }

        await utente.save()
        return res.status(200).json({ message: "Utente aggiornato con successo", data: utente })
    }
    catch (error) {
        console.error("Errore nella modifica del giocatore: ", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const eliminaProfilo = async (req,res) => {
    try {
        const idDaEliminare = req.params.idUtente; 
        
        const eliminato = await Giocatore.findByIdAndDelete(idDaEliminare);
        
        if (!eliminato) return res.status(404).json({ error: "Giocatore non trovato" });
        
        res.status(200).json({ message: "Giocatore eliminato con successo" });
    } catch (error) {
        res.status(500).json({ error: "Errore interno" });
    }
}

const visualizzaGiocatore = async (req,res) => {

    try {

        //controllo chi sta facendo la richiesta
        const idTarget = req.params.id;
        const idRichiedente = req.utente.id;
        const ruoloRichiedente = req.utente.ruolo;

        if (idTarget !== idRichiedente && ruoloRichiedente !== 'amministratore') {
            return res.status(403).json({ error: "Non hai i permessi per visualizzare i dati di un altro utente." });
        }

        //recupero il giocatore dal db
        const giocatore = await Giocatore.findById(idTarget).select('-password -resetToken -scadenzaResetToken');
        if (!giocatore) {
            return res.status(404).json({ error: "Giocatore non trovato" });
        }

        return res.status(200).json({ data: giocatore });

    } catch (error){
        console.error("Errore nel recupero del Giocatore:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }

}

module.exports = { registrazioneGiocatore, visualizzaGiocatori, loginGiocatore, modificaProfilo, eliminaProfilo, visualizzaGiocatore };
