// =====================================================
// SERVIDOR DEL PROYECTO (Node.js + Express)
// 1) Sirve la página web (carpeta "public")
// 2) Ofrece la API en /api (archivo routes/api.js)
// =====================================================

const express = require("express");
const path = require("path");
const rutasApi = require("./routes/api");

const app = express();
const PUERTO = 8080;

// Paso 1: permitir que el servidor lea JSON enviado por el navegador
app.use(express.json());

// Paso 2: servir los archivos de la página (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Paso 3: todas las rutas que empiezan con /api las maneja routes/api.js
app.use("/api", rutasApi);

// Paso 4: si piden una página que no existe -> 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Paso 5: encender el servidor
const servidor = app.listen(PUERTO, () => {
    console.log("Servidor listo: abre http://localhost:" + PUERTO);
    console.log("No cierres esta ventana. Para apagarlo: Ctrl + C");
});

// Si el puerto ya está ocupado, avisar con un mensaje claro
servidor.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.log("El puerto " + PUERTO + " ya está en uso: el servidor ya está encendido en otra ventana.");
        console.log("Abre http://localhost:" + PUERTO + " o cierra la otra ventana y vuelve a intentarlo.");
    } else {
        console.log("Error al encender el servidor:", error.message);
    }
});
