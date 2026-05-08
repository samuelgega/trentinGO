const express = require("express");
const connectDB = require("./config/db");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const app = express();

//Middleware
app.use(express.json());

//Connessione al DB
connectDB();

//caricamento documentazione openAPI
const swaggerDocument = yaml.load(fs.readFileSync("./oas3.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//pagina iniziale
app.get("/", (req, res) => {
    res.send("Hello world");
})

//rotta dei pdi
const pdiRoutes = require("./routes/pdiRoutes");
app.use("/api/v1/pdi", pdiRoutes);


//handler per errori 404
app.use((req, res) => {
    res.status(404).json({ error: "Risorsa non trovata" });
});

//handler per errori generici
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Errore interno del server" });
});

//Porta di accesso al server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}, disponibile su: http://localhost:${PORT}`);
});
