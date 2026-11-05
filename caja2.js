const listaPedidos = new Map();

// Función para agregar productos
function agregarProductoACaja(nombreCliente, nombreProducto, precio) {
  // Validaciones
  if (!nombreCliente || nombreCliente === "") {
    console.log("Error: Nombre de cliente no válido.");
    return;
  }
  if (!nombreProducto || nombreProducto === "") {
    console.log("Error: El producto no puede estar vacío.");
    return;
  }
  if (precio <= 0) {
    console.log("Error: El precio debe ser mayor a 0.");
    return;
  }

  // Si el cliente no esta lo registramos 
  if (!listaPedidos.has(nombreCliente)) {
    listaPedidos.set(nombreCliente, { listaProductos: [], totalAcumulado: 0 });
  }

  //Metemos el producto del cliente
  const pedidoCliente = listaPedidos.get(nombreCliente);
  pedidoCliente.listaProductos.push({ nombreProducto: nombreProducto, precio: precio });

  console.log("Producto agregado al pedido de " + nombreCliente);
}

// Función para calcular subtotal, IVA y total 
function calcularCaja(nombreCliente) {
  if (!listaPedidos.has(nombreCliente)) {
    console.log("Error: No existe pedido para " + nombreCliente);
    return;
  }

  const pedidoCliente = listaPedidos.get(nombreCliente);
  const productos = pedidoCliente.listaProductos;

  if (productos.length === 0) {
    console.log("No hay productos registrados.");
    return;
  }

  const subtotal = productos.reduce(function (acumulado, { precio }) {
    return acumulado + precio;
  }, 0);

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  pedidoCliente.totalAcumulado = subtotal;

  console.log("--- CAJA (" + nombreCliente + ") ---");
  console.log("Subtotal: $" + subtotal);
  console.log("IVA (16%): $" + iva);
  console.log("Total a pagar: $" + total);
}
// Pruebas en consola
agregarProductoACaja("Mont", "Ron", 600);
agregarProductoACaja("Mont", "Vino", 700);
agregarProductoACaja("Mont", "Jamón", -10);

calcularCaja("Mont");

