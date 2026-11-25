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
2. **Movimiento genérico o tímido**: fade-ins suaves en cada sección, parallax decorativo, desplazamientos de 4px que nadie nota.

Desde la ronda «expresiva» la portada sí puede tener movimiento con presencia (el título palabra por palabra, el buscador con resorte, el scroll narrado). Juan pidió sacar el auto ilustrado de la portada.

## Reglas duras

1. **Tokens primero.** Toda duración y curva sale de los tokens. Nunca inventes un valor.
2. **Solo `transform`, `opacity` y `clip-path`.**
3. **Reduced motion viene con la animación**, no después.
4. **Los datos no se mueven por estilo**: patente, VIN, código de campaña y nivel de riesgo pueden aparecer, nunca rebotar. Excepción: las cifras de la portada y los totales de Talleres cuentan desde 0 **una sola vez** (900ms, ease-out), con el valor final en el DOM para lectores (`aria-hidden` sobre la versión animada).
5. **La franja de peligro queda quieta.** Animarla (marquesina) la vuelve ruido constante y viola WCAG 2.2.2.
6. **Nunca más de 3 destellos por segundo** (WCAG 2.3.1). En la práctica: **ningún parpadeo repetido**.
7. **Nada se repite más de 5 s** sin un control para pausarlo (WCAG 2.2.2). Las balizas del auto se encienden 2 veces a 2 Hz y quedan fijas; el chequeo de testigos es un único destello.
8. **La intro de la portada no bloquea**: se reproduce una vez por sesión (`sessionStorage`) y el campo de patente se puede usar desde el ms 0.

## Librería

`motion` (`motion/react`). Piezas reutilizables en `src/motion.tsx`: `HeroRoad`, `HeroCar`, `WordReveal`, `CountUp`, `InView`, `ScrollStory`, `LightCluster`, `Rise`, `PrintIn`, `DrawCheck`, `useIntroOnce`. Resortes: `SPRING_SOFT` (`duration .9, bounce .15`) para el auto y `SPRING_POP` (`duration .6, bounce .2`) para la tarjeta del buscador. Todas usan `useReducedMotion()`.

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
| Botones | Sí, sutil | Feedback | `scale(0.97)` al presionar, `--dur-press` |
| Pestañas Patente / VIN / Marca | Solo el indicador | Estado | El fondo negro se desplaza con `transform`, `--dur-quick`, `--ease-in-out` |
| Intro de la portada | Sí, una vez por sesión | Metáfora | Etiqueta, título palabra por palabra y buscador con resorte; total < 1,6 s (sin auto desde el pedido de Juan) |
| «Cómo funciona» | Sí, ligado al scroll | Explicar | Sticky 260vh en desktop (`useScroll`); en celular, tarjetas `whileInView` una vez |
| Cifras de la portada y totales de Talleres | Sí, una vez | Énfasis | Cuentan desde 0 en 900ms |
| Tarjetas de carrocería | Sí, con puntero | Feedback | Suben 6px, aparece la sombra amarilla y la silueta avanza 8px |
| Cambio de pantalla | Sí | Continuidad | Entra 260ms (`y 16→0`), sale 160ms (solo opacidad); la patente viaja con `layoutId="plate"`; foco al `h1` al terminar |
| Carga de búsqueda | Sí | Estado | Testigos que se encienden en secuencia (120ms), una pasada |
| Resultado | Sí | Evita un cambio brusco | `animate-results-reveal` (tablero) |
| Banner de riesgo | Sí, una vez | Estado | `animate-alerts` |
| Informe | Sí | Feedback | Sale «de la impresora» con `clip-path`; pulso `1→1.02→1` y check dibujado al compartir o copiar |
| Menú móvil | Sí | Espacial | `clip-path`, `--dur-enter` |
| Franja de peligro, logo | **No** | | |

## Checklist

- [ ] Cada valor viene de los tokens.
- [ ] Podés nombrar el propósito de cada animación en una palabra.
- [ ] Probado con reduced motion activado.
- [ ] Nada parpadea, nada se repite más de 5 s.
- [ ] El foco queda visible durante y después de la animación.
- [ ] A 390px no hay saltos de layout (CLS en DevTools).
