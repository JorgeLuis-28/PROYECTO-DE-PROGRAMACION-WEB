// =====================================================
// API DEL PROYECTO
// Rutas:
//   POST  /api/solicitudes      -> un cliente envía una solicitud de cotización
//   POST  /api/login            -> el personal de la empresa inicia sesión
//   POST  /api/logout           -> cierra la sesión
//   GET   /api/solicitudes      -> lista de solicitudes (solo personal)
//   PATCH /api/solicitudes/:id  -> cambia el estado de una solicitud (solo personal)
// Los datos se guardan en el archivo data/solicitudes.json (sin base de datos)
// =====================================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();
const ARCHIVO = path.join(__dirname, "..", "data", "solicitudes.json");

// Usuario de la empresa (uno solo, para la demostración)
const USUARIO_EMPRESA = "admin.acr";
const CONTRASENA_EMPRESA = "Acr2026!";

// Sesiones abiertas: se guardan en memoria (se borran al apagar el servidor)
const sesiones = new Set();

const SERVICIOS = [
    "Supervisión de obras",
    "Estudios de factibilidad",
    "Elaboración de proyectos",
    "Movimiento de tierras",
    "Alquiler de maquinaria",
    "Transporte de maquinaria",
    "Venta de agregados",
    "Otro"
];
const ESTADOS = ["Pendiente", "En revisión", "Atendida"];

// ---------- Funciones de apoyo ----------

function leerSolicitudes() {
    const texto = fs.readFileSync(ARCHIVO, "utf-8");
    return JSON.parse(texto);
}

function guardarSolicitudes(lista) {
    fs.writeFileSync(ARCHIVO, JSON.stringify(lista, null, 2));
}

// Revisa los datos que llegan del formulario y devuelve una lista de errores
function validarSolicitud(datos) {
    const errores = [];
    const nombre = (datos.nombre || "").trim();
    const correo = (datos.correo || "").trim();
    const telefono = (datos.telefono || "").trim();
    const mensaje = (datos.mensaje || "").trim();

    if (nombre.length < 3 || nombre.length > 60) {
        errores.push("El nombre debe tener entre 3 y 60 caracteres.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        errores.push("El correo no es válido.");
    }
    if (telefono !== "" && !/^9\d{8}$/.test(telefono)) {
        errores.push("El celular debe tener 9 dígitos y empezar con 9.");
    }
    if (!SERVICIOS.includes(datos.servicio)) {
        errores.push("Seleccione un servicio de la lista.");
    }
    if (mensaje.length < 10 || mensaje.length > 500) {
        errores.push("El mensaje debe tener entre 10 y 500 caracteres.");
    }
    if (datos.acepta !== true) {
        errores.push("Debe aceptar el uso de sus datos para responder la solicitud.");
    }
    return errores;
}

// "Portero": deja pasar solo si la petición trae un token de sesión válido
function soloPersonal(req, res, next) {
    const token = req.headers["x-token"];
    if (!token || !sesiones.has(token)) {
        return res.status(401).json({ error: "Debe iniciar sesión como personal de la empresa." });
    }
    next();
}

// ---------- Rutas públicas ----------

// POST /api/solicitudes  (lo usa el formulario "Solicita tu cotización")
router.post("/solicitudes", (req, res) => {
    const errores = validarSolicitud(req.body);
    if (errores.length > 0) {
        return res.status(400).json({ errores: errores });
    }

    const lista = leerSolicitudes();
    const nueva = {
        id: lista.length > 0 ? lista[lista.length - 1].id + 1 : 1,
        fecha: new Date().toISOString(),
        nombre: req.body.nombre.trim(),
        correo: req.body.correo.trim(),
        telefono: (req.body.telefono || "").trim(),
        servicio: req.body.servicio,
        mensaje: req.body.mensaje.trim(),
        estado: "Pendiente"
    };
    lista.push(nueva);
    guardarSolicitudes(lista);

    res.status(201).json({ mensaje: "Solicitud registrada", id: nueva.id });
});

// POST /api/login
router.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: "Ingrese usuario y contraseña." });
    }
    if (usuario !== USUARIO_EMPRESA || contrasena !== CONTRASENA_EMPRESA) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }

    const token = crypto.randomBytes(16).toString("hex");
    sesiones.add(token);
    res.json({ token: token, usuario: usuario });
});

// POST /api/logout
router.post("/logout", (req, res) => {
    sesiones.delete(req.headers["x-token"]);
    res.json({ mensaje: "Sesión cerrada" });
});

// ---------- Rutas solo para el personal ----------

// GET /api/solicitudes
router.get("/solicitudes", soloPersonal, (req, res) => {
    res.json(leerSolicitudes());
});

// PATCH /api/solicitudes/:id   body: { "estado": "Atendida" }
router.patch("/solicitudes/:id", soloPersonal, (req, res) => {
    const id = Number(req.params.id);
    const estado = req.body.estado;

    if (!ESTADOS.includes(estado)) {
        return res.status(400).json({ error: "Estado no válido." });
    }

    const lista = leerSolicitudes();
    const solicitud = lista.find((s) => s.id === id);
    if (!solicitud) {
        return res.status(404).json({ error: "No existe la solicitud " + id });
    }

    solicitud.estado = estado;
    guardarSolicitudes(lista);
    res.json(solicitud);
});

// Cualquier otra ruta de la API -> 404
router.use((req, res) => {
    res.status(404).json({ error: "Ruta de la API no encontrada" });
});

module.exports = router;
