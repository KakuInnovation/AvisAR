/**
 * AvisAR — base de datos de demostración
 * -------------------------------------------------------------
 * Datos 100 % sintéticos. Personas, contactos, patentes, VIN y campañas son ficticios. La relación vehículo-titular es la que declara cada usuario al registrarse en AvisAR; no proviene del registro automotor.
 *
 * Generado el 2026-10-20. No editar a mano los arrays: regenerar con gen_db.py.
 * Las campañas tienen códigos con prefijo DEMO- y no corresponden a recalls reales.
 */

export type Risk = "CRÍTICO" | "ALTO" | "MEDIO"
export type RepairStatus = "Pendiente de revisión" | "Reparación programada" | "Reparación realizada"
export type Channel = "WhatsApp" | "E-mail"

/* ---------- Tablas ---------- */

export interface DbUser {
  id: string
  name: string
  fullName: string
  email: string
  password: string // solo demo: en producción nunca se guarda en texto plano
  phone: string
  province: string
  scenario: string
  createdAt: string
  consent: { accepted: boolean; acceptedAt: string; text: string }
}

export interface DbVehicle {
  id: string
  plate: string
  plateNormalized: string
  vin: string
  brand: string
  model: string
  version: string
  year: string
}

/** Relación patente / VIN → id del dueño (cuenta de AvisAR). */
export interface DbOwnership {
  id: string
  vehicleId: string
  ownerId: string
  plate: string
  vin: string
  role: "titular" | "usuario habitual"
  since: string
  until: string | null
  source: string
  verified: boolean
}

/** Campaña con alcance por marca, modelo y rango de años. Compatible con el tipo Recall de App.tsx. */
export interface DbCampaign {
  id: string
  campaign: string
  brand: string
  model: string
  yearFrom: number
  yearTo: number
  title: string
  component: string
  risk: Risk
  description: string
  danger: string
  action: string
  date: string
  publishedAt: string
  contact: string
}

export interface DbRepairStatus {
  vehicleId: string
  campaignId: string
  ownerId: string
  status: RepairStatus
  updatedAt: string
}

export interface DbAlert {
  id: string
  ownerId: string
  vehicleId: string
  vehicle: string
  plate: string
  channel: Channel
  destination: string
  active: boolean
}

export interface DbQuery {
  ownerId: string
  vehicleId: string
  consultedAt: string
}

export const USERS: DbUser[] = [
  {
    "id": "USR-0001",
    "name": "Martín",
    "fullName": "Martín Demo",
    "email": "usuario@avisar.com",
    "password": "segura123",
    "phone": "+54 9 11 0000-0001",
    "province": "CABA",
    "scenario": "Cuenta demo principal: varios vehículos, alertas configuradas",
    "createdAt": "2026-09-15",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-09-15",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0002",
    "name": "Gustavo",
    "fullName": "Gustavo Ejemplo",
    "email": "gustavo@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 11 0000-0002",
    "province": "Buenos Aires",
    "scenario": "Compró un usado con campaña crítica y nunca recibió aviso",
    "createdAt": "2026-08-21",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-08-21",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0003",
    "name": "Carolina",
    "fullName": "Carolina Ejemplo",
    "email": "carolina@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 299 000-0003",
    "province": "Neuquén",
    "scenario": "Primera titular: recibió el aviso y no reparó",
    "createdAt": "2026-09-11",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-09-11",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0004",
    "name": "Lucía",
    "fullName": "Lucía Ejemplo",
    "email": "lucia@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 2920 00-0004",
    "province": "Río Negro",
    "scenario": "Sin campañas: alerta preventiva activa",
    "createdAt": "2026-04-16",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-04-16",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0005",
    "name": "Jorge",
    "fullName": "Jorge Ejemplo",
    "email": "jorge@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 351 000-0005",
    "province": "Córdoba",
    "scenario": "Reparación realizada y cerrada",
    "createdAt": "2026-03-21",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-03-21",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0006",
    "name": "Sofía",
    "fullName": "Sofía Ejemplo",
    "email": "sofia@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 341 000-0006",
    "province": "Santa Fe",
    "scenario": "Reparación programada",
    "createdAt": "2026-09-26",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-09-26",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0007",
    "name": "Nicolás",
    "fullName": "Nicolás Ejemplo",
    "email": "nicolas@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 11 0000-0007",
    "province": "Buenos Aires",
    "scenario": "Vendió su auto: titularidad cerrada",
    "createdAt": "2026-06-03",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-06-03",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0008",
    "name": "Valeria",
    "fullName": "Valeria Ejemplo",
    "email": "valeria@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 261 000-0008",
    "province": "Mendoza",
    "scenario": "Cuenta nueva sin vehículos (estado vacío)",
    "createdAt": "2026-04-02",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-04-02",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  },
  {
    "id": "USR-0009",
    "name": "Martina",
    "fullName": "Martina Ejemplo",
    "email": "martina@demo.avisar.com",
    "password": "demo1234",
    "phone": "+54 9 11 0000-0009",
    "province": "Ciudad de Buenos Aires",
    "scenario": "Familia con varios vehículos de marcas nuevas y campañas pendientes",
    "createdAt": "2026-10-30",
    "consent": {
      "accepted": true,
      "acceptedAt": "2026-10-30",
      "text": "Acepto que AvisAR use mis datos solo para avisarme sobre campañas de seguridad. Puedo darme de baja en cualquier momento."
    }
  }
]

export const VEHICLES: DbVehicle[] = [
  {
    "id": "toyota-corolla-2021",
    "plate": "AA 000 AA",
    "vin": "8AJBA3HE7MA338209",
    "brand": "Toyota",
    "model": "Corolla",
    "version": "XEi 2.0 CVT",
    "year": "2021",
    "plateNormalized": "AA000AA"
  },
  {
    "id": "ford-focus-2018",
    "plate": "AD 456 EF",
    "vin": "8AFAR23J5JA533055",
    "brand": "Ford",
    "model": "Focus",
    "version": "SE Plus 2.0",
    "year": "2018",
    "plateNormalized": "AD456EF"
  },
  {
    "id": "volkswagen-gol-2019",
    "plate": "AB 123 CD",
    "vin": "9BWAB45U7KA213502",
    "brand": "Volkswagen",
    "model": "Gol",
    "version": "Trend Comfortline",
    "year": "2019",
    "plateNormalized": "AB123CD"
  },
  {
    "id": "toyota-yaris-2022",
    "plate": "AF 782 KL",
    "vin": "8AJBA9F35NA068676",
    "brand": "Toyota",
    "model": "Yaris",
    "version": "XLS 1.5 CVT",
    "year": "2022",
    "plateNormalized": "AF782KL"
  },
  {
    "id": "ford-ranger-2020",
    "plate": "AE 321 MN",
    "vin": "8AFAR22L1LA258130",
    "brand": "Ford",
    "model": "Ranger",
    "version": "XLT 3.2 4x4",
    "year": "2020",
    "plateNormalized": "AE321MN"
  },
  {
    "id": "renault-sandero-2021",
    "plate": "AE 908 QR",
    "vin": "93Y5SRZH4MA447797",
    "brand": "Renault",
    "model": "Sandero",
    "version": "Intens 1.6 CVT",
    "year": "2021",
    "plateNormalized": "AE908QR"
  },
  {
    "id": "VEH-0007",
    "plate": "MCU 227",
    "vin": "93HFB2501CA660426",
    "brand": "Honda",
    "model": "Civic",
    "version": "EXS 1.8",
    "year": "2012",
    "plateNormalized": "MCU227"
  },
  {
    "id": "VEH-0008",
    "plate": "AC 686 TG",
    "vin": "8AP359102KA161193",
    "brand": "Fiat",
    "model": "Cronos",
    "version": "Drive 1.3",
    "year": "2019",
    "plateNormalized": "AC686TG"
  },
  {
    "id": "VEH-0009",
    "plate": "AD 051 BF",
    "vin": "8AJHA8CD7LA119402",
    "brand": "Toyota",
    "model": "Hilux",
    "version": "SRV 2.8 4x4",
    "year": "2020",
    "plateNormalized": "AD051BF"
  },
  {
    "id": "VEH-0010",
    "plate": "AE 760 JR",
    "vin": "8ADUCNFPXMA426774",
    "brand": "Peugeot",
    "model": "208",
    "version": "Allure 1.6",
    "year": "2021",
    "plateNormalized": "AE760JR"
  },
  {
    "id": "VEH-0011",
    "plate": "AB 281 GY",
    "vin": "9BGKS48U7JA466250",
    "brand": "Chevrolet",
    "model": "Onix",
    "version": "LT 1.4",
    "year": "2018",
    "plateNormalized": "AB281GY"
  },
  {
    "id": "VEH-0012",
    "plate": "AF 940 ZC",
    "vin": "3N1CN7AD1NA334667",
    "brand": "Nissan",
    "model": "Versa",
    "version": "Advance 1.6",
    "year": "2022",
    "plateNormalized": "AF940ZC"
  },
  {
    "id": "VEH-0013",
    "plate": "LGC 731",
    "vin": "8BCLNFUC8AA608813",
    "brand": "Citroën",
    "model": "C3",
    "version": "Exclusive 1.6",
    "year": "2010",
    "plateNormalized": "LGC731"
  },
  {
    "id": "VEH-0014",
    "plate": "AC 597 BT",
    "vin": "8AWDD22H2KA216975",
    "brand": "Volkswagen",
    "model": "Amarok",
    "version": "Highline 2.0 4x4",
    "year": "2019",
    "plateNormalized": "AC597BT"
  },
  {
    "id": "VEH-0015",
    "plate": "AA 468 GR",
    "vin": "9BFZH55L1HA336316",
    "brand": "Ford",
    "model": "Ka",
    "version": "SE 1.5",
    "year": "2017",
    "plateNormalized": "AA468GR"
  },
  {
    "id": "VEH-0016",
    "plate": "AA 319 VW",
    "vin": "8AJBA3HE8HA993470",
    "brand": "Toyota",
    "model": "Corolla",
    "version": "XEi 2.0 CVT",
    "year": "2017",
    "plateNormalized": "AA319VW"
  },
  {
    "id": "VEH-0017",
    "plate": "AC 945 BM",
    "vin": "8AJBA9F33KA099582",
    "brand": "Toyota",
    "model": "Yaris",
    "version": "XLS 1.5 CVT",
    "year": "2019",
    "plateNormalized": "AC945BM"
  },
  {
    "id": "VEH-0018",
    "plate": "AC 094 NZ",
    "vin": "8AFAR23J5KA900649",
    "brand": "Ford",
    "model": "Focus",
    "version": "SE Plus 2.0",
    "year": "2019",
    "plateNormalized": "AC094NZ"
  },
  {
    "id": "VEH-0019",
    "plate": "PUN 917",
    "vin": "8AFAR22L4GA565829",
    "brand": "Ford",
    "model": "Ranger",
    "version": "XL 2.2 4x2",
    "year": "2016",
    "plateNormalized": "PUN917"
  },
  {
    "id": "VEH-0020",
    "plate": "AE 132 YF",
    "vin": "9BWAB45U3MA419242",
    "brand": "Volkswagen",
    "model": "Gol",
    "version": "Trendline 1.6",
    "year": "2021",
    "plateNormalized": "AE132YF"
  },
  {
    "id": "VEH-0021",
    "plate": "PXF 288",
    "vin": "93Y5SRZH3GA845426",
    "brand": "Renault",
    "model": "Sandero",
    "version": "Life 1.6",
    "year": "2016",
    "plateNormalized": "PXF288"
  },
  {
    "id": "VEH-0022",
    "plate": "AD 465 PR",
    "vin": "8AP359103LA869941",
    "brand": "Fiat",
    "model": "Cronos",
    "version": "Precision 1.8",
    "year": "2020",
    "plateNormalized": "AD465PR"
  },
  {
    "id": "VEH-0023",
    "plate": "AD 221 AA",
    "vin": "8ADUCNFP3LA546365",
    "brand": "Peugeot",
    "model": "208",
    "version": "Allure 1.6",
    "year": "2020",
    "plateNormalized": "AD221AA"
  },
  {
    "id": "VEH-0024",
    "plate": "PXY 559",
    "vin": "9BGKS48U9GA576239",
    "brand": "Chevrolet",
    "model": "Onix",
    "version": "LT 1.4",
    "year": "2016",
    "plateNormalized": "PXY559"
  },
  {
    "id": "VEH-0025",
    "plate": "MFB 118",
    "vin": "93HFB2508CA666191",
    "brand": "Honda",
    "model": "Civic",
    "version": "EXS 1.8",
    "year": "2012",
    "plateNormalized": "MFB118"
  },
  {
    "id": "VEH-0026",
    "plate": "LTS 584",
    "vin": "8BCLNFUC2AA169835",
    "brand": "Citroën",
    "model": "C3",
    "version": "SX 1.4",
    "year": "2010",
    "plateNormalized": "LTS584"
  },
  {
    "id": "VEH-0027",
    "plate": "AB 833 ZY",
    "vin": "3N1CN7AD4JA383307",
    "brand": "Nissan",
    "model": "Versa",
    "version": "Sense 1.6",
    "year": "2018",
    "plateNormalized": "AB833ZY"
  },
  {
    "id": "VEH-0028",
    "plate": "PYR 694",
    "vin": "8AWDD22HXGA472689",
    "brand": "Volkswagen",
    "model": "Amarok",
    "version": "Highline 2.0 4x4",
    "year": "2016",
    "plateNormalized": "PYR694"
  },
  {
    "id": "VEH-0029",
    "plate": "AB 488 LH",
    "vin": "9BFZH55L0JA460387",
    "brand": "Ford",
    "model": "Ka",
    "version": "SE 1.5",
    "year": "2018",
    "plateNormalized": "AB488LH"
  },
  {
    "id": "VEH-0030",
    "plate": "OSS 112",
    "vin": "8AJHA8CD0EA704339",
    "brand": "Toyota",
    "model": "Hilux",
    "version": "SRV 2.8 4x4",
    "year": "2014",
    "plateNormalized": "OSS112"
  },
  {
    "id": "VEH-0031",
    "plate": "AE 573 NV",
    "vin": "8AJBA3HE6MA407455",
    "brand": "Toyota",
    "model": "Corolla",
    "version": "XEi 2.0 CVT",
    "year": "2021",
    "plateNormalized": "AE573NV"
  },
  {
    "id": "VEH-0032",
    "plate": "AD 900 RE",
    "vin": "8AJBA9F37LA647181",
    "brand": "Toyota",
    "model": "Yaris",
    "version": "XLS 1.5 CVT",
    "year": "2020",
    "plateNormalized": "AD900RE"
  },
  {
    "id": "VEH-0033",
    "plate": "AA 310 SX",
    "vin": "8AFAR23J4HA512918",
    "brand": "Ford",
    "model": "Focus",
    "version": "S 1.6",
    "year": "2017",
    "plateNormalized": "AA310SX"
  },
  {
    "id": "VEH-0034",
    "plate": "PPL 054",
    "vin": "8AFAR22L3GA792607",
    "brand": "Ford",
    "model": "Ranger",
    "version": "XL 2.2 4x2",
    "year": "2016",
    "plateNormalized": "PPL054"
  },
  {
    "id": "VEH-0035",
    "plate": "AB 519 VS",
    "vin": "9BWAB45U4JA841581",
    "brand": "Volkswagen",
    "model": "Gol",
    "version": "Trend Comfortline",
    "year": "2018",
    "plateNormalized": "AB519VS"
  },
  {
    "id": "VEH-0036",
    "plate": "OGX 896",
    "vin": "93Y5SRZH1EA061677",
    "brand": "Renault",
    "model": "Sandero",
    "version": "Intens 1.6 CVT",
    "year": "2014",
    "plateNormalized": "OGX896"
  },
  {
    "id": "VEH-0037",
    "plate": "AC 804 LM",
    "vin": "8AP35910XKA797425",
    "brand": "Fiat",
    "model": "Cronos",
    "version": "Drive 1.3",
    "year": "2019",
    "plateNormalized": "AC804LM"
  },
  {
    "id": "VEH-0038",
    "plate": "AA 514 ZX",
    "vin": "8ADUCNFP8HA361509",
    "brand": "Peugeot",
    "model": "208",
    "version": "Active 1.6",
    "year": "2017",
    "plateNormalized": "AA514ZX"
  },
  {
    "id": "VEH-0039",
    "plate": "PFU 317",
    "vin": "9BGKS48U9GA960876",
    "brand": "Chevrolet",
    "model": "Onix",
    "version": "LT 1.4",
    "year": "2016",
    "plateNormalized": "PFU317"
  },
  {
    "id": "VEH-0040",
    "plate": "KKX 452",
    "vin": "93HFB25069A165406",
    "brand": "Honda",
    "model": "Civic",
    "version": "LXS 1.8",
    "year": "2009",
    "plateNormalized": "KKX452"
  },
  {
    "id": "VEH-0041",
    "plate": "NRY 972",
    "vin": "8BCLNFUC8DA362141",
    "brand": "Citroën",
    "model": "C3",
    "version": "Exclusive 1.6",
    "year": "2013",
    "plateNormalized": "NRY972"
  },
  {
    "id": "VEH-0042",
    "plate": "AG 221 YS",
    "vin": "3N1CN7AD7RA442295",
    "brand": "Nissan",
    "model": "Versa",
    "version": "Advance 1.6",
    "year": "2024",
    "plateNormalized": "AG221YS"
  },
  {
    "id": "VEH-0043",
    "plate": "NRJ 805",
    "vin": "8AWDD22H4DA413262",
    "brand": "Volkswagen",
    "model": "Amarok",
    "version": "Comfortline 2.0",
    "year": "2013",
    "plateNormalized": "NRJ805"
  },
  {
    "id": "VEH-0044",
    "plate": "AD 472 BP",
    "vin": "9BFZH55L3LA353501",
    "brand": "Ford",
    "model": "Ka",
    "version": "SE 1.5",
    "year": "2020",
    "plateNormalized": "AD472BP"
  },
  {
    "id": "VEH-0045",
    "plate": "PNF 146",
    "vin": "8AJHA8CD1GA110555",
    "brand": "Toyota",
    "model": "Hilux",
    "version": "SRV 2.8 4x4",
    "year": "2016",
    "plateNormalized": "PNF146"
  },
  {
    "id": "VEH-0046",
    "plate": "AB 091 EF",
    "vin": "988LNJDT7HJ775604",
    "brand": "Jeep",
    "model": "Renegade",
    "version": "Sport 1.8 AT",
    "year": "2017",
    "plateNormalized": "AB091EF"
  },
  {
    "id": "VEH-0047",
    "plate": "AD 697 ZT",
    "vin": "988HM5NX9KJ187891",
    "brand": "Jeep",
    "model": "Renegade",
    "version": "Longitude 1.3T AT",
    "year": "2019",
    "plateNormalized": "AD697ZT"
  },
  {
    "id": "VEH-0048",
    "plate": "AF 320 LR",
    "vin": "988Y6PSH4NA077502",
    "brand": "Jeep",
    "model": "Renegade",
    "version": "Sport 1.8 AT",
    "year": "2022",
    "plateNormalized": "AF320LR"
  },
  {
    "id": "VEH-0049",
    "plate": "AC 318 GT",
    "vin": "9887RH209JA089139",
    "brand": "Jeep",
    "model": "Compass",
    "version": "Sport 2.4 AT",
    "year": "2018",
    "plateNormalized": "AC318GT"
  },
  {
    "id": "VEH-0050",
    "plate": "AE 496 EG",
    "vin": "988VTCGY3LD456225",
    "brand": "Jeep",
    "model": "Compass",
    "version": "Limited 1.3T AT",
    "year": "2020",
    "plateNormalized": "AE496EG"
  },
  {
    "id": "VEH-0051",
    "plate": "AG 774 HS",
    "vin": "988B8LCJ3PJ113130",
    "brand": "Jeep",
    "model": "Compass",
    "version": "Sport 2.4 AT",
    "year": "2023",
    "plateNormalized": "AG774HS"
  },
  {
    "id": "VEH-0052",
    "plate": "AD 721 ND",
    "vin": "1C6GZJMY4KA863978",
    "brand": "RAM",
    "model": "1500",
    "version": "Laramie 5.7 V8",
    "year": "2019",
    "plateNormalized": "AD721ND"
  },
  {
    "id": "VEH-0053",
    "plate": "AF 058 GF",
    "vin": "1C694DZT1MD662062",
    "brand": "RAM",
    "model": "1500",
    "version": "Rebel 5.7 V8",
    "year": "2021",
    "plateNormalized": "AF058GF"
  },
  {
    "id": "VEH-0054",
    "plate": "AG 724 LV",
    "vin": "1C658Z3S5PH073531",
    "brand": "RAM",
    "model": "1500",
    "version": "Laramie 5.7 V8",
    "year": "2023",
    "plateNormalized": "AG724LV"
  },
  {
    "id": "VEH-0055",
    "plate": "AC 855 YX",
    "vin": "9BHGHW2D3JF380196",
    "brand": "Hyundai",
    "model": "Creta",
    "version": "Safety 1.6 AT",
    "year": "2018",
    "plateNormalized": "AC855YX"
  },
  {
    "id": "VEH-0056",
    "plate": "AF 376 UV",
    "vin": "9BHVY8HU4MJ288316",
    "brand": "Hyundai",
    "model": "Creta",
    "version": "Limited 1.0T AT",
    "year": "2021",
    "plateNormalized": "AF376UV"
  },
  {
    "id": "VEH-0057",
    "plate": "AH 137 AM",
    "vin": "9BHZZSLU5RC665590",
    "brand": "Hyundai",
    "model": "Creta",
    "version": "Safety 1.6 AT",
    "year": "2024",
    "plateNormalized": "AH137AM"
  },
  {
    "id": "VEH-0058",
    "plate": "AA 840 LP",
    "vin": "KMH5CNA34GD525676",
    "brand": "Hyundai",
    "model": "Tucson",
    "version": "2.0 4x2 AT",
    "year": "2016",
    "plateNormalized": "AA840LP"
  },
  {
    "id": "VEH-0059",
    "plate": "AD 985 RF",
    "vin": "KMH0C8R40KB716315",
    "brand": "Hyundai",
    "model": "Tucson",
    "version": "2.0 4x4 AT",
    "year": "2019",
    "plateNormalized": "AD985RF"
  },
  {
    "id": "VEH-0060",
    "plate": "AF 580 NG",
    "vin": "KMH11F143NC117210",
    "brand": "Hyundai",
    "model": "Tucson",
    "version": "2.0 4x2 AT",
    "year": "2022",
    "plateNormalized": "AF580NG"
  },
  {
    "id": "VEH-0061",
    "plate": "AB 572 CT",
    "vin": "KNA8HVL29HH503123",
    "brand": "Kia",
    "model": "Sportage",
    "version": "EX 2.0 AT",
    "year": "2017",
    "plateNormalized": "AB572CT"
  },
  {
    "id": "VEH-0062",
    "plate": "AE 522 BK",
    "vin": "KNA9ES5V1LE445523",
    "brand": "Kia",
    "model": "Sportage",
    "version": "GT Line 2.0 AT",
    "year": "2020",
    "plateNormalized": "AE522BK"
  },
  {
    "id": "VEH-0063",
    "plate": "AG 848 UB",
    "vin": "KNAHBD6MXPB633986",
    "brand": "Kia",
    "model": "Sportage",
    "version": "EX 2.0 AT",
    "year": "2023",
    "plateNormalized": "AG848UB"
  },
  {
    "id": "VEH-0064",
    "plate": "AF 315 EM",
    "vin": "KNAZYEFFXMD458682",
    "brand": "Kia",
    "model": "Seltos",
    "version": "EX 1.6 AT",
    "year": "2021",
    "plateNormalized": "AF315EM"
  },
  {
    "id": "VEH-0065",
    "plate": "AG 454 DT",
    "vin": "KNAB5ZX45PC390090",
    "brand": "Kia",
    "model": "Seltos",
    "version": "SX 1.6T AT",
    "year": "2023",
    "plateNormalized": "AG454DT"
  },
  {
    "id": "VEH-0066",
    "plate": "AH 770 XH",
    "vin": "KNA8Z9F88SF170680",
    "brand": "Kia",
    "model": "Seltos",
    "version": "EX 1.6 AT",
    "year": "2025",
    "plateNormalized": "AH770XH"
  },
  {
    "id": "VEH-0067",
    "plate": "OJZ 784",
    "vin": "8AC58R447FJ013661",
    "brand": "Mercedes-Benz",
    "model": "Sprinter",
    "version": "311 CDI Furgón",
    "year": "2015",
    "plateNormalized": "OJZ784"
  },
  {
    "id": "VEH-0068",
    "plate": "AC 783 UM",
    "vin": "8ACU6NLF1JJ747900",
    "brand": "Mercedes-Benz",
    "model": "Sprinter",
    "version": "515 CDI Combi",
    "year": "2018",
    "plateNormalized": "AC783UM"
  },
  {
    "id": "VEH-0069",
    "plate": "AF 706 TC",
    "vin": "8ACYAB3T7NE560051",
    "brand": "Mercedes-Benz",
    "model": "Sprinter",
    "version": "311 CDI Furgón",
    "year": "2022",
    "plateNormalized": "AF706TC"
  },
  {
    "id": "VEH-0070",
    "plate": "AD 574 DM",
    "vin": "WDD4DK2RXKG474180",
    "brand": "Mercedes-Benz",
    "model": "Clase A",
    "version": "A200 Progressive",
    "year": "2019",
    "plateNormalized": "AD574DM"
  },
  {
    "id": "VEH-0071",
    "plate": "AF 730 TZ",
    "vin": "WDD5YMS65MG711011",
    "brand": "Mercedes-Benz",
    "model": "Clase A",
    "version": "A250 AMG Line",
    "year": "2021",
    "plateNormalized": "AF730TZ"
  },
  {
    "id": "VEH-0072",
    "plate": "AG 658 FK",
    "vin": "WDD1C8AA7PG832864",
    "brand": "Mercedes-Benz",
    "model": "Clase A",
    "version": "A200 Progressive",
    "year": "2023",
    "plateNormalized": "AG658FK"
  },
  {
    "id": "VEH-0073",
    "plate": "AA 951 LE",
    "vin": "WBA7AEB04GJ548056",
    "brand": "BMW",
    "model": "Serie 3",
    "version": "320i Sport Line",
    "year": "2016",
    "plateNormalized": "AA951LE"
  },
  {
    "id": "VEH-0074",
    "plate": "AD 267 VP",
    "vin": "WBAFL66NXKJ663030",
    "brand": "BMW",
    "model": "Serie 3",
    "version": "330i M Sport",
    "year": "2019",
    "plateNormalized": "AD267VP"
  },
  {
    "id": "VEH-0075",
    "plate": "AF 142 UP",
    "vin": "WBA3EX978NA339899",
    "brand": "BMW",
    "model": "Serie 3",
    "version": "320i Sport Line",
    "year": "2022",
    "plateNormalized": "AF142UP"
  },
  {
    "id": "VEH-0076",
    "plate": "AB 705 KV",
    "vin": "WBADEB7V8HJ334831",
    "brand": "BMW",
    "model": "X1",
    "version": "sDrive20i",
    "year": "2017",
    "plateNormalized": "AB705KV"
  },
  {
    "id": "VEH-0077",
    "plate": "AE 658 DL",
    "vin": "WBAMHS0Z3LH991010",
    "brand": "BMW",
    "model": "X1",
    "version": "xDrive25i",
    "year": "2020",
    "plateNormalized": "AE658DL"
  },
  {
    "id": "VEH-0078",
    "plate": "AG 596 UX",
    "vin": "WBACNJ6R7PJ900325",
    "brand": "BMW",
    "model": "X1",
    "version": "sDrive20i",
    "year": "2023",
    "plateNormalized": "AG596UX"
  },
  {
    "id": "VEH-0079",
    "plate": "OLX 055",
    "vin": "WAUB9LS68FF023479",
    "brand": "Audi",
    "model": "A3",
    "version": "Sportback 1.4 TFSI",
    "year": "2015",
    "plateNormalized": "OLX055"
  },
  {
    "id": "VEH-0080",
    "plate": "AC 588 WM",
    "vin": "WAUWYB509JC705190",
    "brand": "Audi",
    "model": "A3",
    "version": "Sedán 2.0 TFSI",
    "year": "2018",
    "plateNormalized": "AC588WM"
  },
  {
    "id": "VEH-0081",
    "plate": "AF 230 FN",
    "vin": "WAUS05TY7MH106652",
    "brand": "Audi",
    "model": "A3",
    "version": "Sportback 1.4 TFSI",
    "year": "2021",
    "plateNormalized": "AF230FN"
  },
  {
    "id": "VEH-0082",
    "plate": "AD 516 SE",
    "vin": "LVVZSZPF9KG597567",
    "brand": "Chery",
    "model": "Tiggo 4",
    "version": "Comfort 1.5 MT",
    "year": "2019",
    "plateNormalized": "AD516SE"
  },
  {
    "id": "VEH-0083",
    "plate": "AF 524 TY",
    "vin": "LVVJ18GF0NC490302",
    "brand": "Chery",
    "model": "Tiggo 4",
    "version": "Luxury 1.5 CVT",
    "year": "2022",
    "plateNormalized": "AF524TY"
  },
  {
    "id": "VEH-0084",
    "plate": "AH 762 HD",
    "vin": "LVVPJPAS0RA797545",
    "brand": "Chery",
    "model": "Tiggo 4",
    "version": "Comfort 1.5 MT",
    "year": "2024",
    "plateNormalized": "AH762HD"
  },
  {
    "id": "VEH-0085",
    "plate": "AF 567 VG",
    "vin": "LGW25W943ND107201",
    "brand": "Haval",
    "model": "Jolion",
    "version": "Deluxe 1.5T DCT",
    "year": "2022",
    "plateNormalized": "AF567VG"
  },
  {
    "id": "VEH-0086",
    "plate": "AH 398 AE",
    "vin": "LGWL3XLG4RH151631",
    "brand": "Haval",
    "model": "Jolion",
    "version": "Supreme HEV",
    "year": "2024",
    "plateNormalized": "AH398AE"
  },
  {
    "id": "VEH-0087",
    "plate": "AH 414 NK",
    "vin": "LGWBV7SS0SG060797",
    "brand": "Haval",
    "model": "Jolion",
    "version": "Deluxe 1.5T DCT",
    "year": "2025",
    "plateNormalized": "AH414NK"
  },
  {
    "id": "VEH-0088",
    "plate": "AH 609 GL",
    "vin": "LGXWJRY24SF383171",
    "brand": "BYD",
    "model": "Dolphin Mini",
    "version": "GL",
    "year": "2025",
    "plateNormalized": "AH609GL"
  },
  {
    "id": "VEH-0089",
    "plate": "AH 689 RA",
    "vin": "LGXRHNZD1SF091768",
    "brand": "BYD",
    "model": "Dolphin Mini",
    "version": "GS",
    "year": "2025",
    "plateNormalized": "AH689RA"
  },
  {
    "id": "VEH-0090",
    "plate": "AI 676 ST",
    "vin": "LGXVM0AF6TC570149",
    "brand": "BYD",
    "model": "Dolphin Mini",
    "version": "GL",
    "year": "2026",
    "plateNormalized": "AI676ST"
  },
  {
    "id": "VEH-0091",
    "plate": "AH 068 DP",
    "vin": "LGX19N5H9SE948878",
    "brand": "BYD",
    "model": "Song Pro",
    "version": "DM-i GL",
    "year": "2025",
    "plateNormalized": "AH068DP"
  },
  {
    "id": "VEH-0092",
    "plate": "AH 393 CU",
    "vin": "LGXN9XRV3SE016379",
    "brand": "BYD",
    "model": "Song Pro",
    "version": "DM-i GS",
    "year": "2025",
    "plateNormalized": "AH393CU"
  },
  {
    "id": "VEH-0093",
    "plate": "AI 183 UR",
    "vin": "LGXECRV10TJ706888",
    "brand": "BYD",
    "model": "Song Pro",
    "version": "DM-i GL",
    "year": "2026",
    "plateNormalized": "AI183UR"
  },
  {
    "id": "VEH-0094",
    "plate": "AC 075 KC",
    "vin": "MA3YF0UN5JA386205",
    "brand": "Suzuki",
    "model": "Swift",
    "version": "GL 1.2 MT",
    "year": "2018",
    "plateNormalized": "AC075KC"
  },
  {
    "id": "VEH-0095",
    "plate": "AF 627 DZ",
    "vin": "MA3WUTZDXME287195",
    "brand": "Suzuki",
    "model": "Swift",
    "version": "GLX 1.2 CVT",
    "year": "2021",
    "plateNormalized": "AF627DZ"
  },
  {
    "id": "VEH-0096",
    "plate": "AH 137 FK",
    "vin": "MA3SK3MV4RD670275",
    "brand": "Suzuki",
    "model": "Swift",
    "version": "GL 1.2 MT",
    "year": "2024",
    "plateNormalized": "AH137FK"
  },
  {
    "id": "VEH-0097",
    "plate": "AA 795 XX",
    "vin": "TSMGJRG04GC014063",
    "brand": "Suzuki",
    "model": "Vitara",
    "version": "GL 1.6 MT",
    "year": "2016",
    "plateNormalized": "AA795XX"
  },
  {
    "id": "VEH-0098",
    "plate": "AD 037 UD",
    "vin": "TSMAC58Y5KF557488",
    "brand": "Suzuki",
    "model": "Vitara",
    "version": "GLX 1.4T AT",
    "year": "2019",
    "plateNormalized": "AD037UD"
  },
  {
    "id": "VEH-0099",
    "plate": "AF 474 SB",
    "vin": "TSMETGWA9NJ877384",
    "brand": "Suzuki",
    "model": "Vitara",
    "version": "GL 1.6 MT",
    "year": "2022",
    "plateNormalized": "AF474SB"
  },
  {
    "id": "VEH-0100",
    "plate": "AB 209 MT",
    "vin": "MMB3C96Y6HC400607",
    "brand": "Mitsubishi",
    "model": "L200",
    "version": "GLX 2.4 4x2",
    "year": "2017",
    "plateNormalized": "AB209MT"
  },
  {
    "id": "VEH-0101",
    "plate": "AE 227 WR",
    "vin": "MMB6KM142LF180509",
    "brand": "Mitsubishi",
    "model": "L200",
    "version": "GLS 2.4 4x4 AT",
    "year": "2020",
    "plateNormalized": "AE227WR"
  },
  {
    "id": "VEH-0102",
    "plate": "AG 953 XK",
    "vin": "MMBG46DK9PE051599",
    "brand": "Mitsubishi",
    "model": "L200",
    "version": "GLX 2.4 4x2",
    "year": "2023",
    "plateNormalized": "AG953XK"
  },
  {
    "id": "VEH-0103",
    "plate": "AE 805 BG",
    "vin": "9BG6J1VV6LH142684",
    "brand": "Chevrolet",
    "model": "Tracker",
    "version": "LT 1.2T",
    "year": "2020",
    "plateNormalized": "AE805BG"
  },
  {
    "id": "VEH-0104",
    "plate": "AF 871 WH",
    "vin": "9BGHPV9S9ND203437",
    "brand": "Chevrolet",
    "model": "Tracker",
    "version": "Premier 1.2T AT",
    "year": "2022",
    "plateNormalized": "AF871WH"
  },
  {
    "id": "VEH-0105",
    "plate": "AH 465 EN",
    "vin": "9BGWEKD90RJ408037",
    "brand": "Chevrolet",
    "model": "Tracker",
    "version": "LT 1.2T",
    "year": "2024",
    "plateNormalized": "AH465EN"
  },
  {
    "id": "VEH-0106",
    "plate": "AA 347 XS",
    "vin": "8AGDKT490GA453632",
    "brand": "Chevrolet",
    "model": "Cruze",
    "version": "LT 1.4T",
    "year": "2016",
    "plateNormalized": "AA347XS"
  },
  {
    "id": "VEH-0107",
    "plate": "AC 672 JX",
    "vin": "8AGVNYML6JD186734",
    "brand": "Chevrolet",
    "model": "Cruze",
    "version": "LTZ 1.4T AT",
    "year": "2018",
    "plateNormalized": "AC672JX"
  },
  {
    "id": "VEH-0108",
    "plate": "AF 639 PN",
    "vin": "8AGFHUB86MJ683081",
    "brand": "Chevrolet",
    "model": "Cruze",
    "version": "LT 1.4T",
    "year": "2021",
    "plateNormalized": "AF639PN"
  },
  {
    "id": "VEH-0109",
    "plate": "AA 410 GH",
    "vin": "8A18Z4RG8GJ565857",
    "brand": "Renault",
    "model": "Duster",
    "version": "Zen 1.6",
    "year": "2016",
    "plateNormalized": "AA410GH"
  },
  {
    "id": "VEH-0110",
    "plate": "AD 337 GX",
    "vin": "8A10MEFA0KA251680",
    "brand": "Renault",
    "model": "Duster",
    "version": "Iconic 1.3T CVT",
    "year": "2019",
    "plateNormalized": "AD337GX"
  },
  {
    "id": "VEH-0111",
    "plate": "AF 072 KP",
    "vin": "8A1GW2TG4NB749914",
    "brand": "Renault",
    "model": "Duster",
    "version": "Zen 1.6",
    "year": "2022",
    "plateNormalized": "AF072KP"
  },
  {
    "id": "VEH-0112",
    "plate": "AC 163 XB",
    "vin": "8A1H0FN2XJG657203",
    "brand": "Renault",
    "model": "Kangoo",
    "version": "Furgón 1.6",
    "year": "2018",
    "plateNormalized": "AC163XB"
  },
  {
    "id": "VEH-0113",
    "plate": "AE 808 JE",
    "vin": "8A12AF3C4LG017084",
    "brand": "Renault",
    "model": "Kangoo",
    "version": "Stepway 1.6",
    "year": "2020",
    "plateNormalized": "AE808JE"
  },
  {
    "id": "VEH-0114",
    "plate": "AG 643 UP",
    "vin": "8A1KU9DN0PH712025",
    "brand": "Renault",
    "model": "Kangoo",
    "version": "Furgón 1.6",
    "year": "2023",
    "plateNormalized": "AG643UP"
  },
  {
    "id": "VEH-0115",
    "plate": "AB 218 HG",
    "vin": "8ADUPWUY1HJ821888",
    "brand": "Peugeot",
    "model": "2008",
    "version": "Allure 1.6",
    "year": "2017",
    "plateNormalized": "AB218HG"
  },
  {
    "id": "VEH-0116",
    "plate": "AE 613 SY",
    "vin": "8ADXD6A69LE670356",
    "brand": "Peugeot",
    "model": "2008",
    "version": "GT 1.6T AT",
    "year": "2020",
    "plateNormalized": "AE613SY"
  },
  {
    "id": "VEH-0117",
    "plate": "AG 932 TT",
    "vin": "8ADRWA4DXPF826310",
    "brand": "Peugeot",
    "model": "2008",
    "version": "Allure 1.6",
    "year": "2023",
    "plateNormalized": "AG932TT"
  },
  {
    "id": "VEH-0118",
    "plate": "AB 073 WV",
    "vin": "9885N12R3HB299393",
    "brand": "Fiat",
    "model": "Toro",
    "version": "Freedom 1.8 AT",
    "year": "2017",
    "plateNormalized": "AB073WV"
  },
  {
    "id": "VEH-0119",
    "plate": "AE 353 JJ",
    "vin": "988CUZC35LF742423",
    "brand": "Fiat",
    "model": "Toro",
    "version": "Volcano 2.0 TD 4x4",
    "year": "2020",
    "plateNormalized": "AE353JJ"
  },
  {
    "id": "VEH-0120",
    "plate": "AG 763 NC",
    "vin": "9889BSWHXPH547667",
    "brand": "Fiat",
    "model": "Toro",
    "version": "Freedom 1.8 AT",
    "year": "2023",
    "plateNormalized": "AG763NC"
  },
  {
    "id": "VEH-0121",
    "plate": "AF 506 TG",
    "vin": "9BDWDZFV7MC725605",
    "brand": "Fiat",
    "model": "Strada",
    "version": "Freedom 1.3 CD",
    "year": "2021",
    "plateNormalized": "AF506TG"
  },
  {
    "id": "VEH-0122",
    "plate": "AF 076 TR",
    "vin": "9BDX68904NC609594",
    "brand": "Fiat",
    "model": "Strada",
    "version": "Volcano 1.3 CVT",
    "year": "2022",
    "plateNormalized": "AF076TR"
  },
  {
    "id": "VEH-0123",
    "plate": "AH 181 UC",
    "vin": "9BDW70A21RF954559",
    "brand": "Fiat",
    "model": "Strada",
    "version": "Freedom 1.3 CD",
    "year": "2024",
    "plateNormalized": "AH181UC"
  },
  {
    "id": "VEH-0124",
    "plate": "AF 859 ES",
    "vin": "8AW849ZZ7MF865265",
    "brand": "Volkswagen",
    "model": "Taos",
    "version": "Comfortline 250 TSI",
    "year": "2021",
    "plateNormalized": "AF859ES"
  },
  {
    "id": "VEH-0125",
    "plate": "AF 122 UB",
    "vin": "8AWXHGPP9NJ500462",
    "brand": "Volkswagen",
    "model": "Taos",
    "version": "Highline 250 TSI",
    "year": "2022",
    "plateNormalized": "AF122UB"
  },
  {
    "id": "VEH-0126",
    "plate": "AH 922 JE",
    "vin": "8AWY8PCC6RA043557",
    "brand": "Volkswagen",
    "model": "Taos",
    "version": "Comfortline 250 TSI",
    "year": "2024",
    "plateNormalized": "AH922JE"
  },
  {
    "id": "VEH-0127",
    "plate": "NJY 546",
    "vin": "9BREP4ZS9EF032195",
    "brand": "Toyota",
    "model": "Etios",
    "version": "XLS 1.5",
    "year": "2014",
    "plateNormalized": "NJY546"
  },
  {
    "id": "VEH-0128",
    "plate": "AB 948 VE",
    "vin": "9BRJXGLE4HB683328",
    "brand": "Toyota",
    "model": "Etios",
    "version": "XLS 1.5 AT",
    "year": "2017",
    "plateNormalized": "AB948VE"
  },
  {
    "id": "VEH-0129",
    "plate": "AF 081 BR",
    "vin": "9BRCUBJS8MF578517",
    "brand": "Toyota",
    "model": "Etios",
    "version": "XLS 1.5",
    "year": "2021",
    "plateNormalized": "AF081BR"
  },
  {
    "id": "VEH-0130",
    "plate": "AB 138 WY",
    "vin": "8ANHHKJ16HE831304",
    "brand": "Nissan",
    "model": "Frontier",
    "version": "S 2.3 4x2",
    "year": "2017",
    "plateNormalized": "AB138WY"
  },
  {
    "id": "VEH-0131",
    "plate": "AE 187 AA",
    "vin": "8AN1AZDD5LC875593",
    "brand": "Nissan",
    "model": "Frontier",
    "version": "PRO-4X 2.3 4x4 AT",
    "year": "2020",
    "plateNormalized": "AE187AA"
  },
  {
    "id": "VEH-0132",
    "plate": "AG 714 FY",
    "vin": "8ANSED7W2PH494219",
    "brand": "Nissan",
    "model": "Frontier",
    "version": "S 2.3 4x2",
    "year": "2023",
    "plateNormalized": "AG714FY"
  },
  {
    "id": "VEH-0133",
    "plate": "AC 106 DJ",
    "vin": "9352ZK600JE628529",
    "brand": "Citroën",
    "model": "C4 Cactus",
    "version": "Feel 1.6",
    "year": "2018",
    "plateNormalized": "AC106DJ"
  },
  {
    "id": "VEH-0134",
    "plate": "AE 178 RH",
    "vin": "935WEDDMXLG632013",
    "brand": "Citroën",
    "model": "C4 Cactus",
    "version": "Shine 1.6 AT",
    "year": "2020",
    "plateNormalized": "AE178RH"
  },
  {
    "id": "VEH-0135",
    "plate": "AG 932 EB",
    "vin": "935E3FH4XPC573940",
    "brand": "Citroën",
    "model": "C4 Cactus",
    "version": "Feel 1.6",
    "year": "2023",
    "plateNormalized": "AG932EB"
  },
  {
    "id": "VEH-0136",
    "plate": "AF 894 ER",
    "vin": "LVSX360A1MC055260",
    "brand": "Ford",
    "model": "Territory",
    "version": "SEL 1.5T",
    "year": "2021",
    "plateNormalized": "AF894ER"
  },
  {
    "id": "VEH-0137",
    "plate": "AG 424 MF",
    "vin": "LVSVXUS92PD332158",
    "brand": "Ford",
    "model": "Territory",
    "version": "Titanium 1.5T",
    "year": "2023",
    "plateNormalized": "AG424MF"
  },
  {
    "id": "VEH-0138",
    "plate": "AH 197 EV",
    "vin": "LVSYSRCX7SD080129",
    "brand": "Ford",
    "model": "Territory",
    "version": "SEL 1.5T",
    "year": "2025",
    "plateNormalized": "AH197EV"
  },
  {
    "id": "VEH-0139",
    "plate": "AC 622 FH",
    "vin": "8AJLUMEF7JA080350",
    "brand": "Toyota",
    "model": "Hilux",
    "version": "SRV 2.8 4x4 AT",
    "year": "2018",
    "plateNormalized": "AC622FH"
  },
  {
    "id": "VEH-0140",
    "plate": "AF 278 JL",
    "vin": "8AJJX4UJ9NF692644",
    "brand": "Toyota",
    "model": "Hilux",
    "version": "DX 2.4 4x2",
    "year": "2022",
    "plateNormalized": "AF278JL"
  },
  {
    "id": "VEH-0141",
    "plate": "AB 784 VS",
    "vin": "93YMYPVH7HF901005",
    "brand": "Renault",
    "model": "Sandero",
    "version": "Stepway 1.6",
    "year": "2017",
    "plateNormalized": "AB784VS"
  },
  {
    "id": "VEH-0142",
    "plate": "AF 989 BK",
    "vin": "93YVBZ352MC565172",
    "brand": "Renault",
    "model": "Sandero",
    "version": "Life 1.6",
    "year": "2021",
    "plateNormalized": "AF989BK"
  },
  {
    "id": "VEH-0143",
    "plate": "AD 703 KG",
    "vin": "3N1HNC1G2KC843238",
    "brand": "Nissan",
    "model": "Versa",
    "version": "Sense 1.6",
    "year": "2019",
    "plateNormalized": "AD703KG"
  },
  {
    "id": "VEH-0144",
    "plate": "AG 174 AE",
    "vin": "3N1X28SK9PJ172769",
    "brand": "Nissan",
    "model": "Versa",
    "version": "Exclusive 1.6 CVT",
    "year": "2023",
    "plateNormalized": "AG174AE"
  },
  {
    "id": "VEH-0145",
    "plate": "AC 953 ZM",
    "vin": "8AWGHD7P4JE148621",
    "brand": "Volkswagen",
    "model": "Amarok",
    "version": "Highline 2.0 4x4",
    "year": "2018",
    "plateNormalized": "AC953ZM"
  },
  {
    "id": "VEH-0146",
    "plate": "AF 934 NZ",
    "vin": "8AWS92MR1NF439174",
    "brand": "Volkswagen",
    "model": "Amarok",
    "version": "Extreme V6 3.0",
    "year": "2022",
    "plateNormalized": "AF934NZ"
  },
  {
    "id": "VEH-0147",
    "plate": "AE 013 HL",
    "vin": "9BFF21RL4LE236882",
    "brand": "Ford",
    "model": "Ka",
    "version": "Freestyle 1.5",
    "year": "2020",
    "plateNormalized": "AE013HL"
  },
  {
    "id": "VEH-0148",
    "plate": "AF 080 XU",
    "vin": "8AD422ZS9MJ854868",
    "brand": "Peugeot",
    "model": "208",
    "version": "Feline 1.6 AT",
    "year": "2021",
    "plateNormalized": "AF080XU"
  },
  {
    "id": "VEH-0149",
    "plate": "AD 514 VV",
    "vin": "8APWTU705KF980599",
    "brand": "Fiat",
    "model": "Cronos",
    "version": "Precision 1.8 AT",
    "year": "2019",
    "plateNormalized": "AD514VV"
  },
  {
    "id": "VEH-0150",
    "plate": "AE 116 KT",
    "vin": "8AF8YM313LG312552",
    "brand": "Ford",
    "model": "Ranger",
    "version": "XLT 3.2 4x4 AT",
    "year": "2020",
    "plateNormalized": "AE116KT"
  }
]

export const OWNERSHIPS: DbOwnership[] = [
  {
    "id": "OWN-0001",
    "vehicleId": "toyota-corolla-2021",
    "ownerId": "USR-0001",
    "plate": "AA 000 AA",
    "vin": "8AJBA3HE7MA338209",
    "role": "titular",
    "since": "2026-03-10",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0002",
    "vehicleId": "volkswagen-gol-2019",
    "ownerId": "USR-0001",
    "plate": "AB 123 CD",
    "vin": "9BWAB45U7KA213502",
    "role": "titular",
    "since": "2026-03-05",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0003",
    "vehicleId": "toyota-yaris-2022",
    "ownerId": "USR-0001",
    "plate": "AF 782 KL",
    "vin": "8AJBA9F35NA068676",
    "role": "titular",
    "since": "2026-03-01",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0004",
    "vehicleId": "ford-focus-2018",
    "ownerId": "USR-0005",
    "plate": "AD 456 EF",
    "vin": "8AFAR23J5JA533055",
    "role": "titular",
    "since": "2026-04-02",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0005",
    "vehicleId": "ford-ranger-2020",
    "ownerId": "USR-0006",
    "plate": "AE 321 MN",
    "vin": "8AFAR22L1LA258130",
    "role": "titular",
    "since": "2026-05-18",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0006",
    "vehicleId": "renault-sandero-2021",
    "ownerId": "USR-0004",
    "plate": "AE 908 QR",
    "vin": "93Y5SRZH4MA447797",
    "role": "titular",
    "since": "2026-06-11",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0007",
    "vehicleId": "VEH-0007",
    "ownerId": "USR-0002",
    "plate": "MCU 227",
    "vin": "93HFB2501CA660426",
    "role": "titular",
    "since": "2026-07-20",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0008",
    "vehicleId": "VEH-0008",
    "ownerId": "USR-0003",
    "plate": "AC 686 TG",
    "vin": "8AP359102KA161193",
    "role": "titular",
    "since": "2026-04-25",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0009",
    "vehicleId": "VEH-0009",
    "ownerId": "USR-0004",
    "plate": "AD 051 BF",
    "vin": "8AJHA8CD7LA119402",
    "role": "usuario habitual",
    "since": "2026-06-11",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0010",
    "vehicleId": "VEH-0010",
    "ownerId": "USR-0006",
    "plate": "AE 760 JR",
    "vin": "8ADUCNFPXMA426774",
    "role": "titular",
    "since": "2026-05-18",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0011",
    "vehicleId": "VEH-0011",
    "ownerId": "USR-0007",
    "plate": "AB 281 GY",
    "vin": "9BGKS48U7JA466250",
    "role": "titular",
    "since": "2026-03-15",
    "until": "2026-08-30",
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0012",
    "vehicleId": "VEH-0012",
    "ownerId": "USR-0005",
    "plate": "AF 940 ZC",
    "vin": "3N1CN7AD1NA334667",
    "role": "titular",
    "since": "2026-04-02",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0013",
    "vehicleId": "VEH-0013",
    "ownerId": "USR-0002",
    "plate": "LGC 731",
    "vin": "8BCLNFUC8AA608813",
    "role": "usuario habitual",
    "since": "2026-07-20",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0014",
    "vehicleId": "VEH-0046",
    "ownerId": "USR-0009",
    "plate": "AB 091 EF",
    "vin": "988LNJDT7HJ775604",
    "role": "titular",
    "since": "2026-10-30",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0015",
    "vehicleId": "VEH-0088",
    "ownerId": "USR-0009",
    "plate": "AH 609 GL",
    "vin": "LGXWJRY24SF383171",
    "role": "titular",
    "since": "2026-10-30",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0016",
    "vehicleId": "VEH-0055",
    "ownerId": "USR-0009",
    "plate": "AC 855 YX",
    "vin": "9BHGHW2D3JF380196",
    "role": "titular",
    "since": "2026-10-30",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  },
  {
    "id": "OWN-0017",
    "vehicleId": "VEH-0101",
    "ownerId": "USR-0009",
    "plate": "AE 227 WR",
    "vin": "MMB6KM142LF180509",
    "role": "usuario habitual",
    "since": "2026-10-30",
    "until": null,
    "source": "Declarado por el usuario en AvisAR",
    "verified": false
  }
]

export const CAMPAIGNS: DbCampaign[] = [
  {
    "id": "RC-2026-0406",
    "campaign": "DEMO-SC-2026-FMANO-AMAR",
    "brand": "Volkswagen",
    "model": "Amarok",
    "yearFrom": 2021,
    "yearTo": 2023,
    "title": "Actualización del freno de estacionamiento electrónico",
    "component": "Módulo del freno de estacionamiento",
    "risk": "ALTO",
    "description": "El freno de estacionamiento podría no aplicarse por completo al apagar el motor.",
    "danger": "El vehículo podría desplazarse si queda estacionado en pendiente.",
    "action": "Mientras tanto, estacioná en lugares planos y con una marcha colocada. La actualización es gratuita.",
    "date": "18 de julio de 2026",
    "publishedAt": "2026-07-18",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2026-0729",
    "campaign": "DEMO-SC-2026-SUSP-L200",
    "brand": "Mitsubishi",
    "model": "L200",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Refuerzo del brazo de suspensión delantero",
    "component": "Brazo de control inferior",
    "risk": "CRÍTICO",
    "description": "El brazo de suspensión podría fisurarse por fatiga del material.",
    "danger": "Una rotura del brazo puede causar la pérdida de control del vehículo.",
    "action": "Si escuchás golpes en la suspensión, evitá circular a alta velocidad. El reemplazo es gratuito.",
    "date": "9 de julio de 2026",
    "publishedAt": "2026-07-09",
    "contact": "0800-000-0122"
  },
  {
    "id": "RC-2026-0360",
    "campaign": "DEMO-SC-2026-LIMP-VITA",
    "brand": "Suzuki",
    "model": "Vitara",
    "yearFrom": 2016,
    "yearTo": 2020,
    "title": "Reemplazo del motor del limpiaparabrisas",
    "component": "Motor del limpiaparabrisas",
    "risk": "MEDIO",
    "description": "El motor podría dejar de funcionar por ingreso de agua.",
    "danger": "Con lluvia, la visibilidad del conductor se reduce de forma significativa.",
    "action": "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora.",
    "date": "11 de mayo de 2026",
    "publishedAt": "2026-05-11",
    "contact": "0800-000-0121"
  },
  {
    "id": "RC-2026-0991",
    "campaign": "DEMO-SC-2026-ARNES-SPOR",
    "brand": "Kia",
    "model": "Sportage",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Protección del arnés eléctrico del motor",
    "component": "Arnés eléctrico del vano motor",
    "risk": "CRÍTICO",
    "description": "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
    "danger": "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
    "action": "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas.",
    "date": "4 de mayo de 2026",
    "publishedAt": "2026-05-04",
    "contact": "0800-000-0114"
  },
  {
    "id": "RC-2026-0363",
    "campaign": "DEMO-SC-2026-ARNES-CRET",
    "brand": "Hyundai",
    "model": "Creta",
    "yearFrom": 2017,
    "yearTo": 2020,
    "title": "Protección del arnés eléctrico del motor",
    "component": "Arnés eléctrico del vano motor",
    "risk": "CRÍTICO",
    "description": "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
    "danger": "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
    "action": "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas.",
    "date": "2 de mayo de 2026",
    "publishedAt": "2026-05-02",
    "contact": "0800-000-0113"
  },
  {
    "id": "RC-2026-0682",
    "campaign": "DEMO-SC-2026-FAROS-TIGG",
    "brand": "Chery",
    "model": "Tiggo 4",
    "yearFrom": 2022,
    "yearTo": 2024,
    "title": "Reemplazo del conector de los faros",
    "component": "Conector de los faros delanteros",
    "risk": "MEDIO",
    "description": "El conector podría sobrecalentarse y apagar las luces bajas.",
    "danger": "Conducir de noche sin luces bajas reduce la visibilidad y el riesgo de ser visto por otros.",
    "action": "Revisá las luces antes de salir de noche y pedí turno. El reemplazo es gratuito.",
    "date": "27 de marzo de 2026",
    "publishedAt": "2026-03-27",
    "contact": "0800-000-0118"
  },
  {
    "id": "RC-2026-0302",
    "campaign": "DEMO-SC-2026-LIMP-CRON",
    "brand": "Fiat",
    "model": "Cronos",
    "yearFrom": 2019,
    "yearTo": 2022,
    "title": "Reemplazo del motor del limpiaparabrisas",
    "component": "Motor del limpiaparabrisas",
    "risk": "MEDIO",
    "description": "El motor podría dejar de funcionar por ingreso de agua.",
    "danger": "Con lluvia, la visibilidad del conductor se reduce de forma significativa.",
    "action": "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora.",
    "date": "18 de febrero de 2026",
    "publishedAt": "2026-02-18",
    "contact": "0800-000-0104"
  },
  {
    "id": "RC-2026-0215",
    "campaign": "DEMO-SC-2026-INFL-C3",
    "brand": "Citroën",
    "model": "C3",
    "yearFrom": 2004,
    "yearTo": 2012,
    "title": "Reemplazo del inflador del airbag",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador puede romperse al activarse el airbag y proyectar fragmentos metálicos.",
    "danger": "Riesgo de lesiones graves para el conductor aun en choques leves.",
    "action": "No uses el vehículo hasta reemplazar el inflador. El cambio es gratuito en la red oficial.",
    "date": "15 de febrero de 2026",
    "publishedAt": "2026-02-15",
    "contact": "0800-000-0108"
  },
  {
    "id": "RC-2026-0102",
    "campaign": "DEMO-SC-2026-INFL-CIV",
    "brand": "Honda",
    "model": "Civic",
    "yearFrom": 2008,
    "yearTo": 2014,
    "title": "Reemplazo del inflador del airbag",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador puede romperse al activarse el airbag y proyectar fragmentos metálicos.",
    "danger": "Riesgo de lesiones graves para el conductor aun en choques leves.",
    "action": "No uses el vehículo hasta reemplazar el inflador. El cambio es gratuito en la red oficial.",
    "date": "10 de enero de 2026",
    "publishedAt": "2026-01-10",
    "contact": "0800-000-0107"
  },
  {
    "id": "RC-2025-0204",
    "campaign": "DEMO-SC-2025-DIREC-RANG",
    "brand": "Ford",
    "model": "Ranger",
    "yearFrom": 2020,
    "yearTo": 2022,
    "title": "Revisión de la caja de dirección",
    "component": "Cremallera de dirección",
    "risk": "ALTO",
    "description": "Un defecto en la fijación de la cremallera puede generar juego en la dirección.",
    "danger": "Podría disminuir el control del vehículo en curvas o maniobras bruscas.",
    "action": "Si notás juego o ruidos al girar, evitá usar el vehículo. La revisión y el reemplazo son gratuitos.",
    "date": "26 de diciembre de 2025",
    "publishedAt": "2025-12-26",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2025-0015",
    "campaign": "DEMO-SC-2025-FAROS-VERS",
    "brand": "Nissan",
    "model": "Versa",
    "yearFrom": 2022,
    "yearTo": 2024,
    "title": "Reemplazo del conector de los faros",
    "component": "Conector de los faros delanteros",
    "risk": "MEDIO",
    "description": "El conector podría sobrecalentarse y apagar las luces bajas.",
    "danger": "Conducir de noche sin luces bajas reduce la visibilidad y el riesgo de ser visto por otros.",
    "action": "Revisá las luces antes de salir de noche y pedí turno. El reemplazo es gratuito.",
    "date": "6 de octubre de 2025",
    "publishedAt": "2025-10-06",
    "contact": "0800-000-0110"
  },
  {
    "id": "RC-2025-0469",
    "campaign": "DEMO-SC-2025-CAMARA-TERR",
    "brand": "Ford",
    "model": "Territory",
    "yearFrom": 2021,
    "yearTo": 2024,
    "title": "Actualización de la cámara de retroceso",
    "component": "Software del sistema multimedia",
    "risk": "MEDIO",
    "description": "La imagen de la cámara de retroceso podría no aparecer al poner marcha atrás.",
    "danger": "Aumenta el riesgo de atropellar a peatones u objetos al retroceder.",
    "action": "Mientras tanto, usá los espejos y verificá el entorno al retroceder. La actualización es gratuita.",
    "date": "21 de septiembre de 2025",
    "publishedAt": "2025-09-21",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2025-0821",
    "campaign": "DEMO-SC-2025-INFL-A3",
    "brand": "Audi",
    "model": "A3",
    "yearFrom": 2015,
    "yearTo": 2019,
    "title": "Reemplazo del inflador del airbag del conductor",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador podría activarse con una presión mayor a la prevista.",
    "danger": "Ante un impacto, fragmentos metálicos podrían proyectarse hacia el habitáculo.",
    "action": "No uses el vehículo hasta reemplazar el inflador. La reparación es gratuita y demora alrededor de 1 hora.",
    "date": "12 de septiembre de 2025",
    "publishedAt": "2025-09-12",
    "contact": "0800-000-0117"
  },
  {
    "id": "RC-2025-0239",
    "campaign": "DEMO-SC-2025-BUTACA-TRAC",
    "brand": "Chevrolet",
    "model": "Tracker",
    "yearFrom": 2020,
    "yearTo": 2023,
    "title": "Refuerzo del riel de la butaca del conductor",
    "component": "Riel de regulación de la butaca",
    "risk": "ALTO",
    "description": "El seguro del riel podría no trabar la butaca en la posición elegida.",
    "danger": "La butaca podría desplazarse durante una frenada y afectar el control del vehículo.",
    "action": "Verificá que la butaca quede trabada antes de manejar y pedí turno. El refuerzo es gratuito.",
    "date": "5 de septiembre de 2025",
    "publishedAt": "2025-09-05",
    "contact": "0800-000-0106"
  },
  {
    "id": "RC-2025-0425",
    "campaign": "DEMO-SC-2025-PUERTA-KANG",
    "brand": "Renault",
    "model": "Kangoo",
    "yearFrom": 2018,
    "yearTo": 2022,
    "title": "Ajuste del cierre de la puerta corrediza",
    "component": "Cerradura de la puerta corrediza lateral",
    "risk": "ALTO",
    "description": "La puerta corrediza podría abrirse en marcha si no quedó bien trabada.",
    "danger": "Los pasajeros o la carga podrían caer del vehículo en movimiento.",
    "action": "Verificá que la puerta quede trabada antes de arrancar y pedí turno. El ajuste es gratuito.",
    "date": "16 de agosto de 2025",
    "publishedAt": "2025-08-16",
    "contact": "0800-000-0109"
  },
  {
    "id": "RC-2025-0166",
    "campaign": "DEMO-SC-2025-SENS-208",
    "brand": "Peugeot",
    "model": "208",
    "yearFrom": 2021,
    "yearTo": 2023,
    "title": "Actualización del sensor de ocupante",
    "component": "Sensor de ocupación del asiento del acompañante",
    "risk": "ALTO",
    "description": "El sensor podría desactivar el airbag del acompañante aunque haya un adulto sentado.",
    "danger": "El acompañante podría quedar sin protección del airbag en una colisión frontal.",
    "action": "Pedí turno en un concesionario oficial. La recalibración es gratuita y demora unos 40 minutos.",
    "date": "15 de agosto de 2025",
    "publishedAt": "2025-08-15",
    "contact": "0800-000-0105"
  },
  {
    "id": "RC-2025-0196",
    "campaign": "DEMO-SC-2025-FRENOS-HILU",
    "brand": "Toyota",
    "model": "Hilux",
    "yearFrom": 2020,
    "yearTo": 2023,
    "title": "Reemplazo de cañerías de freno traseras",
    "component": "Cañerías de freno traseras",
    "risk": "ALTO",
    "description": "Las cañerías podrían rozar contra la carrocería y desgastarse hasta producir una pérdida de líquido.",
    "danger": "Una pérdida de líquido reduce la capacidad de frenado del eje trasero.",
    "action": "Revisá que no haya manchas de líquido bajo el vehículo y pedí turno. El reemplazo es gratuito.",
    "date": "14 de julio de 2025",
    "publishedAt": "2025-07-14",
    "contact": "0800-000-0102"
  },
  {
    "id": "RC-2025-0973",
    "campaign": "DEMO-SC-2025-INFL-ETIO",
    "brand": "Toyota",
    "model": "Etios",
    "yearFrom": 2014,
    "yearTo": 2018,
    "title": "Reemplazo del inflador del airbag del conductor",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador podría activarse con una presión mayor a la prevista.",
    "danger": "Ante un impacto, fragmentos metálicos podrían proyectarse hacia el habitáculo.",
    "action": "No uses el vehículo hasta reemplazar el inflador. La reparación es gratuita y demora alrededor de 1 hora.",
    "date": "6 de julio de 2025",
    "publishedAt": "2025-07-06",
    "contact": "0800-000-0102"
  },
  {
    "id": "RC-2025-0605",
    "campaign": "DEMO-SC-2025-BUTACA-ONX",
    "brand": "Chevrolet",
    "model": "Onix",
    "yearFrom": 2017,
    "yearTo": 2019,
    "title": "Cambio del anclaje de las butacas delanteras",
    "component": "Riel de la butaca delantera",
    "risk": "ALTO",
    "description": "El riel de la butaca puede ceder ante un impacto fuerte.",
    "danger": "El conductor o el acompañante podrían desplazarse hacia adelante en un choque.",
    "action": "Pedí turno en la red oficial para cambiar el anclaje. No tiene costo.",
    "date": "5 de junio de 2025",
    "publishedAt": "2025-06-05",
    "contact": "0800-000-0106"
  },
  {
    "id": "RC-2025-0207",
    "campaign": "DEMO-SC-2025-COMB-GOL",
    "brand": "Volkswagen",
    "model": "Gol",
    "yearFrom": 2018,
    "yearTo": 2019,
    "title": "Reemplazo de la bomba de combustible",
    "component": "Bomba de combustible",
    "risk": "CRÍTICO",
    "description": "La bomba puede dejar de funcionar de forma repentina y detener el motor.",
    "danger": "El motor puede apagarse en marcha, con riesgo de choque en ruta o autopista.",
    "action": "Pedí turno en la red oficial lo antes posible. El reemplazo es gratuito y lleva unas 3 horas.",
    "date": "21 de mayo de 2025",
    "publishedAt": "2025-05-21",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2025-0135",
    "campaign": "DEMO-SC-2025-SENS-COMP",
    "brand": "Jeep",
    "model": "Compass",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Actualización del sensor de ocupante",
    "component": "Sensor de ocupación del asiento del acompañante",
    "risk": "ALTO",
    "description": "El sensor podría desactivar el airbag del acompañante aunque haya un adulto sentado.",
    "danger": "El acompañante podría quedar sin protección del airbag en una colisión frontal.",
    "action": "Pedí turno en un concesionario oficial. La recalibración es gratuita y demora unos 40 minutos.",
    "date": "17 de abril de 2025",
    "publishedAt": "2025-04-17",
    "contact": "0800-000-0111"
  },
  {
    "id": "RC-2025-0122",
    "campaign": "DEMO-SC-2025-BATAT-SONG",
    "brand": "BYD",
    "model": "Song Pro",
    "yearFrom": 2025,
    "yearTo": 2025,
    "title": "Inspección de la batería de alta tensión",
    "component": "Módulo de la batería de alta tensión",
    "risk": "CRÍTICO",
    "description": "Un sello del módulo podría permitir el ingreso de humedad en la batería.",
    "danger": "La humedad puede provocar una falla eléctrica que deje el vehículo sin tracción o genere sobrecalentamiento.",
    "action": "Evitá atravesar calles anegadas y pedí turno. La inspección y el sellado son gratuitos.",
    "date": "13 de abril de 2025",
    "publishedAt": "2025-04-13",
    "contact": "0800-000-0120"
  },
  {
    "id": "RC-2025-0412",
    "campaign": "DEMO-SC-2025-CINT-CRO",
    "brand": "Fiat",
    "model": "Cronos",
    "yearFrom": 2018,
    "yearTo": 2020,
    "title": "Refuerzo del anclaje del cinturón trasero",
    "component": "Anclaje del cinturón trasero central",
    "risk": "ALTO",
    "description": "El anclaje puede no soportar la carga prevista en un impacto.",
    "danger": "El pasajero trasero central podría quedar sin sujeción en un choque.",
    "action": "Pedí turno en la red oficial para reforzar el anclaje. Es gratuito.",
    "date": "12 de abril de 2025",
    "publishedAt": "2025-04-12",
    "contact": "0800-000-0104"
  },
  {
    "id": "RC-2025-0764",
    "campaign": "DEMO-SC-2025-SERVO-DUST",
    "brand": "Renault",
    "model": "Duster",
    "yearFrom": 2016,
    "yearTo": 2020,
    "title": "Revisión del servofreno",
    "component": "Servofreno de vacío",
    "risk": "ALTO",
    "description": "Una pérdida en la válvula del servofreno puede endurecer el pedal y reducir la asistencia de frenado.",
    "danger": "Aumenta la distancia de frenado y el riesgo de choque, sobre todo en frenadas de emergencia.",
    "action": "Reducí el uso del vehículo y pedí turno cuanto antes. El reemplazo es gratuito y demora unas 2 horas.",
    "date": "22 de marzo de 2025",
    "publishedAt": "2025-03-22",
    "contact": "0800-000-0109"
  },
  {
    "id": "RC-2025-0902",
    "campaign": "DEMO-SC-2025-FMANO-L200",
    "brand": "Mitsubishi",
    "model": "L200",
    "yearFrom": 2020,
    "yearTo": 2023,
    "title": "Actualización del freno de estacionamiento electrónico",
    "component": "Módulo del freno de estacionamiento",
    "risk": "ALTO",
    "description": "El freno de estacionamiento podría no aplicarse por completo al apagar el motor.",
    "danger": "El vehículo podría desplazarse si queda estacionado en pendiente.",
    "action": "Mientras tanto, estacioná en lugares planos y con una marcha colocada. La actualización es gratuita.",
    "date": "27 de febrero de 2025",
    "publishedAt": "2025-02-27",
    "contact": "0800-000-0122"
  },
  {
    "id": "RC-2025-0897",
    "campaign": "DEMO-SC-2025-INFL-1500",
    "brand": "RAM",
    "model": "1500",
    "yearFrom": 2019,
    "yearTo": 2022,
    "title": "Reemplazo del inflador del airbag del conductor",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador podría activarse con una presión mayor a la prevista.",
    "danger": "Ante un impacto, fragmentos metálicos podrían proyectarse hacia el habitáculo.",
    "action": "No uses el vehículo hasta reemplazar el inflador. La reparación es gratuita y demora alrededor de 1 hora.",
    "date": "8 de febrero de 2025",
    "publishedAt": "2025-02-08",
    "contact": "0800-000-0112"
  },
  {
    "id": "RC-2025-0118",
    "campaign": "DEMO-SC-2025-AIRBAG-YAR",
    "brand": "Toyota",
    "model": "Yaris",
    "yearFrom": 2020,
    "yearTo": 2023,
    "title": "Actualización del sistema de airbag",
    "component": "Módulo de control del airbag",
    "risk": "ALTO",
    "description": "El módulo podría demorar el despliegue de los airbags delanteros ante un impacto.",
    "danger": "La protección de los ocupantes podría reducirse durante una colisión frontal.",
    "action": "Solicitá un turno en la red oficial para actualizar el software del módulo. La intervención no tiene costo.",
    "date": "2 de febrero de 2025",
    "publishedAt": "2025-02-02",
    "contact": "0800-000-0102"
  },
  {
    "id": "RC-2024-0189",
    "campaign": "DEMO-SC-2024-FMANO-A3",
    "brand": "Audi",
    "model": "A3",
    "yearFrom": 2018,
    "yearTo": 2021,
    "title": "Actualización del freno de estacionamiento electrónico",
    "component": "Módulo del freno de estacionamiento",
    "risk": "MEDIO",
    "description": "El freno de estacionamiento podría no aplicarse por completo al apagar el motor.",
    "danger": "El vehículo podría desplazarse si queda estacionado en pendiente.",
    "action": "Mientras tanto, estacioná en lugares planos y con una marcha colocada. La actualización es gratuita.",
    "date": "2 de diciembre de 2024",
    "publishedAt": "2024-12-02",
    "contact": "0800-000-0117"
  },
  {
    "id": "RC-2024-0619",
    "campaign": "DEMO-SC-2024-BUTACA-KA",
    "brand": "Ford",
    "model": "Ka",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Refuerzo del riel de la butaca del conductor",
    "component": "Riel de regulación de la butaca",
    "risk": "ALTO",
    "description": "El seguro del riel podría no trabar la butaca en la posición elegida.",
    "danger": "La butaca podría desplazarse durante una frenada y afectar el control del vehículo.",
    "action": "Verificá que la butaca quede trabada antes de manejar y pedí turno. El refuerzo es gratuito.",
    "date": "23 de noviembre de 2024",
    "publishedAt": "2024-11-23",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2024-0572",
    "campaign": "DEMO-SC-2024-ARNES-SAND",
    "brand": "Renault",
    "model": "Sandero",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Protección del arnés eléctrico del motor",
    "component": "Arnés eléctrico del vano motor",
    "risk": "ALTO",
    "description": "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
    "danger": "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
    "action": "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas.",
    "date": "16 de noviembre de 2024",
    "publishedAt": "2024-11-16",
    "contact": "0800-000-0109"
  },
  {
    "id": "RC-2024-0937",
    "campaign": "DEMO-SC-2024-COMB-SWIF",
    "brand": "Suzuki",
    "model": "Swift",
    "yearFrom": 2018,
    "yearTo": 2022,
    "title": "Reemplazo de la bomba de combustible",
    "component": "Bomba de combustible",
    "risk": "CRÍTICO",
    "description": "La bomba podría dejar de funcionar y provocar que el motor se detenga en marcha.",
    "danger": "Una detención del motor en ruta o autopista aumenta el riesgo de choque.",
    "action": "Pedí turno cuanto antes. El reemplazo es gratuito y demora unas 3 horas.",
    "date": "13 de noviembre de 2024",
    "publishedAt": "2024-11-13",
    "contact": "0800-000-0121"
  },
  {
    "id": "RC-2024-0421",
    "campaign": "DEMO-SC-2024-FRENOS-SPRI",
    "brand": "Mercedes-Benz",
    "model": "Sprinter",
    "yearFrom": 2018,
    "yearTo": 2023,
    "title": "Reemplazo de cañerías de freno traseras",
    "component": "Cañerías de freno traseras",
    "risk": "CRÍTICO",
    "description": "Las cañerías podrían rozar contra la carrocería y desgastarse hasta producir una pérdida de líquido.",
    "danger": "Una pérdida de líquido reduce la capacidad de frenado del eje trasero.",
    "action": "Revisá que no haya manchas de líquido bajo el vehículo y pedí turno. El reemplazo es gratuito.",
    "date": "12 de octubre de 2024",
    "publishedAt": "2024-10-12",
    "contact": "0800-000-0115"
  },
  {
    "id": "RC-2024-0406",
    "campaign": "DEMO-SC-2024-RUEDA-1500",
    "brand": "RAM",
    "model": "1500",
    "yearFrom": 2021,
    "yearTo": 2024,
    "title": "Reemplazo de las tuercas de rueda",
    "component": "Tuercas de fijación de las ruedas",
    "risk": "ALTO",
    "description": "Las tuercas podrían aflojarse con el uso por un tratamiento térmico deficiente.",
    "danger": "Una rueda podría desprenderse con el vehículo en movimiento.",
    "action": "No circules en ruta hasta realizar el reemplazo. Es gratuito y demora menos de 1 hora.",
    "date": "4 de octubre de 2024",
    "publishedAt": "2024-10-04",
    "contact": "0800-000-0112"
  },
  {
    "id": "RC-2024-0674",
    "campaign": "DEMO-SC-2024-CARGA-DOLP",
    "brand": "BYD",
    "model": "Dolphin Mini",
    "yearFrom": 2025,
    "yearTo": 2026,
    "title": "Actualización del cargador a bordo",
    "component": "Cargador a bordo (OBC)",
    "risk": "ALTO",
    "description": "El cargador podría sobrecalentarse durante cargas prolongadas en tomacorrientes domiciliarios.",
    "danger": "El sobrecalentamiento puede dañar el cableado y generar riesgo de incendio durante la carga.",
    "action": "Cargá solo en cargadores de pared mientras tanto y pedí turno. La actualización es gratuita.",
    "date": "21 de septiembre de 2024",
    "publishedAt": "2024-09-21",
    "contact": "0800-000-0120"
  },
  {
    "id": "RC-2024-0027",
    "campaign": "DEMO-SC-2024-SUSP-TIGG",
    "brand": "Chery",
    "model": "Tiggo 4",
    "yearFrom": 2019,
    "yearTo": 2023,
    "title": "Refuerzo del brazo de suspensión delantero",
    "component": "Brazo de control inferior",
    "risk": "ALTO",
    "description": "El brazo de suspensión podría fisurarse por fatiga del material.",
    "danger": "Una rotura del brazo puede causar la pérdida de control del vehículo.",
    "action": "Si escuchás golpes en la suspensión, evitá circular a alta velocidad. El reemplazo es gratuito.",
    "date": "2 de septiembre de 2024",
    "publishedAt": "2024-09-02",
    "contact": "0800-000-0118"
  },
  {
    "id": "RC-2024-0533",
    "campaign": "DEMO-SC-2024-AIRBAG-GOL",
    "brand": "Volkswagen",
    "model": "Gol",
    "yearFrom": 2017,
    "yearTo": 2020,
    "title": "Control del airbag del acompañante",
    "component": "Sensor de ocupación del asiento",
    "risk": "ALTO",
    "description": "El sensor puede desactivar por error el airbag del acompañante.",
    "danger": "El acompañante podría quedar sin protección del airbag en un choque frontal.",
    "action": "Coordiná una revisión gratuita del sensor en un concesionario oficial.",
    "date": "9 de agosto de 2024",
    "publishedAt": "2024-08-09",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2024-0718",
    "campaign": "DEMO-SC-2024-DIREC-208",
    "brand": "Peugeot",
    "model": "208",
    "yearFrom": 2020,
    "yearTo": 2021,
    "title": "Revisión de la columna de dirección",
    "component": "Tornillo de la columna de dirección",
    "risk": "MEDIO",
    "description": "Un tornillo de la columna puede no tener el ajuste correcto.",
    "danger": "Con el tiempo podría aparecer juego en la dirección y afectar el control del auto.",
    "action": "Coordiná una revisión gratuita en un concesionario oficial.",
    "date": "30 de julio de 2024",
    "publishedAt": "2024-07-30",
    "contact": "0800-000-0105"
  },
  {
    "id": "RC-2024-0537",
    "campaign": "DEMO-SC-2024-DIREC-TORO",
    "brand": "Fiat",
    "model": "Toro",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Revisión de la caja de dirección",
    "component": "Cremallera de dirección",
    "risk": "CRÍTICO",
    "description": "Un defecto en la fijación de la cremallera puede generar juego en la dirección.",
    "danger": "Podría disminuir el control del vehículo en curvas o maniobras bruscas.",
    "action": "Si notás juego o ruidos al girar, evitá usar el vehículo. La revisión y el reemplazo son gratuitos.",
    "date": "16 de junio de 2024",
    "publishedAt": "2024-06-16",
    "contact": "0800-000-0104"
  },
  {
    "id": "RC-2024-0161",
    "campaign": "DEMO-SC-2024-DIREC-SELT",
    "brand": "Kia",
    "model": "Seltos",
    "yearFrom": 2021,
    "yearTo": 2024,
    "title": "Actualización de la dirección asistida",
    "component": "Módulo de la dirección eléctrica",
    "risk": "ALTO",
    "description": "La asistencia eléctrica podría desactivarse de forma repentina mientras se conduce.",
    "danger": "El volante se vuelve pesado de golpe, lo que dificulta maniobrar a baja velocidad.",
    "action": "Pedí turno en un concesionario oficial. La actualización de software es gratuita y demora 1 hora.",
    "date": "23 de mayo de 2024",
    "publishedAt": "2024-05-23",
    "contact": "0800-000-0114"
  },
  {
    "id": "RC-2024-0747",
    "campaign": "DEMO-SC-2024-INFL-HILU",
    "brand": "Toyota",
    "model": "Hilux",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Reemplazo del inflador del airbag del conductor",
    "component": "Inflador del airbag del conductor",
    "risk": "CRÍTICO",
    "description": "El inflador podría activarse con una presión mayor a la prevista.",
    "danger": "Ante un impacto, fragmentos metálicos podrían proyectarse hacia el habitáculo.",
    "action": "No uses el vehículo hasta reemplazar el inflador. La reparación es gratuita y demora alrededor de 1 hora.",
    "date": "1 de mayo de 2024",
    "publishedAt": "2024-05-01",
    "contact": "0800-000-0102"
  },
  {
    "id": "RC-2024-0123",
    "campaign": "DEMO-SC-2024-CAPOT-STRA",
    "brand": "Fiat",
    "model": "Strada",
    "yearFrom": 2021,
    "yearTo": 2023,
    "title": "Ajuste del cierre secundario del capot",
    "component": "Traba secundaria del capot",
    "risk": "MEDIO",
    "description": "La traba secundaria podría no retener el capot si la principal queda mal cerrada.",
    "danger": "El capot podría abrirse en marcha y tapar la visión del conductor.",
    "action": "Verificá que el capot quede bien cerrado y pedí turno. El ajuste es gratuito.",
    "date": "13 de abril de 2024",
    "publishedAt": "2024-04-13",
    "contact": "0800-000-0104"
  },
  {
    "id": "RC-2024-0632",
    "campaign": "DEMO-SC-2024-RUEDA-AMAR",
    "brand": "Volkswagen",
    "model": "Amarok",
    "yearFrom": 2017,
    "yearTo": 2020,
    "title": "Reemplazo de las tuercas de rueda",
    "component": "Tuercas de fijación de las ruedas",
    "risk": "CRÍTICO",
    "description": "Las tuercas podrían aflojarse con el uso por un tratamiento térmico deficiente.",
    "danger": "Una rueda podría desprenderse con el vehículo en movimiento.",
    "action": "No circules en ruta hasta realizar el reemplazo. Es gratuito y demora menos de 1 hora.",
    "date": "27 de marzo de 2024",
    "publishedAt": "2024-03-27",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2024-0342",
    "campaign": "DEMO-SC-2024-FRENOS-FOC",
    "brand": "Ford",
    "model": "Focus",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Revisión del sistema de frenos",
    "component": "Bomba hidráulica de frenos",
    "risk": "CRÍTICO",
    "description": "Una falla puede generar pérdida parcial de presión y aumentar la distancia de frenado.",
    "danger": "Existe riesgo de accidente por frenada insuficiente, especialmente a velocidades superiores a 60 km/h.",
    "action": "Evitá usar el vehículo hasta comunicarte con un concesionario oficial. El reemplazo es gratuito y demora aproximadamente 2 horas.",
    "date": "14 de marzo de 2024",
    "publishedAt": "2024-03-14",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2024-0517",
    "campaign": "DEMO-SC-2024-FRENOS-C4CA",
    "brand": "Citroën",
    "model": "C4 Cactus",
    "yearFrom": 2018,
    "yearTo": 2021,
    "title": "Reemplazo de cañerías de freno traseras",
    "component": "Cañerías de freno traseras",
    "risk": "ALTO",
    "description": "Las cañerías podrían rozar contra la carrocería y desgastarse hasta producir una pérdida de líquido.",
    "danger": "Una pérdida de líquido reduce la capacidad de frenado del eje trasero.",
    "action": "Revisá que no haya manchas de líquido bajo el vehículo y pedí turno. El reemplazo es gratuito.",
    "date": "2 de marzo de 2024",
    "publishedAt": "2024-03-02",
    "contact": "0800-000-0108"
  },
  {
    "id": "RC-2024-0643",
    "campaign": "DEMO-SC-2024-SENS-TAOS",
    "brand": "Volkswagen",
    "model": "Taos",
    "yearFrom": 2021,
    "yearTo": 2023,
    "title": "Actualización del sensor de ocupante",
    "component": "Sensor de ocupación del asiento del acompañante",
    "risk": "ALTO",
    "description": "El sensor podría desactivar el airbag del acompañante aunque haya un adulto sentado.",
    "danger": "El acompañante podría quedar sin protección del airbag en una colisión frontal.",
    "action": "Pedí turno en un concesionario oficial. La recalibración es gratuita y demora unos 40 minutos.",
    "date": "6 de febrero de 2024",
    "publishedAt": "2024-02-06",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2023-0103",
    "campaign": "DEMO-SC-2023-FAROS-SPOR",
    "brand": "Kia",
    "model": "Sportage",
    "yearFrom": 2020,
    "yearTo": 2023,
    "title": "Reemplazo del conector de los faros",
    "component": "Conector de los faros delanteros",
    "risk": "MEDIO",
    "description": "El conector podría sobrecalentarse y apagar las luces bajas.",
    "danger": "Conducir de noche sin luces bajas reduce la visibilidad y el riesgo de ser visto por otros.",
    "action": "Revisá las luces antes de salir de noche y pedí turno. El reemplazo es gratuito.",
    "date": "16 de diciembre de 2023",
    "publishedAt": "2023-12-16",
    "contact": "0800-000-0114"
  },
  {
    "id": "RC-2023-0945",
    "campaign": "DEMO-SC-2023-CAMARA-CLAS",
    "brand": "Mercedes-Benz",
    "model": "Clase A",
    "yearFrom": 2019,
    "yearTo": 2022,
    "title": "Actualización de la cámara de retroceso",
    "component": "Software del sistema multimedia",
    "risk": "MEDIO",
    "description": "La imagen de la cámara de retroceso podría no aparecer al poner marcha atrás.",
    "danger": "Aumenta el riesgo de atropellar a peatones u objetos al retroceder.",
    "action": "Mientras tanto, usá los espejos y verificá el entorno al retroceder. La actualización es gratuita.",
    "date": "16 de diciembre de 2023",
    "publishedAt": "2023-12-16",
    "contact": "0800-000-0115"
  },
  {
    "id": "RC-2023-0804",
    "campaign": "DEMO-SC-2023-CAPOT-RNG",
    "brand": "Ford",
    "model": "Ranger",
    "yearFrom": 2019,
    "yearTo": 2021,
    "title": "Inspección del cierre del capot",
    "component": "Traba secundaria del capot",
    "risk": "MEDIO",
    "description": "La traba secundaria puede presentar desgaste prematuro en algunas unidades.",
    "danger": "Si la traba principal no está asegurada, el capot podría abrirse durante la marcha.",
    "action": "Coordiná una inspección gratuita. Si se detecta desgaste, la pieza se reemplaza en el momento.",
    "date": "18 de noviembre de 2023",
    "publishedAt": "2023-11-18",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2023-0723",
    "campaign": "DEMO-SC-2023-COMB-RENE",
    "brand": "Jeep",
    "model": "Renegade",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Reemplazo de la cañería de combustible",
    "component": "Cañería de alimentación de combustible",
    "risk": "CRÍTICO",
    "description": "Una unión de la cañería podría aflojarse y producir una pérdida de combustible en el vano motor.",
    "danger": "Una pérdida de combustible cerca de fuentes de calor puede provocar un incendio.",
    "action": "Si sentís olor a combustible, no uses el vehículo y comunicate con la marca. El reemplazo es gratuito.",
    "date": "4 de noviembre de 2023",
    "publishedAt": "2023-11-04",
    "contact": "0800-000-0111"
  },
  {
    "id": "RC-2023-0982",
    "campaign": "DEMO-SC-2023-CAMARA-COMP",
    "brand": "Jeep",
    "model": "Compass",
    "yearFrom": 2022,
    "yearTo": 2024,
    "title": "Actualización de la cámara de retroceso",
    "component": "Software del sistema multimedia",
    "risk": "MEDIO",
    "description": "La imagen de la cámara de retroceso podría no aparecer al poner marcha atrás.",
    "danger": "Aumenta el riesgo de atropellar a peatones u objetos al retroceder.",
    "action": "Mientras tanto, usá los espejos y verificá el entorno al retroceder. La actualización es gratuita.",
    "date": "20 de octubre de 2023",
    "publishedAt": "2023-10-20",
    "contact": "0800-000-0111"
  },
  {
    "id": "RC-2023-0911",
    "campaign": "DEMO-SC-2023-CAPOT-GOL",
    "brand": "Volkswagen",
    "model": "Gol",
    "yearFrom": 2019,
    "yearTo": 2020,
    "title": "Ajuste del cierre del capot",
    "component": "Traba del capot",
    "risk": "MEDIO",
    "description": "La traba del capot puede no quedar bien calibrada de fábrica.",
    "danger": "El capot podría levantarse a alta velocidad si no está bien cerrado.",
    "action": "Coordiná un ajuste gratuito en la red oficial. Lleva menos de una hora.",
    "date": "3 de octubre de 2023",
    "publishedAt": "2023-10-03",
    "contact": "0800-000-0103"
  },
  {
    "id": "RC-2023-0992",
    "campaign": "DEMO-SC-2023-RUEDA-FRON",
    "brand": "Nissan",
    "model": "Frontier",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Reemplazo de las tuercas de rueda",
    "component": "Tuercas de fijación de las ruedas",
    "risk": "CRÍTICO",
    "description": "Las tuercas podrían aflojarse con el uso por un tratamiento térmico deficiente.",
    "danger": "Una rueda podría desprenderse con el vehículo en movimiento.",
    "action": "No circules en ruta hasta realizar el reemplazo. Es gratuito y demora menos de 1 hora.",
    "date": "3 de septiembre de 2023",
    "publishedAt": "2023-09-03",
    "contact": "0800-000-0110"
  },
  {
    "id": "RC-2023-0438",
    "campaign": "DEMO-SC-2023-CINT-VERS",
    "brand": "Nissan",
    "model": "Versa",
    "yearFrom": 2018,
    "yearTo": 2021,
    "title": "Reemplazo del pretensor del cinturón",
    "component": "Pretensor del cinturón delantero",
    "risk": "ALTO",
    "description": "El pretensor podría no activarse correctamente durante un impacto.",
    "danger": "El ocupante podría no quedar bien sujeto en una colisión.",
    "action": "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora.",
    "date": "13 de agosto de 2023",
    "publishedAt": "2023-08-13",
    "contact": "0800-000-0110"
  },
  {
    "id": "RC-2023-0978",
    "campaign": "DEMO-SC-2023-COMB-KA",
    "brand": "Ford",
    "model": "Ka",
    "yearFrom": 2019,
    "yearTo": 2021,
    "title": "Reemplazo de la bomba de combustible",
    "component": "Bomba de combustible",
    "risk": "CRÍTICO",
    "description": "La bomba podría dejar de funcionar y provocar que el motor se detenga en marcha.",
    "danger": "Una detención del motor en ruta o autopista aumenta el riesgo de choque.",
    "action": "Pedí turno cuanto antes. El reemplazo es gratuito y demora unas 3 horas.",
    "date": "1 de agosto de 2023",
    "publishedAt": "2023-08-01",
    "contact": "0800-000-0101"
  },
  {
    "id": "RC-2023-0671",
    "campaign": "DEMO-SC-2023-SERVO-TUCS",
    "brand": "Hyundai",
    "model": "Tucson",
    "yearFrom": 2016,
    "yearTo": 2020,
    "title": "Revisión del servofreno",
    "component": "Servofreno de vacío",
    "risk": "ALTO",
    "description": "Una pérdida en la válvula del servofreno puede endurecer el pedal y reducir la asistencia de frenado.",
    "danger": "Aumenta la distancia de frenado y el riesgo de choque, sobre todo en frenadas de emergencia.",
    "action": "Reducí el uso del vehículo y pedí turno cuanto antes. El reemplazo es gratuito y demora unas 2 horas.",
    "date": "22 de julio de 2023",
    "publishedAt": "2023-07-22",
    "contact": "0800-000-0113"
  },
  {
    "id": "RC-2023-0144",
    "campaign": "DEMO-SC-2023-CINT-CRET",
    "brand": "Hyundai",
    "model": "Creta",
    "yearFrom": 2021,
    "yearTo": 2024,
    "title": "Reemplazo del pretensor del cinturón",
    "component": "Pretensor del cinturón delantero",
    "risk": "ALTO",
    "description": "El pretensor podría no activarse correctamente durante un impacto.",
    "danger": "El ocupante podría no quedar bien sujeto en una colisión.",
    "action": "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora.",
    "date": "12 de julio de 2023",
    "publishedAt": "2023-07-12",
    "contact": "0800-000-0113"
  },
  {
    "id": "RC-2023-0009",
    "campaign": "DEMO-SC-2023-DIREC-JOLI",
    "brand": "Haval",
    "model": "Jolion",
    "yearFrom": 2022,
    "yearTo": 2024,
    "title": "Actualización de la dirección asistida",
    "component": "Módulo de la dirección eléctrica",
    "risk": "ALTO",
    "description": "La asistencia eléctrica podría desactivarse de forma repentina mientras se conduce.",
    "danger": "El volante se vuelve pesado de golpe, lo que dificulta maniobrar a baja velocidad.",
    "action": "Pedí turno en un concesionario oficial. La actualización de software es gratuita y demora 1 hora.",
    "date": "19 de junio de 2023",
    "publishedAt": "2023-06-19",
    "contact": "0800-000-0119"
  },
  {
    "id": "RC-2023-0966",
    "campaign": "DEMO-SC-2023-COMB-X1",
    "brand": "BMW",
    "model": "X1",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Reemplazo de la cañería de combustible",
    "component": "Cañería de alimentación de combustible",
    "risk": "CRÍTICO",
    "description": "Una unión de la cañería podría aflojarse y producir una pérdida de combustible en el vano motor.",
    "danger": "Una pérdida de combustible cerca de fuentes de calor puede provocar un incendio.",
    "action": "Si sentís olor a combustible, no uses el vehículo y comunicate con la marca. El reemplazo es gratuito.",
    "date": "15 de junio de 2023",
    "publishedAt": "2023-06-15",
    "contact": "0800-000-0116"
  },
  {
    "id": "RC-2023-0697",
    "campaign": "DEMO-SC-2023-SERVO-ONIX",
    "brand": "Chevrolet",
    "model": "Onix",
    "yearFrom": 2018,
    "yearTo": 2020,
    "title": "Revisión del servofreno",
    "component": "Servofreno de vacío",
    "risk": "CRÍTICO",
    "description": "Una pérdida en la válvula del servofreno puede endurecer el pedal y reducir la asistencia de frenado.",
    "danger": "Aumenta la distancia de frenado y el riesgo de choque, sobre todo en frenadas de emergencia.",
    "action": "Reducí el uso del vehículo y pedí turno cuanto antes. El reemplazo es gratuito y demora unas 2 horas.",
    "date": "11 de mayo de 2023",
    "publishedAt": "2023-05-11",
    "contact": "0800-000-0106"
  },
  {
    "id": "RC-2023-0890",
    "campaign": "DEMO-SC-2023-PUERTA-SPRI",
    "brand": "Mercedes-Benz",
    "model": "Sprinter",
    "yearFrom": 2015,
    "yearTo": 2019,
    "title": "Ajuste del cierre de la puerta corrediza",
    "component": "Cerradura de la puerta corrediza lateral",
    "risk": "ALTO",
    "description": "La puerta corrediza podría abrirse en marcha si no quedó bien trabada.",
    "danger": "Los pasajeros o la carga podrían caer del vehículo en movimiento.",
    "action": "Verificá que la puerta quede trabada antes de arrancar y pedí turno. El ajuste es gratuito.",
    "date": "25 de abril de 2023",
    "publishedAt": "2023-04-25",
    "contact": "0800-000-0115"
  },
  {
    "id": "RC-2023-0862",
    "campaign": "DEMO-SC-2023-DISTR-CRUZ",
    "brand": "Chevrolet",
    "model": "Cruze",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Reemplazo del tensor de la correa de distribución",
    "component": "Tensor de la correa de distribución",
    "risk": "CRÍTICO",
    "description": "El tensor podría fallar y hacer que la correa salte de posición.",
    "danger": "El motor podría detenerse de golpe mientras se conduce.",
    "action": "Pedí turno cuanto antes. El reemplazo es gratuito y demora unas 4 horas.",
    "date": "8 de abril de 2023",
    "publishedAt": "2023-04-08",
    "contact": "0800-000-0106"
  },
  {
    "id": "RC-2023-0939",
    "campaign": "DEMO-SC-2023-ARNES-SERI",
    "brand": "BMW",
    "model": "Serie 3",
    "yearFrom": 2016,
    "yearTo": 2019,
    "title": "Protección del arnés eléctrico del motor",
    "component": "Arnés eléctrico del vano motor",
    "risk": "CRÍTICO",
    "description": "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
    "danger": "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
    "action": "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas.",
    "date": "3 de abril de 2023",
    "publishedAt": "2023-04-03",
    "contact": "0800-000-0116"
  },
  {
    "id": "RC-2023-0960",
    "campaign": "DEMO-SC-2023-FMANO-RENE",
    "brand": "Jeep",
    "model": "Renegade",
    "yearFrom": 2019,
    "yearTo": 2022,
    "title": "Actualización del freno de estacionamiento electrónico",
    "component": "Módulo del freno de estacionamiento",
    "risk": "ALTO",
    "description": "El freno de estacionamiento podría no aplicarse por completo al apagar el motor.",
    "danger": "El vehículo podría desplazarse si queda estacionado en pendiente.",
    "action": "Mientras tanto, estacioná en lugares planos y con una marcha colocada. La actualización es gratuita.",
    "date": "21 de marzo de 2023",
    "publishedAt": "2023-03-21",
    "contact": "0800-000-0111"
  },
  {
    "id": "RC-2023-0427",
    "campaign": "DEMO-SC-2023-ARNES-2008",
    "brand": "Peugeot",
    "model": "2008",
    "yearFrom": 2017,
    "yearTo": 2021,
    "title": "Protección del arnés eléctrico del motor",
    "component": "Arnés eléctrico del vano motor",
    "risk": "CRÍTICO",
    "description": "El arnés podría rozar contra una pieza metálica y producir un cortocircuito.",
    "danger": "Un cortocircuito puede apagar el motor o provocar un principio de incendio.",
    "action": "Pedí turno en un concesionario oficial. La reparación es gratuita y demora unas 2 horas.",
    "date": "12 de marzo de 2023",
    "publishedAt": "2023-03-12",
    "contact": "0800-000-0105"
  },
  {
    "id": "RC-2023-0254",
    "campaign": "DEMO-SC-2023-CINT-SERI",
    "brand": "BMW",
    "model": "Serie 3",
    "yearFrom": 2019,
    "yearTo": 2022,
    "title": "Reemplazo del pretensor del cinturón",
    "component": "Pretensor del cinturón delantero",
    "risk": "ALTO",
    "description": "El pretensor podría no activarse correctamente durante un impacto.",
    "danger": "El ocupante podría no quedar bien sujeto en una colisión.",
    "action": "Pedí turno en un concesionario oficial. El reemplazo es gratuito y demora 1 hora.",
    "date": "22 de febrero de 2023",
    "publishedAt": "2023-02-22",
    "contact": "0800-000-0116"
  }
]

export const REPAIR_STATUS: DbRepairStatus[] = [
  {
    "vehicleId": "ford-focus-2018",
    "campaignId": "RC-2024-0342",
    "ownerId": "USR-0001",
    "status": "Reparación realizada",
    "updatedAt": "2026-03-01"
  },
  {
    "vehicleId": "ford-focus-2018",
    "campaignId": "RC-2024-0342",
    "ownerId": "USR-0005",
    "status": "Reparación realizada",
    "updatedAt": "2026-04-20"
  },
  {
    "vehicleId": "ford-ranger-2020",
    "campaignId": "RC-2023-0804",
    "ownerId": "USR-0006",
    "status": "Reparación programada",
    "updatedAt": "2026-10-02"
  },
  {
    "vehicleId": "VEH-0010",
    "campaignId": "RC-2024-0718",
    "ownerId": "USR-0006",
    "status": "Pendiente de revisión",
    "updatedAt": "2026-05-18"
  },
  {
    "vehicleId": "VEH-0008",
    "campaignId": "RC-2025-0412",
    "ownerId": "USR-0003",
    "status": "Pendiente de revisión",
    "updatedAt": "2026-04-25"
  },
  {
    "vehicleId": "volkswagen-gol-2019",
    "campaignId": "RC-2024-0533",
    "ownerId": "USR-0001",
    "status": "Reparación realizada",
    "updatedAt": "2026-09-12"
  },
  {
    "vehicleId": "volkswagen-gol-2019",
    "campaignId": "RC-2025-0207",
    "ownerId": "USR-0001",
    "status": "Reparación programada",
    "updatedAt": "2026-10-15"
  }
]

export const ALERTS: DbAlert[] = [
  {
    "id": "ALR-0001",
    "ownerId": "USR-0001",
    "vehicleId": "toyota-corolla-2021",
    "vehicle": "Toyota Corolla XEi 2.0 CVT 2021",
    "plate": "AA 000 AA",
    "channel": "WhatsApp",
    "destination": "+54 9 11 0000-0001",
    "active": true
  },
  {
    "id": "ALR-0002",
    "ownerId": "USR-0001",
    "vehicleId": "toyota-yaris-2022",
    "vehicle": "Toyota Yaris XLS 1.5 CVT 2022",
    "plate": "AF 782 KL",
    "channel": "E-mail",
    "destination": "usuario@avisar.com",
    "active": false
  },
  {
    "id": "ALR-0003",
    "ownerId": "USR-0004",
    "vehicleId": "renault-sandero-2021",
    "vehicle": "Renault Sandero Intens 1.6 CVT 2021",
    "plate": "AE 908 QR",
    "channel": "WhatsApp",
    "destination": "+54 9 2920 00-0004",
    "active": true
  },
  {
    "id": "ALR-0004",
    "ownerId": "USR-0004",
    "vehicleId": "VEH-0009",
    "vehicle": "Toyota Hilux SRV 2.8 4x4 2020",
    "plate": "AD 051 BF",
    "channel": "E-mail",
    "destination": "lucia@demo.avisar.com",
    "active": true
  },
  {
    "id": "ALR-0005",
    "ownerId": "USR-0003",
    "vehicleId": "VEH-0008",
    "vehicle": "Fiat Cronos Drive 1.3 2019",
    "plate": "AC 686 TG",
    "channel": "WhatsApp",
    "destination": "+54 9 299 000-0003",
    "active": true
  },
  {
    "id": "ALR-0006",
    "ownerId": "USR-0005",
    "vehicleId": "ford-focus-2018",
    "vehicle": "Ford Focus SE Plus 2.0 2018",
    "plate": "AD 456 EF",
    "channel": "E-mail",
    "destination": "jorge@demo.avisar.com",
    "active": false
  },
  {
    "id": "ALR-0007",
    "ownerId": "USR-0009",
    "vehicleId": "VEH-0046",
    "vehicle": "Jeep Renegade Sport 1.8 AT 2017",
    "plate": "AB 091 EF",
    "channel": "WhatsApp",
    "destination": "+54 9 11 0000-0009",
    "active": true
  },
  {
    "id": "ALR-0008",
    "ownerId": "USR-0009",
    "vehicleId": "VEH-0088",
    "vehicle": "BYD Dolphin Mini GL 2025",
    "plate": "AH 609 GL",
    "channel": "E-mail",
    "destination": "martina@demo.avisar.com",
    "active": true
  }
]

export const QUERY_HISTORY: DbQuery[] = [
  {
    "ownerId": "USR-0001",
    "vehicleId": "toyota-corolla-2021",
    "consultedAt": "10/03/2026"
  },
  {
    "ownerId": "USR-0001",
    "vehicleId": "ford-focus-2018",
    "consultedAt": "08/03/2026"
  },
  {
    "ownerId": "USR-0001",
    "vehicleId": "volkswagen-gol-2019",
    "consultedAt": "05/03/2026"
  },
  {
    "ownerId": "USR-0001",
    "vehicleId": "toyota-yaris-2022",
    "consultedAt": "01/03/2026"
  },
  {
    "ownerId": "USR-0001",
    "vehicleId": "ford-ranger-2020",
    "consultedAt": "26/02/2026"
  },
  {
    "ownerId": "USR-0001",
    "vehicleId": "renault-sandero-2021",
    "consultedAt": "20/02/2026"
  },
  {
    "ownerId": "USR-0002",
    "vehicleId": "VEH-0007",
    "consultedAt": "20/07/2026"
  },
  {
    "ownerId": "USR-0002",
    "vehicleId": "VEH-0013",
    "consultedAt": "20/07/2026"
  },
  {
    "ownerId": "USR-0003",
    "vehicleId": "VEH-0008",
    "consultedAt": "25/04/2026"
  },
  {
    "ownerId": "USR-0004",
    "vehicleId": "renault-sandero-2021",
    "consultedAt": "11/06/2026"
  },
  {
    "ownerId": "USR-0004",
    "vehicleId": "VEH-0009",
    "consultedAt": "11/06/2026"
  },
  {
    "ownerId": "USR-0005",
    "vehicleId": "ford-focus-2018",
    "consultedAt": "02/04/2026"
  },
  {
    "ownerId": "USR-0005",
    "vehicleId": "VEH-0012",
    "consultedAt": "02/04/2026"
  },
  {
    "ownerId": "USR-0006",
    "vehicleId": "ford-ranger-2020",
    "consultedAt": "18/05/2026"
  },
  {
    "ownerId": "USR-0006",
    "vehicleId": "VEH-0010",
    "consultedAt": "18/05/2026"
  },
  {
    "ownerId": "USR-0007",
    "vehicleId": "VEH-0011",
    "consultedAt": "15/03/2026"
  }
]

/* ---------- Tipos que usa la app (mismos campos que App.tsx) ---------- */

export interface AppRecall {
  id: string
  title: string
  component: string
  risk: Risk
  description: string
  danger: string
  action: string
  campaign: string
  date: string
  contact: string
}

export interface AppVehicle {
  id: string
  plate: string
  vin?: string
  brand: string
  model: string
  version: string
  year: string
  recalls: AppRecall[]
  consultedAt: string
}

export interface AppAlert {
  id: string
  vehicle: string
  plate: string
  channel: Channel
  destination: string
  active: boolean
}

export interface AppDealer {
  id: string
  name: string
  brand: string
  address: string
  neighborhood: string
  distanceKm: number
  days: string
  hours: string
  x: number
  y: number
  /** Coordenadas aproximadas de la dirección, para el mapa. */
  lat: number
  lng: number
}

export type AppointmentStatus =
  | "Programado"
  | "Cancelado"
  | "Realizado"
  | "No realizado"

export interface AppAppointment {
  id: string
  code: string
  userId: string
  plate: string
  vehicle: string
  recallId: string
  dealerId: string
  date: string
  time: string
  reminderChannel: Channel
  reminderDestination?: string
  reminderActive: boolean
  status: AppointmentStatus
}

export interface AppointmentDay {
  date: string
  slots: { time: string; occupied: boolean }[]
}

export const DEALERS: AppDealer[] = [
  {
    id: "toyota-sol",
    name: "Sol Automotores",
    brand: "Toyota",
    address: "Av. Santa Fe 4100",
    neighborhood: "Palermo",
    distanceKm: 1.2,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 30,
    y: 34,
    lat: -34.5862,
    lng: -58.4153,
  },
  {
    id: "toyota-ruta-norte",
    name: "Ruta Norte Motors",
    brand: "Toyota",
    address: "Av. Cabildo 2300",
    neighborhood: "Belgrano",
    distanceKm: 3.8,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 68,
    y: 20,
    lat: -34.5613,
    lng: -58.4563,
  },
  {
    id: "toyota-plaza",
    name: "Plaza Autos",
    brand: "Toyota",
    address: "Av. Rivadavia 6200",
    neighborhood: "Caballito",
    distanceKm: 5.1,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 57,
    y: 68,
    lat: -34.6278,
    lng: -58.4437,
  },
  {
    id: "ford-plaza",
    name: "Plaza Autos",
    brand: "Ford",
    address: "Av. Juan B. Justo 3650",
    neighborhood: "Villa Crespo",
    distanceKm: 1.6,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 37,
    y: 42,
    lat: -34.5958,
    lng: -58.443,
  },
  {
    id: "ford-del-parque",
    name: "Del Parque Ford",
    brand: "Ford",
    address: "Av. San Martín 2840",
    neighborhood: "Paternal",
    distanceKm: 3.3,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 23,
    y: 63,
    lat: -34.6047,
    lng: -58.4668,
  },
  {
    id: "ford-rio",
    name: "Río Motors",
    brand: "Ford",
    address: "Av. del Libertador 5050",
    neighborhood: "Núñez",
    distanceKm: 5.7,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 76,
    y: 27,
    lat: -34.568,
    lng: -58.4318,
  },
  {
    id: "vw-centro",
    name: "Centro Wagen",
    brand: "Volkswagen",
    address: "Av. Córdoba 4450",
    neighborhood: "Palermo",
    distanceKm: 1.4,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 43,
    y: 31,
    lat: -34.5948,
    lng: -58.4268,
  },
  {
    id: "vw-oeste",
    name: "Oeste Automotores",
    brand: "Volkswagen",
    address: "Av. Rivadavia 7350",
    neighborhood: "Flores",
    distanceKm: 4.2,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 20,
    y: 72,
    lat: -34.6297,
    lng: -58.4625,
  },
  {
    id: "vw-norte",
    name: "Norte Wagen",
    brand: "Volkswagen",
    address: "Av. Cabildo 3880",
    neighborhood: "Núñez",
    distanceKm: 6.3,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 79,
    y: 15,
    lat: -34.5467,
    lng: -58.4697,
  },
  {
    id: "audi-belgrano",
    name: "Faro Motors",
    brand: "Audi",
    address: "Av. Cabildo 1800",
    neighborhood: "Belgrano",
    distanceKm: 3.3,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 54,
    y: 35,
    lat: -34.5655,
    lng: -58.453,
  },
  {
    id: "audi-palermo",
    name: "Nova Center",
    brand: "Audi",
    address: "Av. Santa Fe 2900",
    neighborhood: "Palermo",
    distanceKm: 2.2,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 72,
    y: 42,
    lat: -34.589,
    lng: -58.406,
  },
  {
    id: "bmw-villa-crespo",
    name: "Cumbre Center",
    brand: "BMW",
    address: "Av. Corrientes 5200",
    neighborhood: "Villa Crespo",
    distanceKm: 1.4,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 60,
    y: 45,
    lat: -34.5985,
    lng: -58.4385,
  },
  {
    id: "bmw-caballito",
    name: "Nexo Group",
    brand: "BMW",
    address: "Av. Rivadavia 4800",
    neighborhood: "Caballito",
    distanceKm: 3.4,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 62,
    y: 51,
    lat: -34.6185,
    lng: -58.4325,
  },
  {
    id: "byd-belgrano",
    name: "Delta Group",
    brand: "BYD",
    address: "Av. del Libertador 6500",
    neighborhood: "Belgrano",
    distanceKm: 3.9,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 57,
    y: 32,
    lat: -34.556,
    lng: -58.447,
  },
  {
    id: "byd-villa-crespo",
    name: "Arena Motors",
    brand: "BYD",
    address: "Av. Warnes 1500",
    neighborhood: "Villa Crespo",
    distanceKm: 2.2,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 55,
    y: 44,
    lat: -34.595,
    lng: -58.452,
  },
  {
    id: "chery-vicente-l-pez",
    name: "Nova Motors",
    brand: "Chery",
    address: "Av. Maipú 1500",
    neighborhood: "Vicente López",
    distanceKm: 8.5,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 45,
    y: 22,
    lat: -34.5235,
    lng: -58.4795,
  },
  {
    id: "chery-avellaneda",
    name: "Faro Center",
    brand: "Chery",
    address: "Av. Mitre 600",
    neighborhood: "Avellaneda",
    distanceKm: 10.2,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 87,
    y: 65,
    lat: -34.6625,
    lng: -58.365,
  },
  {
    id: "chevrolet-ramos-mejia",
    name: "Nexo Center",
    brand: "Chevrolet",
    address: "Av. Rivadavia 15000",
    neighborhood: "Ramos Mejía",
    distanceKm: 13.8,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 13,
    y: 59,
    lat: -34.643,
    lng: -58.565,
  },
  {
    id: "chevrolet-martinez",
    name: "Cumbre Group",
    brand: "Chevrolet",
    address: "Av. del Libertador 13000",
    neighborhood: "Martínez",
    distanceKm: 12.6,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 36,
    y: 12,
    lat: -34.492,
    lng: -58.503,
  },
  {
    id: "citroen-san-crist-bal",
    name: "Arena Group",
    brand: "Citroën",
    address: "Av. San Juan 3000",
    neighborhood: "San Cristóbal",
    distanceKm: 4.6,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 72,
    y: 53,
    lat: -34.6235,
    lng: -58.405,
  },
  {
    id: "citroen-colegiales",
    name: "Delta Motors",
    brand: "Citroën",
    address: "Av. Álvarez Thomas 1500",
    neighborhood: "Colegiales",
    distanceKm: 2.8,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 53,
    y: 38,
    lat: -34.576,
    lng: -58.457,
  },
  {
    id: "fiat-chacarita",
    name: "Faro Motors",
    brand: "Fiat",
    address: "Av. Córdoba 6000",
    neighborhood: "Chacarita",
    distanceKm: 1.3,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 58,
    y: 41,
    lat: -34.585,
    lng: -58.444,
  },
  {
    id: "fiat-coghlan",
    name: "Nova Center",
    brand: "Fiat",
    address: "Av. Monroe 3000",
    neighborhood: "Coghlan",
    distanceKm: 4.5,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 49,
    y: 34,
    lat: -34.564,
    lng: -58.469,
  },
  {
    id: "haval-boedo",
    name: "Cumbre Center",
    brand: "Haval",
    address: "Av. La Plata 1500",
    neighborhood: "Boedo",
    distanceKm: 5.0,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 65,
    y: 56,
    lat: -34.633,
    lng: -58.425,
  },
  {
    id: "haval-floresta",
    name: "Nexo Group",
    brand: "Haval",
    address: "Av. Gaona 3500",
    neighborhood: "Floresta",
    distanceKm: 5.6,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 45,
    y: 51,
    lat: -34.619,
    lng: -58.478,
  },
  {
    id: "honda-villa-urquiza",
    name: "Delta Group",
    brand: "Honda",
    address: "Av. Triunvirato 4000",
    neighborhood: "Villa Urquiza",
    distanceKm: 5.4,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 42,
    y: 38,
    lat: -34.575,
    lng: -58.487,
  },
  {
    id: "honda-balvanera",
    name: "Arena Motors",
    brand: "Honda",
    address: "Av. Pueyrredón 1000",
    neighborhood: "Balvanera",
    distanceKm: 3.0,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 72,
    y: 47,
    lat: -34.605,
    lng: -58.405,
  },
  {
    id: "hyundai-banfield",
    name: "Nova Motors",
    brand: "Hyundai",
    address: "Av. Hipólito Yrigoyen 8000",
    neighborhood: "Banfield",
    distanceKm: 17.6,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 76,
    y: 90,
    lat: -34.744,
    lng: -58.395,
  },
  {
    id: "hyundai-balvanera",
    name: "Faro Center",
    brand: "Hyundai",
    address: "Av. Belgrano 2500",
    neighborhood: "Balvanera",
    distanceKm: 3.8,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 73,
    y: 50,
    lat: -34.6135,
    lng: -58.4025,
  },
  {
    id: "jeep-belgrano",
    name: "Nexo Center",
    brand: "Jeep",
    address: "Av. Cabildo 1800",
    neighborhood: "Belgrano",
    distanceKm: 3.3,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 54,
    y: 35,
    lat: -34.5655,
    lng: -58.453,
  },
  {
    id: "jeep-palermo",
    name: "Cumbre Group",
    brand: "Jeep",
    address: "Av. Santa Fe 2900",
    neighborhood: "Palermo",
    distanceKm: 2.2,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 72,
    y: 42,
    lat: -34.589,
    lng: -58.406,
  },
  {
    id: "kia-villa-crespo",
    name: "Arena Group",
    brand: "Kia",
    address: "Av. Corrientes 5200",
    neighborhood: "Villa Crespo",
    distanceKm: 1.4,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 60,
    y: 45,
    lat: -34.5985,
    lng: -58.4385,
  },
  {
    id: "kia-caballito",
    name: "Delta Motors",
    brand: "Kia",
    address: "Av. Rivadavia 4800",
    neighborhood: "Caballito",
    distanceKm: 3.4,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 62,
    y: 51,
    lat: -34.6185,
    lng: -58.4325,
  },
  {
    id: "mercedes-benz-belgrano",
    name: "Faro Motors",
    brand: "Mercedes-Benz",
    address: "Av. del Libertador 6500",
    neighborhood: "Belgrano",
    distanceKm: 3.9,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 57,
    y: 32,
    lat: -34.556,
    lng: -58.447,
  },
  {
    id: "mercedes-benz-villa-crespo",
    name: "Nova Center",
    brand: "Mercedes-Benz",
    address: "Av. Warnes 1500",
    neighborhood: "Villa Crespo",
    distanceKm: 2.2,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 55,
    y: 44,
    lat: -34.595,
    lng: -58.452,
  },
  {
    id: "mitsubishi-vicente-l-pez",
    name: "Cumbre Center",
    brand: "Mitsubishi",
    address: "Av. Maipú 1500",
    neighborhood: "Vicente López",
    distanceKm: 8.5,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 45,
    y: 22,
    lat: -34.5235,
    lng: -58.4795,
  },
  {
    id: "mitsubishi-avellaneda",
    name: "Nexo Group",
    brand: "Mitsubishi",
    address: "Av. Mitre 600",
    neighborhood: "Avellaneda",
    distanceKm: 10.2,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 87,
    y: 65,
    lat: -34.6625,
    lng: -58.365,
  },
  {
    id: "nissan-ramos-mejia",
    name: "Delta Group",
    brand: "Nissan",
    address: "Av. Rivadavia 15000",
    neighborhood: "Ramos Mejía",
    distanceKm: 13.8,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 13,
    y: 59,
    lat: -34.643,
    lng: -58.565,
  },
  {
    id: "nissan-martinez",
    name: "Arena Motors",
    brand: "Nissan",
    address: "Av. del Libertador 13000",
    neighborhood: "Martínez",
    distanceKm: 12.6,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 36,
    y: 12,
    lat: -34.492,
    lng: -58.503,
  },
  {
    id: "peugeot-san-crist-bal",
    name: "Nova Motors",
    brand: "Peugeot",
    address: "Av. San Juan 3000",
    neighborhood: "San Cristóbal",
    distanceKm: 4.6,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 72,
    y: 53,
    lat: -34.6235,
    lng: -58.405,
  },
  {
    id: "peugeot-colegiales",
    name: "Faro Center",
    brand: "Peugeot",
    address: "Av. Álvarez Thomas 1500",
    neighborhood: "Colegiales",
    distanceKm: 2.8,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 53,
    y: 38,
    lat: -34.576,
    lng: -58.457,
  },
  {
    id: "ram-chacarita",
    name: "Nexo Center",
    brand: "RAM",
    address: "Av. Córdoba 6000",
    neighborhood: "Chacarita",
    distanceKm: 1.3,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 58,
    y: 41,
    lat: -34.585,
    lng: -58.444,
  },
  {
    id: "ram-coghlan",
    name: "Cumbre Group",
    brand: "RAM",
    address: "Av. Monroe 3000",
    neighborhood: "Coghlan",
    distanceKm: 4.5,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 49,
    y: 34,
    lat: -34.564,
    lng: -58.469,
  },
  {
    id: "renault-boedo",
    name: "Arena Group",
    brand: "Renault",
    address: "Av. La Plata 1500",
    neighborhood: "Boedo",
    distanceKm: 5.0,
    days: "Lunes a viernes",
    hours: "8:00 a 17:00",
    x: 65,
    y: 56,
    lat: -34.633,
    lng: -58.425,
  },
  {
    id: "renault-floresta",
    name: "Delta Motors",
    brand: "Renault",
    address: "Av. Gaona 3500",
    neighborhood: "Floresta",
    distanceKm: 5.6,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 45,
    y: 51,
    lat: -34.619,
    lng: -58.478,
  },
  {
    id: "suzuki-villa-urquiza",
    name: "Faro Motors",
    brand: "Suzuki",
    address: "Av. Triunvirato 4000",
    neighborhood: "Villa Urquiza",
    distanceKm: 5.4,
    days: "Lunes a sábado",
    hours: "9:00 a 18:00",
    x: 42,
    y: 38,
    lat: -34.575,
    lng: -58.487,
  },
  {
    id: "suzuki-balvanera",
    name: "Nova Center",
    brand: "Suzuki",
    address: "Av. Pueyrredón 1000",
    neighborhood: "Balvanera",
    distanceKm: 3.0,
    days: "Lunes a viernes",
    hours: "8:30 a 17:30",
    x: 72,
    y: 47,
    lat: -34.605,
    lng: -58.405,
  },
]

/* ---------- Consultas ---------- */

const today = () => new Date().toLocaleDateString("es-AR")

export const normalizePlate = (plate: string) => plate.replace(/[\s-]/g, "").toUpperCase()

/** Patente argentina: formato Mercosur (AB123CD) o anterior (ABC123). */
export const isValidPlate = (plate: string) =>
  /^[A-Z]{2}\d{3}[A-Z]{2}$|^[A-Z]{3}\d{3}$/.test(normalizePlate(plate))

const VIN_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5,
  P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
}
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

/** 17 caracteres, sin I, O ni Q. Con checkDigit valida además el dígito verificador (posición 9). */
export const isValidVin = (vin: string, checkDigit = false) => {
  const v = vin.toUpperCase()
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false
  if (!checkDigit) return true
  const sum = [...v].reduce((acc, ch, i) => acc + (/\d/.test(ch) ? Number(ch) : VIN_VALUES[ch]) * VIN_WEIGHTS[i], 0)
  const r = sum % 11
  return v[8] === (r === 10 ? "X" : String(r))
}

/** Campañas vigentes que alcanzan a un vehículo según marca, modelo y año. */
export function campaignsFor(vehicle: Pick<DbVehicle, "brand" | "model" | "year">): DbCampaign[] {
  const year = Number(vehicle.year)
  return CAMPAIGNS.filter(
    (c) => c.brand === vehicle.brand && c.model === vehicle.model && year >= c.yearFrom && year <= c.yearTo,
  )
}

const toRecall = ({ brand, model, yearFrom, yearTo, publishedAt, ...rest }: DbCampaign): AppRecall => rest

/** Convierte un vehículo de la base al formato Vehicle de la app, con sus recalls calculados. */
export function toAppVehicle(v: DbVehicle, consultedAt = today()): AppVehicle {
  return {
    id: v.id,
    plate: v.plate,
    vin: v.vin,
    brand: v.brand,
    model: v.model,
    version: v.version,
    year: v.year,
    recalls: campaignsFor(v).map(toRecall),
    consultedAt,
  }
}

export type SearchInput =
  | { mode: "plate"; plate: string }
  | { mode: "vin"; vin: string }
  | { mode: "data"; brand: string; model: string; version: string; year: string }

/**
 * Busca un vehículo. Devuelve null si no existe: la app debe mostrar "No encontramos ese vehículo"
 * en lugar de un vehículo por defecto.
 * La búsqueda por marca/modelo/versión/año no necesita que la unidad exista en la base:
 * arma un vehículo genérico y le calcula las campañas por alcance.
 */
export function findVehicle(input: SearchInput): AppVehicle | null {
  if (input.mode === "plate") {
    const p = normalizePlate(input.plate)
    const v = VEHICLES.find((x) => x.plateNormalized === p)
    return v ? toAppVehicle(v) : null
  }
  if (input.mode === "vin") {
    const vin = input.vin.toUpperCase()
    const v = VEHICLES.find((x) => x.vin === vin)
    return v ? toAppVehicle(v) : null
  }
  const { brand, model, version, year } = input
  const exists = CATALOG.some((c) => c.brand === brand && c.model === model && c.versions.includes(version))
  if (!exists) return null
  return toAppVehicle({
    id: `${brand}-${model}-${year}`.toLowerCase().replace(/\s+/g, "-"),
    plate: "Sin patente",
    plateNormalized: "",
    vin: "",
    brand, model, version, year,
  })
}

/** Catálogo para los selectores de Marca → Modelo → Versión → Año (listas cerradas). */
export const CATALOG: { brand: string; model: string; versions: string[]; years: string[] }[] = (() => {
  const map = new Map<string, { brand: string; model: string; versions: Set<string>; years: Set<number> }>()
  for (const v of VEHICLES) {
    const k = `${v.brand}|${v.model}`
    if (!map.has(k)) map.set(k, { brand: v.brand, model: v.model, versions: new Set(), years: new Set() })
    const e = map.get(k)!
    e.versions.add(v.version)
    e.years.add(Number(v.year))
  }
  for (const c of CAMPAIGNS) {
    const e = map.get(`${c.brand}|${c.model}`)
    if (e) for (let y = c.yearFrom; y <= c.yearTo; y++) e.years.add(y)
  }
  return [...map.values()]
    .map((e) => ({
      brand: e.brand,
      model: e.model,
      versions: [...e.versions].sort(),
      years: [...e.years].sort((a, b) => b - a).map(String),
    }))
    .sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model))
})()

export const brands = () => [...new Set(CATALOG.map((c) => c.brand))]
export const modelsOf = (brand: string) => CATALOG.filter((c) => c.brand === brand).map((c) => c.model)
export const versionsOf = (brand: string, model: string) =>
  CATALOG.find((c) => c.brand === brand && c.model === model)?.versions ?? []
export const yearsOf = (brand: string, model: string) =>
  CATALOG.find((c) => c.brand === brand && c.model === model)?.years ?? []

/* ---------- Cuenta del usuario ---------- */

/** Login demo. Devuelve el usuario sin contraseña o null. */
export function authenticate(email: string, password: string) {
  const u = USERS.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
  if (!u) return null
  const { password: _omit, ...safe } = u
  return safe
}

/** Dueño actual declarado de un vehículo (titularidad abierta), o null si nadie lo registró. */
export function currentOwnerOf(vehicleId: string): string | null {
  return OWNERSHIPS.find((o) => o.vehicleId === vehicleId && o.until === null)?.ownerId ?? null
}

/** Vehículos con titularidad vigente del usuario ("Mis vehículos"). */
export function vehiclesOf(userId: string): AppVehicle[] {
  return OWNERSHIPS.filter((o) => o.ownerId === userId && o.until === null)
    .map((o) => VEHICLES.find((v) => v.id === o.vehicleId)!)
    .map((v) => toAppVehicle(v))
}

/** Vehículos que el usuario declaró y cuya titularidad ya cerró (por ejemplo, porque los vendió). */
export function formerVehiclesOf(userId: string): AppVehicle[] {
  return OWNERSHIPS.filter((o) => o.ownerId === userId && o.until !== null)
    .map((o) => toAppVehicle(VEHICLES.find((v) => v.id === o.vehicleId)!))
}

/**
 * Relación del usuario con un vehículo, para etiquetar "Mis consultas":
 * "vigente" = es suyo hoy · "cerrada" = fue suyo y ya no (devuelve la fecha) · null = solo lo consultó.
 */
export function ownershipOf(userId: string, vehicleId: string): { status: "vigente" | "cerrada"; until: string | null } | null {
  const mine = OWNERSHIPS.filter((o) => o.ownerId === userId && o.vehicleId === vehicleId)
  const open = mine.find((o) => o.until === null)
  if (open) return { status: "vigente", until: null }
  const closed = mine.sort((a, b) => (b.until ?? "").localeCompare(a.until ?? ""))[0]
  return closed ? { status: "cerrada", until: closed.until } : null
}

/** Historial inicial de "Mis consultas", del más reciente al más antiguo. */
export function queriesOf(userId: string): AppVehicle[] {
  const parse = (d: string) => { const [dd, mm, yy] = d.split("/"); return `${yy}${mm}${dd}` }
  return QUERY_HISTORY.filter((q) => q.ownerId === userId)
    .sort((a, b) => parse(b.consultedAt).localeCompare(parse(a.consultedAt)))
    .map((q) => toAppVehicle(VEHICLES.find((v) => v.id === q.vehicleId)!, q.consultedAt))
}

/** Alertas iniciales de "Mis alertas". */
export function alertsOf(userId: string): AppAlert[] {
  return ALERTS.filter((a) => a.ownerId === userId).map(({ ownerId, vehicleId, ...rest }) => rest)
}

/** Clave para guardar estados de reparación por vehículo y campaña (no solo por campaña). */
export const repairKey = (vehicleId: string, campaignId: string) => `${vehicleId}:${campaignId}`

/** Estados de reparación iniciales del usuario, indexados por repairKey. */
export function repairStatusOf(userId: string): Record<string, RepairStatus> {
  return Object.fromEntries(
    REPAIR_STATUS.filter((r) => r.ownerId === userId).map((r) => [repairKey(r.vehicleId, r.campaignId), r.status]),
  )
}

/** Vehículos usados como atajos de demo (escenarios A, B y C). */
export const DEMO_VEHICLES = {
  safe: () => toAppVehicle(VEHICLES.find((v) => v.id === "toyota-corolla-2021")!),
  critical: () => toAppVehicle(VEHICLES.find((v) => v.id === "ford-focus-2018")!),
  multiple: () => toAppVehicle(VEHICLES.find((v) => v.id === "volkswagen-gol-2019")!),
}

const localIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function dealersOf(brand: string): AppDealer[] {
  return DEALERS.filter((dealer) => dealer.brand === brand).sort(
    (a, b) => a.distanceKm - b.distanceKm,
  )
}

/** Agenda reproducible para los próximos 10 días hábiles. */
export function appointmentDays(dealerId: string): AppointmentDay[] {
  const days: AppointmentDay[] = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)
  const times = [
    "8:30",
    "9:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:30",
    "15:30",
  ]

  while (days.length < 10) {
    const weekday = cursor.getDay()
    if (weekday !== 0 && weekday !== 6) {
      const date = localIsoDate(cursor)
      const seed = [...`${dealerId}-${date}`].reduce(
        (sum, character) => sum + character.charCodeAt(0),
        0,
      )
      const noAvailability = days.length === 4
      days.push({
        date,
        slots: times.map((time, index) => ({
          time,
          occupied: noAvailability || (seed + index * 3) % 4 === 0,
        })),
      })
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

/** Turnos iniciales de la cuenta; los cambios posteriores viven en localStorage. */
export function appointmentsOf(userId: string): AppAppointment[] {
  if (userId !== "USR-0001") return []
  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - 45)
  return [
    {
      id: "APT-DEMO-0001",
      code: "TRN-1842",
      userId,
      plate: "AD 456 EF",
      vehicle: "Ford Focus SE Plus 2.0 2018",
      recallId: "RC-2024-0342",
      dealerId: "ford-plaza",
      date: localIsoDate(pastDate),
      time: "9:30",
      reminderChannel: "E-mail",
      reminderDestination: "usuario@avisar.com",
      reminderActive: false,
      status: "Realizado",
    },
  ]
}
