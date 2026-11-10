// =====================================================
// SESIÓN DEL PERSONAL (se carga en TODAS las páginas)
// Si alguien de la empresa inició sesión:
//   - muestra los elementos con la clase "solo-empresa" (Panel, Cerrar sesión)
//   - oculta los elementos con la clase "solo-publico" (Cotizar, Intranet)
// El "token" es la llave que entrega el servidor al iniciar sesión.
// Se guarda en sessionStorage: se borra solo al cerrar el navegador.
// =====================================================

// Paso 1: funciones para leer, guardar y borrar el token
function obtenerToken() {
    return sessionStorage.getItem("tokenACR");
}

function guardarToken(token) {
    sessionStorage.setItem("tokenACR", token);
}

function borrarToken() {
    sessionStorage.removeItem("tokenACR");
}

// Paso 2: mostrar u ocultar partes de la página según haya sesión
function actualizarVistaSesion() {
    const haySesion = obtenerToken() !== null;

    document.querySelectorAll(".solo-empresa").forEach((elemento) => {
        elemento.classList.toggle("d-none", !haySesion);
    });
    document.querySelectorAll(".solo-publico").forEach((elemento) => {
        elemento.classList.toggle("d-none", haySesion);
    });
}

// Paso 3: cerrar sesión (avisa al servidor y vuelve al inicio)
async function cerrarSesion() {
    try {
        await fetch("/api/logout", {
            method: "POST",
            headers: { "x-token": obtenerToken() }
        });
    } catch (error) {
        // Si el servidor no responde, igual cerramos la sesión en el navegador
    }
    borrarToken();
    window.location.href = "index.html";
}

// Paso 4: evento click en los botones "Cerrar sesión"
document.querySelectorAll(".btn-salir").forEach((boton) => {
    boton.addEventListener("click", cerrarSesion);
});

// Paso 5: aplicar al cargar la página
actualizarVistaSesion();
