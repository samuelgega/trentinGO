const mongoose = require('mongoose')

const schemaEvento = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number]
    },
    properties: {
        nome: {
            type: String,
            required: [true, 'Nome obbligatorio'],
            minlength: 2,
            maxlength: 100,
            unique: true,
        },
        descrizione: {
            type: String,
            required: false
        },
        categoria: String,
        prezzo: Number,
        punteggio: Number,
        immagine: [String],
        dataInizio: Date,
        dataFine: Date,
        gestore: String,
        dataCreazione: Date
    }
})

module.exports = mongoose.model('Evento', schemaEvento, 'Eventi')