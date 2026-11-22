import { useEffect, useRef } from 'react'
import { motion, useDragControls, useMotionValue, animate } from 'framer-motion'
import { AppIcon } from './registry'

export default function Window({ app, st, idx, bounds, focused, onFocus, onClose, onMin, onMax, os }) {
  const controls = useDragControls()
  const area = bounds.current?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight - 40 }
  const w = Math.min(app.w, area.width - 24)
  const h = Math.min(app.h, area.height - 110)
  const x = useMotionValue(Math.max(12, Math.min((area.width - w) / 2 + (idx % 4) * 36 - 54, area.width - w - 12)))
  const y = useMotionValue(Math.max(10, Math.min(Math.max(18, (area.height - h - 100) / 2) + (idx % 4) * 30, area.height - h - 100)))
  const prev = useRef(null)

  useEffect(() => {
    const t = { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
    if (st.max) {
      prev.current = { x: x.get(), y: y.get() }
      animate(x, 0, t)
      animate(y, 0, t)
    } else if (prev.current) {
      animate(x, prev.current.x, t)
      animate(y, prev.current.y, t)
    }
  }, [st.max]) // eslint-disable-line react-hooks/exhaustive-deps

  const C = app.comp
  return (
    <motion.section
      className={`window ${st.max ? 'max' : ''} ${focused ? 'focused' : ''} ${st.min ? 'minimized' : ''}`}
      style={{ x, y, zIndex: st.z, width: st.max ? '100%' : w, height: st.max ? 'calc(100% - 92px)' : h }}
      drag={!st.max}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={bounds}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
      animate={{ opacity: st.min ? 0 : 1, scale: st.min ? 0.5 : 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onFocus}
      aria-label={app.title}
    >
      <header
        className="titlebar"
        onPointerDown={(e) => {
          if (!st.max && !e.target.closest('button')) controls.start(e)
        }}
        onDoubleClick={onMax}
      >
        <div className="lights">
          <button className="l-close" onClick={onClose} aria-label="Close" />
          <button className="l-min" onClick={onMin} aria-label="Minimize" />
          <button className="l-max" onClick={onMax} aria-label="Maximize" />
        </div>
        <div className="win-title">
          <AppIcon app={app} size={16} />
          <span>{app.title}</span>
        </div>
        <span className="win-spacer" />
      </header>
      <div className="win-body">
        <C os={os} />
      </div>
    </motion.section>
  )
}
