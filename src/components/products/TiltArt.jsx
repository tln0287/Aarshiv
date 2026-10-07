import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import ProductArt from '../ProductArt.jsx'
import { useReducedMotion } from '../../lib/hooks.js'

// Product illustration on a tinted plinth that turns slightly toward the pointer.
export default function TiltArt({ product, className = '', strength = 10, float = true }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [strength, -strength]), { stiffness: 160, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-strength * 1.4, strength * 1.4]), { stiffness: 160, damping: 18 })

  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const leave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className={`relative overflow-hidden [perspective:900px] ${className}`} style={{ background: product.tone }} onPointerMove={move} onPointerLeave={leave}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_35%,rgba(255,255,255,0.75),transparent_70%)]" />
      <motion.div className="relative size-full [transform-style:preserve-3d]" style={{ rotateX: rx, rotateY: ry }}>
        <div className={`size-full ${float ? 'float' : ''}`} style={{ '--d': '7s' }}>
          <ProductArt kind={product.art} className="size-full" title={product.name} />
        </div>
      </motion.div>
    </div>
  )
}
