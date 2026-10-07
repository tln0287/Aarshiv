// The A-mark's shapes in a 100×100 box, for embedding inside other SVG illustrations.
export function MarkShapes({ dark = false, ...props }) {
  return (
    <g {...props}>
      <path
        d="M17 89 50 12l33 77"
        fill="none"
        stroke={dark ? 'var(--color-ink)' : '#fff'}
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 67q20-15 40 0" fill="none" stroke="var(--color-saffron)" strokeWidth="7.5" strokeLinecap="round" />
      <circle cx="50" cy="49" r="5.6" fill="var(--color-saffron)" />
    </g>
  )
}

export function Mark({ className = 'size-9', dark = false }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <MarkShapes dark={dark} />
    </svg>
  )
}

export default function Logo({ dark = false, compact = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark dark={dark} className={compact ? 'size-8' : 'size-10'} />
      <span className="flex flex-col leading-none">
        <span className={`font-bold tracking-[0.14em] ${compact ? 'text-[1.05rem]' : 'text-xl'} ${dark ? 'text-ink' : 'text-white'}`}>
          AARSHIV
        </span>
        <span className={`mt-1 tracking-[0.42em] ${compact ? 'text-[0.5rem]' : 'text-[0.56rem]'} ${dark ? 'text-slate' : 'text-mist'}`}>
          PRIVATE LIMITED
        </span>
      </span>
    </span>
  )
}
