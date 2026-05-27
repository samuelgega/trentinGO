const mongoose = require('mongoose')

const schemaGestore = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    partitaIva: {
        type: Number,
        required: true
    },
    abilitato: {
        type: Boolean,
        default: false
    },
    pdiCollegati: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDI'
    }],
    resetToken: {
        type: String,
        required: false,
    },
    scadenzaResetToken: {
        type: Date,
        required: false,
    }

})

module.exports = mongoose.model('Gestore', schemaGestore, 'Gestori');