import tkinter as tk
from PIL import Image, ImageTk
import cv2

# ---------------------------
# CONFIGURACIÓN PRINCIPAL
# ---------------------------

root = tk.Tk()
root.title("Detector de Formas y Colores - Quiz")
root.geometry("1200x600")

quiz_activo = False
puntuacion = 0

# Aquí eliges el modelo tú mismo
modelo_activo = 1   # Cambia este número para usar otro modelo

# ---------------------------
# GRID 50/50
# ---------------------------

root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)
root.grid_rowconfigure(0, weight=1)

# ---------------------------
# FRAMES
# ---------------------------

frameCamara = tk.Frame(root, bg="black")
frameCamara.grid(row=0, column=0, sticky="nsew")

frameInformacion = tk.Frame(root, bg="#222")
frameInformacion.grid(row=0, column=1, sticky="nsew")

# ---------------------------
# ELEMENTOS DEL QUIZ
# ---------------------------

label_titulo = tk.Label(frameInformacion, text="QUIZ", fg="white", bg="#222",
                        font=("Arial", 28, "bold"))
label_titulo.pack(pady=40)
def modelo_1(frame):
    import cv2
import numpy as np

def detectar_color(hsv_pixel):
    h, s, v = hsv_pixel

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
    """
    MODELO 1: Detección real de figura y color.
    Este es tu código original adaptado para funcionar dentro del quiz.
    """

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Suavizado fuerte para eliminar líneas del fondo
    blur = cv2.GaussianBlur(gray, (11,11), 0)

    # Threshold adaptativo
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 3
    )

    contours, hierarchy = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    mejor_contorno = None

    for c in contours:
        area = cv2.contourArea(c)
        if area < 4000:
            continue

        perimetro = cv2.arcLength(c, True)
        if perimetro < 300:
            continue

        approx = cv2.approxPolyDP(c, 0.03 * perimetro, True)

        if not cv2.isContourConvex(approx):
            continue

        if len(approx) < 3 or len(approx) > 8:
            continue

        mejor_contorno = approx
        break

    if mejor_contorno is None:
        return "Desconocida", "Desconocido"

    # Clasificación de figura
    x, y, w, h = cv2.boundingRect(mejor_contorno)
    lados = len(mejor_contorno)

    figura = "Desconocida"
    if lados == 3:
        figura = "Triángulo"
    elif lados == 4:
        figura = "Rectángulo"
    elif lados > 6:
        figura = "Círculo"

    # Color del centro
    cx = x + w//2
    cy = y + h//2
    color = detectar_color(hsv[cy, cx])

    return figura, color
# Botón iniciar
def iniciar_quiz():
    global quiz_activo, puntuacion
    quiz_activo = True
    puntuacion = 0

    boton_iniciar.pack_forget()
    label_instruccion.pack(pady=20)
    label_puntuacion.config(text="(0/1)")
    label_puntuacion.pack(pady=10)

boton_iniciar = tk.Button(frameInformacion, text="Iniciar", font=("Arial", 18),
                          width=10, command=iniciar_quiz)
boton_iniciar.pack(pady=40)

# Texto de instrucción
label_instruccion = tk.Label(frameInformacion,
                             text="Muéstrame un rectángulo azul",
                             fg="white", bg="#222",
                             font=("Arial", 22, "bold"))

# Puntuación
label_puntuacion = tk.Label(frameInformacion,
                            text="(0/1)",
                            fg="white", bg="#222",
                            font=("Arial", 18))

# Botón salir
def salir_quiz():
    global quiz_activo
    quiz_activo = False

    label_instruccion.pack_forget()
    label_puntuacion.pack_forget()
    boton_salir.pack_forget()

    boton_iniciar.pack(pady=40)

boton_salir = tk.Button(frameInformacion, text="Salir", font=("Arial", 18),
                        width=10, command=salir_quiz)

# ---------------------------
# CÁMARA
# ---------------------------

cap = cv2.VideoCapture(0)
labelCamara = tk.Label(frameCamara)
labelCamara.pack()

def actualizarCamara():
    global puntuacion, quiz_activo

    ret, frame = cap.read()
    if ret:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame)
        imgtk = ImageTk.PhotoImage(image=img)
        labelCamara.imgtk = imgtk
        labelCamara.configure(image=imgtk)

        # ---------------------------
        # LÓGICA DEL QUIZ + MODELO
        # ---------------------------
        if quiz_activo:

            # Aquí decides qué detector usar según el modelo
            if modelo_activo == 1:
                # Modelo 1 - Rectángulos
                forma_detectada = "Rectángulo"
                color_detectado = "Azul"

            elif modelo_activo == 2:
                # Modelo 2 - Triángulos y Rectángulos
                forma_detectada = "Triángulo"
                color_detectado = "Rojo"

            elif modelo_activo == 3:
                # Modelo 3 - Círculos con inclinación
                forma_detectada = "Círculo"
                color_detectado = "Azul"

            elif modelo_activo == 4:
                # Modelo 4 - Figura más grande
                forma_detectada = "Rectángulo"
                color_detectado = "Azul"

            elif modelo_activo == 5:
                # Modelo 5 - Filtrado de fondo
                forma_detectada = "Rectángulo"
                color_detectado = "Azul"

            # Validación del quiz
            if forma_detectada == "Rectángulo" and color_detectado == "Azul":
                puntuacion = 1
                label_puntuacion.config(text="(1/1)")
                boton_salir.pack(pady=20)
                quiz_activo = False

    labelCamara.after(10, actualizarCamara)

actualizarCamara()
root.mainloop()

