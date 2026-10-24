

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
function numeroAleatorio() {
    return Math.floor(Math.random() * 100);
}

function numeroAColor(numero) {
    /*const colores = [
        { r: 0, g: 0, b: 180 },
        { r: 0, g: 100, b: 255 },
        { r: 80, g: 0, b: 200 },
        { r: 180, g: 0, b: 180 },
        { r: 255, g: 0, b: 100 },
        { r: 255, g: 0, b: 0 }
    ];*/
    const colores = [ { r: 2, g: 152, b: 219 },
        { r: 41, g: 128, b: 185 },
        { r: 155, g: 89, b: 182 },
        { r: 142, g: 89, b: 173 },
        { r: 231, g: 76, b: 60 },
        { r: 192, g: 57, b: 43 },
        { r: 46, g: 204, b: 113 },
        { r: 39, g: 174, b: 96 },
        { r: 241, g: 196, b: 15 },
        { r: 243, g: 156, b: 18 }
    ];

    const posicion = (numero / 100) * (colores.length - 1);
    /*const posicion = (numero-1)/10;*/
    const indice = Math.floor(posicion);
    const siguiente = Math.min(indice + 1, colores.length - 1);
    const porcentaje = posicion - indice;

    const r = Math.round(
        colores[indice].r +
        (colores[siguiente].r - colores[indice].r) * porcentaje
    );

    const g = Math.round(
        colores[indice].g +
        (colores[siguiente].g - colores[indice].g) * porcentaje
    );

    const b = Math.round(
        colores[indice].b +
        (colores[siguiente].b - colores[indice].b) * porcentaje
    );

    return `rgb(${r}, ${g}, ${b})`;
}

const resultados = [];

for (let i = 0; i < 100; i++) {
    const numero = numeroAleatorio();

    resultados.push({
        numero: numero,
        color: numeroAColor(numero)
    });
}
/*
document.body.innerHTML = `
    <h2>100 números aleatorios</h2>
    <div id="contenedor"></div>
`;

const contenedor = document.getElementById("contenedor");

resultados.forEach(resultado => {
    const elemento = document.createElement("div");

    elemento.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 50px;
        margin: 5px;
        border-radius: 8px;
        background: ${resultado.color};
        color: white;
        font-weight: bold;
        font-family: Arial;
    `;

    elemento.textContent = resultado.numero;
    contenedor.appendChild(elemento);
});
*/

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const raster = document.getElementById("raster");

// Crea 100 posiciones del raster.
for (let i = 0; i < 100; i++) {
  const celda = document.createElement("div");
  celda.classList.add("celda");
  raster.appendChild(celda);
}

// Recorre celdas y pinta del color indicado.
function pintarRaster() {
    let color;
    const celdas = raster.querySelectorAll(".celda");

    celdas.forEach(function(celda) {
        numero=numeroAleatorio();
        color=numeroAColor(numero);
        celda.style.backgroundColor = color;
        celda.textContent=numero;
    });
}
pintarRaster();
/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const select = document.getElementById("colorSelect");
const colores = [
    { r: 2, g: 152, b: 219 , nombre:"azul suave", numero: 0},
    { r: 41, g: 128, b: 185 , nombre:"azul profundo", numero: 10},
    { r: 155, g: 89, b: 182 , nombre:"Morado pastel", numero: 20},
    { r: 142, g: 89, b: 173 , nombre:"morado inteso", numero: 30},
    { r: 231, g: 76, b: 60 , nombre:"rojo coral", numero: 40},
    { r: 192, g: 57, b: 43 , nombre:"rojo oscuro", numero: 50},
    { r: 46, g: 204, b: 113 , nombre:"verde pastel", numero: 60},
    { r: 39, g: 174, b: 96 , nombre:"verde profundo", numero: 70},
    { r: 241, g: 196, b: 15 , nombre:"amarillo suave", numero: 80},
    { r: 243, g: 156, b: 18 , nombre:"naranja cálido", numero: 90}
];
colores.forEach(c => {
    const rgb = `rgb(${c.r}, ${c.g}, ${c.b})`;
    const option = document.createElement("option");
    option.value = rgb;
    option.textContent = `${c.nombre}`;
    select.appendChild(option);
});

function cambiarColorManual() {
    const index = document.getElementById("celdaIndex").value;
    const color = document.getElementById("colorSelect").value;

    const celdas = raster.querySelectorAll(".celda");
    celdas[index-1].style.backgroundColor = color;
}
function cambiarColorXY() {
    const x=parseInt(document.getElementById("x").value);
    const y=parseInt(document.getElementById("y").value);
    const color = document.getElementById("colorSelect").value;

    const index = (y-1) * 10 + (x-1);   // conversión
    const celdas = raster.querySelectorAll(".celda");
    celdas[index].style.backgroundColor = color;
}
