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

const btnParteaguas = document.getElementById('btn-parteaguas');
const tipoTerreno = document.getElementById('tipo-terreno');

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
        // --- LLAMADA SIATL AL HACER CLIC EN UN RÍO ---
        if (celdaClick.dataset.esRio === "true") {
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

        // 1. Generar el relieve del Mapa 1
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

        // 2. Calcular flujo D8 y acumulación real para encontrar el cauce por donde corre el agua
        let vecinos = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        let recep = Array(size).fill(0).map(() => Array(size).fill(null));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let minZ = matrizRaw[i][j];
                let mejorDest = null;
                for (let [di, dj] of vecinos) {
                    let ni = i + di, nj = j + dj;
                    if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
                        if (matrizRaw[ni][nj] < minZ) {
                            minZ = matrizRaw[ni][nj];
                            mejorDest = [ni, nj];
                        }
                    }
                }
                recep[i][j] = mejorDest;
            }
        }

        // Calcular acumulación de flujo (cuántas celdas drenan a través de cada nodo)
        let orden = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                orden.push({i, j, z: matrizRaw[i][j]});
            }
        }
        orden.sort((a, b) => b.z - a.z); // Del más alto al más bajo

        let acc = Array(size).fill(0).map(() => Array(size).fill(1));
        for (let nodo of orden) {
            let r = recep[nodo.i][nodo.j];
            if (r) {
                acc[r[0]][r[1]] += acc[nodo.i][nodo.j];
            }
        }

        // Umbral para definir qué celdas forman el río (las que tienen mayor acumulación en el valle)
        let umbralRio = Math.floor(size * 1.5);

        // 3. Renderizar el ráster y marcar automáticamente el río real en rojo
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cuadro = document.createElement('div');
                cuadro.classList.add('celda');

                let zCrudo = matrizRaw[i][j];
                let numero = Math.round(((zCrudo - minVal) / (maxVal - minVal)) * 99) + 1;
                let color = numeroAColor(numero, interpolacion.checked);

                cuadro.style.backgroundColor = color;
                if (size <= 30) cuadro.textContent = numero;

                cuadro.dataset.x = j;
                cuadro.dataset.y = i;
                cuadro.dataset.z = numero;

                // Si la acumulación supera el umbral y está en la zona central del valle, es parte del río natural
                let enValleCentral = (j >= Math.floor(size * 0.4) && j <= Math.floor(size * 0.6));
                if (acc[i][j] >= umbralRio && enValleCentral) {
                    cuadro.classList.add('cauce-rojo');
                    cuadro.dataset.esRio = "true";
                }

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
    calcularExtremos();
    buscarCeldas();
}
function delimitarCuencaDesdeRio(celdaClick) {
    if (celdaClick.dataset.esRio !== "true") {
        alert("Haz clic sobre una celda del río (en rojo) para delimitar su cuenca estilo SIATL.");
        return;
    }

    let size = parseInt(tamanio.value);
    const celdas = raster.querySelectorAll('.celda');

    // 1. Limpiar selecciones de cuenca anteriores
    celdas.forEach(c => {
        c.classList.remove('parteaguas-amarillo');
        c.classList.remove('celda-cuenca');
    });

    // 2. Reconstruir la matriz Z de elevaciones
    let Z = Array(size).fill(0).map(() => Array(size).fill(0));
    celdas.forEach(c => {
        Z[parseInt(c.dataset.y)][parseInt(c.dataset.x)] = parseInt(c.dataset.z);
    });

    // 3. Obtener todas las celdas catalogadas como río
    let celdasRio = [];
    celdas.forEach(c => {
        if (c.dataset.esRio === "true") {
            celdasRio.push({ x: parseInt(c.dataset.x), y: parseInt(c.dataset.y) });
        }
    });

    // 4. Proceso por cada celda de río (barrido horizontal izq y der)
    celdasRio.forEach(rio => {
        let rx = rio.x;
        let ry = rio.y;

        // --- HACIA LA IZQUIERDA ---
        let maxZIzq = Z[ry][rx];
        let mejorXIzq = rx;
        
        for (let x = rx; x >= 0; x--) {
            let zVal = Z[ry][x];
            
            // Pintar el interior de la cuenca (siempre que no sea el río)
            let celdaDom = raster.querySelector(`[data-x="${x}"][data-y="${ry}"]`);
            if (celdaDom && !celdaDom.classList.contains('cauce-rojo')) {
                celdaDom.classList.add('celda-cuenca');
            }

            // Buscar el punto máximo (cresta/parteaguas)
            if (zVal >= maxZIzq) {
                maxZIzq = zVal;
                mejorXIzq = x;
            } else {
                // Si la altura comienza a descender después del pico, encontramos la cresta
                break;
            }
        }

        // Marcar el parteaguas izquierdo
        let celdaParteaguasIzq = raster.querySelector(`[data-x="${mejorXIzq}"][data-y="${ry}"]`);
        if (celdaParteaguasIzq) {
            celdaParteaguasIzq.classList.remove('celda-cuenca');
            celdaParteaguasIzq.classList.add('parteaguas-amarillo');
        }


        // --- HACIA LA DERECHA ---
        let maxZDer = Z[ry][rx];
        let mejorXDer = rx;

        for (let x = rx; x < size; x++) {
            let zVal = Z[ry][x];
            
            // Pintar el interior de la cuenca (siempre que no sea el río)
            let celdaDom = raster.querySelector(`[data-x="${x}"][data-y="${ry}"]`);
            if (celdaDom && !celdaDom.classList.contains('cauce-rojo')) {
                celdaDom.classList.add('celda-cuenca');
            }

            // Buscar el punto máximo (cresta/parteaguas)
            if (zVal >= maxZDer) {
                maxZDer = zVal;
                mejorXDer = x;
            } else {
                // Si la altura comienza a descender después del pico, encontramos la cresta
                break;
            }
        }

        // Marcar el parteaguas derecho
        let celdaParteaguasDer = raster.querySelector(`[data-x="${mejorXDer}"][data-y="${ry}"]`);
        if (celdaParteaguasDer) {
            celdaParteaguasDer.classList.remove('celda-cuenca');
            celdaParteaguasDer.classList.add('parteaguas-amarillo');
        }
    });

    console.log("Cuenca y parteaguas delimitados por barrido horizontal por cada celda de río.");
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
    const celdas = raster.querySelectorAll('.celda');
    if (celdas.length === 0) return;

    let size = parseInt(tamanio.value);
    
    // 1. Reconstruir la matriz Z de 2D a partir del DOM actual
    let Z = Array(size).fill(0).map(() => Array(size).fill(0));
    celdas.forEach(celda => {
        let x = parseInt(celda.dataset.x);
        let y = parseInt(celda.dataset.y);
        Z[y][x] = parseInt(celda.dataset.z);
    });

    // Limpiar marcas anteriores de parteaguas si las hubiera
    celdas.forEach(celda => celda.classList.remove('parteaguas'));

    // 2. Calcular el Laplaciano discreto (∇²z = z_xx + z_yy) para toda la matriz interna
    let matrizLaplaciano = Array(size).fill(0).map(() => Array(size).fill(0));

    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            let z_xx = Z[i][j+1] - 2 * Z[i][j] + Z[i][j-1];
            let z_yy = Z[i+1][j] - 2 * Z[i][j] + Z[i-1][j];
            matrizLaplaciano[i][j] = z_xx + z_yy;
        }
    }

    // 3. Forzar una línea continua: por cada fila horizontal (i), 
    // encontramos el punto exacto de mayor cresta (mínimo Laplaciano) a la izquierda y a la derecha.
    for (let i = 2; i < size - 2; i++) {
        let minLapIzq = 0;
        let mejorXIzq = -1;

        let minLapDer = 0;
        let mejorXDer = -1;

        // Rango de búsqueda para el flanco izquierdo (evitando el valle central)
        for (let j = Math.floor(size * 0.1); j < Math.floor(size * 0.38); j++) {
            if (matrizLaplaciano[i][j] < minLapIzq && matrizLaplaciano[i][j] < 0) {
                minLapIzq = matrizLaplaciano[i][j];
                mejorXIzq = j;
            }
        }

        // Rango de búsqueda para el flanco derecho (evitando el valle central)
        for (let j = Math.floor(size * 0.62); j < Math.floor(size * 0.9); j++) {
            if (matrizLaplaciano[i][j] < minLapDer && matrizLaplaciano[i][j] < 0) {
                minLapDer = matrizLaplaciano[i][j];
                mejorXDer = j;
            }
        }

        // Marcar la celda de la izquierda para esta fila si cumple
        if (mejorXIzq !== -1) {
            let celdaIzq = raster.querySelector(`[data-x="${mejorXIzq}"][data-y="${i}"]`);
            if (celdaIzq) celdaIzq.classList.add('parteaguas');
        }

        // Marcar la celda de la derecha para esta fila si cumple
        if (mejorXDer !== -1) {
            let celdaDer = raster.querySelector(`[data-x="${mejorXDer}"][data-y="${i}"]`);
            if (celdaDer) celdaDer.classList.add('parteaguas');
        }
    }

    console.log("Líneas de parteaguas continuas generadas con éxito.");
}


main();
generarRaster();
generarBarra();