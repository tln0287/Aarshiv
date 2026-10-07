import { useState } from 'react'
import Reveal from '../Reveal.jsx'
import Form from './Form.jsx'
import Button from '../Button.jsx'

const fields = [
  { name: 'name', label: 'Name', required: true, autoComplete: 'name' },
  { name: 'company', label: 'Company', autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'WhatsApp / Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'country', label: 'Country', required: true, autoComplete: 'country-name' },
  { name: 'product', label: 'Product', required: true },
  { name: 'quantity', label: 'Quantity' },
  { name: 'packaging', label: 'Required Packaging' },
  { name: 'message', label: 'Message', type: 'textarea', wide: true },
]

export default function Requirement() {
  const [values, setValues] = useState({})
  return (
    <section id="requirement" className="bg-paper py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="h2 max-w-[12ch]">Looking for something specific?</h2>
          <p className="lede mt-5 text-slate">
            Tell us what you need. We will work with our sourcing network to identify the right product and specification for your requirement.
          </p>
          <Button href="#requirement-form" variant="ink" className="mt-8 lg:hidden">
            Send Your Requirement
          </Button>
          <ul className="mt-10 hidden space-y-3 text-sm text-slate lg:block">
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" />
              Products beyond our list can be sourced on request.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" />
              Share grade, form and packaging details if you have them.
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1} id="requirement-form" className="scroll-mt-28 rounded-[2rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgba(12,20,49,0.35)] sm:p-9">
          <h3 className="mb-6 text-xl font-semibold tracking-tight">Send your requirement</h3>
          <Form
            kind="requirement"
            fields={fields}
            values={values}
            setValue={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
            onReset={() => setValues({})}
            submitLabel="Submit Requirement"
            success={{ title: 'Requirement received', text: 'Thank you. Our team will review your requirement and get back to you.' }}
          />
        </Reveal>
      </div>
    </section>
  )
}
