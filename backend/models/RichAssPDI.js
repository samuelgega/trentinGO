const mongoose = require('mongoose');

const schemaRichAssPDI = new mongoose.Schema({
    richGestore:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gestore',
        require: true
    }, 
    assPDI:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDI',
        require: true
    },
    stato:{
        type: String,
        enum: ['in_attesa', 'approvata', 'rifiutata'],
        defaul: 'in_attesa'
    },
    dataRichiesta: Date

})

module.exports = mongoose.model('RichAssPDIPDI', schemaRichAssPDI, 'RichAssPDI')