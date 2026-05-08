/* Script per generare i PDI all'interno del database */

// Connessione al Database
const connectDB = require('../config/db')
connectDB()

// Prelevare il file .json contente i PDI
const fs = require("fs");
const jsonText = fs.readFileSync("./backend/data/trentino_pdi.json", "utf8");
console.log(jsonText);
const trentinoPDI = JSON.parse(jsonText).features;

// Definizione Schema
const mongoose = require('mongoose')
const schemaPDI = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String, enum: ["Point"] },
        coordinates: [Number]
    },
    properties: {
        id: Number,
        nome: String,
        descrizione: String,
        latitudine: Number,
        longitudine: Number,
        categoria: String,
        prezzo: Number,
        punteggio: Number,
        immagine: String
    }
})

// Definizione Oggetto PDI
const PDI = mongoose.model("PDI", schemaPDI, "PDI") // (nomeOggetto, schema, nomeCollection)

// Comando per inserire tutti i PDI su MongoDB
// PDI.insertMany(trentinoPDI)
//     .then(() => console.log("Tutti i PDI sono stati inseriti"))
//     .catch(err => console.error("Errore:", err));


// Comando per eliminare tutti i PDI dal database
// PDI.deleteMany({})
//     .then(() => console.log("Tutti i PDI sono stati eliminati"))
//     .catch(err => console.error("Errore:", err));