# AvisAR
La seguridad de tu auto, en claro y a tiempo.

Prototipo de la webapp AvisAR: consulta de campañas de seguridad (recalls) por patente, VIN o marca y modelo; alertas; y reserva de turno de reparación en un concesionario oficial. Proyecto del Equipo 10 del Seminario de Integración Profesional (UADE).

Prototipo en Figma(https://www.figma.com/make/vhgCbh50d0p20249fDlzC3/Prototipo-AvisaAR-plataforma).

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

- **Vehículos:** además de los de las cuentas demo, la base incluye una muestra de autos y SUV del parque real tomada de los datos abiertos de la DNRPA ([datos.gob.ar](https://datos.gob.ar), licencia CC BY 4.0): transferencias de enero a septiembre de 2026 e inscripciones iniciales de septiembre de 2026. De cada registro se usan solo marca, modelo, versión, año y provincia; los datos de los titulares no se usan.
- **Patentes y VIN:** son ficticios. El dataset de la DNRPA no publica dominio ni VIN.
- **Campañas:** son ficticias (códigos `DEMO-`) y no corresponden a recalls reales.
- **Personas y turnos:** las cuentas son ficticias y los turnos, simulados. El mapa de concesionarios usa OpenStreetMap con coordenadas aproximadas.

Para regenerar la muestra, descargá los CSV de la DNRPA y corré:

```bash
pip install pandas
python3 scripts/ampliar_datos_demo.py --altas dnrpa-inscripciones-iniciales-autos-202609.csv \
  --transferencias dnrpa-transferencias-autos-2026*.csv
```

Cuenta demo con vehículos del parque real: `martina@demo.avisar.com` / `demo1234`.

## Stack

React 19, TypeScript, Vite y Tailwind CSS v4.
