const mongoose = require('mongoose');

const schemaRichAssPDI = new mongoose.Schema({
    idGestore:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gestore',
        required: true
    }, 
    idPDI:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDI',
        required: true
    },
    stato:{
        type: String,
        enum: ['in_attesa', 'approvata', 'rifiutata'],
        default: 'in_attesa'
    },
    dataRichiesta: Date

})

module.exports = mongoose.model('RichAssPDIPDI', schemaRichAssPDI, 'RichAssPDI')