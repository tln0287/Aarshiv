// Precomputes the dot-matrix land data used by the globe and the flat markets map.
// Run with `npm run geo` — output is committed to src/data/geo.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { feature } from 'topojson-client'
import { geoContains, geoEqualEarth } from 'd3-geo'

const require = createRequire(import.meta.url)
const land110 = require('world-atlas/land-110m.json')
const countries = require('world-atlas/countries-110m.json')

const land = feature(land110, land110.objects.land)
const india = feature(countries, countries.objects.countries).features.find((f) => f.id === '356')

const r = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d

// Globe: evenly distributed points on a sphere (Fibonacci lattice), kept where there is land.
const N = 28000
const globe = []
const golden = Math.PI * (3 - Math.sqrt(5))
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2
  const theta = golden * i
  const lat = (Math.asin(y) * 180) / Math.PI
  const lon = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180
  const p = [lon, lat]
  if (geoContains(land, p)) globe.push([r(lon), r(lat), geoContains(india, p) ? 1 : 0])
}

// Flat map: square grid in Equal Earth screen space.
const W = 1000, H = 520, STEP = 8
const proj = geoEqualEarth().fitSize([W, H], { type: 'Sphere' })
const map = []
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    const ll = proj.invert([x, y])
    if (!ll || Number.isNaN(ll[0])) continue
    const back = proj(ll)
    if (Math.abs(back[0] - x) > 0.5 || Math.abs(back[1] - y) > 0.5) continue
    if (geoContains(land, ll)) map.push([x, y, geoContains(india, ll) ? 1 : 0])
  }
}

const project = (lon, lat) => proj([lon, lat]).map((v) => r(v, 1))

// Origin and target-market regions. These are regions the company aims to serve, not claimed shipments.
const origin = { id: 'india', name: 'India', lon: 78.9, lat: 20.6 }
const markets = [
  { id: 'middle-east', name: 'Middle East', lon: 51.5, lat: 25.3 },
  { id: 'europe', name: 'Europe', lon: 8.5, lat: 50.5 },
  { id: 'southeast-asia', name: 'Southeast Asia', lon: 104, lat: 4 },
  { id: 'africa', name: 'Africa', lon: 30, lat: -2 },
  { id: 'north-america', name: 'North America', lon: -92, lat: 40 },
  { id: 'australia', name: 'Australia', lon: 140, lat: -28 },
]
const withXY = (m) => ({ ...m, xy: project(m.lon, m.lat) })
const out = {
  globe,
  map: { width: W, height: H, step: STEP, dots: map },
  origin: withXY(origin),
  markets: markets.map(withXY),
}
writeFileSync(new URL('../src/data/geo.json', import.meta.url), JSON.stringify(out))
console.log(`globe dots: ${globe.length} (india ${globe.filter((d) => d[2]).length}), map dots: ${map.length}`)
