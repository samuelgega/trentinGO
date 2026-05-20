const mongoose = require('mongoose')
const connectDB = require('../config/db')
const fs = require("fs");
const PDI = require('../models/PDI')
const aggiornamenti = require('./aggiornamenti.json');

const popolaDatabase = async () => {
    try {

        connectDB();
        console.log("lettura file json");
        const rawData = fs.readFileSync('../data/pdi_descrizioni.json', 'utf-8');
        console.log("file letto correttamente");
        const aggiornamenti = JSON.parse(rawData);
        let aggiornati = 0;

        for (const elemento of aggiornamenti) {
            // Cerca il PDI per nome e usa $set per aggiornare SOLO la descrizione
            const risultato = await PDI.updateOne(
                { "properties.nome": elemento.nome },
                { $set: { "properties.descrizione": elemento.descrizione } }
            );

            if (risultato.modifiedCount > 0) {
                console.log(`Aggiornato: ${elemento.nome}`);
                aggiornati++;
            } else if (risultato.matchedCount === 0) {
                console.log(`Non trovato: ${elemento.nome} (Controlla che il nome sia identico al DB)`);
            } else {
                console.log(`Già aggiornato: ${elemento.nome}`);
            }
        }

        console.log(`Operazione completata! Aggiornati ${aggiornati} PDI.`);

    } catch (error) {
        console.error("Errore durante l'aggiornamento:", error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

//export default popolaDatabase;