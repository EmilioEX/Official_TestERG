function numeroAleatorio() {
    //Math random devuelve un decimal entre 0 y 1 (sin llegar al uno)
    let decimal= Math.random();
    //Como queremos números del 1 al 100 vamos a escalar el rango de 0-1 a 0-100(sin llegar al 100)
    let rango= decimal*100;
    /*
        con este rango ahora necesitamos quitarle los decimales
        Math.floor nos trunca el resultado a el entero debajo (no redondea)
        por lo que ahora tenemos numeros desde el 0 hasta el 99
    */
    //cuando le sumamos 1 desplazamos el rango 1 posicion (ahora es desde 1-100)
    let numero=Math.floor(rango)+1;
    return numero;
}

function numeroAColor(numero) {
    //Declaramos el arreglo de colores (salidas) posibles,
    /*Futura implementación de arreglo 'x'*/
    let color;
    const colores = [
        '#8d8cf1',/*1-10*/
        '#8d9cdb',/*11-20*/
        '#90aace',/*21-30*/
        '#97b5c8',/*31-40*/
        '#9fbfc6',/*41-50*/
        '#aac8c7',/*51-60*/
        '#b7d1cc',/*61-70*/
        '#c6d8d3',/*71-80*/
        '#d5e0dc',/*81-90*/
        '#e7e7e7',/*91-100*/
    ];

    for (let i=1; i<11; i++) {
       if(numero<=(10*i)){
            color=colores[i-1];
            break;
        }
    }
    return color;
}



// Recorre celdas y pinta del color indicado.
function pintarRaster() {
    let color;
    const celdas = raster.querySelectorAll(".celda");

    //Por cada hijo (celda) se ejecuta:
    celdas.forEach(function(celda) {
        //se crea un número aleatorio
        numero=numeroAleatorio();
        //se le asigna un color
        color=numeroAColor(numero);
        //se le aplican esos estilos a la celda
        celda.style.backgroundColor = color;
        //se le coloca el número dentro de la celda
        celda.textContent=numero;
    });
}

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

function main(){
    const resultados = [];
    const raster = document.getElementById("raster");
    for (let i = 0; i < 100; i++) {
        const numero = numeroAleatorio();

        resultados.push({
            numero: numero,
            color: numeroAColor(numero)
        });
    }

    // Crea 100 posiciones del raster.
    for (let i = 0; i < 100; i++) {
        const celda = document.createElement("div");
        celda.classList.add("celda");
        raster.appendChild(celda);
    }
    pintarRaster();

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
}


main();
