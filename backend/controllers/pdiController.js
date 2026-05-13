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

//visualizza un PDI specifico
const visualizzaPDI = async (req, res) => {
    try{
        //recupero pdi speifico
        const pdiID = await PDI.findById(req.params.id);
        if(!pdiID){
            return res.status(404).json({ error: "PDI non trovato" });
        }
        res.status(200).json({ data : pdiID });
    }catch(error){
        console.error("Errore nel recupero del PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

//modifica PDI esistente
const modificaPDI = async (req, res) => {
    try{
        const { id } = req.params;
        const { nome, descrizione, categoria, latitudine, longitudine, prezzo, punteggio } = req.body;

        const pdiEsistente = await PDI.findById(id);
        
        if(!pdiEsistente){
            return res.status(404).json({ error: "PDI non trovato" });
        }

        //se vengono aggiunti nuove immagini, le aggiungo all'array esistente
        let arrayImmaginiAggiornato = pdiEsistente.properties.immagine;
        if (req.files && req.files.length > 0) {
            const nuoveImmagini = req.files.map(file => file.filename);
            arrayImmaginiAggiornato = [...arrayImmaginiAggiornato, ...nuoveImmagini];
        }

        //aggiorno le coordinate solo se vengono fornite nuove
        const nuovaLongitudine = longitudine !== undefined ? Number(longitudine) : pdiEsistente.geometry.coordinates[0];
        const nuovaLatitudine = latitudine !== undefined ? Number(latitudine) : pdiEsistente.geometry.coordinates[1];

        //aggiorno il PDI nel database
        pdiEsistente.properties.nome = nome || pdiEsistente.properties.nome;
        pdiEsistente.properties.descrizione = descrizione || pdiEsistente.properties.descrizione;
        pdiEsistente.properties.categoria = categoria || pdiEsistente.properties.categoria;
        pdiEsistente.properties.prezzo = prezzo !== undefined ? Number(prezzo) : pdiEsistente.properties.prezzo;
        pdiEsistente.properties.punteggio = punteggio !== undefined ? Number(punteggio) : pdiEsistente.properties.punteggio;
        pdiEsistente.properties.immagine = arrayImmaginiAggiornato;

        //savo le modifiche al database
        const pdiAggiornato = await pdiEsistente.save();

        res.status(200).json({
            message: "PDI aggiornato con successo",
            data: pdiAggiornato
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: "Esiste già un Punto di Interesse con questo nome. Scegline uno diverso." 
            });
        }

        console.error("Errore nella modifica del PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
};

//elimina un PDI esistente
const eliminaPDI = async (req, res) => {
    try {

        const { id } = req.params;

        const pdiEsistente = await PDI.findById(id);

        if(!pdiEsistente){
            return res.status(404).json({ error: "PDI non trovato" });
        }

        const pdiEliminato = await PDI.deleteOne({ _id: id});

        res.status(200).json({
            message: "PDI eliminato con successo",
            data: pdiEliminato
        });

    }catch (error) {
        console.error("Errore nel recupero del PDI:", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

module.exports = {creaPDI, visualizzaTuttiPDI, visualizzaPDI,modificaPDI, eliminaPDI};