/*******ESENCIALES*******/
//Lista de productos
//const productos2 = ["Espresso", "americano", "cappuccino", "latte", "mocha" ];
//Lista para guardar los pedidos

//Bloque para poder solicitar info en consola
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**********************/
// LISTA GLOBAL COMPARTIDA DE PRODUCTOS (COCINA + CLIENTE)
const productos=[{id: 1, nombre: "Espresso", producto: "Espresso", precio: 60, tipo: "bebida"},
                {id: 2, nombre: "Americano", producto: "Americano", precio: 50, tipo: "bebida"},
                {id: 3, nombre: "Cappuccino", producto: "Cappuccino", precio: 55, tipo: "bebida"},
                {id: 4, nombre: "Latte", producto: "Latte", precio: 70, tipo: "bebida"},
                {id: 5, nombre: "Mocha", producto: "Mocha", precio: 30, tipo: "bebida"},
                {id: 6, nombre: "Pastel de fresa", producto: "Pastel de fresa", precio: 40, tipo: "postre"},
                {id: 7, nombre: "Pastel de chocolate", producto: "Pastel de chocolate", precio: 40, tipo: "postre"}
];

const promociones = new Map();
promociones.set(1, {nombre: "2x1 en Espresso", productos: [1]});
promociones.set(2, {nombre: "3x1 en Cappuccino", productos: [3]});
promociones.set(3, {nombre: "2x1 en Pastel de fresa", productos: [6]});
promociones.set(4, {nombre: "3x1 en Mocha", productos: [5]});

/**********************/
async function main() {
    let SuperMenu;
    do {
        superMenu();
        //Se muestra el menú
        do {
            SuperMenu = await preguntar("Elija una opción: ");
            if (SuperMenu<0 || SuperMenu>3) {
                console.log("===== ERROR: Escoja entre las opciones diponibles =====");
            }
        } while (SuperMenu<0 || SuperMenu>3);
        if (SuperMenu==0) {
            
        }
        if (SuperMenu==1) {
            // Entrar como Caja (pendiente)
        }
        if (SuperMenu==2) {
            // Entrar como Cocina
            await mainCocina();
        }
        if (SuperMenu==3) {
            await mainCliente();
        }
    } while (SuperMenu!=0);
    rl.close();
}
main();

//Estuve analizando el Super menú con las demás opciones para cada módulo y organizarnos qué hace cada quién()

/****FUNCIONES ADICIONALES****/
//Función que muestra el menú principal de la cafetería
function superMenu(){
    console.log("\n******** BIENVENID@ A COFFEE CODE II ********");
    console.log("\t1.- Entrar como Caja");
    console.log("\t2.- Entrar como Cocina");
    console.log("\t3.- Entrar como Cliente");
    console.log("\t0.- Salir del sistema");
}
/*Función que permite esperar al usuario para que conteste la "pregunta" 
o solicitud que se le ingresa a través del parámetro texto*/

function preguntar(pregunta) {
    return new Promise(resolve => {
        rl.question(pregunta, respuesta => {
            resolve(respuesta);
        });
    });
}

async function mainCliente() {
    let opcionCliente;
    const listaPedidos = new Map();
    const listaProductos=[{nombre: "Espresso", precio: productos[0].precio},
                    {nombre: "Americano", precio: productos[1].precio},
                    {nombre: "Cappuccino", precio: productos[2].precio},
                    {nombre: "Latte", precio: productos[3].precio},
                    {nombre: "Mocha", precio: productos[4].precio}
    ];

    do {
        menuCliente();  
        do {
            opcionCliente = await preguntar("\nElija una opción: ");
            //Validacion de que exista un nombre y que no sea extremadamente largo
            if (opcionCliente<0 || opcionCliente>3) {
                console.log(">>>>>>>> ERROR: Ingrese una opción válida <<<<<<<<");
            }
        } while (opcionCliente<0 || opcionCliente>3);
        console.log("==============================")
        if (opcionCliente==0) {
            console.log("\n>>>>>>>> Ha salido exitosamente del programa <<<<<<<<\n")
        }
        if (opcionCliente==1) {
            mostrarProductos(listaProductos);
        }
        if (opcionCliente==2) {
            await solicitarPedido(listaPedidos, listaProductos);
        }
        if (opcionCliente==3) {
            mostrarPedidos(listaPedidos);
        }
    } while (opcionCliente!=0);

}

//mainCliente();
/*
Simbología de Menús
(8 símbolos regularmente)
======= : Para menús principales (SuperMenu y menus de cliente, caja y cocina)
(12)/////// : Impresiones de estilo ticket 
------- : separadores de contenido dentro del mismo menú
%%%%%%% : Tickets de descuento 
<<<<<<< : Instrucciones / Advertencias
*/
function menuCliente(){
    console.log("\n======== MENÚ CLIENTE ========");
    console.log("\t1.- Consultar Productos");
    console.log("\t2.- Crear Pedido");
    console.log("\t3.- Listar-Ver Pedidos");
    console.log("\t0.- Salir/Volver al Menú Principal");
}
function menuEdicionCliente(){
    console.log("\n^^^^^^^^ MENÚ EDICIÓN CLIENTE ^^^^^^^^");
    console.log("\t1.- Agregar Producto");
    console.log("\t2.- Eliminar Producto");
    console.log("\t3.- Ver Pedido");
    console.log("\t0.- Salir/Volver al Menú Principal");
}
function mostrarProductos(array){
    console.log("\n//////////// PRODUCTOS ////////////");
    array.forEach((producto, i) => {
        console.log(`${i+1} : ${producto.nombre} - Precio: $ ${producto.precio}`);
                //  1 : Espresso - Precio $ 60
    });
    console.log(  "///////////////////////////////////");
}
async function solicitarPedido(listaPedidos, listaProductos){
    let nuevoPedido;//Nombre que se pondrá al nuevo pedido
    let eleccionProducto;//Es el ID del producto que se añadirá
    do {
        nuevoPedido = await preguntar("\nA nombre de quén es el pedido?: ");
        //Validacion de que exista un nombre y que no sea extremadamente largo
        if (nuevoPedido.length>15) {
            console.log(">>>>>>>> ERROR: Ingrese un nombre con máximo 15 carácteres <<<<<<<<");
        }
        if(nuevoPedido.length===0){
            console.log(">>>>>>>> ERROR: Ingrese un nombre <<<<<<<<");
        }
    } while (nuevoPedido.length>15||nuevoPedido.length===0);
    //Dentro del map se añade un nuevo pedido en el cual se asociarán una lista de productos así como un total acumulado de ese pedido
    listaPedidos.set(nuevoPedido, {listaProductos: [],totalAcumulado: 0});
    //Esta mal para map()>>>>listaPedidos[nuevoPedido]={productos: [], totalAcumulado: 0};
    mostrarProductos(listaProductos);
    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");//70 símbolos
    console.log("INSTRUCCIONES:");
    console.log("\tEscriba el ID del producto para agregarlo al pedido");
    console.log("\tEscriba '0' en caso de que quiera finalizar el pedido");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");//Quedan mejor invertidos?
    do {
        do {
            eleccionProducto = await preguntar("Escriba el ID del producto: ");
            if (eleccionProducto<0 || eleccionProducto>listaProductos.length) {
                console.log(">>>>>>>> ERROR: Escriba un ID válido <<<<<<<<");
            }
        } while (eleccionProducto<0 || eleccionProducto>listaProductos.length);
        if(eleccionProducto!=0){
            agregarPedido(listaPedidos, listaProductos, nuevoPedido, (eleccionProducto-1));
        }
    } while (eleccionProducto!=0);
    await editarPedido(listaPedidos,listaProductos, nuevoPedido);
                console.log("\n>>>>>>>> Pedido agregado exitosamente  <<<<<<<<\n")

}
async function editarPedido(listaPedidos, listaProductos, nombrePedido){
    let confirmacionPedido;
    console.log ("\n>>>>>>>> CONFIRMACIÓN DE PEDIDO <<<<<<<<")
    mostrarPedido(listaPedidos, nombrePedido);
    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");//70 símbolos
    console.log("INSTRUCCIONES:");
    console.log("\tEscriba '1' en caso de querer editar algo");
    console.log("\tEscriba '0' si está de acuerdo con el pedido");
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");//Quedan mejor invertidos?
    do {
        confirmacionPedido = await preguntar("Escriba su confirmación: ");
        if (confirmacionPedido<0 || confirmacionPedido>1) {
            console.log(">>>>>>>> ERROR: Escriba una opción  válida <<<<<<<<");
        }
    } while (confirmacionPedido<0 || confirmacionPedido>1);
    if(confirmacionPedido==1){
        let opcionEdicionCliente;
        let eleccionProducto;
        do {
            menuEdicionCliente();
            do {
                opcionEdicionCliente = await preguntar("Elija una opción: ");
                if (opcionEdicionCliente<0 || opcionEdicionCliente>3) {
                    console.log(">>>>>>>> ERROR: Escriba una opción  válida <<<<<<<<");
                }
            } while (opcionEdicionCliente<0 || opcionEdicionCliente>3);
            console.log("\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            if (opcionEdicionCliente==0){
                //console.log("\n>>>>>>>> Ha salido del menú de edición <<<<<<<<\n")
            }
            if (opcionEdicionCliente==1){
                mostrarProductos(listaProductos);
                mostrarPedido(listaPedidos, nombrePedido);
                console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");//70 símbolos
                console.log("INSTRUCCIONES:");
                console.log("\tEscriba el ID del producto para agregarlo al pedido");
                console.log("\tEscriba '0' en caso de que quiera finalizar la edición del pedido");
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");//Quedan mejor invertidos?
                do {
                    do {
                        eleccionProducto = await preguntar("Escriba el número de producto para añadirlo: ");
                        if (eleccionProducto<0 || eleccionProducto>listaProductos.length) {
                            console.log(">>>>>>>> ERROR: Escriba un producto existente <<<<<<<<");
                        }
                    } while (eleccionProducto<0 || eleccionProducto>listaProductos.length);
                    if(eleccionProducto!=0){
                        agregarPedido(listaPedidos, listaProductos, nombrePedido, (eleccionProducto-1));
                    }
                } while (eleccionProducto!=0);
            }
            if (opcionEdicionCliente==2){
                mostrarPedido(listaPedidos, nombrePedido);
                console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");//70 símbolos
                console.log("INSTRUCCIONES:");
                    console.log("\tEscriba el número de producto para eliminarlo");
                    console.log("\tEscriba '0' en caso de que quiera finalizar la edición del pedido");
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");//Quedan mejor invertidos?
                do {
                    do {
                        eleccionProducto = await preguntar("Escriba el número de producto: ");
                        if (eleccionProducto<0 || eleccionProducto>listaPedidos.get(nombrePedido).listaProductos.length) {
                            console.log(">>>>>>>> ERROR: Escriba un producto válido <<<<<<<<");
                        }
                    } while (eleccionProducto<0 || eleccionProducto>listaPedidos.get(nombrePedido).listaProductos.length);
                    if(eleccionProducto!=0){
                        eliminarAlPedido(listaPedidos, nombrePedido, (eleccionProducto-1));
                        mostrarPedido(listaPedidos, nombrePedido);
                    }
                } while (eleccionProducto!=0);

            }
            if (opcionEdicionCliente==3){
                mostrarPedido(listaPedidos, nombrePedido);
            }
        } while (opcionEdicionCliente!=0);
    }
}   
function agregarPedido(listaPedidos, listaProductos, nombrePedido, idProducto) {
    listaPedidos.get(nombrePedido).listaProductos.push(listaProductos[idProducto]);
    listaPedidos.get(nombrePedido).totalAcumulado = listaPedidos.get(nombrePedido).listaProductos.reduce((subtotal, producto) =>{
        return subtotal + producto.precio;
    },0);
    console.log(`\n>>>>>>>> Se ha añadido exitosamente ${listaProductos[idProducto].nombre} <<<<<<<<\n`)
}
function eliminarAlPedido(listaPedidos, nombrePedido, idProducto){
    console.log(`\n>>>>>>>> Se ha eliminado exitosamente ${listaPedidos.get(nombrePedido).listaProductos[idProducto].nombre} <<<<<<<<\n`);
    const pedido = listaPedidos.get(nombrePedido);
    pedido.listaProductos.splice(idProducto,1);
    pedido.totalAcumulado=pedido.listaProductos.reduce((subtotal,producto)=>{
        return subtotal + producto.precio;
    },0);
}
function mostrarPedidos(listaPedidos){
    if (listaPedidos.size === 0) {
        console.log("\n//////////// PEDIDOS ////////////");
        console.log("\n\t>>>>>>>> No hay pedidos registrados en este momento <<<<<<<<\n")
        console.log("///////////////////////////////////");
    }else{
        console.log("\n//////////// PEDIDOS ////////////");
        //recorre todos los pedidos junto a los productos que contienen
        listaPedidos.forEach((pedido, nombrePedido) => {
            console.log(`Pedido de : ${nombrePedido}`);
            //Ok, mañana
            if (pedido.listaProductos.length===0) {
                console.log(">>>>>>>> Sin productos");
            } else{
                pedido.listaProductos.forEach((producto, i) => {
                    console.log(`\tProducto ${i + 1}: ${producto.nombre} - $ ${producto.precio}`);
                });
            }
            console.log(`\t> Total Acumulado: $ ${pedido.totalAcumulado}`);
            console.log("--------------------");//20
        });
        console.log("///////////////////////////////////");
    }
}
function mostrarPedido(listaPedidos, nombrePedido){
    console.log("\n//////////// PEDIDO ACTUAL ////////////");
    const pedido = listaPedidos.get(nombrePedido);
    console.log(`Pedido de : ${nombrePedido}`);
    
    if (pedido.listaProductos.length === 0) {
        console.log(">>>>>>>> Sin productos");
    } else {
        pedido.listaProductos.forEach((producto, i) => {
            console.log(`\tProducto ${i + 1}: ${producto.nombre} - $ ${producto.precio}`);
        });
    }
    console.log(`\t> Total Acumulado: $ ${pedido.totalAcumulado}`);
    console.log("--------------------");
    console.log("/////////////////////////////////////////");
}

/*******************************************************************/
/***********************   MÓDULO COCINA   *************************/
/*******************************************************************/

let estado = 0;

function mainCocina(){
    menuPrincipal();
}

function menuPrincipal(){
    console.log(" ");
    console.log("------------- COCINA ---------------");
    console.log("");
    console.log("1 - Mostrar productos");
    console.log("2 - Gestionar productos");
    console.log("3 - Mostrar promociones");
    console.log("4 - Busqueda");
    console.log("5 - Salir");

    rl.question("Seleccione una opcion ", (opcionMenu) => {
    if(opcionMenu == 1){
        mostrarProductosCocina();
        menuPrincipal();
    } else if(opcionMenu == 2){
        gestionarProductos();
    }else if(opcionMenu == 3){
        console.log(" ");
        console.log("--------PROMOCIONES---------");
        promociones.forEach((promocion, id) => {
            console.log(promocion.nombre);
        });
        menuPrincipal();
    } else if(opcionMenu == 4){
        filtros();
    }else if(opcionMenu == 5){
        // Regresar al super menú
    }
});
}

function filtros(){
    console.log("");
    console.log("--------- BUSQUEDA --------");
    console.log("");
    console.log("1 - Mostrar productos CAROS");
    console.log("2 - Mostrar productos BARATOS");
    console.log("3 - Buscar bebidas");
    console.log("4 - Buscar postres");
    console.log("5 - Buscar producto por coincidencia");
    console.log("6 - Buscar producto especifico");
    console.log("7 - Regresar");

    rl.question("Elija una opcion: ", (opcionBusqueda)=>{
        
        if(opcionBusqueda == 1){
            console.log(" ");
            console.log("----PRODUCTOS CAROS-----");
            const productosCaros = productos.filter(producto => producto.precio > 100);
            productosCaros.forEach((productos, indice)=> {
                console.log(indice+1, " ", productos.producto, " $", productos.precio);
            });
            rl.question("¿Desea editar algun producto? (si no)",(filtroEditar)=>{
                estado = 1;
                if(filtroEditar == "si"){
                    editarProducto(productosCaros);
                }else{
                    filtros();
                }
            });
            
        }else if(opcionBusqueda == 2){
            console.log(" ");
            console.log("----PRODUCTOS BARATOS----");
            const productosBaratos = productos.filter(producto => producto.precio <= 100);
            productosBaratos.forEach((productos, indice)=> {
                console.log(indice+1, " ", productos.producto, " $", productos.precio);
            });
            rl.question("¿Desea editar algun producto? (si no)",(filtroEditar)=>{
                estado = 1;
                if(filtroEditar == "si"){
                    editarProducto(productosBaratos);
                }else{
                    filtros();
                }
            });
        } else if(opcionBusqueda == 3){
            console.log(" ");
            console.log("----BEBIDAS----");
            const bebidas = productos.filter((productos) =>{
                return productos.tipo == "bebida";
            });
            bebidas.forEach((producto, indice)=> {
                console.log(indice+1, " ", producto.producto," $", producto.precio);
            });
            rl.question("¿Desea editar algun producto? (si no)",(filtroEditar)=>{
                estado = 1;
                if(filtroEditar == "si"){
                    editarProducto(bebidas);
                }else{
                    filtros();
                }
            });
        } else if(opcionBusqueda == 4){
            console.log(" ");
            console.log("-----POSTRES----");
            const postre = productos.filter((productos) =>{
                return productos.tipo == "postre";
            });
            postre.forEach((producto, indice)=> {
                console.log(indice+1, " ", producto.producto," $", producto.precio);
            });
            rl.question("¿Desea editar algun producto? (si no)",(filtroEditar)=>{
                estado = 1;
                if(filtroEditar == "si"){
                    editarProducto(postre);
                }else{
                    filtros();
                }
            });
        } else if(opcionBusqueda == 5){
            rl.question("Nombre del producto: ", (productoNoExacto)=>{
                const busquedaNoEx = productos.filter((producto)=>{
                    return producto.producto.includes(productoNoExacto);
                });
                if(busquedaNoEx.length > 0){
                    busquedaNoEx.forEach((producto, indice)=>{
                        console.log(indice + 1, " ", producto.producto, " $", producto.precio);
                    });
                }else{
                    console.log("No se encontraron productos");
                }
                filtros();
            });
        } else if(opcionBusqueda == 6){
            rl.question("Nombre exacto del producto: ", (productoExacto)=>{
                const busquedaEsp = productos.find((producto)=>{

                    return producto.producto == productoExacto;
                    
                });
                if(busquedaEsp){
                        console.log("producto: ", busquedaEsp.producto," $", busquedaEsp.precio);
                        filtros();
                    }else{
                        console.log("Producto no encontrado");
                        filtros();
                    }
            });
        } else if(opcionBusqueda == 7){
            menuPrincipal();
        }

    });

}

function mostrarProductosCocina(){
    console.log(" ");
    console.log("------------ PRODUCTOS -------------");
    productos.forEach((producto, indice) =>{
        console.log(indice + 1, " ", producto.producto, " : $", producto.precio);
    });

}

function agregarProducto(){
    console.log(" ");
    console.log("-------AGREGAR PRODUCTO--------");
    rl.question("¿Que producto desea agregar? ", (nuevoProducto) =>{
        rl.question("¿Cual es el precio del nuevo producto? ", (nuevoPrecio) => {
            rl.question("¿Cual es el tipo del nuevo producto? ", (nuevoTipo) => {
            const nuevoId = productos.length > 0 ? productos[productos.length-1].id + 1 : 1;
            productos.push({id: nuevoId, nombre: nuevoProducto, producto: nuevoProducto, precio: Number(nuevoPrecio), tipo: nuevoTipo});
            gestionarProductos(productos);
            });
        });
    });
    
}

function editarProducto(array){
    console.log(" ");
    console.log("------EDITAR PRODUCTOS-----");
    rl.question("¿Que producto desea editar? ", (posicionEditar)=>{
        console.log("1 - Editar nombre de el producto");
        console.log("2 - Editar precio de el producto");
        console.log("3 - Editar tipo de el producto");
        console.log("4 - Editar nombre y precio de el producto");
        console.log("5 - Regresar");

        rl.question("Seleccione una opción  ", (opcionEditar) =>{

            if(opcionEditar == 1){
                rl.question("Ingrese el nuevo nombre del producto: ", (nombreEditado) =>{
                    array[posicionEditar-1].producto = nombreEditado;
                    array[posicionEditar-1].nombre = nombreEditado;
                    rl.question("¿Desea editar otro producto? (si no)", (otroEditar) =>{
                        if(otroEditar == "si"){
                            editarProducto(array);
                        }else{
                            if(estado == 1){
                                filtros();
                            }else{
                                gestionarProductos();
                            }
                        }
                    });
                });
            } else if (opcionEditar == 2){
                rl.question("Ingrese el nuevo precio del producto: ", (precioEditado) =>{
                    array[posicionEditar-1].precio = Number(precioEditado);
                    rl.question("¿Desea editar otro producto? (si no)", (otroEditar) =>{
                        if(otroEditar == "si"){
                            editarProducto(array);
                        }else{
                            if(estado == 1){
                                filtros();
                            }else{
                                gestionarProductos();
                            }
                        }
                    });
                });
            } else if(opcionEditar == 3){
                rl.question("Ingrese el nuevo tipo del producto: ", (tipoEditado) =>{
                    array[posicionEditar-1].tipo = tipoEditado;
                    rl.question("¿Desea editar otro producto? (si no)", (otroEditar) =>{
                        if(otroEditar == "si"){
                            editarProducto(array);
                        }else{
                            if(estado == 1){
                                filtros();
                            }else{
                                gestionarProductos();
                            }
                        }
                    });
                });
            } else if(opcionEditar == 4){
                rl.question("Ingrese el nuevo nombre del producto: ", (nombreEditado) =>{
                    rl.question("Ingrese el nuevo precio del producto: ", (precioEditado) =>{
                        array[posicionEditar-1].producto = nombreEditado;
                        array[posicionEditar-1].nombre = nombreEditado;
                        array[posicionEditar-1].precio = Number(precioEditado);
                        rl.question("¿Desea editar otro producto? (si no)", (otroEditar) =>{
                            if(otroEditar == "si"){
                                editarProducto(array);
                            }else
                                if(estado == 1){
                                filtros();
                            }else{
                                gestionarProductos();
                            }
                            
                        });
                    });
                });
            } else if(opcionEditar == 5){
                if(estado == 1){
                    filtros();
                }else{
                    gestionarProductos();
                }
                
            }
        });
    });
}

function eliminarProducto(){
    console.log(" ");
    console.log("------ELIMINAR PRODUCTO-----");
    rl.question("¿Cual es el producto que desea eliminar? ", (posicionEliminar)=>{
        productos.splice(posicionEliminar-1, 1);
        gestionarProductos();
    });
}

function gestionarProductos(){
    console.log("");
    console.log("------------ GESTIONAR PRODUCTOS -------------");
    console.log("1 - Agregar producto");
    console.log("2 - Editar producto");
    console.log("3 - Eliminar producto");
    console.log("4 - Listar productos");
    console.log("5 - Regresar");

    rl.question("Seleccione una opcion: ", (opcionGestion) =>{
        if(opcionGestion == 1){
            agregarProducto();
        }else if(opcionGestion == 2){
            estado = 2;
            editarProducto(productos);
        } else if(opcionGestion == 3){
            eliminarProducto();
        } else if(opcionGestion == 4){
            mostrarProductosCocina();
            gestionarProductos(productos);
        } else if(opcionGestion == 5){
            menuPrincipal();
        }
    });

    
}
