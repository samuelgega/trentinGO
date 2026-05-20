const express = require("express");
const connectDB = require("./config/db");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const path = require('path')

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//Connessione al DB
connectDB();

//caricamento documentazione openAPI
const swaggerDocument = yaml.load(fs.readFileSync("./oas3.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//cartella updloads per le immagini
app.use("/uploads", express.static("uploads"));

//rotta dei pdi
const pdiRoutes = require("./routes/pdiRoutes");
app.use("/api/v1/pdi", pdiRoutes);

//router degli eventi
const eventiRouter = require('./routes/eventiRouter')
app.use('/api/v1/eventi', eventiRouter)

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}, disponibile su: http://localhost:${PORT}`);
});

