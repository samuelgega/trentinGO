const app = require("./app");
const connectDB = require("./config/db");

//connessione al DB
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

//Porta di accesso al server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}, disponibile su: http://localhost:${PORT}`);
});
