// MENÚ DE CELULAR (botón hamburguesa)
// Eventos usados: click, keydown, resize
const cabecera = document.querySelector("header");
const botonMenu = document.getElementById("menuToggle");

if (cabecera && botonMenu) {
    function cambiarMenu(abrir) {
        cabecera.classList.toggle("menu-abierto", abrir);
        botonMenu.setAttribute("aria-expanded", String(abrir));
        botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    }

    botonMenu.addEventListener("click", () => {
        cambiarMenu(!cabecera.classList.contains("menu-abierto"));
    });

    // Al tocar un enlace del menú, se cierra
    cabecera.querySelectorAll(".menu a").forEach((enlace) => {
        enlace.addEventListener("click", () => cambiarMenu(false));
    });

    // Con la tecla Escape también se cierra
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cambiarMenu(false);
    });

    // Si la pantalla se ensancha (PC), se deja todo normal
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) cambiarMenu(false);
    });
}