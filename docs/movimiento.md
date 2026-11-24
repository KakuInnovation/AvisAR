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

## Qué se anima

| Elemento | Propósito | Movimiento | Duración y curva |
| --- | --- | --- | --- |
| Todos los botones | Feedback | `scale(0.97)` al presionar | 120ms, ease-out |
| Pestañas Patente / VIN / Marca | Estado | El fondo negro se desliza con `translateX` y el contenido aparece con un fundido | 160ms, ease-in-out / ease-out |
| Error del formulario | Feedback | `translateY(4px→0)` + opacidad, dentro de un `role="alert"` que ya existe en la página | 160ms, ease-out |
| Menú móvil | Espacial | `clip-path` de arriba hacia abajo | 220ms, ease-out |
| Resultado: tarjeta del vehículo | Evitar un cambio brusco | `translateY(12px→0)` + opacidad | 220ms, ease-out |
| Resultado: silueta | Espacial (llega el auto) | `translateX(-12px→0)`, con 60ms de retraso | 260ms, ease-out |
| Resultado: banner de estado | Estado | `translateY(8px→0)` con 80ms de retraso. Si el riesgo es crítico, **un solo** anillo amarillo que se expande y desaparece | 220ms + 400ms, una vez |
| Resultado: campañas | Evitar un cambio brusco | Escalonado de 160ms + 40ms × i (máximo 6) | 220ms, ease-out |
| Resultado: informe | Evitar un cambio brusco | `translateY(8px→0)` con 200ms de retraso | 220ms, ease-out |
| «Resumen copiado» | Feedback | `translateY(4px→0)` + opacidad | 160ms, ease-out |

Todo el revelado del resultado termina antes de los 500ms. Al cambiar de pantalla, el foco va al `h1`, el scroll vuelve arriba sin animación y la pantalla cambia al instante.

## Qué NO se anima (y por qué)

- **La franja de peligro:** animarla sería ruido constante e incumpliría WCAG 2.2.2.
- **Patente, VIN, cifras y nivel de riesgo:** son datos que la persona lee, así que no se mueven por estilo. Nada de contadores animados.
- **Las secciones de la portada al hacer scroll:** sumarían ruido y demorarían la lectura.
- **La navegación entre pantallas:** es frecuente y el usuario ya decidió irse, así que el cambio es instantáneo.
- **El banner crítico:** no parpadea, no late y no se sacude. La urgencia la dan el color, el ícono y el texto.
- **Hover en tarjetas:** solo cambia el color, y únicamente en dispositivos con puntero (Tailwind v4 limita `hover:` a `(hover: hover)`).

## Movimiento reducido

Con `prefers-reduced-motion: reduce` desaparecen los desplazamientos, las escalas, el anillo, el `clip-path` del menú y la animación del escáner. Quedan solo los fundidos de opacidad, porque ayudan a entender qué apareció.

## Ajustes para celular (`mobile-native`)

- `viewport-fit=cover` y `theme-color` asfalto, para que la barra del navegador combine con el encabezado.
- Sin el destello gris al tocar (`-webkit-tap-highlight-color`) y con `touch-action: manipulation` en botones y enlaces, para que el toque no tenga demora.
- Los botones no seleccionan texto con una pulsación larga.
- Los campos de texto quedan en 16px o más, así el navegador no hace zoom al enfocarlos.
