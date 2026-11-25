---
name: animate-results-reveal
description: Coreografiar el paso de una búsqueda a su resultado — carga, revelado escalonado, foco y cero saltos de layout — en apps de consulta como AvisAR. Usala al animar lo que pasa después de tocar «Consultar».
---

# De la búsqueda al resultado

Skill de coreografía para un flujo: la persona toca «Consultar», espera y ve el estado de su auto. Leé `signal-motion` primero. Para el banner de riesgo, `animate-alerts`. Para principios generales, `choreograph`.

## Postura

Es el momento más importante de AvisAR. La persona quiere **una respuesta**: ¿mi auto está bien o no? La coreografía entrega esa respuesta primero y los detalles después. Nunca la hagas esperar una animación para leer el resultado.

## Reglas duras

1. **La respuesta lidera.** Orden de lectura = orden de animación: vehículo → estado → campañas → informe.
2. **Todo el revelado termina en menos de 900ms** (el estado se lee antes de los 500ms). Desde la ronda expresiva la parte de arriba es un «tablero» oscuro: franja con clip-path → auto con resorte → chequeo de testigos (un destello) → banner → campañas → informe que sale de la impresora. Ver `docs/movimiento.md`.
3. **Cero layout shift.** Nada empuja contenido después de aparecer.
4. **El escalonado solo en los primeros 6 elementos** (`--dur-stagger` = 40ms).
5. **El foco va al `h1` del resultado** (`tabIndex={-1}` + `.focus({ preventScroll: true })`) al montar.
6. **La carga es honesta.** Menos de 300ms: sin indicador. Entre 300ms y 2s: spinner en el botón + texto. Más de 2s: esqueleto con la forma final.

## Secuencia

| t (ms) | Elemento | Movimiento |
| --- | --- | --- |
| 0 | Tarjeta del vehículo | `opacity 0→1`, `translateY(12px→0)`, `--dur-enter` |
| 60 | Silueta dentro de la tarjeta | `translateX(-12px→0)`, 260ms, `--ease-out` |
| 80 | Banner de estado | según `animate-alerts` |
| 160 + 40·i | Campañas (máx. 6) | `opacity 0→1`, `translateY(8px→0)`, `--dur-enter` |
| 200 | Informe | `opacity 0→1`, `translateY(8px→0)` |

```css
.reveal { animation: reveal-in var(--dur-enter) var(--ease-out) both; animation-delay: var(--delay, 0ms); }
@keyframes reveal-in { from { opacity: 0; transform: translateY(8px); } }
```

En React, cada campaña recibe `style={{ "--delay": `${160 + Math.min(i, 6) * 40}ms` }}`.

## Volver a buscar

«Nueva consulta» es un cambio instantáneo, sin animación de salida. El foco vuelve al campo de patente.

## Checklist

- [ ] El estado se lee en menos de 300ms desde que llegan los datos.
- [ ] CLS = 0 durante el revelado.
- [ ] El foco cae en el `h1` y el lector anuncia el estado una vez.
- [ ] Con reduced motion: todo junto, solo opacidad.
