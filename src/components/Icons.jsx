// Line icons on a 24px grid, drawn for this site. Stroke follows currentColor.
const P = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  sprout: 'M12 21v-9M12 12c0-4 3-7 8-7 0 5-3 7-8 7ZM12 14c0-3-2.5-5.5-7-5.5 0 4 2.5 5.5 7 5.5Z',
  inspect: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-5.2-5.2M7.5 10.5l2 2 3.5-4',
  box: 'M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3ZM3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.3l8.4 4.6',
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3.5 3.5v2.5h-7.5M7 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.5 18.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  ship: 'M3 15.5h18l-2.5 4.5h-13L3 15.5ZM5.5 15.5V11h13v4.5M8 11V7.5h4V11M12 11V5h4v6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.6 5.5 3.6 9S14.5 18.5 12 21c-2.5-2.5-3.6-5.5-3.6-9S9.5 5.5 12 3Z',
  check: 'M4.5 12.5l5 5 10-11',
  shield: 'M12 3l7.5 3v5.5c0 4.5-3.2 8.3-7.5 9.5-4.3-1.2-7.5-5-7.5-9.5V6L12 3ZM8.5 12l2.5 2.5 4.5-5',
  doc: 'M14 3H6.5v18h11V6.5L14 3ZM14 3v3.5h3.5M9 11h6M9 14.5h6M9 18h3.5',
  handshake: 'M2.5 8.5 6 6l3 1.5 3-1.5 2.5 1.2L18 6l3.5 2.5v5.5l-3 2-5.5 4-2-1.5-2 .5-2-2-2.5-.5-2-2.5V8.5ZM9 7.5 6.5 11c1 1 2.5 1 3.5 0l2-2 5 5',
  leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8',
  layers: 'M12 3 2.5 8 12 13l9.5-5L12 3ZM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5',
  route: 'M6 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 16.5H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  mail: 'M3 5.5h18v13H3zM3 6l9 7 9-7',
  phone: 'M5 3.5h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6.5 6.5l1.5-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5A1.5 1.5 0 0 1 5 3.5Z',
  whatsapp: 'M4 20l1.3-4A8.5 8.5 0 1 1 8.4 19L4 20ZM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.4-2.4l.9-1-1-2L9.5 8',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  linkedin: 'M4 4h16v16H4zM8 10.5V16M8 7.5v.5M11.5 16v-5.5M11.5 13c0-1.7 1-2.7 2.3-2.7S16 11 16 13v3',
  instagram: 'M4 4h16v16H4zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16.8 7.2h.01',
  close: 'M6 6l12 12M18 6 6 18',
  menu: 'M4 7h16M4 12h16M4 17h10',
  chevron: 'M9 6l6 6-6 6',
  replay: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5',
  scale: 'M12 4v16M5 20h14M4 8h16M7 8l-3 6a3 3 0 0 0 6 0L7 8ZM17 8l-3 6a3 3 0 0 0 6 0l-3-6Z',
  anchor: 'M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 8v13M8 11.5h8M4.5 13.5c0 4 3.4 7.5 7.5 7.5s7.5-3.5 7.5-7.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2',
  tag: 'M3.5 12.5V3.5h9l8 8-9 9-8-8ZM8 8h.01',
}

// The icon's path alone, for drawing inside another SVG (a nested <svg> there is sized in CSS
// pixels rather than the parent's units, so it would not scale with the drawing).
export function IconShape({ name, strokeWidth = 1.6, ...props }) {
  return (
    <path d={P[name]} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props} />
  )
}

export default function Icon({ name, className = 'size-5', strokeWidth = 1.6, title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={P[name]} />
    </svg>
  )
}
