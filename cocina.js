//Lista de productos
const productos = ["Espresso", "americano", "cappuccino", "latte", "mocha" ];
//Para poder leer cosas en consola
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Imprime el menú una sola vez
console.log("------------- COCINA ---------------");
console.log("");

//Enlista los prodctos dentro de la lista
productos.forEach((productos, indice) =>{
    console.log(indice + 1, " " + productos);
});
console.log("");
console.log("1 - Agregar producto");
console.log("2 - Editar producto");
console.log("3 - Eliminar producto");
console.log("4 - Ver productos");
console.log("");
//Pregunta al usuario
rl.question("Elija una opción", (opcion)=>{
    if(opcion == 1){
        rl.question("¿Que desea agregar?",(p)=>{
            productos.push(p);
            productos.forEach((productos, indice) =>{
            console.log(indice + 1, " " + productos);
            });
            rl.close();
        });
    
    } else
    if(opcion == 2){
        rl.question("¿Cual es la posicion del producto a editar?",(po)=>{
            rl.question("¿Cual es el nuevo producto?",(nuevo)=>{
                productos[po] = nuevo;
                productos.forEach((productos, indice) =>{
                    console.log(indice + 1, " " + productos);
                });
            rl.close();
            });
        });
    }
    else
    if(opcion == 3){
        rl.question("¿Cual es la posicion del producto a eliminar?",(el)=>{
            productos.splice(el, 1);
            productos.forEach((productos, indice) =>{
            console.log(indice + 1, " " + productos);
            });
            rl.close();
        });
    }
    else
    if(opcion == 4){
        console.log("MENÚ");
        console.log("");
        productos.forEach((productos, indice) =>{
            console.log(indice + 1, " " + productos);
        });
        rl.close();
    }
});