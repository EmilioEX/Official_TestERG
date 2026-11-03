/*******ESENCIALES*******/
//Lista de productos
const productos=[{producto: "Espresso", precio: 60},
                {producto: "Americano", precio: 50},
                {producto: "Cappuccino", precio: 55},
                {producto: "Latte", precio: 70},
                {producto: "Mocha", precio: 30}
];
//const productos2 = ["Espresso", "americano", "cappuccino", "latte", "mocha" ];
//Lista para guardar los pedidos
const listaPedidos={};
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
                console.log("=====Error: Escoja entre las opciones diponibles=====");
            }
        } while (SuperMenu<0 || SuperMenu>3);
        if (SuperMenu==0) {
            console.log("\n\t*****\n\t\tHa salido exitosamente\n\t*****");
        }
        if (SuperMenu==1) {
            mostrarProductos(productos);
        }
        if (SuperMenu==2) {
            let nombrePedido;
            let eleccionProducto;
            do {
                nombrePedido = await pregunta("\nA nombre de quén es el pedido?: ");
                if (nombrePedido.length>15) {
                    console.log("=====ERROR: Ingrese un nombre con máximo 15 carácteres=====");
                }
                if(nombrePedido.length===0){
                    console.log("=====ERROR: Ingrese un nombre=====");
                }
            } while (nombrePedido.length>15||nombrePedido.length===0);
            listaPedidos[nombrePedido]={productos: [], totalAcumulado: 0};
            mostrarProductos(productos);
            console.log("\n****************************************************************");
            console.log("INSTRUCCIONES:");
            console.log("\tEscriba el código númerico del producto para agregarlo al pedido");
            console.log("\tEscriba '0' en caso de que quiera finalizar el pedido");
            console.log("****************************************************************\n");
            do {
                do {
                    eleccionProducto = await pregunta("Escriba el numero del producto: ");
                    if (eleccionProducto<0 || eleccionProducto>productos.length) {
                        console.log("=====ERROR: Escriba un valor válido=====");
                    }
                } while (eleccionProducto<0 || eleccionProducto>productos.length);
                if(eleccionProducto!=0){
                    agregarPedido(listaPedidos[nombrePedido], productos[eleccionProducto-1].producto, productos[eleccionProducto-1].precio);
                }
            } while (eleccionProducto!=0);
        }
        if (SuperMenu==3) {
            let eleccionEdicion;
            let eleccionPedido;
            mostrarPedidos(listaPedidos);
            if(Object.keys(listaPedidos).length>0){
                do {
                    console.log("\n****************************************************************");
                    console.log("INSTRUCCIONES:");
                    console.log("\tSi su respuesta es afirmativa escriba '1'");
                    console.log("\tSi su respuesta es negativa escriba '2'");
                    console.log("\tSi desea regresar al menú principal escriba '0'");
                    console.log("****************************************************************\n");
                    eleccionEdicion = await pregunta("Desea editar algún pedido?: ");
                    if (eleccionEdicion<0 || eleccionEdicion>2) {
                        console.log("=====Error: Escoja entre las opciones diponibles=====");
                    }
                } while (eleccionEdicion<0 || eleccionEdicion>2);
                if (eleccionEdicion!=0) {
                    mostrarNombresPedidos(Object.keys(listaPedidos));
                    do {
                        eleccionPedido = await pregunta("Escriba codigo del pedido a editar: ");
                        if (eleccionPedido<0 || eleccionPedido>Object.keys(listaPedidos).length) {
                            console.log("=====ERROR: Escriba un valor válido=====");
                        }
                    } while (eleccionPedido<0 || eleccionPedido>Object.keys(listaPedidos).length);
                    const nombreRealPedido = Object.keys(listaPedidos)[eleccionPedido-1];
                    console.log("\n******** CONTENIDO DEL PEDIDO ********");
                    listaPedidos[nombreRealPedido].productos.forEach((producto, indice) => {
                        console.log(`${indice + 1}. ${producto.producto} - $${producto.precio}`);
                    });
                    console.log("Total acumulado: $" + listaPedidos[nombreRealPedido].totalAcumulado);
                    console.log("****************************************\n");
                    let opcionEdicion;
                    do {
                        console.log("********* MENÚ DE EDICIÓN *********");
                        console.log("1.- Agregar producto");
                        console.log("2.- Eliminar producto");
                        console.log("3.- Ver productos");
                        console.log("0.- Salir al menú principal\n");
                        do {
                            opcionEdicion = await pregunta("Elija una opción: ");

                            if (opcionEdicion<0 || opcionEdicion>3) {
                                console.log("=====ERROR: Escoja una opción válida=====");
                            }

                        } while (opcionEdicion<0 || opcionEdicion>3);
                        if (opcionEdicion==1) {
                            mostrarProductos(productos);
                            let nuevoProd;
                            do {

                                nuevoProd = await pregunta("¿Qué producto desea agregar?: ");
                                if (nuevoProd<1 || nuevoProd>productos.length) {
                                    console.log("=====ERROR: Código inválido=====");
                                }
                            } while (nuevoProd<1 || nuevoProd>productos.length);
                            agregarPedido(listaPedidos[nombreRealPedido], productos[nuevoProd-1].producto, productos[nuevoProd-1].precio);
                            console.log("\nProducto agregado correctamente.");
                        }
                        if (opcionEdicion==2) {
                            console.log("\n******** CONTENIDO DEL PEDIDO ********");
                            listaPedidos[nombreRealPedido].productos.forEach((producto, indice) => {
                                console.log(`${indice + 1}. ${producto.producto} - $${producto.precio}`);
                            });
                            console.log("Total acumulado: $" + listaPedidos[nombreRealPedido].totalAcumulado);
                            console.log("****************************************\n");
                            let posEliminar;
                            do {
                                posEliminar = await pregunta("¿Cuál es la posición del producto a eliminar?: ");
                                if (posEliminar<1 || posEliminar>listaPedidos[nombreRealPedido].productos.length) {
                                    console.log("=====ERROR: Posición inválida=====");
                                }
                            } while (posEliminar<1 || posEliminar>listaPedidos[nombreRealPedido].productos.length);
                            const precioEliminado = listaPedidos[nombreRealPedido].productos[posEliminar - 1].precio;
                            listaPedidos[nombreRealPedido].totalAcumulado -= precioEliminado;

                            listaPedidos[nombreRealPedido].productos.splice(posEliminar - 1, 1);
                            console.log("\nProducto eliminado correctamente.");
                        }

                        // Opción 4 - Ver productos del pedido
                        if (opcionEdicion==3) {
                            console.log("\n******** CONTENIDO DEL PEDIDO ********");
                            listaPedidos[nombreRealPedido].productos.forEach((producto, indice) => {
                                console.log(`${indice + 1}. ${producto.producto} - $${producto.precio}`);
                            });
                            console.log("Total acumulado: $" + listaPedidos[nombreRealPedido].totalAcumulado);
                            console.log("****************************************\n");
                        }
                    } while (opcionEdicion!=0);
                }
            }
        }
    } while (SuperMenu!=0);
}
main();


/****FUNCIONES ADICIONALES****/
//Función que se encarga de mostrar los productos que se encuentran disponibles en un array
function mostrarProductos(array){
    console.log("\n******** PRODUCTOS ********");
    array.forEach((lista, posicion) => {
        console.log(`${posicion+1} : ${lista.producto} - Precio: $ ${lista.precio}`);
    });
    console.log("***************************");
}
//Función que muestra el menú principal de la cafetería
function superMenu(){
    console.log("\n******** BIENVENID@ A COFEE CODE  ********");
    console.log("\t1.- Consultar Productos disponibles");
    console.log("\t2.- Crear Nuevo Pedido");
    console.log("\t3.- Ver Pedidos");
    console.log("\t0.- Salir del sistema");
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
    console.log("\n******** PEDIDOS ********");
    //recorre todos los pedidos junto a los productos que contienen
    for(const nombrePedido in array) {
        console.log(`Pedido de : ${nombrePedido}`);
        const productos = array[nombrePedido].productos;
        if (productos.length === 0) {
            console.log("  (sin productos)");
        } else {
            for (let i = 0; i < productos.length; i++) {
                console.log(`\tProducto ${i + 1}: ${productos[i].producto} - $ ${productos[i].precio}`);
            }
        }
        console.log(`\tTotal Acumulado: $ ${array[nombrePedido].totalAcumulado}`);
        console.log("------------------------");
    }
    console.log("***************************");
}
function mostrarNombresPedidos(array){
    console.log("********** LISTA DE PEDIDOS **********")
    array.forEach((nombres, indice) =>{
        console.log(`${indice + 1}. ${nombres}`);
    });
    console.log("**************************************");
}

function agregarPedido(pedido, nombre, precio) {
    pedido.productos.push({ producto: nombre, precio: precio });
    pedido.totalAcumulado += precio;
}