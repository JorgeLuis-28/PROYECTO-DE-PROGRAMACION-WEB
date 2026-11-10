// =====================================================
// FORMULARIO "SOLICITA TU COTIZACIÓN" (index.html)
// Eventos usados: submit, input
// Valida cada campo, muestra el error debajo y, si todo está bien,
// envía los datos al servidor con fetch (POST /api/solicitudes).
// =====================================================

// Paso 1: obtener los elementos del DOM
const formCotizacion = document.getElementById("formCotizacion");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputTelefono = document.getElementById("telefono");
const selectServicio = document.getElementById("servicio");
const inputMensaje = document.getElementById("mensaje");
const checkAcepta = document.getElementById("acepta");
const contadorMensaje = document.getElementById("contadorMensaje");
const resultadoCotizacion = document.getElementById("resultadoCotizacion");
const btnEnviar = document.getElementById("btnEnviar");

// Paso 2: funciones para marcar un campo con error o como correcto
// "is-invalid" e "is-valid" son clases de Bootstrap: borde rojo o verde
function marcarError(campo, idError, mensaje) {
    campo.classList.add("is-invalid");
    campo.classList.remove("is-valid");
    document.getElementById(idError).textContent = mensaje;
}

function marcarOK(campo) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
}

// Paso 3: una función de validación por cada campo
function validarNombre() {
    const valor = inputNombre.value.trim();
    if (valor.length < 3) {
        marcarError(inputNombre, "errorNombre", "Escriba al menos 3 letras.");
        return false;
    }
    marcarOK(inputNombre);
    return true;
}

function validarCorreo() {
    const valor = inputCorreo.value.trim();
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // algo@algo.algo
    if (!formatoCorreo.test(valor)) {
        marcarError(inputCorreo, "errorCorreo", "Escriba un correo válido, por ejemplo: nombre@correo.com");
        return false;
    }
    marcarOK(inputCorreo);
    return true;
}

function validarTelefono() {
    const valor = inputTelefono.value.trim();
    // Es opcional: si está vacío no hay error
    if (valor === "") {
        inputTelefono.classList.remove("is-invalid", "is-valid");
        return true;
    }
    const formatoCelular = /^9\d{8}$/;                    // 9 + 8 números
    if (!formatoCelular.test(valor)) {
        marcarError(inputTelefono, "errorTelefono", "El celular debe tener 9 dígitos y empezar con 9.");
        return false;
    }
    marcarOK(inputTelefono);
    return true;
}

function validarServicio() {
    if (selectServicio.value === "") {
        marcarError(selectServicio, "errorServicio", "Seleccione un servicio.");
        return false;
    }
    marcarOK(selectServicio);
    return true;
}

function validarMensaje() {
    const valor = inputMensaje.value.trim();
    if (valor.length < 10) {
        marcarError(inputMensaje, "errorMensaje", "Cuéntenos un poco más (mínimo 10 caracteres).");
        return false;
    }
    marcarOK(inputMensaje);
    return true;
}

function validarAcepta() {
    if (!checkAcepta.checked) {
        marcarError(checkAcepta, "errorAcepta", "Debe aceptar para poder enviar la solicitud.");
        return false;
    }
    marcarOK(checkAcepta);
    return true;
}

// Paso 4: mostrar un mensaje (alerta de Bootstrap) creado con el DOM
function mostrarResultado(tipo, texto) {
    resultadoCotizacion.innerHTML = "";
    const alerta = document.createElement("div");
    alerta.className = "alert alert-" + tipo + " mb-0";
    alerta.textContent = texto;
    resultadoCotizacion.appendChild(alerta);
}

// Paso 5: limpiar el formulario después de enviarlo
function limpiarFormulario() {
    formCotizacion.reset();
    formCotizacion.querySelectorAll(".is-valid").forEach((campo) => {
        campo.classList.remove("is-valid");
    });
    contadorMensaje.textContent = "0";
}

// Paso 6: al enviar el formulario
formCotizacion.addEventListener("submit", async (e) => {
    e.preventDefault();   // evita que la página se recargue

    // Se validan TODOS para que se vean todos los errores a la vez
    const nombreOK = validarNombre();
    const correoOK = validarCorreo();
    const telefonoOK = validarTelefono();
    const servicioOK = validarServicio();
    const mensajeOK = validarMensaje();
    const aceptaOK = validarAcepta();

    if (!(nombreOK && correoOK && telefonoOK && servicioOK && mensajeOK && aceptaOK)) {
        mostrarResultado("warning", "Revise los campos marcados en rojo.");
        return;
    }

    // Datos que se envían (solo los necesarios: minimización de datos)
    const datos = {
        nombre: inputNombre.value.trim(),
        correo: inputCorreo.value.trim(),
        telefono: inputTelefono.value.trim(),
        servicio: selectServicio.value,
        mensaje: inputMensaje.value.trim(),
        acepta: checkAcepta.checked
    };

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    try {
        const respuesta = await fetch("/api/solicitudes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();

        if (respuesta.status === 201) {
            mostrarResultado("success", "¡Gracias! Su solicitud N.° " + resultado.id + " fue registrada. Pronto nos comunicaremos con usted.");
            limpiarFormulario();
        } else {
            // 400: el servidor encontró errores
            mostrarResultado("danger", resultado.errores.join(" "));
        }
    } catch (error) {
        mostrarResultado("danger", "No se pudo conectar con el servidor. ¿Está encendido (node server.js)?");
    }

    btnEnviar.disabled = false;
    btnEnviar.textContent = "Enviar solicitud";
});

// Paso 7: validar mientras el usuario escribe (después del primer error)
inputNombre.addEventListener("input", () => { if (inputNombre.classList.contains("is-invalid")) validarNombre(); });
inputCorreo.addEventListener("input", () => { if (inputCorreo.classList.contains("is-invalid")) validarCorreo(); });
inputTelefono.addEventListener("input", () => { if (inputTelefono.classList.contains("is-invalid")) validarTelefono(); });
selectServicio.addEventListener("change", validarServicio);
checkAcepta.addEventListener("change", validarAcepta);

// Contador de caracteres del mensaje
inputMensaje.addEventListener("input", () => {
    contadorMensaje.textContent = inputMensaje.value.length;
    if (inputMensaje.classList.contains("is-invalid")) validarMensaje();
});
