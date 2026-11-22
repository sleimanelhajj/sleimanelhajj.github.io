import { motion, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function Section({ id, index, title, kicker, children }) {
  return (
    <section id={id} className="section">
      <motion.header
        className="section-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-addr">0x{index.toString(16).padStart(2, '0').toUpperCase()}</span>
        <h2>{title}</h2>
        <span className="section-line" />
        {kicker && <span className="section-kicker">{kicker}</span>}
      </motion.header>
      {children}
    </section>
  )
}

export const Reveal = ({ children, delay = 0, className, y = 28 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  )
}

export function Typewriter({ words }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const word = words[i % words.length]
    let t
    if (!del && text === word) t = setTimeout(() => setDel(true), 1800)
    else if (del && text === '') {
      setDel(false)
      setI(i + 1)
    } else
      t = setTimeout(
        () => setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        del ? 35 : 70
      )
    return () => clearTimeout(t)
  }, [text, del, i, words])
  return (
    <span className="typewriter">
      {text}
      <span className="caret">|</span>
    </span>
  )
}
