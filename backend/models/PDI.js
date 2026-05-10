const mongoose = require('mongoose')

const schemaPDI = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number]
    },
    properties: {
        nome: {
            type: String,
            required: [true, "Nome obbligatorio"],
            minlength: 2,
            maxlength: 100,
            unique: true
        },
        descrizione: {
            type: String,
            required: false
        },
        categoria: String,
        prezzo: Number,
        punteggio: Number,
        immagine: [String]
    }
})

module.exports = mongoose.model('PDI', schemaPDI, 'PDI')