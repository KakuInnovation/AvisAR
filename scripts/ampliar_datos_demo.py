#!/usr/bin/env python3
"""
Amplía la base de demostración de AvisAR (src/data/avisar-db.ts) con vehículos
tomados de los datos abiertos de la DNRPA.

Fuente: Dirección Nacional de los Registros Nacionales de la Propiedad Automotor
(datos.gob.ar, licencia CC BY 4.0):
  - Inscripciones iniciales de autos (0 km).
  - Transferencias de autos (usados).

De cada registro se toman SOLO marca, modelo, versión, año de modelo, tipo y
provincia del registro seccional. Los datos del titular no se usan. El dataset
no publica dominio ni VIN, por eso las patentes y los VIN son ficticios (con
formato válido y coherente con el año). Las campañas son ficticias (código DEMO-).

Conserva intactos los vehículos, campañas y cuentas originales de la demo.

Uso:
  python3 scripts/ampliar_datos_demo.py --altas ALTAS.csv --transferencias T1.csv [T2.csv ...]
Requiere pandas. Es reproducible: con los mismos archivos genera los mismos datos.
"""
import argparse
import json
import math
import random
import re
import subprocess
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / "src" / "data" / "avisar-db.ts"
rng = random.Random(20261103)

N_USADOS = 110   # unidades tomadas de transferencias
N_0KM = 40       # unidades tomadas de inscripciones iniciales
TOP_FAMILIAS_USADOS = 30
TOP_FAMILIAS_0KM = 15

TIPOS_LIVIANOS = r"^(SEDAN|RURAL|TODO TERRENO|COUPE|CONVERTIBLE)"  # solo autos y SUV: sin pick-ups, furgones ni utilitarios

# Modelos de la demo original: no se les agregan campañas nuevas, para no alterar los escenarios.
MODELOS_ORIGINALES = {
    ("Toyota", "Corolla"), ("Ford", "Focus"), ("Volkswagen", "Gol"), ("Toyota", "Yaris"), ("Ford", "Ranger"),
    ("Renault", "Sandero"), ("Honda", "Civic"), ("Fiat", "Cronos"), ("Toyota", "Hilux"), ("Peugeot", "208"),
    ("Chevrolet", "Onix"), ("Nissan", "Versa"), ("Citroën", "C3"), ("Volkswagen", "Amarok"), ("Ford", "Ka"),
}

MARCAS = {
    "VOLKSWAGEN": "Volkswagen", "MERCEDES BENZ": "Mercedes-Benz", "CITROEN": "Citroën", "CHEVROLET": "Chevrolet",
    "TOYOTA": "Toyota", "FORD": "Ford", "FIAT": "Fiat", "RENAULT": "Renault", "PEUGEOT": "Peugeot",
    "NISSAN": "Nissan", "HONDA": "Honda", "JEEP": "Jeep", "AUDI": "Audi", "SUZUKI": "Suzuki", "CHERY": "Chery",
    "HYUNDAI": "Hyundai", "KIA": "Kia", "RAM": "RAM", "MITSUBISHI": "Mitsubishi", "BAIC": "BAIC", "BYD": "BYD",
    "HAVAL": "Haval", "MG": "MG", "BMW": "BMW", "JETOUR": "Jetour", "CHANGAN": "Changan", "DODGE": "Dodge",
}

# Nombres de modelo como se escriben comercialmente (DNRPA los publica en mayúsculas)
NOMBRES = {
    "ECOSPORT": "EcoSport", "HR-V": "HR-V", "WR-V": "WR-V", "SW4": "SW4", "S10": "S10", "T-CROSS": "T-Cross",
    "F-100": "F-100", "BJ30E": "BJ30E", "X55E": "X55E", "ZS": "ZS", "H6": "H6", "CS55": "CS55", "T1": "T1",
    "HB 20": "HB20", "HB 20S": "HB20S", "HB20": "HB20", "HB20S": "HB20S", "GLC": "GLC", "GLA": "GLA", "QQ": "QQ", "X55": "X55", "X70": "X70", "K3": "K3", "CR-V": "CR-V", "RAV4": "RAV4", "SW4": "SW4", "TIGGO 4": "Tiggo 4", "TIGGO 7": "Tiggo 7", "TIGGO 2": "Tiggo 2", "TIGGO 8": "Tiggo 8",
    "X-TRAIL": "X-Trail", "C4": "C4", "C3": "C3", "208": "208", "207": "207", "206": "206", "308": "308",
    "307": "307", "408": "408", "2008": "2008", "3008": "3008", "500": "500",
}

WMI = {
    "Volkswagen": "8AW", "Ford": "8AF", "Renault": "93Y", "Chevrolet": "9BG", "Fiat": "8AP", "Toyota": "8AJ",
    "Peugeot": "8AD", "Citroën": "935", "Mercedes-Benz": "8AC", "Nissan": "3N1", "Honda": "93H", "Jeep": "988",
    "Audi": "WAU", "Suzuki": "MA3", "Chery": "LVV", "Hyundai": "9BH", "Kia": "KNA", "RAM": "3C6",
    "Mitsubishi": "MMB", "BAIC": "LNB", "BYD": "LGX", "Haval": "LGW", "MG": "LSJ", "BMW": "WBA",
    "Jetour": "LVT", "Changan": "LS5", "Dodge": "3D4",
}

CONTACTS = {
    "Ford": "0800-000-0101", "Toyota": "0800-000-0102", "Volkswagen": "0800-000-0103", "Fiat": "0800-000-0104",
    "Peugeot": "0800-000-0105", "Chevrolet": "0800-000-0106", "Honda": "0800-000-0107", "Citroën": "0800-000-0108",
}

ELECTRICOS = {"BYD", "BAIC", "Leapmotor"}
UTILITARIOS = {"Kangoo", "Partner", "Berlingo", "Sprinter", "Fiorino", "Transit", "Master", "Expert", "Jumpy"}

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
FAULT_CODE = {
    "airbag_inflador": "INFL", "airbag_sensor": "SENS", "frenos_servo": "SERVO", "frenos_canieria": "FRENOS",
    "freno_mano": "FMANO", "direccion_cremallera": "DIREC", "direccion_asistencia": "DIREC",
    "combustible_fuga": "COMB", "combustible_bomba": "COMB", "cinturon_pretensor": "CINT",
    "suspension_brazo": "SUSP", "rueda_tuercas": "RUEDA", "electrico_arnes": "ARNES", "motor_correa": "DISTR",
    "luces_faros": "FAROS", "camara_retroceso": "CAMARA", "puerta_corrediza": "PUERTA", "bateria_at": "BATAT",
    "cargador": "CARGA", "capot": "CAPOT", "butaca_riel": "BUTACA", "limpiaparabrisas": "LIMP",
}
FALLAS_COMBUSTION = [k for k in FAULTS if k not in ("bateria_at", "cargador", "puerta_corrediza")]
FALLAS_ELECTRICOS = ["bateria_at", "cargador", "freno_mano", "airbag_sensor", "camara_retroceso", "suspension_brazo"]
MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre",
          "noviembre", "diciembre"]

# Concesionarios ficticios sobre avenidas reales de CABA y GBA (coordenadas aproximadas)
LOCATIONS = [
    ("Av. Cabildo 1800", "Belgrano", -34.5655, -58.4530), ("Av. Santa Fe 2900", "Palermo", -34.5890, -58.4060),
    ("Av. Corrientes 5200", "Villa Crespo", -34.5985, -58.4385), ("Av. Rivadavia 4800", "Caballito", -34.6185, -58.4325),
    ("Av. del Libertador 6500", "Belgrano", -34.5560, -58.4470), ("Av. Warnes 1500", "Villa Crespo", -34.5950, -58.4520),
    ("Av. Maipú 1500", "Vicente López", -34.5235, -58.4795), ("Av. Mitre 600", "Avellaneda", -34.6625, -58.3650),
    ("Av. Rivadavia 15000", "Ramos Mejía", -34.6430, -58.5650), ("Av. del Libertador 13000", "Martínez", -34.4920, -58.5030),
    ("Av. San Juan 3000", "San Cristóbal", -34.6235, -58.4050), ("Av. Álvarez Thomas 1500", "Colegiales", -34.5760, -58.4570),
    ("Av. Córdoba 6000", "Chacarita", -34.5850, -58.4440), ("Av. Monroe 3000", "Coghlan", -34.5640, -58.4690),
    ("Av. La Plata 1500", "Boedo", -34.6330, -58.4250), ("Av. Gaona 3500", "Floresta", -34.6190, -58.4780),
    ("Av. Triunvirato 4000", "Villa Urquiza", -34.5750, -58.4870), ("Av. Pueyrredón 1000", "Balvanera", -34.6050, -58.4050),
    ("Av. Hipólito Yrigoyen 8000", "Banfield", -34.7440, -58.3950), ("Av. Belgrano 2500", "Balvanera", -34.6135, -58.4025),
    ("Av. Callao 1200", "Recoleta", -34.5955, -58.3930), ("Av. Las Heras 3000", "Palermo", -34.5840, -58.4010),
    ("Av. Scalabrini Ortiz 1500", "Palermo", -34.5915, -58.4280), ("Av. Medrano 1000", "Almagro", -34.6030, -58.4210),
    ("Av. Díaz Vélez 5000", "Caballito", -34.6110, -58.4370), ("Av. Nazca 2000", "Villa Santa Rita", -34.6060, -58.4775),
    ("Av. San Martín 5000", "Agronomía", -34.5960, -58.4950), ("Av. Francisco Beiró 4000", "Villa Devoto", -34.6020, -58.5060),
    ("Av. Juan B. Alberdi 5000", "Parque Avellaneda", -34.6400, -58.4700), ("Av. Larrazábal 1500", "Mataderos", -34.6510, -58.4960),
    ("Av. Centenario 1000", "San Isidro", -34.4720, -58.5160), ("Av. Rivadavia 18000", "Morón", -34.6520, -58.6100),
    ("Av. del Libertador 300", "Vicente López", -34.5280, -58.4710), ("Av. Cabildo 4500", "Saavedra", -34.5440, -58.4760),
]
DEALER_PREFIXES = ["Alto", "Delta", "Puerto", "Cumbre", "Vía", "Faro", "Norte", "Arena", "Brisa", "Nexo", "Senda", "Nova"]
DEALER_SUFFIXES = ["Automotores", "Motors", "Autos", "Center", "Cars", "Group"]
HOURS = [("Lunes a viernes", "8:30 a 17:30"), ("Lunes a sábado", "9:00 a 18:00"), ("Lunes a viernes", "8:00 a 17:00")]
USER_REF = (-34.5880, -58.4300)  # ubicación simulada del usuario (Palermo)

VIN_VALUES = dict(zip("ABCDEFGHJKLMNPRSTUVWXYZ", [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9]))
VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
VIN_CHARS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
YEAR_CODE = {y: c for y, c in zip(range(2001, 2031), "123456789ABCDEFGHJKLMNPRSTVWXY")}
MERCOSUR_PREFIX = {2016: "AA", 2017: "AB", 2018: "AC", 2019: "AD", 2020: "AE", 2021: "AF", 2022: "AF",
                   2023: "AG", 2024: "AH", 2025: "AH", 2026: "AI"}
OLD_PREFIX = {2006: "F", 2007: "G", 2008: "H", 2009: "I", 2010: "J", 2011: "K", 2012: "L", 2013: "M",
              2014: "N", 2015: "O"}
LETTERS = "ABCDEFGHJKLMNPRSTUVWXYZ"


# ---------------------------------------------------------------------------
def familia(marca: str, desc: str) -> tuple[str, str]:
    """Separa la descripción DNRPA en (modelo, versión). Ej.: 'GOL TREND 1.6' -> ('GOL', 'TREND 1.6')."""
    words = desc.split()
    brand_words = set(marca.split())
    while words and (words[0] in brand_words or words[0] in {"NUEVO", "NUEVA", "NEW"}):
        words = words[1:]
    if not words:
        return "", ""
    first = re.sub(r"(?<=[A-Z])\d$", "", words[0]) if words[0] in ("RANGER2",) else words[0]
    if first in ("TIGGO", "HB", "CLASE") and len(words) > 1:
        return f"{first} {words[1]}", " ".join(words[2:])
    return first, " ".join(words[1:])


def bonito(fam: str) -> str:
    if fam in NOMBRES:
        return NOMBRES[fam]
    return " ".join(w if any(c.isdigit() for c in w) and len(w) <= 4 else w.capitalize() for w in fam.split())


SIGLAS = {"TFSI", "TSI", "THP", "HDI", "CRDI", "TGDI", "PHEV", "MHEV", "HEV", "AWD", "FWD", "RWD", "SCE", "VTI",
          "GSE", "EOBD", "TDI", "CDI", "DCT", "CVT", "SRV", "SRX", "XEI", "XLI", "XLS", "LTZ", "GLX", "EXL",
          "DM-I", "I-DM", "MSI", "TCE", "ZEN", "GTI", "AMG", "4MATIC", "XDRIVE", "SDRIVE", "PRO4X", "MY25", "MY26", "MY27"}


def version_bonita(v: str) -> str:
    if not v:
        return "Base"
    out = []
    for w in v.split():
        u = w.upper()
        if u in SIGLAS:
            out.append({"4MATIC": "4Matic", "XDRIVE": "xDrive", "SDRIVE": "sDrive", "DM-I": "DM-i", "I-DM": "i-DM", "ZEN": "Zen"}.get(u, u))
        elif re.fullmatch(r"\d+X\d", u):
            out.append(u.lower())
        elif "/" in u and all(len(p) <= 2 for p in u.split("/")):
            out.append(u)
        elif any(c.isdigit() for c in u) or (u.isalpha() and len(u) <= 3):
            out.append(u)
        else:
            out.append(w.capitalize())
    return " ".join(out)[:40].strip()


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
    for a, b in (("ë", "e"), ("é", "e"), ("í", "i"), ("á", "a"), ("ó", "o"), ("ú", "u")):
        text = text.lower().replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def find_array(src: str, name: str):
    m = re.search(r"export const %s[^=]*= (\[)" % name, src)
    start, depth = m.start(1), 0
    for i in range(start, len(src)):
        depth += src[i] == "["
        depth -= src[i] == "]"
        if depth == 0:
            return start, i + 1
    raise ValueError(name)


# ---------------------------------------------------------------------------
def cargar(paths, anio_min, anio_max):
    cols = ["registro_seccional_provincia", "automotor_anio_modelo", "automotor_tipo_descripcion",
            "automotor_marca_descripcion", "automotor_modelo_descripcion", "automotor_uso_descripcion"]
    df = pd.concat([pd.read_csv(p, usecols=cols, dtype=str, encoding="utf-8-sig", on_bad_lines="skip") for p in paths])
    df = df[df.automotor_tipo_descripcion.fillna("").str.match(TIPOS_LIVIANOS)]
    df = df[df.automotor_uso_descripcion == "Privado"]
    df = df[df.automotor_marca_descripcion.isin(MARCAS)]
    df = df[df.registro_seccional_provincia.notna() & df.automotor_modelo_descripcion.notna()]
    df["anio"] = pd.to_numeric(df.automotor_anio_modelo, errors="coerce")
    df = df[(df.anio >= anio_min) & (df.anio <= anio_max)]
    fv = [familia(m, d) for m, d in zip(df.automotor_marca_descripcion, df.automotor_modelo_descripcion.fillna(""))]
    df["fam"] = [f for f, _ in fv]
    df["ver"] = [v for _, v in fv]
    return df[df.fam != ""]


def muestrear(df, n_familias, n_unidades):
    """Toma las familias más vendidas y, además, la principal de cada marca, para que todas las marcas aparezcan."""
    conteo = df.groupby(["automotor_marca_descripcion", "fam"]).size().sort_values(ascending=False)
    elegidas = list(conteo.head(n_familias).index)
    for marca in conteo.index.get_level_values(0).unique():
        top = conteo[marca].head(2 if conteo[marca].sum() > 0.01 * conteo.sum() else 1)
        for fam, v in top.items():
            if (marca, fam) not in elegidas and v >= 30:
                elegidas.append((marca, fam))
    total = conteo[elegidas].sum()
    cupos = {k: min(6, max(2, round(conteo[k] / total * n_unidades))) for k in elegidas}
    filas = []
    for (marca, fam), cupo in cupos.items():
        sub = df[(df.automotor_marca_descripcion == marca) & (df.fam == fam)]
        for _, r in sub.sample(n=min(cupo, len(sub)), random_state=rng.randrange(10**6)).iterrows():
            filas.append({
                "brand": MARCAS[marca], "model": bonito(fam), "version": version_bonita(r.ver),
                "year": int(r.anio), "province": r.registro_seccional_provincia,
            })
    return filas, set(elegidas), len(df)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--altas", nargs="+", required=True)
    ap.add_argument("--transferencias", nargs="+", required=True)
    args = ap.parse_args()

    # Siempre parte de la base original (rama main) para que el resultado sea reproducible
    src = subprocess.run(["git", "-C", str(ROOT), "show", "origin/main:src/data/avisar-db.ts"],
                         capture_output=True, text=True, check=True).stdout
    tables = {}
    for name in ["USERS", "VEHICLES", "OWNERSHIPS", "CAMPAIGNS", "ALERTS", "QUERY_HISTORY"]:
        a, b = find_array(src, name)
        tables[name] = json.loads(src[a:b])
    vehicles, campaigns = tables["VEHICLES"], tables["CAMPAIGNS"]

    usados = cargar(args.transferencias, 2006, 2025)
    okm = cargar(args.altas, 2025, 2026)
    filas_u, fam_u, total_u = muestrear(usados, TOP_FAMILIAS_USADOS, N_USADOS)
    filas_0, fam_0, total_0 = muestrear(okm, TOP_FAMILIAS_0KM, N_0KM)
    filas = filas_u + filas_0

    used_vins = {v["vin"] for v in vehicles}
    used_plates = {v["plateNormalized"] for v in vehicles}
    next_veh = max(int(v["id"][4:]) for v in vehicles if v["id"].startswith("VEH-")) + 1
    nuevos = []
    for f in filas:
        plate = make_plate(f["year"], used_plates)
        nuevos.append({
            "id": f"VEH-{next_veh:04d}", "plate": plate,
            "vin": make_vin(WMI.get(f["brand"], "8A0"), f["year"], used_vins),
            "brand": f["brand"], "model": f["model"], "version": f["version"], "year": str(f["year"]),
            "plateNormalized": plate.replace(" ", ""), "province": f["province"],
        })
        next_veh += 1
    vehicles += nuevos

    # Campañas ficticias para los modelos nuevos -------------------------------
    used_ids = {c["id"] for c in campaigns}
    por_modelo = {}
    for v in nuevos:
        por_modelo.setdefault((v["brand"], v["model"]), []).append(int(v["year"]))
    # Años protegidos: vehículos de las cuentas demo y de los escenarios de la portada
    ids_demo = {o["vehicleId"] for o in tables["OWNERSHIPS"]} | {"toyota-corolla-2021", "ford-focus-2018", "volkswagen-gol-2019"}
    protegidos = {(v["brand"], v["model"], int(v["year"])) for v in vehicles if v["id"] in ids_demo}
    for (brand, model), years in sorted(por_modelo.items()):
        original = (brand, model) in MODELOS_ORIGINALES
        if original:
            years = [y for y in years if (brand, model, y) not in protegidos]
            if not years:
                continue
        n_camp = 3 if len(years) >= 5 else 2
        fallas = FALLAS_ELECTRICOS if brand in ELECTRICOS else list(FALLAS_COMBUSTION)
        if model in UTILITARIOS:
            fallas = fallas + ["puerta_corrediza"] * 3
        elegidas = rng.sample(fallas, n_camp)
        for k, fault in enumerate(elegidas):
            centro = sorted(years)[len(years) // 2] if k == 0 else rng.choice(years)
            span = rng.choice([2, 3, 4])
            y_from, y_to = centro - rng.randrange(span + 1), centro + rng.randrange(span + 1)
            y_to = min(y_to, 2026)
            if original:
                bloqueados = sorted(y for (b, m, y) in protegidos if b == brand and m == model)
                while any(y_from <= y <= y_to for y in bloqueados) and y_from <= y_to:
                    if centro > max(b for b in bloqueados if y_from <= b <= y_to):
                        y_from += 1
                    else:
                        y_to -= 1
                if y_from > y_to or not (y_from <= centro <= y_to):
                    continue
            risk = rng.choices(["CRÍTICO", "ALTO", "MEDIO"], weights=[3, 4, 3])[0]
            title, component, description, danger, action = FAULTS[fault]
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
                "campaign": f"DEMO-SC-{year}-{FAULT_CODE[fault]}-{re.sub('[^A-Z0-9]', '', model.upper())[:4]}",
                "brand": brand, "model": model, "yearFrom": y_from, "yearTo": y_to,
                "title": title, "component": component, "risk": risk,
                "description": description, "danger": danger, "action": action,
                "date": f"{day} de {MONTHS[month - 1]} de {year}",
                "publishedAt": f"{year}-{month:02d}-{day:02d}",
                "contact": CONTACTS.get(brand, f"0800-000-{rng.randrange(200, 999):04d}"),
            })
    campaigns.sort(key=lambda c: c["publishedAt"], reverse=True)

    def recalls(v):
        y = int(v["year"])
        return [c for c in campaigns if c["brand"] == v["brand"] and c["model"] == v["model"] and c["yearFrom"] <= y <= c["yearTo"]]

    # Cuenta demo con vehículos tomados del parque real ------------------------
    users, owners, alerts = tables["USERS"], tables["OWNERSHIPS"], tables["ALERTS"]
    users.append({
        "id": "USR-0009", "name": "Martina", "fullName": "Martina Ejemplo", "email": "martina@demo.avisar.com",
        "password": "demo1234", "phone": "+54 9 11 0000-0009", "province": "Córdoba",
        "scenario": "Familia con varios vehículos de marcas distintas y campañas pendientes",
        "createdAt": "2026-10-30",
        "consent": {"accepted": True, "acceptedAt": "2026-10-30", "text": users[0]["consent"]["text"]},
    })
    picks, marcas_vistas = [], set()
    for v in nuevos:
        if recalls(v) and v["brand"] not in marcas_vistas and (v["brand"], v["model"]) not in MODELOS_ORIGINALES:
            picks.append(v)
            marcas_vistas.add(v["brand"])
        if len(picks) == 4:
            break
    next_own = max(int(o["id"][4:]) for o in owners) + 1
    next_alr = max(int(a["id"][4:]) for a in alerts) + 1
    for i, v in enumerate(picks):
        owners.append({
            "id": f"OWN-{next_own + i:04d}", "vehicleId": v["id"], "ownerId": "USR-0009", "plate": v["plate"],
            "vin": v["vin"], "role": "titular" if i < 3 else "usuario habitual", "since": "2026-10-30",
            "until": None, "source": "Declarado por el usuario en AvisAR", "verified": False,
        })
        if i < 2:
            alerts.append({
                "id": f"ALR-{next_alr + i:04d}", "ownerId": "USR-0009", "vehicleId": v["id"],
                "vehicle": f"{v['brand']} {v['model']} {v['version']} {v['year']}", "plate": v["plate"],
                "channel": "WhatsApp" if i == 0 else "E-mail",
                "destination": "+54 9 11 0000-0009" if i == 0 else "martina@demo.avisar.com", "active": True,
            })

    for i, v in enumerate(picks):
        tables["QUERY_HISTORY"].append({"ownerId": "USR-0009", "vehicleId": v["id"], "consultedAt": f"2026-11-0{1 + i % 3}"})

    for name in ["QUERY_HISTORY", "ALERTS", "CAMPAIGNS", "OWNERSHIPS", "VEHICLES", "USERS"]:
        a, b = find_array(src, name)
        src = src[:a] + json.dumps(tables[name], ensure_ascii=False, indent=2, allow_nan=False) + src[b:]

    # Concesionarios para las marcas que no tienen ------------------------------
    a, b = find_array(src, "DEALERS")
    block = src[a:b]
    have = set(re.findall(r'brand: "([^"]+)"', block))
    cuenta = {}
    for v in vehicles:
        cuenta[v["brand"]] = cuenta.get(v["brand"], 0) + 1
    added, loc_i = [], 0
    lat0, lat1, lng0, lng1 = -34.75, -34.47, -58.62, -58.36
    for brand in sorted(cuenta):
        if brand in have:
            continue
        for n in range(2 if cuenta[brand] >= 8 else 1):
            addr, hood, lat, lng = LOCATIONS[loc_i % len(LOCATIONS)]
            loc_i += 1
            days, hours = HOURS[loc_i % len(HOURS)]
            name = f"{DEALER_PREFIXES[(loc_i * 5) % len(DEALER_PREFIXES)]} {DEALER_SUFFIXES[loc_i % len(DEALER_SUFFIXES)]}"
            added.append(
                "  {\n"
                f'    id: "{slug(brand)}-{slug(hood)}-{n + 1}",\n    name: "{name}",\n    brand: "{brand}",\n'
                f'    address: "{addr}",\n    neighborhood: "{hood}",\n    distanceKm: {km(USER_REF, (lat, lng))},\n'
                f'    days: "{days}",\n    hours: "{hours}",\n'
                f"    x: {round(8 + (lng - lng0) / (lng1 - lng0) * 84)},\n    y: {round(8 + (lat1 - lat) / (lat1 - lat0) * 84)},\n"
                f"    lat: {lat},\n    lng: {lng},\n  }},"
            )
    body = block[:-1].rstrip()
    if not body.endswith(","):
        body += ","
    src = src[:a] + body + "\n" + "\n".join(added) + "\n]" + src[b:]

    # Tipo y encabezado -------------------------------------------------------
    src = src.replace("  version: string\n  year: string\n}",
                      "  version: string\n  year: string\n  /** Provincia del registro seccional (DNRPA). Solo en los vehículos tomados del parque real. */\n  province?: string\n}", 1)
    miles = lambda n: f"{n:,}".replace(",", ".")
    header = (
        " * Base generada el 2026-10-20 con gen_db.py. No editar a mano los arrays.\n"
        " * Vehículos ampliados con datos abiertos de la DNRPA (datos.gob.ar, licencia CC BY 4.0): marca, modelo,\n"
        f" * versión, año y provincia de una muestra de {miles(total_u)} transferencias (enero a septiembre de 2026)\n"
        f" * y {miles(total_0)} inscripciones iniciales (septiembre de 2026) de autos y SUV de uso privado (sin pick-ups ni utilitarios).\n"
        " * El dataset no publica dominio ni VIN: las patentes y los VIN son ficticios.\n"
        " * Regenerar con scripts/ampliar_datos_demo.py.\n"
        " * Las campañas"
    )
    src = re.sub(r" \* Generado el .*?\n \* Las campañas", lambda _: header, src, count=1, flags=re.S)
    DB.write_text(src, encoding="utf-8")

    n = [len(recalls(v)) for v in vehicles]
    print(f"Vehículos: {len(vehicles)} (+{len(nuevos)}) · Marcas: {len({v['brand'] for v in vehicles})} · "
          f"Modelos: {len({(v['brand'], v['model']) for v in vehicles})}")
    print(f"Campañas: {len(campaigns)} · Concesionarios nuevos: {len(added)} · Cuenta demo: {[p['model'] for p in picks]}")
    print(f"Recalls por vehículo -> 0: {n.count(0)} · 1: {n.count(1)} · 2+: {sum(x >= 2 for x in n)}")


if __name__ == "__main__":
    main()
