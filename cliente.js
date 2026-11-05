/*******ESENCIALES*******/
//Lista de productos
const productos=["Queso", "Pan","Café"];
//Lista para guardar los pedidos
const pedidos={};
//Bloque para poder solicitar info en consola
const readline = require("readline");

/**********************/

async function main() {

    let SuperMenu;
    do {
        superMenu();
        //Se muestra el menú
        do {
            SuperMenu = await pregunta("Elija una opción: ");
            if (SuperMenu<0 || SuperMenu>3) {
                console.log("Error: Escoja entre las opciones diponibles");
            }
        } while (SuperMenu<0 || SuperMenu>3);
        if (SuperMenu==0) {
            console.log("\n\t*****\n\t   Ha salido exitosamente\n\t*****");
        }
        if (SuperMenu==1) {
            mostrarProductos(productos);
        }
        if (SuperMenu==2) {
            mostrarProductos(productos);
            do {
                nombrePedido = await pregunta("Ingrese como quiere que se llame su pedido: ");
                if (nombrePedido.length>15) {
                    console.log("Error: Ingrese un nombre con máximo 15 carácteres");
                }
            } while (nombrePedido.length>15);
            pedidos[nombrePedido]=[];
            console.log("Finalizado con éxito");
            console.log(pedidos);
        }
        if (SuperMenu==3) {
            mostrarPedidos(pedidos);
        }
    } while (SuperMenu!=0);
}
main();


/****FUNCIONES ADICIONALES****/
//Función que se encarga de mostrar los productos que se encuentran disponibles en un array
function mostrarProductos(array){
    console.log("******** PRODUCTOS ********");
    for(let i=0; i<array.length; i++){
        console.log(`Producto ${i+1}: ${array[i]}`);
    }
    console.log("***************************");
}
//Función que muestra el menú principal de la cafetería
function superMenu(){
    console.log("\n******** BIENVENID@ A COFEE CODE  ********");
    console.log("\t1.- Consultar Productos disponibles");
    console.log("\t2.- Crear Nuevo Pedido");
    console.log("\t3.- Ver Pedidos");
}
//Función que permite esperar al usuario para que conteste la "pregunta" 
//o solicitud que se le ingresa a través del parámetro texto
function pregunta(texto) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(texto, respuesta => {
            rl.close();
            resolve(respuesta);
        });
    });
}
//Muestra la cantidad de pedidos que se encuentran registrados
function mostrarPedidos(array){
    console.log("******** PEDIDOS ********");
    for(const nombrePedido in array) {
        console.log(`Pedido: ${nombrePedido}`);
        const productos = pedidos[nombrePedido];
        if (productos.length === 0) {
            console.log("  (sin productos)");
        } else {
            for (let i = 0; i < productos.length; i++) {
                console.log(`  Producto ${i + 1}: ${productos[i]}`);
            }
        }
        console.log("------------------------");
    }
    console.log("***************************");
}