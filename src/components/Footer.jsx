import { company, contact } from '../config/site.js'
import Logo from './Logo.jsx'

const columns = [
  {
    title: 'Company',
    links: [
      ['About', '#about'],
      ['Products', '#products'],
      ['Export Process', '#process'],
      ['Why Aarshiv', '#why'],
    ],
  },
  {
    title: 'Products',
    links: [
      ['Rice', '#products'],
      ['Chillies', '#products'],
      ['Guntur Chillies', '#products'],
      ['Curry Leaves', '#products'],
      ['Moringa', '#products'],
      ['Cardamom', '#products'],
      ['Capsicum', '#products'],
      ['Cucumber', '#products'],
      ['Onions', '#products'],
      ['Coconuts', '#products'],
    ],
  },
  {
    title: 'Business',
    links: [
      ['Request Quote', '#quote'],
      ['Become a Buyer', '#requirement'],
      ['Contact Us', '#contact'],
    ],
  },
  {
    title: 'Follow',
    links: [
      ['LinkedIn', contact.linkedin],
      ['Instagram', contact.instagram],
      ['WhatsApp', contact.whatsapp && `https://wa.me/${contact.whatsapp}`],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <div className="wrap pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-6 text-2xl font-semibold tracking-tight">{company.tagline}</p>
            <p className="mt-2 max-w-xs text-sm text-mist">{company.supportingTagline}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm text-mist">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="text-[0.95rem] text-white/85 transition-colors hover:text-saffron-2"
                        >
                          {label}
                        </a>
                      ) : (
                        <span className="text-[0.95rem] text-white/40" title="Link coming soon">
                          {label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Aarshiv Private Limited. All Rights Reserved.</p>
          <a href="#home" className="hover:text-white">
            Back to top ↑
          </a>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none -mb-[0.18em] text-center text-[22vw] leading-[0.8] font-bold tracking-[-0.04em] text-white/[0.04] select-none">
        AARSHIV
      </div>
    </footer>
  )
}
