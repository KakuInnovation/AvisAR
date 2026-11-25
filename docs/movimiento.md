# Movimiento en AvisAR

Este documento sale de aplicar las skills de `.claude/skills/`: `find-animation-opportunities`, `signal-motion`, `animate-results-reveal`, `animate-alerts`, `choreograph`, `emil-design-eng` y `mobile-native`. Los tokens están en `src/index.css`.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entradas y salidas |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Movimiento dentro de la pantalla (indicador de pestañas) |
| `--dur-press` | 120ms | Presionar botones |
| `--dur-quick` | 160ms | Pestañas, confirmaciones, errores |
| `--dur-enter` | 220ms | Tarjetas, banners, menú |
| `--dur-stagger` | 40ms | Separación entre campañas (máximo 6) |

## Qué se anima (ronda expresiva)

Las piezas viven en `src/motion.tsx` y usan `motion/react`.

| Elemento | Propósito | Movimiento | Duración y curva |
| --- | --- | --- | --- |
| Portada: carriles de la ruta | Metáfora | `scaleY 0→1` desde abajo, escalonado de 80ms | 600ms, ease-out |
| Portada: SUV | Metáfora («auto detenido con un aviso») | Entra desde la izquierda con resorte, ruedas que giran y frenan, balizas que se encienden 2 veces a 2 Hz y quedan fijas | resorte 0,9 s, bounce 0,15, delay 200ms |
| Portada: etiqueta | Jerarquía | `y 8→0` + opacidad | 300ms, delay 300ms |
| Portada: H1 | Jerarquía | Palabra por palabra desde una máscara (`y 105%→0`), escalonado de 60ms | 450ms, delay 380ms |
| Portada: buscador | Jerarquía | `y 40→0` con resorte; después la sombra amarilla se corre 10px con `transform` | resorte 0,6 s, bounce 0,2, delay 700ms |
| Portada: foco | Atajo | Pasa al campo de patente a los 900ms si no se tocó nada (solo con puntero fino) | |
| Cifras | Énfasis | Cuentan desde 0 una vez al verse | 900ms, ease-out |
| «Cómo funciona» | Explicar | Sticky de 260vh: se tipea la patente, aparece el resultado y el informe vuela a WhatsApp, ligado al scroll. En celular, tarjetas `whileInView` | 300ms por paso |
| Tarjetas de carrocería | Feedback | Hover: suben 6px, aparece la sombra amarilla, la silueta avanza 8px. Presión: `scale(0.97)` | 200ms |
| Cambio de pantalla | Continuidad | `AnimatePresence mode="wait"`: entra `y 16→0` 260ms, sale con opacidad 160ms. Patente con `layoutId="plate"`. Foco al `h1` al terminar la entrada | |
| Carga | Estado | 5 testigos (motor, frenos, airbag, batería, aviso) que se encienden cada 120ms, una pasada, con «Consultando fuentes…» | 120ms c/u |
| Resultado: tablero | Espacial | La franja oscura baja con `clip-path` | 220ms |
| Resultado: auto | Espacial | `x -80→0` con resorte corto | 0,5 s, delay 120ms |
| Resultado: testigos | Estado | Chequeo de encendido: todos se prenden ~150ms una vez y quedan los de las campañas (o el check verde) | delay 200ms |
| Resultado: banner | Estado | `y 8→0`; si es crítico, un único anillo | 220ms + 400ms, delay 420ms |
| Resultado: campañas | Evitar un cambio brusco | `y 24→0`, escalonado de 50ms (máx. 6), con ícono del componente | 260ms, desde 500ms |
| Resultado: informe | Metáfora (impresora) | `clip-path` de arriba hacia abajo, sombra incluida | 400ms, delay 550ms |
| Compartir / copiar | Feedback | Pulso `1→1.02→1` y check que se dibuja con `pathLength` | 320ms / 300ms |
| Talleres: botón | Progreso | Barra amarilla `scaleX 0→1` mientras procesa | 400ms + 120ms por unidad (máx. 1,4 s) |
| Talleres: filas y totales | Evitar un cambio brusco | Filas escalonadas 30ms (máx. 12); totales cuentan desde 0 | 220ms |

Todo el revelado del resultado termina antes de los 900ms.

## Qué NO se anima (y por qué)

- **La franja de peligro:** sería ruido constante e incumpliría WCAG 2.2.2.
- **Patente, VIN y nivel de riesgo:** aparecen, pero no rebotan ni se deslizan por estilo.
- **El banner crítico:** no parpadea, no late y no se sacude. La urgencia la dan el color, el ícono y el texto.
- **Nada en loop:** las balizas destellan 2 veces y el chequeo de testigos es un único destello (WCAG 2.3.1 y 2.2.2).

## Movimiento reducido

Con `prefers-reduced-motion: reduce` (`useReducedMotion()` en Motion y la media query en CSS):

- No hay intro: el auto, la ruta y el título aparecen en su estado final.
- Las cifras muestran el valor final, sin contar.
- La carga muestra solo «Consultando fuentes…», sin testigos.
- Los testigos del resultado aparecen directamente en su estado final.
- El cambio de pantalla, las campañas y el informe usan solo fundidos de opacidad de 200ms, sin retraso.
- «Cómo funciona» queda estático, mostrando el resultado de ejemplo.

## Ajustes para celular (`mobile-native`)

- `viewport-fit=cover` y `theme-color` asfalto.
- Sin destello gris al tocar y con `touch-action: manipulation`.
- Los botones no seleccionan texto con una pulsación larga.
- Campos de 16px o más para que el navegador no haga zoom.
- A 390×844 el buscador entra completo en la primera pantalla.
