const Giocatore = require("../models/Giocatore")
//per hashing password
const bycrypt = require('bcrypt')
 
const registrazioneGiocatore = async (req, res) => {
    try {

        //dati dal frontend
        const { username, email, password } = req.body
        
        //controllo se mancano dati
        if( !username || !email || !password ){
            return res.status(400).json({ error: "username, email e password sono obbligatori" });
        }

        //controllo se useramane esiste già
        const usernameEsistente = await Giocatore.findOne({ username: username })
        if(usernameEsistente){
            return res.status(400).json({ error: "Username già esistente" });
        }

        //controlle se l'email è valida e se esiste già
        const emailEsistente = await Giocatore.findOne({ email: email.toLowerCase() })
        if(emailEsistente){
            return res.status(400).json({ error: "Email già esistente" });
        }

        //hashing della password
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        //creazione nuovo giocatore
        const nuovoGiocatore = await Giocatore.create({
            username: username,
            email: email.toLowerCase(),
            password: hashedPassword
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
        const giocatori = await Giocatore.find({}).select('-password')

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
