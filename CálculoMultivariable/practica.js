//Es la forma de acceder al módulo (librería), y la única forma de acceder a ella es con una referencia
const readline =  require("readline");

//let rl;
//Crea una instancia en la que existen eventos de infresar desde el teclado y mostrar en terminal
/*
rl=readline.createInterface({input: process.stdin,output: process.stdout});
//Cuando se presiona "enter"  
rl.question("Ingresa algo: ", (nombre)=>{
    console.log("Hola", nombre)
    rl.question("Pregunta: ", (algo)=>{
        console.log("Algo", algo)
        rl.close();
    });
});
*/

function preguntar(pregunta){
    const rl= readline.createInterface({input: process.stdin, output: process.stdout});
    return new Promise (resolve=> { 
        rl.question(`${pregunta}`, (algo)=>{
            console.log(algo);
            console.log(algo);
            console.log(algo);
        });
        rl.close();
    });
}

const listaPedidos=new Map();


listaPedidos.set("Hola", 1);
listaPedidos.set("aloH", 2);

for (const [clave,valor] of listaPedidos) {
    console.log(`${clave}, ${valor}`);
    
}

const numeros=[10,20,30];

const [a,,c]=numeros;

console.log(a,c)
const Total = {
  dinero: 500,
  puntos: 20,
  nivel: 3
};

const { diner } = Total;

console.log(`${diner}`);



const numerales  = [10,20,30,40];
//Nombras nuevo arreglo, arregloa filtrar, elemento-objeto => condicion
const array=numerales.filter(n => n>20);
console.log(array);
//Solo el primer valor que coincida en orden
const array2=numerales.find(n => n>20);
console.log(array2);

preguntar("Qué tal?");
