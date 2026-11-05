import random

frutas = ["manzana", "plátano", "naranja"]
precios = [10, 8, 12]

total = 0
seguir = "si"





while seguir == "si":
    print("1. Manzana - $10")
    print("2. Plátano - $8")
    print("3. Naranja - $12")

    opcion = int(input("Elijan una fruta (1, 2 o 3): "))
    cantidad = int(input("¿Cuántas quieren? "))

    if opcion == 1:
        fruta = "manzana"
        precio = 10
    elif opcion == 2:
        fruta = "plátano"
        precio = 8
    elif opcion == 3:
        fruta = "naranja"
        precio = 12
    else:
        fruta = "opción no válida"
        precio = 0

    subtotal = precio * cantidad
    total = total + subtotal

    print("Eligieron:", fruta)
    print("Subtotal: $", subtotal)

    seguir = input("¿Quieren comprar otra fruta? Escriban si o no: ")

numero_sorpresa = random.randint(1, 5)

print("Total de la compra: $", total)
print("Número de suerte:", numero_sorpresa)