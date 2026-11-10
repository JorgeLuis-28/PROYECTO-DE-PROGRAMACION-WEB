# Grupo ACR E.I.R.L. — Sitio web

Proyecto del curso **Programación Web (UAIN1349P) — UPN 2026-2**.
Página web de GRUPO ANUARIO CABRERA RONCAL E.I.R.L. (construcción, movimiento de tierras,
transporte y alquiler de maquinaria pesada en Cajabamba, Cajamarca).

## Cómo ejecutarlo

Requisito: tener **Node.js** instalado (https://nodejs.org, versión LTS).

**Opción 1 — Terminal de VS Code:**

```bash
npm install
node server.js
```

Luego abrir **http://localhost:8080** en el navegador.

**Opción 2 — F5 en VS Code:** abre la carpeta del proyecto en VS Code y presiona **F5**
(o *Run > Start Debugging*). Instala lo necesario, enciende el servidor y abre el navegador solo.
Para apagarlo: botón cuadrado rojo (Stop) o Shift + F5.
No cierres la terminal mientras usas la página (si la cierras, el servidor se apaga).

Si PowerShell dice "la ejecución de scripts está deshabilitada", usa `npm.cmd install`
en lugar de `npm install`, o ejecuta una vez:
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Acceso del personal (demostración)

- Página: http://localhost:8080/login.html (enlace "Acceso empresa" en el pie de página)
- Usuario: `admin.acr`
- Contraseña: `Acr2026!`

Es un acceso de demostración: un solo usuario definido en `routes/api.js`, sin base de datos.

## Estructura

```
server.js            -> servidor Express (sirve la web y la API)
routes/api.js        -> rutas de la API
data/solicitudes.json-> solicitudes guardadas (datos ficticios de ejemplo)
public/              -> la página web
  index.html, nosotros.html, login.html, panel.html, 404.html
  css/bootstrap.min.css, css/styles.css
  js/bootstrap.bundle.min.js, js/app.js, js/cotizacion.js, js/sesion.js, js/login.js, js/panel.js
  img/, LOGO/
```

## API

| Método | Ruta | Quién | Respuestas |
|---|---|---|---|
| POST | /api/solicitudes | Público (formulario de cotización) | 201, 400 |
| POST | /api/login | Personal | 200, 400, 401 |
| POST | /api/logout | Personal | 200 |
| GET | /api/solicitudes | Personal (cabecera `x-token`) | 200, 401 |
| PATCH | /api/solicitudes/:id | Personal (cabecera `x-token`) | 200, 400, 401, 404 |
| (otra) | /api/... | — | 404 |

### Ejemplo: POST /api/solicitudes

Envío:
```json
{
  "nombre": "Constructora Ejemplo",
  "correo": "contacto@ejemplo.com",
  "telefono": "987654321",
  "servicio": "Alquiler de maquinaria",
  "mensaje": "Necesito una excavadora por 5 días en Cajabamba.",
  "acepta": true
}
```
Respuesta 201:
```json
{ "mensaje": "Solicitud registrada", "id": 4 }
```
Respuesta 400 (datos incorrectos):
```json
{ "errores": ["El correo no es válido."] }
```

### Ejemplo: POST /api/login

Envío: `{ "usuario": "admin.acr", "contrasena": "Acr2026!" }`
Respuesta 200: `{ "token": "a1b2c3...", "usuario": "admin.acr" }`
Respuesta 401: `{ "error": "Usuario o contraseña incorrectos." }`

### Ejemplo: PATCH /api/solicitudes/1

Envío: `{ "estado": "Atendida" }` → 200 con la solicitud actualizada.
Si la solicitud no existe → 404 `{ "error": "No existe la solicitud 99" }`.

## Tecnologías

HTML5, CSS3, Bootstrap 5.3 (archivos locales, funciona sin internet), JavaScript, Node.js, Express.
