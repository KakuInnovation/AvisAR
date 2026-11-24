---
name: signal-motion
description: Lenguaje de movimiento de AvisAR para la estética Señal vial — tokens, qué se mueve y qué nunca se mueve, reglas de reduced-motion y WCAG. Usala antes de agregar cualquier animación a AvisAR.
---

# Señal vial: lenguaje de movimiento

Skill de base. Define los tokens y las reglas de movimiento de AvisAR (consulta de recalls: asfalto #111214 + amarillo vial #FFC800). No construye una animación concreta: para eso, después de leer esta, usá `animate`, `choreograph`, `animate-alerts` o `animate-results-reveal`.

## Postura

AvisAR trata de seguridad. El movimiento funciona como la señalética vial: **informa, no decora**. Un cartel no baila; aparece a tiempo y en el lugar correcto. La persona está preocupada por su auto: el movimiento tiene que **calmar y orientar**, nunca alarmar por sí mismo.

Dos errores, el primero es peor:
1. **Movimiento que suma alarma o ruido**: parpadeos, sacudidas, pulsos en loop sobre un recall crítico.
2. **Movimiento genérico**: fade-ins suaves en cada sección, entradas al hacer scroll, parallax decorativo.

## Reglas duras

1. **Tokens primero.** Toda duración y curva sale de los tokens. Nunca inventes un valor.
2. **Solo `transform`, `opacity` y `clip-path`.**
3. **Reduced motion viene con la animación**, no después.
4. **Los datos no se mueven por estilo**: patente, VIN, código de campaña, nivel de riesgo, cifras. Pueden aparecer, nunca rebotar, contar hacia arriba ni deslizarse.
5. **La franja de peligro queda quieta.** Animarla (marquesina) la vuelve ruido constante y viola WCAG 2.2.2.
6. **Nunca más de 3 destellos por segundo** (WCAG 2.3.1). En la práctica: **ningún parpadeo repetido**.
7. **Nada se repite más de 5 s** sin un control para pausarlo (WCAG 2.2.2). El único loop permitido es el indicador de carga mientras carga.

## Tokens (`src/index.css`)

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entradas y salidas */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* movimiento en pantalla */
  --dur-press: 120ms;
  --dur-quick: 160ms;
  --dur-enter: 220ms;
  --dur-stagger: 40ms;
}
```

Con `prefers-reduced-motion: reduce` se quitan desplazamientos y escalas: queda solo opacidad.

## Qué se mueve y qué no

| Elemento | Decisión | Propósito | Receta |
| --- | --- | --- | --- |
| Botón primario (amarillo) | Sí, sutil | Feedback | `:active` → `translate(2px,2px)`, `--dur-press` |
| Pestañas Patente / VIN / Marca | Solo el indicador | Estado | El fondo negro se desplaza con `transform`, `--dur-quick`, `--ease-in-out`. El contenido cambia al instante. |
| Resultado de la búsqueda | Sí | Evita un cambio brusco | `animate-results-reveal` |
| Banner de riesgo | Sí, una vez | Estado | `animate-alerts` |
| «Resumen copiado» | Sí | Feedback | Fade + `translateY(4px→0)`, `--dur-quick` |
| Menú móvil | Sí | Espacial | `clip-path: inset(0 0 100% 0) → inset(0)`, `--dur-enter` |
| Hover en tarjetas de carrocería | Solo color | Feedback | `background-color`, `--dur-quick`, `ease`, solo con `(hover: hover)` |
| Franja de peligro, logo, cifras | **No** | | |
| Secciones de la portada al scrollear | **No** | | Ruido |
| Navegación entre pantallas | **No** | | Cambio instantáneo + foco al `h1` |

## Checklist

- [ ] Cada valor viene de los tokens.
- [ ] Podés nombrar el propósito de cada animación en una palabra.
- [ ] Probado con reduced motion activado.
- [ ] Nada parpadea, nada se repite más de 5 s.
- [ ] El foco queda visible durante y después de la animación.
- [ ] A 390px no hay saltos de layout (CLS en DevTools).
