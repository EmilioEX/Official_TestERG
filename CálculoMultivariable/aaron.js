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
        '#8d8cf1',/*11-20*/
        '#8d8cf1',/*21-30*/
        '#8d8cf1',/*31-40*/
        '#8d8cf1',/*41-50*/
        '#8d8cf1',/*51-60*/
        '#8d8cf1',/*61-70*/
        '#8d8cf1',/*71-80*/
        '#8d8cf1',/*81-90*/
        '#8d8cf1',/*91-100*/
    ];

    for (let i=1; i<11; i++) {
       if(numero<=(10*i)){
            color=colores[i-1];
            break;
        }
    }
    return color;
}

function main(){
    //guardamos los resultados en un arreglo de 100 (numero y color)
    const resultados = [];

    //ahora generamos los 100 elementos
    for (let i = 0; i < 100; i++) {
        //generamos el numero aleatorio
        const numero = numeroAleatorio();

        //introducimos el numero y su codigo de color
        resultados.push({
            numero: numero,
            color: numeroAColor(numero)
        });
    }

    //la descripcion en el html
    document.body.innerHTML = `
        <h2>100 números aleatorios</h2>
        <div id="contenedor"></div>
    `;

    //declaramos cual es el contenedor de nuestros elementos
    const contenedor = document.getElementById("contenedor");


    //Por cada resultado (100 elementos) ejecutamos:
    resultados.forEach(resultado => {
        //creamos un div
        const elemento = document.createElement("div");
        //cada div tiene el siguiente estilo
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
        //Añadimos el numero a la vista del div
        elemento.textContent = resultado.numero;
        //Se lo agregamos como hijo (que este dentro del contenedor) al contenedor que indicamos al principio
        contenedor.appendChild(elemento);
    });
}

main()