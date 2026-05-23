const richAssPDI = require('../models/RichAssPDI');

const visualizzaRichieste = async (req,res) => {
    try{
        const richieste = await richAssPDI.find({});

        res.status(200).json({
            message: "Lista delle richieste",
            data: richieste
        })

    } catch(error){
        console.error("Errore nel recupero delle richieste", error)
        res.status(500).json({ error: "Errore interno del server" })
    }
}

module.exports = { visualizzaRichieste }