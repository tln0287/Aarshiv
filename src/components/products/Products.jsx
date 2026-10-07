import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories, products } from '../../data/products.js'
import { useQuote } from '../../lib/quote.jsx'
import Reveal from '../Reveal.jsx'
import Icon from '../Icons.jsx'
import Button from '../Button.jsx'
import TiltArt from './TiltArt.jsx'
import ProductModal from './ProductModal.jsx'

function Meta({ label, children }) {
  return (
    <div className="flex gap-3 border-t border-line py-2.5 text-sm first:border-t-0">
      <dt className="w-32 shrink-0 text-slate">{label}</dt>
      <dd className="font-medium text-ink">{children}</dd>
    </div>
  )
}

function ProductCard({ product, onOpen }) {
  const { requestQuote } = useQuote()
  const featured = product.featured
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_1px_0_rgba(12,20,49,0.04)] transition-[box-shadow,translate] duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-40px_rgba(12,20,49,0.45)] ${
        featured ? 'md:col-span-2 lg:grid lg:grid-cols-[1.15fr_1fr]' : ''
      }`}
    >
      <button type="button" onClick={() => onOpen(product)} className="relative block text-left" aria-label={`View ${product.name}`}>
        <TiltArt product={product} className={featured ? 'aspect-[5/4] lg:aspect-auto lg:h-full' : 'aspect-[5/4]'} />
        <span className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink tabular-nums backdrop-blur">{product.no}</span>
        {featured && <span className="absolute top-4 right-4 rounded-full bg-chilli px-3 py-1 text-xs font-semibold text-white">From Andhra Pradesh</span>}
      </button>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className={`font-semibold tracking-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{product.name}</h3>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate">{product.short}</p>
        <dl className="mt-5 mb-6">
          <Meta label="Origin">{product.origin}</Meta>
          <Meta label={product.formLabel}>{product.forms.join(', ')}</Meta>
          <Meta label="Packaging">{product.packaging}</Meta>
          <Meta label="Export">{product.availability}</Meta>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2.5">
          <Button as="button" type="button" variant="ink" onClick={() => onOpen(product)} className="min-h-11 px-5 text-sm">
            View Product
          </Button>
          <Button as="button" type="button" variant="outline" arrow={false} onClick={() => requestQuote(product.name)} className="min-h-11 px-5 text-sm">
            Request Quote
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

export default function Products() {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const list = cat === 'All' ? products : products.filter((p) => p.categories.includes(cat))

  return (
    <section id="products" className="relative bg-paper-2/60 py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <h2 className="h2">Our products</h2>
            <p className="lede mt-4 text-slate">Authentic Indian products. Global quality.</p>
          </Reveal>
          <Reveal delay={0.1} className="text-sm text-slate lg:max-w-xs lg:text-right">
            Specifications, grades and packaging are prepared to each buyer&rsquo;s requirement.
          </Reveal>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" role="toolbar" aria-label="Filter products by category">
          <div className="flex w-max gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`relative min-h-11 rounded-full border px-4.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  cat === c ? 'border-ink text-white' : 'border-line bg-white/60 text-slate hover:border-ink/40 hover:text-ink'
                }`}
              >
                {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setOpen} />
            ))}
            {list.length === 0 && (
              <motion.div
                key="empty"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-start gap-5 rounded-[1.75rem] border border-dashed border-ink/25 bg-white/50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-saffron-2">
                    <Icon name="leaf" className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{cat} are sourced on request</h3>
                    <p className="mt-1 max-w-xl text-slate">Tell us the product and specification you need and we will work with our sourcing network to find it.</p>
                  </div>
                </div>
                <Button href="#requirement">Send Your Requirement</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProductModal product={open} onClose={close} />
    </section>
  )
}
