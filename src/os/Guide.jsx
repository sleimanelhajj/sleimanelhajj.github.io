// The desktop's "front door": a centred welcome hub with launch cards,
// plus hand-drawn notes and arrows that point at the icons, dock, widgets and search.
import { AnimatePresence, motion } from 'framer-motion'
import { AppIcon, getApp } from './registry'
import { profile } from '../data'

const CARDS = [
  { id: 'about', q: "Who's Sleiman?", a: 'Bio, specs & story' },
  { id: 'skills', q: 'What does he build with?', a: 'Live task manager of my stack' },
  { id: 'projects', q: 'What has he shipped?', a: 'Browse the project folders' },
  { id: 'experience', q: 'Where has he worked?', a: 'My career as a git log' },
]

export function Hub({ onOpen, dimmed }) {
  return (
    <motion.div
      className={`hub ${dimmed ? 'dim' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: dimmed ? 0.18 : 1, y: 0, scale: dimmed ? 0.97 : 1, filter: dimmed ? 'blur(2px)' : 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="hub-title">
        Hi, I'm <span>{profile.firstName}</span>.<br />
        <em>Pick a door.</em>
      </h1>
      <div className="hub-cards">
        {CARDS.map((c, i) => {
          const app = getApp(c.id)
          return (
            <motion.button
              key={c.id}
              className="hub-card glass"
              style={{ '--c1': app.color[0] }}
              onClick={() => onOpen(c.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <AppIcon app={app} size={26} />
              <span className="hub-q">{c.q}</span>
            </motion.button>
          )
        })}
      </div>
      <div className="hub-foot">
        <button className="hub-term mono" onClick={() => onOpen('terminal')}>
          <span className="t-green">$</span> or open the terminal<span className="caret">_</span>
        </button>
      </div>
    </motion.div>
  )
}

// One hand-drawn note: handwritten text + an arrow that draws itself in.
function Note({ className, text, path, head, delay = 0, w = 160, h = 120, color = 'var(--amber)' }) {
  return (
    <motion.div
      className={`note ${className}`}
      style={{ '--ink': color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ delay }}
    >
      <motion.span className="note-text" initial={{ opacity: 0, rotate: -6, y: 6 }} animate={{ opacity: 1, rotate: -3, y: 0 }} transition={{ delay, duration: 0.4 }}>
        {text}
      </motion.span>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="note-svg" aria-hidden="true">
        <motion.path d={path} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.25, duration: 0.7, ease: 'easeInOut' }} />
        <motion.path d={head} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.9, duration: 0.25 }} />
      </svg>
    </motion.div>
  )
}

export function Annotations({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="notes" key="notes" exit={{ opacity: 0 }}>
          <Note
            className="n-icons"
            text="all my apps live here — click one!"
            delay={0.6}
            w={150} h={90}
            path="M140 18 C 100 10, 60 20, 40 45 S 18 75, 10 80"
            head="M10 80 L 26 76 M10 80 L 14 63"
          />
          <Note
            className="n-dock"
            text="…or launch from the dock"
            delay={1.1}
            w={120} h={80}
            color="var(--cyan)"
            path="M20 8 C 40 20, 70 30, 80 50 S 88 70, 90 76"
            head="M90 76 L 78 64 M90 76 L 96 60"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
