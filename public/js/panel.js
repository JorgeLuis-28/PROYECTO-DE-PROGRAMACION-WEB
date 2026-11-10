// =====================================================
// PANEL DE LA EMPRESA (panel.html)
// Eventos usados: click, input, change
// 1) Pide la lista de solicitudes al servidor (GET /api/solicitudes)
// 2) Dibuja la tabla con createElement / appendChild
// 3) Permite buscar, filtrar y cambiar el estado (PATCH /api/solicitudes/:id)
// =====================================================

// Si no hay sesión, este panel no se puede ver: ir al login
if (obtenerToken() === null) {
    window.location.href = "login.html";
}

// Paso 1: obtener los elementos del DOM
const cuerpoTabla = document.getElementById("cuerpoTabla");
const inputBuscar = document.getElementById("buscar");
const selectFiltroEstado = document.getElementById("filtroEstado");
const btnActualizar = document.getElementById("btnActualizar");
const sinResultados = document.getElementById("sinResultados");

const ESTADOS = ["Pendiente", "En revisión", "Atendida"];
let solicitudes = [];   // aquí se guarda la lista que manda el servidor

// Paso 2: pedir la lista al servidor
async function cargarSolicitudes() {
    try {
        const respuesta = await fetch("/api/solicitudes", {
            headers: { "x-token": obtenerToken() }
        });

        // 401 = la sesión ya no vale (por ejemplo, se reinició el servidor)
        if (respuesta.status === 401) {
            borrarToken();
            window.location.href = "login.html";
            return;
        }

        solicitudes = await respuesta.json();
        actualizarResumen();
        dibujarTabla();
    } catch (error) {
        cuerpoTabla.innerHTML = "";
        sinResultados.textContent = "No se pudo conectar con el servidor.";
        sinResultados.classList.remove("d-none");
    }
}

// Paso 3: contar cuántas hay de cada estado
function actualizarResumen() {
    const contar = (estado) => solicitudes.filter((s) => s.estado === estado).length;

    document.getElementById("totalTodas").textContent = solicitudes.length;
    document.getElementById("totalPendiente").textContent = contar("Pendiente");
    document.getElementById("totalRevision").textContent = contar("En revisión");
    document.getElementById("totalAtendida").textContent = contar("Atendida");
}

// Paso 4: color de la etiqueta según el estado (clases de Bootstrap)
function colorEstado(estado) {
    if (estado === "Pendiente") return "text-bg-warning";
    if (estado === "En revisión") return "text-bg-info";
    return "text-bg-success";
}

// Paso 5: crear una fila de la tabla para una solicitud
function crearFila(solicitud) {
    const fila = document.createElement("tr");

    // Columna N.°
    const celdaId = document.createElement("td");
    celdaId.textContent = solicitud.id;

    // Columna fecha (formato de Perú)
    const celdaFecha = document.createElement("td");
    celdaFecha.textContent = new Date(solicitud.fecha).toLocaleDateString("es-PE");

    // Columna cliente: nombre + correo + celular
    const celdaCliente = document.createElement("td");
    const nombre = document.createElement("strong");
    nombre.textContent = solicitud.nombre;
    const contacto = document.createElement("div");
    contacto.className = "small text-secondary";
    contacto.textContent = solicitud.correo + (solicitud.telefono ? " · " + solicitud.telefono : "");
    celdaCliente.appendChild(nombre);
    celdaCliente.appendChild(contacto);

    // Columna servicio
    const celdaServicio = document.createElement("td");
    celdaServicio.textContent = solicitud.servicio;

    // Columna mensaje
    const celdaMensaje = document.createElement("td");
    celdaMensaje.className = "small mensaje-celda";
    celdaMensaje.textContent = solicitud.mensaje;

    // Columna estado: etiqueta de color + lista para cambiarlo
    const celdaEstado = document.createElement("td");
    const etiqueta = document.createElement("span");
    etiqueta.className = "badge mb-2 " + colorEstado(solicitud.estado);
    etiqueta.textContent = solicitud.estado;

    const selectEstado = document.createElement("select");
    selectEstado.className = "form-select form-select-sm";
    selectEstado.setAttribute("aria-label", "Cambiar estado de la solicitud " + solicitud.id);
    ESTADOS.forEach((estado) => {
        const opcion = document.createElement("option");
        opcion.value = estado;
        opcion.textContent = estado;
        opcion.selected = estado === solicitud.estado;
        selectEstado.appendChild(opcion);
    });
    selectEstado.addEventListener("change", () => {
        cambiarEstado(solicitud.id, selectEstado.value);
    });

    celdaEstado.appendChild(etiqueta);
    celdaEstado.appendChild(selectEstado);

    // Unir todas las celdas en la fila
    fila.appendChild(celdaId);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaCliente);
    fila.appendChild(celdaServicio);
    fila.appendChild(celdaMensaje);
    fila.appendChild(celdaEstado);
    return fila;
}

// Paso 6: dibujar la tabla aplicando el buscador y el filtro
function dibujarTabla() {
    const texto = inputBuscar.value.trim().toLowerCase();
    const estadoElegido = selectFiltroEstado.value;

    const visibles = solicitudes.filter((s) => {
        const coincideTexto = s.nombre.toLowerCase().includes(texto) || s.servicio.toLowerCase().includes(texto);
        const coincideEstado = estadoElegido === "" || s.estado === estadoElegido;
        return coincideTexto && coincideEstado;
    });

    cuerpoTabla.innerHTML = "";
    // Las más recientes primero
    visibles.slice().reverse().forEach((solicitud) => {
        cuerpoTabla.appendChild(crearFila(solicitud));
    });

    sinResultados.textContent = "No hay solicitudes que coincidan.";
    sinResultados.classList.toggle("d-none", visibles.length > 0);
}

// Paso 7: cambiar el estado en el servidor
async function cambiarEstado(id, nuevoEstado) {
    const respuesta = await fetch("/api/solicitudes/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-token": obtenerToken()
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });

    if (respuesta.ok) {
        const actualizada = await respuesta.json();
        const solicitud = solicitudes.find((s) => s.id === id);
        solicitud.estado = actualizada.estado;
        actualizarResumen();
        dibujarTabla();
    } else if (respuesta.status === 401) {
        borrarToken();
        window.location.href = "login.html";
    }
}

// Paso 8: registrar los eventos
inputBuscar.addEventListener("input", dibujarTabla);
selectFiltroEstado.addEventListener("change", dibujarTabla);
btnActualizar.addEventListener("click", cargarSolicitudes);

// Paso 9: cargar al abrir la página
cargarSolicitudes();
