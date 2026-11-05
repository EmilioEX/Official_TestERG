//Obtenemos los elementos de insercion de datos del html a traves del id
const raster =document.getElementById('contenedor-raster');
const tamanio=document.getElementById('raster-tamanio');
const generar=document.getElementById('btn-generar');
const btnDegradar=document.getElementById('btn-degradar');
const btnOrdenar=document.getElementById('btn-ordenar');
const barra=document.getElementById('contenedor-barra');
const maximo=document.getElementById('maximo');
const minimo=document.getElementById('minimo');

const positionX = document.getElementById('positionX');
const positionY = document.getElementById('positionY');
const positionZ = document.getElementById('positionZ');

/*Selectores*/
const selectorModo= document.getElementById('selector-modo');
const modoExacto= document.getElementById('modo-exacto');
const modoRango= document.getElementById('modo-rango');
const btnRestaurar=document.getElementById('btn-restaurar');

const inputzExacta=document.getElementById('z-exacta');
const inputzMin=document.getElementById('z-min');
const inputzMax=document.getElementById('z-max');

const interpolacion=document.getElementById('interpolacion');
//Casilla: al hacer clic en un río se muestra la cuenca de ese punto (desactivada por defecto)
const cuencaPorClic=document.getElementById('cuenca-por-clic');

const btnParteaguas = document.getElementById('btn-parteaguas');
const tipoTerreno = document.getElementById('tipo-terreno');

//Ríos en el modo Random: pon true para verlos o false para ocultarlos.
//En el Mapa 1 los ríos siempre se muestran (opción predefinida).
const MOSTRAR_RIOS_EN_RANDOM = false;

//Celdas seleccionadas
let celdaSeleccionada= null;
let colorSeleccionado=null;



function main(){
    //cuando hacemos click en generar, rehacemos el raster
    generar.addEventListener('click', generarRaster);
    //Colocamos en 0's la busqueda de una celda por el modo exacto o el rango
    btnRestaurar.addEventListener('click', restaurarCeldas);
    //Aplicamos al raster un degradado de mayor a menor (se genera siempre el "mismo")
    btnDegradar.addEventListener('click', aplicarDegradado);
    //Ordenamos el raster actual de mayor a menor
    btnOrdenar.addEventListener('click', ordenarMayorAMenor);
    //Ejecutamos una interpolacion para hacer  un "degradado" a los colores
    interpolacion.addEventListener('change', ejecutarInterpolacion);
    //Evento de seleccion de celda (única)
    raster.addEventListener('click',(evento)=>{
        const celdaClick=evento.target;

        if(!celdaClick.classList.contains('celda')) return;
        // --- CUENCA DEL PUNTO (solo si la casilla está activada) ---
        // Con la casilla desactivada, un río se selecciona como cualquier otra celda
        if (cuencaPorClic.checked && celdaClick.dataset.esRio === "true") {
            delimitarCuencaDesdeRio(celdaClick);
            return;
        }
        if(celdaSeleccionada) {
            celdaSeleccionada.classList.remove('seleccionada');
            if (colorSeleccionado) {
                colorSeleccionado.classList.remove('seleccionada');  
            }
        }
        //La celda seleccionada se vuelve a la que le hacemos click
        celdaSeleccionada=celdaClick;
        //Le agregamos estilos de celda seleccionada
        celdaSeleccionada.classList.add('seleccionada');

        //Guardamos los valores de las coordenadas de esa celda
        const x= celdaSeleccionada.dataset.x;
        const y= celdaSeleccionada.dataset.y;
        const z= celdaSeleccionada.dataset.z;

        //Y los mostramos en los inputs
        positionX.value= `${x}`;
        positionY.value= `${y}`;
        positionZ.value=`${z}`;

    });
    //Evento de seleccion de color para celda
    barra.addEventListener('click', (evento) =>{
        const colorClick= evento.target;

        
        if(!colorClick.classList.contains('celda')) return;

        if (colorSeleccionado) {
            colorSeleccionado.classList.remove('seleccionada');  
        }
        if(!celdaSeleccionada){
            alert("Por favor, selecciona primero una celda en el raster para poder cambiar el color");
            return;
        }
        colorSeleccionado=colorClick;
        colorSeleccionado.classList.add('seleccionada');
        const nuevaZ=parseInt(colorClick.dataset.min)+numeroAleatorio10();
        celdaSeleccionada.dataset.z=nuevaZ;
        celdaSeleccionada.style.backgroundColor=numeroAColor(nuevaZ);
        let size = parseInt(tamanio.value);
        if (size <= 30) {
            celdaSeleccionada.textContent = nuevaZ;
        }
        positionZ.value=nuevaZ;
        calcularExtremos();
        buscarCeldas();
    });
    positionY.addEventListener('change', (evento) =>{
        let size = parseInt(tamanio.value);
        let nuevoY=parseInt(evento.target.value);
        let actualX=parseInt(positionX.value);
        if(isNaN(nuevoY) || isNaN(actualX)){
            return;
        }

        if (nuevoY<0) nuevoY=0;
        if (nuevoY>(size-1)) nuevoY=size-1;

        positionY.value=nuevoY;
        const celdaNueva= raster.querySelector(`[data-x="${actualX}"][data-y="${nuevoY}"]`);
        if(celdaSeleccionada){
            celdaSeleccionada.classList.remove('seleccionada');
        }
        celdaSeleccionada=celdaNueva;
        celdaSeleccionada.classList.add('seleccionada');
        positionZ.value=`${celdaSeleccionada.dataset.z}`;
    });
    positionX.addEventListener('change', (evento) =>{
        let size = parseInt(tamanio.value);
        let nuevoX=parseInt(evento.target.value);
        let actualY=parseInt(positionY.value);
        if(isNaN(nuevoX) || isNaN(actualY)){
            return;
        }

        if (nuevoX<0) nuevoX=0;
        if (nuevoX>(size-1)) nuevoX=size-1;

        positionX.value=nuevoX;
        const celdaNueva= raster.querySelector(`[data-x="${nuevoX}"][data-y="${actualY}"]`);
        if(celdaSeleccionada){
            celdaSeleccionada.classList.remove('seleccionada');
        }
        celdaSeleccionada=celdaNueva;
        celdaSeleccionada.classList.add('seleccionada');
        positionZ.value=`${celdaSeleccionada.dataset.z}`;
    });
    positionZ.addEventListener('change', (evento) =>{
        let size=parseInt(tamanio.value);
        const actualX=parseInt(positionX.value);
        const actualY=parseInt(positionY.value);
        let nuevoZ=parseInt(evento.target.value);
        if (isNaN(actualX) ||isNaN(actualY) || !celdaSeleccionada) {
            alert("Seleccione una posición válida antes de elegir un valor z")
            return;
        }
        if (isNaN(nuevoZ)||nuevoZ<0||nuevoZ>100) {
            positionZ.value=null;
            alert("Seleccione una z válida")
            return;
        }
        celdaSeleccionada.dataset.z=nuevoZ;
        celdaSeleccionada.style.backgroundColor=numeroAColor(nuevoZ);
        if (size <= 30) {
            celdaSeleccionada.textContent = nuevoZ;
        }
        calcularExtremos();
    });
    selectorModo.addEventListener('change', (evento) =>{
        const modoSeleccionado=evento.target.value;

        if (modoSeleccionado=="exacto") {
            modoExacto.classList.remove('ocultar')
            modoRango.classList.add('ocultar')
        }
        if (modoSeleccionado=="rango") {
            modoExacto.classList.add('ocultar')
            modoRango.classList.remove('ocultar')
        }
        buscarCeldas();
    });
    inputzExacta.addEventListener('change',buscarCeldas);
    inputzMin.addEventListener('change',buscarCeldas);
    inputzMax.addEventListener('change',buscarCeldas);
    btnParteaguas.addEventListener('click', detectarYMostrarParteaguas);
    //Al desactivar la casilla quitamos solo la cuenca amarilla (la morada del botón se conserva)
    cuencaPorClic.addEventListener('change', () => {
        if (cuencaPorClic.checked) return;
        for (const c of raster.children) c.classList.remove('parteaguas-amarillo', 'celda-cuenca');
    });
    tipoTerreno.addEventListener('change', generarRaster); // Para que cambie al mover
    buscarCeldas();
}
/*
function generarRaster(){
    let size= parseInt(tamanio.value);
    if(size>100 || size<2) size=2;
    tamanio.value=size;
    //Limpiamos el raster
    celdaSeleccionada= null;
    colorSeleccionado=null;

    raster.innerHTML = '';

    //configuramos el tamaño del raster
    raster.style.gridTemplateColumns=`repeat(${size}, 1fr)`;
    raster.style.gridTemplateRows=`repeat(${size}, 1fr)`;

    //Creamos un html sin alma para optimizar
    const shard=document.createDocumentFragment();

    //A este fragmento lo llenamos de los divs (los cuales seran hechos con respecto a su tamaño)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            //creamos el "cuadrado"
            const cuadro=document.createElement('div');
            //Le ponemos los estilos de la clase celda
            cuadro.classList.add('celda');
            //Calculamos un número aleatorio y ligamos con color
            let numero=numeroAleatorio();
            let color=numeroAColor(numero, interpolacion.checked);
            //La aplicamos estilos extra en base a estos datos:
            cuadro.style.backgroundColor=color;
            if (size<=30) cuadro.textContent=numero;
            //Le etiquetamos con coordenadas "(x,y)" a cada uno
            cuadro.dataset.x=j;
            cuadro.dataset.y=i;
            cuadro.dataset.z=numero;
            //Lo añadimos DENTRO fragmento
            shard.appendChild(cuadro);
        }
    }
    //Ahora si renderizamos el fragmento para que tenga alma y no se actualice de a uno por uno
    raster.appendChild(shard);
    calcularExtremos();
    buscarCeldas();
}*/
function generarRaster(){
    let size= parseInt(tamanio.value);
    if(size>100 || size<2) size=2;
    tamanio.value=size;
    
    celdaSeleccionada= null;
    colorSeleccionado=null;
    raster.innerHTML = '';

    raster.style.gridTemplateColumns=`repeat(${size}, 1fr)`;
    raster.style.gridTemplateRows=`repeat(${size}, 1fr)`;

    const modoTerreno = tipoTerreno.value;
    const shard = document.createDocumentFragment();

    if (modoTerreno === 'mapa1') {
        let matrizRaw = Array(size).fill(0).map(() => Array(size).fill(0));
        let minVal = Infinity;
        let maxVal = -Infinity;

        // 1. Relieve del Mapa 1 (sin cambios)
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let x = (j / (size - 1)) * 1000;
                let y = (i / (size - 1)) * 1000;
                let xc = 500;

                let z = 100 + 0.1 * y + 45 * (1 - Math.cos(Math.PI * (x - xc) / 350));
                z += 30 * Math.exp(-((x - 300)**2 + (y - 650)**2) / (2 * 140**2));
                z += 30 * Math.exp(-((x - 700)**2 + (y - 500)**2) / (2 * 140**2));

                matrizRaw[i][j] = z;
                if (z < minVal) minVal = z;
                if (z > maxVal) maxVal = z;
            }
        }

        // 2. Renderizar (guardando la z con decimales en data-z-real)
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cuadro = document.createElement('div');
                cuadro.classList.add('celda');

                let zEscalada = ((matrizRaw[i][j] - minVal) / (maxVal - minVal)) * 99 + 1;
                let numero = Math.round(zEscalada);
                let color = numeroAColor(numero, interpolacion.checked);

                cuadro.style.backgroundColor = color;
                if (size <= 30) cuadro.textContent = numero;

                cuadro.dataset.x = j;
                cuadro.dataset.y = i;
                cuadro.dataset.z = numero;
                cuadro.dataset.zReal = zEscalada;

                shard.appendChild(cuadro);
            }
        }

    } else {
        // --- MODO RANDOM ORIGINAL ---
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cuadro = document.createElement('div');
                cuadro.classList.add('celda');
                
                let numero = numeroAleatorio();
                let color = numeroAColor(numero, interpolacion.checked);
                
                cuadro.style.backgroundColor = color;
                if (size <= 30) cuadro.textContent = numero;
                
                cuadro.dataset.x = j;
                cuadro.dataset.y = i;
                cuadro.dataset.z = numero;
                
                shard.appendChild(cuadro);
            }
        }
    }

    raster.appendChild(shard);
    hid_marcarRios(); // decide internamente si se dibujan los ríos (ver MOSTRAR_RIOS_EN_RANDOM)
    calcularExtremos();
    buscarCeldas();
}
function delimitarCuencaDesdeRio(celdaClick) {
    if (celdaClick.dataset.esRio !== "true") {
        alert("Haz clic sobre una celda del río (en rojo) para delimitar su cuenca estilo SIATL.");
        return;
    }

    const n = hid_tamanio();
    if (!hidRecep || hidN !== n) hid_calcular();

    const idx = parseInt(celdaClick.dataset.y) * n + parseInt(celdaClick.dataset.x);

    hid_limpiarCuenca();
    const cuenca = hid_cuencaDesde(idx);              // todo lo que drena hasta esta celda
    const total = hid_pintarCuenca(cuenca, 'parteaguas-amarillo', 'celda-cuenca');

    console.log(`Cuenca aportante: ${total} celdas (${(100 * total / (n*n)).toFixed(1)} % del ráster).`);
}
function generarBarra(){
    const colores = [
        '#8d8cf1',/*1-10*/
        '#8d9cdb',/*11-20*/
        '#90aace',/*21-30*/
        '#97b5c8',/*31-40*/
        '#9fbfc6',/*41-50*/
        '#aac8c7',/*51-60*/
        '#b7d1cc',/*61-70*/
        '#c6d8d3',/*71-80*/
        '#d5e0dc',/*81-90*/
        '#e7e7e7',/*91-100*/
    ];
    const shard=document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
        const cuadro=document.createElement('div');
        cuadro.classList.add('celda');
        cuadro.style.backgroundColor=colores[i];
        cuadro.dataset.min=10*i+1;
        cuadro.dataset.max=10*i+10;
        cuadro.textContent=`${10*i+1}-${10*i+10}`;
        shard.appendChild(cuadro);
    }
    barra.appendChild(shard);
}
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
function numeroAleatorio10() {
    //Math random devuelve un decimal entre 0 y 1 (sin llegar al uno)
    let decimal= Math.random();
    //Como queremos números del 1 al 100 vamos a escalar el rango de 0-1 a 0-10(sin llegar al 10)
    let rango= decimal*10;
    /*
        con este rango ahora necesitamos quitarle los decimales
        Math.floor nos trunca el resultado a el entero debajo (no redondea)
        por lo que ahora tenemos numeros desde el 0 hasta el 9
    */
    let numero=Math.floor(rango);
    return numero;
}
function numeroAColor(numero, usarInterpolacion=false) {
    //Declaramos el arreglo de colores (salidas) posibles,
    /*Futura implementación de arreglo 'x'*/
    let color;
    const colores = [
        '#8d8cf1',/*1-10*/
        '#8d9cdb',/*11-20*/
        '#90aace',/*21-30*/
        '#97b5c8',/*31-40*/
        '#9fbfc6',/*41-50*/
        '#aac8c7',/*51-60*/
        '#b7d1cc',/*61-70*/
        '#c6d8d3',/*71-80*/
        '#d5e0dc',/*81-90*/
        '#e7e7e7',/*91-100*/
    ];

    if (!usarInterpolacion) {
        for (let i=1; i<11; i++) {
        if(numero<=(10*i)){
                color=colores[i-1];
                break;
            }
        }
        return color;
    }
    const reverse=((numero-1)/99)*(colores.length-1);
    const indiceActual=Math.floor(reverse);
    const indicePost=Math.min(indiceActual+1, 9);

    const porcentaje=reverse-indiceActual;

    const colorA=traductorHex(colores[indiceActual]);
    const colorB=traductorHex(colores[indicePost]);

    const r=Math.round(colorA.r+(colorB.r-colorA.r)*porcentaje);
    const g=Math.round(colorA.g+(colorB.g-colorA.g)*porcentaje);
    const b=Math.round(colorA.b+(colorB.b-colorA.b)*porcentaje);
    return `rgb(${r},${g},${b})`;

}
function calcularExtremos(){
    const todasCeldas= raster.querySelectorAll('.celda');

    let valorMaximo=0;
    let valorMinimo=101;

    todasCeldas.forEach(celda => {
        let z=parseInt(celda.dataset.z);

        if (!isNaN(z)) {
            if (z>valorMaximo) valorMaximo=z;
            if (z<valorMinimo) valorMinimo=z;
        }
    });
    maximo.textContent=`Máximo: ${valorMaximo}`;
    minimo.textContent=`Mínimo: ${valorMinimo}`;

}
function buscarCeldas(){
    const modo=selectorModo.value;
    const inputExacto=document.getElementById('z-exacta');
    const inputMin=document.getElementById('z-min');
    const inputMax=document.getElementById('z-max');
    const busquedasAnte=raster.querySelectorAll('.busqueda-encontrada');

    busquedasAnte.forEach(celda => {
        celda.classList.remove('busqueda-encontrada');
    });
    const todasCeldas=raster.querySelectorAll('.celda');

    if (modo=="exacto") {
        if (isNaN(inputExacto.value)) return;
        const zExacta=parseInt(inputExacto.value);
        
        todasCeldas.forEach(celda => {
            let z= parseInt(celda.dataset.z);
            if (z==zExacta) {
                celda.classList.add('busqueda-encontrada');
            }
        });
    }
    if(modo=="rango"){
        if (isNaN(inputMin.value)||isNaN(inputMax.value)) return;
        const zMin=parseInt(inputMin.value);
        const zMax=parseInt(inputMax.value);
        
        todasCeldas.forEach(celda => {
            let z=parseInt(celda.dataset.z);
            if (z>=zMin && z<=zMax) {
                celda.classList.add('busqueda-encontrada');
            }
        });
    }
}
function restaurarCeldas(){
    const modo=selectorModo.value;
    if (modo=="exacto")  inputzExacta.value="";
    if (modo=="rango")  {
        inputzMin.value=null;
        inputzMax.value=null;
    }
    buscarCeldas();
}
function aplicarDegradado(){
    let size = parseInt(tamanio.value);
    if(size > 100 || size < 2) size = 2;
    tamanio.value = size;

    //Limpiamos las selecciones
    celdaSeleccionada = null;
    colorSeleccionado = null;
    //Borramos el contenedor del raster
    raster.innerHTML = '';

    //Configuramos el grid nuevamente del raster
    raster.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    raster.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    //Creamos un fragmento otra vez 
    const shard = document.createDocumentFragment();

    //Al igual que en generar raster, generamos el raster, pero ahora con la matematica del degradado
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cuadro = document.createElement('div');
            cuadro.classList.add('celda');
            
            let nuevaZ = Math.floor((j / (size - 1)) * 99) + 1;
            let color = numeroAColor(nuevaZ, interpolacion.checked);
            
            cuadro.style.backgroundColor = color;
            if (size <= 30) cuadro.textContent = nuevaZ;
            
            // Atributos de datos nativos
            cuadro.dataset.x = j;
            cuadro.dataset.y = i;
            cuadro.dataset.z = nuevaZ;
            
            // Lo guardamos en el fragmento 
            shard.appendChild(cuadro);
        }
    }
    //Renderizamos el shard
    raster.appendChild(shard);
    //Re-calculamos los extremos
    calcularExtremos();
}
function ordenarMayorAMenor() {
    //Capturamos todas las celdas actuales
    const todasCeldas = raster.querySelectorAll('.celda');
    if (todasCeldas.length === 0) return;

    let size = parseInt(tamanio.value);

    //Extraemos todos los valores numéricos de Z a un arreglo de memoria
    const valoresZ = [];
    todasCeldas.forEach(celda => {
        valoresZ.push(parseInt(celda.dataset.z));
    });

    //Ordenamos aritméticamente el arreglo de MAYOR a MENOR
    valoresZ.sort((a, b) => b - a);

    //Limpiamos por completo las referencias de selección y volvemos a generar un raster 
    celdaSeleccionada = null;
    colorSeleccionado = null;
    //Borramos el contenido del raster
    raster.innerHTML = ''; 

    //Creamos otro contenedor "sin alma"
    const shard = document.createDocumentFragment();

    //Reconstruimos el raster usando la lista ya ordenada
    let indiceArreglo = 0;//inicia en 0 y se suma hasta que ya no exista más raster
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cuadro = document.createElement('div');
            cuadro.classList.add('celda');

            // Tomamos el valor que ya le corresponde por orden de lista
            let nuevaZ = valoresZ[indiceArreglo];
            let color = numeroAColor(nuevaZ, interpolacion.checked);

            cuadro.style.backgroundColor = color;
            if (size <= 30) cuadro.textContent = nuevaZ;

            // Mantenemos la rejilla de coordenadas espaciales fijas e inalteradas
            cuadro.dataset.x = j;
            cuadro.dataset.y = i;
            cuadro.dataset.z = nuevaZ;

            // Inyectamos el nuevo cuadro al fragmento en memoria RAM (Cero impacto visual en el navegador)
            shard.appendChild(cuadro);
            indiceArreglo++;
        }
    }

    //Renderizamos
    raster.appendChild(shard);

    //"Reiniciamos el menú"
    positionX.value = '';
    positionY.value = '';
    positionZ.value = '';

    //RE-calculamos
    calcularExtremos();
    buscarCeldas();
}
function ejecutarInterpolacion() {
    // 1. Capturamos todas las celdas actuales del DOM
    const todasCeldas = raster.querySelectorAll('.celda');
    if (todasCeldas.length === 0) return;

    let size = parseInt(tamanio.value);

    //Creamos un fragmento "sin alma" en la memoria RAM para que sea instantáneo
    const shard = document.createDocumentFragment();

    // 3. Recorremos las celdas actuales y las clonamos con el nuevo método de color
    todasCeldas.forEach(celda => {
        const cuadro = document.createElement('div');
        cuadro.classList.add('celda');

        // Extraemos la Z exacta que ya tenia esta celda
        let zExistente = parseInt(celda.dataset.z);
        
        // Calculamos el nuevo color (RGB continuo o HEX indexado) basado en el checkbox
        let color = numeroAColor(zExistente, interpolacion.checked);

        cuadro.style.backgroundColor = color;
        if (size <= 30) cuadro.textContent = zExistente;

        // Mantener intactas las propiedades y coordenadas de la celda original
        cuadro.dataset.x = celda.dataset.x;
        cuadro.dataset.y = celda.dataset.y;
        cuadro.dataset.z = zExistente;

        // Si la celda actual estaba seleccionada, mantenemos su estado visual
        if (celda.classList.contains('seleccionada')) {
            cuadro.classList.add('seleccionada');
            celdaSeleccionada = cuadro; // Actualizamos el puente global al nuevo nodo
        }

        // Lo inyectamos al fragmento en memoria RAM
        shard.appendChild(cuadro);
    });

    // 4. Destruimos el raster viejo y renderizamos el nuevo de un solo golpe (0.02 segundos)
    raster.innerHTML = '';
    raster.appendChild(shard);

    // 5. Refrescamos el buscador por si había celdas iluminadas por búsqueda
    buscarCeldas();
}

function traductorHex(hexa){
    const r= parseInt(hexa.slice(1,3),16);
    const g= parseInt(hexa.slice(3,5),16);
    const b= parseInt(hexa.slice(5,7),16);

    return {r,g,b};
}


function detectarYMostrarParteaguas() {
    if (raster.children.length === 0) return;

    hid_marcarRios(); // recalcula flujo y ríos con las alturas actuales
    const n = hidN;

    // Salida: celda de borde con mayor acumulación
    let idxSalida = 0, mejorAcc = -1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 || j === 0 || i === n-1 || j === n-1) {
                const k = i*n + j;
                if (hidAcc[k] > mejorAcc) { mejorAcc = hidAcc[k]; idxSalida = k; }
            }
        }
    }

    const cuenca = hid_cuencaDesde(idxSalida);
    const total = hid_pintarCuenca(cuenca, 'parteaguas', 'celda-cuenca-morada'); // contorno + superficie en morado

    console.log(`Parteaguas de la cuenca principal: ${total} celdas, salida en fila ${(idxSalida / n) | 0}, columna ${idxSalida % n}.`);
}










// ===================== HIDROLOGÍA (ríos y cuenca) =====================
const HID_FRACCION_UMBRAL = 0.01; // fracción de celdas que define un río (guía: U = 100 de 10,000)
let hidN = 0, hidRecep = null, hidAcc = null, hidUmbral = 0;
const HID_VECINOS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

// Lado del ráster que realmente está dibujado
function hid_tamanio(){ return Math.round(Math.sqrt(raster.children.length)); }

// Lee las alturas del DOM (usa data-z-real si sigue vigente; si no, data-z)
function hid_leerZ(n){
    const Z = new Float64Array(n*n);
    for (let k = 0; k < n*n; k++) {
        const c = raster.children[k];
        const zInt = parseInt(c.dataset.z);
        const zReal = parseFloat(c.dataset.zReal);
        Z[k] = (!isNaN(zReal) && Math.round(zReal) === zInt) ? zReal : zInt;
    }
    return Z;
}

// Rellena depresiones (priority-flood) para que el agua siempre tenga salida
function hid_rellenar(Z, n){
    const eps = 1e-5;
    const F = new Float64Array(n*n).fill(Infinity);
    const visto = new Uint8Array(n*n);
    const hk = [], hv = []; // montículo mínimo: claves (z) y valores (índice)
    function push(k, v){
        let i = hk.length; hk.push(k); hv.push(v);
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (hk[p] <= k) break;
            hk[i] = hk[p]; hv[i] = hv[p]; i = p;
        }
        hk[i] = k; hv[i] = v;
    }
    function pop(){
        const k0 = hk[0], v0 = hv[0];
        const kl = hk.pop(), vl = hv.pop();
        const len = hk.length;
        if (len > 0) {
            let i = 0;
            while (true) {
                const l = 2*i + 1;
                if (l >= len) break;
                const r = l + 1;
                const m = (r < len && hk[r] < hk[l]) ? r : l;
                if (hk[m] >= kl) break;
                hk[i] = hk[m]; hv[i] = hv[m]; i = m;
            }
            hk[i] = kl; hv[i] = vl;
        }
        return [k0, v0];
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 || j === 0 || i === n-1 || j === n-1) {
                const k = i*n + j;
                F[k] = Z[k]; visto[k] = 1; push(Z[k], k);
            }
        }
    }
    while (hk.length) {
        const [z, c] = pop();
        const i = (c / n) | 0, j = c % n;
        for (const [di, dj] of HID_VECINOS) {
            const a = i + di, b = j + dj;
            if (a < 0 || a >= n || b < 0 || b >= n) continue;
            const k = a*n + b;
            if (visto[k]) continue;
            visto[k] = 1;
            F[k] = Math.max(Z[k], z + eps);
            push(F[k], k);
        }
    }
    return F;
}

// Relleno + dirección de flujo D8 (pendiente normalizada por distancia) + acumulación
function hid_calcular(){
    const n = hid_tamanio();
    const Z = hid_leerZ(n);
    const F = hid_rellenar(Z, n);
    const recep = new Int32Array(n*n).fill(-1);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let mejor = 0;
            const c = i*n + j;
            for (const [di, dj] of HID_VECINOS) {
                const a = i + di, b = j + dj;
                if (a < 0 || a >= n || b < 0 || b >= n) continue;
                const s = (F[c] - F[a*n + b]) / Math.hypot(di, dj);
                if (s > mejor) { mejor = s; recep[c] = a*n + b; }
            }
        }
    }
    const orden = Array.from({length: n*n}, (_, k) => k).sort((p, q) => F[q] - F[p]);
    const acc = new Int32Array(n*n).fill(1);
    for (const k of orden) {          // de la más alta a la más baja
        const r = recep[k];
        if (r >= 0) acc[r] += acc[k];
    }
    hidN = n; hidRecep = recep; hidAcc = acc;
    hidUmbral = Math.max(4, Math.round(HID_FRACCION_UMBRAL * n * n));
}

// Quita todas las marcas de cuenca/parteaguas
function hid_limpiarCuenca(){
    for (const c of raster.children) c.classList.remove('parteaguas', 'celda-cuenca-morada', 'parteaguas-amarillo', 'celda-cuenca');
}

// ¿Se deben dibujar los ríos con el terreno actual?
function hid_riosVisibles(){
    return tipoTerreno.value === 'mapa1' || MOSTRAR_RIOS_EN_RANDOM;
}

// Calcula el flujo y marca los ríos (acc >= umbral) si corresponde mostrarlos.
// El flujo se calcula siempre, porque el parteaguas lo necesita aunque no se vean los ríos.
function hid_marcarRios(){
    if (raster.children.length === 0) return;
    hid_calcular();
    hid_limpiarCuenca();
    const visibles = hid_riosVisibles();
    for (let k = 0; k < hidN*hidN; k++) {
        const c = raster.children[k];
        if (visibles && hidAcc[k] >= hidUmbral) {
            c.classList.add('cauce-rojo');
            c.dataset.esRio = "true";
        } else {
            c.classList.remove('cauce-rojo');
            delete c.dataset.esRio;
        }
    }
}

// Cuenca aportante: todas las celdas cuyo flujo termina en la celda idx
function hid_cuencaDesde(idx){
    const n = hidN;
    const cuenca = new Uint8Array(n*n);
    const pila = [idx];
    cuenca[idx] = 1;
    while (pila.length) {
        const c = pila.pop();
        const i = (c / n) | 0, j = c % n;
        for (const [di, dj] of HID_VECINOS) {
            const a = i + di, b = j + dj;
            if (a < 0 || a >= n || b < 0 || b >= n) continue;
            const k = a*n + b;
            if (!cuenca[k] && hidRecep[k] === c) { cuenca[k] = 1; pila.push(k); }
        }
    }
    return cuenca;
}

// Pinta el contorno (parteaguas) y, opcionalmente, el interior. Devuelve el nº de celdas
function hid_pintarCuenca(cuenca, claseBorde, claseInterior){
    const n = hidN;
    const cuatro = [[-1,0],[1,0],[0,-1],[0,1]];
    let total = 0;
    for (let k = 0; k < n*n; k++) {
        if (!cuenca[k]) continue;
        total++;
        const i = (k / n) | 0, j = k % n;
        const esBorde = cuatro.some(([di, dj]) => {
            const a = i + di, b = j + dj;
            return a < 0 || a >= n || b < 0 || b >= n || !cuenca[a*n + b];
        });
        const c = raster.children[k];
        if (esBorde) c.classList.add(claseBorde);
        else if (claseInterior && !c.classList.contains('cauce-rojo')) c.classList.add(claseInterior);
    }
    return total;
}

main();
generarRaster();
generarBarra();