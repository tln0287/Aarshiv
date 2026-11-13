import { memo, useId } from 'react'
import { rng } from '../lib/random.js'

// Procedural studio-style illustrations for each product. Geometry is precomputed once with a seeded
// generator so it is stable between renders and costs nothing at runtime.

const R2D = 180 / Math.PI

function chilliPath(L, w, curl) {
  return `M0 ${-w} C ${L * 0.3} ${-w * 1.25}, ${L * 0.7} ${-w * 0.6 + curl * 0.4}, ${L} ${curl} C ${L * 0.72} ${w * 0.5 + curl * 0.55}, ${L * 0.32} ${w * 1.1}, 0 ${w} Q ${-w * 0.45} 0 0 ${-w} Z`
}

function Chilli({ x, y, rot, L, w, curl = 6, fill, stem = '#3e7a3a', shine = 0.35, wrinkle = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M-3 0 q -10 -2 -15 -12`} stroke={stem} strokeWidth={Math.max(2, w * 0.28)} fill="none" strokeLinecap="round" />
      <path d={chilliPath(L, w, curl)} fill={fill} />
      {wrinkle && (
        <path
          d={`M ${L * 0.15} ${w * 0.2} q ${L * 0.1} -4 ${L * 0.2} 0 t ${L * 0.2} 0 t ${L * 0.2} ${curl * 0.4}`}
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="1.4"
          fill="none"
        />
      )}
      <path
        d={`M ${L * 0.1} ${-w * 0.55} C ${L * 0.35} ${-w * 0.8}, ${L * 0.6} ${-w * 0.35}, ${L * 0.82} ${curl * 0.55}`}
        stroke="#fff"
        strokeOpacity={shine}
        strokeWidth={Math.max(1.2, w * 0.3)}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M1 ${-w * 1.05} c -7 ${w * 0.4} -7 ${w * 1.7} 0 ${w * 2.1} c -5 -1 -8 -${w * 0.5} -8 -${w * 1.05} s 3 -${w * 0.95} 8 -${w * 1.05}z`}
        fill={stem}
      />
    </g>
  )
}

function Pod({ x, y, rot, L = 46, W = 15, fill, open = false }) {
  const d = `M${-L / 2} 0 C ${-L / 4} ${-W} ${L / 4} ${-W} ${L / 2} 0 C ${L / 4} ${W} ${-L / 4} ${W} ${-L / 2} 0Z`
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill={fill} />
      <path d={`M${-L * 0.4} ${-W * 0.12} Q 0 ${-W * 0.62} ${L * 0.4} ${-W * 0.12}`} stroke="#fff" strokeOpacity=".28" strokeWidth="2" fill="none" />
      <path d={`M${-L * 0.42} ${W * 0.16} Q 0 ${W * 0.45} ${L * 0.42} ${W * 0.16}`} stroke="#1f3d17" strokeOpacity=".25" strokeWidth="1.2" fill="none" />
      <path d={`M${-L * 0.45} 0 H ${L * 0.45}`} stroke="#1f3d17" strokeOpacity=".18" strokeWidth="1" />
      <path d={`M${L / 2 - 1} 0 l 5 -1.5`} stroke="#6b5a35" strokeWidth="2.2" strokeLinecap="round" />
      {open && (
        <g>
          <ellipse cx="0" cy="0" rx={L * 0.3} ry={W * 0.32} fill="#2b2118" />
          {[-8, -3, 2, 7].map((sx, i) => (
            <circle key={i} cx={sx} cy={i % 2 ? 1.5 : -1.5} r="2.6" fill="#3d2e22" stroke="#5a4634" strokeWidth=".6" />
          ))}
        </g>
      )}
    </g>
  )
}

const leafD = (l, w) => `M0 0 C ${l * 0.22} ${-w}, ${l * 0.7} ${-w * 0.95}, ${l} 0 C ${l * 0.7} ${w * 0.95}, ${l * 0.22} ${w}, 0 0Z`

function bez(p0, p1, p2, p3, t) {
  const u = 1 - t
  const pt = (i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]
  const dt = (i) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i])
  return { x: pt(0), y: pt(1), a: Math.atan2(dt(1), dt(0)) * R2D }
}

/* ---------- precomputed geometry ---------- */

const RICE = (() => {
  const r = rng(11)
  const grains = []
  for (let i = 0; i < 330; i++) {
    const x = 200 + (r() * 2 - 1) * 118
    const y = 112 + r() * 92
    const dx = (x - 200) / 120
    const dy = (y - 200) / 84
    if (dx * dx + dy * dy > 1 || y > 200) continue
    grains.push({ x, y, a: r() * 180, s: 0.85 + r() * 0.35, t: r() })
  }
  grains.sort((a, b) => a.y - b.y)
  const floating = Array.from({ length: 9 }, (_, i) => ({
    x: 70 + r() * 260,
    y: 30 + r() * 70,
    a: r() * 180,
    d: 4 + r() * 3,
    delay: -r() * 4,
    s: 1 + r() * 0.5,
    i,
  }))
  return { grains, floating }
})()

const GUNTUR = (() => {
  const r = rng(5)
  const list = []
  for (let i = 0; i < 74; i++) {
    const y = 128 + Math.pow(r(), 0.8) * 138
    const half = 168 * Math.sqrt(Math.max(0.02, (y - 118) / 150))
    const x = 200 + (r() * 2 - 1) * half
    list.push({
      x,
      y,
      rot: (r() * 2 - 1) * 38 + (r() > 0.5 ? 180 : 0),
      L: 72 + r() * 42,
      w: 8.5 + r() * 4,
      curl: (r() * 2 - 1) * 10,
      shade: Math.floor(r() * 3),
      wrinkle: r() > 0.55,
    })
  }
  list.sort((a, b) => a.y - b.y)
  return list
})()

const CURRY = (() => {
  const P = [[78, 282], [140, 210], [210, 150], [336, 64]]
  const leaves = []
  const n = 15
  for (let i = 0; i < n; i++) {
    const t = 0.1 + (i / (n - 1)) * 0.82
    const p = bez(...P, t)
    const side = i % 2 ? 1 : -1
    const l = 78 - t * 30
    leaves.push({ x: p.x, y: p.y, rot: p.a + side * 58, l, w: l * 0.27, light: i % 3 === 0 })
  }
  const tip = bez(...P, 1)
  leaves.push({ x: tip.x, y: tip.y, rot: tip.a, l: 50, w: 13, light: true })
  return { P, leaves }
})()

const MORINGA = (() => {
  const P = [[60, 250], [130, 170], [220, 110], [330, 70]]
  const pinnae = []
  const r = rng(9)
  for (let i = 0; i < 7; i++) {
    const t = 0.12 + i * 0.13
    const p = bez(...P, t)
    const side = i % 2 ? 1 : -1
    const ang = (p.a + side * 62) / R2D
    const len = 92 - i * 7
    const end = [p.x + Math.cos(ang) * len, p.y + Math.sin(ang) * len]
    const leaflets = []
    const m = 5
    for (let j = 1; j <= m; j++) {
      const k = j / (m + 0.4)
      const cx = p.x + Math.cos(ang) * len * k
      const cy = p.y + Math.sin(ang) * len * k
      for (const s of [-1, 1]) {
        const a2 = ang + (s * Math.PI) / 2.3
        leaflets.push({ x: cx + Math.cos(a2) * 9, y: cy + Math.sin(a2) * 9, rot: a2 * R2D, s: 0.85 + r() * 0.3 })
      }
    }
    leaflets.push({ x: end[0] + Math.cos(ang) * 6, y: end[1] + Math.sin(ang) * 6, rot: ang * R2D, s: 1 })
    pinnae.push({ from: [p.x, p.y], to: end, leaflets })
  }
  return { P, pinnae }
})()

const CARDAMOM = (() => {
  const r = rng(21)
  const pods = []
  for (let i = 0; i < 30; i++) {
    const y = 170 + Math.pow(r(), 0.9) * 95
    const half = 150 * Math.sqrt((y - 160) / 110)
    pods.push({ x: 200 + (r() * 2 - 1) * half, y, rot: r() * 180, L: 40 + r() * 12, W: 13 + r() * 4, shade: Math.floor(r() * 3) })
  }
  pods.sort((a, b) => a.y - b.y)
  pods[pods.length - 4].open = true
  return pods
})()

/* ---------- art ---------- */

function Ground({ rx = 150 }) {
  return <ellipse cx="200" cy="288" rx={rx} ry="16" fill="#0b2416" opacity=".14" />
}

function RiceArt({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}bowl`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f7a45" />
          <stop offset="1" stopColor="#0f3020" />
        </linearGradient>
        <radialGradient id={`${id}heap`} cx=".45" cy=".3" r=".8">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#d8cba9" />
        </radialGradient>
      </defs>
      <Ground rx={140} />
      <path d="M78 196 Q 84 276 200 280 Q 316 276 322 196 Z" fill={`url(#${id}bowl)`} />
      <path d="M200 112 C 262 112 318 160 320 198 L 80 198 C 82 160 138 112 200 112 Z" fill={`url(#${id}heap)`} />
      {RICE.grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.x}
          cy={g.y}
          rx={6 * g.s}
          ry={2.1 * g.s}
          transform={`rotate(${g.a} ${g.x} ${g.y})`}
          fill={g.t > 0.7 ? '#fffdf6' : '#f3ead5'}
          stroke="#cdbf9c"
          strokeWidth=".5"
        />
      ))}
      <ellipse cx="200" cy="198" rx="122" ry="14" fill="none" stroke="#4c9a5a" strokeWidth="3" opacity=".7" />
      <path d="M96 214 Q 110 258 170 266" stroke="#fff" strokeOpacity=".16" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M226 246 l 30 -4" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity=".9" />
      {RICE.floating.map((g) => (
        <g key={g.i} className="float" style={{ '--d': `${g.d}s`, '--delay': `${g.delay}s` }}>
          <ellipse cx={g.x} cy={g.y} rx={6 * g.s} ry={2.2 * g.s} transform={`rotate(${g.a} ${g.x} ${g.y})`} fill="#fffaf0" stroke="#cdbf9c" strokeWidth=".5" />
        </g>
      ))}
    </>
  )
}

function GunturArt({ id }) {
  const fills = [`url(#${id}c0)`, `url(#${id}c1)`, `url(#${id}c2)`]
  return (
    <>
      <defs>
        {[
          ['#7c140c', '#c62f1d'],
          ['#951b10', '#e04527'],
          ['#6a110b', '#b02818'],
        ].map(([a, b], i) => (
          <linearGradient key={i} id={`${id}c${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={b} />
            <stop offset="1" stopColor={a} />
          </linearGradient>
        ))}
      </defs>
      <Ground rx={175} />
      {GUNTUR.map((c, i) => (
        <Chilli key={i} {...c} fill={fills[c.shade]} stem="#4d6b2c" shine={0.28} />
      ))}
      <Chilli x={250} y={276} rot={-8} L={120} w={11} curl={8} fill={fills[1]} stem="#4d6b2c" />
    </>
  )
}

function ChilliesArt({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e5462a" />
          <stop offset="1" stopColor="#9b1d12" />
        </linearGradient>
        <linearGradient id={`${id}dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a52617" />
          <stop offset="1" stopColor="#5e0f09" />
        </linearGradient>
        <linearGradient id={`${id}green`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fb34f" />
          <stop offset="1" stopColor="#2d6b2a" />
        </linearGradient>
        <linearGradient id={`${id}orange`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f39a3a" />
          <stop offset="1" stopColor="#c55a17" />
        </linearGradient>
      </defs>
      <Ground rx={160} />
      <Chilli x={70} y={246} rot={-24} L={250} w={11} curl={14} fill={`url(#${id}red)`} />
      <Chilli x={92} y={262} rot={-6} L={200} w={16} curl={-8} fill={`url(#${id}dark)`} wrinkle shine={0.2} />
      <Chilli x={82} y={226} rot={-44} L={210} w={10} curl={-18} fill={`url(#${id}green)`} stem="#2f5d25" />
      <Chilli x={250} y={268} rot={-160} L={86} w={7} curl={4} fill={`url(#${id}orange)`} />
      <Chilli x={292} y={250} rot={-200} L={70} w={6} curl={-3} fill={`url(#${id}red)`} />
    </>
  )
}

function CurryArt({ id }) {
  const [p0, p1, p2, p3] = CURRY.P
  return (
    <>
      <defs>
        <linearGradient id={`${id}lf`} x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#4f9d5f" />
          <stop offset="1" stopColor="#1f5a33" />
        </linearGradient>
        <linearGradient id={`${id}lf2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#63b06c" />
          <stop offset="1" stopColor="#2c6e3f" />
        </linearGradient>
      </defs>
      <Ground rx={130} />
      <path d={`M${p0} C ${p1} ${p2} ${p3}`} stroke="#3c5a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
      {CURRY.leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
          <path d={leafD(l.l, l.w)} fill={l.light ? `url(#${id}lf2)` : `url(#${id}lf)`} />
          <path d={`M2 0 L ${l.l - 4} 0`} stroke="#d8efc9" strokeOpacity=".45" strokeWidth="1.1" />
          <path d={`M${l.l * 0.2} ${-l.w * 0.45} Q ${l.l * 0.5} ${-l.w * 0.75} ${l.l * 0.78} ${-l.w * 0.3}`} stroke="#fff" strokeOpacity=".22" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </>
  )
}

function MoringaArt({ id }) {
  const [p0, p1, p2, p3] = MORINGA.P
  return (
    <>
      <defs>
        <radialGradient id={`${id}lt`} cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#8cc46a" />
          <stop offset="1" stopColor="#3f8f55" />
        </radialGradient>
        <radialGradient id={`${id}pw`} cx=".45" cy=".25" r=".9">
          <stop offset="0" stopColor="#a9c46b" />
          <stop offset="1" stopColor="#5f7f2f" />
        </radialGradient>
        <linearGradient id={`${id}dish`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f7a45" />
          <stop offset="1" stopColor="#133b24" />
        </linearGradient>
      </defs>
      <Ground rx={150} />
      <path d={`M${p0} C ${p1} ${p2} ${p3}`} stroke="#5d6b35" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {MORINGA.pinnae.map((p, i) => (
        <g key={i}>
          <path d={`M${p.from} L ${p.to}`} stroke="#6b7a3c" strokeWidth="1.6" />
          {p.leaflets.map((l, j) => (
            <ellipse key={j} cx={l.x} cy={l.y} rx={9 * l.s} ry={6 * l.s} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={`url(#${id}lt)`} />
          ))}
        </g>
      ))}
      <path d="M232 262 Q 236 292 290 293 Q 344 292 348 262 Z" fill={`url(#${id}dish)`} />
      <path d="M236 262 Q 262 226 290 230 Q 320 228 344 262 Z" fill={`url(#${id}pw)`} />
      <ellipse cx="290" cy="262" rx="58" ry="7" fill="none" stroke="#4c9a5a" strokeWidth="2.5" opacity=".7" />
    </>
  )
}

function CardamomArt({ id }) {
  const fills = [`url(#${id}p0)`, `url(#${id}p1)`, `url(#${id}p2)`]
  return (
    <>
      <defs>
        {[
          ['#a7c27a', '#5d8a3e'],
          ['#b7cc8a', '#6a9446'],
          ['#94b46a', '#4f7a35'],
        ].map(([a, b], i) => (
          <linearGradient key={i} id={`${id}p${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
      <Ground rx={160} />
      {CARDAMOM.map((p, i) => (
        <Pod key={i} {...p} fill={fills[p.shade]} />
      ))}
      <g className="float" style={{ '--d': '6s' }}>
        <Pod x={130} y={92} rot={-24} L={60} W={19} fill={fills[1]} />
      </g>
      <g className="float" style={{ '--d': '7s', '--delay': '-2s' }}>
        <Pod x={268} y={78} rot={18} L={54} W={17} fill={fills[0]} />
      </g>
    </>
  )
}

function Pepper({ x, y, s = 1, rot = 0, fill, stem = '#3f6b2a' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M0 -50 C 30 -58 56 -45 53 -10 C 51 25 41 50 19 55 C 9 58 4 50 0 52 C -4 50 -9 58 -19 55 C -41 50 -51 25 -53 -10 C -56 -45 -30 -58 0 -50Z"
        fill={fill}
      />
      <path d="M-18 -44 C -24 -10 -24 25 -14 50 M18 -44 C 24 -10 24 25 14 50" stroke="#000" strokeOpacity=".16" strokeWidth="2.5" fill="none" />
      <path d="M-36 -36 C -44 -16 -42 10 -34 28" stroke="#fff" strokeOpacity=".38" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M-16 -50 Q 0 -62 16 -50 Q 0 -43 -16 -50Z" fill={stem} />
      <path d="M0 -54 q 1 -14 10 -22" stroke={stem} strokeWidth="6" strokeLinecap="round" fill="none" />
    </g>
  )
}

function CapsicumArt({ id }) {
  return (
    <>
      <defs>
        {[
          ['g', '#6fb34f', '#2f6b2a'],
          ['r', '#e5462a', '#9b1d12'],
          ['y', '#ffd24d', '#e09a12'],
        ].map(([k, a, b]) => (
          <linearGradient key={k} id={`${id}${k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
      <Ground rx={165} />
      <Pepper x={120} y={200} s={1.15} rot={-12} fill={`url(#${id}g)`} />
      <Pepper x={290} y={198} s={1.1} rot={14} fill={`url(#${id}y)`} />
      <Pepper x={205} y={222} s={1.3} rot={3} fill={`url(#${id}r)`} />
    </>
  )
}

function Cucumber({ x, y, rot, L = 240, W = 46, fill }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-L / 2} y={-W / 2} width={L} height={W} rx={W / 2} fill={fill} />
      {[-0.22, 0.05, 0.3].map((k, i) => (
        <path key={i} d={`M${-L / 2 + 18} ${k * W} H ${L / 2 - 18}`} stroke="#b9dc8c" strokeOpacity=".35" strokeWidth="3" strokeLinecap="round" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={-L / 2 + 24 + i * ((L - 48) / 13)} cy={(i % 3) * 12 - 12} r="1.8" fill="#163d1d" opacity=".55" />
      ))}
      <path d={`M${-L / 2 + 20} ${-W * 0.3} H ${L / 2 - 30}`} stroke="#fff" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
      <circle cx={-L / 2 + 6} cy="0" r="5" fill="#8a9a4a" />
    </g>
  )
}

function CucumberArt({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}cu`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f8f3c" />
          <stop offset="1" stopColor="#1f4f24" />
        </linearGradient>
        <radialGradient id={`${id}fl`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#e9f4cf" />
          <stop offset="1" stopColor="#bcdc8f" />
        </radialGradient>
      </defs>
      <Ground rx={165} />
      <Cucumber x={190} y={150} rot={-16} fill={`url(#${id}cu)`} />
      <Cucumber x={180} y={215} rot={-6} L={260} W={50} fill={`url(#${id}cu)`} />
      <g transform="translate(305 250)">
        <ellipse cx="0" cy="4" rx="40" ry="38" fill="#2c6b2a" />
        <ellipse cx="0" cy="0" rx="36" ry="34" fill={`url(#${id}fl)`} />
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2
          return <ellipse key={i} cx={Math.cos(a) * 14} cy={Math.sin(a) * 13} rx="4.2" ry="2" fill="#f7fbe8" stroke="#a9c97a" strokeWidth=".6" transform={`rotate(${(a * R2D).toFixed(1)} ${Math.cos(a) * 14} ${Math.sin(a) * 13})`} />
        })}
      </g>
    </>
  )
}

function Onion({ x, y, s = 1, rot = 0, fill }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-8 52 q -6 10 -14 12 M0 52 q 0 12 -3 16 M8 52 q 6 10 12 12" stroke="#c9b48a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M0 -62 C 8 -40 52 -38 55 0 C 57 34 30 54 0 54 C -30 54 -57 34 -55 0 C -52 -38 -8 -40 0 -62Z" fill={fill} />
      <path d="M0 -58 C -20 -30 -36 10 -18 52 M0 -58 C 20 -30 34 10 18 52 M0 -58 V 54" stroke="#4a0f2a" strokeOpacity=".28" strokeWidth="1.6" fill="none" />
      <path d="M-34 -20 C -42 0 -38 22 -26 36" stroke="#fff" strokeOpacity=".3" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M-3 -60 q 3 -14 -2 -24 M2 -60 q 6 -10 4 -20" stroke="#b79a6a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function OnionArt({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}on`} cx=".38" cy=".35" r=".75">
          <stop offset="0" stopColor="#d66a8f" />
          <stop offset="1" stopColor="#6e1a3f" />
        </radialGradient>
      </defs>
      <Ground rx={165} />
      <Onion x={130} y={196} s={1.05} rot={-10} fill={`url(#${id}on)`} />
      <Onion x={262} y={190} s={1.1} rot={9} fill={`url(#${id}on)`} />
      <Onion x={196} y={226} s={1.15} fill={`url(#${id}on)`} />
      <g transform="translate(318 266)">
        {[30, 24, 18, 12, 6].map((r, i) => (
          <ellipse key={r} cx="0" cy="0" rx={r * 1.5} ry={r} fill={i % 2 ? '#f6e6ee' : '#e7c3d3'} stroke="#a8466f" strokeWidth={i === 0 ? 3 : 1} />
        ))}
      </g>
    </>
  )
}

function CoconutArt({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}hu`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#a8784a" />
          <stop offset="1" stopColor="#5a3a1e" />
        </radialGradient>
        <radialGradient id={`${id}me`} cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ece4d2" />
        </radialGradient>
      </defs>
      <Ground rx={160} />
      {[
        [140, 180, -14, 1],
        [250, 168, 12, 0.95],
      ].map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <ellipse cx="0" cy="0" rx="62" ry="74" fill={`url(#${id}hu)`} />
          {Array.from({ length: 16 }, (_, k) => (
            <path key={k} d={`M${-50 + k * 6.5} ${-50 + (k % 3) * 8} q ${4 - (k % 4) * 2} 50 ${(k % 2 ? 1 : -1) * 6} ${80 - (k % 3) * 10}`} stroke="#3b2410" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
          ))}
          <path d="M-6 -74 q -8 -18 -2 -30 M2 -74 q 4 -16 14 -24 M-2 -74 q -16 -10 -24 -8" stroke="#7a5430" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-40 -40 C -52 -10 -48 20 -36 40" stroke="#fff" strokeOpacity=".16" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <g transform="translate(200 250)">
        <ellipse cx="0" cy="6" rx="66" ry="30" fill="#4b2f17" />
        <ellipse cx="0" cy="0" rx="62" ry="24" fill="#6b4524" />
        <ellipse cx="0" cy="0" rx="54" ry="19" fill={`url(#${id}me)`} />
        <ellipse cx="0" cy="2" rx="40" ry="12" fill="#f4efe4" stroke="#e2d8c2" />
      </g>
    </>
  )
}

const ARTS = {
  rice: RiceArt,
  guntur: GunturArt,
  chillies: ChilliesArt,
  curry: CurryArt,
  moringa: MoringaArt,
  cardamom: CardamomArt,
  capsicum: CapsicumArt,
  cucumber: CucumberArt,
  onion: OnionArt,
  coconut: CoconutArt,
}

function ProductArt({ kind, className = '', title }) {
  const id = 'a' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const Art = ARTS[kind]
  return (
    <svg viewBox="0 0 400 320" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <Art id={id} />
    </svg>
  )
}

export default memo(ProductArt)
