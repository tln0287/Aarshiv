import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import Icon, { IconShape } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import Heading3D from './fx/Heading3D.jsx'
import { useMedia } from '../lib/hooks.js'

const steps = [
  { title: 'Sourcing', icon: 'sprout', text: 'Products sourced from trusted farmers and suppliers.' },
  { title: 'Quality Check', icon: 'inspect', text: 'Products inspected and selected according to buyer requirements.' },
  { title: 'Processing & Packaging', icon: 'box', text: 'Products prepared and packed according to export requirements.' },
  { title: 'Logistics', icon: 'truck', text: 'Products transported to the port.' },
  { title: 'Global Shipping', icon: 'ship', text: 'Cargo shipped to international destinations.' },
  { title: 'Delivered', icon: 'globe', text: 'Products reach global buyers.' },
]

const ROUTE = 'M60 210 C 190 70, 300 70, 420 165 S 640 265, 780 160 S 1000 55, 1140 120'

function Desktop() {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [current, setCurrent] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.0005 })
  const travel = useTransform(p, [0.05, 0.92], [0, 1], { clamp: true })
  const x = useTransform(travel, (t) => (pathRef.current ? pathRef.current.getPointAtLength(t * pathRef.current.getTotalLength()).x : 60))
  const y = useTransform(travel, (t) => (pathRef.current ? pathRef.current.getPointAtLength(t * pathRef.current.getTotalLength()).y : 210))

  useLayoutEffect(() => {
    const path = pathRef.current
    const L = path.getTotalLength()
    setNodes(steps.map((_, i) => path.getPointAtLength((i / (steps.length - 1)) * L)))
  }, [])

  useMotionValueEvent(travel, 'change', (t) => setCurrent(Math.min(steps.length - 1, Math.round(t * (steps.length - 1) + 0.15))))

  return (
    <div ref={ref} className="relative h-[290vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="wrap">
          <div className="flex items-end justify-between gap-10">
            <Heading3D text="From farm to the world" className="h2 max-w-[12ch]" />
            <p className="max-w-sm pb-2 text-slate">Six stages, one coordinated chain. Scroll to follow a shipment from the field to the buyer.</p>
          </div>

          <div className="relative mt-10">
            <svg viewBox="0 0 1200 300" className="w-full overflow-visible" aria-hidden="true">
              <path ref={pathRef} d={ROUTE} fill="none" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
              <motion.path d={ROUTE} fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: travel }} />
              {nodes.map((n, i) => (
                <g key={i} transform={`translate(${n.x} ${n.y})`}>
                  <circle r="20" fill={i <= current ? 'var(--color-brand)' : '#fff'} stroke={i <= current ? 'var(--color-brand)' : 'var(--color-line)'} strokeWidth="2" style={{ transition: 'fill .4s, stroke .4s' }} />
                  <text textAnchor="middle" dy="4.5" fontSize="12" fontWeight="600" fill={i <= current ? '#fff' : 'var(--color-slate)'} style={{ transition: 'fill .4s' }}>
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              ))}
              <motion.g style={{ x, y }}>
                <circle r="34" fill="var(--color-gold)" opacity=".18" />
                <circle r="26" fill="var(--color-gold)" />
                <g transform="translate(-14.4 -14.4) scale(1.2)" color="var(--color-night)">
                  <IconShape name={steps[current].icon} strokeWidth={1.8} />
                </g>
              </motion.g>
            </svg>
          </div>

          <ol className="mt-8 grid grid-cols-6 gap-4">
            {steps.map((s, i) => (
              <li key={s.title} className={`transition-all duration-500 ${i <= current ? 'opacity-100' : 'opacity-35'} ${i === current ? '-translate-y-1' : ''}`}>
                <div className={`flex size-11 items-center justify-center rounded-full transition-colors duration-500 ${i === current ? 'bg-gold text-night' : 'bg-brand/5 text-brand'}`}>
                  <Icon name={s.icon} className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

function Mobile() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  return (
    <div className="wrap py-24">
      <Reveal>
        <Heading3D text="From farm to the world" className="h2" />
        <p className="lede mt-4 text-slate">Six stages, one coordinated chain.</p>
      </Reveal>
      <ol ref={ref} className="relative mt-12 space-y-10 pl-16">
        <span className="absolute top-2 bottom-2 left-[1.35rem] w-0.5 bg-line" aria-hidden="true" />
        <motion.span className="absolute top-2 bottom-2 left-[1.35rem] w-0.5 origin-top bg-gold" style={{ scaleY: scrollYProgress }} aria-hidden="true" />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} className="relative">
            <span className="absolute top-0 -left-16 grid size-11 place-items-center rounded-full bg-brand text-gold-2 ring-4 ring-paper">
              <Icon name={s.icon} className="size-5" />
            </span>
            <p className="text-xs text-slate tabular-nums">Step {String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-slate">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function Journey() {
  const wide = useMedia('(min-width: 1024px) and (min-height: 640px)')
  return (
    <section id="process" className="relative bg-paper">
      {wide ? <Desktop /> : <Mobile />}
    </section>
  )
}
