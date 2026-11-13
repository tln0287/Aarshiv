// Reads theme colours from the CSS variables in index.css, so canvas and WebGL drawings follow the theme too.
export function cssColor(name, fallback) {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim()
  return v || fallback
}

// '#rrggbb' + alpha → 'rgba(r,g,b,a)' for canvas strokes and fills.
export function withAlpha(hex, a) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

export function globePalette() {
  return {
    sea: cssColor('globe-sea', '#f3f8f7'),
    edge: cssColor('globe-edge', '#c3d8d9'),
    land: cssColor('globe-land', '#3e9a4c'),
    glow: cssColor('globe-glow', '#7cc56c'),
    origin: cssColor('gold', '#d99a1f'),
    dash: cssColor('gold-deep', '#c27c0e'),
    marker: cssColor('brand', '#23773a'),
  }
}
