import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { products } from '../data/products.js'
import { useMedia, useOnScreen, useReducedMotion } from '../lib/hooks.js'
import { useQuote } from '../lib/quote.jsx'
import ProductArt from './ProductArt.jsx'
import Button from './Button.jsx'
import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'

const N = products.length
const STEP = 360 / N
const mod = (n) => ((n % N) + N) % N

export default function Carousel() {
  const { requestQuote } = useQuote()
  const reduce = useReducedMotion()
  const small = useMedia('(max-width: 639px)')
  const ref = useRef(null)
  const onScreen = useOnScreen(ref, '0px')
  const [pos, setPos] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef(null)
  const active = products[mod(pos)]

  const card = small ? 168 : 230
  // Wide enough that neighbouring cards on the ring don't overlap, whatever the product count.
  const radius = Math.round((card * 0.62) / Math.tan(Math.PI / N))

  useEffect(() => {
    if (reduce || paused || !onScreen) return
    const t = setInterval(() => setPos((p) => p + 1), 4500)
    return () => clearInterval(t)
  }, [reduce, paused, onScreen])

  const go = (d) => setPos((p) => p + d)
  const goTo = (i) => setPos((p) => p + (((i - mod(p) + N + N / 2) % N) - N / 2))

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Export products"
      className="relative overflow-hidden py-24 transition-colors duration-1000 sm:py-28"
      style={{ background: `color-mix(in oklab, ${active.tone} 70%, var(--color-paper))` }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="h2 max-w-[14ch]">Export products in focus</h2>
          <p className="max-w-xs text-slate">Rice to coconuts, one turn of the wheel. Swipe, drag or use the arrows.</p>
        </Reveal>
      </div>

      <div
        className="relative mx-auto mt-6 select-none [perspective:1500px]"
        style={{ height: card * 1.25 + 40, touchAction: 'pan-y' }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={() => {
          setPaused(false)
          drag.current = null
        }}
        onPointerDown={(e) => (drag.current = e.clientX)}
        onPointerUp={(e) => {
          if (drag.current === null) return
          const dx = e.clientX - drag.current
          drag.current = null
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          style={{
            transform: `translateZ(${-radius}px) rotateY(${-pos * STEP}deg)`,
            transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {products.map((p, i) => {
            const on = mod(pos) === i
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                tabIndex={on ? -1 : 0}
                aria-label={`Show ${p.name}`}
                className="absolute [backface-visibility:hidden]"
                style={{
                  width: card,
                  height: card * 1.25,
                  left: -card / 2,
                  top: -(card * 1.25) / 2,
                  transform: `rotateY(${i * STEP}deg) translateZ(${radius}px) scale(${on ? 1.12 : 0.9})`,
                  transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity .8s',
                  opacity: on ? 1 : 0.55,
                }}
              >
                <span
                  className={`flex size-full flex-col overflow-hidden rounded-[1.6rem] border bg-white/90 shadow-[0_30px_60px_-30px_rgba(12,20,49,0.5)] ${on ? 'border-white' : 'border-white/40'}`}
                >
                  <span className="relative block flex-1" style={{ background: p.tone }}>
                    <ProductArt kind={p.art} className="absolute inset-0 size-full" />
                  </span>
                  <span className="flex items-center justify-between px-4 py-3 text-left">
                    <span className="text-sm font-semibold text-ink">{p.name}</span>
                    <span className="text-xs text-slate tabular-nums">{p.no}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="wrap mt-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous product" className="grid size-12 place-items-center rounded-full border border-ink/20 bg-white/50 hover:border-ink">
              <Icon name="chevron" className="size-5 rotate-180" />
            </button>
            <span className="w-20 text-center text-sm font-semibold text-ink tabular-nums sm:hidden" aria-hidden="true">
              {String(mod(pos) + 1).padStart(2, '0')} / {N}
            </span>
            <div className="hidden gap-1.5 sm:flex" role="tablist" aria-label="Choose product">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={mod(pos) === i}
                  aria-label={p.name}
                  onClick={() => goTo(i)}
                  className="grid h-11 w-6 place-items-center"
                >
                  <span className={`block h-1.5 rounded-full transition-all duration-500 ${mod(pos) === i ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next product" className="grid size-12 place-items-center rounded-full border border-ink/20 bg-white/50 hover:border-ink">
              <Icon name="chevron" className="size-5" />
            </button>
          </div>

          <div className="mt-8 min-h-56 sm:min-h-48" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{active.name}</h3>
                <p className="mx-auto mt-3 max-w-xl text-slate">{active.short}</p>
                <p className="mt-3 text-sm text-ink/80">
                  {active.formLabel}: {active.forms.join(' · ')}
                </p>
                <Button as="button" type="button" className="mt-6" onClick={() => requestQuote(active.name)}>
                  Request Quote
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
