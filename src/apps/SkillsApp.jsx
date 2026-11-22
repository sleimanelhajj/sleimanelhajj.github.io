import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data'
import { useTick } from '../os/hooks'

// Skills shown as a Task Manager: groups are "devices", skills are running processes.
const load = (t, i, g) => Math.round(18 + 72 * Math.abs(Math.sin(t * 0.6 + i * 1.3 + g * 0.9)))

export default function SkillsApp() {
  const [sel, setSel] = useState(0)
  const tick = useTick(1100)
  const [hist, setHist] = useState(() => Array.from({ length: 40 }, (_, i) => 30 + 25 * Math.sin(i / 3)))
  const group = skills[sel]
  const rows = group.items.map((name, i) => ({ name, pid: 1000 + sel * 100 + i * 7, cpu: load(tick, i, sel) }))
  const avg = Math.round(rows.reduce((s, r) => s + r.cpu, 0) / rows.length)

  useEffect(() => { setHist((h) => [...h.slice(1), avg]) }, [tick]) // eslint-disable-line react-hooks/exhaustive-deps

  const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * 100},${100 - v}`).join(' ')

  return (
    <div className="tm">
      <aside className="tm-side">
        <span className="side-h">Devices</span>
        {skills.map((s, i) => (
          <button key={s.group} className={i === sel ? 'on' : ''} onClick={() => setSel(i)}>
            <span className="mono tm-code">{s.code}</span>
            <span>{s.group}</span>
            <small>{s.items.length}</small>
          </button>
        ))}
      </aside>
      <div className="tm-main">
        <div className="tm-graph">
          <div className="tm-graph-head">
            <div>
              <strong>{group.group}</strong>
              <span className="mono">{group.items.length} modules loaded · driver OK</span>
            </div>
            <b className="mono">{avg}%</b>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="tmfill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#34f5a0" stopOpacity="0.45" />
                <stop offset="1" stopColor="#34f5a0" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 50, 75].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="grid" />)}
            <polygon points={`0,100 ${pts} 100,100`} fill="url(#tmfill)" />
            <polyline points={pts} className="line" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <table className="tm-table">
          <thead>
            <tr><th>PID</th><th>Process</th><th className="hide-sm">Status</th><th>Activity</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr key={r.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <td className="mono dim">{r.pid}</td>
                <td><strong>{r.name}</strong></td>
                <td className="hide-sm"><span className="pill-ok">running</span></td>
                <td className="tm-bar-cell">
                  <span className="tm-bar"><motion.i animate={{ width: `${r.cpu}%` }} transition={{ duration: 0.9 }} /></span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
