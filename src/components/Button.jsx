import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import Icon from './Icons.jsx'
import { useReducedMotion } from '../lib/hooks.js'

const styles = {
  primary: 'bg-saffron text-night hover:bg-saffron-2 shadow-[0_10px_30px_-12px_rgba(232,137,43,0.8)]',
  light: 'bg-white text-ink hover:bg-paper shadow-[0_10px_30px_-14px_rgba(12,20,49,0.5)]',
  ink: 'bg-ink text-white hover:bg-ink-2 shadow-[0_12px_30px_-14px_rgba(27,42,94,0.8)]',
  ghost: 'border border-white/30 text-white hover:border-white/70 hover:bg-white/5',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.03]',
}

// Pill button with a gentle magnetic pull and a double-arrow hover.
export default function Button({ as = 'a', variant = 'primary', arrow = true, magnetic = true, className = '', children, ...props }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 260, damping: 18 })
  const y = useSpring(0, { stiffness: 260, damping: 18 })
  const Comp = motion[as]

  const onMove = (e) => {
    if (!magnetic || reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.22)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Comp
      ref={ref}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-semibold tracking-[-0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {arrow && (
        <span className="relative -mr-1 inline-flex h-5 w-5 overflow-hidden" aria-hidden="true">
          <Icon name="arrow" className="absolute size-5 transition-transform duration-500 ease-out-soft group-hover:translate-x-6" />
          <Icon name="arrow" className="absolute size-5 -translate-x-6 transition-transform duration-500 ease-out-soft group-hover:translate-x-0" />
        </span>
      )}
    </Comp>
  )
}
