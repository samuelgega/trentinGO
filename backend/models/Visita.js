const mongoose = require('mongoose')

const schemaVisita = new mongoose.Schema({
    idGiocatore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Giocatore',
        required: true
    },
    idPDI: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDI',
        required: false
    },
    idEvento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    punteggio: {
        type: Number,
        required: true,
        default: 0
    }
})

// Controllo per verificare che una visita sia associata ad un PDI oppure ad un evento
schemaVisita.pre('validate', function(next) {
    const hasPDI = !!this.idPDI
    const hasEvento = !!this.idEvento
    if (hasPDI && hasEvento) {
        return next(new Error('Una visita non può riferirsi contemporaneamente a un PDI e a un Evento'))
    }
    if (!hasPDI && !hasEvento) {
        return next(new Error('Una visita deve riferirsi a un PDI oppure a un Evento'))
    }
    next()
})

// Vincolo per impedire che un giocatore possa visitare lo stesso PDI o evento più volte
schemaVisita.index({ idGiocatore: 1, idPDI: 1 }, { unique: true, sparse: true })
schemaVisita.index({ idGiocatore: 1, idEvento: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('Visita', schemaVisita, 'Visite')
