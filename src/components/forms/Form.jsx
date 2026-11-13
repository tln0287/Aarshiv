import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitForm } from '../../lib/forms.js'
import Button from '../Button.jsx'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Field({ field, value, error, onChange, dark }) {
  const id = useId()
  const base = `peer w-full rounded-2xl border px-4 pt-6 pb-2.5 text-[0.98rem] outline-none transition-colors placeholder-transparent focus:ring-2 ${
    dark
      ? 'border-white/15 bg-white/[0.06] text-white focus:border-gold focus:ring-gold/25'
      : 'border-line bg-white text-brand focus:border-brand focus:ring-brand/10'
  } ${error ? '!border-chilli' : ''}`
  const label = `pointer-events-none absolute left-4 top-2 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.95rem] peer-focus:top-2 peer-focus:text-xs ${
    dark ? 'text-mist' : 'text-slate'
  }`
  const common = {
    id,
    name: field.name,
    value,
    placeholder: field.label,
    onChange: (e) => onChange(field.name, e.target.value),
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-e` : undefined,
    autoComplete: field.autoComplete,
  }
  return (
    <div className={field.wide ? 'sm:col-span-2' : ''}>
      <div className="relative">
        {field.type === 'textarea' ? (
          <textarea {...common} rows={4} className={`${base} resize-y`} />
        ) : field.type === 'select' ? (
          <select {...common} className={`${base} appearance-none pr-10 ${!value ? (dark ? 'text-white/0' : 'text-brand/0') : ''}`}>
            <option value="" disabled hidden />
            {field.options.map((o) => (
              <option key={o} value={o} className="text-brand">
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input {...common} type={field.type || 'text'} inputMode={field.inputMode} className={base} />
        )}
        <label htmlFor={id} className={`${label} ${field.type === 'select' && !value ? '!top-4 !text-[0.95rem]' : ''}`}>
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </label>
        {field.type === 'select' && (
          <svg viewBox="0 0 24 24" className={`pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 ${dark ? 'text-mist' : 'text-slate'}`} aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {error && (
        <p id={`${id}-e`} className={`mt-1.5 text-sm ${dark ? 'text-gold-2' : 'text-chilli'}`}>
          {error}
        </p>
      )}
    </div>
  )
}

function Success({ title, text, onReset, dark }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 text-center" role="status">
      <svg viewBox="0 0 96 96" className="size-24" aria-hidden="true">
        <motion.circle cx="48" cy="48" r="44" fill="none" stroke="var(--color-gold)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} style={{ rotate: -90 }} />
        <motion.path d="M29 49l13 13 26-28" fill="none" stroke="var(--color-gold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 }} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.circle
            key={i}
            cx="48"
            cy="48"
            r="3"
            fill={i % 2 ? 'var(--color-gold)' : 'var(--color-leaf)'}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], x: Math.cos((i / 8) * Math.PI * 2) * 46, y: Math.sin((i / 8) * Math.PI * 2) * 46 }}
            transition={{ duration: 0.9, delay: 1 }}
          />
        ))}
      </svg>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h3>
      <p className={`mt-2 max-w-md ${dark ? 'text-mist' : 'text-slate'}`}>{text}</p>
      <button type="button" onClick={onReset} className={`mt-6 text-sm font-semibold underline-offset-4 hover:underline ${dark ? 'text-gold-2' : 'text-brand'}`}>
        Send another
      </button>
    </motion.div>
  )
}

// Generic form: renders fields, validates required/email, submits, then shows the success state.
export default function Form({ kind, fields, values, setValue, onReset, submitLabel, success, dark = false }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [failure, setFailure] = useState('')
  const [trap, setTrap] = useState('')

  const validate = () => {
    const e = {}
    for (const f of fields) {
      const v = (values[f.name] || '').trim()
      if (f.required && !v) e[f.name] = `Please enter your ${f.label.toLowerCase()}.`
      else if (f.type === 'email' && v && !EMAIL.test(v)) e[f.name] = 'Please enter a valid email address.'
    }
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    if (trap) return setStatus('done') // bot filled the hidden field
    setStatus('sending')
    setFailure('')
    try {
      await submitForm(kind, values)
      setStatus('done')
    } catch (err) {
      setFailure(err.message || 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const change = (name, v) => {
    setValue(name, v)
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'done' ? (
        <Success
          key="ok"
          {...success}
          dark={dark}
          onReset={() => {
            onReset()
            setStatus('idle')
          }}
        />
      ) : (
        <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="grid gap-3.5 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.name} field={f} value={values[f.name] || ''} error={errors[f.name]} onChange={change} dark={dark} />
          ))}
          <input type="text" name="company_website" value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="mt-2 flex flex-wrap items-center gap-4 sm:col-span-2">
            <Button as="button" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : submitLabel}
            </Button>
            <p className={`text-sm ${dark ? 'text-mist' : 'text-slate'}`}>Fields marked * are required.</p>
            {failure && (
              <p role="alert" className="w-full text-sm text-chilli">
                {failure}
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
