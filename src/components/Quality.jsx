import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ProductArt from './ProductArt.jsx'
import Reveal from './Reveal.jsx'
import { useReducedMotion } from '../lib/hooks.js'

const items = [
  ['Quality Sourcing', 'Selected suppliers and growing regions.'],
  ['Product Inspection', 'Checked against the buyer’s specification.'],
  ['Hygienic Processing', 'Cleaned, sorted and handled with care.'],
  ['Secure Packaging', 'Packed to protect the product in transit.'],
  ['Export Documentation', 'Paperwork prepared for each consignment.'],
  ['Reliable Logistics', 'Coordinated movement from source to port.'],
  ['Buyer-Focused Service', 'One point of contact through every order.'],
]

function Check({ delay }) {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <motion.circle
        cx="16"
        cy="16"
        r="15"
        fill="none"
        stroke="var(--color-saffron)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        style={{ rotate: -90 }}
      />
      <motion.path
        d="M9.5 16.5l4.5 4.5 8.5-9.5"
        fill="none"
        stroke="var(--color-saffron-2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
      />
    </svg>
  )
}

// Product illustrations at different depths; nearer ones move further with the pointer.
const floaters = [
  { kind: 'guntur', depth: 40, className: 'left-[-6%] top-[2%] w-[62%] rotate-[-8deg]' },
  { kind: 'cardamom', depth: 70, className: 'right-[-4%] top-[30%] w-[52%] rotate-[10deg]' },
  { kind: 'rice', depth: 25, className: 'left-[12%] bottom-[-4%] w-[56%]' },
]

export default function Quality() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })

  return (
    <section
      className="relative overflow-hidden bg-night py-24 text-white sm:py-32"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_40%,#22357a_0%,transparent_70%)]" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <h2 className="h2 max-w-[13ch]">Quality is our commitment</h2>
            <p className="lede mt-5 text-mist">Every consignment is handled with the same care, from the field to the final document.</p>
          </Reveal>
          <div className="relative mt-10 hidden aspect-square max-w-lg sm:block" aria-hidden="true">
            {floaters.map((f, i) => (
              <Layer key={f.kind} f={f} sx={sx} sy={sy} i={i} />
            ))}
          </div>
        </div>

        <ul className="divide-y divide-white/10 border-y border-white/10">
          {items.map(([title, text], i) => (
            <Reveal as="li" key={title} delay={i * 0.05} className="flex items-center gap-5 py-5">
              <Check delay={0.15 + i * 0.08} />
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="text-sm text-mist">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Layer({ f, sx, sy, i }) {
  const x = useTransform(sx, (v) => v * f.depth)
  const y = useTransform(sy, (v) => v * f.depth)
  return (
    <motion.div className={`absolute ${f.className}`} style={{ x, y }}>
      <div className="float drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" style={{ '--d': `${7 + i * 1.5}s`, '--delay': `${-i * 2}s` }}>
        <ProductArt kind={f.kind} className="w-full" />
      </div>
    </motion.div>
  )
}
