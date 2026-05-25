const jwt = require('jsonwebtoken')

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

module.exports = { verificaToken, requireRuolo }
