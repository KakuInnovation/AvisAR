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
  }
]

export const CAMPAIGNS: DbCampaign[] = [
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
