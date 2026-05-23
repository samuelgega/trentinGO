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

        //Controllo se il PDI esiste
        const pdiEsistente = await PDI.findById(idPDI);
        if (!pdiEsistente) {
            return res.status(404).json({ error: "PDI non trovato." });
        }

        //controllo se il Gestore ha questo PDI associato
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

const visualizzaRichiesta = async (req,res) =>{

    try{
        const richiesta = await RichAssPDI.findById(req.params.id).populate('idGestore').populate('idPDI');

        if(!richiesta){
            return res.status(404).json({ error: "Richiesta non trovata" });
        }

        res.status(200).json({
            data: richiesta
        })

    } catch(error){
        console.error("Errore nel recupero della richiesta", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}


const gestisciRichiesta = async (req,res) => {

    try{
        const { id } = req.params;
        const { statoRichiesta } = req.body;

        //controllo che lo stato sia valido
        if (!['approvata', 'rifiutata'].includes(statoRichiesta)) {
            return res.status(400).json({ 
                error: "Stato non valido. Scegli 'approvata' o 'rifiutata'." 
            });
        }

        const richiesta = await RichAssPDI.findById(id);

        if (!richiesta) {
            return res.status(404).json({ error: "Richiesta non trovata." });
        }

        //se la richiesta era già stata modificata allora blocco la richiesta
        if (richiesta.stato !== 'in_attesa') {
            return res.status(400).json({ 
                error: `Impossibile procedere: questa richiesta è già stata ${richiesta.stato}.` 
            });
        }

        //verifico se la richiesta è da approvare o da rifiutare
        if (statoRichiesta === 'approvata') {
            const gestore = await Gestore.findById(richiesta.idGestore);
            
            if (!gestore) {
                return res.status(404).json({ error: "Il gestore associato a questa richiesta non esiste più." });
            }

            // Aggiungo il PDI all'array del Gestore
            if (!gestore.pdiCollegati.includes(richiesta.idPDI)) {
                gestore.pdiCollegati.push(richiesta.idPDI);
                await gestore.save(); // Salviamo le modifiche al Gestore
            }
        }

        richiesta.stato = statoRichiesta;
        await richiesta.save();

        res.status(200).json({
            message: `La richiesta è stata ${statoRichiesta} con successo.`,
            data: richiesta
        });


    } catch(error) {
         console.error("Errore nel recupero della richiesta", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { visualizzaRichieste, creaRichiesta, visualizzaRichiesta, gestisciRichiesta }