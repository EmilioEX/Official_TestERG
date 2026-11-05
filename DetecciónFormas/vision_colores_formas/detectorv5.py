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

    figuras_detectadas = []
    colores_detectados = []

    mejor_contorno = None

    for c in contours:
        area = cv2.contourArea(c)
        if area < 4000:  # elimina ruido pequeño
            continue

        perimetro = cv2.arcLength(c, True)
        if perimetro < 300:  # elimina contornos incompletos
            continue

        approx = cv2.approxPolyDP(c, 0.03 * perimetro, True)

        if not cv2.isContourConvex(approx):
            continue  # elimina contornos deformados

        if len(approx) < 3 or len(approx) > 8:
            continue  # elimina ruido sin forma

        # Si pasa todos los filtros, es una figura real
        mejor_contorno = approx
        break

    if mejor_contorno is not None:
        x, y, w, h = cv2.boundingRect(mejor_contorno)

        lados = len(mejor_contorno)
        figura = "Desconocida"
        if lados == 3:
            figura = "Triángulo"
        elif lados == 4:
            figura = "Cuadrado/Rectángulo"
        elif lados > 6:
            figura = "Círculo"

        figuras_detectadas.append(figura)

        cx = x + w//2
        cy = y + h//2
        color = detectar_color(hsv[cy, cx])
        colores_detectados.append(color)

        cv2.drawContours(frame, [mejor_contorno], -1, (0,255,0), 3)
        cv2.putText(frame, f"{figura} - {color}", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,255), 2)

    panel = np.zeros((frame.shape[0], 300, 3), dtype=np.uint8)

    y_offset = 30
    cv2.putText(panel, "Detectado:", (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

    for f, c in zip(figuras_detectadas, colores_detectados):
        y_offset += 30
        cv2.putText(panel, f"{f} - {c}", (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

    salida = np.hstack((frame, panel))
    cv2.imshow("Detección en tiempo real", salida)

    if cv2.waitKey(1) == 27:
        break

cam.release()
cv2.destroyAllWindows()
