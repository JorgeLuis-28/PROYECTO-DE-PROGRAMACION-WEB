// =====================================================
// CARRUSEL DEL INICIO (solo en index.html)
// Eventos usados: click, mouseenter, mouseleave, keydown
// Manipulación del DOM: createElement, appendChild, classList
// =====================================================

// Paso 1: obtener los elementos del DOM
const carrusel = document.getElementById("carrusel");
const slides = document.querySelectorAll(".slide");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnPausa = document.getElementById("btnPausa");
const contenedorPuntos = document.getElementById("puntos");

// Variables de estado
let indiceActual = 0;      // posición de la imagen visible
let temporizador = null;   // guarda el setInterval
let enPausa = false;       // true si el usuario pausó
const TIEMPO = 5000;       // 5 segundos por imagen

// Si el usuario configuró "reducir movimiento", no avanza solo
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Paso 2: crear un punto (botón) por cada imagen
function crearPuntos() {
    slides.forEach((slide, index) => {
        const punto = document.createElement("button");
        punto.type = "button";
        punto.className = "punto";
        punto.setAttribute("aria-label", "Ir a la imagen " + (index + 1));
        punto.addEventListener("click", () => {
            mostrarSlide(index);
            reiniciarAuto();
        });
        contenedorPuntos.appendChild(punto);
    });
}

// Paso 3: mostrar la imagen indicada
function mostrarSlide(nuevoIndice) {
    // Si pasa del final vuelve al inicio, y al revés
    if (nuevoIndice >= slides.length) {
        nuevoIndice = 0;
    } else if (nuevoIndice < 0) {
        nuevoIndice = slides.length - 1;
    }

    const puntos = contenedorPuntos.querySelectorAll(".punto");

    // Quitar "activo" a la imagen y punto actuales
    slides[indiceActual].classList.remove("activo");
    puntos[indiceActual].classList.remove("activo");
    puntos[indiceActual].removeAttribute("aria-current");

    // Poner "activo" a los nuevos
    indiceActual = nuevoIndice;
    slides[indiceActual].classList.add("activo");
    puntos[indiceActual].classList.add("activo");
    puntos[indiceActual].setAttribute("aria-current", "true");
}

function siguienteSlide() {
    mostrarSlide(indiceActual + 1);
}

function anteriorSlide() {
    mostrarSlide(indiceActual - 1);
}

// Paso 4: avance automático
function iniciarAuto() {
    if (enPausa || reducirMovimiento) {
        return;
    }
    detenerAuto();
    temporizador = setInterval(siguienteSlide, TIEMPO);
}

function detenerAuto() {
    clearInterval(temporizador);
    temporizador = null;
}

// Cuando el usuario cambia de imagen, el contador empieza de nuevo
function reiniciarAuto() {
    detenerAuto();
    iniciarAuto();
}

// Botón pausar / reanudar
function alternarPausa() {
    enPausa = !enPausa;
    if (enPausa) {
        detenerAuto();
        btnPausa.innerHTML = "&#9654;";
        btnPausa.setAttribute("aria-label", "Reanudar carrusel");
    } else {
        btnPausa.innerHTML = "&#10074;&#10074;";
        btnPausa.setAttribute("aria-label", "Pausar carrusel");
        iniciarAuto();
    }
}

// Paso 5: registrar los eventos
btnSiguiente.addEventListener("click", () => {
    siguienteSlide();
    reiniciarAuto();
});

btnAnterior.addEventListener("click", () => {
    anteriorSlide();
    reiniciarAuto();
});

btnPausa.addEventListener("click", alternarPausa);

// Se detiene mientras el mouse está encima (para poder leer)
carrusel.addEventListener("mouseenter", detenerAuto);
carrusel.addEventListener("mouseleave", iniciarAuto);

// Flechas del teclado cuando el foco está dentro del carrusel
carrusel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        siguienteSlide();
        reiniciarAuto();
    } else if (e.key === "ArrowLeft") {
        anteriorSlide();
        reiniciarAuto();
    }
});

// Paso 6: arrancar
crearPuntos();
mostrarSlide(0);
iniciarAuto();


// =====================================================
// FILTRO DE MAQUINARIAS Y EQUIPOS
// Eventos usados: click
// Manipulación del DOM: classList, setAttribute, textContent
// =====================================================

// Paso 1: obtener los elementos del DOM
const botonesFiltro = document.querySelectorAll(".filtro");
const panelesEquipos = document.querySelectorAll(".panel-equipos");
const contadorEquipos = document.getElementById("contadorEquipos");

// Paso 2: mostrar solo los paneles de la categoría elegida
function filtrarEquipos(categoria) {
    let totalVisibles = 0;

    panelesEquipos.forEach((panel) => {
        const coincide = categoria === "todos" || panel.dataset.categoria === categoria;

        if (coincide) {
            panel.classList.remove("d-none");     // d-none es de Bootstrap: oculta
            totalVisibles += panel.querySelectorAll("li").length;
        } else {
            panel.classList.add("d-none");
        }
    });

    // Paso 3: actualizar el texto del contador
    contadorEquipos.textContent = "Mostrando " + totalVisibles + " tipos de equipos";
}

// Paso 4: marcar el botón activo
function marcarBotonActivo(botonElegido) {
    botonesFiltro.forEach((boton) => {
        boton.classList.remove("active");
        boton.setAttribute("aria-pressed", "false");
    });
    botonElegido.classList.add("active");
    botonElegido.setAttribute("aria-pressed", "true");
}

// Paso 5: registrar el evento click en cada botón
botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
        marcarBotonActivo(boton);
        filtrarEquipos(boton.dataset.categoria);
    });
});

// Paso 6: estado inicial (todos los equipos)
filtrarEquipos("todos");
