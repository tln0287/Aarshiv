import { useEffect, useRef, useState } from 'react'
import { arcPoints, faceRotation, rotate, toVec } from '../../lib/geo.js'
import { useReducedMotion } from '../../lib/hooks.js'
import GlobeTooltip from './GlobeTooltip.jsx'
import { globePalette, withAlpha } from '../../lib/theme.js'

// Canvas 2D globe for phones, tablets and browsers without WebGL. Same data and behaviour as GlobeGL,
// drawn with an orthographic projection so it stays smooth on modest hardware.
export default function GlobeLite({ geo, zoomed = true, routes = true, active = true, className = '' }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const reduce = useReducedMotion()
  const [tip, setTip] = useState(null)
  const props = useRef({})
  props.current = { zoomed, routes, reduce, hovering: !!tip }
  const st = useRef({ auto: 0, drag: 0, dragging: false, last: 0, scale: zoomed ? 1 : 2.7, progress: routes ? 1 : 0, px: 0, markers: [] })

  useEffect(() => {
    if (!geo || !active) return
    const ctx = canvas.current.getContext('2d')
    const pal = globePalette()
    const face = faceRotation(geo.origin.lon, geo.origin.lat)
    const dots = geo.globe.map(([lon, lat, india]) => [toVec(lon, lat), india])
    const arcs = geo.markets.map((m) => arcPoints(geo.origin, m, 56))
    const places = [geo.origin, ...geo.markets].map((p) => ({ p, v: toVec(p.lon, p.lat, 1.004) }))
    let w = 0, h = 0, dpr = 1, raf = 0, prev = performance.now()

    const resize = () => {
      // The observer can fire once more after this fallback is swapped for the WebGL globe.
      if (!wrap.current || !canvas.current) return
      const r = wrap.current.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.current.width = Math.round(w * dpr)
      canvas.current.height = Math.round(h * dpr)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap.current)
    resize()

    const frame = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      const s = st.current
      const P = props.current
      if (!P.reduce && !P.hovering && !s.dragging) s.auto += dt * 0.055
      s.scale += ((P.zoomed ? 1 : 2.7) - s.scale) * (1 - Math.exp(-2.1 * dt))
      s.progress = P.routes ? (P.reduce ? 1 : Math.min(1, s.progress + dt / 1.8)) : 0
      const ry = face.y + s.auto + s.drag + s.px * 0.2
      const rx = face.x * 0.8
      // 1.34 matches the WebGL camera framing, so the hero lens lines up with the globe disc.
      const R = (Math.min(w, h) / 2 / 1.34) * s.scale
      const cx = w / 2, cy = h / 2
      const proj = (v) => {
        const [x, y, z] = rotate(v, ry, rx)
        return [cx + x * R, cy - y * R, z, Math.hypot(x, y)]
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.2)
      glow.addColorStop(0, withAlpha(pal.glow, 0.25))
      glow.addColorStop(1, withAlpha(pal.glow, 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2)
      ctx.fill()
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R)
      body.addColorStop(0, pal.sea)
      body.addColorStop(1, pal.edge)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = withAlpha(pal.land, 0.45)
      ctx.lineWidth = 1.2
      ctx.stroke()

      const size = Math.max(1.5, R * 0.0145)
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? pal.origin : pal.land
        for (const [v, india] of dots) {
          if ((india ? 1 : 0) !== pass) continue
          const [x, y, z] = proj(v)
          if (z <= 0) continue
          ctx.globalAlpha = 0.25 + 0.75 * z
          ctx.fillRect(x - size / 2, y - size / 2, size, size)
        }
      }
      ctx.globalAlpha = 1

      const t = now / 1000
      ctx.lineCap = 'round'
      arcs.forEach((pts, i) => {
        const n = Math.round(s.progress * (pts.length - 1))
        if (n < 1) return
        const sp = pts.slice(0, n + 1).map(proj)
        const path = () => {
          ctx.beginPath()
          let pen = false
          for (const [x, y, z, d] of sp) {
            if (z > 0 || d > 1) {
              pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
              pen = true
            } else pen = false
          }
        }
        ctx.setLineDash([])
        ctx.strokeStyle = withAlpha(pal.dash, 0.7)
        ctx.lineWidth = 1.8
        path()
        ctx.stroke()
        ctx.setLineDash([5, 34])
        ctx.lineDashOffset = -t * 26
        ctx.strokeStyle = pal.origin
        ctx.lineWidth = 3
        path()
        ctx.stroke()
        ctx.setLineDash([])
        if (s.progress >= 1) {
          const f = ((t * 0.11 + i * 0.173) % 1) * (sp.length - 1)
          const [x, y, z, d] = sp[Math.round(f)]
          if (z > 0 || d > 1) {
            ctx.fillStyle = pal.marker
            ctx.beginPath()
            ctx.arc(x, y, 2.6, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      s.markers = []
      places.forEach(({ p, v }, i) => {
        const [x, y, z] = proj(v)
        if (z <= 0.05) return
        const origin = i === 0
        s.markers.push({ p, x, y })
        ctx.fillStyle = origin ? pal.origin : pal.marker
        ctx.beginPath()
        ctx.arc(x, y, origin ? 4.5 : 3.4, 0, Math.PI * 2)
        ctx.fill()
        const k = origin ? (t * 0.6) % 1 : 0
        ctx.strokeStyle = origin ? withAlpha(pal.origin, 1 - k) : withAlpha(pal.marker, 0.6)
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(x, y, origin ? 7 + k * 14 : 7, 0, Math.PI * 2)
        ctx.stroke()
      })

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [geo, active])

  const hit = (e) => {
    const r = wrap.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    let best = null
    let bd = e.pointerType === 'mouse' ? 18 : 28
    for (const m of st.current.markers) {
      const d = Math.hypot(m.x - x, m.y - y)
      if (d < bd) (bd = d), (best = m)
    }
    return best
  }

  const onMove = (e) => {
    const s = st.current
    const r = wrap.current.getBoundingClientRect()
    if (e.pointerType === 'mouse') s.px = ((e.clientX - r.left) / r.width) * 2 - 1
    if (s.dragging) {
      s.drag += (e.clientX - s.last) * 0.008
      s.last = e.clientX
      return
    }
    if (e.pointerType !== 'mouse') return
    const m = hit(e)
    setTip((t) => (m ? (t?.p.id === m.p.id ? t : m) : null))
  }

  const onDown = (e) => {
    const s = st.current
    s.dragging = true
    s.last = e.clientX
    if (e.pointerType !== 'mouse') {
      const m = hit(e)
      setTip(m || null)
    }
  }
  const onUp = () => (st.current.dragging = false)

  return (
    <div
      ref={wrap}
      className={`cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'pan-y' }}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={(e) => {
        onUp()
        if (e.pointerType === 'mouse') setTip(null)
      }}
    >
      <canvas ref={canvas} className="absolute inset-0 size-full" />
      {tip && (
        <div className="absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)]" style={{ left: tip.x, top: tip.y }}>
          <GlobeTooltip place={tip.p} />
        </div>
      )}
    </div>
  )
}
