/*const { rejects } = require('assert');
const { resolve } = require('dns');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});*/

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const listaProductos=[{nombreProducto: "Espresso", precio: 100, categoría: "bebida", id:1, stock: 0},
                    {nombreProducto: "Americano", precio: 50, categoría: "bebida", id:2, stock: 0},
                    {nombreProducto: "Cappuccino", precio: 89, categoría: "bebida", id:3, stock: 0},
                    {nombreProducto: "Pastel de fresa", precio: 35, categoría: "postre", id:4, stock: 0},
                    {nombreProducto: "Pastel de chocolate", precio: 150, categoría: "bebida", id:5, stock: 0}
];

const listaPedidos=new Map();

listaPedidos.set("Jenny",{listaProductosDelPedido: [1, 2, 3], subtotal: 130, status: false, descripcion: ""});

const listaPromociones=[{productoEnPromocion: 1 , mensaje: "2x1 en Espresso"}];

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

function mostrarPromociones(){
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
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
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

                /*let precioEditado = await preguntar("Ingrese el nuevo precio del producto: ");
                array[posicionEditar-1].precio = Number(precioEditado);

                console.log(" ");
                console.log("---------------------------");
                console.log(array[posicionEditar-1].producto, " : $", array[posicionEditar-1].precio, " Tipo: ", array[posicionEditar-1].tipo);
                console.log(" ");*/

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

                /*let tipoEditado = await preguntar("Ingrese la nueva categoría del producto: ");
                array[posicionEditar-1].tipo = tipoEditado;

                console.log(" ");
                console.log("---------------------------");
                console.log(array[posicionEditar-1].producto, " : $", array[posicionEditar-1].precio, " Tipo: ", array[posicionEditar-1].tipo);
                console.log(" ");*/
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

async function mainCocina(array, nombrePedido) {
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
            mostrarPromociones();
        } else if(opcionCocina == 4){
            await filtros(array);
        } else if(opcionCocina == 5){
            await statusPedido(nombrePedido);
        } 

    }while(opcionCocina != 6)
        rl.close();
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

async function statusPedido(nombrePedido) {
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


async function prueba() {
    await mainCocina(listaProductos, "Jenny");
}

prueba();