import tkinter as tk
from PIL import Image, ImageTk
import cv2

root = tk.Tk()
root.title("Detector de Formas y Colores - Quiz")
root.geometry("1200x600")

# Estado del quiz
quiz_activo = False
puntuacion = 0

# GRID 50/50
root.grid_columnconfigure(0, weight=1)
root.grid_columnconfigure(1, weight=1)
root.grid_rowconfigure(0, weight=1)

# Frame cámara
frameCamara = tk.Frame(root, bg="black")
frameCamara.grid(row=0, column=0, sticky="nsew")

# Frame información
frameInformacion = tk.Frame(root, bg="#222")
frameInformacion.grid(row=0, column=1, sticky="nsew")

# ---------------------------
# ELEMENTOS DEL QUIZ
# ---------------------------

label_titulo = tk.Label(frameInformacion, text="QUIZ", fg="white", bg="#222",
                        font=("Arial", 28, "bold"))
label_titulo.pack(pady=40)

# Botón iniciar
def iniciar_quiz():
    global quiz_activo, puntuacion
    quiz_activo = True
    puntuacion = 0

    boton_iniciar.pack_forget()  # Ocultar botón

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

    # Ocultar elementos del quiz
    label_instruccion.pack_forget()
    label_puntuacion.pack_forget()
    boton_salir.pack_forget()

    # Mostrar botón iniciar
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
        # LÓGICA DEL QUIZ
        # ---------------------------
        if quiz_activo:
            # Aquí conectas tu detector real:
            forma_detectada = "Rectángulo"   # EJEMPLO
            color_detectado = "Azul"         # EJEMPLO

            if forma_detectada == "Rectángulo" and color_detectado == "Azul":
                puntuacion = 1
                label_puntuacion.config(text="(1/1)")
                boton_salir.pack(pady=20)
                quiz_activo = False  # Evita sumar más veces

    labelCamara.after(10, actualizarCamara)

actualizarCamara()
root.mainloop()
