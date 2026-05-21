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
})

module.exports = mongoose.model('Giocatore', schemaGiocatore, 'Giocatori')
