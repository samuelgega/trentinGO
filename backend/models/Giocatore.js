const mongoose = require('mongoose')

const schemaGiocatore = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    iscrittoNewsletter: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
        required: false,
    },
    scadenzaResetToken: {
        type: Date,
        required: false,
    },
    puntiEsperienza: {
        type: Number,
        default: 0
    },
    livello: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('Giocatore', schemaGiocatore, 'Giocatori')
