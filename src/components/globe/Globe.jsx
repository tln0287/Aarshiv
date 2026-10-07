import { lazy, Suspense, useMemo, useRef } from 'react'
import { hasWebGL, useLiteMode, useOnScreen } from '../../lib/hooks.js'
import { useGeo } from '../../lib/geoData.js'
import GlobeLite from './GlobeLite.jsx'

// three.js and React Three Fiber load only when a desktop browser actually shows the globe.
const GlobeGL = lazy(() => import('./GlobeGL.jsx'))

export default function Globe({ zoomed = true, routes = true, className = '' }) {
  const ref = useRef(null)
  const geo = useGeo()
  const lite = useLiteMode()
  const webgl = useMemo(() => hasWebGL(), [])
  const onScreen = useOnScreen(ref, '100px')
  const props = { geo, zoomed, routes, active: onScreen, className: 'absolute inset-0' }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {geo &&
        (lite || !webgl ? (
          <GlobeLite {...props} />
        ) : (
          <Suspense fallback={<GlobeLite {...props} />}>
            <GlobeGL {...props} />
          </Suspense>
        ))}
    </div>
  )
}
