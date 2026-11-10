// Servidor básico con Express: sirve la carpeta "DESAFIO PW" (front-end)
const express = require("express");
const path = require("path");

const app = express();
const PUERTO = 8080;

// Permite leer JSON en las peticiones POST (se usará en la API)
app.use(express.json());

// Sirve index.html, styles.css, js/ e img/ como archivos estáticos
app.use(express.static(path.join(__dirname, "DESAFIO PW")));

app.listen(PUERTO, () => {
    console.log("Servidor listo: abre http://localhost:" + PUERTO);
});
