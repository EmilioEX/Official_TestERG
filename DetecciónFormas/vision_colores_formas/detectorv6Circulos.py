import cv2
import numpy as np

cam = cv2.VideoCapture(0)

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

while True:
    ret, frame = cam.read()
    if not ret:
        break

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Suavizado fuerte para eliminar ruido del fondo
    blur = cv2.GaussianBlur(gray, (9,9), 2)

    # --- Detección de círculos con Hough ---
    circles = cv2.HoughCircles(
        blur,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=60,
        param1=80,
        param2=35,
        minRadius=20,
        maxRadius=200
    )

    figuras_detectadas = []
    colores_detectados = []

    if circles is not None:
        circles = np.uint16(np.around(circles))
        
        # Tomar solo el círculo más grande (más definido)
        circles = sorted(circles[0], key=lambda c: c[2], reverse=True)
        c = circles[0]

        cx, cy, r = c

        # Detectar color del centro
        color = detectar_color(hsv[cy, cx])

        figuras_detectadas.append("Círculo")
        colores_detectados.append(color)

        # Dibujar círculo
        cv2.circle(frame, (cx, cy), r, (0,255,0), 3)
        cv2.circle(frame, (cx, cy), 2, (0,0,255), 3)

        cv2.putText(frame, f"Círculo - {color}", (cx - r, cy - r - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

    # --- Panel lateral ---
    panel = np.zeros((frame.shape[0], 300, 3), dtype=np.uint8)

    y_offset = 30
    cv2.putText(panel, "Detectado:", (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

    for f, c in zip(figuras_detectadas, colores_detectados):
        y_offset += 30
        cv2.putText(panel, f"{f} - {c}", (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

    salida = np.hstack((frame, panel))
    cv2.imshow("Detección de círculos", salida)

    if cv2.waitKey(1) == 27:
        break

cam.release()
cv2.destroyAllWindows()
