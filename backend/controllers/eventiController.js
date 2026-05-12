const Evento = require('../models/Evento')

const visualizzaTuttiEventi = async (req, res) => {
    try {
        //recupero tutti gli eventi dal database
        const eventiList = await Evento.find({}).populate('properties.pdiCollegato');

        res.status(200).json({
            message: "Lista degli eventi",
            data: eventiList
        });

    } catch (error) {
        console.error("Errore nel recupero degli eventi:", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

//creo evento
const creaEvento = async (req, res) => {
    try {
        const { nome, descrizione, categoria, latitudine, longitudine, prezzo, punteggio, dataInizio, dataFine, pdiCollegato } = req.body

        let arrayImmagini = [];
        if (req.files && req.files.length > 0) {
            arrayImmagini = req.files.map(file => file.filename)
        }

        //controllo se il nome è presente e non è vuoto
        if (!nome || nome.trim() === "" || nome.trim().length < 2 || nome.trim().length > 100) {
            return res.status(400).json({ error: "Il campo nome non è valido" })
        }

        //controllo se il punteggio è un numero valido
        if (!punteggio || punteggio < 0) {
            return res.status(400).json({ error: "Il punteggio è un campo obbligatorio e deve essere un numero positivo" })
        }

        //controllo se la posizione è presente e ha valori validi
        if (latitudine === undefined || longitudine === undefined ||
            latitudine < -90 || latitudine > 90 ||
            longitudine < -180 || longitudine > 180
        ) {
            return res.status(400).json({ error: "Le coordinate di latitudine e longitudine sono obbligatorie" })
        }

        const validPdiCollegato = (pdiCollegato && pdiCollegato.trim() !== "") ? pdiCollegato : undefined;

        //creo il nuovo PDI nel database
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
                punteggio: punteggio || 0,
                immagine: arrayImmagini,
                dataInizio,
                dataFine,
                dataCreazione: Date.now(),
                pdiCollegato: validPdiCollegato
            }
        })

        res.status(201).json({
            message: "Evento creato con successo",
            data: nuovoEvento
        })

    } catch (error) {
        console.error("Errore nella creazione dell'evento:", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { visualizzaTuttiEventi, creaEvento }