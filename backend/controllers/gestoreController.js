const Gestore = require("../models/Gestore")
const bcrypt = require('bcrypt')

const registrazioneGestore = async (req, res) => {
    try {

        const { nome, email, password, partitaIva } = req.body

        if (!nome || !email || !password || !partitaIva) {
            return res.status(400).json({ error: "nome, email, password e partitaIva sono obbligatori" })
        }

        const nomeEsistente = await Gestore.findOne({ nome: nome })
        if (nomeEsistente) {
            return res.status(409).json({ error: "Nome già esistente" })
        }

        const emailEsistente = await Gestore.findOne({ email: email.toLowerCase() })
        if (emailEsistente) {
            return res.status(409).json({ error: "Email già esistente" })
        }

        const partitaIvaEsistente = await Gestore.findOne({ partitaIva: partitaIva })
        if (partitaIvaEsistente) {
            return res.status(409).json({ error: "Partita IVA già esistente" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const nuovoGestore = await Gestore.create({
            nome: nome,
            email: email.toLowerCase(),
            password: hashedPassword,
            partitaIva: partitaIva,
        })

        await nuovoGestore.save()
        res.status(201).json({
            message: "Gestore registrato con successo",
            data: {
                id: nuovoGestore.id,
                nome: nuovoGestore.nome,
                email: nuovoGestore.email
            }
        })

    } catch (error) {
        console.error("Errore nella registrazione del gestore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const visualizzaGestori = async (req, res) => {
    try {
        const gestori = await Gestore.find({}).select('-password')

        res.status(200).json({
            message: "Lista dei gestori",
            data: gestori
        })
    } catch (error) {
        console.error("Errore nel recupero dei gestori", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { registrazioneGestore, visualizzaGestori }
