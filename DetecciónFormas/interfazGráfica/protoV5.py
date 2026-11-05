import tkinter as tk
from PIL import Image, ImageTk
import cv2
import numpy as np

# ---------------------------
# MODELO 1: DETECCIÓN REAL
# ---------------------------

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
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (11, 11), 0)

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

    x, y, w, h = cv2.boundingRect(mejor_contorno)
    lados = len(mejor_contorno)

    figura = "Desconocida"
    if lados == 3:
        figura = "Triángulo"
    elif lados == 4:
        figura = "Rectángulo"
    elif lados > 6:
        figura = "Círculo"

    cx = x + w // 2
    cy = y + h // 2
    color = detectar_color(hsv[cy, cx])

    # DIBUJAR EN EL FRAME
    cv2.drawContours(frame, [mejor_contorno], -1, (0,255,0), 3)
    cv2.putText(frame, f"{figura} - {color}", (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

    return figura, color

# ---------------------------
# CONFIGURACIÓN PRINCIPAL
# ---------------------------

root = tk.Tk()
root.title("Detector de Formas y Colores - Quiz")
root.geometry("1200x600")

quiz_activo = False
puntuacion = 0
modelo_activo = 1

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
label_titulo.pack(pady=20)

# Etiquetas permanentes de detección
label_forma_detectada = tk.Label(frameInformacion, text="Forma detectada: ---",
                                 fg="white", bg="#222", font=("Arial", 16))
label_forma_detectada.pack(pady=10)

label_color_detectado = tk.Label(frameInformacion, text="Color detectado: ---",
                                 fg="white", bg="#222", font=("Arial", 16))
label_color_detectado.pack(pady=10)

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
boton_iniciar.pack(pady=20)

label_instruccion = tk.Label(
    frameInformacion,
    text="Muéstrame un rectángulo azul",
    fg="white",
    bg="#222",
    font=("Arial", 22, "bold")
)

label_puntuacion = tk.Label(
    frameInformacion,
    text="(0/1)",
    fg="white",
    bg="#222",
    font=("Arial", 18)
)

def salir_quiz():
    global quiz_activo
    quiz_activo = False

    label_instruccion.pack_forget()
    label_puntuacion.pack_forget()
    boton_salir.pack_forget()

    boton_iniciar.pack(pady=20)

boton_salir = tk.Button(
    frameInformacion,
    text="Salir",
    font=("Arial", 18),
    width=10,
    command=salir_quiz
)

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

        # MODELO SIEMPRE ACTIVO
        if modelo_activo == 1:
            forma_detectada, color_detectado = modelo_1(frame)
        else:
            forma_detectada, color_detectado = "Desconocida", "Desconocido"

        # Actualizar etiquetas permanentes
        label_forma_detectada.config(text=f"Forma detectada: {forma_detectada}")
        label_color_detectado.config(text=f"Color detectado: {color_detectado}")

        # LÓGICA DEL QUIZ
        if quiz_activo:
            if forma_detectada == "Rectángulo" and color_detectado == "Azul":
                puntuacion = 1
                label_puntuacion.config(text="(1/1)")
                boton_salir.pack(pady=20)
                quiz_activo = False

        # Mostrar frame con dibujos
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame_rgb)
        imgtk = ImageTk.PhotoImage(image=img)
        labelCamara.imgtk = imgtk
        labelCamara.configure(image=imgtk)

    labelCamara.after(10, actualizarCamara)

actualizarCamara()
root.mainloop()
