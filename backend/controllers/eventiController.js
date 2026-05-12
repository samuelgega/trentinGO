const mongoose = require('mongoose')
const Evento = require('../models/Evento')
const PDI = require('../models/PDI')

const validaDati = (dati) => {
    const { nome, descrizione, categoria, latitudine, longitudine, prezzo, dataInizio, dataFine } = dati
    //controllo se il nome è valido
    if (nome.trim() === "" || nome.trim().length < 2 || nome.trim().length > 100) {
        return {
            datiValidi: false,
            errore: 'Il nome è obbligatorio e deve avere dai 2 ai 200 caratteri'
        }
    }

    //controllo se la posizione ha valori validi
    if (latitudine === undefined || longitudine === undefined ||
        latitudine < -90 || latitudine > 90 ||
        longitudine < -180 || longitudine > 180
    ) {
        return {
            datiValidi: false,
            errore: 'Le coordinate sono obbligatorie e devono essere valide'
        }
    }

    if (descrizione && descrizione.length > 500) {
        return {
            datiValidi: false,
            errore: 'La descrizione deve essere lunga massimo 500 caratteri'
        }
    }

    if (prezzo && prezzo < 0) {
        return {
            datiValidi: false,
            errore: 'Il prezzo deve essere maggiore di 0'
        }
    }

    //controllo se le date hanno senso
    if (dataInizio > dataFine) {
        return {
            datiValidi: false,
            errore: 'Le date di inizio e fine sono obbligatorie e la data di fine non può venire prima di quella di inizio'
        }
    }
}

const visualizzaTuttiEventi = async (req, res) => {
    try {
        //recupero tutti gli eventi dal database
        const eventiList = await Evento.find({}).populate('properties.pdiCollegato');

        return res.status(200).json({
            message: "Lista degli eventi",
            data: eventiList
        })

    } catch (e) {
        console.error("Errore nel recupero degli eventi:", e)
        return res.status(500).json({ error: e })
    }
}

//creo evento
const creaEvento = async (req, res) => {
    try {
        const validazione = validaDati(req.body)
        if (!validazione.datiValidi)
            return res.status(400).json({ error: validazione.errore })

        const { nome, descrizione, categoria, latitudine, longitudine, prezzo, dataInizio, dataFine, pdiCollegato } = req.body

        if (!nome || !dataInizio || !dataFine || !latitudine || !longitudine)
            return res.status(400).json({ error: "Dati mancanti" })

        let arrayImmagini = [];
        if (req.files && req.files.length > 0) {
            arrayImmagini = req.files.map(file => file.filename)
        }

        //controllo se il pdi fornito esiste nel db
        let refPdi = undefined
        if (pdiCollegato) {
            if (!mongoose.Types.ObjectId.isValid(pdiCollegato)) {
                return res.status(400).json({ error: "Id fornito non è valido" })
            }
            if (await PDI.findById(pdiCollegato))
                refPdi = pdiCollegato
            else
                return res.status(400).json({ error: "PDI non trovato" })
        }

        //creo il nuovo evento nel database
        const nuovoEvento = await Evento.create({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [longitudine, latitudine]
            },
            properties: {
                nome,
                descrizione,
                categoria,
                prezzo: prezzo || 0,
                immagine: arrayImmagini,
                dataInizio,
                dataFine,
                dataCreazione: Date.now(),
                pdiCollegato: refPdi
            }
        })

        return res.status(201).json({
            message: "Evento creato con successo",
            data: nuovoEvento
        })

    } catch ({ name, message }) {
        console.error("Errore nella creazione dell'evento:", message)
        return res.status(500).json({ error: message })
    }
}

const modificaEvento = async (req, res) => {
    try {
        const { idEvento, nuoviDati } = req.body
        if (!idEvento || !mongoose.Types.ObjectId.isValid(idEvento))
            return res.status(400).json({ error: "Id fornito non è valido" })

        const ev = await Evento.findById(idEvento)
        if (!ev) {
            return res.status(404).json({ error: "Evento non trovato" })
        }

        let arrayImmagini = []
        if (req.files && req.files.length > 0) {
            arrayImmagini = req.files.map(file => file.filename)
        }

        for (const key in nuoviDati)
            ev.set(`properties.${key}`, nuoviDati[key])
        ev.set('properties.immagine', arrayImmagini)

        const eventoAggiornato = await ev.save()

        return res.status(201).json({
            message: "Evento aggiornato con successo",
            data: eventoAggiornato
        })
    }
    catch ({ name, message }) {
        console.error("Errore nella modifica dell'evento: ", message)
        return res.status(500).json({ error: `${name}: ${message}` })
    }
}

const visualizzaEvento = async (req, res) => {
    try {
        const ev = await Evento.findById(req.params.idEvento)
        if (!ev)
            return res.status(404).json({ error: "Evento non trovato" })
        return res.status(200).json({ message: "Evento trovato", data: ev })
    }
    catch ({ name, message }) {
        console.error("Errore nella modifica dell'evento: ", message)
        return res.status(500).json({ error: `${name}: ${message}` })
    }
}

module.exports = { visualizzaTuttiEventi, creaEvento, modificaEvento, visualizzaEvento }