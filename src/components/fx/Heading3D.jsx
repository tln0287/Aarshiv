import { Fragment } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

// Heading whose words flip up in 3D, one after another. Lines are split on "\n".
// By default it plays when scrolled into view; pass `play` to control it instead (e.g. after the hero intro).
export default function Heading3D({ as = 'h2', text, className = '', play, delay = 0 }) {
  const Tag = as
  const lines = text.split('\n')
  const controlled = play !== undefined
  let n = 0

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      <motion.span
        aria-hidden="true"
        className="block [perspective:900px]"
        initial="out"
        {...(controlled ? { animate: play ? 'in' : 'out' } : { whileInView: 'in', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
      >
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((word, wi, arr) => {
              const i = n++
              // The space sits outside the inline-block, where it is kept; inside it would collapse.
              return (
                <Fragment key={wi}>
                  <motion.span
                    className="inline-block origin-bottom will-change-transform"
                    variants={{
                      out: { opacity: 0, rotateX: -85, y: '0.35em' },
                      in: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.9, delay: delay + i * 0.07, ease } },
                    }}
                  >
                    {word}
                  </motion.span>
                  {wi < arr.length - 1 && ' '}
                </Fragment>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
