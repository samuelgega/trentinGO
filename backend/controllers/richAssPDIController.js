const RichAssPDI = require('../models/RichAssPDI');
const Gestore = require('../models/Gestore');
const PDI = require('../models/PDI');

const visualizzaRichieste = async (req,res) => {
    try{
        const richieste = await RichAssPDI.find({}).populate('idGestore').populate('idPDI');

        res.status(200).json({
            message: "Lista delle richieste",
            data: richieste
        })

    } catch(error){
        console.error("Errore nel recupero delle richieste", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

const creaRichiesta = async (req,res) => {
    try{   
    
        const { idGestore, idPDI } = req.body;

        //controllo dati mancanti
        if(!idGestore || !idPDI){
            return res.status(400).json({ 
                error: "ID Gestore e ID PDI sono campi obbligatori." 
            });
        }

        //Controllo se il Gestore esiste
        const gestoreEsistente = await Gestore.findById(idGestore);
        if (!gestoreEsistente) {
            return res.status(404).json({ error: "Gestore non trovato." });
        }

        //Controllo se il PDI esiste (se hai il modello PDI)
        const pdiEsistente = await PDI.findById(idPDI);
        if (!pdiEsistente) {
            return res.status(404).json({ error: "PDI non trovato." });
        }

        //Controllo se il Gestore ha GIA' questo PDI associato
        if (gestoreEsistente.pdiCollegati.includes(idPDI)) {
            return res.status(400).json({ 
                error: "Questo PDI è già associato al tuo account." 
            });
        }

        //conrollo se esiste già una richiesta uguale
        const richiestaEsistente = await RichAssPDI.findOne({
            idGestore: idGestore,
            idPDI: idPDI,
            stato: 'in_attesa'
        });

        if (richiestaEsistente) {
            return res.status(409).json({ 
                error: "Hai già una richiesta in attesa per questo PDI." 
            });
        }

        //Creazione richiesta
        const nuovaRichiesta = new RichAssPDI({
            idGestore: idGestore,
            idPDI: idPDI,
            dataRichiesta: new Date()
        });

        await nuovaRichiesta.save();

        res.status(201).json({
            message: "Richiesta di associazione inviata con successo. In attesa di approvazione.",
            data: nuovaRichiesta
        });

    } catch(error){
         console.error("Errore nel recupero delle richieste", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { visualizzaRichieste, creaRichiesta }