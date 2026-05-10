/* Script per generare i PDI all'interno del database */
const mongoose = require('mongoose')

// Connessione al Database
const connectDB = require('../config/db')
connectDB()

// Prelevare il file .json contente i PDI
const fs = require("fs");
const jsonText = fs.readFileSync("./backend/data/trentino_pdi.json", "utf8");
const trentinoPDI = JSON.parse(jsonText).features;

// Importare Schema
const PDI = require('../models/PDI')

// Comando per inserire tutti i PDI su MongoDB
// PDI.insertMany(trentinoPDI)
//     .then(() => console.log("Tutti i PDI sono stati inseriti"))
//     .catch(err => console.error("Errore:", err));


// Comando per eliminare tutti i PDI dal database
// PDI.deleteMany({})
//     .then(() => console.log("Tutti i PDI sono stati eliminati"))
//     .catch(err => console.error("Errore:", err));