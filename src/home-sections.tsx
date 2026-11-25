import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import { CAMPAIGNS } from "./data/avisar-db"
import { CountUp, EASE_OUT, InView, LIGHT_LABEL, LightCluster, LightIcon, lightFor, type LightKind } from "./motion"

/* Secciones de la portada. Criterio: cada bloque muestra un fragmento de la UI real,
 * no un ícono genérico; profundidad con capas y sombras largas; AA en el estado final. */

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] ${dark ? "text-line" : "text-graphite"}`}>
      <span aria-hidden="true" className="h-1 w-8 bg-signal" />
      {children}
    </p>
  )
}

function SectionTitle({ children, dark = false, id }: { children: ReactNode; dark?: boolean; id?: string }) {
  return (
    <h2 id={id} className={`max-w-3xl font-display text-[44px] font-extrabold leading-[0.95] sm:text-6xl ${dark ? "text-white" : "text-ink"}`}>
      {children}
    </h2>
  )
}

/* ---------- Hero: vista previa flotante del resultado ---------- */

export function HeroPreview({ play }: { play: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      <motion.div
        className="absolute -right-24 -top-14 w-72 rotate-[7deg] overflow-hidden rounded-2xl bg-[#1B1D21] text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
        initial={play && !reduce ? { opacity: 0, x: 40 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: EASE_OUT }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="rounded bg-white px-2 py-0.5 font-mono text-sm font-bold tracking-[0.1em] text-ink">AD 456 EF</span>
          <span className="text-xs text-line">Resultado</span>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <p className="font-display text-2xl font-extrabold leading-none">Toyota Hilux 2021</p>
          <LightCluster mode="result" active={["airbag", "brake"]} label="Vista previa" delay={1.3} kinds={["engine", "brake", "airbag", "battery", "ok"]} />
          <div className="flex items-center gap-2 rounded-lg bg-risk-high px-3 py-2 font-display text-lg font-extrabold">
            <LightIcon kind="airbag" className="size-5" />2 campañas · crítico
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute -bottom-10 -left-14 w-56 -rotate-[5deg] rounded-xl bg-white p-3 text-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] ring-1 ring-ink/10"
        initial={play && !reduce ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.5, ease: EASE_OUT }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-graphite">Informe listo</p>
        <p className="mt-1 font-mono text-sm font-bold">AV-7K2Q-91X</p>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ok">
          <span className="flex size-5 items-center justify-center rounded-full bg-ok text-white">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7" /></svg>
          </span>
          Enviado por WhatsApp
        </p>
      </motion.div>
    </div>
  )
}

/* ---------- Bento de beneficios ---------- */

function BentoCell({ className = "", title, text, children }: { className?: string; title: string; text: string; children: ReactNode }) {
  return (
    <InView y={24} className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_0_rgba(17,18,20,0.04),0_24px_48px_-32px_rgba(17,18,20,0.35)] ring-1 ring-ink/10 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(17,18,20,0.5)] sm:p-7 ${className}`}>
      <div className="mb-6 flex min-h-32 flex-1 items-center justify-center rounded-xl bg-bg p-5">{children}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-1.5 text-base leading-relaxed text-muted">{text}</p>
    </InView>
  )
}

function MiniPlate({ old = false, text }: { old?: boolean; text: string }) {
  return (
    <div className={`overflow-hidden rounded-md border-2 ${old ? "border-[#3A3D42] bg-ink text-white" : "border-ink bg-white text-ink"}`}>
      <div className={`px-2 text-center text-[9px] font-bold tracking-[0.2em] ${old ? "text-line" : "bg-plate text-white"}`}>
        {old ? "ARGENTINA" : "REPÚBLICA ARGENTINA"}
      </div>
      <p className="px-3 py-1 text-center font-mono text-xl font-bold tracking-[0.1em]">{text}</p>
    </div>
  )
}

export function BenefitsBento() {
  return (
    <section aria-labelledby="bento-title" className="mx-auto max-w-6xl px-5 py-16 lg:py-28">
      <Eyebrow>Qué te llevás</Eyebrow>
      <SectionTitle id="bento-title">Todo lo que tenés que saber antes de cerrar trato</SectionTitle>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        <BentoCell
          className="lg:col-span-4"
          title="El riesgo, de un vistazo"
          text="Los testigos del tablero se encienden según los sistemas afectados, con el nivel de riesgo explicado sin tecnicismos."
        >
          <div className="flex w-full max-w-md flex-col gap-3 rounded-xl bg-ink p-4 text-white">
            <LightCluster mode="result" active={["engine", "airbag"]} label="Ejemplo de testigos" kinds={["engine", "brake", "airbag", "battery", "steering", "ok"]} />
            <div className="flex items-center gap-2 rounded-lg bg-risk-high px-3 py-2 font-display text-xl font-extrabold">
              <LightIcon kind="engine" className="size-5" />
              Bomba de combustible · crítico
            </div>
          </div>
        </BentoCell>
        <BentoCell className="lg:col-span-2" title="Patente nueva o vieja" text="Detecta el formato mientras escribís y adapta la chapa.">
          <div className="flex flex-col items-center gap-3">
            <MiniPlate text="AB 123 CD" />
            <MiniPlate old text="ABC 123" />
          </div>
        </BentoCell>
        <BentoCell className="lg:col-span-2" title="Reparación gratis" text="Pedí turno en un concesionario oficial sin pagar nada.">
          <div className="w-full max-w-56 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10">
            <p className="text-sm font-semibold text-graphite">Concesionario oficial</p>
            <p className="font-display text-2xl font-extrabold">Jue 12 · 9:30</p>
            <p className="mt-2 rounded-md bg-signal px-3 py-1.5 text-center font-display text-lg font-extrabold">Pedir turno gratis</p>
          </div>
        </BentoCell>
        <BentoCell className="lg:col-span-2" title="Informe verificable" text="Con código único para mostrarle al vendedor o al comprador.">
          <div className="w-full max-w-56 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/10">
            <p className="bg-ink px-3 py-2 font-display text-lg font-extrabold text-white">
              AVIS<span className="bg-signal px-0.5 text-ink">AR</span> · Informe
            </p>
            <div className="p-3">
              <p className="font-mono font-bold tracking-wide">AD 456 EF</p>
              <p className="mt-1 text-sm text-muted">
                Código <span className="font-mono font-semibold text-ink">AV-7K2Q-91X</span>
              </p>
            </div>
          </div>
        </BentoCell>
        <BentoCell className="lg:col-span-2" title="Alertas de nuevas campañas" text="Te avisamos si el fabricante llama a revisión tu modelo.">
          <div className="flex w-full max-w-56 items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10">
            <span className="flex items-center gap-2 text-base font-semibold">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9M10 20a2 2 0 0 0 4 0" />
              </svg>
              Avisame
            </span>
            <span className="relative h-7 w-12 rounded-full bg-ok">
              <span className="absolute right-1 top-1 size-5 rounded-full bg-white" />
            </span>
          </div>
        </BentoCell>
      </div>
    </section>
  )
}

/* ---------- Fallas más comunes (datos reales de la base demo) ---------- */

export function CommonFaults() {
  const counts = new Map<LightKind, number>()
  for (const campaign of CAMPAIGNS) {
    const kind = lightFor(campaign.component)
    counts.set(kind, (counts.get(kind) ?? 0) + 1)
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  return (
    <section aria-labelledby="faults-title" className="on-dark relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_60%_at_100%_0%,rgba(255,200,0,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 lg:py-28">
        <Eyebrow dark>Lo que más se repara</Eyebrow>
        <SectionTitle dark id="faults-title">
          Las fallas que más llaman a revisión
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-lg text-line">
          Sobre las {CAMPAIGNS.length} campañas de la base de demostración, agrupadas por el sistema del auto que afectan.
        </p>
        <div role="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(([kind, count], index) => (
            <InView key={kind} delay={index * 0.05} y={20} className="h-full">
              <div role="listitem" className="flex h-full items-center gap-5 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
                <span className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-black/40 ring-1 ring-white/10 ${kind === "airbag" || kind === "brake" ? "text-[#FF5A4E]" : "text-risk-mid"}`}>
                  <LightIcon kind={kind} className="size-8" />
                </span>
                <div>
                  <p className="font-display text-5xl font-extrabold leading-none text-signal">
                    <CountUp value={count} />
                  </p>
                  <p className="mt-1 text-base text-line">{LIGHT_LABEL[kind]}</p>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Bloque para concesionarios y talleres ---------- */

export function ProBand({ onPro }: { onPro: () => void }) {
  const rows: [string, string, "high" | "mid" | "ok"][] = [
    ["AB 123 CD", "Crítico · 3 campañas", "high"],
    ["AD 456 EF", "Alto · 1 campaña", "mid"],
    ["AA 000 AA", "Sin campañas", "ok"],
  ]
  return (
    <section aria-labelledby="pro-band-title" className="bg-signal text-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <Eyebrow>Para concesionarios y talleres</Eyebrow>
          <SectionTitle id="pro-band-title">Revisá todo tu stock en una sola consulta</SectionTitle>
          <ul className="mt-6 flex flex-col gap-3 text-lg font-semibold">
            {["Hasta 200 patentes o VIN por vez", "Subí un CSV y exportá el resultado", "Turnos de reparación en un solo lugar"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-ink text-signal">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onPro}
            className="mt-8 inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-[10px] bg-ink px-6 font-display text-2xl font-extrabold text-white"
          >
            Probar la consulta masiva
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <InView y={28}>
          <div aria-hidden="true" className="rotate-[1.5deg] overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgba(17,18,20,0.6)] ring-1 ring-ink/10">
            <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
              <span className="font-display text-xl font-extrabold">Consulta masiva</span>
              <span className="text-sm text-line">3 unidades</span>
            </div>
            <div className="divide-y divide-line">
              {rows.map(([plate, status, tone]) => (
                <div key={plate} className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="font-mono text-lg font-bold tracking-wide">{plate}</span>
                  <span
                    className={`rounded-md px-2.5 py-1 text-sm font-bold ${
                      tone === "high" ? "bg-risk-high text-white" : tone === "mid" ? "bg-risk-mid text-ink" : "bg-ok text-white"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </section>
  )
}

/* ---------- Preguntas frecuentes ---------- */

const FAQ: [string, string][] = [
  ["¿Qué es un recall?", "Es una campaña en la que el fabricante llama a revisión un modelo porque detectó una falla de seguridad. La reparación la hace un concesionario oficial."],
  ["¿Cuánto cuesta la reparación?", "Nada. Las reparaciones de una campaña de seguridad son gratuitas, aunque el auto ya no tenga garantía o sea usado."],
  ["¿Sirve con la patente vieja?", "Sí. Podés buscar con la patente Mercosur (AB 123 CD), con la anterior (ABC 123), con el VIN o por marca, modelo y año."],
  ["¿De dónde salen los datos?", "Este prototipo usa modelos reales del parque automotor y campañas de demostración. No reemplaza la verificación oficial del fabricante."],
  ["¿Qué hago si el auto tiene una campaña pendiente?", "Pedile al vendedor que la repare antes de cerrar o pedí turno vos en un concesionario oficial. El informe te sirve para mostrar el estado."],
]

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
      <div>
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <SectionTitle id="faq-title">Lo que más nos preguntan</SectionTitle>
      </div>
      <div className="flex flex-col gap-3">
        {FAQ.map(([question, answer]) => (
          <details key={question} className="group rounded-2xl bg-white ring-1 ring-ink/10 open:shadow-[0_24px_48px_-32px_rgba(17,18,20,0.4)]">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
              {question}
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg transition-transform duration-200 group-open:rotate-45">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </summary>
            <p className="px-6 pb-6 text-base leading-relaxed text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ---------- CTA final ---------- */

export function FinalCta() {
  const reduce = useReducedMotion()
  return (
    <section aria-labelledby="final-cta-title" className="px-5 pb-16 lg:pb-24">
      <div className="on-dark relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12 lg:py-20">
        <div aria-hidden="true" className="hazard absolute inset-x-0 top-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_80%_at_50%_120%,rgba(255,200,0,0.22),transparent_70%)]" />
        <h2 id="final-cta-title" className="relative font-display text-5xl font-extrabold leading-[0.95] sm:text-7xl">
          Consultá antes de firmar
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-line">Toma segundos, es gratis y te puede ahorrar un susto en la ruta.</p>
        <button
          type="button"
          onClick={() => {
            document.getElementById("search-title")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
            window.setTimeout(() => document.getElementById("plate-input")?.focus({ preventScroll: true }), reduce ? 0 : 450)
          }}
          className="relative mt-8 inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-[10px] border-[3px] border-ink bg-signal px-7 font-display text-[28px] font-extrabold text-ink"
        >
          Consultar una patente
        </button>
      </div>
    </section>
  )
}
