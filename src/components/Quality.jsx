import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import ProductArt from './ProductArt.jsx'
import Reveal from './Reveal.jsx'
import Heading3D from './fx/Heading3D.jsx'
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
      <circle cx="16" cy="16" r="15" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
      <motion.circle
        cx="16"
        cy="16"
        r="15"
        fill="none"
        stroke="var(--color-gold)"
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
        stroke="var(--color-brand)"
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
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-paper-2 py-24 sm:py-32"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_40%,var(--color-glow)_0%,transparent_70%)]" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Heading3D text="Quality is our commitment" className="h2 max-w-[13ch]" />
            <p className="lede mt-5 text-slate">Every consignment is handled with the same care, from the field to the final document.</p>
          </Reveal>
          <div className="relative mt-10 hidden aspect-square max-w-lg sm:block" aria-hidden="true">
            {floaters.map((f, i) => (
              <Layer key={f.kind} f={f} sx={sx} sy={sy} scroll={scrollYProgress} i={i} />
            ))}
          </div>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {items.map(([title, text], i) => (
            <Reveal as="li" key={title} delay={i * 0.05} className="flex items-center gap-5 py-5">
              <Check delay={0.15 + i * 0.08} />
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
                <p className="text-sm text-slate">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Layer({ f, sx, sy, scroll, i }) {
  const x = useTransform(sx, (v) => v * f.depth)
  const y = useTransform([sy, scroll], ([p, s]) => p * f.depth + (0.5 - s) * f.depth * 3)
  const rotate = useTransform(scroll, [0, 1], [-6 * (i % 2 ? 1 : -1), 6 * (i % 2 ? 1 : -1)])
  return (
    <motion.div className={`absolute ${f.className}`} style={{ x, y, rotate }}>
      <div className="float drop-shadow-[0_30px_40px_rgba(11,36,22,0.18)]" style={{ '--d': `${7 + i * 1.5}s`, '--delay': `${-i * 2}s` }}>
        <ProductArt kind={f.kind} className="w-full" />
      </div>
    </motion.div>
  )
}
