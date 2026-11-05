import tkinter as tk
from PIL import Image,ImageTk
import cv2

#JFrame de python
root = tk.Tk()
#propiedades del objeto creado
root.title("Detector de Formas y Colores")
root.geometry("1200x600")

# CONFIGURAR GRID DEL ROOT
root.grid_columnconfigure(0, weight=1)   # 50%
root.grid_columnconfigure(1, weight=1)   # 50%
root.grid_rowconfigure(0, weight=1)

# FRAME CAMARA (izquierda)
frameCamara = tk.Frame(root, bg="black")
frameCamara.grid(row=0, column=0, sticky="nsew")
frameCamara.grid_propagate(False)
frameCamara.config(width=600)

# FRAME INFORMACION (derecha)
frameInformacion = tk.Frame(root, bg="#222")
frameInformacion.grid(row=0, column=1, sticky="nsew")

#elementos extra
label_titulo = tk.Label(
    frameInformacion,
    text="QUIZ",
    fg="white",
    bg="#222",
    font=("Arial", 28, "bold")
)
label_titulo.pack(pady=40)

# Botón de iniciar
def iniciar_quiz():
    print("Quiz iniciado")  # Aquí luego conectamos la lógica real

boton_iniciar = tk.Button(
    frameInformacion,
    text="Iniciar",
    font=("Arial", 18),
    width=10,
    command=iniciar_quiz
)
boton_iniciar.pack(pady=40)

# Etiquetas de forma y color detectados
label_forma = tk.Label(
    frameInformacion,
    text="Forma: ---",
    fg="white",
    bg="#222",
    font=("Arial", 16)
)
label_forma.pack(pady=20)

label_color = tk.Label(
    frameInformacion,
    text="Color: ---",
    fg="white",
    bg="#222",
    font=("Arial", 16)
)
label_color.pack(pady=10)



#Bloque encargado de actualizar la info del frame de la camara
cap = cv2.VideoCapture(0)


labelCamara = tk.Label(frameCamara)
labelCamara.pack()

def actualizarCamara():
    ret, frame = cap.read()
    if ret:
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame)
        imgtk = ImageTk.PhotoImage(image=img)
        labelCamara.imgtk = imgtk
        labelCamara.configure(image=imgtk)
    labelCamara.after(10, actualizarCamara)

actualizarCamara()
#inicializacion de la pantalla/app
root.mainloop()