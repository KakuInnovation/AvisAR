import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

/*
 * Piezas de movimiento de la dirección «Señal vial» (ver .claude/skills/signal-motion).
 * Todas respetan useReducedMotion(): con movimiento reducido muestran el estado final
 * o solo un fundido de opacidad.
 */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const SPRING_SOFT = { type: "spring", duration: 0.9, bounce: 0.15 } as const
export const SPRING_POP = { type: "spring", duration: 0.6, bounce: 0.2 } as const

/** La animación de entrada de la portada se reproduce una vez por sesión. */
const introCache: Record<string, boolean> = {}
export function useIntroOnce(key: string) {
  const [play] = useState(() => {
    if (key in introCache) return introCache[key]
    let result = true
    try {
      if (sessionStorage.getItem(key)) result = false
      else sessionStorage.setItem(key, "1")
    } catch {
      /* sin sessionStorage: se reproduce */
    }
    introCache[key] = result
    return result
  })
  useEffect(() => {
    introCache[key] = false
  }, [key])
  return play
}

/* ---------- Testigos de tablero ---------- */

export type LightKind = "engine" | "brake" | "airbag" | "battery" | "steering" | "warning"

export const LIGHT_LABEL: Record<LightKind, string> = {
  engine: "Motor y combustible",
  brake: "Frenos",
  airbag: "Airbag y cinturones",
  battery: "Sistema eléctrico",
  steering: "Dirección y suspensión",
  warning: "Otros componentes",
}

export const LIGHT_ORDER: LightKind[] = ["engine", "brake", "airbag", "battery", "steering", "warning"]

export function lightFor(component: string): LightKind {
  const c = component.toLowerCase()
  if (/airbag|cintur|pretensor|ocupaci/.test(c)) return "airbag"
  if (/fren/.test(c)) return "brake"
  if (/bater|eléctr|electr|cargador|arnés|conector|faro/.test(c)) return "battery"
  if (/direcci|brazo|rueda|tuerca|cremallera/.test(c)) return "steering"
  if (/motor del limp/.test(c)) return "warning"
  if (/motor|combust|distribuci|bomba/.test(c)) return "engine"
  return "warning"
}

export function LightIcon({ kind, className = "size-7" }: { kind: LightKind | "ok"; className?: string }) {
  const paths: Record<LightKind | "ok", ReactNode> = {
    engine: (
      <>
        <path d="M3 10v5M3 12.5h2M5 9h2.5l1.5-2h5l1.5 2H18v2h2.5v4H18v2h-2.5L14 19H8l-3-3V9Z" />
        <path d="M9 4.5h5M11.5 4.5V7" />
      </>
    ),
    brake: (
      <>
        <circle cx="12" cy="12" r="6" />
        <path d="M4.5 6.5a9 9 0 0 0 0 11M19.5 6.5a9 9 0 0 1 0 11M12 9v3.5M12 15h.01" />
      </>
    ),
    airbag: (
      <>
        <circle cx="8" cy="5" r="2" />
        <path d="M7 9l1.5 6H13l2 5M6 13l-1 4h4" />
        <path d="M14 8.5a4 4 0 1 1 3.5 6.5" />
      </>
    ),
    battery: (
      <>
        <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
        <path d="M6.5 7.5V5h3v2.5M14.5 7.5V5h3v2.5M6.5 13.5h3M15.5 13.5h3M17 12v3" />
      </>
    ),
    steering: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M3.5 11h6.5M14 11h6.5M12 14v6.5" />
      </>
    ),
    warning: (
      <>
        <path d="M12 3.5 2.5 20h19L12 3.5Z" />
        <path d="M12 10v4.5M12 17.5h.01" />
      </>
    ),
    ok: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8 12.5 3 3 5-6" />
      </>
    ),
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

const LIGHT_ON: Record<LightKind | "ok", string> = {
  engine: "#FFB020",
  brake: "#FF5A4E",
  airbag: "#FF5A4E",
  battery: "#FFB020",
  steering: "#FFB020",
  warning: "#FFB020",
  ok: "#3DDC84",
}

/**
 * Cuadro de testigos sobre fondo oscuro.
 * - mode "sweep": se encienden en secuencia, una sola pasada (carga).
 * - mode "result": chequeo de encendido (todos ~150ms, una vez) y quedan los activos.
 * Solo se anima la opacidad de la capa encendida.
 */
export function LightCluster({
  mode,
  active = [],
  ok = false,
  label,
  kinds = [...LIGHT_ORDER, "ok"],
  delay = 0,
}: {
  mode: "sweep" | "result"
  active?: LightKind[]
  ok?: boolean
  label: string
  kinds?: (LightKind | "ok")[]
  delay?: number
}) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<"check" | "final">(reduce || mode === "sweep" ? "final" : "check")
  useEffect(() => {
    if (mode !== "result" || reduce) return
    const t = window.setTimeout(() => setPhase("final"), (delay + 0.12 + kinds.length * 0.025 + 0.15) * 1000)
    return () => window.clearTimeout(t)
  }, [mode, reduce, delay, kinds.length])

  return (
    <ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-label={label}>
      {kinds.map((kind, index) => {
        const finalOn = mode === "sweep" ? true : kind === "ok" ? ok : active.includes(kind)
        const on = mode === "result" && phase === "check" ? true : finalOn
        const name = kind === "ok" ? "Sin campañas" : LIGHT_LABEL[kind]
        return (
          <li
            key={kind}
            className="relative flex size-10 items-center justify-center rounded-lg border-2 border-white/15 bg-black/40 sm:size-12"
            title={name}
          >
            <span className="text-white/25">
              <LightIcon kind={kind} />
            </span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: LIGHT_ON[kind] }}
              initial={reduce ? { opacity: finalOn ? 1 : 0 } : { opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : mode === "sweep"
                    ? { delay: index * 0.12, duration: 0.12 }
                    : { delay: phase === "check" ? delay + 0.12 + index * 0.025 : 0, duration: 0.12 }
              }
            >
              <LightIcon kind={kind} />
            </motion.span>
            <span className="sr-only">
              {name}: {finalOn ? "encendido" : "apagado"}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Entrada corta: sube y aparece. Con movimiento reducido, solo opacidad. */
export function Rise({
  children,
  delay = 0,
  y = 24,
  duration = 0.26,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  as?: "div" | "section" | "article" | "li" | "aside"
} & Record<string, unknown>) {
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : delay, duration: reduce ? 0.2 : duration, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ---------- Portada ---------- */

/** Ruta en perspectiva con líneas de carril que se pintan hacia el horizonte. */
export function HeroRoad({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const animateIn = play && !reduce
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden [perspective:560px]">
      <div className="absolute inset-x-[-40%] bottom-[-10%] top-0 origin-bottom bg-[#1B1D21] [transform:rotateX(56deg)]">
        {["left-[18%]", "right-[18%]"].map((side) => (
          <motion.div
            key={side}
            className={`absolute inset-y-0 ${side} w-[6px] origin-bottom bg-signal`}
            initial={animateIn ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />
        ))}
        <div className="absolute inset-y-0 left-1/2 flex w-[10px] -translate-x-1/2 flex-col-reverse justify-between py-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.span
              key={i}
              className="block h-[9%] w-full origin-bottom bg-white/80"
              initial={animateIn ? { scaleY: 0 } : false}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.08 * i, duration: 0.6, ease: EASE_OUT }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
    </div>
  )
}

/** SUV que entra por la ruta, frena y prende las balizas dos veces. */
export function HeroCar({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  const animateIn = play && !reduce
  const wheel = {
    initial: animateIn ? { rotate: -720 } : false,
    animate: { rotate: 0 },
    transition: { ...SPRING_SOFT, delay: 0.2 },
  } as const
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none w-[min(440px,80vw)] text-white drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
      initial={animateIn ? { x: "-120vw" } : false}
      animate={{ x: 0 }}
      transition={{ ...SPRING_SOFT, delay: 0.2 }}
    >
      <svg viewBox="0 0 200 80" className="w-full">
        <path fill="#F3F2EE" d="M10 60V41q0-7 8-8l22-2 16-19q2-2 8-2h86q8 0 12 6l14 14 10 2q6 2 6 10v18z" />
        <path fill="#111214" d="M60 15h34v16H48zM100 15h40q5 0 8 4l9 12h-57z" opacity="0.85" />
        {[50, 154].map((cx) => (
          <motion.g key={cx} style={{ originX: `${cx}px`, originY: "61px" }} {...wheel}>
            <circle cx={cx} cy="61" r="14" fill="#111214" stroke="#F3F2EE" strokeWidth="4" />
            <path d={`M${cx - 8} 61h16M${cx} 53v16`} stroke="#4A4F57" strokeWidth="3" />
          </motion.g>
        ))}
        {[
          { x: 186, y: 44 },
          { x: 13, y: 44 },
        ].map((p) => (
          <motion.rect
            key={p.x}
            x={p.x - 3}
            y={p.y}
            width="7"
            height="6"
            rx="2"
            fill="#FFB020"
            initial={animateIn ? { opacity: 0.2 } : false}
            animate={animateIn ? { opacity: [0.2, 1, 0.2, 1, 0.2, 1] } : { opacity: 1 }}
            transition={{ delay: 1.05, duration: 1.25, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          />
        ))}
      </svg>
    </motion.div>
  )
}

/** Título que aparece palabra por palabra (clip + subida). */
export function WordReveal({ text, play, delay = 0.38, className }: { text: string; play: boolean; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(" ")
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={play ? (reduce ? { opacity: 0 } : { y: "105%" }) : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: delay + i * 0.06, duration: reduce ? 0.2 : 0.45, ease: EASE_OUT }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  )
}

/** Cifra que cuenta una vez al entrar en pantalla. El valor real queda para lectores. */
export function CountUp({ value, prefix = "", className }: { value: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setShown(value)
      return
    }
    const controls = animate(0, value, { duration: 0.9, ease: EASE_OUT, onUpdate: (v) => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, value])
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {value}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {shown}
      </span>
    </span>
  )
}

/** Entrada al verse en pantalla (una vez). */
export function InView({ children, delay = 0, y = 32, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ delay, duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Scroll narrativo «Cómo funciona» ---------- */

const STEPS = [
  ["Ingresás la patente", "O el VIN que figura en la cédula y en el parabrisas."],
  ["Ves el estado del auto", "Campañas pendientes o reparadas, con el riesgo explicado sin tecnicismos."],
  ["Compartís el informe", "Por WhatsApp o en PDF, para negociar con datos o pedir la reparación antes de cerrar."],
] as const

function Diamond({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={`flex size-12 shrink-0 rotate-45 items-center justify-center border-[3px] border-ink transition-colors duration-200 ${active ? "bg-signal" : "bg-white"}`}
      aria-hidden="true"
    >
      <span className="-rotate-45 font-display text-2xl font-extrabold">{n}</span>
    </span>
  )
}

function StoryScreen({ step, typed }: { step: number; typed: string }) {
  return (
    <div className="card-signal relative h-[420px] w-full max-w-[460px] overflow-hidden rounded-xl bg-white p-6">
      <motion.div animate={{ opacity: step === 0 ? 1 : 0, y: step === 0 ? 0 : -24 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="absolute inset-6">
        <p className="mb-2 text-base font-bold">Patente del vehículo</p>
        <div className="overflow-hidden rounded-lg border-[3px] border-ink">
          <div className="bg-plate py-1 text-center text-[13px] font-bold tracking-[0.22em] text-white">REPÚBLICA ARGENTINA</div>
          <p className="py-4 text-center font-mono text-4xl font-bold tracking-[0.12em]">
            {typed}
            <span className="ml-0.5 inline-block h-9 w-1 translate-y-1 bg-ink" />
          </p>
        </div>
        <div className="mt-5 rounded-lg border-[3px] border-ink bg-signal py-3 text-center font-display text-2xl font-extrabold">Consultar</div>
      </motion.div>
      <motion.div animate={{ opacity: step === 1 ? 1 : 0, y: step === 1 ? 0 : step < 1 ? 24 : -24 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="absolute inset-6 flex flex-col gap-3">
        <div className="rounded-lg bg-ink p-4 text-white">
          <p className="font-mono text-xl font-bold tracking-[0.12em]">AB 123 CD</p>
          <p className="font-display text-3xl font-extrabold">Volkswagen Gol 2019</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-risk-high p-4 text-white">
          <LightIcon kind="engine" className="size-8" />
          <p className="font-display text-2xl font-extrabold">1 campaña crítica</p>
        </div>
        <div className="rounded-lg border-2 border-ink p-3 text-base">Bomba de combustible · reparación gratis</div>
      </motion.div>
      <motion.div animate={{ opacity: step === 2 ? 1 : 0, y: step === 2 ? 0 : 24 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="absolute inset-6 flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={step === 2 ? { x: [0, 0, 120], y: [0, 0, -120], scale: [1, 1, 0.4], opacity: [1, 1, 0] } : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, times: [0, 0.5, 1], ease: EASE_OUT }}
          className="w-56 rounded-lg border-[3px] border-ink bg-white shadow-[6px_6px_0_#FFC800]"
        >
          <div className="bg-ink px-3 py-2 font-display text-lg font-extrabold text-white">AVISAR · INFORME</div>
          <p className="px-3 py-2 font-mono font-bold">AB 123 CD</p>
        </motion.div>
        <motion.p
          className="absolute bottom-10 font-display text-2xl font-extrabold"
          animate={{ opacity: step === 2 ? 1 : 0 }}
          transition={{ delay: step === 2 ? 1.2 : 0, duration: 0.25 }}
        >
          Informe enviado
        </motion.p>
        <span className="flex size-14 items-center justify-center rounded-full bg-[#146C36] text-white">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20Z" />
          </svg>
        </span>
      </motion.div>
    </div>
  )
}

export function ScrollStory() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [step, setStep] = useState(0)
  const [typed, setTyped] = useState("")
  const plate = "AB 123 CD"
  const typedCount = useTransform(scrollYProgress, [0.02, 0.28], [0, plate.length])
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(v < 0.36 ? 0 : v < 0.7 ? 1 : 2))
  useMotionValueEvent(typedCount, "change", (v) => setTyped(plate.slice(0, Math.round(v))))

  const list = (
    <ol className="flex flex-col gap-6">
      {STEPS.map(([title, text], i) => (
        <li key={title} className={`flex gap-5 border-l-4 pl-4 transition-colors duration-200 ${reduce || step === i ? "border-signal" : "border-transparent"}`}>
          <Diamond n={i + 1} active={reduce || step === i} />
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="mt-1 max-w-sm text-lg leading-relaxed text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )

  return (
    <section aria-labelledby="how-title" className="bg-bg">
      {/* Desktop: sección fija narrada por el scroll */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: reduce ? "auto" : "260vh" }}>
        <div className={`${reduce ? "" : "sticky top-0 h-[100svh]"} mx-auto flex max-w-6xl items-center gap-16 px-5 py-16`}>
          <div className="flex-1">
            <h2 id="how-title" className="mb-10 font-display text-6xl font-extrabold">
              Cómo funciona
            </h2>
            {list}
          </div>
          <div className="flex flex-1 justify-center">
            <StoryScreen step={reduce ? 1 : step} typed={reduce ? plate : typed} />
          </div>
        </div>
      </div>
      {/* Celular: tarjetas que entran al verse */}
      <div className="mx-auto max-w-6xl px-5 py-14 lg:hidden">
        <h2 className="mb-7 font-display text-5xl font-extrabold">Cómo funciona</h2>
        <ol className="flex flex-col gap-5">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <InView delay={i * 0.06} className="flex flex-col gap-3 rounded-lg border-2 border-ink bg-white p-6">
                <Diamond n={i + 1} active />
                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                <p className="text-base leading-relaxed text-muted">{text}</p>
              </InView>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Informe que sale de la impresora ---------- */

export function PrintIn({ children, delay = 0.35 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(0px -16px 100% 0px)" }}
      animate={reduce ? { opacity: 1 } : { clipPath: "inset(0px -16px -16px 0px)" }}
      transition={{ delay, duration: reduce ? 0.2 : 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/** Check que se dibuja (confirmaciones). */
export function DrawCheck({ className = "size-5" }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <motion.path d="m5 12.5 4.5 4.5L19 7" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: EASE_OUT }} />
    </svg>
  )
}
