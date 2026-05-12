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
        descrizione: String,
        categoria: String,
        prezzo: Number,
        immagine: [String],
        dataInizio: {
            type: Date,
            required: true
        },
        dataFine: {
            type: Date,
            required: true
        },
        gestore: String,
        dataCreazione: Date,
        pdiCollegato: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PDI'
        }
    }
})

module.exports = mongoose.model('Evento', schemaEvento, 'Eventi')