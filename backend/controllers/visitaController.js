const Giocatore = require('../models/Giocatore')
const PDI = require('../models/PDI')
const Visita = require('../models/Visita')
const z = require('zod')
const mongoose = require('mongoose')

//definizione schema posizione
const posizioneSchema = z.tuple([
    z.number().min(-90).max(90),
    z.number().min(-180).max(180)
])

const TOLLERANZA = 10
const BASE = 16 //punti necessari per il lvl 2

//funzione che calcola la distanza tra 2 posizioni con la formula di Haversine
const calcolaDistanza = (lon1, lat1, lon2, lat2) => {
    const R = 6371 //raggio terrestre
    const toRad = (valore) => (valore * Math.PI) / 180

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const radLat1 = toRad(lat1)
    const radLat2 = toRad(lat2)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

//funzione che calcola il livello del giocatore
const calcolaLivello = (xp) => {
    if (xp < BASE) {
        return 1
    }

    return Math.floor((Math.sqrt(8 * (punti / BASE) + 1) - 1) / 2) + 1
}

const registraPDI = async (req, res) => {
    try {
        //controllo se pdi e giocatore esistono
        const { idGiocatore, idPDI } = req.body
        if (!mongoose.Types.ObjectId.isValid(idGiocatore)) {
            return res.status(400).json({ error: 'Id del giocatore non è valido' })
        }
        const idGiocatoreVerificato = new mongoose.Types.ObjectId(idGiocatore)
        if (!mongoose.Types.ObjectId.isValid(idPDI)) {
            return res.status(400).json({ error: 'Id del PDI non è valido' })
        }
        const idPDIVerificato = new mongoose.Types.ObjectId(idPDI)
        const g = await Giocatore.findById(idGiocatoreVerificato)
        if (!g) {
            return res.status(404).json({ error: 'Giocatore non trovato' })
        }
        const p = await PDI.findById(idPDIVerificato)
        if (!p) {
            return res.status(404).json({ error: 'PDI non trovato' })
        }

        //controllo se ci sono le coordinate e se combaciano con quelle del pdi
        const result = posizioneSchema.safeParse(req.body.posizione)
        if (!result.success) {
            return res.status(400).json({ error: "Posizione mancante o non valida" })
        }
        const [lon, lat] = result.data
        const distanza = calcolaDistanza(lon, lat, p.geometry.coordinates[0], p.geometry.coordinates[1])
        if (distanza > TOLLERANZA) {
            return res.status(422).json({ error: `Sei distante ${distanza.toFixed(1)} km dal PDI` })
        }

        //calcolo gli xp del giocatore prima che si aggiorni
        const [risultatoAggregazione] = await Visita.aggregate([
            { $match: { idGiocatore: idGiocatoreVerificato } },
            { $group: { _id: null, xpIniziali: { $sum: "$punteggio" } } }
        ])
        const xpIniziali = risultatoAggregazione ? risultatoAggregazione.xpIniziali : 0

        //creo la visita
        const v = await Visita.create({
            idGiocatore: idGiocatoreVerificato,
            idPDI: idPDIVerificato,
            timestamp: new Date(),
            punteggio: p.properties.punteggio
        })

        //strutturo la risposta di successo
        const risposta = {
            message: 'Visita registrata con successo',
            levelUp: undefined,
            nuoviAchievements: undefined
        }

        //controllo se c'è stato un levelUp
        const xpFinali = xpIniziali + p.properties.punteggio
        if (calcolaLivello(xpIniziali) < calcolaLivello(xpFinali)) {
            risposta.levelUp = calcolaLivello(xpFinali)
        }

        //TODO: implementare check di nuovi achievements

        return res.status(200).json(risposta)
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Questo PDI è già stato registrato dall'utente" })
        }
        console.error("Errore nella registrazione PDI: ", error)
        return res.status(500).json({ error: "Errore interno del server" })
    }
}

const getVisiteGiocatore = async (req, res) => {
    try {
        const idGiocatore = req.utente.id
        const visite = await Visita.find({ idGiocatore }).select('idPDI idEvento -_id')
        res.status(200).json({ data: visite })
    } catch (error) {
        console.error("Errore nel recupero visite:", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { registraPDI, getVisiteGiocatore }