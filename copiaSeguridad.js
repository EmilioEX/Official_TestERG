/*const listaPedidos={};
function main(){
    listaPedidos["NombreLista"]={listaProductos: [], TotalAcumulado: 0};
    listaPedidos["NombreLista"].listaProductos.push({nombreProducto: "Espresso", precio: 60});
    console.log(listaPedidos);
    console.log(listaPedidos["NombreLista"].listaProductos);
}
main();
*/
const listaProductos=[{nombreProducto: "Espresso", precio: 1, categoría: "bebida", id:1, stock: 0},
                            {nombreProducto: "Americano", precio: 1, categoría: "bebida", id:2, stock: 0},
                            {nombreProducto: "Capuccino", precio: 1, categoría: "bebida", id:3, stock: 0},
                            {nombreProducto: "Latte", precio: 1, categoría: "bebida", id:4, stock: 0},
                            {nombreProducto: "Mocha", precio: 1, categoría: "bebida", id:5, stock: 0},
                            {nombreProducto: "Pastel de Fresa", precio: 1, categoría: "postre", id:6, stock: 0},
                            {nombreProducto: "Pastel de Chocolate", precio: 1, categoría: "postre", id:7, stock: 0}
    ];

    const listaPedidos=new Map();

    //listaPedidos.set("nombrePedido",{listaProductosDelPedido: [], subtotal: 0, status: false, descripcion: ""});

    const listaPromociones=[{productoEnPromocion: listaProductos[0] , mensaje: "2x1 en ..."}];
const readline = require("readline");

async function main() {
    let opcionCliente;
    const promociones= new Map();
    listaPedidos.set(nuevoPedido, {listaProductos: [],totalAcumulado: 0});
    promociones.set("Promoción1", {nombre: "2x1 Capuccino", producto: listaProductos[0].nombre});
    const listaPedidos = new Map();
    const listaProductos=[{nombre: "Espresso", precio: 60},
                    {nombre: "Americano", precio: 50},
                    {nombre: "Cappuccino", precio: 55},
                    {nombre: "Latte", precio: 70},
                    {nombre: "Mocha", precio: 30}
    ];
    /*listaPedidos.set("NombrePedido", {listaProductos: [],totalAcumulado: 0});//En total Acumulado sería el "subtotal", es decir la suma de todo el pedido

    // Agregar producto
    listaPedidos.get("NombrePedido").listaProductos.push({nombreProducto: "Espresso",precio: 60});

    console.log(listaPedidos);
    console.log(listaPedidos.get("NombrePedido").listaProductos);
    menuCliente();
    mostrarProductos(productos);*/
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

main();
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
function preguntar(pregunta) {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});

    return new Promise(resolve => {
        rl.question(pregunta, respuesta => {
            rl.close();
            resolve(respuesta);
        });
    });
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
    console.log(`\n>>>>>>>> Se ha eliminado exitosamente ${listaPedidos.get(nombrePedido).listaProductos[idProducto].nombre} <<<<<<<<\n`)
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