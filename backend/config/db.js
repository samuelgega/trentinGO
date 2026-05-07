require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
      console.log('Connessione a MongoDB riuscita');
  } catch (err) {
    console.error('Errore connessione MongoDB:', err.message);
  }
};

module.exports = connectDB; 