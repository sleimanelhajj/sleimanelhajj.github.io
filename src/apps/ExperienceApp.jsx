import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGitBranch, FiGitCommit } from 'react-icons/fi'
import { experience } from '../data'

// Career as a git client: commit list on the left, "diff" on the right.
export default function ExperienceApp() {
  const [sel, setSel] = useState(0)
  const e = experience[sel]
  return (
    <div className="git">
      <div className="git-bar">
        <span className="branch"><FiGitBranch /> main</span>
        <span className="mono dim">{experience.length} commits · origin/main up to date</span>
      </div>
      <div className="git-split">
        <ul className="git-list">
          {experience.map((x, i) => (
            <li key={x.hash}>
              <button className={i === sel ? 'on' : ''} onClick={() => setSel(i)}>
                <span className="g-rail"><i /></span>
                <span className="g-info">
                  <strong>{x.role}</strong>
                  <small>{x.company}</small>
                  <span className="mono g-meta"><em>{x.hash}</em> {x.period}</span>
                </span>
              </button>
            </li>
          ))}
          <li className="g-root mono"><span className="g-rail"><i /></span> initial commit: hello, world</li>
        </ul>
        <AnimatePresence mode="wait">
          <motion.article key={e.hash} className="git-detail" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.2 }}>
            <div className="mono g-head">
              <FiGitCommit /> commit <em>{e.hash}</em>
              {e.head && <span className="ref">HEAD → main</span>}
              <span className="ref alt">{e.type}</span>
            </div>
            <h2>{e.role}</h2>
            <p className="g-co">@ {e.company} <span className="mono dim">· {e.period}</span></p>
            <p className="g-desc">{e.description}</p>
            <div className="diff mono">
              <div className="diff-h">diff --git a/skills b/skills</div>
              {e.tags.map((t) => <div key={t} className="add">+ {t}</div>)}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  )
}
