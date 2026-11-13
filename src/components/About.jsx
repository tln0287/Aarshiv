import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useGeo } from '../lib/geoData.js'
import { contact } from '../config/site.js'
import Reveal from './Reveal.jsx'
import Icon from './Icons.jsx'
import ProductArt from './ProductArt.jsx'
import Heading3D from './fx/Heading3D.jsx'
import Tilt3D from './fx/Tilt3D.jsx'

const pillars = [
  { title: 'Premium Sourcing', icon: 'sprout', text: 'Products selected from trusted suppliers and farmers across India.' },
  { title: 'Global Supply', icon: 'globe', text: 'Processed, packed and documented for buyers in international markets.' },
  { title: 'Reliable Delivery', icon: 'ship', text: 'Logistics coordinated from source to port to destination.' },
]

// Routes leave the map towards the edges of the panel: east and west, out to the world.
const ROUTES = [
  [470, 60],
  [480, 250],
  [460, 440],
  [-70, 110],
  [-70, 330],
]

const halo = { stroke: 'var(--color-brand)', paintOrder: 'stroke', strokeLinejoin: 'round' }

function Hub({ hub, main }) {
  const [x, y] = hub.xy
  return (
    <g>
      {main && <circle cx={x} cy={y} r="9" fill="none" stroke="#fff" strokeWidth="2" className="pulse-ring" />}
      <circle cx={x} cy={y} r={main ? 9 : 6.5} fill={main ? '#fff' : 'var(--color-gold)'} stroke={main ? 'var(--color-gold)' : '#fff'} strokeWidth="3" />
    </g>
  )
}

function IndiaMap({ india }) {
  const [vizag, guntur] = india.hubs
  const [vx, vy] = vizag.xy
  return (
    <svg viewBox="-70 0 550 460" className="w-full" role="img" aria-label="Map of India marking Visakhapatnam and Guntur, with routes leading out to the world">
      <g>
        {india.dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="var(--color-gold)" fillOpacity=".85" />
        ))}
      </g>
      {ROUTES.map(([tx, ty], i) => {
        const d = `M${vx} ${vy} Q ${(vx + tx) / 2} ${Math.min(vy, ty) - 90} ${tx} ${ty}`
        return (
          <g key={i}>
            <motion.path
              d={d}
              fill="none"
              stroke="#fff"
              strokeOpacity=".55"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            <path d={d} fill="none" stroke="var(--color-gold-2)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="3 24" className="dash-move" />
          </g>
        )
      })}
      <Hub hub={guntur} />
      <Hub hub={vizag} main />
      <text x={vx + 20} y={vy - 6} fill="#fff" fontSize="26" fontWeight="700" strokeWidth="7" style={halo}>
        {vizag.name}
      </text>
      <text x={vx + 20} y={vy + 20} fill="var(--color-gold-2)" fontSize="18" fontWeight="600" strokeWidth="6" style={halo}>
        Our base
      </text>
      <text x={guntur.xy[0] - 14} y={guntur.xy[1] + 26} textAnchor="end" fill="#fff" fontSize="19" fontWeight="600" strokeWidth="6" style={halo}>
        Guntur · chilli belt
      </text>
    </svg>
  )
}

function Chain() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  return (
    <div ref={ref} className="relative mt-20 sm:mt-28">
      {/* The connecting line draws as the chain scrolls into view: across on desktop, down on phones. */}
      <span aria-hidden="true" className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px bg-line md:block" />
      <motion.span aria-hidden="true" className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-0.5 origin-left bg-gold md:block" style={{ scaleX: scrollYProgress }} />
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-7 w-px bg-line md:hidden" />
      <motion.span aria-hidden="true" className="absolute top-2 bottom-2 left-7 w-0.5 origin-top bg-gold md:hidden" style={{ scaleY: scrollYProgress }} />

      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {pillars.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.12} className="group relative flex gap-5 md:flex-col md:items-center md:text-center">
            <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-brand text-gold-2 shadow-[0_12px_28px_-12px_rgba(8,42,51,0.6)] ring-8 ring-paper transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
              <Icon name={p.icon} className="size-6" />
            </span>
            <div className="md:mt-6">
              <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 max-w-[30ch] text-slate md:mx-auto">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}

export default function About() {
  const geo = useGeo()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const floatA = useTransform(scrollYProgress, [0, 1], [60, -60])
  const floatB = useTransform(scrollYProgress, [0, 1], [-30, 50])

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="wrap">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Heading3D text="Connecting India with the world" className="h2 max-w-[14ch]" />
            <Reveal delay={0.1} className="mt-7 space-y-5 text-slate">
              <p className="lede">
                Sampatkari Agro Private Limited is an India-based export and import company focused on delivering quality agricultural and food products to
                international markets.
              </p>
              <p className="lede">We work with trusted suppliers and farmers to source, process, package and deliver products that meet the expectations of global buyers.</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <span className="inline-flex items-center gap-3 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-[0_8px_24px_-16px_rgba(8,42,51,0.4)]">
                <Icon name="pin" className="size-5 text-gold" />
                Based in {contact.address || 'India'}
              </span>
              <a href="#process" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-2">
                See how we export
                <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative px-4 py-8 sm:px-8">
            <Tilt3D strength={6} className="group overflow-hidden rounded-[2rem] bg-brand p-5 text-white shadow-[0_50px_90px_-50px_rgba(8,42,51,0.8)] sm:p-8">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_45%_55%,rgba(255,255,255,0.12),transparent_70%)]" />
              <div className="relative flex items-center justify-between text-sm">
                <span className="font-semibold">India</span>
                <span className="inline-flex items-center gap-2 text-white/70">
                  <span className="h-px w-8 bg-gold-2" /> the world
                </span>
              </div>
              <div className="relative mt-2 min-h-[14rem]">{geo?.india && <IndiaMap india={geo.india} />}</div>
              <p className="relative mt-2 max-w-sm text-sm text-white/70">From the east coast of India to the markets we aim to serve worldwide.</p>
            </Tilt3D>

            {/* Product illustrations floating at the panel's corners, drifting at their own speed. */}
            <motion.div aria-hidden="true" className="pointer-events-none absolute top-[13%] -right-3 w-24 sm:-right-10 sm:w-40" style={{ y: floatB }}>
              <div className="float drop-shadow-[0_24px_30px_rgba(8,42,51,0.35)]" style={{ '--d': '7s' }}>
                <ProductArt kind="guntur" className="w-full" />
              </div>
            </motion.div>
            <motion.div aria-hidden="true" className="pointer-events-none absolute -right-2 -bottom-8 w-28 sm:-right-6 sm:w-40" style={{ y: floatA }}>
              <div className="float drop-shadow-[0_24px_30px_rgba(8,42,51,0.35)]" style={{ '--d': '8s', '--delay': '-3s' }}>
                <ProductArt kind="rice" className="w-full" />
              </div>
            </motion.div>
          </Reveal>
        </div>

        <Chain />
      </div>
    </section>
  )
}
