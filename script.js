let piezas = [];
let filas = 3;
let columnas = 3;
let tamWidth = 852 / columnas;
let tamHeight = 567 / filas;
let contador = 60;
let tiempoInicio = null;
let intervalo;
const tolerancia = 20; // Ajusta este valor según la precisión deseada

function inicializarRompecabezas() {
    const entorno = document.getElementById('entorno');

    const grupos = document.querySelectorAll("#entorno > g:not(#fondo)");
    grupos.forEach((grupo, index) => {
        const pieza = grupo.querySelector("image");

        const posXCorrecto = (index % columnas) * tamWidth;
        const posYCorrecto = Math.floor(index / columnas) * tamHeight;

        const posX = Math.random() * 400; // Posición inicial aleatoria
        const posY = Math.random() * 400;

        grupo.setAttribute("transform", `translate(${posX}, ${posY})`);
        pieza.setAttribute("width", tamWidth);
        pieza.setAttribute("height", tamHeight);

        grupo.addEventListener("mousedown", (evt) => seleccionarElemento(evt, grupo));
        piezas.push({ grupo, index, posXCorrecto, posYCorrecto });
    });
}

let elementoSeleccionado = null;
let offsetX = 0;
let offsetY = 0;

function seleccionarElemento(evt, grupo) {
    elementoSeleccionado = grupo;
    const matrix = elementoSeleccionado.getCTM();
    offsetX = evt.clientX - matrix.e;
    offsetY = evt.clientY - matrix.f;

    document.addEventListener("mousemove", moverElemento);
    document.addEventListener("mouseup", deseleccionarElemento);
}

function moverElemento(evt) {
    if (!elementoSeleccionado) return;

    const x = evt.clientX - offsetX;
    const y = evt.clientY - offsetY;

    elementoSeleccionado.setAttribute("transform", `translate(${x}, ${y})`);
}

function deseleccionarElemento() {
    if (!elementoSeleccionado) return;

    const { grupo, posXCorrecto, posYCorrecto } = piezas.find(p => p.grupo === elementoSeleccionado);

    const matrix = elementoSeleccionado.getCTM();
    const xActual = matrix.e;
    const yActual = matrix.f;

    // Ajustar automáticamente si está cerca de su posición correcta
    if (Math.abs(xActual - posXCorrecto) < tolerancia && Math.abs(yActual - posYCorrecto) < tolerancia) {
        elementoSeleccionado.setAttribute("transform", `translate(${posXCorrecto}, ${posYCorrecto})`);
    }

    document.removeEventListener("mousemove", moverElemento);
    document.removeEventListener("mouseup", deseleccionarElemento);

    elementoSeleccionado = null;
    verificarVictoria();
}

function verificarVictoria() {
    let correcto = piezas.every(({ grupo, posXCorrecto, posYCorrecto }) => {
        const matrix = grupo.getCTM();
        const x = matrix.e;
        const y = matrix.f;

        return Math.abs(x - posXCorrecto) < 1 && Math.abs(y - posYCorrecto) < 1;
    });

    if (correcto) {
        clearInterval(intervalo);
        const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
        alert(`Felicidades Ganaste en ${tiempoFinal} segundos.`);
        reproducirSonidoVictoria();
    }
}

function iniciarContador() {
    tiempoInicio = Date.now();
    intervalo = setInterval(() => {
        contador--;
        document.getElementById('contador').textContent = contador;
        if (contador === 0) {
            clearInterval(intervalo);
            alert("Tiempo agotado Prueba de nuevo.");
        }
    }, 1000);
}

inicializarRompecabezas();
iniciarContador();
