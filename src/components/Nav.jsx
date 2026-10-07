import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo.jsx'
import Icon from './Icons.jsx'
import Button from './Button.jsx'
import { nav } from '../config/site.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex max-w-[84rem] items-center justify-between rounded-full transition-all duration-500 ease-out-soft ${
          scrolled ? 'glass h-16 border border-white/10 pl-5 pr-2 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]' : 'h-20 border border-transparent pl-2 pr-0 sm:pl-3'
        }`}
      >
        <a href="#home" aria-label="Aarshiv Private Limited, home" className="shrink-0">
          <Logo compact={scrolled} />
        </a>
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={active === n.id ? 'true' : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors ${active === n.id ? 'text-white' : 'text-white/65 hover:text-white'}`}
                >
                  {active === n.id && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button href="#quote" className={scrolled ? 'min-h-11' : ''}>
              Request a Quote
            </Button>
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex size-12 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Icon name="menu" className="size-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-night/97 px-5 pt-5 pb-8 text-white backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <Logo compact />
              <button type="button" onClick={() => setOpen(false)} className="inline-flex size-12 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close menu" autoFocus>
                <Icon name="close" className="size-6" />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-10 flex-1 overflow-y-auto">
              <ul>
                {nav.map((n, i) => (
                  <motion.li key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <a
                      href={`#${n.id}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-baseline gap-4 border-b border-white/10 py-4 text-2xl font-semibold tracking-tight ${active === n.id ? 'text-saffron-2' : ''}`}
                    >
                      <span className="w-6 text-xs font-normal text-white/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {n.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <Button href="#quote" onClick={() => setOpen(false)} className="mt-6 w-full">
              Request a Quote
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
