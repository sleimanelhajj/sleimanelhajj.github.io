import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  'SEH-BIOS v2.0.26  (c) Sleiman El Hajj',
  'CPU: CompE-Core x64 @ 4.20GHz ........ OK',
  'Memory test: 16384 MB ................ OK',
  'Detecting drives: /dev/portfolio ..... OK',
  'Loading kernel modules: react framer . OK',
  'Mounting /projects /experience /skills  OK',
  'Starting display server (glass mode) . OK',
  '',
  '> boot complete. welcome.',
]

export default function BootScreen({ onDone }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n < LINES.length) {
      const id = setTimeout(() => setN(n + 1), n === 0 ? 250 : 120)
      return () => clearTimeout(id)
    }
    const id = setTimeout(onDone, 550)
    return () => clearTimeout(id)
  }, [n, onDone])

  useEffect(() => {
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [onDone])

  return (
    <motion.div
      className="boot"
      onClick={onDone}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="boot-inner">
        {LINES.slice(0, n).map((l, i) => (
          <div key={i} className={l.endsWith('OK') ? 'boot-line ok' : 'boot-line'}>
            {l.endsWith('OK') ? (
              <>
                {l.slice(0, -2)}
                <span>OK</span>
              </>
            ) : (
              l || ' '
            )}
          </div>
        ))}
        <span className="caret">_</span>
        <div className="boot-bar">
          <motion.div animate={{ width: `${(n / LINES.length) * 100}%` }} />
        </div>
        <p className="boot-skip">press any key to skip</p>
      </div>
    </motion.div>
  )
}
