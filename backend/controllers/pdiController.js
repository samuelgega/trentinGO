const PDI = require("../models/PDI");

//crea un PDI
const creaPDI = async (req, res) => {
    try {
        const { nome, descrizione, categoria, latitudine, longitudine, prezzo, punteggio } = req.body;

        let arrayImmagini = [];
        if (req.files && req.files.length > 0) {
            arrayImmagini = req.files.map(file => file.filename);
        }

        //controllo se il nome è presente e non è vuoto
        if (!nome || nome.trim() === "") {
            return res.status(400).json({ error: "Il nome è un campo obbligatorio" });
        }

        //controllo se la categoria è presente
        if (!categoria) {
            return res.status(400).json({ error: "La categoria è un campo obbligatorio" });
        }

        //controllo se il punteggio è un numero valido
        if (!punteggio || punteggio < 0) {
            return res.status(400).json({ error: "Il punteggio è un campo obbligatorio e deve essere un numero positivo" });
        }

        //controllo se la posizione è presente e ha valori validi
        if (latitudine === undefined || longitudine === undefined) {
            return res.status(400).json({ error: "le coordinate di latitudine e longitudine sono obbligatorie" });
        }


        //creo il nuovo PDI nel database
        const nuovoPDI = await PDI.create({
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
                immagine: arrayImmagini
            }
        });

        res.status(201).json({
            message: "PDI creato con successo",
            data: nuovoPDI
        });

    } catch (error) {
        console.error("Errore nella creazione del PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
};


//visualizza tutti i PDI
const visualizzaTuttiPDI = async (req, res) => {
    try {
        //recupero tutti i PDI dal database
        const pdiList = await PDI.find({});

        res.status(200).json({
            message: "Lista dei PDI",
            data: pdiList
        });

    } catch (error) {
        console.error("Errore nel recupero dei PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
};

module.exports = { creaPDI, visualizzaTuttiPDI };