const readline = require("readline");
/**********************/
async function main() {
    let SuperMenu;
    const listaProductos=[{nombreProducto: "Espresso", precio: 60, categoría: "bebida", id:1, stock: 0},
                            {nombreProducto: "Americano", precio: 50, categoría: "bebida", id:2, stock: 0},
                            {nombreProducto: "Capuccino", precio: 50, categoría: "bebida", id:3, stock: 0},
                            {nombreProducto: "Latte", precio: 70, categoría: "bebida", id:4, stock: 0},
                            {nombreProducto: "Mocha", precio: 30, categoría: "bebida", id:5, stock: 0},
                            {nombreProducto: "Pastel de Fresa", precio: 40, categoría: "postre", id:6, stock: 0},
                            {nombreProducto: "Pastel de Chocolate", precio: 40, categoría: "postre", id:7, stock: 0}
    ];

    const listaPedidos=new Map();

    //listaPedidos.set("nombrePedido",{listaProductosDelPedido: [], subtotal: 0, status: false, descripcion: ""});

    const listaPromociones=[{productoEnPromocion: listaProductos[0] , mensaje: `2x1 en ${listaProductos[0].nombreProducto}`},
                            {productoEnPromocion: listaProductos[1] , mensaje: `2x1 en ${listaProductos[1].nombreProducto}`},
                            {productoEnPromocion: listaProductos[2] , mensaje: `2x1 en ${listaProductos[2].nombreProducto}`}
    ];

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
            
        }
        if (SuperMenu==2) {
            await mainCocina(listaProductos, listaPedidos, "emi")
        }
        if (SuperMenu==3) {
            await mainCliente(listaProductos, listaPedidos, listaPromociones);
        }
    } while (SuperMenu!=0);
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


















async function mainCliente(listaProductos, listaPedidos, listaPromociones) {
    let opcionCliente;

    do {
        menuCliente();  
        do {
            opcionCliente = await preguntar("\nElija una opción: ");
            //Validacion que no sea extremadamente largo
            if (opcionCliente<0 || opcionCliente>4) {
                console.log(">>>>>>>> ERROR: Ingrese una opción válida <<<<<<<<");
            }
        } while (opcionCliente<0 || opcionCliente>4);
        console.log("==============================")
        if (opcionCliente==0) {
            console.log("\n>>>>>>>> Ha salido exitosamente del programa <<<<<<<<\n")
        }
        if (opcionCliente==1) {
            mostrarProductos(listaProductos);
        }
        if (opcionCliente==2) {
            await solicitarPedido(listaPedidos, listaProductos,listaPromociones);
        }
        if (opcionCliente==3) {
            mostrarPedidos(listaPedidos);
        }
        if (opcionCliente==4) {
            mostrarPromociones(listaPromociones);
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
    console.log("\t4.- Ver promociones");
    console.log("\t0.- Salir/Volver al Menú Principal");
}
function menuEdicionCliente(){
    console.log("\n^^^^^^^^ MENÚ EDICIÓN CLIENTE ^^^^^^^^");
    console.log("\t1.- Agregar Producto");
    console.log("\t2.- Eliminar Producto");
    console.log("\t3.- Ver Pedido");
    console.log("\t0.- Salir/Volver al Menú Principal");
}
/*function preguntar(pregunta) {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    return new Promise(resolve => {
        rl.question(pregunta, respuesta => {
            rl.close();
            resolve(respuesta);
        });
    });
}
*/

//
function preguntar(pregunta) {
    return new Promise(resolve => {
        rl.question(pregunta, respuesta => {
            rl.close();
            resolve(respuesta);
        });
    });
}




//
function mostrarProductos(array){
    console.log("\n//////////// PRODUCTOS ////////////");
    array.forEach((producto, i) => {
        console.log(`${i+1} : ${producto.nombreProducto} - Precio: $ ${producto.precio}`);
                //  1 : Espresso - Precio $ 60
    });
    console.log(  "///////////////////////////////////");
}
async function solicitarPedido(listaPedidos, listaProductos, listaPromociones){
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
    listaPedidos.set(nuevoPedido, {listaProductosDelPedido: [], subtotal: 0, status:false, descripcion: ""});
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
    aplicarPromociones(listaPedidos,listaPromociones,nuevoPedido);
    await editarPedido(listaPedidos,listaProductos, nuevoPedido);
    listaPedidos.get(nuevoPedido).descripcion="Pedido Recibido";
    console.log("\n>>>>>>>> Pedido Recibido exitosamente  <<<<<<<<\n")
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
                        if (eleccionProducto<0 || eleccionProducto>listaPedidos.get(nombrePedido).listaProductosDelPedido.length) {
                            console.log(">>>>>>>> ERROR: Escriba un producto válido <<<<<<<<");
                        }
                    } while (eleccionProducto<0 || eleccionProducto>listaPedidos.get(nombrePedido).listaProductosDelPedido.length);
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
    listaPedidos.get(nombrePedido).listaProductosDelPedido.push(listaProductos[idProducto]);
    listaPedidos.get(nombrePedido).subtotal = listaPedidos.get(nombrePedido).listaProductosDelPedido.reduce((subtotal, producto) =>{
        return subtotal + producto.precio;
    },0);
    console.log(`\n>>>>>>>> Se ha añadido exitosamente ${listaProductos[idProducto].nombreProducto} <<<<<<<<\n`)
}
function eliminarAlPedido(listaPedidos, nombrePedido, idProducto){
    console.log(`\n>>>>>>>> Se ha eliminado exitosamente ${listaPedidos.get(nombrePedido).listaProductosDelPedido[idProducto].nombreProducto} <<<<<<<<\n`);
    const pedido = listaPedidos.get(nombrePedido);
    pedido.listaProductosDelPedido.splice(idProducto,1);
    pedido.subtotal=pedido.listaProductosDelPedido.reduce((subtotal,producto)=>{
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
            if (pedido.listaProductosDelPedido.length===0) {
                console.log(">>>>>>>> Sin productos");
            } else{
                pedido.listaProductosDelPedido.forEach((producto, i) => {
                    if (producto.precio == 0) {
                        console.log(`\tProducto ${i + 1}: ${producto.nombreProducto} - $ ${producto.precio} - % promoción aplicada automáticamente`);
                    } else {
                        console.log(`\tProducto ${i + 1}: ${producto.nombreProducto} - $ ${producto.precio}`);
                    }
                });
            }
            console.log(`\t> Total Acumulado: $ ${pedido.subtotal}`);
            console.log(` Estatus: ${pedido.descripcion}`);
            console.log("--------------------");//20




        });
        console.log("///////////////////////////////////");
    }
}
function mostrarPedido(listaPedidos, nombrePedido){
    console.log("\n//////////// PEDIDO ACTUAL ////////////");
    const pedido = listaPedidos.get(nombrePedido);
    console.log(`Pedido de : ${nombrePedido}`);
    
    if (pedido.listaProductosDelPedido.length === 0) {
        console.log(">>>>>>>> Sin productos");
    } else {
        pedido.listaProductosDelPedido.forEach((producto, i) => {
            if (producto.precio == 0) {
                console.log(`\tProducto ${i + 1}: ${producto.nombreProducto} - $ ${producto.precio} - % promoción aplicada automáticamente`);
            } else {
                console.log(`\tProducto ${i + 1}: ${producto.nombreProducto} - $ ${producto.precio}`);
            }
        });
    }
    console.log(`\t> Total Acumulado: $ ${pedido.subtotal}`);
    console.log("--------------------");
    console.log("/////////////////////////////////////////");
}

function mostrarPromociones(listaPromociones){
    console.log("\n% % % % PROMOCIONES % % % %");
    if (listaPromociones.length === 0) {
        console.log("\t>>>>>>>> No hay promociones disponibles <<<<<<<<");
        console.log("% % % % % % % % % % % % % %");
    } else {
        listaPromociones.forEach((promocion) => {
            const producto = promocion.productoEnPromocion;
            console.log(`\t${promocion.mensaje}`);
            console.log("--------------------");
        });
        console.log("% % % % % % % % % % % % % %");
    }
}

//////////////////////////
function aplicarPromociones(listaPedidos, listaPromociones, nombrePedido){
    const pedido = listaPedidos.get(nombrePedido);

    //coincidencias entre promociones y productos^2
    listaPromociones.forEach(promo => {
        const productoEnPromocion = promo.productoEnPromocion;
        pedido.listaProductosDelPedido.forEach(producto => {
        // Producto original a gratis y quitamos su precio
            if (producto.id === productoEnPromocion.id) {
                const productoGratis = {nombreProducto: productoEnPromocion.nombreProducto , precio: productoEnPromocion.precio, categoria: productoEnPromocion.categoria, id:productoEnPromocion.id, stock: productoEnPromocion.stock};
                productoGratis.precio=0;
                pedido.listaProductosDelPedido.push(productoGratis);
            }
        });
    });
    //recalcular otra vez
    pedido.subtotal = pedido.listaProductosDelPedido.reduce((subtotal, producto) => {
        return subtotal + producto.precio;
    }, 0);
}







































function menuCocina() {
    console.log(" ");
    console.log("------------- COCINA ---------------");
    console.log("");
    console.log("1 - Mostrar productos");
    console.log("2 - Gestionar productos");
    console.log("3 - Mostrar promociones");
    console.log("4 - Busqueda");
    console.log("5 - Procesar pedido");
    console.log("6 - Salir");
}

function menuGestionarProductos(){
    console.log("");
    console.log("------------ GESTIONAR PRODUCTOS -------------");
    console.log("1 - Agregar producto");
    console.log("2 - Editar producto");
    console.log("3 - Eliminar producto");
    console.log("4 - Listar productos");
    console.log("5 - Regresar");
}

function menuEditarProducto(){
    console.log("1 - Editar nombre de el producto");
    console.log("2 - Editar precio de el producto");
    console.log("3 - Editar categoria de el producto");
    console.log("4 - Editar id de el producto");
    console.log("5 - Editar stock de el producto");
    console.log("6 - Regresar");

}

function menuBusqueda(){
    console.log("");
    console.log("--------- BUSQUEDA --------");
    console.log("");
    console.log("1 - Mostrar productos CAROS");
    console.log("2 - Mostrar productos BARATOS");
    console.log("3 - Buscar bebidas");
    console.log("4 - Buscar postres");
    console.log("5 - Buscar producto por coincidencia");
    console.log("6 - Buscar producto por ID");
    console.log("7 - Regresar");
}

function mostrarPromocionesCocina(){
    listaPromociones.forEach((promocion, id)=>{
        console.log(id, " ",promocion.mensaje);
    });
}

function mostrarProductosCocina(array){
    console.log(" ");
    console.log("------------ PRODUCTOS -------------");
    array.forEach((producto) =>{
        console.log(producto.id, " ", producto.nombreProducto, " : $", producto.precio, "| Categoria:", producto.categoría, "| Stock:", producto.stock);
    });

}

async function agregarProducto(array){
    console.log(" ");
    console.log("-------AGREGAR PRODUCTO--------");
    let nuevoProducto = await preguntar("Introduce el nombre del producto: ");
    let nuevoPrecio = await preguntar("Introduce el precio del producto: ");
    let nuevoTipo = await preguntar("Introduce el tipo del producto: ");
    let nuevoId = await preguntar("Introduce el id del producto: ");
    let nuevoStock = await preguntar("Introduce el stock del producto: ");
    
    array.push({nombreProducto: nuevoProducto, precio: Number(nuevoPrecio), categoría: nuevoTipo, id: Number(nuevoId), stock: Number(nuevoStock)});

    console.log("---- PRODUCTO AGREGADO ----");
    console.log(" ");
    console.log(Number(nuevoId), " ",nuevoProducto, " : $", Number(nuevoPrecio), " ", nuevoTipo, " ", Number(nuevoStock));
    console.log("-----------------------------------------");
}

function preguntar(pregunta) {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolve(respuesta);
        });
    });
}

async function editarProducto(array) {
    console.log(" ");
    console.log("------EDITAR PRODUCTOS-----");
    console.log(" ");
    let opcionEditar;
    let posicionEditar;
    do{
        
        menuEditarProducto();
        opcionEditar = await preguntar("Seleccione una opción: ");

        if(opcionEditar<1 || opcionEditar >6){
            console.log("xx - OPCIÓN NO VALIDA - xx");
        } else {
            mostrarProductosCocina(array);
            console.log(" ");
            if(opcionEditar == 1){
                posicionEditar = await preguntar("¿Que producto desea editar?");

                let productoEditar = array.find((producto)=>{
                    return producto.id == posicionEditar;   
                });

                if(productoEditar){
                    let nombreEditado = await preguntar("Ingrese el nuevo nombre del producto: ");
                    productoEditar.nombreProducto = nombreEditado;
                    
                    console.log(" ");
                    console.log("---------------------------");
                    console.log(productoEditar.id," ",productoEditar.nombreProducto, " : $", productoEditar.precio, " |Categoria: ",productoEditar.categoría, "| Stock:", productoEditar.stock);
                    console.log(" ");

                }else{
                    console.log("No se encontro el ID");
                }
                
                //EDITAR LAS DEMAS OPCIONES  Y AÑADIR STOCK Y ID---
            }else if(opcionEditar == 2){
                posicionEditar = await preguntar("¿Que producto desea editar?");

                
                let productoEditar = array.find((producto)=>{
                    return producto.id == posicionEditar;   
                });

                if(productoEditar){
                    let precioEditado = await preguntar("Ingrese el nuevo precio del producto: ");
                    productoEditar.precio = Number(precioEditado);
                    
                    console.log(" ");
                    console.log("---------------------------");
                    console.log(productoEditar.id," ",productoEditar.nombreProducto, " : $", productoEditar.precio, " |Categoria: ",productoEditar.categoría, "| Stock:", productoEditar.stock);
                    console.log(" ");

                }else{
                    console.log("No se encontro el ID");
                }

            }else if(opcionEditar == 3){
                posicionEditar = await preguntar("¿Que producto desea editar?");

                let productoEditar = array.find((producto)=>{
                    return producto.id == posicionEditar;   
                });

                if(productoEditar){
                    let tipoEditado = await preguntar("Ingrese la nueva categoría del producto: ");
                    productoEditar.categoría = tipoEditado;
                    
                    console.log(" ");
                    console.log("---------------------------");
                    console.log(productoEditar.id," ",productoEditar.nombreProducto, " : $", productoEditar.precio, " |Categoria: ",productoEditar.categoría, "| Stock:", productoEditar.stock);
                    console.log(" ");

                }else{
                    console.log("No se encontro el ID");
                }
            }else if(opcionEditar == 4){
                posicionEditar = await preguntar("¿Que producto desea editar?");

                let productoEditar = array.find((producto)=>{
                    return producto.id == posicionEditar;   
                });

                if(productoEditar){
                    let idEditado = await preguntar("Ingrese el nuevo id del producto: ");
                    productoEditar.id = Number(idEditado);
                    
                    console.log(" ");
                    console.log("---------------------------");
                    console.log(productoEditar.id," ",productoEditar.nombreProducto, " : $", productoEditar.precio, " |Categoria: ",productoEditar.categoría, "| Stock:", productoEditar.stock);
                    console.log(" ");

                }else{
                    console.log("No se encontro el ID");
                }
                
            }else if(opcionEditar == 5){
                posicionEditar = await preguntar("¿Que producto desea editar?");

                let productoEditar = array.find((producto)=>{
                    return producto.id == posicionEditar;   
                });

                if(productoEditar){
                    let stockEditado = await preguntar("Ingrese el nuevo stock del producto: ");
                    productoEditar.stock = Number(stockEditado);
                    
                    console.log(" ");
                    console.log("---------------------------");
                    console.log(productoEditar.id," ",productoEditar.nombreProducto, " : $", productoEditar.precio, " |Categoria: ",productoEditar.categoría, "| Stock:", productoEditar.stock);
                    console.log(" ");

                }else{
                    console.log("No se encontro el ID");
                }
                
            }
        }
    }while(opcionEditar != 6);
}

async function eliminarProducto(array) {
    console.log(" ");
    console.log("------ELIMINAR PRODUCTO-----");
    mostrarProductosCocina(array);
    console.log(" ");
    let productoEliminar = await preguntar("¿Cual es el producto que desea eliminar? ");

    let posicionEliminar = array.findIndex((producto)=>{
        return producto.id == productoEliminar;   
    });

    if(posicionEliminar != -1){
        array.splice(posicionEliminar, 1);
        console.log("----- Se elimino el producto ----");

    }else{
        console.log("No se encontro el ID");
    }

}

async function gestionarProductos(array) {
    let opcionGestion;
    console.log("-------GESTIONAR PRODUCTOS--------");
    do{
        menuGestionarProductos();
        console.log(" ");
        opcionGestion = await preguntar("Selecciona una opcion: ");
         if(opcionGestion<1 || opcionGestion >5){
            console.log("---------------");
            console.log("xx - OPCIÓN NO VALIDA - xx");
            console.log("---------------");
        } else if(opcionGestion == 1){
            await agregarProducto(array);
        } else if(opcionGestion == 2){
            await editarProducto(array);
        } else if(opcionGestion == 3){
            await eliminarProducto(array);
        } else if(opcionGestion == 4){
            mostrarProductosCocina(array);
        }
    }while(opcionGestion != 5);
}

async function filtros(array) {
    let opcionBusqueda;
    do{
        menuBusqueda();
        opcionBusqueda = await preguntar("Elija una opcion:");
        if(opcionBusqueda<1 || opcionBusqueda >7){
            console.log("xx - OPCIÓN NO VALIDA - xx");
        } else if(opcionBusqueda == 1){
            console.log(" ");
            console.log("----PRODUCTOS CAROS-----");

            const productosCaros = array.filter(producto => producto.precio > 100);
            productosCaros.forEach((productos, indice)=> {
                console.log(productos.id, " ", productos.nombreProducto, " $", productos.precio);
            });

            if(productosCaros.length>0){
                let filtroEditar = await preguntar("¿Desea editar algun producto? (si/no)");
                //estado = 1;
                if(filtroEditar == "si"){
                    await editarProducto(productosCaros);
                }
            }else{
                console.log("No se encontraron productos");
            }
            
            //EDITAR LAS DEMAS OPCIONES

        } else if(opcionBusqueda == 2){
            console.log(" ");
            console.log("----PRODUCTOS BARATOS----");

            const productosBaratos = array.filter(producto => producto.precio <= 100);
            productosBaratos.forEach((productos, indice)=> {
                console.log(productos.id, " ", productos.nombreProducto, " $", productos.precio);
            });

            if(productosBaratos.length>0){
                let filtroEditar = await preguntar("¿Desea editar algun producto? (si/no)");
                
                if(filtroEditar == "si"){
                    await editarProducto(productosBaratos);
                }
            }else{
                console.log("No se encontraron productos");
            }

        } else if(opcionBusqueda == 3){
            console.log(" ");
            console.log("----BEBIDAS----");
            const bebidas = array.filter((productos) =>{
                return productos.categoría == "bebida";
            });
            bebidas.forEach((producto, indice)=> {
                console.log(producto.id, " ", producto.nombreProducto, " $", producto.precio);
            });

            if(bebidas.length>0){
                let filtroEditar = await preguntar("¿Desea editar algun producto? (si/no)");
                
                if(filtroEditar == "si"){
                    await editarProducto(bebidas);
                }
            }else{
                console.log("No se encontraron productos");
            }
            
        } else if(opcionBusqueda == 4){
            console.log(" ");
            console.log("-----POSTRES----");
            const postre = array.filter((productos) =>{
                return productos.categoría == "postre";
            });
            postre.forEach((producto, indice)=> {
                console.log(producto.id, " ", producto.nombreProducto, " $", producto.precio);
            });
            if(postre.length>0){
                let filtroEditar = await preguntar("¿Desea editar algun producto? (si/no)");
                
                if(filtroEditar == "si"){
                    await editarProducto(postre);
                }
            }else{
                console.log("No se encontraron productos");
            }

        } else if(opcionBusqueda == 5){
            let nombreBusqueda = await preguntar("Nombre del producto: ");
            const busquedaProducto = array.filter((producto)=>{
                    return producto.nombreProducto.toLocaleLowerCase().includes(nombreBusqueda.toLocaleLowerCase());
                });
                if(busquedaProducto.length > 0){
                    busquedaProducto.forEach((producto, indice)=>{
                        console.log(producto.id, " ", producto.nombreProducto, " $", producto.precio);
                    });
                    let filtroEditar = await preguntar("¿Desea editar algun producto? (si/no)");
                    if(filtroEditar == "si"){
                        await editarProducto(busquedaProducto);
                    }
                }else{
                    console.log("No se encontraron productos");
                }
        } else if(opcionBusqueda == 6){
            let busquedaId = await preguntar("Ingrese el id: ");
            let productoID = array.find((producto)=>{
                return producto.id == busquedaId;
            });
            if(productoID){
                console.log(productoID.id, " ",productoID.nombreProducto, ":$",productoID.precio);
            }else{
                console.log("No se encontraron productos");
            }
        }

    }while(opcionBusqueda != 7)
}

async function mainCocina(array, listaPedidos, nombrePedido) {
    let opcionCocina;
    do{
        menuCocina();
        opcionCocina = await preguntar("Seleccione una opción: ");
        if(opcionCocina<1 || opcionCocina >6){
            console.log("xx - OPCIÓN NO VALIDA - xx");
        } else if(opcionCocina == 1){
            mostrarProductosCocina(array);
        } else if(opcionCocina == 2){
            await gestionarProductos(array);
        } else if(opcionCocina == 3){
            mostrarPromocionesCocina();
        } else if(opcionCocina == 4){
            await filtros(array);
        } else if(opcionCocina == 5){
            await statusPedido(listaPedidos, nombrePedido);
        } 

    }while(opcionCocina != 6)
}


function prepararPedidio(nombrePedido){
    return new Promise ((resolve, reject) =>{
        console.log("------------");
        console.log("Preparando pedido de: ",  nombrePedido);
        console.log("------------");

        setTimeout(() =>{
            let resultado = Math.floor(Math.random()*3);
            if(resultado == 0){
                reject("Error en cocina");
            }else if(resultado == 1){
                reject("Falta de ingredientes");
            }else{
                resolve("Exito");
            }
        }, 4000);

    });
}

async function statusPedido(listaPedidos, nombrePedido) {
    let pedido = listaPedidos.get(nombrePedido);
    if(!pedido){
        console.log("No se encontro el pedido");
        return;
    }
    try {
        let resultado = await prepararPedidio(nombrePedido);
        pedido.status = true;
        console.log(resultado);
        console.log("El pedido se hizo con exito");
    } catch (error) {
        pedido.status = false;
        console.log("El pedido tuvo un problema");
        console.log(error);
    }
    console.log(pedido.status);
}


