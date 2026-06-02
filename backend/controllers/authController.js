const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Giocatore = require('../models/Giocatore')
const Gestore = require('../models/Gestore')
const inviaEmail = require('../services/testEmail')
const Amministratore = require('../models/Amministratore')

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
            utente = await Giocatore.findOne({ email: (String(credenziale)).toLowerCase() })
            if (utente) {
                ruolo = 'giocatore'
            } else {
                utente = await Gestore.findOne({ email: credenziale.toLowerCase() }).select('+password')
                if (utente) {
                    ruolo = 'gestore'
                } else {
                    utente = await Amministratore.findOne({ email: credenziale.toLowerCase() })
                    if (utente) ruolo = 'amministratore'
                }
            }
        } else {
            utente = await Giocatore.findOne({ username: credenziale })
            if (utente) {
                ruolo = 'giocatore'
            } else {
                utente = await Amministratore.findOne({ username: credenziale })
                if (utente) ruolo = 'amministratore'
            }
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

const richiestaResetPassword = async (req, res) => {
    try {
        const { email } = req.body

        const utente = await Giocatore.findOne({ email: (String(email)).toLowerCase() })
            || await Gestore.findOne({ email: (String(email)).toLowerCase() })
            || await Giocatore.findOne({ username: email })
            || await Gestore.findOne({ nome: email })

        if (!utente) {
            return res.status(200).json({ message: "E' stata mandata una mail con le istruzioni per il recupero password" }) //anche se non è vero, per motivi di sicurezza 
        }

        const tk = crypto.randomBytes(32).toString('hex')
        const resetToken = crypto.createHash('sha256').update(tk).digest('hex')
        const scadenzaResetToken = Date.now() + 3600000 //1h

        utente.resetToken = resetToken
        utente.scadenzaResetToken = scadenzaResetToken
        await utente.save()

        inviaEmail(utente.email, "Istruzioni per il reset della password", `Ciao ${utente.username ?? utente.nome},\n\nHai richiesto di resettare la tua password. Clicca sul link qui sotto per impostare una nuova password:\n\nhttp://localhost:3000/auth/reimposta-password/${tk}<\n\nSe non hai richiesto questo reset, ignora questa email.\n`)
        return res.status(200).json({ message: "E' stata mandata una mail con le istruzioni per il recupero password" })
    } catch (error) {
        console.error("Errore nel reset password", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { nuovaPassword } = req.body
        const { token } = req.params

        if (!nuovaPassword) {
            return res.status(400).json({ error: "La nuova password è obbligatoria" })
        }
        const regex = /(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+\-\[\]\\\/])/ //almeno un numero e un carattere speciale
        if (nuovaPassword.length < 8 || !regex.test(nuovaPassword)) {
            return res.status(400).json({ error: "La password deve essere lunga almeno 8 caratteri e contenere almeno un numero e un carattere speciale" })
        }

        const resetToken = crypto.createHash('sha256').update(token).digest('hex')
        let utente = await Giocatore.findOne({ resetToken, scadenzaResetToken: { $gt: Date.now() } }) || await Gestore.findOne({ resetToken, scadenzaResetToken: { $gt: Date.now() } })

        if (!utente) {
            return res.status(400).json({ error: "Token non valido o scaduto" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(nuovaPassword, salt)
        utente.password = hashedPassword
        utente.resetToken = undefined
        utente.scadenzaResetToken = undefined
        await utente.save()

        res.status(200).json({ message: "Password resettata con successo" })
    }
    catch (error) {
        console.error("Errore nel reset password", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const visualizzaProfilo = async (req, res) => {

    try {
        const userId = req.utente.id;
        const ruolo = req.utente.ruolo;
        let utente = null;

        //cerco nel db il ruolo corretto
        switch (ruolo) {
            case 'giocatore':
                utente = await Giocatore.findById(userId).select('-password -resetToken -scadenzaResetToken'); break;
            case 'gestore':
                utente = await Gestore.findById(userId).select('-password -resetToken -scadenzaResetToken').populate('pdiCollegati'); break;
            case 'amministratore':
                utente = await Amministratore.findById(userId).select('-password'); break;
            default:
                return res.status(400).json({ error: "Ruolo non riconosciuto" });
        }

        if (!utente) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        res.status(200).json({
            message: "Profilo recuperato con successo",
            data: { ...utente.toObject(), ruolo }
        })

    } catch (error) {
        console.error("Errore nel recupero profilo:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

const modificaProfilo = async (req, res) => {
    try {
        const { idUtente } = req.params
        let utente = (await Giocatore.findById(idUtente) || await Gestore.findById(idUtente) || await Amministratore.findById(idUtente)).select('-password -resetToken -scadenzaResetToken')
        if (!utente) {
            return res.status(404).json({ error: "Utente non trovato" })
        }

        const { username, email } = req.body

        if (username) {
            const u = await Giocatore.findOne({ username: String(username).toLocaleLowerCase() }) || await Gestore.findOne({ username: String(username).toLocaleLowerCase() }) || await Amministratore.findOne({ username: String(username).toLocaleLowerCase() })
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
        console.error("Errore nella modifica del giocatore: ", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { login, richiestaResetPassword, resetPassword, visualizzaProfilo, modificaProfilo }
