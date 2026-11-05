import cv2
import numpy as np
from flask import Flask, render_template, Response, jsonify

app = Flask(__name__)

# Inicializar la cámara web (0 suele ser la cámara integrada por defecto)
camera = cv2.VideoCapture(0)

# Variables globales para guardar la última detección realizada
ultima_forma = "Desconocida"
ultimo_color = "Desconocido"

def modelo_1(frame):
    # Convertir a HSV para color y escala de grises para contorno
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 3
    )

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    mejor = None
    for c in contours:
        area = cv2.contourArea(c)
        if area < 800: continue

        per = cv2.arcLength(c, True)
        if per < 120: continue

        approx = cv2.approxPolyDP(c, 0.03 * per, True)
        if not cv2.isContourConvex(approx): continue
        if len(approx) < 3 or len(approx) > 8: continue

        mejor = approx
        break

    if mejor is None:
        return "Desconocida", "Desconocido", None

    # Identificar forma
    lados = len(mejor)
    if lados == 3:
        figura = "Triángulo"
    elif lados == 4:
        figura = "Rectángulo"
    elif lados > 6:
        figura = "Círculo"
    else:
        figura = "Desconocida"

    # Identificar color en el centro
    x, y, w, h = cv2.boundingRect(mejor)
    cx = min(max(x + w // 2, 0), frame.shape[1] - 1)
    cy = min(max(y + h // 2, 0), frame.shape[0] - 1)

    pixel = hsv[cy, cx]
    color = detectar_color(pixel)

    return figura, color, mejor


def detectar_color(pixel):
    h, s, v = pixel

    if v < 50: return "Negro"
    if v > 200 and s < 40: return "Blanco"

    if h < 10 or h > 160: return "Rojo"
    if 10 <= h < 25: return "Amarillo"
    if 25 <= h < 70: return "Verde"
    if 70 <= h < 130: return "Azul"
    if 130 <= h < 160: return "Morado"

    return "Desconocido"


def generar_frames():
    global ultima_forma, ultimo_color
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Procesar el frame con OpenCV
            forma, color, contorno = modelo_1(frame)
            
            # Guardar la detección actual
            ultima_forma = forma
            ultimo_color = color

            # Dibujar contorno y texto si hay figura
            if contorno is not None:
                cv2.drawContours(frame, [contorno], -1, (0, 255, 0), 3)
                cv2.putText(frame, f"{forma} - {color}", (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Codificar el frame a JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # Estructura del flujo multipart MJPEG
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route("/")
def home():
    return render_template("index.html")


# Ruta para transmitir el video continuo
@app.route("/video_feed")
def video_feed():
    return Response(generar_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# Ruta para consultar el texto detectado (forma y color)
@app.route("/obtener_datos")
def obtener_datos():
    return jsonify({
        "forma": ultima_forma,
        "color": ultimo_color
    })


if __name__ == "__main__":
    app.run(debug=True)