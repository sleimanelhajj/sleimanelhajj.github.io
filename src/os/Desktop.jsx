import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Window from './Window'
import { getApp } from './registry'
import { MenuBar, Dock, DesktopIcons, Widgets, Spotlight, Toast } from './Chrome'

export default function Desktop() {
  const [wins, setWins] = useState([]) // { id, z, min, max }
  const [spot, setSpot] = useState(false)
  const top = useRef(10)
  const bounds = useRef(null)

  const open = useCallback((id) => {
    top.current += 1
    const z = top.current
    setWins((ws) =>
      ws.some((w) => w.id === id)
        ? ws.map((w) => (w.id === id ? { ...w, min: false, z } : w))
        : [...ws, { id, z, min: false, max: window.innerWidth < 900 }]
    )
  }, [])
  const patch = (id, fn) => setWins((ws) => ws.map((w) => (w.id === id ? fn(w) : w)))
  const focus = (id) => { top.current += 1; const z = top.current; patch(id, (w) => (w.z === z - 1 ? w : { ...w, z })) }
  const close = (id) => setWins((ws) => ws.filter((w) => w.id !== id))

  useEffect(() => {
    open('about')
    if (window.innerWidth >= 1200) setTimeout(() => open('terminal'), 300)
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSpot((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visible = wins.filter((w) => !w.min)
  const focusedId = visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)).id : null
  const os = useMemo(() => ({ open }), [open])

  return (
    <div className="desktop">
      <MenuBar focusedApp={focusedId && getApp(focusedId)} onSpotlight={() => setSpot(true)} onOpen={open} />
      <div className="workspace" ref={bounds}>
        <DesktopIcons onOpen={open} />
        <Widgets onOpen={open} />
        <AnimatePresence>
          {wins.map((w, i) => (
            <Window
              key={w.id}
              app={getApp(w.id)}
              st={w}
              idx={i}
              bounds={bounds}
              focused={w.id === focusedId}
              onFocus={() => focus(w.id)}
              onClose={() => close(w.id)}
              onMin={() => patch(w.id, (x) => ({ ...x, min: true }))}
              onMax={() => patch(w.id, (x) => ({ ...x, max: !x.max }))}
              os={os}
            />
          ))}
        </AnimatePresence>
      </div>
      <Dock openIds={wins.map((w) => w.id)} onOpen={open} />
      <Spotlight open={spot} onClose={() => setSpot(false)} onOpen={open} />
      <Toast />
    </div>
  )
}
