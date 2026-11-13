import { company, contact, PLACEHOLDER } from '../config/site.js'
import Icon from './Icons.jsx'
import Reveal from './Reveal.jsx'
import { Mark } from './Logo.jsx'
import Button from './Button.jsx'
import Heading3D from './fx/Heading3D.jsx'

// Each entry turns into a link once its value is filled in src/config/site.js.
export const channels = [
  {
    key: 'email',
    label: 'Email',
    icon: 'mail',
    href: (v) => `mailto:${v}`,
    // Let a long address wrap after the @ rather than mid-word.
    show: (v) => {
      const [user, domain] = v.split('@')
      return domain ? (
        <>
          {user}@<wbr />
          {domain}
        </>
      ) : (
        v
      )
    },
  },
  { key: 'phone', label: 'Phone', icon: 'phone', href: (v) => `tel:${v.replace(/\s/g, '')}` },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', href: (v) => `https://wa.me/${v}`, show: (v) => `+${v.slice(0, 2)} ${v.slice(2, 7)} ${v.slice(7)}` },
  { key: 'website', label: 'Website', icon: 'link', href: (v) => v, show: (v) => v.replace(/^https?:\/\//, '') },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: (v) => v },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', href: (v) => v },
  { key: 'address', label: 'Address', icon: 'pin' },
]

export default function Contact() {
  return (
    <section id="contact" className="bg-paper py-24 sm:py-32">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Reveal>
            <Heading3D text="Let’s build a global partnership" className="h2 max-w-[13ch]" />
            <div className="mt-10 flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-brand">
                <Mark className="size-10" />
              </span>
              <div>
                <p className="text-lg font-semibold tracking-tight">{company.name}</p>
                <p className="text-slate">{company.tagline}</p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#quote">Request a Quote</Button>
              <Button href="#requirement" variant="outline">
                Become a Buyer
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2">
              {channels.map((c) => {
                const v = contact[c.key]
                const body = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/5 text-brand transition-colors group-hover:bg-brand group-hover:text-gold-2">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-slate">{c.label}</span>
                      <span className={`mt-0.5 block break-words ${v ? 'font-medium text-brand' : 'text-sm text-slate/80'}`}>{v ? (c.show ? c.show(v) : v) : PLACEHOLDER}</span>
                    </span>
                  </>
                )
                return (
                  <li key={c.key} className={`bg-paper ${c.key === 'address' ? 'sm:col-span-2' : ''}`}>
                    {v && c.href ? (
                      <a href={c.href(v)} target={c.href(v).startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group flex items-start gap-4 p-5 transition-colors hover:bg-white">
                        {body}
                      </a>
                    ) : (
                      <div className="group flex items-start gap-4 p-5">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
