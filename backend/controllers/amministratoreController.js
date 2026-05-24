const Amministratore = require('../models/Amministratore')
const bcrypt = require('bcrypt')

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

const visualizzaAmministratori = async (req,res) => {

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

module.exports = { creaAmministratore, visualizzaAmministratori }
