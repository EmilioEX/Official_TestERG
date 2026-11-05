const listaDePedidos = [];
let totalAcumulado = 0;

function agregarPedido(nombre, precio) {
  listaDePedidos.push({ producto: nombre, precio: precio });
  totalAcumulado = totalAcumulado + precio;
  console.log(" Pedido registrado: " + nombre);
}

// Simulamos que agregamos comida
agregarPedido("Hamburguesa", 150);
agregarPedido("Papas Fritas", 60);

// Mostramos en la consola
console.log("--- CAJA ---");
console.log("Pedidos:", listaDePedidos);
console.log("Total acumulado: $" + totalAcumulado);