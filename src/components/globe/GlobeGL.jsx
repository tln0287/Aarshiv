import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { arcPoints, faceRotation, toVec } from '../../lib/geo.js'
import { useReducedMotion } from '../../lib/hooks.js'
import GlobeTooltip from './GlobeTooltip.jsx'

const LAND = new THREE.Color('#7083c4')
const INDIA = new THREE.Color('#f09a45')
const damp = THREE.MathUtils.damp
const tmp = new THREE.Vector3()

function Dots({ dots }) {
  const ref = useRef()
  const geometry = useMemo(() => new THREE.CircleGeometry(0.0078, 6), [])
  useLayoutEffect(() => {
    const mesh = ref.current
    const o = new THREE.Object3D()
    dots.forEach(([lon, lat, india], i) => {
      const [x, y, z] = toVec(lon, lat, 1.002)
      o.position.set(x, y, z)
      o.lookAt(x * 2, y * 2, z * 2)
      o.scale.setScalar(india ? 1.3 : 1)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      mesh.setColorAt(i, india ? INDIA : LAND)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
  }, [dots])
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, dots.length]}>
      <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color('#4d6bd6') } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 color; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(color, 1.0) * i; }`,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  )
  return (
    <mesh material={material} scale={1.16}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  )
}

function Route({ points, progress, index }) {
  const base = useRef()
  const dash = useRef()
  const cargo = useRef()
  const last = points.length - 1
  useFrame((s, dt) => {
    const n = Math.round(progress.current * last)
    if (base.current) base.current.geometry.instanceCount = n
    if (dash.current) {
      dash.current.geometry.instanceCount = n
      dash.current.material.dashOffset -= dt * 0.32
    }
    const c = cargo.current
    c.visible = progress.current >= 1
    if (!c.visible) return
    const f = ((s.clock.elapsedTime * 0.11 + index * 0.173) % 1) * last
    const i = Math.floor(f)
    const k = f - i
    const a = points[i]
    const b = points[Math.min(i + 1, last)]
    c.position.set(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k)
  })
  return (
    <group>
      <Line ref={base} points={points} color="#e8892b" lineWidth={1.1} transparent opacity={0.38} />
      <Line ref={dash} points={points} color="#ffc27d" lineWidth={2.2} dashed dashSize={0.06} gapSize={0.42} transparent opacity={0.95} />
      <mesh ref={cargo}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  )
}

function Marker({ place, origin, hovered, setHovered }) {
  const v = useMemo(() => toVec(place.lon, place.lat, 1.004), [place])
  const ring = useRef()
  useLayoutEffect(() => {
    ring.current.lookAt(v[0] * 2, v[1] * 2, v[2] * 2)
  }, [v])
  useFrame((s) => {
    if (!origin) return
    const t = (s.clock.elapsedTime * 0.6) % 1
    ring.current.scale.setScalar(1 + t * 2.4)
    ring.current.material.opacity = 1 - t
  })
  const over = (e) => {
    // Ignore markers on the far side of the globe.
    if (e.object.getWorldPosition(tmp).dot(e.camera.position) <= 0) return
    e.stopPropagation()
    setHovered(place)
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHovered((h) => (h?.id === place.id ? null : h))
    document.body.style.cursor = ''
  }
  return (
    <group>
      <mesh position={v}>
        <sphereGeometry args={[origin ? 0.022 : 0.016, 16, 16]} />
        <meshBasicMaterial color={origin ? '#e8892b' : '#ffffff'} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={v}>
        <ringGeometry args={[0.026, 0.034, 40]} />
        <meshBasicMaterial color={origin ? '#e8892b' : '#ffffff'} transparent opacity={0.7} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={v} onPointerOver={over} onPointerOut={out}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {hovered?.id === place.id && (
        <Html position={[v[0] * 1.12, v[1] * 1.12, v[2] * 1.12]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <GlobeTooltip place={place} />
        </Html>
      )}
    </group>
  )
}

function Scene({ geo, zoomed, routes, drag }) {
  const reduce = useReducedMotion()
  const tilt = useRef()
  const spin = useRef()
  const [hovered, setHovered] = useState(null)
  const face = useMemo(() => faceRotation(geo.origin.lon, geo.origin.lat), [geo])
  const s = useRef({ auto: 0, scale: zoomed ? 1 : 2.7 })
  const progress = useRef(routes ? 1 : 0)
  const arcs = useMemo(() => geo.markets.map((m) => arcPoints(geo.origin, m, 72)), [geo])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const st = s.current
    if (!reduce && !hovered && !drag.current.active) st.auto += dt * 0.055
    spin.current.rotation.y = damp(spin.current.rotation.y, face.y + st.auto + drag.current.x + state.pointer.x * 0.22, 3.5, dt)
    tilt.current.rotation.x = damp(tilt.current.rotation.x, face.x * 0.8 - state.pointer.y * 0.12, 3.5, dt)
    st.scale = damp(st.scale, zoomed ? 1 : 2.7, 2.1, dt)
    tilt.current.scale.setScalar(st.scale)
    progress.current = routes ? Math.min(1, progress.current + dt / 1.8) : 0
  })

  return (
    <group ref={tilt}>
      <group ref={spin} rotation-y={face.y}>
        <mesh>
          <sphereGeometry args={[0.996, 64, 64]} />
          <meshBasicMaterial color="#111c45" />
        </mesh>
        <Dots dots={geo.globe} />
        {arcs.map((pts, i) => (
          <Route key={geo.markets[i].id} points={pts} progress={progress} index={i} />
        ))}
        <Marker place={geo.origin} origin hovered={hovered} setHovered={setHovered} />
        {geo.markets.map((m) => (
          <Marker key={m.id} place={m} hovered={hovered} setHovered={setHovered} />
        ))}
      </group>
      <Atmosphere />
    </group>
  )
}

export default function GlobeGL({ geo, zoomed = true, routes = true, active = true, className = '' }) {
  const drag = useRef({ active: false, x: 0, last: 0 })
  const down = (e) => {
    drag.current.active = true
    drag.current.last = e.clientX
  }
  const move = (e) => {
    if (!drag.current.active) return
    drag.current.x += (e.clientX - drag.current.last) * 0.006
    drag.current.last = e.clientX
  }
  const up = () => (drag.current.active = false)

  return (
    <div
      className={`cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 4.25], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
      >
        <Scene geo={geo} zoomed={zoomed} routes={routes} drag={drag} />
      </Canvas>
    </div>
  )
}
