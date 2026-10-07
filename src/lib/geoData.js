import { useEffect, useState } from 'react'

// The dot-matrix land data is loaded on demand so it stays out of the initial bundle.
let pending
export const loadGeo = () => (pending ||= import('../data/geo.json').then((m) => m.default))

export function useGeo() {
  const [geo, setGeo] = useState(null)
  useEffect(() => {
    let live = true
    loadGeo().then((g) => live && setGeo(g))
    return () => {
      live = false
    }
  }, [])
  return geo
}
