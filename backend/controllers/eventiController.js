const mongoose = require('mongoose')
const Evento = require('../models/Evento')
const PDI = require('../models/PDI')
//const Gestore = require('../models/Gestore')

const baseUrl = process.env.API_URL || 'http://localhost:3001'

const validaDati = (dati) => {
    //implementare idGestore vando verrà aggiunta la sua collection
    const { nome, descrizione, categoria, latitudine, longitudine, prezzo, dataInizio, dataFine, idEvento } = dati
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
    const dInizio = new Date(dataInizio)
    const dFine = new Date(dataFine)
    if (
        isNaN(dInizio.getTime())
        || isNaN(dFine.getTime())
        || dInizio.getTime() > dFine.getTime()) {
        return {
            datiValidi: false,
            errore: 'Le date di inizio e fine sono obbligatorie e la data di fine non può venire prima di quella di inizio'
        }
    }


    //controllo degli id
    if (idEvento && !mongoose.Types.ObjectId.isValid(idEvento))
        return {
            datiValidi: false,
            errore: 'Id evento non valido'
        }

    // decommentare quando verrà aggiunta la collection
    /*
    if (idGestore && !mongoose.Types.ObjectId.isValid(idGestore))
        return {
            datiValidi: false,
            errore: 'Id gestore non valido'
        }
    */
    return { datiValidi: true }
}
const fs = require('fs')

const visualizzaTuttiEventi = async (req, res) => {
    try {
        //recupero tutti gli eventi dal database
        const eventiList = await Evento.find({}).populate('properties.pdiCollegato')

        const output = eventiList.map(ev => {
            if (Array.isArray(ev.properties.immagine)) {
                ev.properties.immagine = ev.properties.immagine.map(nomeImmagine => {
                    return `${baseUrl}/uploads/${nomeImmagine}`
                })
            }
            return ev
        })

        return res.status(200).json({
            message: "Lista degli eventi",
            data: output
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

        //aggiungere idGestore quando verrà aggiunta la collection
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
            if (await PDI.findById(pdiCollegato))
                refPdi = pdiCollegato
            else
                return res.status(404).json({ error: "PDI non trovato" })
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
                dataCreazione: new Date(),
                pdiCollegato: refPdi,
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
        const { idEvento } = req.params
        const { nome, descrizione, categoria, latitudine, longitudine, prezzo, dataInizio, dataFine, pdiCollegato, idGestore } = req.body

        if (!idEvento || !nome || !dataInizio || !dataFine || !latitudine || !longitudine)
            return res.status(400).json({ error: "Dati mancanti" })

        const validazione = validaDati(req.body)
        if (!validazione.datiValidi)
            return res.status(400).json({ error: validazione.errore })
        const ev = await Evento.findById(idEvento)
        if (!ev) {
            return res.status(404).json({ error: "Evento non trovato" })
        }
        // const gest = await Gestore.findById(idGestore)
        // if (!gest) {
        //     return res.status(404).json({ error: "Gestore non trovato" })
        // }

        let arrayImmagini = []
        if (req.files && req.files.length > 0) {
            arrayImmagini = req.files.map(file => file.filename)
        }

        ev.set('properties.nome', (nome || ev.properties.nome))
        ev.set('properties.descrizione', (descrizione || ev.properties.descrizione))
        ev.set('properties.categoria', (categoria || ev.properties.categoria))
        ev.set('properties.prezzo', (prezzo || ev.properties.prezzo))
        ev.set('properties.immagine', (arrayImmagini || ev.properties.immagine))
        ev.set('properties.dataInizio', (dataInizio || ev.properties.dataInizio))
        ev.set('properties.dataFine', (dataFine || ev.properties.dataFine))
        ev.set('properties.idGestore', (idGestore || ev.properties.idGestore))
        ev.set('properties.pdiCollegato', (pdiCollegato || ev.properties.pdiCollegato))

        ev.set('geometry.coordinates.0', (longitudine, ev.geometry.coordinates[0]))
        ev.set('geometry.coordinates.1', (latitudine, ev.geometry.coordinates[1]))

        const eventoAggiornato = await ev.save()

        return res.status(200).json({
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

        ev.properties.immagine = ev.properties.immagine.map(nomeImmagine => {
            return `${baseUrl}/uploads/${nomeImmagine}`
        })

        return res.status(200).json({ message: "Evento trovato", data: ev })
    }
    catch ({ name, message }) {
        console.error("Errore nella visualizzazione dell'evento: ", message)
        return res.status(500).json({ error: `${name}: ${message}` })
    }
}

//elimina evento
const eliminaEvento = async (req, res) => {
    try {
        const { id } = req.params

        //controllo se l'evento esiste
        const eventoEsistente = await Evento.findById(id)
        if (!eventoEsistente) {
            return res.status(404).json({ error: "Evento non trovato" })
        }

        //controlle se l'evento ha immagini associate e le elimino
        if (eventoEsistente.properties.immagine && eventoEsistente.properties.immagine.length > 0) {
            eventoEsistente.properties.immagine.forEach(immagine => {
                const percorsoImmagine = `./uploads/${immagine}`;
                if (fs.existsSync(percorsoImmagine)) {
                    fs.unlinkSync(percorsoImmagine);
                }
            });
        }

        //elimino l'evento dal database
        await eventoEsistente.deleteOne()
        res.status(200).json({
            message: "Evento eliminato con successo",
            data: eventoEsistente
        });

    } catch (error) {

        console.error("Errore nell'eliminazione dell'evento:", error)
        res.status(500).json({ error: "Errore interno del server" })

    }
}
module.exports = { visualizzaTuttiEventi, creaEvento, eliminaEvento, modificaEvento, visualizzaEvento }
