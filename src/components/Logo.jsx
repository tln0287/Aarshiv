import { useId } from 'react'

// The sprout mark's shapes in a 100×100 box, for embedding inside other SVG illustrations.
// `dark` draws the full-colour version for light backgrounds; otherwise the white-and-gold version for dark ones.
export function MarkShapes({ dark = false, ring = true, ...props }) {
  const id = 'm' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const stem = dark ? 'var(--color-earth)' : '#fff'
  const soil = dark ? 'var(--color-earth)' : 'var(--color-gold)'
  return (
    <g {...props}>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dark ? '#8cc63f' : '#c4e69a'} />
          <stop offset="1" stopColor={dark ? '#3e8e41' : '#8cc63f'} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dark ? '#8cc63f' : '#ffffff'} />
          <stop offset="1" stopColor={dark ? '#2f7d3a' : '#e3f1d4'} />
        </linearGradient>
      </defs>
      {ring && <path d="M6.7 42.4A44 44 0 1 0 65 8.7" fill="none" stroke="var(--color-gold)" strokeWidth="3.6" strokeLinecap="round" />}
      <path d="M49 50C44 37 31 31 17 32C17 45 32 53 49 50Z" fill={`url(#${id}l)`} />
      <path d="M51 49C54 32 68 23 85 22C86 38 71 52 51 49Z" fill={`url(#${id}r)`} />
      <path d="M50 83V48" stroke={stem} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M28 84Q50 74 72 84" fill="none" stroke={soil} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  )
}

export function Mark({ className = 'size-9', dark = false, ring = true }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <MarkShapes dark={dark} ring={ring} />
    </svg>
  )
}

export default function Logo({ dark = false, compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark dark={dark} className={compact ? 'size-9' : 'size-11'} />
      <span className="flex flex-col leading-none">
        <span className={`font-bold tracking-[-0.01em] ${compact ? 'text-[1.2rem]' : 'text-[1.4rem]'} ${dark ? 'text-logo' : 'text-white'}`}>Sampatkari</span>
        <span className={`mt-1 flex items-center gap-2 ${compact ? 'text-[0.5rem]' : 'text-[0.56rem]'}`}>
          <span className="font-semibold tracking-[0.32em] text-gold">AGRO</span>
          <span className="h-px w-4 bg-leaf" />
          <span className={`tracking-[0.24em] ${dark ? 'text-slate' : 'text-mist'}`}>PVT. LTD.</span>
        </span>
      </span>
    </span>
  )
}
