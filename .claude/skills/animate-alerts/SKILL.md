---
name: animate-alerts
description: Animar avisos y alertas en una app de seguridad (banners de riesgo, errores, confirmaciones) para que transmitan urgencia sin alarmar y sigan siendo accesibles. Usala para los banners de riesgo, toasts y errores de formulario de AvisAR.
---

# Animar alertas sin alarmar

Skill de construcción para una sola cosa: cómo aparece un aviso (banner de riesgo crítico/alto/medio, error de formulario, confirmación). Leé `signal-motion` primero. Para la secuencia completa del resultado usá `animate-results-reveal`.

## Postura

El usuario acaba de enterarse de que su auto podría fallar. El movimiento tiene que **llamar la atención una vez y después quedarse quieto**. La urgencia la ponen el color, el ícono y las palabras, no el movimiento. Decidí, explicá en una línea y escribí el código.

## Reglas duras

1. **Un llamado de atención ocurre una vez.** Nunca `infinite`. Ni pulso en loop, ni parpadeo, ni sacudida.
2. **Nada de sacudidas en errores.** Se lee como castigo y es inaccesible. Fade + `translateY` corto.
3. **Animación y anuncio van juntos.** La región `role="alert"` o `aria-live` tiene que **existir en el DOM** antes de que cambie su contenido.
4. **El estado final es estático y completo.** Sin la animación no se pierde nada.
5. **A más severidad, menos movimiento.** Ninguna rebota.

## Recetas

| Caso | Entrada | Duración | Región |
| --- | --- | --- | --- |
| Banner riesgo crítico | `opacity 0→1` + `translateY(8px→0)`, después **un solo** anillo amarillo que se expande y se desvanece | 220ms + 400ms, una vez | `role="alert"` |
| Banner riesgo alto/medio | `opacity 0→1` + `translateY(8px→0)` | 220ms | `role="alert"` |
| Sin campañas | `opacity 0→1` + ícono `scale(0.9→1)` | 220ms | `role="status"` |
| Error de formulario | `opacity 0→1` + `translateY(-4px→0)` | 160ms | `role="alert"` |
| «Resumen copiado» | `opacity 0→1` + `translateY(4px→0)` | 160ms | `aria-live="polite"` |

Todas usan `var(--ease-out)`. En reduced motion queda solo la opacidad y no hay anillo.

## Foco

- Banner crítico tras una búsqueda: **no robes el foco**. Movelo al `h1` del resultado.
- Error de formulario: el foco queda en el campo, enlazado con `aria-describedby`.

## Checklist

- [ ] Sin `infinite`, sin sacudida, sin parpadeo.
- [ ] La región viva existía antes del texto.
- [ ] El contraste se mantiene durante la animación.
- [ ] Reduced motion deja solo opacidad.
- [ ] La severidad se entiende sin color y sin movimiento (ícono + palabra).
