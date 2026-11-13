import { useState } from 'react'
import { products } from '../../data/products.js'
import { useQuote } from '../../lib/quote.jsx'
import Reveal from '../Reveal.jsx'
import Form from './Form.jsx'
import Icon from '../Icons.jsx'
import Heading3D from '../fx/Heading3D.jsx'

const fields = [
  { name: 'fullName', label: 'Full Name', required: true, autoComplete: 'name' },
  { name: 'company', label: 'Company Name', autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'country', label: 'Country', required: true, autoComplete: 'country-name' },
  { name: 'phone', label: 'Phone / WhatsApp', type: 'tel', autoComplete: 'tel' },
  { name: 'product', label: 'Product', type: 'select', required: true, options: [...products.map((p) => p.name), 'Other (describe below)'] },
  { name: 'quantity', label: 'Quantity', required: true },
  { name: 'packaging', label: 'Preferred Packaging' },
  { name: 'port', label: 'Destination Port', wide: true },
  { name: 'notes', label: 'Additional Requirements', type: 'textarea', wide: true },
]

const notes = [
  ['doc', 'Share grade, form and quantity for an accurate quotation.'],
  ['anchor', 'A destination port helps us plan shipping options.'],
  ['sliders', 'Custom grades and packaging can be discussed.'],
]

export default function Quote() {
  const { product, setProduct } = useQuote()
  const [values, setValues] = useState({})
  const all = { ...values, product }
  const setValue = (k, v) => (k === 'product' ? setProduct(v) : setValues((s) => ({ ...s, [k]: v })))

  return (
    <section id="quote" className="relative overflow-hidden bg-paper-2 py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_10%,color-mix(in_oklab,var(--color-gold)_16%,transparent),transparent_70%),radial-gradient(60%_60%_at_0%_100%,var(--color-glow),transparent_70%)]" />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <Heading3D text="Request a quote" className="h2" />
          <p className="lede mt-5 text-slate">Tell us the product, quantity and destination. We will come back with pricing and availability.</p>
          <ul className="mt-10 space-y-5">
            {notes.map(([icon, text]) => (
              <li key={icon} className="flex items-start gap-4 text-ink/85">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                  <Icon name={icon} className="size-5" />
                </span>
                <span className="pt-2">{text}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgba(11,36,22,0.35)] sm:p-9">
          <Form
            kind="quote"
            fields={fields}
            values={all}
            setValue={setValue}
            onReset={() => {
              setValues({})
              setProduct('')
            }}
            submitLabel="Request Quote"
            success={{ title: 'Quote request sent', text: 'Thank you. We will review your request and respond with a quotation.' }}
          />
        </Reveal>
      </div>
    </section>
  )
}
