import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiWifi, FiBattery } from 'react-icons/fi'
import { APPS, AppIcon, getApp } from './registry'
import { useClock, fmtTime } from './hooks'
import { Typewriter } from '../components/ui'
import { profile } from '../data'

const DOCK = ['about', 'terminal', 'projects', 'contact']

export default function MobileHome() {
  const now = useClock()
  const [active, setActive] = useState(null)
  const os = useMemo(() => ({
    open: (id) => (id === 'resume' ? window.open(profile.resume, '_blank') : setActive(id)),
  }), [])
  const app = active && getApp(active)
  const C = app?.comp

  return (
    <div className="m-home">
      <div className="m-status">
        <span>{fmtTime(now)}</span>
        <span className="m-notch" />
        <span className="m-icons"><FiWifi /><FiBattery /></span>
      </div>

      <motion.button className="m-hero glass" onClick={() => os.open('about')} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <img src={profile.photo} alt="" />
        <div>
          <span className="m-hello mono">hello_world()</span>
          <strong>{profile.firstName} {profile.lastName}</strong>
          <span className="m-role mono"><Typewriter words={profile.roles} /></span>
        </div>
        <span className="m-badge"><i className="led" /> {profile.status}</span>
      </motion.button>

      <div className="m-grid">
        {APPS.map((a, i) => (
          <motion.button key={a.id} className="m-app" onClick={() => os.open(a.id)} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.04, type: 'spring', stiffness: 300, damping: 20 }}>
            <AppIcon app={a} size={60} />
            <span>{a.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="m-dock glass">
        {DOCK.map((id) => (
          <button key={id} onClick={() => os.open(id)} aria-label={getApp(id).label}>
            <AppIcon app={getApp(id)} size={56} />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {app && (
          <motion.div
            className="m-sheet"
            initial={{ y: '100%', borderRadius: 40 }}
            animate={{ y: 0, borderRadius: 0 }}
            exit={{ y: '100%', borderRadius: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <header className="m-sheet-head">
              <button onClick={() => setActive(null)}><FiChevronLeft /> Home</button>
              <strong>{app.label}</strong>
              <AppIcon app={app} size={26} />
            </header>
            <div className="m-sheet-body win-body">
              <C os={os} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
