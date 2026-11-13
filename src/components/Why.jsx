import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'
import Tilt3D from './fx/Tilt3D.jsx'
import Heading3D from './fx/Heading3D.jsx'

const reasons = [
  ['Trusted Sourcing', 'We focus on reliable sourcing from India.', 'sprout'],
  ['Consistent Quality', 'Quality is maintained throughout the supply chain.', 'inspect'],
  ['Global Standards', 'Products are prepared with international buyers in mind.', 'globe'],
  ['Flexible Requirements', 'We aim to accommodate buyer-specific requirements.', 'sliders'],
  ['Reliable Logistics', 'Coordinated logistics from sourcing to shipment.', 'route'],
  ['Long-Term Partnerships', 'We believe in building lasting relationships with buyers.', 'handshake'],
]

export default function Why() {
  return (
    <section id="why" className="bg-paper py-24 sm:py-32">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <Heading3D text="Why choose Sampatkari Agro?" className="h2" />
          <p className="lede mt-4 text-slate">What buyers can expect from working with us, from first enquiry to delivery.</p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([title, text, icon], i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 0.08}
              className="group"
            >
              <Tilt3D className="h-full overflow-hidden rounded-[1.75rem] border border-line bg-white p-7 transition-shadow duration-500 hover:shadow-[0_36px_60px_-38px_rgba(8,42,51,0.5)] sm:p-8">
              <div className="flex items-center justify-between">
                <span className="grid size-13 place-items-center rounded-2xl bg-brand text-gold-2 transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105">
                  <Icon name={icon} className="size-6" />
                </span>
                <span className="text-sm text-slate/70 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-slate">{text}</p>
              <span aria-hidden="true" className="absolute -right-10 -bottom-10 size-32 rounded-full bg-gold/0 transition-colors duration-500 group-hover:bg-gold/10" />
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
