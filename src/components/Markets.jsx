import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGeo } from '../lib/geoData.js'
import Reveal from './Reveal.jsx'
import Icon from './Icons.jsx'

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
        <circle key={i} cx={x} cy={y} r={india ? 3 : 2.5} fill={india ? 'var(--color-saffron)' : 'rgba(163,174,208,0.38)'} />
      ))}
    </g>
  )
})

export default function Markets() {
  const geo = useGeo()
  const [active, setActive] = useState(null)

  return (
    <section id="markets" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_30%,#2b3f86_0%,transparent_70%)]" />
      <div className="wrap relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 className="h2 max-w-[16ch]">From India to global markets</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-sm text-mist">
            Target markets: the regions we aim to serve. Select one to trace the route from India.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_17rem] lg:gap-10">
          <div className="relative -mx-4 sm:mx-0">
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
                          stroke="var(--color-saffron)"
                          strokeWidth={active === m.id ? 2.4 : 1.6}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, margin: '-20%' }}
                          transition={{ duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <path d={d} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 22" className="dash-move" opacity=".8" />
                        <circle cx={m.xy[0]} cy={m.xy[1]} r="5" fill="#fff" />
                        <circle cx={m.xy[0]} cy={m.xy[1]} r="11" fill="none" stroke="#fff" strokeOpacity=".5" />
                      </g>
                    )
                  })}
                  <circle cx={geo.origin.xy[0]} cy={geo.origin.xy[1]} r="7" fill="var(--color-saffron)" />
                  <circle cx={geo.origin.xy[0]} cy={geo.origin.xy[1]} r="7" fill="none" stroke="var(--color-saffron)" strokeWidth="2" className="pulse-ring" />
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
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-left whitespace-nowrap text-ink shadow-xl">
                      <span className="block text-[0.7rem] text-slate">Target market</span>
                      <span className="block text-sm font-semibold">{m.name}</span>
                    </span>
                  )}
                </button>
              ))}
          </div>

          <div>
            <h3 className="text-sm text-mist">Global markets we aim to serve</h3>
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {(geo?.markets ?? []).map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(m.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(m.id)}
                    onBlur={() => setActive(null)}
                    className={`flex w-full items-center justify-between py-3.5 text-left transition-colors ${active === m.id ? 'text-saffron-2' : 'text-white'}`}
                  >
                    <span className="font-medium">{m.name}</span>
                    <Icon name="arrow" className={`size-4 transition-transform duration-300 ${active === m.id ? 'translate-x-0' : '-translate-x-1 opacity-40'}`} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-mist">
              Shipping from <span className="text-white">India</span>. Destinations and routes are confirmed for each order.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
