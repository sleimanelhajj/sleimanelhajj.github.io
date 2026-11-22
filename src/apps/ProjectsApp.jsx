import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiX, FiChevronRight } from 'react-icons/fi'
import { projects } from '../data'

function Folder({ hue }) {
  return (
    <svg viewBox="0 0 64 52" className="folder" style={{ '--h': hue }}>
      <path d="M4 8a4 4 0 0 1 4-4h14l6 6h28a4 4 0 0 1 4 4v4H4z" className="f-back" />
      <rect x="4" y="14" width="56" height="34" rx="4" className="f-front" />
      <path d="M14 30h10l4-6h8l4 6h10" className="f-trace" />
    </svg>
  )
}

export default function ProjectsApp() {
  const cats = ['All', ...new Set(projects.map((p) => p.category))]
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(null)
  const list = cat === 'All' ? projects : projects.filter((p) => p.category === cat)
  const p = open !== null ? projects[open] : null

  return (
    <div className="files">
      <aside className="files-side">
        <span className="side-h">Favorites</span>
        {cats.map((c) => (
          <button key={c} className={cat === c ? 'on' : ''} onClick={() => { setCat(c); setOpen(null) }}>
            <span>{c === 'All' ? 'All projects' : c}</span>
            <small>{c === 'All' ? projects.length : projects.filter((x) => x.category === c).length}</small>
          </button>
        ))}
      </aside>
      <div className="files-main">
        <div className="path mono">
          ~ <FiChevronRight /> projects {cat !== 'All' && <><FiChevronRight /> {cat.toLowerCase()}</>}
          {p && <><FiChevronRight /> <b>{p.title}</b></>}
        </div>
        <motion.div layout className="files-grid">
          <AnimatePresence mode="popLayout">
            {list.map((x) => {
              const idx = projects.indexOf(x)
              return (
                <motion.button
                  layout
                  key={x.title}
                  className={`file ${open === idx ? 'on' : ''}`}
                  onClick={() => setOpen(idx)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Folder hue={x.category === 'AI' ? 275 : 190} />
                  <span>{x.title}</span>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {p && (
            <motion.div className="info" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
              <button className="info-x" onClick={() => setOpen(null)} aria-label="Close details"><FiX /></button>
              <span className="mono info-kind">{p.category} project · Get Info</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="btn-row">
                {p.github && <a className="btn primary" href={p.github} target="_blank" rel="noreferrer"><FiGithub /> Source</a>}
                {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noreferrer"><FiExternalLink /> Live demo</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
