

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