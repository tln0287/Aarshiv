import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../Icons.jsx'
import Button from '../Button.jsx'
import TiltArt from './TiltArt.jsx'
import { useQuote } from '../../lib/quote.jsx'

const rows = (p) => [
  ['Origin', p.origin, 'pin'],
  ['Grade', p.grade, 'tag'],
  [p.formLabel, p.forms.join(', '), 'layers'],
  ['Packaging', p.packaging, 'box'],
  ['MOQ', p.moq, 'scale'],
  ['Supply capacity', p.capacity, 'route'],
  ['Certifications', p.certifications, 'shield'],
  ['Shelf life', p.shelfLife, 'clock'],
  ['Shipping options', p.shipping, 'ship'],
  ['Available markets', p.markets, 'globe'],
]

export default function ProductModal({ product, onClose }) {
  const { requestQuote } = useQuote()
  const closeRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!product) return
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const f = panelRef.current.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [product, onClose])

  return (
    <AnimatePresence>
      {product && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-title"
            className="relative grid max-h-[94svh] w-full max-w-6xl overflow-hidden rounded-t-[2rem] bg-paper shadow-2xl sm:rounded-[2rem] lg:grid-cols-[1fr_1.05fr]"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltArt product={product} strength={14} className="aspect-[5/4] lg:aspect-auto lg:h-full" />
            <div className="overflow-y-auto p-6 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate tabular-nums">Product {product.no}</p>
                  <h3 id="pm-title" className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {product.name}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-ink"
                >
                  <Icon name="close" className="size-5" />
                </button>
              </div>
              <p className="mt-4 leading-relaxed text-slate">{product.overview}</p>
              <dl className="mt-7 grid gap-x-6 sm:grid-cols-2">
                {rows(product).map(([label, value, icon]) => (
                  <div key={label} className="flex gap-3 border-t border-line py-3.5">
                    <Icon name={icon} className="mt-0.5 size-5 shrink-0 text-saffron" />
                    <div>
                      <dt className="text-xs text-slate">{label}</dt>
                      <dd className="mt-0.5 text-[0.95rem] font-medium">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  as="button"
                  type="button"
                  onClick={() => {
                    onClose()
                    setTimeout(() => requestQuote(product.name), 250)
                  }}
                >
                  Request Quote
                </Button>
                <p className="text-sm text-slate">Grades, MOQ and certifications are confirmed with each quotation.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
