#!/usr/bin/env python3
"""
Amplía la base de demostración de AvisAR (src/data/avisar-db.ts).

Agrega marcas y modelos que se comercializan en Argentina, más unidades por
modelo, campañas de seguridad ficticias (códigos DEMO-), concesionarios para
todas las marcas y una cuenta demo con vehículos de las marcas nuevas.

Es idempotente: si un id ya existe en la base, no lo vuelve a agregar.
Uso: python3 scripts/ampliar_datos_demo.py
Datos 100 % sintéticos: patentes, VIN, campañas, personas y concesionarios son ficticios.
"""
import json
import math
import random
import re
from pathlib import Path

DB = Path(__file__).resolve().parent.parent / "src" / "data" / "avisar-db.ts"
rng = random.Random(20261103)

# ---------------------------------------------------------------------------
# Modelos nuevos: (marca, modelo, [versiones], [años de las unidades], WMI del VIN)
# ---------------------------------------------------------------------------
MODELS = [
    # Marcas que no estaban en la base
    ("Jeep", "Renegade", ["Sport 1.8 AT", "Longitude 1.3T AT"], [2017, 2019, 2022], "988"),
    ("Jeep", "Compass", ["Sport 2.4 AT", "Limited 1.3T AT"], [2018, 2020, 2023], "988"),
    ("RAM", "1500", ["Laramie 5.7 V8", "Rebel 5.7 V8"], [2019, 2021, 2023], "1C6"),
    ("Hyundai", "Creta", ["Safety 1.6 AT", "Limited 1.0T AT"], [2018, 2021, 2024], "9BH"),
    ("Hyundai", "Tucson", ["2.0 4x2 AT", "2.0 4x4 AT"], [2016, 2019, 2022], "KMH"),
    ("Kia", "Sportage", ["EX 2.0 AT", "GT Line 2.0 AT"], [2017, 2020, 2023], "KNA"),
    ("Kia", "Seltos", ["EX 1.6 AT", "SX 1.6T AT"], [2021, 2023, 2025], "KNA"),
    ("Mercedes-Benz", "Sprinter", ["311 CDI Furgón", "515 CDI Combi"], [2015, 2018, 2022], "8AC"),
    ("Mercedes-Benz", "Clase A", ["A200 Progressive", "A250 AMG Line"], [2019, 2021, 2023], "WDD"),
    ("BMW", "Serie 3", ["320i Sport Line", "330i M Sport"], [2016, 2019, 2022], "WBA"),
    ("BMW", "X1", ["sDrive20i", "xDrive25i"], [2017, 2020, 2023], "WBA"),
    ("Audi", "A3", ["Sportback 1.4 TFSI", "Sedán 2.0 TFSI"], [2015, 2018, 2021], "WAU"),
    ("Chery", "Tiggo 4", ["Comfort 1.5 MT", "Luxury 1.5 CVT"], [2019, 2022, 2024], "LVV"),
    ("Haval", "Jolion", ["Deluxe 1.5T DCT", "Supreme HEV"], [2022, 2024, 2025], "LGW"),
    ("BYD", "Dolphin Mini", ["GL", "GS"], [2025, 2025, 2026], "LGX"),
    ("BYD", "Song Pro", ["DM-i GL", "DM-i GS"], [2025, 2025, 2026], "LGX"),
    ("Suzuki", "Swift", ["GL 1.2 MT", "GLX 1.2 CVT"], [2018, 2021, 2024], "MA3"),
    ("Suzuki", "Vitara", ["GL 1.6 MT", "GLX 1.4T AT"], [2016, 2019, 2022], "TSM"),
    ("Mitsubishi", "L200", ["GLX 2.4 4x2", "GLS 2.4 4x4 AT"], [2017, 2020, 2023], "MMB"),
    # Modelos nuevos de marcas que ya estaban
    ("Chevrolet", "Tracker", ["LT 1.2T", "Premier 1.2T AT"], [2020, 2022, 2024], "9BG"),
    ("Chevrolet", "Cruze", ["LT 1.4T", "LTZ 1.4T AT"], [2016, 2018, 2021], "8AG"),
    ("Renault", "Duster", ["Zen 1.6", "Iconic 1.3T CVT"], [2016, 2019, 2022], "8A1"),
    ("Renault", "Kangoo", ["Furgón 1.6", "Stepway 1.6"], [2018, 2020, 2023], "8A1"),
    ("Peugeot", "2008", ["Allure 1.6", "GT 1.6T AT"], [2017, 2020, 2023], "8AD"),
    ("Fiat", "Toro", ["Freedom 1.8 AT", "Volcano 2.0 TD 4x4"], [2017, 2020, 2023], "988"),
    ("Fiat", "Strada", ["Freedom 1.3 CD", "Volcano 1.3 CVT"], [2021, 2022, 2024], "9BD"),
    ("Volkswagen", "Taos", ["Comfortline 250 TSI", "Highline 250 TSI"], [2021, 2022, 2024], "8AW"),
    ("Toyota", "Etios", ["XLS 1.5", "XLS 1.5 AT"], [2014, 2017, 2021], "9BR"),
    ("Nissan", "Frontier", ["S 2.3 4x2", "PRO-4X 2.3 4x4 AT"], [2017, 2020, 2023], "8AN"),
    ("Citroën", "C4 Cactus", ["Feel 1.6", "Shine 1.6 AT"], [2018, 2020, 2023], "935"),
    ("Ford", "Territory", ["SEL 1.5T", "Titanium 1.5T"], [2021, 2023, 2025], "LVS"),
]

# Unidades extra para modelos que ya estaban (marca, modelo, versión, año, WMI)
EXTRA_UNITS = [
    ("Toyota", "Hilux", "SRV 2.8 4x4 AT", 2018, "8AJ"),
    ("Toyota", "Hilux", "DX 2.4 4x2", 2022, "8AJ"),
    ("Renault", "Sandero", "Stepway 1.6", 2017, "93Y"),
    ("Renault", "Sandero", "Life 1.6", 2021, "93Y"),
    ("Nissan", "Versa", "Sense 1.6", 2019, "3N1"),
    ("Nissan", "Versa", "Exclusive 1.6 CVT", 2023, "3N1"),
    ("Volkswagen", "Amarok", "Highline 2.0 4x4", 2018, "8AW"),
    ("Volkswagen", "Amarok", "Extreme V6 3.0", 2022, "8AW"),
    ("Ford", "Ka", "SE 1.5", 2017, "9BF"),
    ("Ford", "Ka", "Freestyle 1.5", 2020, "9BF"),
    ("Chevrolet", "Onix", "LT 1.4", 2018, "9BG"),
    ("Peugeot", "208", "Feline 1.6 AT", 2021, "8AD"),
    ("Fiat", "Cronos", "Precision 1.8 AT", 2019, "8AP"),
    ("Ford", "Ranger", "XLT 3.2 4x4 AT", 2020, "8AF"),
]

# ---------------------------------------------------------------------------
# Campañas ficticias: (marca, modelo, desde, hasta, plantilla de falla, riesgo)
# ---------------------------------------------------------------------------
FAULTS = {
    "airbag_inflador": ("Reemplazo del inflador del airbag del conductor", "Inflador del airbag del conductor",
        "El inflador podría activarse con una presión mayor a la prevista.",
        "Ante un impacto, fragmentos metálicos podrían proyectarse hacia el habitáculo.",
        "No uses el vehículo hasta reemplazar el inflador. La reparación es gratuita y demora alrededor de 1 hora."),
    "airbag_sensor": ("Actualización del sensor de ocupante", "Sensor de ocupación del asiento del acompañante",
        "El sensor podría desactivar el airbag del acompañante aunque haya un adulto sentado.",
        "El acompañante podría quedar sin protección del airbag en una colisión frontal.",
        "Pedí turno en un concesionario oficial. La recalibración es gratuita y demora unos 40 minutos."),
    "frenos_servo": ("Revisión del servofreno", "Servofreno de vacío",
        "Una pérdida en la válvula del servofreno puede endurecer el pedal y reducir la asistencia de frenado.",
        "Aumenta la distancia de frenado y el riesgo de choque, sobre todo en frenadas de emergencia.",
        "Reducí el uso del vehículo y pedí turno cuanto antes. El reemplazo es gratuito y demora unas 2 horas."),
    "frenos_canieria": ("Reemplazo de cañerías de freno traseras", "Cañerías de freno traseras",
        "Las cañerías podrían rozar contra la carrocería y desgastarse hasta producir una pérdida de líquido.",
        "Una pérdida de líquido reduce la capacidad de frenado del eje trasero.",
        "Revisá que no haya manchas de líquido bajo el vehículo y pedí turno. El reemplazo es gratuito."),
    "freno_mano": ("Actualización del freno de estacionamiento electrónico", "Módulo del freno de estacionamiento",
        "El freno de estacionamiento podría no aplicarse por completo al apagar el motor.",
        "El vehículo podría desplazarse si queda estacionado en pendiente.",
        "Mientras tanto, estacioná en lugares planos y con una marcha colocada. La actualización es gratuita."),
    "direccion_cremallera": ("Revisión de la caja de dirección", "Cremallera de dirección",
        "Un defecto en la fijación de la cremallera puede generar juego en la dirección.",
        "Podría disminuir el control del vehículo en curvas o maniobras bruscas.",
        "Si notás juego o ruidos al girar, evitá usar el vehículo. La revisión y el reemplazo son gratuitos."),
    "direccion_asistencia": ("Actualización de la dirección asistida", "Módulo de la dirección eléctrica",
        "La asistencia eléctrica podría desactivarse de forma repentina mientras se conduce.",
        "El volante se vuelve pesado de golpe, lo que dificulta maniobrar a baja velocidad.",
        "Pedí turno en un concesionario oficial. La actualización de software es gratuita y demora 1 hora."),
    "combustible_fuga": ("Reemplazo de la cañería de combustible", "Cañería de alimentación de combustible",
        "Una unión de la cañería podría aflojarse y producir una pérdida de combustible en el vano motor.",
        "Una pérdida de combustible cerca de fuentes de calor puede provocar un incendio.",
        "Si sentís olor a combustible, no uses el vehículo y comunicate con la marca. El reemplazo es gratuito."),
    "combustible_bomba": ("Reemplazo de la bomba de combustible", "Bomba de combustible",
        "La bomba podría dejar de funcionar y provocar que el motor se detenga en marcha.",
        "Una detención del motor en ruta o autopista aumenta el riesgo de choque.",
        "Pedí turno cuanto antes. El reemplazo es gratuito y demora unas 3 horas."),
    "cinturon_pretensor": ("Reemplazo del pretensor del cinturón", "Pretensor del cinturón delantero",
        "El pretensor podría no activarse correctamente durante un impacto.",
        "El ocupante podría no quedar bien sujeto en una colisión.",
        "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora."),
    "suspension_brazo": ("Refuerzo del brazo de suspensión delantero", "Brazo de control inferior",
        "El brazo de suspensión podría fisurarse por fatiga del material.",
        "Una rotura del brazo puede causar la pérdida de control del vehículo.",
        "Si escuchás golpes en la suspensión, evitá circular a alta velocidad. El reemplazo es gratuito."),
    "rueda_tuercas": ("Reemplazo de las tuercas de rueda", "Tuercas de fijación de las ruedas",
        "Las tuercas podrían aflojarse con el uso por un tratamiento térmico deficiente.",
        "Una rueda podría desprenderse con el vehículo en movimiento.",
        "No circules en ruta hasta realizar el reemplazo. Es gratuito y demora menos de 1 hora."),
    "electrico_arnes": ("Protección del arnés eléctrico del motor", "Arnés eléctrico del vano motor",
        "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
        "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
        "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas."),
    "motor_correa": ("Reemplazo del tensor de la correa de distribución", "Tensor de la correa de distribución",
        "El tensor podría fallar y hacer que la correa salte de posición.",
        "El motor podría detenerse de golpe mientras se conduce.",
        "Pedí turno cuanto antes. El reemplazo es gratuito y demora unas 4 horas."),
    "luces_faros": ("Reemplazo del conector de los faros", "Conector de los faros delanteros",
        "El conector podría sobrecalentarse y apagar las luces bajas.",
        "Conducir de noche sin luces bajas reduce la visibilidad y el riesgo de ser visto por otros.",
        "Revisá las luces antes de salir de noche y pedí turno. El reemplazo es gratuito."),
    "camara_retroceso": ("Actualización de la cámara de retroceso", "Software del sistema multimedia",
        "La imagen de la cámara de retroceso podría no aparecer al poner marcha atrás.",
        "Aumenta el riesgo de atropellar a peatones u objetos al retroceder.",
        "Mientras tanto, usá los espejos y verificá el entorno al retroceder. La actualización es gratuita."),
    "puerta_corrediza": ("Ajuste del cierre de la puerta corrediza", "Cerradura de la puerta corrediza lateral",
        "La puerta corrediza podría abrirse en marcha si no quedó bien trabada.",
        "Los pasajeros o la carga podrían caer del vehículo en movimiento.",
        "Verificá que la puerta quede trabada antes de arrancar y pedí turno. El ajuste es gratuito."),
    "bateria_at": ("Inspección de la batería de alta tensión", "Módulo de la batería de alta tensión",
        "Un sello del módulo podría permitir el ingreso de humedad en la batería.",
        "La humedad puede provocar una falla eléctrica que deje el vehículo sin tracción o genere sobrecalentamiento.",
        "Evitá atravesar calles anegadas y pedí turno. La inspección y el sellado son gratuitos."),
    "cargador": ("Actualización del cargador a bordo", "Cargador a bordo (OBC)",
        "El cargador podría sobrecalentarse durante cargas prolongadas en tomacorrientes domiciliarios.",
        "El sobrecalentamiento puede dañar el cableado y generar riesgo de incendio durante la carga.",
        "Cargá solo en cargadores de pared mientras tanto y pedí turno. La actualización es gratuita."),
    "capot": ("Ajuste del cierre secundario del capot", "Traba secundaria del capot",
        "La traba secundaria podría no retener el capot si la principal queda mal cerrada.",
        "El capot podría abrirse en marcha y tapar la visión del conductor.",
        "Verificá que el capot quede bien cerrado y pedí turno. El ajuste es gratuito."),
    "butaca_riel": ("Refuerzo del riel de la butaca del conductor", "Riel de regulación de la butaca",
        "El seguro del riel podría no trabar la butaca en la posición elegida.",
        "La butaca podría desplazarse durante una frenada y afectar el control del vehículo.",
        "Verificá que la butaca quede trabada antes de manejar y pedí turno. El refuerzo es gratuito."),
    "limpiaparabrisas": ("Reemplazo del motor del limpiaparabrisas", "Motor del limpiaparabrisas",
        "El motor podría dejar de funcionar por ingreso de agua.",
        "Con lluvia, la visibilidad del conductor se reduce de forma significativa.",
        "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora."),
}

CAMPAIGNS = [
    ("Jeep", "Renegade", 2016, 2019, "combustible_fuga", "CRÍTICO"),
    ("Jeep", "Renegade", 2019, 2022, "freno_mano", "ALTO"),
    ("Jeep", "Compass", 2017, 2021, "airbag_sensor", "ALTO"),
    ("Jeep", "Compass", 2022, 2024, "camara_retroceso", "MEDIO"),
    ("RAM", "1500", 2019, 2022, "airbag_inflador", "CRÍTICO"),
    ("RAM", "1500", 2021, 2024, "rueda_tuercas", "ALTO"),
    ("Hyundai", "Creta", 2017, 2020, "electrico_arnes", "CRÍTICO"),
    ("Hyundai", "Creta", 2021, 2024, "cinturon_pretensor", "ALTO"),
    ("Hyundai", "Tucson", 2016, 2020, "frenos_servo", "ALTO"),
    ("Kia", "Sportage", 2017, 2021, "electrico_arnes", "CRÍTICO"),
    ("Kia", "Sportage", 2020, 2023, "luces_faros", "MEDIO"),
    ("Kia", "Seltos", 2021, 2024, "direccion_asistencia", "ALTO"),
    ("Mercedes-Benz", "Sprinter", 2015, 2019, "puerta_corrediza", "ALTO"),
    ("Mercedes-Benz", "Sprinter", 2018, 2023, "frenos_canieria", "CRÍTICO"),
    ("Mercedes-Benz", "Clase A", 2019, 2022, "camara_retroceso", "MEDIO"),
    ("BMW", "Serie 3", 2016, 2019, "electrico_arnes", "CRÍTICO"),
    ("BMW", "Serie 3", 2019, 2022, "cinturon_pretensor", "ALTO"),
    ("BMW", "X1", 2017, 2021, "combustible_fuga", "CRÍTICO"),
    ("Audi", "A3", 2015, 2019, "airbag_inflador", "CRÍTICO"),
    ("Audi", "A3", 2018, 2021, "freno_mano", "MEDIO"),
    ("Chery", "Tiggo 4", 2019, 2023, "suspension_brazo", "ALTO"),
    ("Chery", "Tiggo 4", 2022, 2024, "luces_faros", "MEDIO"),
    ("Haval", "Jolion", 2022, 2024, "direccion_asistencia", "ALTO"),
    ("BYD", "Dolphin Mini", 2025, 2026, "cargador", "ALTO"),
    ("BYD", "Song Pro", 2025, 2025, "bateria_at", "CRÍTICO"),
    ("Suzuki", "Swift", 2018, 2022, "combustible_bomba", "CRÍTICO"),
    ("Suzuki", "Vitara", 2016, 2020, "limpiaparabrisas", "MEDIO"),
    ("Mitsubishi", "L200", 2017, 2021, "suspension_brazo", "CRÍTICO"),
    ("Mitsubishi", "L200", 2020, 2023, "freno_mano", "ALTO"),
    ("Chevrolet", "Tracker", 2020, 2023, "butaca_riel", "ALTO"),
    ("Chevrolet", "Cruze", 2016, 2019, "motor_correa", "CRÍTICO"),
    ("Renault", "Duster", 2016, 2020, "frenos_servo", "ALTO"),
    ("Renault", "Kangoo", 2018, 2022, "puerta_corrediza", "ALTO"),
    ("Peugeot", "2008", 2017, 2021, "electrico_arnes", "CRÍTICO"),
    ("Fiat", "Toro", 2017, 2021, "direccion_cremallera", "CRÍTICO"),
    ("Fiat", "Strada", 2021, 2023, "capot", "MEDIO"),
    ("Volkswagen", "Taos", 2021, 2023, "airbag_sensor", "ALTO"),
    ("Toyota", "Etios", 2014, 2018, "airbag_inflador", "CRÍTICO"),
    ("Nissan", "Frontier", 2017, 2021, "rueda_tuercas", "CRÍTICO"),
    ("Citroën", "C4 Cactus", 2018, 2021, "frenos_canieria", "ALTO"),
    ("Ford", "Territory", 2021, 2024, "camara_retroceso", "MEDIO"),
    # Más fallas para modelos que ya estaban (el Corolla queda sin campañas: es el escenario "Sin recalls")
    ("Toyota", "Hilux", 2016, 2019, "airbag_inflador", "CRÍTICO"),
    ("Toyota", "Hilux", 2020, 2023, "frenos_canieria", "ALTO"),
    ("Renault", "Sandero", 2016, 2019, "electrico_arnes", "ALTO"),
    ("Nissan", "Versa", 2018, 2021, "cinturon_pretensor", "ALTO"),
    ("Nissan", "Versa", 2022, 2024, "luces_faros", "MEDIO"),
    ("Volkswagen", "Amarok", 2017, 2020, "rueda_tuercas", "CRÍTICO"),
    ("Volkswagen", "Amarok", 2021, 2023, "freno_mano", "ALTO"),
    ("Ford", "Ka", 2016, 2019, "butaca_riel", "ALTO"),
    ("Ford", "Ka", 2019, 2021, "combustible_bomba", "CRÍTICO"),
    ("Ford", "Ranger", 2020, 2022, "direccion_cremallera", "ALTO"),
    ("Chevrolet", "Onix", 2018, 2020, "frenos_servo", "CRÍTICO"),
    ("Peugeot", "208", 2021, 2023, "airbag_sensor", "ALTO"),
    ("Fiat", "Cronos", 2019, 2022, "limpiaparabrisas", "MEDIO"),
]

# Teléfonos 0800 ficticios por marca (las marcas que ya estaban conservan el suyo)
CONTACTS = {
    "Ford": "0800-000-0101", "Toyota": "0800-000-0102", "Volkswagen": "0800-000-0103", "Fiat": "0800-000-0104",
    "Peugeot": "0800-000-0105", "Chevrolet": "0800-000-0106", "Honda": "0800-000-0107", "Citroën": "0800-000-0108",
    "Renault": "0800-000-0109", "Nissan": "0800-000-0110", "Jeep": "0800-000-0111", "RAM": "0800-000-0112",
    "Hyundai": "0800-000-0113", "Kia": "0800-000-0114", "Mercedes-Benz": "0800-000-0115", "BMW": "0800-000-0116",
    "Audi": "0800-000-0117", "Chery": "0800-000-0118", "Haval": "0800-000-0119", "BYD": "0800-000-0120",
    "Suzuki": "0800-000-0121", "Mitsubishi": "0800-000-0122",
}

FAULT_CODE = {
    "airbag_inflador": "INFL", "airbag_sensor": "SENS", "frenos_servo": "SERVO", "frenos_canieria": "FRENOS",
    "freno_mano": "FMANO", "direccion_cremallera": "DIREC", "direccion_asistencia": "DIREC", "combustible_fuga": "COMB",
    "combustible_bomba": "COMB", "cinturon_pretensor": "CINT", "suspension_brazo": "SUSP", "rueda_tuercas": "RUEDA",
    "electrico_arnes": "ARNES", "motor_correa": "DISTR", "luces_faros": "FAROS", "camara_retroceso": "CAMARA",
    "puerta_corrediza": "PUERTA", "bateria_at": "BATAT", "cargador": "CARGA", "capot": "CAPOT",
    "butaca_riel": "BUTACA", "limpiaparabrisas": "LIMP",
}

MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

# ---------------------------------------------------------------------------
# Concesionarios ficticios en avenidas reales de CABA y GBA (coordenadas aproximadas)
# ---------------------------------------------------------------------------
LOCATIONS = [
    ("Av. Cabildo 1800", "Belgrano", -34.5655, -58.4530),
    ("Av. Santa Fe 2900", "Palermo", -34.5890, -58.4060),
    ("Av. Corrientes 5200", "Villa Crespo", -34.5985, -58.4385),
    ("Av. Rivadavia 4800", "Caballito", -34.6185, -58.4325),
    ("Av. del Libertador 6500", "Belgrano", -34.5560, -58.4470),
    ("Av. Warnes 1500", "Villa Crespo", -34.5950, -58.4520),
    ("Av. Maipú 1500", "Vicente López", -34.5235, -58.4795),
    ("Av. Mitre 600", "Avellaneda", -34.6625, -58.3650),
    ("Av. Rivadavia 15000", "Ramos Mejía", -34.6430, -58.5650),
    ("Av. del Libertador 13000", "Martínez", -34.4920, -58.5030),
    ("Av. San Juan 3000", "San Cristóbal", -34.6235, -58.4050),
    ("Av. Álvarez Thomas 1500", "Colegiales", -34.5760, -58.4570),
    ("Av. Córdoba 6000", "Chacarita", -34.5850, -58.4440),
    ("Av. Monroe 3000", "Coghlan", -34.5640, -58.4690),
    ("Av. La Plata 1500", "Boedo", -34.6330, -58.4250),
    ("Av. Gaona 3500", "Floresta", -34.6190, -58.4780),
    ("Av. Triunvirato 4000", "Villa Urquiza", -34.5750, -58.4870),
    ("Av. Pueyrredón 1000", "Balvanera", -34.6050, -58.4050),
    ("Av. Hipólito Yrigoyen 8000", "Banfield", -34.7440, -58.3950),
    ("Av. Belgrano 2500", "Balvanera", -34.6135, -58.4025),
]
DEALER_SUFFIXES = ["Automotores", "Motors", "Autos", "Center", "Cars", "Group"]
DEALER_PREFIXES = ["Alto", "Delta", "Puerto", "Cumbre", "Vía", "Faro", "Norte", "Arena", "Brisa", "Nexo", "Senda", "Nova"]
HOURS = [("Lunes a viernes", "8:30 a 17:30"), ("Lunes a sábado", "9:00 a 18:00"), ("Lunes a viernes", "8:00 a 17:00")]
USER_REF = (-34.5880, -58.4300)  # ubicación simulada del usuario (Palermo)

# ---------------------------------------------------------------------------
VIN_VALUES = dict(zip("ABCDEFGHJKLMNPRSTUVWXYZ", [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9]))
VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
VIN_CHARS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
YEAR_CODE = {y: c for y, c in zip(range(2001, 2031), "123456789ABCDEFGHJKLMNPRSTVWXY")}


def make_vin(wmi: str, year: int, used: set) -> str:
    while True:
        vds = "".join(rng.choice(VIN_CHARS) for _ in range(5))
        body = wmi + vds + "0" + YEAR_CODE[year] + rng.choice("ABCDEFGHJ") + f"{rng.randrange(10**6):06d}"
        total = sum((int(ch) if ch.isdigit() else VIN_VALUES[ch]) * w for ch, w in zip(body, VIN_WEIGHTS))
        r = total % 11
        vin = body[:8] + ("X" if r == 10 else str(r)) + body[9:]
        if vin not in used:
            used.add(vin)
            return vin


MERCOSUR_PREFIX = {2016: "AA", 2017: "AB", 2018: "AC", 2019: "AD", 2020: "AE", 2021: "AF",
                   2022: "AF", 2023: "AG", 2024: "AH", 2025: "AH", 2026: "AI"}
OLD_PREFIX = {2008: "H", 2009: "I", 2010: "J", 2011: "K", 2012: "L", 2013: "M", 2014: "N", 2015: "O"}
LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ"


def make_plate(year: int, used: set) -> str:
    while True:
        if year >= 2016:
            plate = f"{MERCOSUR_PREFIX[year]} {rng.randrange(1000):03d} {rng.choice(LETTERS)}{rng.choice(LETTERS)}"
        else:
            plate = f"{OLD_PREFIX[year]}{rng.choice(LETTERS)}{rng.choice(LETTERS)} {rng.randrange(1000):03d}"
        norm = plate.replace(" ", "")
        if norm not in used:
            used.add(norm)
            return plate


def km(a, b) -> float:
    dlat, dlng = math.radians(b[0] - a[0]), math.radians(b[1] - a[1])
    h = math.sin(dlat / 2) ** 2 + math.cos(math.radians(a[0])) * math.cos(math.radians(b[0])) * math.sin(dlng / 2) ** 2
    return round(6371 * 2 * math.asin(math.sqrt(h)), 1)


def slug(text: str) -> str:
    text = text.lower().replace("ë", "e").replace("é", "e").replace("í", "i")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


# ---------------------------------------------------------------------------
def find_array(src: str, name: str):
    m = re.search(r"export const %s[^=]*= (\[)" % name, src)
    start, depth = m.start(1), 0
    for i in range(start, len(src)):
        depth += src[i] == "["
        depth -= src[i] == "]"
        if depth == 0:
            return start, i + 1
    raise ValueError(name)


def main() -> None:
    src = DB.read_text(encoding="utf-8")
    tables = {}
    for name in ["USERS", "VEHICLES", "OWNERSHIPS", "CAMPAIGNS", "ALERTS"]:
        a, b = find_array(src, name)
        tables[name] = json.loads(src[a:b])

    vehicles, campaigns = tables["VEHICLES"], tables["CAMPAIGNS"]
    used_vins = {v["vin"] for v in vehicles}
    used_plates = {v["plateNormalized"] for v in vehicles}
    vehicle_ids = {v["id"] for v in vehicles}
    next_veh = max(int(v["id"][4:]) for v in vehicles if v["id"].startswith("VEH-")) + 1

    # Vehículos -------------------------------------------------------------
    units = [(b, m, vers[i % len(vers)], y, wmi) for b, m, vers, years, wmi in MODELS for i, y in enumerate(years)]
    units += EXTRA_UNITS
    new_vehicles = []
    for brand, model, version, year, wmi in units:
        key = f"{brand}|{model}|{version}|{year}"
        if any(f"{v['brand']}|{v['model']}|{v['version']}|{v['year']}" == key for v in vehicles + new_vehicles):
            continue
        vid = f"VEH-{next_veh:04d}"
        next_veh += 1
        plate = make_plate(year, used_plates)
        new_vehicles.append({
            "id": vid, "plate": plate, "vin": make_vin(wmi, year, used_vins), "brand": brand, "model": model,
            "version": version, "year": str(year), "plateNormalized": plate.replace(" ", ""),
        })
    vehicles += new_vehicles

    # Campañas --------------------------------------------------------------
    existing_keys = {(c["brand"], c["model"], c["yearFrom"], c["title"]) for c in campaigns}
    used_ids = {c["id"] for c in campaigns}
    for brand, model, y_from, y_to, fault, risk in CAMPAIGNS:
        title, component, description, danger, action = FAULTS[fault]
        if (brand, model, y_from, title) in existing_keys:
            continue
        year = rng.choice([2023, 2024, 2025, 2026])
        month = rng.randrange(1, 13 if year < 2026 else 10)
        day = rng.randrange(1, 28)
        while True:
            cid = f"RC-{year}-{rng.randrange(1000):04d}"
            if cid not in used_ids:
                used_ids.add(cid)
                break
        campaigns.append({
            "id": cid,
            "campaign": f"DEMO-SC-{year}-{FAULT_CODE[fault]}-{slug(model).replace('-', '').upper()[:4]}",
            "brand": brand, "model": model, "yearFrom": y_from, "yearTo": y_to,
            "title": title, "component": component, "risk": risk,
            "description": description, "danger": danger, "action": action,
            "date": f"{day} de {MONTHS[month - 1]} de {year}",
            "publishedAt": f"{year}-{month:02d}-{day:02d}",
            "contact": CONTACTS[brand],
        })
    campaigns.sort(key=lambda c: c["publishedAt"], reverse=True)

    # Cuenta demo con vehículos de las marcas nuevas -------------------------
    users, owners, alerts = tables["USERS"], tables["OWNERSHIPS"], tables["ALERTS"]
    if not any(u["id"] == "USR-0009" for u in users):
        users.append({
            "id": "USR-0009", "name": "Martina", "fullName": "Martina Ejemplo", "email": "martina@demo.avisar.com",
            "password": "demo1234", "phone": "+54 9 11 0000-0009", "province": "Ciudad de Buenos Aires",
            "scenario": "Familia con varios vehículos de marcas nuevas y campañas pendientes",
            "createdAt": "2026-10-30",
            "consent": {"accepted": True, "acceptedAt": "2026-10-30", "text": users[0]["consent"]["text"]},
        })
        picks = [("Jeep", "Renegade", "2017"), ("BYD", "Dolphin Mini", "2025"), ("Hyundai", "Creta", "2018"), ("Mitsubishi", "L200", "2020")]
        next_own = max(int(o["id"][4:]) for o in owners) + 1
        next_alr = max(int(a["id"][4:]) for a in alerts) + 1
        for i, (b, m, y) in enumerate(picks):
            v = next(x for x in vehicles if x["brand"] == b and x["model"] == m and x["year"] == y)
            owners.append({
                "id": f"OWN-{next_own + i:04d}", "vehicleId": v["id"], "ownerId": "USR-0009", "plate": v["plate"],
                "vin": v["vin"], "role": "titular" if i < 3 else "usuario habitual", "since": "2026-10-30",
                "until": None, "source": "Declarado por el usuario en AvisAR", "verified": False,
            })
            if i < 2:
                alerts.append({
                    "id": f"ALR-{next_alr + i:04d}", "ownerId": "USR-0009", "vehicleId": v["id"],
                    "vehicle": f"{b} {m} {v['version']} {y}", "plate": v["plate"],
                    "channel": "WhatsApp" if i == 0 else "E-mail",
                    "destination": "+54 9 11 0000-0009" if i == 0 else "martina@demo.avisar.com", "active": True,
                })

    # Escribir tablas JSON ----------------------------------------------------
    for name in ["ALERTS", "CAMPAIGNS", "OWNERSHIPS", "VEHICLES", "USERS"]:  # de abajo hacia arriba
        a, b = find_array(src, name)
        src = src[:a] + json.dumps(tables[name], ensure_ascii=False, indent=2).replace("\n", "\n") + src[b:]

    # Concesionarios (literal TS, no JSON) ------------------------------------
    a, b = find_array(src, "DEALERS")
    dealer_block = src[a:b]
    have = set(re.findall(r'brand: "([^"]+)"', dealer_block))
    all_brands = sorted({v["brand"] for v in vehicles})
    lat0, lat1 = -34.75, -34.48
    lng0, lng1 = -58.58, -58.35
    added = []
    loc_i = 0
    for brand in all_brands:
        if brand in have:
            continue
        for n in range(2):
            addr, hood, lat, lng = LOCATIONS[loc_i % len(LOCATIONS)]
            loc_i += 1
            days, hours = HOURS[(loc_i + n) % len(HOURS)]
            name = f"{DEALER_PREFIXES[(loc_i * 5 + n) % len(DEALER_PREFIXES)]} {DEALER_SUFFIXES[(loc_i + n) % len(DEALER_SUFFIXES)]}"
            x = round(8 + (lng - lng0) / (lng1 - lng0) * 84)
            y = round(8 + (lat1 - lat) / (lat1 - lat0) * 84)
            added.append(
                "  {\n"
                f'    id: "{slug(brand)}-{slug(hood)}",\n'
                f'    name: "{name}",\n'
                f'    brand: "{brand}",\n'
                f'    address: "{addr}",\n'
                f'    neighborhood: "{hood}",\n'
                f"    distanceKm: {km(USER_REF, (lat, lng))},\n"
                f'    days: "{days}",\n'
                f'    hours: "{hours}",\n'
                f"    x: {x},\n"
                f"    y: {y},\n"
                f"    lat: {lat},\n"
                f"    lng: {lng},\n"
                "  },"
            )
    if added:
        body = dealer_block[:-1].rstrip()
        if not body.endswith(","):
            body += ","
        dealer_block = body + "\n" + "\n".join(added) + "\n]"
        src = src[:a] + dealer_block + src[b:]

    DB.write_text(src, encoding="utf-8")
    brands = sorted({v["brand"] for v in vehicles})
    models = {(v["brand"], v["model"]) for v in vehicles}
    print(f"Vehículos: {len(vehicles)} (+{len(new_vehicles)}) · Marcas: {len(brands)} · Modelos: {len(models)}")
    print(f"Campañas: {len(campaigns)} · Concesionarios nuevos: {len(added)} · Usuarios: {len(users)}")


if __name__ == "__main__":
    main()
