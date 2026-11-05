import tkinter as tk
from PIL import Image, ImageTk
import cv2
import numpy as np

# ---------------------------
# MODELO 1: DETECCIÓN REAL
# ---------------------------

def detectar_color(hsv_pixel):#es un arreglo de la imagen (pixeles) con base en su posición x,y
    #desestructuración
    h, s, v = hsv_pixel
    #h: color base
    #s: intensidad
    #v: brillo
    if v < 50:
        return "Negro"
    if v > 200 and s < 40:
        return "Blanco"

    if 0 <= h <= 10 or 160 <= h <= 180:
        return "Rojo"
    if 15 <= h <= 35:
        return "Amarillo"
    if 36 <= h <= 85:
        return "Verde"
    if 86 <= h <= 125:
        return "Azul"
    if 126 <= h <= 159:
        return "Morado"

    return "Desconocido"


def modelo_1(frame):
    #Preparamos dos imagenes para trabajar (simplificamos el problema)

    #Esta es la imagen para detectar los colores en su version hsv
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    #Usamos la escala de grises para detectar mejor las formas (eliminamos-simplificamos variables)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    #usamos un blur para eliminar ruido (se lo aplicamos al frame con escala de grises)
    blur = cv2.GaussianBlur(gray, (11, 11), 0)

    #procesamos de nuevo la imagen para detectar las figuras haciendo que ahora solo existan colores blancos y negros
    thresh = cv2.adaptiveThreshold(blur, 255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY_INV,15, 3)
    #thresh: nuestro frame, pintamos el color "máximo"(blanco), metodo especial, metodo que separa el blanco del negro(o al revés), tamaño del bloque de comparación, que tan agresivo es

    #buscamos los contornos 
    #   findContours recibe una imagen en blanco y negro, busca las zonas blancas rodeadas por negro y encuentra su borde
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                                                    #detecta solo el "último" contorno
                                                                    #Inidca cuantos puntos usamos(todos los de las líneas o solo esquinas)
    #la desestructuración devuelve una lista de contornos, y la información de un contorno sobre otro
    

    #inicializamos una variable para "filtrar" el mejor contorno y obtener su info
    mejor_contorno = None

    #recorremos la lista de contornos
    for c in contours:
        #calculamos el area
        area = cv2.contourArea(c)
        #filtramos por area(una figura pequeña suele ser ruido)
        if area < 4000:
            continue
        #filtramos por perímetro (al igual que el area si es pequeño se descarta)
        perimetro = cv2.arcLength(c, True)
        if perimetro < 300:
            continue

        #re-adaptamos el contorno(forma) para simplificarla
        approx = cv2.approxPolyDP(c, 0.03 * perimetro, True)

        #filtro de convexidad(no cierra hacia adentro como una figura convencional)
        if not cv2.isContourConvex(approx):
            continue

        #usando el poly, delimitamos las "formas" con menos de 3 lados y más de 8
        if len(approx) < 3 or len(approx) > 8:
            continue
        #guardamos la info de este poligono
        mejor_contorno = approx
        break

    #si no paso ningún filtro es una figura desconocida
    if mejor_contorno is None:
        return "Desconocida", "Desconocido"

    #creamos un "rectangulo" como hitbox para usarla de referencia más adelante
    x, y, w, h = cv2.boundingRect(mejor_contorno)
    #calculamos la cantidad de lados de la "figura" (usando sus vertices)
    lados = len(mejor_contorno)

    #nombramos a la figura de acuerdo a su cantidad de lados
    figura = "Desconocida"
    if lados == 3:
        figura = "Triángulo"
    elif lados == 4:
        figura = "Rectángulo"
    elif lados > 4:
        figura = "Círculo"

    #calculamos centro de nuestra "hitbox"
    cx = x + w // 2
    cy = y + h // 2

    #usamos ese centro para poder escoger el pixel del cual obtendremos la info(desde el frame hsv)
    color = detectar_color(hsv[cy, cx])

    # añadimos el contorno visualmente en los frames (antes solo eran calculos)
    cv2.drawContours(frame, [mejor_contorno], -1, (0,255,0), 3)
    #añadimos encima de la hitbox una figura y un color para describirlo mejor
    cv2.putText(frame, f"{figura} - {color}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

    #Retronamos los valores con los que trabjaremos (fuera de la IA)
    return figura, color


#Se prepara la ventana con la que trabajaremos (interfaz de python usando tkinter)

#Abrimos (creamos) una ventana principal "root"
root = tk.Tk()
#metodo que renombra la ventana
root.title("Detector de Formas y Colores - Quiz")
#Se define el tamaño de la ventana (cuando se abre)
root.geometry("1200x600")


#estado de la interfaz del quiz (no ha iniciado)
quiz_activo = False

#numero de preuntas que va a contestar el usuario
pregunta_actual = 0

# Lista de preguntas (se agregan tantas se requieran)
preguntas = [
    ("Rectángulo", "Azul"),
    ("Triángulo", "Rojo"),
    ("Círculo", "Verde"),
]

#Dividimos la ventana en columnas (y filas(una para ser específico))
#Config de columna 1 y 2 (numero de columna y si queremos que sea proporcional)
root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)

#Config de fila
root.grid_rowconfigure(0, weight=1)

#Creamos contenedores (en py son frames) anpalogamente son como "div"
#Lado de cámara
frameCamara = tk.Frame(root, bg="black")
#posicion dentro de la vetana
frameCamara.grid(row=0, column=0, sticky="nsew")
#lado de interfaz de quiz
frameInformacion = tk.Frame(root, bg="#222")
frameInformacion.grid(row=0, column=1, sticky="nsew")

#Obejetos adicionales dentro del lado de la interfaz
label_titulo = tk.Label(frameInformacion, text="QUIZ", fg="white", bg="#222",
                        font=("Arial", 28, "bold"))
label_titulo.pack(pady=20)

#Detección permanente de la figura y colores
label_forma_detectada = tk.Label(frameInformacion, text="Forma detectada: ---",
                                 fg="white", bg="#222", font=("Arial", 16))
label_forma_detectada.pack(pady=10)

label_color_detectado = tk.Label(frameInformacion, text="Color detectado: ---",
                                 fg="white", bg="#222", font=("Arial", 16))
label_color_detectado.pack(pady=10)

# Instrucción del quiz
label_instruccion = tk.Label(frameInformacion,
                                text="",fg="white",bg="#222",font=("Arial", 22, "bold"))

# Puntuación
label_puntuacion = tk.Label(frameInformacion,
                            text="",fg="white",bg="#222",font=("Arial", 18))

# función para iniciar el quiz
def iniciar_quiz():
    global quiz_activo, pregunta_actual
    #cambiamos el estado que había antes a "true"
    quiz_activo = True
    #re-establecemos la pregunta a 0
    pregunta_actual = 0

    #con el boton indicamos que inicia el quiz
    boton_iniciar.pack_forget()
    #desestructuramos las "preguntas"(forma  y color)
    forma, color = preguntas[pregunta_actual]

    #agregamos-cambiamos los labels para que digan lo que nos interesa
    label_instruccion.config(text=f"Muéstrame un {forma} {color}")
    label_instruccion.pack(pady=20)

    label_puntuacion.config(text=f"Pregunta {pregunta_actual+1}/{len(preguntas)}")
    label_puntuacion.pack(pady=10)

#agregamos su respectivo botón (especificamos la función que llama)
boton_iniciar = tk.Button(frameInformacion,
                            text="Iniciar Quiz", font=("Arial", 18),width=12, command=iniciar_quiz)
boton_iniciar.pack(pady=20)

#Creamos la función de reiniciar quiz
def reiniciar_quiz():
    global quiz_activo
    #cerramos el quiz con un "false"
    quiz_activo = False

    #los componentes los "olvidamos"
    label_instruccion.pack_forget()
    label_puntuacion.pack_forget()
    boton_reiniciar.pack_forget()

    boton_iniciar.pack(pady=20)

#creamos el boton de reiniciar (con la función que llama)
boton_reiniciar = tk.Button(frameInformacion,
                             text="Reiniciar", font=("Arial", 18),width=12, command=reiniciar_quiz)

#empezamos a iniciar y declarar nuestros elementos de captura de video
#Primero abrimos la camara
cap = cv2.VideoCapture(0)#el valor dentro es el numero de camara(pueden estar conectadas varias)
labelCamara = tk.Label(frameCamara)
labelCamara.pack()

def actualizarCamara():
    global quiz_activo, pregunta_actual

    #a nuestra cámara(video) lo descomponemos en frames
    ret, frame = cap.read()
    if ret:#ret significaque la lectura fue exitosa (return (regresó algo))

        #Llamamos a nuestra función del modelo y le insertamos el frame
        #nos devuelve la forma y la figura
        forma_detectada, color_detectado = modelo_1(frame)

        # Actualizamos la info dentro de la interfaaz
        label_forma_detectada.config(text=f"Forma detectada: {forma_detectada}")
        label_color_detectado.config(text=f"Color detectado: {color_detectado}")

        #Aquí controlamos la lógica del quiz cuando está activo
        if quiz_activo:
            #dentro de la interfaz activa (quiz)
            forma_objetivo, color_objetivo = preguntas[pregunta_actual]
            #hacemos la comparacion entre la lista y la que obtiene de la camara
            if forma_detectada == forma_objetivo and color_detectado == color_objetivo:
                #de ser cierto necesitamos indicar que es acertó y avanzamos a la siguiente
                pregunta_actual += 1

                #colocamos un limite para que solo se repita cuando "exista" una 'pregunta'
                if pregunta_actual < len(preguntas):
                    #actualizamos los labels para la siguiente forma
                    forma, color = preguntas[pregunta_actual]
                    label_instruccion.config(text=f"Muéstrame un {forma} {color}")
                    label_puntuacion.config(text=f"Pregunta {pregunta_actual+1}/{len(preguntas)}")
                else:
                    #una vez completó todas las figuras significa que terminó el quiz
                    label_instruccion.config(text="¡Quiz completado!")
                    label_puntuacion.config(text="")
                    boton_reiniciar.pack(pady=20)
                    quiz_activo = False

        # Para poder mostrar nuextro "video", obtenemos el video a color RGB (opencv usa BGR)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        #Utilizamos un formato de PIL  
        img = Image.fromarray(frame_rgb)
        #convertimos el formato PIL a uno que se pueda mostrar usando Tkinter
        imgtk = ImageTk.PhotoImage(image=img)
        #la mostramos en su label de camra
        labelCamara.imgtk = imgtk
        #indicamos que recibe imagenes
        labelCamara.configure(image=imgtk)
    
    labelCamara.after(10, actualizarCamara)
#arrancamos una vez la camara
actualizarCamara()
#"Actualizamos" indefinidamente la ventana
root.mainloop()
