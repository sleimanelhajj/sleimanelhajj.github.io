// Menu bar, dock, desktop widgets, wallpaper, spotlight and toast.
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiHelpCircle, FiSearch, FiWifi, FiBattery, FiGithub, FiLinkedin, FiArrowUpRight } from 'react-icons/fi'
import { APPS, AppIcon, getApp } from './registry'
import { useClock, useTick, fmtTime, fmtDate } from './hooks'
import { profile } from '../data'

export function Wallpaper() {
  return (
    <div className="wallpaper" aria-hidden="true">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <div className="aurora a3" />
      <svg className="die" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="cells" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="3" y="3" width="34" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <rect x="12" y="12" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="800" height="800" fill="url(#cells)" />
      </svg>
      <div className="watermark">
        <span>{profile.firstName}</span>
        <span>{profile.lastName}</span>
      </div>
      <div className="vignette" />
    </div>
  )
}

export function MenuBar({ focusedApp, onSpotlight, onOpen, onGuide }) {
  const now = useClock()
  const [menu, setMenu] = useState(false)
  return (
    <div className="menubar">
      <div className="mb-left">
        <button className="mb-logo" onClick={() => setMenu(!menu)} aria-label="System menu">
          <span className="logo-chip" />
        </button>
        <strong className="mb-app">{focusedApp ? focusedApp.label : 'Finder'}</strong>
        <button className="mb-item" onClick={() => onOpen('about')}>About</button>
        <button className="mb-item" onClick={() => onOpen('projects')}>Projects</button>
        <button className="mb-item" onClick={() => onOpen('contact')}>Hire me</button>
        <AnimatePresence>
          {menu && (
            <motion.div className="mb-menu glass" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} onMouseLeave={() => setMenu(false)}>
              <button onClick={() => { onOpen('about'); setMenu(false) }}>About SleimanOS</button>
              <hr />
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub <FiArrowUpRight /></a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <FiArrowUpRight /></a>
              <a href={profile.resume} download>Download CV</a>
              <hr />
              <button onClick={() => { try { sessionStorage.removeItem('booted') } catch { /* */ } location.reload() }}>Restart…</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mb-right">
        <button className="mb-search" onClick={onGuide} title="Show desktop & guide">
          <FiHelpCircle /> <span className="mb-guide-label">Guide</span>
        </button>
        <button className="mb-search" onClick={onSpotlight} aria-label="Search">
          <FiSearch /> <kbd>Ctrl K</kbd>
        </button>
        <FiWifi className="mb-ico" />
        <FiBattery className="mb-ico" />
        <span className="mb-clock">{fmtDate(now)} &nbsp;{fmtTime(now)}</span>
      </div>
    </div>
  )
}

export function Dock({ openIds, onOpen }) {
  return (
    <nav className="dock glass" aria-label="Dock">
      {APPS.map((a, i) => (
        <div key={a.id} style={{ display: 'contents' }}>
          {i === APPS.length - 1 && <span className="dock-sep" />}
          <button className="dock-item" onClick={() => onOpen(a.id)} aria-label={a.label}>
            <span className="dock-tip">{a.label}</span>
            <AppIcon app={a} size={50} />
            <span className={`dock-dot ${openIds.includes(a.id) ? 'on' : ''}`} />
          </button>
        </div>
      ))}
    </nav>
  )
}

export function DesktopIcons({ onOpen }) {
  return (
    <div className="desk-icons">
      {APPS.map((a, i) => (
        <motion.button
          key={a.id}
          className="desk-icon"
          onClick={() => onOpen(a.id)}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
        >
          <AppIcon app={a} size={48} />
          <span>{a.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export function Widgets({ onOpen }) {
  const now = useClock()
  const tick = useTick(900)
  const start = useRef(Date.now())
  const cores = useMemo(() => Array.from({ length: 8 }, (_, i) => 15 + Math.round(75 * Math.abs(Math.sin(tick * 0.55 + i * 1.7)))), [tick])
  const up = Math.floor((Date.now() - start.current) / 1000)
  const avg = Math.round(cores.reduce((s, c) => s + c, 0) / cores.length)
  return (
    <aside className="widgets">
      <motion.div className="widget glass w-clock" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <span className="w-time">{fmtTime(now)}</span>
        <span className="w-date">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </motion.div>

      <motion.button className="widget glass w-profile" onClick={() => onOpen('about')} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <img src={profile.photo} alt="" />
        <div>
          <strong>{profile.firstName} {profile.lastName}</strong>
          <span>{profile.roles[0]}</span>
          <span className="w-status"><i className="led" /> {profile.status}</span>
        </div>
      </motion.button>

      <motion.div className="widget glass w-mon" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="w-head"><span>CPU · brain.exe</span><b>{avg}%</b></div>
        <div className="cores">
          {cores.map((c, i) => (
            <div key={i} className="core"><motion.span animate={{ height: `${c}%` }} transition={{ duration: 0.8 }} /></div>
          ))}
        </div>
        <div className="w-rows">
          <span>Uptime</span><b>{String(Math.floor(up / 60)).padStart(2, '0')}:{String(up % 60).padStart(2, '0')}</b>
          <span>Coffee</span><b>{Math.max(12, 100 - Math.floor(up / 6))}%</b>
          <span>Bugs fixed</span><b>{1024 + Math.floor(up / 3)}</b>
        </div>
      </motion.div>

      <motion.div className="widget glass w-links" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <a href={profile.github} target="_blank" rel="noreferrer"><FiGithub /> GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /> LinkedIn</a>
      </motion.div>
    </aside>
  )
}

export function Spotlight({ open, onClose, onOpen }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const items = useMemo(() => {
    const ext = [
      { id: 'gh', label: 'GitHub profile', href: profile.github },
      { id: 'li', label: 'LinkedIn profile', href: profile.linkedin },
    ]
    const all = [...APPS.map((a) => ({ id: a.id, label: a.label, sub: a.title, app: a })), ...ext]
    return all.filter((i) => (i.label + ' ' + (i.sub || '')).toLowerCase().includes(q.toLowerCase()))
  }, [q])

  useEffect(() => { setSel(0) }, [q])
  useEffect(() => { if (open) setQ('') }, [open])

  const go = (it) => {
    if (!it) return
    if (it.href) window.open(it.href, '_blank', 'noopener')
    else onOpen(it.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="spot-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="spotlight glass"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
          >
            <div className="spot-input">
              <FiSearch />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search apps, projects, links…"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)) }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
                  if (e.key === 'Enter') go(items[sel])
                  if (e.key === 'Escape') onClose()
                }}
              />
            </div>
            <ul className="spot-list">
              {items.map((it, i) => (
                <li key={it.id}>
                  <button className={i === sel ? 'sel' : ''} onMouseEnter={() => setSel(i)} onClick={() => go(it)}>
                    {it.app ? <AppIcon app={it.app} size={28} /> : <span className="spot-ext">{it.id === 'gh' ? <FiGithub /> : <FiLinkedin />}</span>}
                    <span>{it.label}</span>
                    <small>{it.sub || 'Open in new tab'}</small>
                  </button>
                </li>
              ))}
              {!items.length && <li className="spot-empty">No results for “{q}”</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toast() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setShow(true), 1400)
    const b = setTimeout(() => setShow(false), 8000)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="toast glass" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} onClick={() => setShow(false)}>
          <AppIcon app={getApp('terminal')} size={36} />
          <div>
            <strong>Welcome to SleimanOS</strong>
            <span>Drag windows around, open apps from the dock, or press <kbd>Ctrl K</kbd> to search.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
