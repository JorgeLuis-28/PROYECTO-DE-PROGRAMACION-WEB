
// VALIDACIÓN DEL FORMULARIO DE INICIO DE SESIÓN

const formLogin = document.getElementById("formLogin");

if (formLogin) {
    const inputUsuario = document.getElementById("usuario");
    const inputCorreo = document.getElementById("correo");
    const inputContrasena = document.getElementById("contrasena");

    const errorUsuario = document.getElementById("errorUsuario");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorContrasena = document.getElementById("errorContrasena");

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();
        let esValido = true;

        // 1. Validar Usuario: MÁS de 7 y MENOS de 40 caracteres (longitud entre 8 y 39)
        const valorUsuario = inputUsuario.value.trim();
        if (valorUsuario.length <= 7 || valorUsuario.length >= 40) {
            errorUsuario.style.display = "block";
            inputUsuario.classList.add("invalido");
            esValido = false;
        } else {
            errorUsuario.style.display = "none";
            inputUsuario.classList.remove("invalido");
        }

        // 2. Validar Correo (formato básico)
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(inputCorreo.value.trim())) {
            errorCorreo.style.display = "block";
            inputCorreo.classList.add("invalido");
            esValido = false;
        } else {
            errorCorreo.style.display = "none";
            inputCorreo.classList.remove("invalido");
        }

        // 3. Validar Contraseña: Mínimo 8 caracteres, al menos un número y un carácter especial
        const regexContrasena = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/]).{8,}$/;
        if (!regexContrasena.test(inputContrasena.value)) {
            errorContrasena.style.display = "block";
            inputContrasena.classList.add("invalido");
            esValido = false;
        } else {
            errorContrasena.style.display = "none";
            inputContrasena.classList.remove("invalido");
        }

        // Si hay algún error, muestra la alerta
        if (!esValido) {
            alert("Por favor, corrige los campos marcados en rojo antes de continuar.");
        } else {
            alert("¡Datos correctos! Iniciando sesión...");
            formLogin.submit(); // Envía el formulario o realiza la acción deseada
        }
    });
}