const Gestore = require("../models/Gestore")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        const gestori = await Gestore.find({}).select('-password -resetToken -scadenzaResetToken').populate('pdiCollegati')

        res.status(200).json({
            message: "Lista dei gestori",
            data: gestori
        })
    } catch (error) {
        console.error("Errore nel recupero dei gestori", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const loginGestore = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Email e password sono obbligatorie" })
        }

        const gestore = await Gestore.findOne({ email: email.toLowerCase() }).select('+password')
        if (!gestore) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const passwordCorretta = await bcrypt.compare(password, gestore.password)
        if (!passwordCorretta) {
            return res.status(401).json({ error: "Credenziali non valide" })
        }

        const token = jwt.sign(
            { id: gestore._id, ruolo: 'gestore' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            message: "Login effettuato con successo",
            token,
            data: {
                id: gestore._id,
                nome: gestore.nome,
                email: gestore.email,
                ruolo: 'gestore'
            }
        })

    } catch (error) {
        console.error("Errore nel login del gestore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const abilitaGestore = async (req,res) => {

    try{

        const { id } = req.params;
        const { abilitato } = req.body;

        //controllo che lo stato sia valido
        if (![true, false].includes(abilitato)) {
            return res.status(400).json({ 
                error: "Stato non valido. Scegli 'true' o 'false'." 
            });
        }

        //controllo se il gestore esiste
        const gestore = await Gestore.findById(id);

        if (!gestore) {
            return res.status(404).json({ error: "Gestore non trovato." });
        }

        //modifico l'abilitazione del gestore
        gestore.abilitato = abilitato;
        await gestore.save();

        res.status(200).json({
            message: `Gestore ${abilitato ? 'abilitato' : 'disabilitato'} con successo`,
            data: gestore
        });

    } catch(error) {
         console.error("Errore nel recupero del gestore ", error)
        res.status(500).json({ error: "Errore interno del server" })
    }


}

const visualizzaGestore = async (req,res) => {

    try{
        const gestore = await Gestore.findById(req.params.id)
    
        if(!gestore){
            return res.status(404).json({ error: "Gestore non trovato" });
        }
    
        res.status(200).json({
            data: gestore
        })
    
    } catch(error){
        console.error("Errore nel recupero del gestore", error)
        res.status(500).json({ error: "Errore interno del server" })
    }

}

module.exports = { registrazioneGestore, visualizzaGestori, loginGestore, abilitaGestore, visualizzaGestore }
