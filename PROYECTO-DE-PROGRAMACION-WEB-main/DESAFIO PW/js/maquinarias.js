// PÁGINA MAQUINARIAS Y EQUIPOS
// 1) Si se llega desde el inicio con #pesada, #transporte, #obra o #taller,
//    se muestra solo esa categoría (si no hay, se muestra Maquinaria pesada).
//    Reutiliza el filtro de app.js (clic en el botón).
// 2) Cada equipo que tenga imagen (Excavadoras, Motobombas, etc.) se puede abrir para verla.
//    Las imágenes se buscan en la carpeta img/equipos/ con el nombre del equipo,
//    por ejemplo: img/equipos/excavadoras.jpg. Si no hay imagen, queda como texto.
// Eventos usados: click, hashchange
// Manipulación del DOM: createElement, appendChild, classList, setAttribute

// ---------- 1. CATEGORÍA SEGÚN EL ENLACE ----------
function mostrarCategoria(categoria) {
    const boton = document.querySelector('.filtro[data-categoria="' + categoria + '"]');
    if (boton) {
        boton.click();
        return true;
    }
    return false;
}

function categoriaDesdeEnlace() {
    const categoria = window.location.hash.replace("#", "");
    if (!mostrarCategoria(categoria)) {
        // sin enlace válido: por defecto la primera categoría
        const primero = document.querySelector(".filtro");
        if (primero) {
            primero.click();
        }
    }
}

// ---------- 2. CUADRO DE IMAGEN EN CADA EQUIPO ----------
// Solo los equipos que TIENEN imagen se vuelven botón (con flecha).
// Los que no tienen imagen se quedan como texto normal.
const CARPETA_IMAGENES = "img/equipos/";
const EXTENSIONES = ["jpg", "png", "webp", "jpeg"];

// "Cargadores frontales" -> "cargadores-frontales"
function crearNombreArchivo(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Busca si existe la imagen (probando jpg, png, webp, jpeg).
// Llama a alEncontrar(ruta) solo si la encuentra.
function buscarImagen(base, alEncontrar, intento = 0) {
    if (intento >= EXTENSIONES.length) {
        return;
    }
    const ruta = base + "." + EXTENSIONES[intento];
    const prueba = new Image();
    prueba.addEventListener("load", () => alEncontrar(ruta));
    prueba.addEventListener("error", () => buscarImagen(base, alEncontrar, intento + 1));
    prueba.src = ruta;
}

// Convierte el <li> en un botón desplegable con su imagen
function activarEquipo(item, nombre, ruta, indice) {
    const idDetalle = "equipo-detalle-" + indice;

    // Botón con el nombre del equipo (y flecha)
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "equipo-nombre";
    boton.textContent = nombre;
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", idDetalle);

    // Cuadro donde va la imagen (oculto al inicio)
    const detalle = document.createElement("div");
    detalle.className = "equipo-detalle";
    detalle.id = idDetalle;
    detalle.hidden = true;

    item.textContent = "";
    item.classList.add("con-imagen");
    item.appendChild(boton);
    item.appendChild(detalle);

    boton.addEventListener("click", () => {
        const abrir = detalle.hidden;

        // Se cierra cualquier otro cuadro abierto de la misma lista
        item.parentElement.querySelectorAll(".equipo-detalle").forEach((otro) => {
            otro.hidden = true;
            otro.parentElement.classList.remove("abierto");
            otro.parentElement.querySelector(".equipo-nombre").setAttribute("aria-expanded", "false");
        });

        if (abrir) {
            // La imagen se coloca solo la primera vez que se abre
            if (!detalle.hasChildNodes()) {
                const figura = document.createElement("figure");
                const img = document.createElement("img");
                img.src = ruta;
                img.alt = nombre;
                figura.appendChild(img);
                const pie = document.createElement("figcaption");
                pie.textContent = nombre;
                figura.appendChild(pie);
                detalle.appendChild(figura);
            }
            detalle.hidden = false;
            item.classList.add("abierto");
            boton.setAttribute("aria-expanded", "true");
        }
    });
}

function prepararEquipos() {
    const equipos = document.querySelectorAll(".lista-check li");

    equipos.forEach((item, indice) => {
        const nombre = item.textContent.trim();
        // Si el <li> tiene data-imagen se usa esa ruta (sin extensión)
        const base = item.dataset.imagen || CARPETA_IMAGENES + crearNombreArchivo(nombre);
        buscarImagen(base, (ruta) => activarEquipo(item, nombre, ruta, indice));
    });
}

prepararEquipos();
categoriaDesdeEnlace();
window.addEventListener("hashchange", categoriaDesdeEnlace);