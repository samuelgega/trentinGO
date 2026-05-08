//importa il modello del PDI
//const PDI = require("../models/PDI");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const creaPDI = async (req, res) => {

    try{
        const{nome, descrizione, categoria, latitudine, longitudine, prezzo, punteggio, immagine} = req.body;
        
        //controllo se il nome è presente e non è vuoto
        if(!nome || nome.trim() === ""){
            return res.status(400).json({ error: "Il nome è un campo obbligatorio" });
        }

        //controllo se la posizione è presente e ha valori validi
        if(latitudine === undefined || longitudine === undefined){
            return res.status(400).json({ error: "le coordinate di latitudine e longitudine sono obbligatorie" });
        }

        
        //creo il nuovo PDI nel database
        const nuovoPDI = await PDI.create({
            type:"Feature",
            geometry: {
                type: "Point",
                coordinates: [longitudine, latitudine]
            },
            properties: {
                nome,
                descrizione,
                categoria,
                latitudine,
                longitudine,
                prezzo: prezzo || 0,
                punteggio: punteggio || 0,
                immagine: immagine || ""
            }
        });
        
        
        console.log("PDI creato con successo:", nuovoPDI.properties.nome);

        res.status(201).json({
            message: "PDI creato con successo",
            data: nuovoPDI
        });

    }catch(error){
        console.error("Errore nella creazione del PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
};


//visualizza tutti i PDI
const visualizzaTuttiPDI = async (req, res) => {
    try{
        //recupero tutti i PDI dal database
        const pdiList = await PDI.find({});
        
        res.status(200).json({
            message: "Lista dei PDI",
            data: pdiList
        });

    }catch(error){
        console.error("Errore nel recupero dei PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
};

module.exports = {creaPDI, visualizzaTuttiPDI};