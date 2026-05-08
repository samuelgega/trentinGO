const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
      console.log('Connessione al Database riuscita');
  } catch (err) {
    console.error('Errore connessione MongoDB:', err.message);
  }
};

module.exports = connectDB; 