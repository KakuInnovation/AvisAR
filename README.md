# AvisAR
La seguridad de tu auto, en claro y a tiempo.

Prototipo de la webapp AvisAR: consulta de campañas de seguridad (recalls) por patente, VIN o marca y modelo; alertas; y reserva de turno de reparación en un concesionario oficial. Proyecto del Equipo 10 del Seminario de Integración Profesional (UADE).

El código se exportó del prototipo en [Figma Make](https://www.figma.com/make/vhgCbh50d0p20249fDlzC3/Prototipo-AvisaAR-plataforma).

## Cómo correrlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
```

Cuenta demo: `usuario@avisar.com` / `segura123`.

## Estructura

- `src/App.tsx`: pantallas y navegación de la app.
- `src/data/avisar-db.ts`: base de datos de demostración (usuarios, vehículos, campañas, concesionarios y turnos).
- `src/index.css`: Tailwind CSS v4 y tokens de color y tipografía.

## Datos

Todos los datos son ficticios: personas, patentes, VIN y campañas (códigos `DEMO-`) no corresponden a registros reales. Los turnos son simulados. El mapa de concesionarios usa OpenStreetMap con coordenadas aproximadas.

## Stack

React 19, TypeScript, Vite y Tailwind CSS v4.
