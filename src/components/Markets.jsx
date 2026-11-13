import { memo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useGeo } from '../lib/geoData.js'
import Reveal from './Reveal.jsx'
import Icon from './Icons.jsx'
import Heading3D from './fx/Heading3D.jsx'

// Where each region's name sits relative to its marker, so labels clear the routes and each other.
const LABELS = {
  'middle-east': { dx: -14, dy: 30, anchor: 'end' },
  europe: { dx: -16, dy: 6, anchor: 'end' },
  'southeast-asia': { dx: 16, dy: 6, anchor: 'start' },
  africa: { dx: -16, dy: 6, anchor: 'end' },
  'north-america': { dx: 0, dy: -22, anchor: 'middle' },
  australia: { dx: 0, dy: 34, anchor: 'middle' },
}

function MapLabel({ x, y, children, strong }) {
  return (
    <text
      x={x}
      y={y}
      // Sizes are in map units: larger on phones, where the whole map is drawn small.
      className={`${strong ? 'fill-ink text-[25px] font-bold sm:text-[17px]' : 'fill-ink/80 text-[21px] font-semibold sm:text-[15px]'}`}
      stroke="#ffffff"
      strokeWidth="5"
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  )
}

function arc([x1, y1], [x2, y2]) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const d = Math.hypot(x2 - x1, y2 - y1)
  return `M${x1} ${y1} Q ${mx} ${my - d * 0.42} ${x2} ${y2}`
}

const Dots = memo(function Dots({ dots }) {
  return (
    <g>
      {dots.map(([x, y, india], i) => (
        <circle key={i} cx={x} cy={y} r={india ? 3.4 : 3} fill={india ? 'var(--color-gold)' : 'var(--color-globe-land)'} fillOpacity={india ? 1 : 0.5} />
      ))}
    </g>
  )
})

export default function Markets() {
  const geo = useGeo()
  const [active, setActive] = useState(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <section ref={ref} id="markets" className="relative overflow-hidden bg-paper-2 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_30%,var(--color-glow)_0%,transparent_70%)]" />
      <div className="wrap relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Heading3D text="From India to global markets" className="h2 max-w-[16ch]" />
          </Reveal>
          <Reveal delay={0.1} className="max-w-sm text-slate">
            Target markets: the regions we aim to serve. Select one to trace the route from India.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_17rem] lg:gap-10">
          <motion.div className="relative -mx-4 sm:mx-0" style={{ rotateX, scale, transformPerspective: 1200, transformOrigin: "50% 100%" }}>
            <svg viewBox="0 0 1000 520" className="w-full" role="img" aria-label="World map with routes from India to six target market regions">
              {geo && (
                <>
                  <Dots dots={geo.map.dots} />
                  {geo.markets.map((m, i) => {
                    const d = arc(geo.origin.xy, m.xy)
                    const on = active === null || active === m.id
                    return (
                      <g key={m.id} style={{ opacity: on ? 1 : 0.18, transition: 'opacity .4s' }}>
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="var(--color-gold-deep)"
                          strokeWidth={active === m.id ? 3.6 : 2.6}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, margin: '-20%' }}
                          transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <path d={d} fill="none" stroke="var(--color-brand)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="3 20" className="dash-move" />
                        <circle cx={m.xy[0]} cy={m.xy[1]} r="14" fill="none" stroke="var(--color-brand)" strokeOpacity=".35" strokeWidth="1.5" />
                        <circle cx={m.xy[0]} cy={m.xy[1]} r="7.5" fill="var(--color-brand)" stroke="#ffffff" strokeWidth="2.5" />
                        <g textAnchor={LABELS[m.id]?.anchor ?? 'start'}>
                          <MapLabel x={m.xy[0] + (LABELS[m.id]?.dx ?? 14)} y={m.xy[1] + (LABELS[m.id]?.dy ?? 5)}>
                            {m.name}
                          </MapLabel>
                        </g>
                      </g>
                    )
                  })}
                  <circle cx={geo.origin.xy[0]} cy={geo.origin.xy[1]} r="9" fill="none" stroke="var(--color-gold)" strokeWidth="2" className="pulse-ring" />
                  <circle cx={geo.origin.xy[0]} cy={geo.origin.xy[1]} r="9" fill="var(--color-gold)" stroke="#ffffff" strokeWidth="2.5" />
                  <g textAnchor="start">
                    <MapLabel x={geo.origin.xy[0] + 16} y={geo.origin.xy[1] - 12} strong>
                      India
                    </MapLabel>
                  </g>
                </>
              )}
            </svg>
            {geo &&
              geo.markets.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onMouseEnter={() => setActive(m.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(m.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((a) => (a === m.id ? null : m.id))}
                  className="absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${m.xy[0] / 10}%`, top: `${(m.xy[1] / 520) * 100}%` }}
                  aria-label={`${m.name}, target market`}
                >
                  {active === m.id && (
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl border border-line bg-white px-3 py-2 text-left whitespace-nowrap text-brand shadow-xl">
                      <span className="block text-[0.7rem] text-slate">Target market</span>
                      <span className="block text-sm font-semibold">{m.name}</span>
                    </span>
                  )}
                </button>
              ))}
          </motion.div>

          <div>
            <h3 className="text-sm text-slate">Global markets we aim to serve</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {(geo?.markets ?? []).map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(m.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(m.id)}
                    onBlur={() => setActive(null)}
                    className={`flex w-full items-center justify-between py-3.5 text-left transition-colors ${active === m.id ? 'text-brand' : 'text-ink'}`}
                  >
                    <span className="font-medium">{m.name}</span>
                    <Icon name="arrow" className={`size-4 transition-transform duration-300 ${active === m.id ? 'translate-x-0' : '-translate-x-1 opacity-40'}`} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-slate">
              Shipping from <span className="font-medium text-ink">India</span>. Destinations and routes are confirmed for each order.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
