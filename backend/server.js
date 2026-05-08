const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Middleware
app.use(express.json());

//Connessione al DB
connectDB();


//pagina iniziale
app.get("/", (req, res) => {
    res.send("Hello world");
})

//rotta dei pdi
const pdiRoutes = require("./routes/pdiRoutes");
app.use("/pdi", pdiRoutes);


//Porta di accesso al server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}, disponibile su: http://localhost:${PORT}`);
});
