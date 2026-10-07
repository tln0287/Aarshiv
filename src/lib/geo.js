const DEG = Math.PI / 180

// lon/lat → unit-sphere xyz (three.js orientation: +y north, lon -90 faces +z).
export function toVec(lon, lat, r = 1) {
  const phi = (90 - lat) * DEG
  const theta = (lon + 180) * DEG
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)]
}

const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}

// Great-circle arc from a to b, lifted off the surface in proportion to its length.
export function arcPoints(a, b, segments = 64, lift = 0.35) {
  const A = toVec(a.lon, a.lat)
  const B = toVec(b.lon, b.lat)
  const dot = Math.min(1, Math.max(-1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]))
  const omega = Math.acos(dot)
  const h = lift * (omega / Math.PI) + 0.02
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const s = Math.sin(omega)
    const k1 = Math.sin((1 - t) * omega) / s
    const k2 = Math.sin(t * omega) / s
    const p = norm([A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2])
    const r = 1 + h * Math.sin(Math.PI * t)
    pts.push([p[0] * r, p[1] * r, p[2] * r])
  }
  return pts
}

// Rotation that brings a lon/lat to face the viewer (+z): spin about y, then tilt about x.
export const faceRotation = (lon, lat) => ({ y: -(90 + lon) * DEG, x: lat * DEG })

export function rotate([x, y, z], ry, rx) {
  const cy = Math.cos(ry), sy = Math.sin(ry)
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  const cx = Math.cos(rx), sx = Math.sin(rx)
  return [x1, y * cx - z1 * sx, y * sx + z1 * cx]
}
