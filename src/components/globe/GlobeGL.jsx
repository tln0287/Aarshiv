import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { arcPoints, faceRotation, toVec } from '../../lib/geo.js'
import { useReducedMotion } from '../../lib/hooks.js'
import { globePalette } from '../../lib/theme.js'
import GlobeTooltip from './GlobeTooltip.jsx'

const damp = THREE.MathUtils.damp
const tmp = new THREE.Vector3()

function Dots({ dots, pal }) {
  const ref = useRef()
  const geometry = useMemo(() => new THREE.CircleGeometry(0.0089, 8), [])
  useLayoutEffect(() => {
    const mesh = ref.current
    const o = new THREE.Object3D()
    const land = new THREE.Color(pal.land)
    const india = new THREE.Color(pal.origin)
    dots.forEach(([lon, lat, isIndia], i) => {
      const [x, y, z] = toVec(lon, lat, 1.002)
      o.position.set(x, y, z)
      o.lookAt(x * 2, y * 2, z * 2)
      o.scale.setScalar(isIndia ? 1.3 : 1)
      o.updateMatrix()
      mesh.setMatrixAt(i, o.matrix)
      mesh.setColorAt(i, isIndia ? india : land)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor.needsUpdate = true
  }, [dots, pal])
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, dots.length]}>
      <meshBasicMaterial toneMapped={false} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

// Ocean sphere: near-white in the middle, shading towards the edge so it reads as a ball.
function Ocean({ pal }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { sea: { value: new THREE.Color(pal.sea) }, edge: { value: new THREE.Color(pal.edge) } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 sea; uniform vec3 edge; varying vec3 vN; void main(){ float f = pow(1.0 - max(dot(vN, vec3(0.0,0.0,1.0)), 0.0), 2.2); gl_FragColor = vec4(mix(sea, edge, f), 1.0);
          #include <colorspace_fragment>
        }`,
      }),
    [pal],
  )
  return (
    <mesh material={material}>
      <sphereGeometry args={[0.996, 64, 64]} />
    </mesh>
  )
}

function Atmosphere({ color }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color(color) } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 color; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(color, i * 0.16); }`,
        side: THREE.BackSide,
        blending: THREE.NormalBlending,
        transparent: true,
        depthWrite: false,
      }),
    [color],
  )
  return (
    <mesh material={material} scale={1.06}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  )
}

function Route({ points, progress, index, pal }) {
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
      <Line ref={base} points={points} color={pal.dash} lineWidth={1.8} transparent opacity={0.7} />
      <Line ref={dash} points={points} color={pal.origin} lineWidth={3.4} dashed dashSize={0.07} gapSize={0.36} />
      <mesh ref={cargo}>
        <sphereGeometry args={[0.019, 14, 14]} />
        <meshBasicMaterial color={pal.marker} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Marker({ place, origin, hovered, setHovered, pal }) {
  const color = origin ? pal.origin : pal.marker
  const v = useMemo(() => toVec(place.lon, place.lat, 1.004), [place])
  const ring = useRef()
  const disc = useRef()
  useLayoutEffect(() => {
    disc.current.lookAt(v[0] * 2, v[1] * 2, v[2] * 2)
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
      <mesh ref={disc} position={v}>
        <circleGeometry args={[origin ? 0.036 : 0.029, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={v}>
        <sphereGeometry args={[origin ? 0.026 : 0.02, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={v}>
        <ringGeometry args={[0.04, 0.05, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} toneMapped={false} />
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

// Small shipping containers circling the globe on a tilted orbit.
function Orbiters({ pal, reduce }) {
  const ring = useRef()
  const R = 1.2
  const boxes = useMemo(
    () => [
      { a: 0, color: pal.marker },
      { a: (Math.PI * 2) / 3, color: pal.origin },
      { a: (Math.PI * 4) / 3, color: pal.land },
    ],
    [pal],
  )
  useFrame((_, dt) => {
    if (!reduce) ring.current.rotation.y += Math.min(dt, 0.05) * 0.28
  })
  return (
    <group rotation={[0.42, 0, -0.2]}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[R, 0.0025, 6, 160]} />
        <meshBasicMaterial color={pal.marker} transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <group ref={ring}>
        {boxes.map((b, i) => (
          <group key={i} position={[Math.cos(b.a) * R, 0, Math.sin(b.a) * R]} rotation-y={-b.a}>
            <mesh>
              <boxGeometry args={[0.03, 0.034, 0.075]} />
              <meshStandardMaterial color={b.color} roughness={0.55} metalness={0.15} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.03, 0.034, 0.075)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </lineSegments>
          </group>
        ))}
      </group>
    </group>
  )
}

function Scene({ geo, zoomed, routes, drag }) {
  const reduce = useReducedMotion()
  const tilt = useRef()
  const spin = useRef()
  const rim = useRef()
  const [hovered, setHovered] = useState(null)
  const face = useMemo(() => faceRotation(geo.origin.lon, geo.origin.lat), [geo])
  const s = useRef({ auto: 0, scale: zoomed ? 1 : 2.7 })
  const progress = useRef(routes ? 1 : 0)
  const arcs = useMemo(() => geo.markets.map((m) => arcPoints(geo.origin, m, 72)), [geo])
  const pal = useMemo(globePalette, [])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const st = s.current
    if (!reduce && !hovered && !drag.current.active) st.auto += dt * 0.055
    spin.current.rotation.y = damp(spin.current.rotation.y, face.y + st.auto + drag.current.x + state.pointer.x * 0.22, 3.5, dt)
    tilt.current.rotation.x = damp(tilt.current.rotation.x, face.x * 0.8 - state.pointer.y * 0.12, 3.5, dt)
    rim.current.rotation.x = -tilt.current.rotation.x
    st.scale = damp(st.scale, zoomed ? 1 : 2.7, 2.1, dt)
    tilt.current.scale.setScalar(st.scale)
    progress.current = routes ? Math.min(1, progress.current + dt / 1.8) : 0
  })

  return (
    <group ref={tilt}>
      <group ref={spin} rotation-y={face.y}>
        <Ocean pal={pal} />
        <Dots dots={geo.globe} pal={pal} />
        {arcs.map((pts, i) => (
          <Route key={geo.markets[i].id} points={pts} progress={progress} index={i} pal={pal} />
        ))}
        <Marker place={geo.origin} origin hovered={hovered} setHovered={setHovered} pal={pal} />
        {geo.markets.map((m) => (
          <Marker key={m.id} place={m} hovered={hovered} setHovered={setHovered} pal={pal} />
        ))}
      </group>
      <Atmosphere color={pal.glow} />
      <mesh ref={rim}>
        <ringGeometry args={[0.999, 1.009, 160]} />
        <meshBasicMaterial color={pal.land} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <Orbiters pal={pal} reduce={reduce} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.8} />
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
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.25], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
      >
        <Scene geo={geo} zoomed={zoomed} routes={routes} drag={drag} />
      </Canvas>
    </div>
  )
}
