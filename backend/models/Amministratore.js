const mongoose = require('mongoose')

const schemaAmministratore = new mongoose.Schema({
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
    resetToken: {
        type: String,
        required: false,
    },
    scadenzaResetToken: {
        type: Date,
        required: false,
    }
})

module.exports = mongoose.model('Amministratore', schemaAmministratore, 'Amministratori')
