import cv2
import numpy as np
import random
from flask import Flask, render_template, Response, request, jsonify, session

app = Flask(__name__)
app.secret_key = 'clave_secreta_para_sesiones_quiz' # Necesario para manejar el estado del quiz en Flask

# ==========================================
# BLOQUE 1: PROCESAMIENTO DE IMAGEN Y VIDEO
# ==========================================

def inicializar_camara():
    """Inicializa la captura de video desde la cámara web predeterminada."""
    # 0 suele ser la cámara web integrada o conectada por USB
    cap = cv2.VideoCapture(0)
    return cap

def convertir_a_gris(frame):
    """Convierte un frame de BGR a escala de grises."""
    return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

def preprocesar_frame(frame):
    """Aplica filtros básicos (blur y escala de grises) para mejorar la detección."""
    gris = convertir_a_gris(frame)
    # Desenfoque gaussiano para reducir ruido en la imagen
    suavizado = cv2.GaussianBlur(gris, (5, 5), 0)
    _, thresh = cv2.threshold(suavizado, 200, 255, cv2.THRESH_BINARY_INV)
    return thresh

def detectar_color(frame, cX, cY):
    """
    Detecta el color predominante (Azul, Amarillo, Rojo) en las coordenadas (cX, cY)
    o en la región de la figura detectada utilizando espacios de color HSV.
    """
    # Convertir el frame a espacio HSV para un mejor filtrado de colores
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Extraer un pequeño parche alrededor del centro de la figura para mayor precisión
    h, w, _ = hsv.shape
    if 0 <= cX < w and 0 <= cY < h:
        pixel_hsv = hsv[cY, cX]
        hue = pixel_hsv[0]
        sat = pixel_hsv[1]
        val = pixel_hsv[2]

        # Si el color tiene muy poca saturación o brillo muy bajo/alto, se descarta
        if sat < 50 or val < 50:
            return "desconocido"

        # Rangos de Matiz (Hue) aproximados en OpenCV (0-179)
        # Rojo: suele dividirse en dos rangos (0-10 y 170-179), aquí simplificamos o evaluamos
        if (0 <= hue <= 10) or (160 <= hue <= 179):
            return "rojo"
        elif 100 <= hue <= 130:
            return "azul"
        elif 20 <= hue <= 35:
            return "amarillo"
            
    return "desconocido"

def detectar_figura_y_color(frame):
    """
    Analiza el frame para identificar contornos, clasificar la figura geométrica 
    y determinar su color. Dibuja las anotaciones sobre el frame.
    """
    copia_frame = frame.copy()
    gris = cv2.cvtColor(copia_frame, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gris, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY)

    # Encontrar contornos
    contornos, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    figura_detectada = "desconocido"
    color_detectado = "desconocido"

    for c in contornos:
        # Ignorar contornos muy pequeños para evitar ruido
        if cv2.contourArea(c) > 1500:
            # Calcular perímetro y aproximación de polígonos
            perimetro = cv2.arcLength(c, True)
            aproximacion = cv2.approxPolyDP(c, 0.04 * perimetro, True)
            vertices = len(aproximacion)

            # Obtener el centroide de la figura para evaluar el color
            M = cv2.moments(c)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
            else:
                cX, cY = 0, 0

            # Clasificación geométrica según número de vértices o redondez
            if vertices == 3:
                figura_detectada = "triangulo"
            elif vertices == 4:
                # Diferenciar entre cuadrado y rectángulo evaluando la relación de aspecto
                x, y, w, h = cv2.boundingRect(aproximacion)
                aspect_ratio = float(w) / h
                if 0.95 <= aspect_ratio <= 1.05:
                    figura_detectada = "cuadrado"
                else:
                    figura_detectada = "desconocido"
            elif vertices > 4:
                # Evaluar circularidad para determinar si es un círculo
                area = cv2.contourArea(c)
                perimetro_circulo = cv2.arcLength(c, True)
                if perimetro_circulo > 0:
                    circularidad = 4 * np.pi * (area / (perimetro_circulo * perimetro_circulo))
                    if 0.75 <= circularidad <= 1.25:
                        figura_detectada = "circulo"
                    else:
                        figura_detectada = "desconocido"

            # Detectar el color si la figura es válida
            if figura_detectada != "desconocido":
                color_detectado = detectar_color(copia_frame, cX, cY)
                # Dibujar el contorno y etiquetas sobre el frame
                cv2.drawContours(copia_frame, [aproximacion], -1, (0, 255, 0), 2)
                cv2.putText(copia_frame, f"{figura_detectada} {color_detectado}", (cX - 40, cY - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                break # Tomar la primera figura relevante encontrada

    return copia_frame, figura_detectada, color_detectado

def generar_frames(cap):
    """Generador de streaming de video (MJPEG) para Flask sin retrasos."""
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # Procesar el frame con nuestra función modular de visión artificial
            frame_procesado, _, _ = detectar_figura_y_color(frame)
            
            # Codificar el frame en formato JPEG
            ret, buffer = cv2.imencode('.jpg', frame_procesado)
            frame_bytes = buffer.tobytes()
            
            # Formato requerido para multipart streaming en tiempo real
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


# ==========================================
# BLOQUE 2: LÓGICA DE JUEGO (BOLSA TIPO TETRIS)
# ==========================================

# Variables configurables de escalabilidad del Quiz
TOTAL_PREGUNTAS_DEFAULT = 5 
FIGURAS_DISPONIBLES = ["cuadrado", "triangulo", "circulo"]
COLORES_DISPONIBLES = ["azul", "amarillo", "rojo"]

def crear_bolsa_tetris():
    """
    Crea una 'bolsa' con todas las combinaciones posibles de figuras y colores,
    mezcladas aleatoriamente para evitar repeticiones excesivas (estilo Tetris bag).
    """
    bolsa = []
    for figura in FIGURAS_DISPONIBLES:
        for color in COLORES_DISPONIBLES:
            bolsa.append({"figura": figura, "color": color})
    random.shuffle(bolsa)
    return bolsa

def obtener_siguiente_pregunta_quiz(session_data):
    """Extrae la siguiente pregunta asegurando la aleatoriedad sin sesgo de repetición."""
    if not session_data.get('bolsa') or len(session_data['bolsa']) == 0:
        session_data['bolsa'] = crear_bolsa_tetris()
    
    # Sacar un elemento de la bolsa
    pregunta = session_data['bolsa'].pop(0)
    return pregunta


# ==========================================
# BLOQUE 3: RUTAS Y CONTROLADORES DE FLASK
# ==========================================

@app.route('/')
def index():
    """Renderiza la interfaz principal dividida en dos partes (Cámara + Panel de Estado)."""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Ruta encargada de transmitir el streaming de la cámara web."""
    cap = inicializar_camara()
    return Response(generar_frames(cap),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/estado_actual')
def estado_actual():
    """API ligera para que el panel derecho de la interfaz actualice el texto detectado en tiempo real."""
    cap = cv2.VideoCapture(0)
    success, frame = cap.read()
    if success:
        _, figura, color = detectar_figura_y_color(frame)
        cap.release()
        return jsonify({"figura": figura, "color": color})
    cap.release()
    return jsonify({"figura": "desconocido", "color": "desconocido"})

@app.route('/quiz')
def quiz():
    """Inicia o continúa la vista del Quiz."""
    # Inicializar la sesión del quiz si no existe
    if 'quiz_activo' not in session or not session['quiz_activo']:
        session['quiz_activo'] = True
        session['preguntas_totales'] = TOTAL_PREGUNTAS_DEFAULT
        session['preguntas_respondidas'] = 0
        session['aciertos'] = 0
        session['bolsa'] = crear_bolsa_tetris()
        session['pregunta_actual'] = obtener_siguiente_pregunta_quiz(session)

    return render_template('quiz.html', 
                           pregunta=session['pregunta_actual'], 
                           progreso=f"{session['preguntas_respondidas'] + 1}/{session['preguntas_totales']}")

@app.route('/api/verificar_respuesta', methods=['POST'])
def verificar_respuesta():
    """Valida si lo que muestra la cámara coincide con el objetivo actual del quiz."""
    if 'quiz_activo' not in session or not session['quiz_activo']:
        return jsonify({"estado": "terminado"})

    # Capturar estado actual de la cámara
    cap = cv2.VideoCapture(0)
    success, frame = cap.read()
    cap.release()

    if not success:
        return jsonify({"error": "No se pudo acceder a la cámara"})

    _, figura_cam, color_cam = detectar_figura_y_color(frame)
    
    objetivo = session['pregunta_actual']
    
    # Comprobar si coincide figura y color con el objetivo de la pregunta
    match = (figura_cam == objetivo['figura'] and color_cam == objetivo['color'])

    if match:
        session['preguntas_respondidas'] += 1
        session['aciertos'] += 1

        # Verificar si el quiz ha finalizado
        if session['preguntas_respondidas'] >= session['preguntas_totales']:
            session['quiz_activo'] = False
            return jsonify({"resultado": "ganador", "siguiente": "ganador"})
        else:
            # Siguiente pregunta de la bolsa
            session['pregunta_actual'] = obtener_siguiente_pregunta_quiz(session)
            return jsonify({"resultado": "correcto", "siguiente_pregunta": session['pregunta_actual']})

    return jsonify({"resultado": "esperando", "detectado": {"figura": figura_cam, "color": color_cam}})

@app.route('/ganador')
def ganador():
    """Pantalla de victoria."""
    return render_template('win.html')

@app.route('/perdedor')
def perdedor():
    """Pantalla de derrota."""
    return render_template('gameover.html')


# ==========================================
# BLOQUE 4: PUNTO DE ENTRADA PRINCIPAL
# ==========================================
if __name__ == '__main__':
    # Ejecutar la aplicación Flask en modo local
    app.run(debug=True, threaded=True)