import { useEffect, useRef, useState } from "react"
import {
  CAMPAIGNS,
  CATALOG,
  DEMO_VEHICLES,
  DEALERS,
  alertsOf,
  appointmentDays,
  appointmentsOf,
  authenticate,
  brands,
  dealersOf,
  findVehicle,
  isValidPlate,
  isValidVin,
  modelsOf,
  queriesOf,
  repairKey,
  repairStatusOf,
  vehiclesOf,
  versionsOf,
  yearsOf,
  type AppAlert,
  type AppAppointment,
  type AppDealer,
  type AppRecall,
  type AppVehicle,
  type AppointmentStatus,
} from "./data/avisar-db"

type Screen = "home" | "login" | "scanner" | "results" | "detail" | "subscribe" | "queries" | "my-alerts" | "dealers" | "booking" | "booking-ok" | "my-appointments" | "education" | "pro"
type Risk = "CRÍTICO" | "ALTO" | "MEDIO"
type RepairStatus = "Pendiente de revisión" | "Reparación programada" | "Reparación realizada"
type Channel = "WhatsApp" | "E-mail"

interface User {
  id: string
  name: string
  email: string
}

const riskStyles: Record<Risk, string> = {
  CRÍTICO: "bg-risk-high text-white border-risk-high",
  ALTO: "bg-risk-mid text-ink border-ink",
  MEDIO: "bg-risk-mid-light text-risk-mid-text border-risk-mid-text",
}

const riskLabel: Record<Risk, string> = {
  CRÍTICO: "Riesgo crítico",
  ALTO: "Riesgo alto",
  MEDIO: "Riesgo medio",
}

type BodyType = "sedan" | "suv" | "pickup" | "hatch"

const BODY_LABEL: Record<BodyType, string> = {
  sedan: "Sedán",
  suv: "SUV",
  pickup: "Pick-up",
  hatch: "Hatchback",
}

const PICKUPS = ["Ranger", "Hilux", "Amarok", "Frontier", "S10", "Toro", "Strada", "Saveiro", "Oroch", "Maverick", "Alaskan"]
const SUVS = ["EcoSport", "Duster", "Tracker", "Renegade", "Compass", "HR-V", "Kicks", "Tucson", "Journey", "Sportage", "X1", "X3", "X55", "X55E", "X70", "Outlander", "H6", "Territory", "Tera", "Kardian", "2008", "3008", "Tiggo 4", "Tiggo 7", "BJ30E", "Bronco", "Atto", "Basalt", "WR-V", "ZS", "Jolion", "T1", "CS55", "GLC", "Taos", "T-Cross", "Nivus", "Pulse", "Fastback", "Creta", "C4 Cactus"]
const SEDANS = ["Corolla", "Civic", "Cronos", "Versa", "Classic", "Cruze", "Vento", "Logan", "Bora", "Siena", "Sentra", "HB20S", "C250", "Voyage", "Virtus", "K3", "Prisma", "Focus Sedán"]

function bodyTypeOf(model: string): BodyType {
  if (PICKUPS.includes(model)) return "pickup"
  if (SUVS.includes(model)) return "suv"
  if (SEDANS.includes(model)) return "sedan"
  return "hatch"
}

function CarSilhouette({
  type,
  className = "h-16 w-40",
  label,
}: {
  type: BodyType
  className?: string
  label?: string
}) {
  const body: Record<BodyType, { d: string; wheels: [number, number]; r: number; w: number }> = {
    sedan: { d: "M10 60V47q2-7 14-9l32-4 22-16q6-4 18-4h32q10 0 18 8l14 12 22 4q10 2 10 10v12z", wheels: [50, 152], r: 13, w: 200 },
    suv: { d: "M10 60V41q0-7 8-8l22-2 16-19q2-2 8-2h86q8 0 12 6l14 14 10 2q6 2 6 10v18z", wheels: [50, 154], r: 14, w: 200 },
    pickup: { d: "M8 60V41q0-7 8-8l28-2 14-17q2-2 8-2h38q6 0 8 6l2 16h78v26z", wheels: [48, 160], r: 14, w: 200 },
    hatch: { d: "M14 60V45q2-6 12-8l26-5 20-17q4-3 12-3h52q10 0 14 9l8 15q6 3 6 11v13z", wheels: [46, 134], r: 13, w: 180 },
  }
  const shape = body[type]
  return (
    <svg
      className={className}
      viewBox={`0 0 ${shape.w} 80`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path fill="currentColor" d={shape.d} />
      {shape.wheels.map((cx) => (
        <circle key={cx} cx={cx} cy="61" r={shape.r} fill="currentColor" stroke="#FFFFFF" strokeWidth="4" />
      ))}
    </svg>
  )
}

function PlateFrame({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-lg border-[3px] border-ink bg-white ${small ? "inline-block" : "block"}`}>
      <div
        className={`bg-plate text-center font-bold tracking-[0.22em] text-white ${small ? "px-3 py-0.5 text-[11px]" : "py-1 text-[13px]"}`}
        aria-hidden="true"
      >
        REPÚBLICA ARGENTINA
      </div>
      {children}
    </div>
  )
}

function Diamond({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-12 rotate-45 items-center justify-center border-[3px] border-ink bg-signal" aria-hidden="true">
      <span className="-rotate-45 font-display text-2xl font-extrabold">{children}</span>
    </span>
  )
}

function Hazard() {
  return <div className="hazard" aria-hidden="true" />
}

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStoredState(key, initial))
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

function readStoredState<T>(key: string, initial: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  } catch {
    return initial
  }
}

function Icon({
  name,
  className = "size-5",
}: {
  name: "search" | "camera" | "shield" | "alert" | "check" | "arrow" | "trash" | "bell" | "car" | "info" | "clock" | "mail" | "phone" | "user" | "logout" | "lock" | "close" | "calendar" | "location" | "message" | "wrench" | "share" | "download" | "copy" | "menu" | "building" | "upload"
  className?: string
}) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4 4" />
      </>
    ),
    camera: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <circle cx="12" cy="13" r="4" />
        <path d="M8 6 9.5 3.5h5L16 6" />
      </>
    ),
    shield: <path d="M12 3 5 6v5c0 4.7 2.9 8 7 10 4.1-2 7-5.3 7-10V6l-7-3Z" />,
    alert: (
      <>
        <path d="m12 3 10 18H2L12 3Z" />
        <path d="M12 9v5M12 17.5v.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="m9 5 7 7-7 7" />,
    trash: (
      <>
        <path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14M10 11v6M14 11v6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </>
    ),
    car: (
      <>
        <path d="m5 11 2-5h10l2 5M4 11h16v7H4zM7 18v2M17 18v2" />
        <path d="M7 14h.01M17 14h.01" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    phone: (
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-1-1.5 3a16 16 0 0 1-9.5-9.5L8 8 7 3Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    message: (
      <>
        <path d="M4 5h16v12H8l-4 4V5Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    wrench: (
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5l3 3 5.8-5.8a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z" />
    ),
    share: <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20Z" />,
    download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
    upload: <path d="M12 16V5M7 10l5-5 5 5M5 20h14" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    building: <path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M2 21h20" />,
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Badge({ risk }: { risk: Risk }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border-2 px-3 py-1 text-sm font-bold uppercase tracking-wide ${riskStyles[risk]}`}
    >
      <Icon name={risk === "CRÍTICO" ? "alert" : "wrench"} className="size-4" />
      {riskLabel[risk]}
    </span>
  )
}

function DemoNotice({
  text = "Las campañas de este prototipo no reemplazan la verificación oficial del fabricante.",
}: {
  text?: string
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-navy/10 bg-navy/5 px-4 py-3 text-sm text-navy">
      <Icon name="info" className="mt-0.5 size-4 shrink-0" />
      <p>
        <strong>Datos de demostración.</strong> {text}
      </p>
    </div>
  )
}

function formatAppointmentDate(date: string, short = false) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: short ? "numeric" : "long",
  }).format(new Date(`${date}T12:00:00`))
}

function appointmentIsPast(appointment: AppAppointment) {
  return new Date(`${appointment.date}T${appointment.time}:00`).getTime() < Date.now()
}

function dealerFor(id: string) {
  return DEALERS.find((dealer) => dealer.id === id)
}

function RepairProgress({ status }: { status: RepairStatus }) {
  const active =
    status === "Reparación realizada"
      ? 3
      : status === "Reparación programada"
        ? 2
        : 1
  return (
    <div className="mt-5 grid grid-cols-3 gap-1" aria-label={`Estado: ${status}`}>
      {["Pendiente", "Programada", "Realizada"].map((label, index) => (
        <div key={label} className="text-center">
          <span
            className={`mx-auto flex size-7 items-center justify-center rounded-full text-sm font-bold ${
              index + 1 <= active
                ? index === 2
                  ? "bg-green text-white"
                  : "bg-navy text-white"
                : "bg-bg text-muted"
            }`}
          >
            {index + 1 < active ? <Icon name="check" className="size-3.5" /> : index + 1}
          </span>
          <span className="mt-1 block text-xs font-bold text-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-display font-extrabold tracking-normal ${small ? "text-2xl" : "text-[32px]"}`}>
      AVIS<span className="ml-0.5 bg-signal px-1.5 text-ink">AR</span>
    </span>
  )
}

function NavBar({
  screen,
  onNav,
  user,
  onLogin,
  onLogout,
}: {
  screen: Screen
  onNav: (screen: Screen) => void
  user: User | null
  onLogin: () => void
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const isPro = screen === "pro"
  const items: [string, Screen][] = isPro
    ? [
        ["Consulta masiva", "pro"],
        ["Turnos", "my-appointments"],
        ["¿Qué es un recall?", "education"],
      ]
    : [
        ["Consultar", "home"],
        ["Mis consultas", "queries"],
        ["Mis alertas", "my-alerts"],
        ["Mis turnos", "my-appointments"],
        ["¿Qué es un recall?", "education"],
      ]
  const go = (target: Screen) => {
    setOpen(false)
    onNav(target)
  }
  const switchLink: [string, Screen] = isPro
    ? ["Soy particular", "home"]
    : ["Soy concesionario o taller", "pro"]
  const linkClass = (active: boolean) =>
    `min-h-11 cursor-pointer rounded px-3 py-2 text-base font-semibold transition ${
      active ? "bg-signal text-ink" : "text-white hover:bg-white/10"
    }`
  return (
    <header className="on-dark sticky top-0 z-50 bg-ink text-white print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go(isPro ? "pro" : "home")}
            className="cursor-pointer rounded"
            aria-label="AvisAR, ir al inicio"
          >
            <Logo />
          </button>
          {isPro && (
            <span className="rounded border-2 border-signal px-2 py-0.5 text-[13px] font-bold tracking-[0.12em] text-signal">
              PROFESIONAL
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="menu-principal"
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded border-2 border-white/60 px-3 font-semibold lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} className="size-5" />
          Menú
        </button>
        <nav
          id="menu-principal"
          aria-label="Principal"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:pb-0`}
        >
          {items.map(([label, target]) => (
            <button
              key={label}
              onClick={() => go(target)}
              aria-current={screen === target ? "page" : undefined}
              className={`${linkClass(screen === target)} text-left`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => go(switchLink[1])}
            className="min-h-11 cursor-pointer rounded px-3 py-2 text-left text-base font-semibold text-signal underline underline-offset-4 hover:bg-white/10"
          >
            {switchLink[0]}
          </button>
          <span className="mx-2 hidden h-6 w-px bg-white/30 lg:block" aria-hidden="true" />
          {user ? (
            <div className="flex items-center gap-2 px-3 lg:px-0">
              <Icon name="user" className="size-5 text-signal" />
              <span className="max-w-32 truncate text-sm font-semibold">{user.name}</span>
              <button
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
                className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded px-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Icon name="logout" className="size-4" />
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpen(false)
                onLogin()
              }}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded border-2 border-signal px-4 text-base font-bold text-signal hover:bg-signal hover:text-ink"
            >
              <Icon name="user" className="size-4" />
              Ingresar
            </button>
          )}
        </nav>
      </div>
      <Hazard />
    </header>
  )
}

function HomeScreen({
  onSearch,
  onNav,
  isLoggedIn,
  vehicles,
}: {
  onSearch: (vehicle: AppVehicle) => void
  onNav: (screen: Screen) => void
  isLoggedIn: boolean
  vehicles: AppVehicle[]
}) {
  const [mode, setMode] = useState<"plate" | "vin" | "data">("plate")
  const [plate, setPlate] = useState("")
  const [vin, setVin] = useState("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [version, setVersion] = useState("")
  const [year, setYear] = useState("")
  const [error, setError] = useState("")
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const clear = () => {
    setPlate("")
    setVin("")
    setBrand("")
    setModel("")
    setVersion("")
    setYear("")
    setError("")
    setNotFound(false)
  }

  const valid =
    (mode === "plate" && isValidPlate(plate)) ||
    (mode === "vin" && isValidVin(vin)) ||
    (mode === "data" && Boolean(brand && model && version && year))

  const submit = (demo?: keyof typeof DEMO_VEHICLES) => {
    setError("")
    setNotFound(false)
    if (!demo && mode === "plate" && !isValidPlate(plate)) {
      setError(
        "La patente tiene 6 o 7 caracteres, por ejemplo AB 123 CD o ABC 123",
      )
      return
    }
    if (!demo && mode === "vin" && !isValidVin(vin)) {
      setError("El VIN debe tener exactamente 17 caracteres alfanuméricos.")
      return
    }
    if (!demo && !valid) {
      setError("Completá los datos requeridos para continuar.")
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      const vehicle = demo
        ? DEMO_VEHICLES[demo]()
        : mode === "plate"
          ? findVehicle({ mode: "plate", plate })
          : mode === "vin"
            ? findVehicle({ mode: "vin", vin })
            : findVehicle({ mode: "data", brand, model, version, year })

      setLoading(false)
      if (!vehicle) {
        setNotFound(true)
        return
      }
      onSearch(vehicle)
    }, 900)
  }

  const tabs: [typeof mode, string][] = [
    ["plate", "Patente"],
    ["vin", "VIN"],
    ["data", "Marca y modelo"],
  ]
  const selectTab = (value: typeof mode) => {
    setMode(value)
    setError("")
    setNotFound(false)
  }
  const onTabKey = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    const next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length
    selectTab(tabs[next][0])
    document.getElementById(`tab-${tabs[next][0]}`)?.focus()
  }
  const selectClass =
    "w-full rounded-lg bg-white px-3 py-3 text-base outline-none disabled:cursor-not-allowed disabled:bg-bg disabled:text-muted"

  return (
    <main>
      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded bg-ink px-3 py-2 text-sm font-bold uppercase tracking-[0.1em] text-signal">
              <Icon name="alert" className="size-4" />
              Antes de comprar un usado
            </p>
            <h1 className="font-display text-[56px] font-extrabold leading-[0.92] sm:text-7xl lg:text-[88px]">
              ¿Ese auto tiene un recall sin reparar?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Ingresá la patente y en segundos sabés si el fabricante llamó a
              revisión ese modelo, qué riesgo implica y cómo repararlo gratis.
              Te llevás un informe para compartir con el vendedor.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
            className="card-signal rounded-xl bg-surface p-5 sm:p-7"
            aria-labelledby="search-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="search-title" className="font-display text-3xl font-extrabold">
                Consultá un vehículo
              </h2>
              <button
                type="button"
                onClick={clear}
                className="min-h-11 cursor-pointer px-1 text-base font-semibold text-ink underline underline-offset-4"
              >
                Limpiar
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Tipo de búsqueda"
              className="mt-5 grid grid-cols-3 overflow-hidden rounded-md border-2 border-ink"
            >
              {tabs.map(([value, label], index) => (
                <button
                  key={value}
                  id={`tab-${value}`}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  aria-controls="search-panel"
                  tabIndex={mode === value ? 0 : -1}
                  onClick={() => selectTab(value)}
                  onKeyDown={(event) => onTabKey(event, index)}
                  className={`min-h-12 cursor-pointer px-2 text-base font-bold leading-tight ${
                    index > 0 ? "border-l-2 border-ink" : ""
                  } ${mode === value ? "bg-ink text-white" : "bg-white text-ink hover:bg-bg"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div id="search-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="mt-5 min-h-36">
              {mode === "plate" && (
                <div>
                  <label htmlFor="plate-input" className="mb-2 block text-base font-bold">
                    Patente del vehículo
                  </label>
                  <PlateFrame>
                    <input
                      id="plate-input"
                      value={plate}
                      onChange={(event) =>
                        setPlate(
                          event.target.value
                            .replace(/[^a-zA-Z0-9 ]/g, "")
                            .toUpperCase()
                            .slice(0, 9),
                        )
                      }
                      placeholder="AB 123 CD"
                      autoComplete="off"
                      className="plate-input w-full border-0 bg-transparent px-2 py-3 text-center font-mono text-4xl font-bold uppercase tracking-[0.12em] outline-none sm:text-[44px]"
                      aria-describedby="plate-help"
                    />
                  </PlateFrame>
                  <p id="plate-help" className="mt-2 text-sm text-muted sm:text-base">
                    Formato Mercosur (AB 123 CD) o anterior (ABC 123).
                  </p>
                </div>
              )}
              {mode === "vin" && (
                <div>
                  <label htmlFor="vin-input" className="mb-2 block text-base font-bold">
                    Número VIN
                  </label>
                  <input
                    id="vin-input"
                    value={vin}
                    onChange={(event) =>
                      setVin(
                        event.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase()
                          .slice(0, 17),
                      )
                    }
                    placeholder="8AGF19U0BCR123456"
                    aria-describedby="vin-help vin-count"
                    className="w-full rounded-lg px-4 py-3 font-mono text-xl uppercase tracking-wider outline-none"
                  />
                  <div className="mt-2 flex justify-between gap-3 text-sm sm:text-base">
                    <span id="vin-help" className="text-muted">
                      Está en la cédula y junto al parabrisas.
                    </span>
                    <span id="vin-count" className={vin.length === 17 ? "font-bold text-ok" : "text-muted"}>
                      {vin.length}/17
                    </span>
                  </div>
                </div>
              )}
              {mode === "data" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-base font-bold">Marca</span>
                    <select
                      value={brand}
                      onChange={(event) => {
                        setBrand(event.target.value)
                        setModel("")
                        setVersion("")
                        setYear("")
                      }}
                      className={selectClass}
                    >
                      <option value="">Elegir</option>
                      {brands().map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-base font-bold">Modelo</span>
                    <select
                      value={model}
                      disabled={!brand}
                      onChange={(event) => {
                        setModel(event.target.value)
                        setVersion("")
                        setYear("")
                      }}
                      className={selectClass}
                    >
                      <option value="">Elegir</option>
                      {modelsOf(brand).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-base font-bold">Versión</span>
                    <select
                      value={version}
                      disabled={!model}
                      onChange={(event) => {
                        setVersion(event.target.value)
                        setYear("")
                      }}
                      className={selectClass}
                    >
                      <option value="">Elegir</option>
                      {versionsOf(brand, model).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-base font-bold">Año</span>
                    <select
                      value={year}
                      disabled={!version}
                      onChange={(event) => setYear(event.target.value)}
                      className={selectClass}
                    >
                      <option value="">Elegir</option>
                      {yearsOf(brand, model).map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mb-3 flex items-center gap-2 rounded-lg border-2 border-risk-high bg-risk-high-light px-3 py-2 text-base font-semibold text-risk-high"
              >
                <Icon name="alert" className="size-5 shrink-0" />
                {error}
              </div>
            )}
            {notFound && (
              <div
                role="status"
                className="mb-3 rounded-lg border-2 border-dashed border-graphite bg-white px-5 py-5 text-center"
              >
                <p className="text-base leading-relaxed text-muted">
                  No encontramos ese vehículo en la base de demostración. Probá
                  con AB 123 CD, AD 456 EF o AA 000 AA, o buscá por marca y
                  modelo.
                </p>
                <button
                  type="button"
                  onClick={() => selectTab("data")}
                  className="mt-4 min-h-11 cursor-pointer rounded-lg bg-ink px-5 text-base font-bold text-white"
                >
                  Buscar por marca y modelo
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-14 flex-[1_1_220px] cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal font-display text-[28px] font-extrabold text-ink disabled:cursor-wait disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-[3px] border-ink/30 border-t-ink" aria-hidden="true" />
                    Consultando…
                  </>
                ) : (
                  <>
                    <Icon name="search" className="size-6" />
                    Consultar
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onNav("scanner")}
                className="flex min-h-14 flex-[0_1_auto] cursor-pointer items-center gap-2 rounded-lg border-[3px] border-ink bg-white px-5 text-base font-bold"
              >
                <Icon name="camera" className="size-5" />
                Escanear cédula
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {loading ? "Consultando campañas…" : ""}
            </p>
          </form>
        </div>
      </section>

      <section aria-label="Datos de AvisAR" className="bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-7 sm:grid-cols-3">
          {[
            [String(CATALOG.length), "modelos del parque real"],
            [String(CAMPAIGNS.length), "campañas de demostración"],
            ["$0", "la consulta y la reparación"],
          ].map(([number, label]) => (
            <div key={label}>
              <p className="font-display text-5xl font-extrabold text-signal">{number}</p>
              <p className="mt-1 text-base text-line">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="font-display text-5xl font-extrabold">Cómo funciona</h2>
        <ol className="mt-7 grid gap-5 md:grid-cols-3">
          {[
            ["Ingresás la patente", "O el VIN que figura en la cédula y en el parabrisas."],
            ["Ves el estado del auto", "Campañas pendientes o reparadas, con el riesgo explicado sin tecnicismos."],
            ["Compartís el informe", "Por WhatsApp o en PDF, para negociar con datos o pedir la reparación antes de cerrar."],
          ].map(([title, text], index) => (
            <li key={title} className="flex flex-col gap-3 rounded-lg border-2 border-ink bg-white p-6">
              <Diamond>{index + 1}</Diamond>
              <h3 className="mt-2 text-xl font-bold">{title}</h3>
              <p className="text-base leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <h2 className="font-display text-5xl font-extrabold">Buscá por marca y modelo</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          ¿No tenés la patente a mano? Elegí el tipo de vehículo y completá marca, modelo y año.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(["sedan", "suv", "pickup", "hatch"] as BodyType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                selectTab("data")
                document.getElementById("search-title")?.scrollIntoView({ behavior: "smooth", block: "center" })
                window.setTimeout(() => document.getElementById("tab-data")?.focus(), 300)
              }}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-ink bg-white p-5 text-ink transition hover:bg-signal"
            >
              <CarSilhouette type={type} className="h-16 w-full max-w-44" />
              <span className="text-lg font-bold">{BODY_LABEL[type]}</span>
            </button>
          ))}
        </div>
      </section>

      {isLoggedIn && (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-red">
                Mis vehículos
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-navy">
                Estado de tus vehículos
              </h2>
            </div>
            <p className="max-w-md text-base text-muted">
              Accedé rápidamente a la información de seguridad asociada a tu
              cuenta.
            </p>
          </div>
          {vehicles.length === 0 ? (
            <EmptyState
              icon="car"
              title="Todavía no registraste vehículos"
              text="Consultá un vehículo para conocer si tiene campañas de seguridad pendientes."
              action="Consultar un vehículo"
              onAction={() => onNav("home")}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {vehicles.map((vehicle) => {
              const critical = vehicle.recalls.some(
                (recall) => recall.risk === "CRÍTICO",
              )
              const title =
                vehicle.recalls.length === 0
                  ? "Sin recalls"
                  : `${vehicle.recalls.length} ${
                      vehicle.recalls.length === 1 ? "recall" : "recalls"
                    }`
              const tone =
                vehicle.recalls.length === 0
                  ? "border-green/25 hover:border-green"
                  : critical
                    ? "border-red/25 hover:border-red"
                    : "border-amber/25 hover:border-amber"
              return (
                <button
                  key={vehicle.id}
                  onClick={() => onSearch(vehicle)}
                  className={`group cursor-pointer rounded-xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${tone}`}
                >
                  <div className="flex items-start justify-between">
                    <Icon name="car" className="size-6 text-navy" />
                    <span className="font-mono text-sm font-bold text-muted">
                      {vehicle.plate}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="mt-1 text-base text-muted">
                    {vehicle.version} · {vehicle.year}
                  </p>
                  <p className="mt-4 text-sm font-bold uppercase tracking-wide text-muted">
                    {title}
                  </p>
                </button>
              )
              })}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

function ScannerScreen({
  onBack,
  onDetected,
}: {
  onBack: () => void
  onDetected: () => void
}) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "found">("idle")
  const timer = useRef<number | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  const scan = () => {
    setPhase("scanning")
    timer.current = window.setTimeout(() => setPhase("found"), 2200)
  }
  return (
    <main className="mx-auto max-w-xl px-5 py-10">
      <BackButton label="Volver a la búsqueda" onClick={onBack} />
      <h1 className="font-display text-3xl font-bold text-navy">
        Escanear patente
      </h1>
      <p className="mt-2 text-base leading-relaxed text-muted">
        Apuntá a la patente o a la cédula verde. Esta cámara es una simulación
        interactiva del reconocimiento.
      </p>
      <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-2xl bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-mid to-navy" />
        <div className="absolute inset-10 flex items-center justify-center rounded-xl border-2 border-white/80">
          {phase === "scanning" && (
            <span className="scanner-line absolute left-0 right-0 h-1 bg-signal shadow-lg" />
          )}
          {phase === "idle" && (
            <p className="text-base font-semibold text-white/60">
              Encuadrá la patente aquí
            </p>
          )}
          {phase === "found" && (
            <div className="text-center">
              <Icon name="check" className="mx-auto size-7 text-green-light" />
              <p className="mt-3 font-mono text-2xl font-bold tracking-widest text-white">
                AB 123 CD
              </p>
            </div>
          )}
        </div>
      </div>
      {phase === "found" ? (
        <button
          onClick={onDetected}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-green py-3.5 text-base font-bold text-white hover:bg-green/90"
        >
          <Icon name="check" className="size-4" />
          Confirmar y consultar
        </button>
      ) : (
        <button
          onClick={scan}
          disabled={phase === "scanning"}
          className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-navy py-3.5 text-base font-bold text-white disabled:cursor-wait disabled:opacity-70"
        >
          <Icon name="camera" className="size-5" />
          {phase === "scanning" ? "Detectando patente…" : "Iniciar escaneo"}
        </button>
      )}
    </main>
  )
}

function verificationCode(vehicle: AppVehicle) {
  const source = `${vehicle.plate}|${vehicle.consultedAt}|${vehicle.recalls.map((r) => r.id).join(",")}`
  let hash = 0
  for (const char of source) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const code = hash.toString(36).toUpperCase().padStart(7, "0").slice(0, 7)
  return `AV-${code.slice(0, 4)}-${code.slice(4)}`
}

function reportText(vehicle: AppVehicle) {
  const lines = [
    `Informe AvisAR · ${vehicle.consultedAt}`,
    `${vehicle.plate} · ${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
    vehicle.recalls.length === 0
      ? "Sin campañas de seguridad pendientes."
      : `${vehicle.recalls.length} campaña(s) pendiente(s):`,
    ...vehicle.recalls.map((recall) => `• ${recall.campaign} · ${riskLabel[recall.risk]} · ${recall.title}`),
    `Código de verificación: ${verificationCode(vehicle)}`,
    "Datos de demostración (prototipo educativo).",
  ]
  return lines.join("\n")
}

function ShareReport({ vehicle }: { vehicle: AppVehicle }) {
  const [copied, setCopied] = useState("")
  const pending = vehicle.recalls.length
  const critical = vehicle.recalls.filter((recall) => recall.risk === "CRÍTICO").length
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportText(vehicle))
      setCopied("Resumen copiado al portapapeles.")
    } catch {
      setCopied("No se pudo copiar. Seleccioná el texto del informe manualmente.")
    }
    window.setTimeout(() => setCopied(""), 3000)
  }
  return (
    <aside aria-labelledby="report-title" className="flex flex-col gap-4">
      <h2 id="report-title" className="font-display text-4xl font-extrabold">
        Informe para compartir
      </h2>
      <div className="card-signal overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between gap-3 bg-ink px-5 py-3 text-white">
          <span className="font-display text-2xl font-extrabold">
            AVIS<span className="ml-0.5 bg-signal px-1 text-ink">AR</span> · Informe
          </span>
          <span className="text-sm text-line">{vehicle.consultedAt}</span>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <p className="font-mono text-2xl font-bold tracking-[0.1em]">{vehicle.plate}</p>
          <p className="text-base">
            {vehicle.brand} {vehicle.model} {vehicle.year} · {BODY_LABEL[bodyTypeOf(vehicle.model)]}
          </p>
          <dl className="flex flex-col gap-2 border-t border-line pt-3 text-base">
            <div className="flex justify-between gap-3">
              <dt>Campañas pendientes</dt>
              <dd className={`font-bold ${pending === 0 ? "text-ok" : "text-risk-high"}`}>
                {pending === 0 ? "Ninguna" : `${pending}${critical ? ` · ${critical} crítica${critical > 1 ? "s" : ""}` : ""}`}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-muted">
            Código de verificación{" "}
            <span className="font-mono font-semibold text-ink">{verificationCode(vehicle)}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 print:hidden">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(reportText(vehicle))}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-14 items-center justify-center gap-2 rounded-lg bg-ink text-base font-bold text-white"
        >
          <Icon name="share" className="size-5" />
          Compartir por WhatsApp
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-white text-base font-bold"
        >
          <Icon name="download" className="size-5" />
          Descargar PDF
        </button>
        <button
          type="button"
          onClick={copy}
          className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-white text-base font-bold"
        >
          <Icon name="copy" className="size-5" />
          Copiar resumen
        </button>
        <p role="status" aria-live="polite" className="min-h-6 text-base font-semibold text-ok">
          {copied}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-muted">
        Mostrale el informe al vendedor o al comprador. Antes de firmar, volvé a
        consultar la patente para confirmar que no aparecieron campañas nuevas.
      </p>
    </aside>
  )
}

function ResultsScreen({
  vehicle,
  onNav,
  onDetail,
  onBook,
}: {
  vehicle: AppVehicle
  onNav: (screen: Screen) => void
  onDetail: (recall: AppRecall) => void
  onBook: (recall: AppRecall) => void
}) {
  const [filter, setFilter] = useState<"TODOS" | Risk>("TODOS")
  const visible =
    filter === "TODOS"
      ? vehicle.recalls
      : vehicle.recalls.filter((recall) => recall.risk === filter)
  const hasCritical = vehicle.recalls.some(
    (recall) => recall.risk === "CRÍTICO",
  )
  const count = vehicle.recalls.length
  const body = bodyTypeOf(vehicle.model)
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="print:hidden">
        <BackButton label="Nueva consulta" onClick={() => onNav("home")} />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <section
            aria-labelledby="vehicle-title"
            className="flex flex-wrap items-center gap-6 rounded-xl border-2 border-ink bg-white p-6"
          >
            <CarSilhouette type={body} className="h-20 w-52 shrink-0 text-ink" label={`Silueta de ${BODY_LABEL[body]}`} />
            <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2">
              <PlateFrame small>
                <p className="px-4 py-1 text-center font-mono text-2xl font-bold tracking-[0.12em]">
                  {vehicle.plate}
                </p>
              </PlateFrame>
              <h1 id="vehicle-title" className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </h1>
              <p className="text-base text-muted">
                {BODY_LABEL[body]} · {vehicle.version}
                {vehicle.vin && (
                  <>
                    {" "}· VIN <span className="font-mono">{vehicle.vin}</span>
                  </>
                )}
              </p>
            </div>
          </section>

          <section
            role={count > 0 ? "alert" : "status"}
            className={`flex flex-wrap items-center gap-5 rounded-xl p-6 sm:p-7 ${
              count === 0
                ? "border-2 border-ok bg-ok-light text-ink"
                : hasCritical
                  ? "bg-risk-high text-white"
                  : "border-[3px] border-ink bg-risk-mid text-ink"
            }`}
          >
            <span
              className={`flex size-16 shrink-0 items-center justify-center rounded-full ${
                count === 0 ? "bg-ok text-white" : hasCritical ? "bg-white text-risk-high" : "bg-ink text-risk-mid"
              }`}
            >
              <Icon name={count === 0 ? "check" : "alert"} className="size-9" />
            </span>
            <div className="flex-[1_1_320px]">
              <p className="font-display text-4xl font-extrabold">
                {count === 0
                  ? "Sin campañas pendientes"
                  : `${count} ${count === 1 ? "campaña pendiente" : "campañas pendientes"}${hasCritical ? " · riesgo crítico" : ""}`}
              </p>
              <p className="mt-2 max-w-2xl text-lg leading-relaxed">
                {count === 0
                  ? "No encontramos campañas de seguridad para este vehículo. Activá una alerta y te avisamos si aparece una nueva."
                  : hasCritical
                    ? "No lo uses hasta repararlo. La reparación es gratis en cualquier concesionario oficial de la marca."
                    : "Reparalo pronto. Las reparaciones de recall son gratuitas en concesionarios oficiales."}
              </p>
            </div>
          </section>

          <DemoNotice />

          {count === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 print:hidden">
              <button
                onClick={() => onNav("subscribe")}
                className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal text-lg font-bold"
              >
                <Icon name="bell" className="size-5" />
                Activar alerta preventiva
              </button>
              <button
                onClick={() => onNav("queries")}
                className="min-h-14 cursor-pointer rounded-lg border-[3px] border-ink bg-white text-lg font-bold"
              >
                Ver mis consultas
              </button>
            </div>
          ) : (
            <section aria-labelledby="campaigns-title">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 id="campaigns-title" className="font-display text-4xl font-extrabold">
                    Campañas de este vehículo
                  </h2>
                  <p className="mt-1 text-base text-muted">
                    Mostrando {visible.length} de {count}
                  </p>
                </div>
                <div
                  className="flex flex-wrap gap-2 print:hidden"
                  role="group"
                  aria-label="Filtrar por riesgo"
                >
                  {(["TODOS", "CRÍTICO", "ALTO", "MEDIO"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      aria-pressed={filter === item}
                      className={`min-h-11 cursor-pointer rounded border-2 border-ink px-3 text-sm font-bold ${
                        filter === item ? "bg-ink text-white" : "bg-white text-ink hover:bg-bg"
                      }`}
                    >
                      {item === "TODOS" ? "Todas" : riskLabel[item]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {visible.map((recall) => (
                  <article
                    key={recall.id}
                    className={`rounded-lg border-2 bg-white p-5 sm:p-6 ${
                      recall.risk === "CRÍTICO" ? "border-risk-high" : "border-ink"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Badge risk={recall.risk} />
                      <span className="font-mono text-sm text-muted">{recall.campaign}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold">{recall.title}</h3>
                    <p className="mt-1 text-base font-semibold text-graphite">
                      Componente: {recall.component}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      {recall.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3 print:hidden">
                      <button
                        onClick={() => onBook(recall)}
                        className="flex min-h-13 cursor-pointer items-center gap-2 rounded-lg border-[3px] border-ink bg-signal px-5 font-display text-2xl font-extrabold"
                      >
                        <Icon name="calendar" className="size-5" />
                        Pedir turno gratis
                      </button>
                      <button
                        onClick={() => onDetail(recall)}
                        className="flex min-h-13 cursor-pointer items-center gap-2 px-3 text-base font-bold underline underline-offset-4"
                      >
                        Ver detalle
                        <Icon name="arrow" className="size-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
                <button
                  onClick={() => onNav("home")}
                  className="min-h-13 flex-1 cursor-pointer rounded-lg border-[3px] border-ink bg-white text-base font-bold"
                >
                  Hacer otra consulta
                </button>
                <button
                  onClick={() => onNav("subscribe")}
                  className="flex min-h-13 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-ink text-base font-bold text-white"
                >
                  <Icon name="bell" className="size-5" />
                  Activar alertas
                </button>
              </div>
            </section>
          )}
        </div>
        <ShareReport vehicle={vehicle} />
      </div>
    </main>
  )
}

function DetailScreen({
  vehicle,
  recall,
  onBack,
  onSubscribe,
  isLoggedIn,
  onLogin,
  statuses,
  onUpdateStatus,
  appointment,
  onBook,
  onViewAppointment,
  onCompleteAppointment,
  onReprogramAppointment,
}: {
  vehicle: AppVehicle
  recall: AppRecall
  onBack: () => void
  onSubscribe: () => void
  isLoggedIn: boolean
  onLogin: () => void
  statuses: Record<string, RepairStatus>
  onUpdateStatus: (key: string, status: RepairStatus) => void
  appointment?: AppAppointment
  onBook: () => void
  onViewAppointment: () => void
  onCompleteAppointment: () => void
  onReprogramAppointment: () => void
}) {
  const [saved, setSaved] = useState(false)
  const statusKey = repairKey(vehicle.id, recall.id)
  const status = statuses[statusKey] ?? "Pendiente de revisión"
  const update = (next: RepairStatus) => {
    onUpdateStatus(statusKey, next)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }
  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <BackButton label="Volver a resultados" onClick={onBack} />
      <DemoNotice />
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge risk={recall.risk} />
            <span className="font-mono text-sm text-muted">{recall.id}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-navy">
            {recall.title}
          </h1>
          <p className="mt-2 text-base font-semibold text-navy-mid">
            Componente: {recall.component}
          </p>
        </div>
        <span className="text-sm text-muted">Publicada el {recall.date}</span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.85fr]">
        <div className="space-y-4">
          {[
            ["¿Cuál es el problema?", recall.description, "info"],
            ["¿Qué riesgo representa?", recall.danger, "alert"],
            ["¿Qué tenés que hacer?", recall.action, "check"],
          ].map(([title, text, icon], index) => (
            <section
              key={title}
              className={`rounded-xl border p-5 ${
                index === 1
                  ? "border-amber/25 bg-amber-light"
                  : "border-border bg-white"
              }`}
            >
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
                <Icon
                  name={icon as "info" | "alert" | "check"}
                  className="size-5"
                />
                {title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{text}</p>
              {index === 2 && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-light px-3 py-1.5 text-sm font-bold text-green">
                  <Icon name="check" className="size-3.5" />
                  Reparación 100% gratuita
                </span>
              )}
            </section>
          ))}
          <section className="rounded-xl border-2 border-ink bg-white p-5">
            <h2 className="font-display text-base font-bold text-navy">
              Datos de la campaña
            </h2>
            <dl className="mt-4 grid gap-4 text-base sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Código oficial</dt>
                <dd className="mt-1 font-mono font-semibold text-navy">
                  {recall.campaign}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Contacto gratuito</dt>
                <dd className="mt-1 font-mono font-semibold text-navy">
                  {recall.contact}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border-2 border-ink bg-white p-6 lg:sticky lg:top-24">
          <p className="text-sm font-bold uppercase tracking-widest text-red">
            Seguimiento personal
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-navy">
            Estado de mi vehículo
          </h2>
          <p className="mt-2 text-base leading-relaxed text-muted">
            {isLoggedIn
              ? "Guardá tu avance para saber cuál es el próximo paso."
              : "Ingresá para ver y actualizar el estado de este vehículo."}
          </p>
          {isLoggedIn ? (
            <>
              {appointment?.status === "Programado" ? (
                <div className="mt-5 rounded-xl border border-amber/25 bg-amber-light p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-amber">
                    Turno programado
                  </p>
                  <p className="mt-2 font-display font-bold text-navy">
                    {formatAppointmentDate(appointment.date)} · {appointment.time} h
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {dealerFor(appointment.dealerId)?.name}
                  </p>
                  <button
                    onClick={onViewAppointment}
                    className="mt-3 cursor-pointer text-sm font-bold text-navy underline underline-offset-4"
                  >
                    Ver turno
                  </button>
                </div>
              ) : appointment?.status === "Realizado" ? (
                <div className="mt-5 rounded-xl bg-green-light p-4 text-base font-bold text-green">
                  Reparación realizada · alerta cerrada para esta campaña
                </div>
              ) : (
                <button
                  onClick={onBook}
                  className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal py-3 text-base font-bold text-ink hover:bg-risk-mid"
                >
                  <Icon name="calendar" className="size-4" />
                  Reservar turno de reparación
                </button>
              )}
              <RepairProgress status={status} />
              {appointment?.status === "Programado" &&
                appointmentIsPast(appointment) && (
                  <div className="mt-5 rounded-xl border-2 border-ink bg-bg p-4">
                    <p className="text-base font-bold text-navy">
                      ¿Se realizó la reparación en tu turno del{" "}
                      {formatAppointmentDate(appointment.date)}?
                    </p>
                    <div className="mt-3 grid gap-2">
                      <button
                        onClick={onCompleteAppointment}
                        className="cursor-pointer rounded-lg bg-green px-3 py-2.5 text-sm font-bold text-white"
                      >
                        Sí, ya lo reparé
                      </button>
                      <button
                        onClick={onReprogramAppointment}
                        className="cursor-pointer rounded-lg border-2 border-ink bg-white px-3 py-2.5 text-sm font-bold text-navy"
                      >
                        No, reprogramar
                      </button>
                    </div>
                  </div>
                )}
              <div className="mt-5 space-y-2">
                {([
                  "Pendiente de revisión",
                  "Reparación programada",
                  "Reparación realizada",
                ] as RepairStatus[]).map((item, index) => (
                  <button
                    key={item}
                    onClick={() => update(item)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-base font-semibold transition ${
                      status === item
                        ? item === "Reparación realizada"
                          ? "border-green bg-green-light text-green"
                          : "border-navy bg-navy/5 text-navy"
                        : "border-border text-muted hover:border-navy/40"
                    }`}
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-sm ${
                        status === item
                          ? "bg-current text-white"
                          : "bg-bg text-muted"
                      }`}
                    >
                      <span className={status === item ? "text-white" : ""}>
                        {index + 1}
                      </span>
                    </span>
                    {item}
                  </button>
                ))}
              </div>
              {saved && (
                <div
                  role="status"
                  className="mt-4 flex items-center gap-2 rounded-lg bg-green-light px-3 py-2 text-sm font-bold text-green"
                >
                  <Icon name="check" className="size-4" />
                  Estado guardado en tu cuenta
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Este seguimiento es personal y no representa una certificación
                oficial del fabricante.
              </p>
            </>
          ) : (
            <div className="mt-5 rounded-xl border-2 border-ink bg-bg p-5 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-white text-navy">
                <Icon name="lock" className="size-5" />
              </span>
              <p className="mt-3 text-base font-bold text-navy">
                Información privada
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Los estados sólo están disponibles para el titular de la cuenta.
              </p>
              <button
                onClick={onLogin}
                className="mt-4 w-full cursor-pointer rounded-lg bg-navy py-3 text-base font-bold text-white hover:bg-navy-mid"
              >
                Ingresar para continuar
              </button>
            </div>
          )}
          {isLoggedIn && (
            <button
              onClick={onSubscribe}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-navy py-3 text-base font-bold text-white hover:bg-navy-mid"
            >
              <Icon name="bell" className="size-4" />
              Recibir novedades
            </button>
          )}
        </aside>
      </div>
    </main>
  )
}

function QueriesScreen({
  queries,
  onRepeat,
  onDelete,
  onHome,
  appointments,
  statuses,
}: {
  queries: AppVehicle[]
  onRepeat: (vehicle: AppVehicle) => void
  onDelete: (id: string) => void
  onHome: () => void
  appointments: AppAppointment[]
  statuses: Record<string, RepairStatus>
}) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-red">
        Historial de tu cuenta
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">
        Mis consultas
      </h1>
      <p className="mt-2 text-base text-muted">
        Volvé a revisar los vehículos que consultaste con tu cuenta.
      </p>
      {queries.length === 0 ? (
        <EmptyState
          icon="car"
          title="Todavía no hiciste consultas"
          text="Cuando busques un vehículo, aparecerá acá para que puedas revisarlo nuevamente."
          action="Consultar un vehículo"
          onAction={onHome}
        />
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {queries.map((vehicle) => {
            const appointment = appointments.find(
              (item) =>
                item.plate === vehicle.plate && item.status === "Programado",
            )
            const allRealized =
              vehicle.recalls.length > 0 &&
              vehicle.recalls.every(
                (recall) =>
                  statuses[repairKey(vehicle.id, recall.id)] ===
                  "Reparación realizada",
              )
            const critical = vehicle.recalls.some(
              (recall) => recall.risk === "CRÍTICO",
            )
            return (
              <article
                key={vehicle.id}
                className="rounded-xl border-2 border-ink bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-base font-bold tracking-wider text-navy">
                      {vehicle.plate}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-bold text-navy">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <p className="text-base text-muted">
                      {vehicle.version} · {vehicle.year}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Consultado el {vehicle.consultedAt}
                    </p>
                  </div>
                  <span
                    className={`size-3 rounded-full ${
                      vehicle.recalls.length === 0 || allRealized
                        ? "bg-green"
                        : critical
                          ? "bg-red"
                          : "bg-amber"
                    }`}
                    title={
                      vehicle.recalls.length === 0 || allRealized
                        ? allRealized
                          ? "Recalls realizados"
                          : "Sin recalls"
                        : critical
                          ? "Con recall crítico"
                          : "Con recalls"
                    }
                  />
                </div>
                <div className="mt-5 rounded-lg bg-bg px-3 py-2 text-base font-semibold text-navy">
                  {vehicle.recalls.length === 0
                    ? "Sin recalls detectados"
                    : `${vehicle.recalls.length} ${
                        vehicle.recalls.length === 1
                          ? "recall detectado"
                          : "recalls detectados"
                      }`}
                </div>
                {appointment && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold text-amber">
                    <Icon name="calendar" className="size-4" />
                    Turno: {formatAppointmentDate(appointment.date, true)} ·{" "}
                    {appointment.time} h
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onRepeat(vehicle)}
                    className="flex-1 cursor-pointer rounded-lg bg-navy px-3 py-2.5 text-sm font-bold text-white hover:bg-navy-mid"
                  >
                    Consultar nuevamente
                  </button>
                  <button
                    onClick={() => onDelete(vehicle.id)}
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-muted hover:border-red hover:text-red"
                    aria-label={`Eliminar ${vehicle.brand} ${vehicle.model}`}
                  >
                    <Icon name="trash" className="size-4" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

function SubscribeScreen({
  vehicle,
  onSave,
  onAlerts,
}: {
  vehicle: AppVehicle | null
  onSave: (alert: AppAlert) => void
  onAlerts: () => void
}) {
  const [channel, setChannel] = useState<Channel>("WhatsApp")
  const [plate, setPlate] = useState(vehicle?.plate ?? "")
  const [destination, setDestination] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const submit = () => {
    const phoneValid = /^\+?[\d\s()-]{9,}$/.test(destination)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)
    if (plate.replace(/\s/g, "").length < 6) {
      setError("Ingresá una patente válida.")
      return
    }
    if (
      (channel === "WhatsApp" && !phoneValid) ||
      (channel === "E-mail" && !emailValid)
    ) {
      setError(
        channel === "WhatsApp"
          ? "Ingresá un número de WhatsApp válido."
          : "Ingresá un e-mail válido.",
      )
      return
    }
    onSave({
      id: `${plate}-${channel}-${Date.now()}`,
      vehicle: vehicle
        ? `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`
        : "Vehículo registrado",
      plate,
      channel,
      destination,
      active: true,
    })
    setDone(true)
  }
  if (done) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-light text-green">
          <Icon name="check" className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-navy">
          Alerta activada
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Te avisaremos por {channel} a <strong>{destination}</strong> si
          aparece una nueva campaña para <strong>{plate}</strong>.
        </p>
        <p className="mt-3 text-sm text-muted">
          Esta suscripción es una simulación: el prototipo no envía mensajes
          reales.
        </p>
        <button
          onClick={onAlerts}
          className="mt-8 cursor-pointer rounded-lg bg-navy px-7 py-3 text-base font-bold text-white hover:bg-navy-mid"
        >
          Ver mis alertas
        </button>
      </main>
    )
  }
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-red">
        Alertas preventivas
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">
        Activar una alerta
      </h1>
      <p className="mt-2 text-base text-muted">
        Elegí cómo querés recibir novedades. No necesitás instalar una app.
      </p>
      <div className="mt-7 rounded-2xl border-2 border-ink bg-white p-6">
        {vehicle && (
          <div className="mb-6 rounded-xl bg-bg p-4">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">
              Vehículo asociado
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-display font-bold text-navy">
                {vehicle.brand} {vehicle.model} {vehicle.version} {vehicle.year}
              </p>
              <p className="font-mono text-base font-bold text-navy">
                {vehicle.plate}
              </p>
            </div>
          </div>
        )}
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-navy">
            Patente
          </span>
          <input
            value={plate}
            onChange={(event) => setPlate(event.target.value.toUpperCase())}
            className="w-full rounded-lg border border-border px-4 py-3 font-mono uppercase tracking-wider outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            placeholder="AB 123 CD"
          />
        </label>
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-bold uppercase tracking-wide text-navy">
            Canal de notificación
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {(["WhatsApp", "E-mail"] as Channel[]).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setChannel(item)
                  setDestination("")
                  setError("")
                }}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-3 text-base font-bold ${
                  channel === item
                    ? item === "WhatsApp"
                      ? "border-green bg-green text-white"
                      : "border-navy bg-navy text-white"
                    : "border-border text-muted hover:border-navy/40"
                }`}
              >
                <Icon
                  name={item === "WhatsApp" ? "phone" : "mail"}
                  className="size-4"
                />
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-navy">
            {channel === "WhatsApp" ? "Número de WhatsApp" : "E-mail"}
          </span>
          <input
            type={channel === "WhatsApp" ? "tel" : "email"}
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value)
              setError("")
            }}
            placeholder={
              channel === "WhatsApp"
                ? "+54 9 11 1234-5678"
                : "nombre@ejemplo.com"
            }
            className="w-full rounded-lg border border-border px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="mt-3 flex items-center gap-2 text-sm font-bold text-red"
          >
            <Icon name="alert" className="size-4" />
            {error}
          </p>
        )}
        <button
          onClick={submit}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal py-3.5 text-base font-bold text-ink hover:bg-risk-mid"
        >
          <Icon name="bell" className="size-4" />
          Activar alerta
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Simulación local. No se realizarán envíos reales ni compartiremos tus
          datos.
        </p>
      </div>
    </main>
  )
}

function MyAlertsScreen({
  alerts,
  onToggle,
  onDelete,
  onSubscribe,
}: {
  alerts: AppAlert[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onSubscribe: () => void
}) {
  const [message, setMessage] = useState("")
  const toggle = (alert: AppAlert) => {
    onToggle(alert.id)
    setMessage(
      `Alerta ${alert.active ? "desactivada" : "activada"} correctamente.`,
    )
    window.setTimeout(() => setMessage(""), 2200)
  }
  const remove = (alert: AppAlert) => {
    onDelete(alert.id)
    setMessage(`Alerta de ${alert.plate} eliminada correctamente.`)
    window.setTimeout(() => setMessage(""), 2200)
  }
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-red">
            Suscripciones de tu cuenta
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy">
            Mis alertas
          </h1>
          <p className="mt-2 text-base text-muted">
            Gestioná las alertas asociadas a tus vehículos.
          </p>
        </div>
        <button
          onClick={onSubscribe}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-base font-bold text-white hover:bg-navy-mid"
        >
          <Icon name="bell" className="size-4" />
          Nueva alerta
        </button>
      </div>
      {message && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-lg bg-green-light px-4 py-3 text-base font-semibold text-green"
        >
          <Icon name="check" className="size-4" />
          {message}
        </div>
      )}
      {alerts.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No hay alertas configuradas"
          text="Activá una alerta para recibir novedades de seguridad por WhatsApp o e-mail."
          action="Activar mi primera alerta"
          onAction={onSubscribe}
        />
      ) : (
        <div className="mt-7 space-y-4">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className="flex flex-col gap-5 rounded-xl border-2 border-ink bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    alert.active
                      ? "bg-green-light text-green"
                      : "bg-bg text-muted"
                  }`}
                >
                  <Icon
                    name={alert.channel === "WhatsApp" ? "phone" : "mail"}
                    className="size-5"
                  />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display font-bold text-navy">
                      {alert.vehicle}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                        alert.active
                          ? "bg-green-light text-green"
                          : "bg-bg text-muted"
                      }`}
                    >
                      {alert.active ? "Activa" : "Desactivada"}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-sm font-semibold text-navy">
                    {alert.plate}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {alert.channel} · {alert.destination}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(alert)}
                  className={`cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
                    alert.active
                      ? "border-red/25 text-red hover:bg-red-light"
                      : "border-green/25 text-green hover:bg-green-light"
                  }`}
                >
                  {alert.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => remove(alert)}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-muted transition hover:border-red hover:bg-red-light hover:text-red"
                  aria-label={`Eliminar alerta de ${alert.plate}`}
                  title="Eliminar alerta"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

/** Mapa real (OpenStreetMap, sin API key) centrado en el concesionario elegido. */
function DealerMap({ dealer, number }: { dealer: AppDealer; number: number }) {
  const d = 0.008
  const bbox = [dealer.lng - d, dealer.lat - d * 0.75, dealer.lng + d, dealer.lat + d * 0.75].join(",")
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${dealer.lat},${dealer.lng}`
  const query = encodeURIComponent(`${dealer.address}, ${dealer.neighborhood}, Ciudad de Buenos Aires`)
  return (
    <div className="flex h-full min-h-96 flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white lg:sticky lg:top-6">
      <iframe
        key={dealer.id}
        title={`Mapa: ubicación de ${dealer.name}`}
        src={src}
        loading="lazy"
        className="min-h-80 w-full flex-1 border-0 bg-bg"
      />
      <div className="flex flex-wrap items-center gap-3 border-t border-border p-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red text-sm font-bold text-white">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-navy">{dealer.name}</p>
          <p className="text-sm text-muted">
            {dealer.address} · {dealer.neighborhood}
          </p>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-navy px-3 py-2 text-sm font-bold text-navy hover:bg-bg"
        >
          Cómo llegar
        </a>
      </div>
    </div>
  )
}

function DealersScreen({
  vehicle,
  onBack,
  onChoose,
}: {
  vehicle: AppVehicle
  onBack: () => void
  onChoose: (dealer: AppDealer) => void
}) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const allDealers = dealersOf(vehicle.brand)
  const dealers = allDealers.filter((dealer) =>
    `${dealer.name} ${dealer.address} ${dealer.neighborhood}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )
  const selectedDealer = dealers.find((dealer) => dealer.id === selectedId) ?? dealers[0]

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <BackButton label="Volver" onClick={onBack} />
      <p className="text-sm font-bold uppercase tracking-widest text-red">
        Red oficial
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">
        Concesionarios oficiales {vehicle.brand}
      </h1>
      <p className="mt-2 text-base text-muted">
        Elegí dónde querés realizar la reparación gratuita.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label>
          <span className="sr-only">Barrio o localidad</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Barrio o localidad"
            className="w-full rounded-lg border-2 border-ink bg-white px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </label>
        <button
          onClick={() => {
            setQuery("")
            setSelectedId(allDealers[0]?.id ?? "")
          }}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy bg-white px-5 py-3 text-base font-bold text-navy hover:bg-bg"
        >
          <Icon name="location" className="size-4" />
          Usar mi ubicación
        </button>
      </div>

      {dealers.length === 0 ? (
        <EmptyState
          icon="car"
          title="No encontramos concesionarios oficiales cerca"
          text="Contactá a la marca para conocer otras opciones de atención."
          action="Limpiar búsqueda"
          onAction={() => setQuery("")}
        />
      ) : (
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <DealerMap
            dealer={selectedDealer}
            number={dealers.indexOf(selectedDealer) + 1}
          />

          <div className="space-y-3">
            {dealers.map((dealer, index) => (
              <article
                key={dealer.id}
                className={`rounded-xl border bg-white p-5 transition ${
                  selectedDealer.id === dealer.id ? "border-red shadow-md" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      selectedDealer.id === dealer.id ? "bg-red" : "bg-navy"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold text-navy">
                      {dealer.name}
                    </h2>
                    <p className="mt-1 text-base text-muted">
                      {dealer.address} · {dealer.neighborhood}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {dealer.days} · {dealer.hours}
                    </p>
                    <p className="mt-2 font-mono text-sm font-bold text-navy">
                      {dealer.distanceKm.toLocaleString("es-AR")} km
                    </p>
                    <button
                      onClick={() => setSelectedId(dealer.id)}
                      aria-pressed={selectedDealer.id === dealer.id}
                      className="mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-bold text-navy underline-offset-2 hover:underline"
                    >
                      <Icon name="location" className="size-3.5" />
                      {selectedDealer.id === dealer.id ? "Viendo en el mapa" : "Ver en el mapa"}
                    </button>
                  </div>
                  <button
                    onClick={() => onChoose(dealer)}
                    className="cursor-pointer rounded-lg border-[3px] border-ink bg-signal px-4 py-2.5 text-sm font-bold text-ink hover:bg-risk-mid"
                  >
                    Elegir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

function BookingScreen({
  vehicle,
  recall,
  dealer,
  alerts,
  initialAppointment,
  onBack,
  onConfirm,
}: {
  vehicle: AppVehicle
  recall: AppRecall
  dealer: AppDealer
  alerts: AppAlert[]
  initialAppointment?: AppAppointment
  onBack: () => void
  onConfirm: (
    date: string,
    time: string,
    channel: Channel,
    destination: string,
  ) => void
}) {
  const days = appointmentDays(dealer.id)
  const existingAlert = alerts.find(
    (alert) => alert.plate === vehicle.plate && alert.active,
  )
  const initialChannel =
    initialAppointment?.reminderChannel ??
    existingAlert?.channel ??
    "WhatsApp"
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [channel, setChannel] = useState<Channel>(initialChannel)
  const [destination, setDestination] = useState(
    initialAppointment?.reminderDestination ??
      alerts.find(
        (alert) =>
          alert.plate === vehicle.plate &&
          alert.active &&
          alert.channel === initialChannel,
      )?.destination ??
      "",
  )
  const [error, setError] = useState("")
  const selectedDay = days.find((day) => day.date === date)

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <BackButton label="Cambiar concesionario" onClick={onBack} />
      <p className="text-sm font-bold uppercase tracking-widest text-red">
        Reserva de turno
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">
        Elegí día y horario
      </h1>

      <div className="mt-7 grid gap-3 rounded-2xl border-2 border-ink bg-white p-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">
            Vehículo
          </p>
          <p className="mt-2 font-display font-bold text-navy">
            {vehicle.brand} {vehicle.model} · {vehicle.plate}
          </p>
          <p className="mt-1 text-sm text-muted">{recall.title}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted">
            Concesionario
          </p>
          <p className="mt-2 font-display font-bold text-navy">{dealer.name}</p>
          <p className="mt-1 text-sm text-muted">{dealer.address}</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border-2 border-ink bg-white p-5">
        <h2 className="font-display text-lg font-bold text-navy">Día</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => {
            const available = day.slots.some((slot) => !slot.occupied)
            const parsed = new Date(`${day.date}T12:00:00`)
            return (
              <button
                key={day.date}
                disabled={!available}
                aria-pressed={date === day.date}
                onClick={() => {
                  setDate(day.date)
                  setTime("")
                  setError("")
                }}
                className={`min-w-20 cursor-pointer rounded-lg border px-3 py-3 text-center disabled:cursor-not-allowed disabled:opacity-40 ${
                  date === day.date
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-white text-navy hover:border-navy"
                }`}
              >
                <span className="block text-sm font-bold uppercase">
                  {new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(parsed)}
                </span>
                <span className="mt-1 block font-display text-lg font-bold">
                  {parsed.getDate()}
                </span>
              </button>
            )
          })}
        </div>

        <h2 className="mt-6 font-display text-lg font-bold text-navy">Horario</h2>
        {selectedDay ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {selectedDay.slots.map((slot) => (
              <button
                key={slot.time}
                disabled={slot.occupied}
                aria-pressed={time === slot.time}
                onClick={() => {
                  setTime(slot.time)
                  setError("")
                }}
                className={`cursor-pointer rounded-lg border px-3 py-3 font-mono text-base font-bold disabled:cursor-not-allowed disabled:bg-bg disabled:text-muted disabled:line-through ${
                  time === slot.time
                    ? "border-red bg-red text-white"
                    : "border-border bg-white text-navy hover:border-navy"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-base text-muted">Elegí un día para ver los horarios.</p>
        )}

        <fieldset className="mt-7">
          <legend className="font-display text-lg font-bold text-navy">
            Recordatorio
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["WhatsApp", "E-mail"] as Channel[]).map((item) => (
              <button
                key={item}
                aria-pressed={channel === item}
                onClick={() => {
                  setChannel(item)
                  setDestination(
                    alerts.find(
                      (alert) =>
                        alert.plate === vehicle.plate &&
                        alert.active &&
                        alert.channel === item,
                    )?.destination ?? "",
                  )
                  setError("")
                }}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-3 text-base font-bold ${
                  channel === item
                    ? item === "WhatsApp"
                      ? "border-green bg-green text-white"
                      : "border-navy bg-navy text-white"
                    : "border-border bg-white text-muted"
                }`}
              >
                <Icon name={item === "WhatsApp" ? "phone" : "mail"} className="size-4" />
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-navy">
            {channel === "WhatsApp"
              ? "Número de WhatsApp"
              : "Correo electrónico"}
          </span>
          <input
            type={channel === "WhatsApp" ? "tel" : "email"}
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value)
              setError("")
            }}
            autoComplete={channel === "WhatsApp" ? "tel" : "email"}
            placeholder={
              channel === "WhatsApp"
                ? "+54 9 11 1234-5678"
                : "nombre@ejemplo.com"
            }
            className="w-full rounded-lg border-2 border-ink bg-white px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
          <span className="mt-2 block text-sm text-muted">
            Usaremos este dato únicamente para el recordatorio simulado.
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-4 flex items-center gap-2 text-base font-bold text-red">
            <Icon name="alert" className="size-4" />
            {error}
          </p>
        )}
        <button
          onClick={() => {
            if (!date || !time) {
              setError("Elegí un día y un horario para confirmar el turno.")
              return
            }
            const validPhone = /^\+?[\d\s()-]{9,}$/.test(destination)
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)
            if (
              (channel === "WhatsApp" && !validPhone) ||
              (channel === "E-mail" && !validEmail)
            ) {
              setError(
                channel === "WhatsApp"
                  ? "Ingresá un número de WhatsApp válido."
                  : "Ingresá un correo electrónico válido.",
              )
              return
            }
            onConfirm(date, time, channel, destination.trim())
          }}
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal py-3.5 text-base font-bold text-ink hover:bg-risk-mid"
        >
          <Icon name="calendar" className="size-4" />
          Confirmar turno
        </button>
      </section>
    </main>
  )
}

function BookingOkScreen({
  appointment,
  vehicle,
  recall,
  onToggleReminder,
  onAppointments,
}: {
  appointment: AppAppointment
  vehicle: AppVehicle
  recall: AppRecall
  onToggleReminder: () => void
  onAppointments: () => void
}) {
  const dealer = dealerFor(appointment.dealerId)
  const downloadCalendar = () => {
    const start = `${appointment.date.replace(/-/g, "")}T${appointment.time.replace(":", "")}00`
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `SUMMARY:Turno de recall AvisAR - ${vehicle.brand} ${vehicle.model}`,
      `LOCATION:${dealer?.name}, ${dealer?.address}`,
      `DESCRIPTION:Reparación gratuita - ${recall.title}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([content], { type: "text/calendar" }))
    link.download = `turno-${appointment.code}.ics`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <DemoNotice text="Turno simulado: la agenda real es del concesionario." />
      <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 text-center sm:p-8">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-light text-green">
          <Icon name="check" className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-navy">
          Turno reservado
        </h1>
        <p className="mt-2 font-mono text-base font-bold text-red">{appointment.code}</p>

        <dl className="mt-7 divide-y divide-border rounded-xl border-2 border-ink text-left text-base">
          {[
            ["Concesionario", `${dealer?.name} · ${dealer?.address}`],
            ["Día y hora", `${formatAppointmentDate(appointment.date)} · ${appointment.time} h`],
            ["Vehículo", `${appointment.vehicle} · ${appointment.plate}`],
            ["Campaña", recall.title],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr]">
              <dt className="text-sm font-bold text-muted">{label}</dt>
              <dd className="font-semibold text-navy">{value}</dd>
            </div>
          ))}
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr]">
            <dt className="text-sm font-bold text-muted">Costo</dt>
            <dd className="font-bold text-green">Gratuito</dd>
          </div>
        </dl>

        <button
          role="switch"
          aria-checked={appointment.reminderActive}
          onClick={onToggleReminder}
          className="mt-5 flex w-full cursor-pointer items-center justify-between rounded-xl bg-bg px-4 py-3 text-left"
        >
          <span>
            <strong className="block text-base text-navy">Recordatorio 24 h antes</strong>
            <span className="text-sm text-muted">
              Por {appointment.reminderChannel}
              {appointment.reminderDestination
                ? ` · ${appointment.reminderDestination}`
                : ""}
            </span>
          </span>
          <span
            className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
              appointment.reminderActive ? "justify-end bg-green" : "justify-start bg-muted/30"
            }`}
          >
            <span className="size-4 rounded-full bg-white" />
          </span>
        </button>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={downloadCalendar}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy py-3 text-base font-bold text-navy hover:bg-bg"
          >
            <Icon name="calendar" className="size-4" />
            Agregar al calendario
          </button>
          <button
            onClick={onAppointments}
            className="cursor-pointer rounded-lg bg-navy py-3 text-base font-bold text-white hover:bg-navy-mid"
          >
            Ver Mis turnos
          </button>
        </div>
      </div>
    </main>
  )
}

function ReminderModal({
  appointment,
  onClose,
  onReprogram,
  onCancel,
}: {
  appointment: AppAppointment
  onClose: () => void
  onReprogram: () => void
  onCancel: () => void
}) {
  const dealer = dealerFor(appointment.dealerId)
  const vehicle = findVehicle({ mode: "plate", plate: appointment.plate })
  const recall = vehicle?.recalls.find((item) => item.id === appointment.recallId)
  const message = `Recordatorio de turno. Mañana, ${formatAppointmentDate(appointment.date)} a las ${appointment.time}, tenés turno en ${dealer?.name} (${dealer?.address}) para la campaña de ${recall?.component} de tu ${appointment.vehicle} ${appointment.plate}. La reparación es gratuita.`
  const email = appointment.reminderChannel === "E-mail"

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Recordatorio de turno"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className={`flex items-center justify-between px-5 py-4 text-white ${email ? "bg-navy" : "bg-green"}`}>
          <div>
            <p className="text-base font-bold">
              {email ? "AvisAR · Recordatorio de turno" : "AvisAR · Cuenta de empresa"}
            </p>
            <p className="text-sm text-white/70">{email ? "Para: vos" : "en línea"}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar recordatorio"
            className="cursor-pointer rounded-lg p-2 text-white hover:bg-white/10"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <div className={email ? "bg-bg p-5" : "bg-green-light p-5"}>
          {email && (
            <p className="mb-3 text-base font-bold text-navy">
              Asunto: Tu turno de reparación es mañana
            </p>
          )}
          <div className="rounded-xl bg-white p-4 text-base leading-relaxed text-navy shadow-sm">
            {message}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg bg-green px-3 py-2.5 text-sm font-bold text-white"
            >
              Confirmo
            </button>
            <button
              onClick={onReprogram}
              className="cursor-pointer rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-navy"
            >
              Reprogramar
            </button>
            <button
              onClick={onCancel}
              className="cursor-pointer rounded-lg border border-red/25 bg-white px-3 py-2.5 text-sm font-bold text-red"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyAppointmentsScreen({
  appointments,
  onReprogram,
  onCancel,
  onSimulate,
  onComplete,
  onHome,
}: {
  appointments: AppAppointment[]
  onReprogram: (appointment: AppAppointment) => void
  onCancel: (appointment: AppAppointment) => void
  onSimulate: (appointment: AppAppointment) => void
  onComplete: (appointment: AppAppointment) => void
  onHome: () => void
}) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming")
  const [reminder, setReminder] = useState<AppAppointment | null>(null)
  const upcoming = appointments.filter(
    (item) => item.status === "Programado" && !appointmentIsPast(item),
  )
  const past = appointments.filter(
    (item) => item.status !== "Programado" || appointmentIsPast(item),
  )
  const visible = tab === "upcoming" ? upcoming : past

  const statusStyle: Record<AppointmentStatus, string> = {
    Programado: "bg-amber-light text-amber",
    Realizado: "bg-green-light text-green",
    Cancelado: "bg-bg text-muted",
    "No realizado": "bg-red-light text-red",
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-red">
        Agenda de reparaciones
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy">Mis turnos</h1>
      <p className="mt-2 text-base text-muted">
        Administrá tus reservas y confirmá el resultado de cada reparación.
      </p>

      <div className="mt-7 inline-flex rounded-lg bg-white p-1">
        <button
          onClick={() => setTab("upcoming")}
          className={`cursor-pointer rounded-md px-4 py-2 text-base font-bold ${
            tab === "upcoming" ? "bg-navy text-white" : "text-muted"
          }`}
        >
          Próximos ({upcoming.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`cursor-pointer rounded-md px-4 py-2 text-base font-bold ${
            tab === "past" ? "bg-navy text-white" : "text-muted"
          }`}
        >
          Pasados ({past.length})
        </button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="Todavía no reservaste turnos"
          text="Cuando reserves una reparación, vas a poder gestionarla desde acá."
          action={tab === "past" ? "Ver próximos" : "Consultar un vehículo"}
          onAction={() =>
            tab === "past" ? setTab("upcoming") : onHome()
          }
        />
      ) : (
        <div className="mt-6 space-y-4">
          {visible.map((appointment) => {
            const dealer = dealerFor(appointment.dealerId)
            const pastDue =
              appointment.status === "Programado" && appointmentIsPast(appointment)
            return (
              <article
                key={appointment.id}
                className="rounded-xl border-2 border-ink bg-white p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-base font-bold text-navy">
                        {appointment.plate}
                      </p>
                      <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${statusStyle[appointment.status]}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-lg font-bold text-navy">
                      {appointment.vehicle}
                    </h2>
                    <p className="mt-1 text-base font-semibold text-navy">
                      {formatAppointmentDate(appointment.date)} · {appointment.time} h
                    </p>
                    <p className="mt-1 text-base text-muted">
                      {dealer?.name} · {dealer?.address}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-red">
                    {appointment.code}
                  </span>
                </div>

                {pastDue && (
                  <div className="mt-5 rounded-xl bg-bg p-4">
                    <p className="text-base font-bold text-navy">
                      ¿Se realizó la reparación en tu turno del{" "}
                      {formatAppointmentDate(appointment.date)}?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => onComplete(appointment)}
                        className="cursor-pointer rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white"
                      >
                        Sí, ya lo reparé
                      </button>
                      <button
                        onClick={() => onReprogram(appointment)}
                        className="cursor-pointer rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-sm font-bold text-navy"
                      >
                        No, reprogramar
                      </button>
                    </div>
                  </div>
                )}

                {appointment.status === "Realizado" && (
                  <p className="mt-5 flex items-center gap-2 rounded-lg bg-green-light px-4 py-3 text-base font-bold text-green">
                    <Icon name="check" className="size-4" />
                    Reparación realizada · alerta cerrada para esta campaña
                  </p>
                )}

                {appointment.status === "Programado" && !pastDue && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => onReprogram(appointment)}
                      className="cursor-pointer rounded-lg border border-navy px-4 py-2.5 text-sm font-bold text-navy"
                    >
                      Reprogramar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("¿Querés cancelar este turno?")) onCancel(appointment)
                      }}
                      className="cursor-pointer rounded-lg border border-red/25 px-4 py-2.5 text-sm font-bold text-red"
                    >
                      Cancelar
                    </button>
                    {appointment.reminderActive && (
                      <button
                        onClick={() => setReminder(appointment)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white"
                      >
                        <Icon name="message" className="size-4" />
                        Ver recordatorio
                      </button>
                    )}
                    <button
                      onClick={() => onSimulate(appointment)}
                      className="cursor-pointer rounded-lg bg-bg px-4 py-2.5 text-sm font-bold text-muted"
                    >
                      Simular día del turno
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {reminder && (
        <ReminderModal
          appointment={reminder}
          onClose={() => setReminder(null)}
          onReprogram={() => {
            setReminder(null)
            onReprogram(reminder)
          }}
          onCancel={() => {
            setReminder(null)
            if (window.confirm("¿Querés cancelar este turno?")) onCancel(reminder)
          }}
        />
      )}
    </main>
  )
}

function EducationScreen({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(0)
  const faqs = [
    [
      "¿La reparación de un recall es realmente gratuita?",
      "Sí. El fabricante cubre repuestos y mano de obra, aunque el vehículo esté fuera de garantía o haya cambiado de dueño.",
    ],
    [
      "¿Tengo que ser titular del vehículo?",
      "No para consultar. Para coordinar la reparación, el concesionario puede pedirte la documentación habitual del vehículo.",
    ],
    [
      "¿Puedo seguir usando el auto?",
      "Depende del riesgo. Ante un recall crítico, evitá usarlo y comunicate de inmediato con la red oficial. En niveles alto o medio, seguí las indicaciones de la campaña.",
    ],
    [
      "¿Dónde encuentro el VIN?",
      "Tiene 17 caracteres. Está en la cédula verde, en la base del parabrisas del lado del conductor o en el marco de la puerta.",
    ],
  ]
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-red">
          Guía simple
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy">
          ¿Qué es un recall?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Es un llamado oficial del fabricante para corregir un defecto de
          seguridad. No es un service común: la reparación es gratuita y puede
          evitar un accidente.
        </p>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-navy">
          Cómo resolverlo, paso a paso
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ["01", "Consultá", "Ingresá patente, VIN o datos del vehículo."],
            [
              "02",
              "Entendé el riesgo",
              "Leé qué componente falla y la prioridad.",
            ],
            ["03", "Contactá", "Llamá a un concesionario oficial y coordiná."],
            ["04", "Repará gratis", "Guardá el estado para seguir tu avance."],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="rounded-xl border-2 border-ink bg-white p-5"
            >
              <span className="font-mono text-base font-bold text-red">
                {number}
              </span>
              <h3 className="mt-7 font-display font-bold text-navy">{title}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-navy p-7 text-white">
          <Icon name="alert" className="size-8 text-red-light" />
          <h2 className="mt-5 font-display text-2xl font-bold">
            Si el recall es crítico
          </h2>
          <ol className="mt-5 space-y-3 text-base text-white/80">
            <li className="flex gap-3">
              <strong className="text-white">1.</strong> Evitá usar el vehículo.
            </li>
            <li className="flex gap-3">
              <strong className="text-white">2.</strong> Contactá a la red
              oficial.
            </li>
            <li className="flex gap-3">
              <strong className="text-white">3.</strong> Aclarales el código de
              campaña.
            </li>
            <li className="flex gap-3">
              <strong className="text-white">4.</strong> Coordiná traslado
              seguro si corresponde.
            </li>
          </ol>
        </div>
        <div className="rounded-2xl border-2 border-ink bg-white p-7">
          <p className="text-sm font-bold uppercase tracking-widest text-red">
            Identificación
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy">
            Cómo encontrar el VIN
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Es un código único de 17 caracteres. No incluye las letras I, O ni Q
            para evitar confusiones.
          </p>
          <div className="mt-5 rounded-lg border-2 border-navy bg-bg px-4 py-3 text-center font-mono text-base font-bold tracking-widest text-navy">
            8AGF19U0BCR123456
          </div>
          <ul className="mt-5 space-y-2 text-base text-muted">
            <li>• En la cédula verde o azul.</li>
            <li>• En la base del parabrisas.</li>
            <li>• En el marco de la puerta del conductor.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-navy">
          Preguntas frecuentes
        </h2>
        <div className="mt-5 space-y-2">
          {faqs.map(([question, answer], index) => (
            <div
              key={question}
              className="overflow-hidden rounded-xl border-2 border-ink bg-white"
            >
              <button
                onClick={() => setOpen(open === index ? -1 : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-display text-base font-bold text-navy"
                aria-expanded={open === index}
              >
                {question}
                <Icon
                  name="arrow"
                  className={`size-4 shrink-0 transition ${
                    open === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              {open === index && (
                <p className="border-t border-border px-5 py-4 text-base leading-relaxed text-muted">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-red p-8 text-center text-white">
        <h2 className="font-display text-2xl font-bold">
          La consulta lleva menos de un minuto
        </h2>
        <p className="mt-2 text-base text-white/80">
          Es gratuita, no requiere registro y puede ayudarte a prevenir un
          riesgo.
        </p>
        <button
          onClick={onSearch}
          className="mt-6 cursor-pointer rounded-lg bg-white px-7 py-3 text-base font-bold text-red hover:bg-red-light"
        >
          Buscar mi vehículo
        </button>
      </section>
    </main>
  )
}

type BulkRow = { input: string; vehicle: AppVehicle | null }

function worstRisk(vehicle: AppVehicle): Risk | null {
  if (vehicle.recalls.some((r) => r.risk === "CRÍTICO")) return "CRÍTICO"
  if (vehicle.recalls.some((r) => r.risk === "ALTO")) return "ALTO"
  if (vehicle.recalls.some((r) => r.risk === "MEDIO")) return "MEDIO"
  return null
}

function ProScreen({
  onOpen,
  onNav,
  appointments,
  isLoggedIn,
}: {
  onOpen: (vehicle: AppVehicle) => void
  onNav: (screen: Screen) => void
  appointments: AppAppointment[]
  isLoggedIn: boolean
}) {
  const [text, setText] = useState("AB 123 CD\nAD 456 EF\nAA 000 AA")
  const [rows, setRows] = useState<BulkRow[] | null>(null)
  const [error, setError] = useState("")
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 200)

  const run = (event?: React.FormEvent) => {
    event?.preventDefault()
    if (lines.length === 0) {
      setError("Pegá al menos una patente o un VIN.")
      return
    }
    setError("")
    setRows(
      lines.map((input) => {
        const compact = input.replace(/[\s-]/g, "")
        const vehicle = isValidVin(compact)
          ? findVehicle({ mode: "vin", vin: compact })
          : findVehicle({ mode: "plate", plate: input })
        return { input, vehicle }
      }),
    )
  }

  const loadCsv = (file: File) => {
    file.text().then((content) => {
      const values = content
        .split(/[\r\n,;]+/)
        .map((value) => value.trim().replace(/^"|"$/g, ""))
        .filter((value) => value && !/patente|vin/i.test(value))
      setText(values.join("\n"))
    })
  }

  const exportCsv = () => {
    if (!rows) return
    const header = "patente_o_vin,vehiculo,campanas_pendientes,riesgo_maximo"
    const body = rows.map(({ input, vehicle }) =>
      [
        input,
        vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : "No encontrado",
        vehicle ? vehicle.recalls.length : "",
        vehicle ? (worstRisk(vehicle) ?? "Sin campañas") : "",
      ].join(","),
    )
    const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "avisar-consulta-masiva.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const found = rows?.filter((row) => row.vehicle) ?? []
  const counts = {
    high: found.filter((row) => worstRisk(row.vehicle!) === "CRÍTICO").length,
    mid: found.filter((row) => ["ALTO", "MEDIO"].includes(worstRisk(row.vehicle!) ?? "")).length,
    ok: found.filter((row) => !worstRisk(row.vehicle!)).length,
    missing: (rows?.length ?? 0) - found.length,
  }
  const upcoming = appointments
    .filter((appointment) => appointment.status === "Programado")
    .slice(0, 3)

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-extrabold sm:text-7xl">
          Revisá todo tu stock de una vez
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
          Pegá patentes o VIN, uno por línea, o subí un CSV. Te marcamos qué
          unidades tienen campañas abiertas antes de entregarlas o publicarlas.
        </p>
      </div>

      <section className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={run} className="card-signal flex flex-col gap-4 rounded-xl bg-white p-6">
          <label htmlFor="bulk-input" className="text-base font-bold">
            Patentes o VIN (uno por línea)
          </label>
          <textarea
            id="bulk-input"
            rows={8}
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-describedby="bulk-help"
            className="resize-y rounded-md p-3 font-mono text-lg uppercase leading-relaxed tracking-wide"
          />
          <p id="bulk-help" className="text-base text-muted">
            {lines.length} {lines.length === 1 ? "unidad" : "unidades"} · hasta 200 por consulta.
          </p>
          {error && (
            <p role="alert" className="flex items-center gap-2 text-base font-bold text-risk-high">
              <Icon name="alert" className="size-5" />
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="min-h-14 flex-[1_1_200px] cursor-pointer rounded-lg border-[3px] border-ink bg-signal font-display text-[26px] font-extrabold"
            >
              Consultar {lines.length} {lines.length === 1 ? "unidad" : "unidades"}
            </button>
            <label className="flex min-h-14 cursor-pointer items-center gap-2 rounded-lg border-[3px] border-ink bg-white px-4 text-base font-bold focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-ink">
              <Icon name="upload" className="size-5" />
              Subir CSV
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) loadCsv(file)
                }}
              />
            </label>
          </div>
        </form>

        <div className="flex min-w-0 flex-col gap-4">
          {!rows ? (
            <div className="rounded-xl border-2 border-dashed border-graphite bg-white p-8 text-center">
              <Icon name="building" className="mx-auto size-10" />
              <p className="mt-3 text-lg font-bold">Los resultados aparecen acá</p>
              <p className="mt-1 text-base text-muted">
                Probá con las patentes de ejemplo y tocá «Consultar».
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3" role="status" aria-live="polite">
                <span className="inline-flex min-h-11 items-center gap-2 rounded bg-risk-high px-3 text-base font-bold text-white">
                  <Icon name="alert" className="size-5" />
                  {counts.high} riesgo crítico
                </span>
                <span className="inline-flex min-h-11 items-center gap-2 rounded border-2 border-ink bg-risk-mid px-3 text-base font-bold text-ink">
                  <Icon name="wrench" className="size-5" />
                  {counts.mid} riesgo alto o medio
                </span>
                <span className="inline-flex min-h-11 items-center gap-2 rounded bg-ok px-3 text-base font-bold text-white">
                  <Icon name="check" className="size-5" />
                  {counts.ok} sin campañas
                </span>
                {counts.missing > 0 && (
                  <span className="inline-flex min-h-11 items-center rounded border-2 border-graphite bg-white px-3 text-base font-bold text-graphite">
                    {counts.missing} no encontradas
                  </span>
                )}
              </div>
              <div className="relative overflow-x-auto rounded-lg border-2 border-ink bg-white">
                <table className="w-full min-w-[640px] border-collapse text-base">
                  <caption className="px-4 py-3 text-left text-lg font-bold">
                    Resultado de la consulta
                  </caption>
                  <thead>
                    <tr className="bg-ink text-left text-white">
                      <th scope="col" className="px-4 py-3">Patente o VIN</th>
                      <th scope="col" className="px-4 py-3">Vehículo</th>
                      <th scope="col" className="px-4 py-3">Estado</th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Acción</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ input, vehicle }, index) => {
                      const risk = vehicle ? worstRisk(vehicle) : null
                      return (
                        <tr key={`${input}-${index}`} className="border-t border-line">
                          <td className="px-4 py-3 font-mono font-bold tracking-wide">{input}</td>
                          <td className="px-4 py-3">
                            {vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year} · ${BODY_LABEL[bodyTypeOf(vehicle.model)]}` : "No encontrado en la base demo"}
                          </td>
                          <td className="px-4 py-3">
                            {!vehicle ? (
                              <span className="text-muted">Sin datos</span>
                            ) : risk ? (
                              <span className={`inline-flex items-center gap-1.5 font-bold ${risk === "CRÍTICO" ? "text-risk-high" : "text-risk-mid-text"}`}>
                                <Icon name={risk === "CRÍTICO" ? "alert" : "wrench"} className="size-4" />
                                {riskLabel[risk]} · {vehicle.recalls.length} {vehicle.recalls.length === 1 ? "campaña" : "campañas"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-bold text-ok">
                                <Icon name="check" className="size-4" />
                                Sin campañas
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {vehicle && (
                              <button
                                onClick={() => onOpen(vehicle)}
                                className="min-h-11 cursor-pointer px-2 font-bold underline underline-offset-4"
                              >
                                {risk ? "Ver y dar turno" : "Ver informe"}
                                <span className="sr-only"> de {input}</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportCsv}
                  className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg bg-ink px-5 font-bold text-white"
                >
                  <Icon name="download" className="size-5" />
                  Exportar CSV
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="pro-appointments" className="flex flex-col gap-4">
        <h2 id="pro-appointments" className="font-display text-4xl font-extrabold">
          Próximos turnos de reparación
        </h2>
        {!isLoggedIn ? (
          <p className="text-lg text-muted">
            <button onClick={() => onNav("my-appointments")} className="min-h-11 cursor-pointer font-bold text-ink underline underline-offset-4">
              Ingresá
            </button>{" "}
            para ver los turnos de tu cuenta.
          </p>
        ) : upcoming.length === 0 ? (
          <p className="text-lg text-muted">No hay turnos programados.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {upcoming.map((appointment) => (
              <div key={appointment.id} className="flex flex-col gap-1.5 rounded-lg border-2 border-ink bg-white p-5">
                <p className="font-display text-3xl font-extrabold">
                  {formatAppointmentDate(appointment.date, true)} · {appointment.time}
                </p>
                <p className="font-mono font-bold">{appointment.plate}</p>
                <p className="text-base text-muted">{appointment.vehicle}</p>
                <p className="text-base text-muted">{dealerFor(appointment.dealerId)?.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function EmptyState({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: "car" | "bell" | "calendar"
  title: string
  text: string
  action: string
  onAction: () => void
}) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-bg text-navy">
        <Icon name={icon} className="size-6" />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted">
        {text}
      </p>
      <button
        onClick={onAction}
        className="mt-6 cursor-pointer rounded-lg bg-navy px-6 py-3 text-base font-bold text-white hover:bg-navy-mid"
      >
        {action}
      </button>
    </div>
  )
}

function LoginScreen({
  onLogin,
  onCancel,
}: {
  onLogin: (user: User) => void
  onCancel: () => void
}) {
  const [email, setEmail] = useState("usuario@avisar.com")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const authenticatedUser = authenticate(email, password)
    if (!authenticatedUser) {
      setError("El e-mail o la contraseña no son correctos.")
      return
    }
    onLogin({
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
    })
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-16">
      <section>
        <span className="flex size-12 items-center justify-center rounded-xl bg-navy text-white">
          <Icon name="shield" className="size-6" />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-red">
          Acceso seguro
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy">
          Tus vehículos, en un solo lugar
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          Ingresá para consultar el estado de tus vehículos, revisar tu
          historial y administrar tus alertas personales.
        </p>
        <div className="mt-7 space-y-3">
          {[
            ["car", "Seguimiento del estado de reparación"],
            ["clock", "Historial de consultas"],
            ["bell", "Alertas asociadas a tus vehículos"],
          ].map(([icon, text]) => (
            <div
              key={text}
              className="flex items-center gap-3 text-base font-semibold text-navy"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-white text-green">
                <Icon
                  name={icon as "car" | "clock" | "bell"}
                  className="size-4"
                />
              </span>
              {text}
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border-2 border-ink bg-white p-6 shadow-lg shadow-navy/5 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">
              Iniciar sesión
            </h2>
            <p className="mt-1 text-base text-muted">
              Usá la cuenta demo para acceder.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-lg p-2 text-muted hover:bg-bg hover:text-navy"
            aria-label="Cerrar inicio de sesión"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-7">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-navy">
              E-mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError("")
              }}
              autoComplete="username"
              className="w-full rounded-lg border border-border px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
          </label>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-navy">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError("")
              }}
              autoComplete="current-password"
              placeholder="Ingresá tu contraseña"
              className="w-full rounded-lg border border-border px-4 py-3 text-base outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
            />
          </label>
          {error && (
            <p
              role="alert"
              className="mt-3 flex items-center gap-2 text-sm font-bold text-red"
            >
              <Icon name="alert" className="size-4" />
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-signal py-3.5 text-base font-bold text-ink hover:bg-risk-mid"
          >
            <Icon name="user" className="size-4" />
            Ingresar
          </button>
        </form>
        <div className="mt-5 rounded-lg bg-bg p-4 text-sm leading-relaxed text-muted">
          <strong className="text-navy">Credenciales demo</strong>
          <br />
          usuario@avisar.com · segura123
          <br />
          Otras cuentas demo: gustavo@, carolina@, lucia@, jorge@, sofia@,
          nicolas@, valeria@ y martina@demo.avisar.com · demo1234
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          Simulación local: no se envían credenciales a ningún servidor.
        </p>
      </section>
    </main>
  )
}

function BackButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mb-7 flex cursor-pointer items-center gap-2 text-base font-semibold text-muted hover:text-navy"
    >
      <Icon name="arrow" className="size-4 rotate-180" />
      {label}
    </button>
  )
}

function Footer({ onNav }: { onNav: (screen: Screen) => void }) {
  return (
    <footer className="on-dark mt-12 bg-ink text-line print:hidden">
      <Hazard />
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-5 py-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-white">
            <Logo small />
          </p>
          <p className="mt-1 text-base">
            Prototipo educativo de seguridad vehicular. Campañas ficticias.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-base font-semibold">
          {(
            [
              ["Consultar", "home"],
              ["Guía de recalls", "education"],
              ["Mis alertas", "my-alerts"],
              ["Concesionarios y talleres", "pro"],
            ] as [string, Screen][]
          ).map(([label, target]) => (
            <button
              key={target}
              onClick={() => onNav(target)}
              className="min-h-11 cursor-pointer px-2 text-white underline underline-offset-4"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [user, setUser] = useStoredState<User | null>("avisar-session", null)
  const [intendedScreen, setIntendedScreen] = useState<Screen>("home")
  const [currentVehicle, setCurrentVehicle] = useState<AppVehicle | null>(null)
  const [currentRecall, setCurrentRecall] = useState<AppRecall | null>(null)
  const [selectedDealer, setSelectedDealer] = useState<AppDealer | null>(null)
  const [latestAppointmentId, setLatestAppointmentId] = useState("")
  const [reprogrammingId, setReprogrammingId] = useState("")
  const [queries, setQueries] = useState<AppVehicle[]>(() =>
    user?.id
      ? readStoredState(`avisar-queries-${user.id}`, queriesOf(user.id))
      : [],
  )
  const [alerts, setAlerts] = useState<AppAlert[]>(() =>
    user?.id
      ? readStoredState(`avisar-alerts-${user.id}`, alertsOf(user.id))
      : [],
  )
  const [repairStatuses, setRepairStatuses] = useState<
    Record<string, RepairStatus>
  >(() =>
    user?.id
      ? readStoredState(
          `avisar-repair-${user.id}`,
          repairStatusOf(user.id),
        )
      : {},
  )
  const [appointments, setAppointments] = useState<AppAppointment[]>(() =>
    user?.id
      ? readStoredState(
          `avisar-appointments-${user.id}`,
          appointmentsOf(user.id),
        )
      : [],
  )

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `avisar-queries-${user.id}`,
        JSON.stringify(queries),
      )
    }
  }, [queries, user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `avisar-alerts-${user.id}`,
        JSON.stringify(alerts),
      )
    }
  }, [alerts, user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `avisar-repair-${user.id}`,
        JSON.stringify(repairStatuses),
      )
    }
  }, [repairStatuses, user?.id])

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        `avisar-appointments-${user.id}`,
        JSON.stringify(appointments),
      )
    }
  }, [appointments, user?.id])

  const loadAccount = (userId: string) => {
    setQueries(
      readStoredState(`avisar-queries-${userId}`, queriesOf(userId)),
    )
    setAlerts(readStoredState(`avisar-alerts-${userId}`, alertsOf(userId)))
    setRepairStatuses(
      readStoredState(
        `avisar-repair-${userId}`,
        repairStatusOf(userId),
      ),
    )
    setAppointments(
      readStoredState(
        `avisar-appointments-${userId}`,
        appointmentsOf(userId),
      ),
    )
  }

  const protectedScreens: Screen[] = [
    "queries",
    "my-alerts",
    "subscribe",
    "dealers",
    "booking",
    "booking-ok",
    "my-appointments",
  ]
  const navigate = (next: Screen) => {
    if (protectedScreens.includes(next) && !user) {
      setIntendedScreen(next)
      setScreen("login")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setScreen(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const showResults = (vehicle: AppVehicle, save = true) => {
    setCurrentVehicle(vehicle)
    if (save && user) {
      setQueries(
        [
          vehicle,
          ...queries.filter(
            (item) =>
              item.plate.replace(/\s/g, "") !==
              vehicle.plate.replace(/\s/g, ""),
          ),
        ].slice(0, 8),
      )
    }
    navigate("results")
  }
  const scannerVehicle = findVehicle({ mode: "plate", plate: "AB 123 CD" })
  const currentAppointment =
    currentVehicle && currentRecall
      ? appointments.find(
          (appointment) =>
            appointment.plate === currentVehicle.plate &&
            appointment.recallId === currentRecall.id &&
            (appointment.status === "Programado" ||
              appointment.status === "Realizado"),
        )
      : undefined

  const reprogramAppointment = (appointment: AppAppointment) => {
    const vehicle = findVehicle({ mode: "plate", plate: appointment.plate })
    if (!vehicle) return
    const recall = vehicle.recalls.find((item) => item.id === appointment.recallId)
    const dealer = dealerFor(appointment.dealerId)
    if (!recall || !dealer) return
    setCurrentVehicle(vehicle)
    setCurrentRecall(recall)
    setSelectedDealer(dealer)
    setReprogrammingId(appointment.id)
    navigate("booking")
  }

  const cancelAppointment = (appointment: AppAppointment) => {
    setAppointments(
      appointments.map((item) =>
        item.id === appointment.id ? { ...item, status: "Cancelado" } : item,
      ),
    )
    const vehicle = findVehicle({ mode: "plate", plate: appointment.plate })
    if (vehicle) {
      setRepairStatuses({
        ...repairStatuses,
        [repairKey(vehicle.id, appointment.recallId)]: "Pendiente de revisión",
      })
    }
  }

  const completeAppointment = (appointment: AppAppointment) => {
    setAppointments(
      appointments.map((item) =>
        item.id === appointment.id ? { ...item, status: "Realizado" } : item,
      ),
    )
    const vehicle = findVehicle({ mode: "plate", plate: appointment.plate })
    if (vehicle) {
      setRepairStatuses({
        ...repairStatuses,
        [repairKey(vehicle.id, appointment.recallId)]: "Reparación realizada",
      })
    }
    setAlerts(
      alerts.map((alert) =>
        alert.plate === appointment.plate ? { ...alert, active: false } : alert,
      ),
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-bg text-ink">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <NavBar
        screen={screen}
        onNav={navigate}
        user={user}
        onLogin={() => {
          setIntendedScreen(screen === "login" ? "home" : screen)
          setScreen("login")
        }}
        onLogout={() => {
          setQueries([])
          setAlerts([])
          setRepairStatuses({})
          setAppointments([])
          setCurrentVehicle(null)
          setCurrentRecall(null)
          setSelectedDealer(null)
          setLatestAppointmentId("")
          setReprogrammingId("")
          setUser(null)
          if (protectedScreens.includes(screen)) setScreen("home")
        }}
      />
      <div id="contenido" tabIndex={-1} className="flex-1 outline-none">
        {screen === "pro" && (
          <ProScreen
            onOpen={(vehicle) => showResults(vehicle)}
            onNav={navigate}
            appointments={appointments}
            isLoggedIn={Boolean(user)}
          />
        )}
        {screen === "login" && (
          <LoginScreen
            onLogin={(loggedUser) => {
              loadAccount(loggedUser.id)
              setUser(loggedUser)
              setScreen(intendedScreen)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            onCancel={() => navigate("home")}
          />
        )}
        {screen === "home" && (
          <HomeScreen
            onSearch={showResults}
            onNav={navigate}
            isLoggedIn={Boolean(user)}
            vehicles={user ? vehiclesOf(user.id) : []}
          />
        )}
        {screen === "scanner" && (
          <ScannerScreen
            onBack={() => navigate("home")}
            onDetected={() => {
              if (scannerVehicle) showResults(scannerVehicle)
            }}
          />
        )}
        {screen === "results" && currentVehicle && (
          <ResultsScreen
            vehicle={currentVehicle}
            onNav={navigate}
            onDetail={(recall) => {
              setCurrentRecall(recall)
              navigate("detail")
            }}
            onBook={(recall) => {
              setCurrentRecall(recall)
              setSelectedDealer(null)
              setReprogrammingId("")
              navigate("dealers")
            }}
          />
        )}
        {screen === "detail" && currentVehicle && currentRecall && (
          <DetailScreen
            vehicle={currentVehicle}
            recall={currentRecall}
            onBack={() => navigate("results")}
            onSubscribe={() => navigate("subscribe")}
            isLoggedIn={Boolean(user)}
            onLogin={() => {
              setIntendedScreen("detail")
              setScreen("login")
            }}
            statuses={repairStatuses}
            onUpdateStatus={(key, status) =>
              setRepairStatuses({ ...repairStatuses, [key]: status })
            }
            appointment={currentAppointment}
            onBook={() => {
              setSelectedDealer(null)
              setReprogrammingId("")
              navigate("dealers")
            }}
            onViewAppointment={() => navigate("my-appointments")}
            onCompleteAppointment={() => {
              if (currentAppointment) completeAppointment(currentAppointment)
            }}
            onReprogramAppointment={() => {
              if (currentAppointment) reprogramAppointment(currentAppointment)
            }}
          />
        )}
        {screen === "queries" && (
          <QueriesScreen
            queries={queries}
            onRepeat={(vehicle) => showResults(vehicle, false)}
            onDelete={(id) =>
              setQueries(queries.filter((vehicle) => vehicle.id !== id))
            }
            onHome={() => navigate("home")}
            appointments={appointments}
            statuses={repairStatuses}
          />
        )}
        {screen === "subscribe" && (
          <SubscribeScreen
            vehicle={currentVehicle}
            onSave={(alert) => setAlerts([alert, ...alerts])}
            onAlerts={() => navigate("my-alerts")}
          />
        )}
        {screen === "my-alerts" && (
          <MyAlertsScreen
            alerts={alerts}
            onToggle={(id) =>
              setAlerts(
                alerts.map((alert) =>
                  alert.id === id ? { ...alert, active: !alert.active } : alert,
                ),
              )
            }
            onDelete={(id) =>
              setAlerts(alerts.filter((alert) => alert.id !== id))
            }
            onSubscribe={() => navigate("subscribe")}
          />
        )}
        {screen === "dealers" && currentVehicle && currentRecall && (
          <DealersScreen
            vehicle={currentVehicle}
            onBack={() => navigate("detail")}
            onChoose={(dealer) => {
              setSelectedDealer(dealer)
              navigate("booking")
            }}
          />
        )}
        {screen === "booking" &&
          currentVehicle &&
          currentRecall &&
          selectedDealer && (
            <BookingScreen
              key={`${selectedDealer.id}-${reprogrammingId}`}
              vehicle={currentVehicle}
              recall={currentRecall}
              dealer={selectedDealer}
              alerts={alerts}
              initialAppointment={appointments.find(
                (appointment) => appointment.id === reprogrammingId,
              )}
              onBack={() => navigate("dealers")}
              onConfirm={(date, time, channel, destination) => {
                if (!user) return
                const existing = appointments.find(
                  (appointment) => appointment.id === reprogrammingId,
                )
                const id = existing?.id ?? `APT-${Date.now()}`
                const appointment: AppAppointment = {
                  id,
                  code:
                    existing?.code ??
                    `TRN-${String(Date.now()).slice(-4)}`,
                  userId: user.id,
                  plate: currentVehicle.plate,
                  vehicle: `${currentVehicle.brand} ${currentVehicle.model} ${currentVehicle.version} ${currentVehicle.year}`,
                  recallId: currentRecall.id,
                  dealerId: selectedDealer.id,
                  date,
                  time,
                  reminderChannel: channel,
                  reminderDestination: destination,
                  reminderActive: true,
                  status: "Programado",
                }
                setAppointments(
                  existing
                    ? appointments.map((item) =>
                        item.id === existing.id ? appointment : item,
                      )
                    : [appointment, ...appointments],
                )
                setRepairStatuses({
                  ...repairStatuses,
                  [repairKey(currentVehicle.id, currentRecall.id)]:
                    "Reparación programada",
                })
                setLatestAppointmentId(id)
                setReprogrammingId("")
                navigate("booking-ok")
              }}
            />
          )}
        {screen === "booking-ok" &&
          currentVehicle &&
          currentRecall &&
          appointments.find(
            (appointment) => appointment.id === latestAppointmentId,
          ) && (
            <BookingOkScreen
              appointment={
                appointments.find(
                  (appointment) => appointment.id === latestAppointmentId,
                )!
              }
              vehicle={currentVehicle}
              recall={currentRecall}
              onToggleReminder={() =>
                setAppointments(
                  appointments.map((appointment) =>
                    appointment.id === latestAppointmentId
                      ? {
                          ...appointment,
                          reminderActive: !appointment.reminderActive,
                        }
                      : appointment,
                  ),
                )
              }
              onAppointments={() => navigate("my-appointments")}
            />
          )}
        {screen === "my-appointments" && (
          <MyAppointmentsScreen
            appointments={appointments}
            onReprogram={reprogramAppointment}
            onCancel={cancelAppointment}
            onComplete={completeAppointment}
            onHome={() => navigate("home")}
            onSimulate={(appointment) => {
              const date = new Date()
              date.setDate(date.getDate() - 1)
              const simulatedDate = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
              ].join("-")
              setAppointments(
                appointments.map((item) =>
                  item.id === appointment.id
                    ? { ...item, date: simulatedDate }
                    : item,
                ),
              )
            }}
          />
        )}
        {screen === "education" && (
          <EducationScreen onSearch={() => navigate("home")} />
        )}
      </div>
      <Footer onNav={navigate} />
    </div>
  )
}
