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
    blur = cv2.GaussianBlur(gray, (11,11), 0)

    # Threshold adaptativo
    thresh = cv2.adaptiveThreshold(
        blur, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, 3
    )

    contours, _ = cv2.findContours(
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    mejor_elipse = None
    mejor_area = 0

    for c in contours:
        area = cv2.contourArea(c)
        if area < 3000:
            continue

        perimetro = cv2.arcLength(c, True)
        if perimetro < 200:
            continue

        # Circularidad
        circularidad = 4 * np.pi * area / (perimetro * perimetro)
        if circularidad < 0.7:
            continue

        if len(c) < 20:
            continue

        # Ajustar elipse
        try:
            ellipse = cv2.fitEllipse(c)
        except:
            continue

        (cx, cy), (major, minor), angle = ellipse

        # Filtrar elipses demasiado deformadas
        ratio = major / minor
        if ratio > 1.2:
            continue

        # Elegir la elipse más grande
        if area > mejor_area:
            mejor_area = area
            mejor_elipse = ellipse

    # -----------------------------
    # BLOQUE CORREGIDO (VALIDACIÓN)
    # -----------------------------
    if mejor_elipse is not None:
        (cx, cy), (major, minor), angle = mejor_elipse

        cx_i = int(cx)
        cy_i = int(cy)

        # Validación para evitar IndexError
        if cy_i < 0 or cy_i >= hsv.shape[0] or cx_i < 0 or cx_i >= hsv.shape[1]:
            continue

        # Detectar color del centro
        color = detectar_color(hsv[cy_i, cx_i])

        # Dibujar elipse
        cv2.ellipse(frame, mejor_elipse, (0,255,0), 3)

        cv2.putText(frame, f"Círculo inclinado - {color}",
                    (cx_i - 50, cy_i - int(minor/2) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

        cv2.putText(frame, f"Inclinación: {int(angle)}°",
                    (cx_i - 50, cy_i + int(minor/2) + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

    cv2.imshow("Detección de círculos inclinados", frame)

    if cv2.waitKey(1) == 27:
        break

cam.release()
cv2.destroyAllWindows()
