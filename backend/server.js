const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.listen(3000);
