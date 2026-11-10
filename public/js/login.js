// =====================================================
// ACCESO DEL PERSONAL (login.html)
// Eventos usados: submit, click
// Envía usuario y contraseña al servidor (POST /api/login).
// Si son correctos, guarda el token y abre el panel.
// =====================================================

// Si ya hay sesión, no tiene sentido volver a entrar: ir al panel
if (obtenerToken() !== null) {
    window.location.href = "panel.html";
}

// Paso 1: obtener los elementos del DOM
const formLogin = document.getElementById("formLogin");
const inputUsuario = document.getElementById("usuario");
const inputContrasena = document.getElementById("contrasena");
const btnVer = document.getElementById("btnVer");
const resultadoLogin = document.getElementById("resultadoLogin");

// Paso 2: botón "Mostrar / Ocultar" contraseña
btnVer.addEventListener("click", () => {
    if (inputContrasena.type === "password") {
        inputContrasena.type = "text";
        btnVer.textContent = "Ocultar";
        btnVer.setAttribute("aria-label", "Ocultar contraseña");
    } else {
        inputContrasena.type = "password";
        btnVer.textContent = "Mostrar";
        btnVer.setAttribute("aria-label", "Mostrar contraseña");
    }
});

// Paso 3: revisar que los campos no estén vacíos
function validarCampoLleno(campo) {
    if (campo.value.trim() === "") {
        campo.classList.add("is-invalid");
        return false;
    }
    campo.classList.remove("is-invalid");
    return true;
}

// Paso 4: mostrar un mensaje de error
function mostrarErrorLogin(texto) {
    resultadoLogin.innerHTML = "";
    const alerta = document.createElement("div");
    alerta.className = "alert alert-danger mb-0";
    alerta.textContent = texto;
    resultadoLogin.appendChild(alerta);
}

// Paso 5: al enviar el formulario
formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioOK = validarCampoLleno(inputUsuario);
    const contrasenaOK = validarCampoLleno(inputContrasena);
    if (!usuarioOK || !contrasenaOK) {
        return;
    }

    try {
        const respuesta = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: inputUsuario.value.trim(),
                contrasena: inputContrasena.value
            })
        });
        const resultado = await respuesta.json();

        if (respuesta.ok) {
            guardarToken(resultado.token);          // función de sesion.js
            window.location.href = "panel.html";
        } else {
            mostrarErrorLogin(resultado.error);     // 400 o 401
            inputContrasena.value = "";
        }
    } catch (error) {
        mostrarErrorLogin("No se pudo conectar con el servidor. ¿Está encendido (node server.js)?");
    }
});
