import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiWifi, FiBattery } from 'react-icons/fi'
import { APPS, AppIcon, getApp } from './registry'
import { useClock, fmtTime } from './hooks'
import { Typewriter } from '../components/ui'
import { profile } from '../data'

const DOCK = ['about', 'terminal', 'projects', 'contact']
const EASE = [0.32, 0.72, 0, 1] // iOS-like sheet curve

// Clock lives in its own component so the ticking only re-renders this text,
// not the whole home screen and the open app.
function StatusClock() {
  return <span>{fmtTime(useClock(15000))}</span>
}

// The open app. Memoised so the home screen re-rendering never re-renders it.
const Sheet = memo(function Sheet({ app, os, onBack }) {
  const C = app.comp
  return (
    <motion.div
      className="m-sheet"
      initial={{ y: '100%' }}
      animate={{ y: 0, transition: { duration: 0.34, ease: EASE } }}
      exit={{ y: '100%', transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
    >
      <header className="m-sheet-head">
        <button onClick={onBack}><FiChevronLeft /> Home</button>
        <strong>{app.label}</strong>
        <AppIcon app={app} size={26} />
      </header>
      <div className="m-sheet-body win-body">
        <C os={os} />
      </div>
    </motion.div>
  )
})

export default function MobileHome() {
  const [active, setActive] = useState(null)

  // Opening an app adds a history entry, so the phone's back button / back
  // gesture closes the app instead of leaving the site.
  const openApp = useCallback((id) => {
    if (id === 'resume') return window.open(profile.resume, '_blank')
    setActive((cur) => {
      if (cur) history.replaceState({ app: id }, '')
      else history.pushState({ app: id }, '')
      return id
    })
  }, [])

  const back = useCallback(() => {
    if (history.state?.app) history.back()
    else setActive(null)
  }, [])

  useEffect(() => {
    const onPop = (e) => setActive(e.state?.app ?? null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const os = useMemo(() => ({ open: openApp }), [openApp])
  const app = active && getApp(active)

  return (
    <div className={`m-home ${app ? 'covered' : ''}`}>
      <div className="m-status">
        <StatusClock />
        <span className="m-notch" />
        <span className="m-icons"><FiWifi /><FiBattery /></span>
      </div>

      <button className="m-hero glass" onClick={() => openApp('about')}>
        <img src={profile.photo} alt="" />
        <div>
          <span className="m-hello mono">hello_world()</span>
          <strong>{profile.firstName} {profile.lastName}</strong>
          <span className="m-role mono">{app ? profile.roles[0] : <Typewriter words={profile.roles} />}</span>
        </div>
        <span className="m-badge"><i className="led" /> {profile.status}</span>
      </button>

      <div className="m-grid">
        {APPS.map((a, i) => (
          <button key={a.id} className="m-app" style={{ animationDelay: `${0.05 + i * 0.035}s` }} onClick={() => openApp(a.id)}>
            <AppIcon app={a} size={60} />
            <span>{a.label}</span>
          </button>
        ))}
      </div>

      <div className="m-dock glass">
        {DOCK.map((id) => (
          <button key={id} onClick={() => openApp(id)} aria-label={getApp(id).label}>
            <AppIcon app={getApp(id)} size={56} />
          </button>
        ))}
      </div>

      <AnimatePresence>{app && <Sheet key={app.id} app={app} os={os} onBack={back} />}</AnimatePresence>
    </div>
  )
}
