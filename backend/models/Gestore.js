const mongoose = require('mongoose')

const schemaGestore = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    },
    partitaIva:{
        type: Number,
        require: true,
    },
    abilitato:{
        type: Boolean,
        default: false,
    }

})

module.exports = mongoose.model('Gestore', schemaGestore, 'Gestori' );