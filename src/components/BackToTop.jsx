import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Icon from './Icons.jsx'

// Bottom-right button that returns to the top; its ring fills as the page is scrolled.
export default function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 600))

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0 })}
          className="group fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_14px_30px_-12px_rgba(11,36,22,0.55)] transition-colors hover:bg-brand-2 sm:right-6 sm:bottom-6"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <circle cx="28" cy="28" r="25" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2.5" />
            <motion.circle cx="28" cy="28" r="25" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          </svg>
          <Icon name="arrow" className="size-5 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
