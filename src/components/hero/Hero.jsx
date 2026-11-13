import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../Button.jsx'
import Icon from '../Icons.jsx'
import Globe from '../globe/Globe.jsx'
import Heading3D from '../fx/Heading3D.jsx'
import { SCENES } from './HeroScenes.jsx'
import { useLiteMode, useReducedMotion } from '../../lib/hooks.js'
import { company } from '../../config/site.js'

const WORLD = SCENES.length // globe zooms out
const ROUTES = WORLD + 1 // routes draw from India
const FINAL = WORLD + 2
const STEPS = [...SCENES.map((s) => s.label), 'World']
const ease = [0.22, 1, 0.36, 1]

function seenIntro() {
  try {
    return sessionStorage.getItem('sampatkari-intro') === '1'
  } catch {
    return false
  }
}

export default function Hero() {
  const reduce = useReducedMotion()
  const lite = useLiteMode()
  const [phase, setPhase] = useState(() => (seenIntro() ? FINAL : 0))
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduce) setPhase(FINAL)
  }, [reduce])

  useEffect(() => {
    if (phase >= FINAL) {
      try {
        sessionStorage.setItem('sampatkari-intro', '1')
      } catch {}
      return
    }
    const ms = phase < WORLD ? SCENES[phase].ms : phase === WORLD ? 1100 : 900
    const t = setTimeout(() => setPhase((p) => p + 1), ms)
    return () => clearTimeout(t)
  }, [phase, run])

  const replay = () => {
    setPhase(0)
    setRun((r) => r + 1)
  }

  const intro = phase < FINAL
  const Scene = phase < WORLD ? SCENES[phase].Comp : null
  const step = Math.min(phase, STEPS.length - 1)

  return (
    <section id="home" className="relative isolate flex min-h-svh items-center overflow-hidden bg-paper pt-20 pb-14 text-ink lg:pt-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_45%,var(--color-glow)_0%,transparent_60%),radial-gradient(40%_50%_at_10%_100%,color-mix(in_oklab,var(--color-gold)_16%,transparent)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(var(--color-brand)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-6">
        {/* Copy column: the intro rail and the final text share one grid cell. */}
        <div className="order-2 grid lg:order-1">
          <motion.div
            className="[grid-area:1/1]"
            initial={false}
            animate={intro ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            aria-hidden={intro || undefined}
            style={{ pointerEvents: intro ? 'none' : 'auto' }}
          >
            <p className="mb-6 flex items-center gap-3 text-sm text-slate">
              <span className="h-px w-10 bg-gold" />
              {company.name}
            </p>
            <Heading3D as="h1" play={!intro} delay={0.15} text={'We export\nyour need.'} className="display text-[clamp(3rem,1.4rem+5vw,5.6rem)]" />
            <p className="mt-7 max-w-xl text-lg font-medium text-ink/90 sm:text-xl">Premium Agricultural &amp; Food Products from India to the World.</p>
            <p className="lede mt-4 text-slate">
              Sampatkari Agro Private Limited connects global buyers with carefully sourced agricultural products from India, delivering quality, reliability and
              consistency across international markets.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#products">Explore Products</Button>
              <Button href="#requirement" variant="outline">
                Become a Buyer
              </Button>
              <a href="#quote" className="group ml-1 inline-flex min-h-12 items-center gap-2 px-2 text-[0.95rem] font-semibold text-brand hover:text-brand-2">
                Request a Quote
                <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          <AnimatePresence>
            {intro && (
              <motion.div
                key="rail"
                className="flex flex-col justify-center [grid-area:1/1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.5 } }}
              >
                <p className="text-sm text-slate">{company.supportingTagline}</p>
                <ol className="mt-6 space-y-1.5" aria-label="Export journey">
                  {STEPS.map((label, i) => (
                    <li
                      key={label}
                      className={`flex items-baseline gap-4 transition-all duration-500 ${i === step ? 'text-ink' : i < step ? 'text-ink/35' : 'text-ink/15'}`}
                    >
                      <span className="w-6 text-xs tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`font-semibold tracking-tight transition-all duration-500 ${i === step ? 'text-4xl sm:text-5xl' : 'text-xl sm:text-2xl'}`}>{label}</span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => setPhase(FINAL)}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-brand/25 px-4 py-2 text-sm text-ink/80 hover:border-brand hover:text-ink"
                >
                  Skip intro <Icon name="chevron" className="size-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stage: a circular lens that travels farm → ship, then becomes the Earth. */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <div className="relative aspect-square w-[min(84vw,24rem)] sm:w-[min(80vw,30rem)] lg:w-[min(46vw,78svh,44rem)]">
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: phase >= WORLD ? 1 : 0,
                // Starts as the lens circle, then opens up as the camera pulls back from the Earth.
                clipPath: phase >= WORLD ? 'circle(71% at 50% 50%)' : 'circle(37.3% at 50% 50%)',
              }}
              transition={{ opacity: { duration: 0.8 }, clipPath: { duration: 0.8, delay: phase >= WORLD ? 0.85 : 0, ease } }}
            >
              <Globe zoomed={phase >= WORLD} routes={phase >= ROUTES} className="size-full" />
            </motion.div>
            <div className="pointer-events-none absolute inset-[12.7%] overflow-hidden rounded-full" aria-hidden="true">
              <AnimatePresence initial={false}>
                {Scene && (
                  <motion.div
                    key={`${run}-${phase}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.25 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <Scene />
                  </motion.div>
                )}
              </AnimatePresence>
              {intro && <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(11,36,22,0.9)]" />}
            </div>
            {intro && <div className="pointer-events-none absolute inset-[12.7%] rounded-full ring-1 ring-brand/20" aria-hidden="true" />}
          </div>

          <motion.div
            className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-slate"
            initial={false}
            animate={{ opacity: intro ? 0 : 1 }}
            transition={{ duration: 0.8, delay: intro ? 0 : 0.3 }}
          >
            <span className="text-ink/85">Premium Products from India. Global Possibilities.</span>
            <span className="hidden sm:inline">{lite ? 'Tap a destination' : 'Drag to turn · hover a destination'}</span>
            {!intro && !reduce && (
              <button type="button" onClick={replay} className="inline-flex items-center gap-1.5 text-brand hover:text-brand-2">
                <Icon name="replay" className="size-4" /> Replay journey
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-ink/50 hover:text-ink lg:flex"
      >
        <span className="h-10 w-px bg-gradient-to-b from-transparent to-brand/60" />
      </a>
    </section>
  )
}
