import { motion } from 'framer-motion'
import { rng } from '../../lib/random.js'
import { MarkShapes } from '../Logo.jsx'

// Illustrated "lens" scenes for the hero journey: farm → crop → product → packaging → container → ship.
// Each is a 400×400 SVG cropped to a circle by the stage.

const ease = [0.22, 1, 0.36, 1]

const FIELDS = (() => {
  const r = rng(3)
  const N = 7
  const c = 400 / (N - 1)
  const pts = []
  for (let i = 0; i < N; i++) {
    pts.push([])
    for (let j = 0; j < N; j++) {
      const edge = i === 0 || j === 0 || i === N - 1 || j === N - 1
      pts[i].push([j * c + (edge ? 0 : (r() - 0.5) * c * 0.5), i * c + (edge ? 0 : (r() - 0.5) * c * 0.5)])
    }
  }
  const colors = ['#3f8f55', '#5a9e4b', '#2c6e3f', '#b9a65a', '#7aa84f', '#8a6a45', '#4f8a3a', '#c8b46e']
  const cells = []
  for (let i = 0; i < N - 1; i++)
    for (let j = 0; j < N - 1; j++) {
      const q = [pts[i][j], pts[i][j + 1], pts[i + 1][j + 1], pts[i + 1][j]]
      cells.push({ d: 'M' + q.map((p) => p.join(' ')).join('L') + 'Z', fill: colors[Math.floor(r() * colors.length)], rows: Math.floor(r() * 3) })
    }
  const trees = Array.from({ length: 70 }, () => {
    const i = 1 + Math.floor(r() * (N - 2))
    const j = Math.floor(r() * (N - 1))
    const [a, b] = [pts[i][j], pts[i][j + 1]]
    const t = r()
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + (r() - 0.5) * 4, 2.5 + r() * 3]
  })
  return { cells, trees }
})()

export function FarmScene() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        {[0, 35, 90].map((a, i) => (
          <pattern key={i} id={`rows${i}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform={`rotate(${a})`}>
            <line x1="0" y1="0" x2="0" y2="7" stroke="#0b2416" strokeOpacity=".22" strokeWidth="2" />
          </pattern>
        ))}
        <radialGradient id="farmlight" cx=".3" cy=".2" r="1">
          <stop offset="0" stopColor="#fff3dc" stopOpacity=".35" />
          <stop offset="1" stopColor="#0b2416" stopOpacity=".35" />
        </radialGradient>
      </defs>
      <motion.g initial={{ scale: 1 }} animate={{ scale: 1.25 }} transition={{ duration: 1.6, ease: 'linear' }} style={{ originX: '55%', originY: '60%' }}>
        <rect width="400" height="400" fill="#6b5a3a" />
        {FIELDS.cells.map((c, i) => (
          <g key={i}>
            <path d={c.d} fill={c.fill} stroke="#3b3324" strokeWidth="2.5" />
            <path d={c.d} fill={`url(#rows${c.rows})`} />
          </g>
        ))}
        <path d="M-10 120 C 80 150 120 90 200 140 S 330 260 410 230" stroke="#2f5f96" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M-10 120 C 80 150 120 90 200 140 S 330 260 410 230" stroke="#6fa3d6" strokeWidth="4" fill="none" strokeOpacity=".6" />
        <path d="M120 410 C 140 300 230 260 260 -10" stroke="#d9c7a0" strokeWidth="5" fill="none" />
        {FIELDS.trees.map(([x, y, s], i) => (
          <circle key={i} cx={x} cy={y} r={s} fill="#1f4a2c" />
        ))}
        <rect width="400" height="400" fill="url(#farmlight)" />
      </motion.g>
    </svg>
  )
}

const STALKS = (() => {
  const r = rng(8)
  return Array.from({ length: 46 }, (_, i) => {
    const x = (i / 45) * 440 - 20 + (r() - 0.5) * 12
    const h = 170 + r() * 150
    const bend = 30 + r() * 40
    const back = r() < 0.45
    return { x, h, bend, back, delay: -r() * 3, d: 2.6 + r() * 1.6 }
  }).sort((a, b) => Number(b.back) - Number(a.back))
})()

export function CropScene() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e6b3a" />
          <stop offset=".55" stopColor="#c9703a" />
          <stop offset="1" stopColor="#f3c27a" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#dawn)" />
      <circle cx="270" cy="210" r="44" fill="#ffd89a" opacity=".9" />
      <path d="M0 250 Q 100 238 200 248 T 400 244 V 400 H 0Z" fill="#4c6b33" />
      <motion.g initial={{ scale: 1, y: 0 }} animate={{ scale: 1.15, y: 10 }} transition={{ duration: 1.4, ease: 'linear' }} style={{ originX: '50%', originY: '100%' }}>
        {STALKS.map((s, i) => {
          const top = 400 - s.h
          const tipX = s.x + s.bend
          return (
            <g key={i} className="float" style={{ '--d': `${s.d}s`, '--delay': `${s.delay}s`, transformOrigin: `${s.x}px 400px` }} opacity={s.back ? 0.6 : 1}>
              <path d={`M${s.x} 400 Q ${s.x + 4} ${top + 40} ${tipX} ${top + 30}`} stroke={s.back ? '#5d7f2e' : '#7c9a33'} strokeWidth={s.back ? 2.5 : 3.5} fill="none" strokeLinecap="round" />
              <path d={`M${s.x + 2} 400 Q ${s.x - 30} ${top + 120} ${s.x - 46} ${top + 150}`} stroke="#5f8a2c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <ellipse key={k} cx={tipX - k * 2 + 2} cy={top + 30 + k * 9} rx="3.6" ry="6" fill={s.back ? '#c9a54a' : '#e4c062'} transform={`rotate(${20 + k * 6} ${tipX - k * 2 + 2} ${top + 30 + k * 9})`} />
              ))}
            </g>
          )
        })}
      </motion.g>
    </svg>
  )
}

function Glow({ id = 'pglow' }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx=".5" cy=".5" r=".6">
          <stop offset="0" stopColor="#1f5a36" />
          <stop offset="1" stopColor="#0b2416" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id})`} />
    </>
  )
}

const Grain = (p) => (
  <g {...p}>
    <ellipse cx="0" cy="0" rx="46" ry="17" fill="#f6efdc" />
    <ellipse cx="-8" cy="-6" rx="26" ry="5" fill="#fff" opacity=".7" />
    <path d="M-40 4 Q 0 14 40 4" stroke="#d6c69f" strokeWidth="2" fill="none" />
  </g>
)
const SmallChilli = (p) => (
  <g {...p}>
    <path d="M0 -9 C 40 -13 80 -6 112 12 C 80 6 40 10 0 9 Q -5 0 0 -9Z" fill="#c62f1d" />
    <path d="M10 -5 C 40 -8 70 -3 95 8" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M1 -10 c-7 4-7 16 0 20 c-6-1-9-5-9-10 s3-9 9-10z" fill="#3e7a3a" />
    <path d="M-6 0 q-10-2-15-12" stroke="#3e7a3a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </g>
)
const SmallLeaf = (p) => (
  <g {...p}>
    <path d="M0 0 C 20 -26 70 -26 96 0 C 70 26 20 26 0 0Z" fill="#3f8f55" />
    <path d="M4 0 H 90" stroke="#d8efc9" strokeOpacity=".5" strokeWidth="1.6" />
    <path d="M20 -10 Q 48 -20 76 -8" stroke="#fff" strokeOpacity=".25" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
)

export function ProductScene() {
  const item = (i) => ({
    initial: { opacity: 0, scale: 0.4, rotate: -30 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease },
  })
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <Glow />
      <circle cx="200" cy="200" r="120" fill="#d99a1f" opacity=".08" />
      <motion.g {...item(0)} style={{ originX: '200px', originY: '150px' }}>
        <Grain transform="translate(200 145) rotate(-12)" />
      </motion.g>
      <motion.g {...item(1)} style={{ originX: '140px', originY: '240px' }}>
        <SmallChilli transform="translate(90 250) rotate(-18)" />
      </motion.g>
      <motion.g {...item(2)} style={{ originX: '260px', originY: '250px' }}>
        <SmallLeaf transform="translate(220 270) rotate(-32)" />
      </motion.g>
    </svg>
  )
}

export function PackScene() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <linearGradient id="kraft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b48d5c" />
          <stop offset=".45" stopColor="#d9b783" />
          <stop offset="1" stopColor="#9c7647" />
        </linearGradient>
      </defs>
      <Glow id="pglow2" />
      <motion.g initial={{ opacity: 1, scale: 1, y: 0 }} animate={{ opacity: 0, scale: 0.3, y: 70 }} transition={{ duration: 0.6, ease }} style={{ originX: '200px', originY: '140px' }}>
        <Grain transform="translate(200 120) rotate(-12) scale(.6)" />
        <SmallChilli transform="translate(140 160) rotate(-18) scale(.6)" />
        <SmallLeaf transform="translate(220 170) rotate(-32) scale(.6)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease }} style={{ originX: '200px', originY: '330px' }}>
        <ellipse cx="200" cy="336" rx="90" ry="10" fill="#000" opacity=".35" />
        <path d="M128 132 L 272 132 L 284 320 Q 200 336 116 320 Z" fill="url(#kraft)" />
        <path d="M128 132 L 272 132 L 268 116 L 132 116 Z" fill="#a17a4a" />
        <path d="M134 124 H 266" stroke="#7d5c33" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="140" y="190" width="120" height="96" rx="10" fill="#1e6b3a" />
        <MarkShapes transform="translate(186 200) scale(.28)" />
        <text x="200" y="256" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700" letterSpacing="1" fontFamily="Outfit, sans-serif">
          SAMPATKARI
        </text>
        <rect x="176" y="266" width="48" height="2" fill="#d99a1f" />
        <path d="M150 150 Q 158 230 150 310" stroke="#fff" strokeOpacity=".12" strokeWidth="10" fill="none" />
      </motion.g>
    </svg>
  )
}

export function ContainerScene() {
  const cartons = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cartons.push([c, r])
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <pattern id="corr" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#25804a" />
          <rect width="4" height="10" fill="#1e6b3a" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="#0f2f1d" />
      <rect y="320" width="400" height="80" fill="#0b2416" />
      <rect x="70" y="100" width="260" height="220" rx="4" fill="#08190f" stroke="#2c6e3f" strokeWidth="8" />
      {cartons.map(([c, r], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -120 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 + i * 0.035, ease }}
        >
          <rect x={92 + c * 55} y={252 - r * 62} width="50" height="56" rx="3" fill="#c9a170" stroke="#8f6a3c" strokeWidth="2" />
          <path d={`M${92 + c * 55} ${270 - r * 62} h50`} stroke="#8f6a3c" strokeWidth="1.5" />
          <circle cx={117 + c * 55} cy={290 - r * 62} r="5" fill="#1e6b3a" />
        </motion.g>
      ))}
      {[0, 1].map((s) => (
        <motion.g key={s} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45, delay: 0.75, ease }} style={{ originX: s ? '330px' : '70px', originY: '0px' }}>
          <rect x={s ? 200 : 70} y="100" width="130" height="220" fill="url(#corr)" stroke="#2c6e3f" strokeWidth="4" />
          <rect x={s ? 214 : 176} y="112" width="6" height="196" rx="3" fill="#9fb8a6" />
          <rect x={s ? 234 : 156} y="112" width="6" height="196" rx="3" fill="#9fb8a6" />
          {s === 0 && (
            <MarkShapes transform="translate(110 168) scale(.5)" />
          )}
          {s === 1 && (
            <text x="285" y="214" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" letterSpacing="1" fontFamily="Outfit, sans-serif">
              SAMPATKARI
            </text>
          )}
        </motion.g>
      ))}
      <rect x="66" y="94" width="268" height="10" fill="#d99a1f" />
    </svg>
  )
}

const STACK = (() => {
  const r = rng(14)
  const fills = ['#25804a', '#d99a1f', '#3f8f55', '#c8ccd8', '#1e6b3a', '#b8321f', '#2c6e3f']
  const s = []
  for (let row = 0; row < 3; row++) for (let c = 0; c < 9 - row; c++) s.push({ x: 92 + c * 26 + row * 6, y: 236 - row * 16, f: fills[Math.floor(r() * fills.length)] })
  return s
})()

export function ShipScene() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#133b24" />
          <stop offset=".62" stopColor="#7a4a52" />
          <stop offset=".75" stopColor="#e3954d" />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#25804a" />
          <stop offset="1" stopColor="#0b2416" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dusk)" />
      <circle cx="300" cy="262" r="30" fill="#ffcf8a" />
      <rect y="270" width="400" height="130" fill="url(#sea)" />
      <path d="M260 280 h80 M250 292 h100 M270 304 h60" stroke="#e8b84a" strokeOpacity=".5" strokeWidth="2" />
      <g stroke="#2a5a3a" strokeWidth="5" fill="none">
        <path d="M40 270 V 90 H 210" />
        <path d="M60 270 V 110" />
        <path d="M40 120 L 60 100 M40 160 L 60 140 M40 200 L 60 180 M40 240 L 60 220" strokeWidth="3" />
      </g>
      <motion.g initial={{ x: 0 }} animate={{ x: 18 }} transition={{ duration: 1.6, ease: 'linear' }}>
        {STACK.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width="24" height="14" fill={c.f} stroke="#0b2416" strokeWidth="1" />
        ))}
        <path d="M70 252 H 340 L 322 300 H 92 Z" fill="#0d2a1a" />
        <path d="M74 262 H 336" stroke="#d99a1f" strokeWidth="3" />
        <rect x="300" y="196" width="30" height="56" fill="#dfe3ee" />
        <rect x="304" y="204" width="22" height="6" fill="#1e6b3a" />
        <rect x="312" y="184" width="8" height="14" fill="#b8321f" />
      </motion.g>
      <motion.g initial={{ y: -60 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease }}>
        <line x1="170" y1="90" x2="170" y2="178" stroke="#9fb8a6" strokeWidth="2" />
        <rect x="155" y="178" width="30" height="16" fill="#d99a1f" stroke="#0b2416" />
      </motion.g>
      <path d="M0 330 q 20 -6 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" stroke="#4c9a5a" strokeOpacity=".5" strokeWidth="2" fill="none" />
    </svg>
  )
}

export const SCENES = [
  { key: 'farm', label: 'Indian farm', Comp: FarmScene, ms: 1250 },
  { key: 'crop', label: 'Crop', Comp: CropScene, ms: 1050 },
  { key: 'product', label: 'Product', Comp: ProductScene, ms: 1050 },
  { key: 'pack', label: 'Packaging', Comp: PackScene, ms: 1150 },
  { key: 'container', label: 'Container', Comp: ContainerScene, ms: 1250 },
  { key: 'ship', label: 'Cargo ship', Comp: ShipScene, ms: 1300 },
]
