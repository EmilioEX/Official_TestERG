import cv2
import numpy as np

# --- Configuración de cámara ---
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

    # Convertimos a HSV
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3,3), 0)

    # Umbral para detectar contornos
    # _, thresh = cv2.threshold(blur, 100, 255, cv2.THRESH_BINARY)
    # contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    edges = cv2.Canny(blur, 50, 150)
    kernel = np.ones((3,3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)

    contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    figuras_detectadas = []
    colores_detectados = []
    contours, hierarchy = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    contornos_filtrados = []

    for i, c in enumerate(contours):
        area = cv2.contourArea(c)
        if area < 3000:
            continue

        # Ignorar contornos internos (hijos)
        if hierarchy[0][i][3] != -1:
            continue

        approx = cv2.approxPolyDP(c, 0.04 * cv2.arcLength(c, True), True)

        if len(approx) > 10:
            continue

        if not cv2.isContourConvex(approx):
            continue

        contornos_filtrados.append(c)


    for c in contornos_filtrados:
        area = cv2.contourArea(c)
        if area < 1000:
            continue

        approx = cv2.approxPolyDP(c, 0.04 * cv2.arcLength(c, True), True)
        x, y, w, h = cv2.boundingRect(approx)

        if len(approx) > 10:
            continue

        if not cv2.isContourConvex(approx):
            continue

        # Detectar figura
        figura = "Desconocida"
        if len(approx) == 3:
            figura = "Triángulo"
        elif len(approx) == 4:
            figura = "Cuadrado/Rectángulo"
        elif len(approx) > 6:
            figura = "Círculo"

        figuras_detectadas.append(figura)

        # Detectar color del centro del contorno
        cx = x + w//2
        cy = y + h//2
        color = detectar_color(hsv[cy, cx])
        colores_detectados.append(color)

        # Dibujar contorno y texto
        cv2.drawContours(frame, [approx], -1, (0,255,0), 2)
        cv2.putText(frame, f"{figura} - {color}", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 2)

    # --- Panel lateral con texto ---
    panel = np.zeros((frame.shape[0], 300, 3), dtype=np.uint8)

    y_offset = 30
    cv2.putText(panel, "Detectado:", (10, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

    for f, c in zip(figuras_detectadas, colores_detectados):
        y_offset += 30
        cv2.putText(panel, f"{f} - {c}", (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

    # Unimos cámara + panel
    salida = np.hstack((frame, panel))

    cv2.imshow("Detección en tiempo real", salida)

    if cv2.waitKey(1) == 27:
        break

cam.release()
cv2.destroyAllWindows()