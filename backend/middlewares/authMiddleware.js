const jwt = require('jsonwebtoken')
const Amministratore = require('../models/Amministratore')

const verificaToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: "Accesso negato: token mancante" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.utente = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: "Token non valido o scaduto" })
    }
}

const requireRuolo = (...ruoli) => {
    return (req, res, next) => {
        if (!ruoli.includes(req.utente.ruolo)) {
            return res.status(403).json({ error: "Accesso negato: permessi insufficienti" })
        }
        next()
    }
}

const autorizzaModifica = (tipoTarget) => {
    return async (req, res, next) => {
        try {
            const idRichiedente = req.utente.id
            const ruoloRichiedente = req.utente.ruolo
            const targetId = req.params.id

            // chiunque può modificare se stesso
            if (idRichiedente === targetId) {
                return next()
            }

            //verifica se sei un admin
            if (ruoloRichiedente !== 'amministratore') {
                return res.status(403).json({ error: "Non hai i permessi per modificare i dati di altri utenti." })
            }

            //verifica se un admin vuole modificare un'altro admin
            if (tipoTarget === 'amministratore') {
                return res.status(403).json({ error: "Non hai i permessi per modificare i dati di altri amministratori." })
            }

            //admin che modifica de non admin passa
            next()
        } catch (error) {
            console.error("Errore nel middleware di autorizzazione modifica:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const autorizzaEliminazione = (tipoTarget) => {
    return async (req, res, next) => {
        try {
            const idRichiedente = req.utente.id
            const ruoloRichiedente = req.utente.ruolo
            const targetId = req.params.id

            // chiunque può eliminare se stesso
            if (idRichiedente === targetId) {
                return next()
            }

            //verifica se sei un admin
            if (ruoloRichiedente !== 'amministratore') {
                return res.status(403).json({ error: "Non hai i permessi per eliminare i dati di altri utenti." })
            }

            //verifica se un admin vuole eliminare un'altro admin
            if (tipoTarget === 'amministratore') {
                return res.status(403).json({ error: "Non hai i permessi per eliminare i dati di altri amministratori." })
            }
            next()
        } catch (error) {
            console.error("Errore nel middleware di autorizzazione modifica:", error)
            res.status(500).json({ error: "Internal Server Error" })
        }
    }
}

const autorizzaVisita = (req, res, next) => {
    try {
        const { idGiocatore } = req.body
        const idRichiedente = req.utente.id

        if (idGiocatore !== idRichiedente) {
            return res.status(403).json({ error: 'Non hai i permessi per registrare una visita per conto di altri utenti' })
        }

        next()
    }
    catch (error) {
        console.error("Errore nel middleware di autorizzazione registrazione visita:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = { verificaToken, requireRuolo, autorizzaModifica, autorizzaEliminazione, autorizzaVisita }
