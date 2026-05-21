const Giocatore = require("../models/Giocatore")
 
const registrazioneGiocatore = async (req, res) => {
    try {

        //dati dal frontend
        const { username, email, password } = req.body
        
        //controllo se mancano dati
        if( !username || !email || !password ){
            return res.status(400).json({ error: "username, email e password sono obbligatori" });
        }

        //controllo se il giocatore esiste già
        const giocatoreEsistente = await Giocatore.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if(giocatoreEsistente){
            return res.status(409).json({ error: "Giocatore già registrato" });
        }

        //creazione nuovo giocatore

        const nuovoGiocatore = await Giocatore.create({
            username: username,
            email: email.toLowerCase(),
            password: password
        })

        await nuovoGiocatore.save()
        res.status(200).json({ 
            message: "Giocatore registrato con successo", 
            data: {
                id : nuovoGiocatore.id,
                username : nuovoGiocatore.username,
                email : nuovoGiocatore.email
            }
        });

    } catch (error) {
        console.error("Errore nella registrazione del giocatore", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

const visualizzaGiocatori = async (req, res) => {
    try {
        //recupero i giocatori dal db
        const giocatori = await Giocatore.find({})

        //stampo la lista dei giocatori
        res.status(200).json({ 
            message: "Lista dei giocatori",
            data: giocatori 
        });
    } catch (error) {
        console.error("Errore nel recupero dei Giocatori", error);
        res.status(500).json({ error: "Errore interno del server" });
    }
}

module.exports = { registrazioneGiocatore, visualizzaGiocatori };
