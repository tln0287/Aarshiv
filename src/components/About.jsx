import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import Reveal from './Reveal.jsx'
import Icon from './Icons.jsx'

const pillars = [
  { no: 1, title: 'Premium Sourcing', icon: 'sprout', text: 'Products selected from trusted suppliers and farmers across India.' },
  { no: 2, title: 'Global Supply', icon: 'globe', text: 'Processed, packed and documented for buyers in international markets.' },
  { no: 3, title: 'Reliable Delivery', icon: 'ship', text: 'Logistics coordinated from source to port to destination.' },
]

function Count({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {String(n).padStart(2, '0')}
    </span>
  )
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="h2 max-w-[14ch]">Connecting India with the world</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-slate">
            <p className="lede">
              Aarshiv Private Limited is an India-based export and import company focused on delivering quality agricultural and food products to international
              markets.
            </p>
            <p className="lede">
              We work with trusted suppliers and farmers to source, process, package and deliver products that meet the expectations of global buyers.
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:mt-20 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.no} delay={i * 0.1} className="group relative bg-paper p-7 transition-colors duration-500 hover:bg-white sm:p-9">
              <div className="flex items-start justify-between">
                <span className="text-[4.5rem] leading-none font-semibold tracking-[-0.05em] text-ink">
                  <Count to={p.no} />
                </span>
                <span className="grid size-12 place-items-center rounded-full bg-ink text-saffron-2 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                  <Icon name={p.icon} className="size-6" />
                </span>
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 max-w-[34ch] text-slate">{p.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-saffron transition-transform duration-700 ease-out-soft group-hover:scale-x-100" />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
