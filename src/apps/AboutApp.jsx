import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiFileText, FiMail, FiCpu, FiCode, FiZap } from 'react-icons/fi'
import { profile, about, systemInfo } from '../data'
import { Typewriter, Counter } from '../components/ui'

const TABS = ['Overview', 'Story', 'Stats']
const PILLARS = [
  { icon: <FiCpu />, title: 'Hardware-aware', text: 'I think from the transistor up, so my software respects the machine.' },
  { icon: <FiCode />, title: 'Full stack', text: 'APIs, databases and front ends that are clean and maintainable.' },
  { icon: <FiZap />, title: 'AI-driven', text: 'Agents and LLM workflows that turn messy problems into tools.' },
]

export default function AboutApp({ os }) {
  const [tab, setTab] = useState('Overview')
  return (
    <div className="about-app">
      <div className="seg">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'on' : ''}>
            {tab === t && <motion.span layoutId="about-seg" className="seg-pill" />}
            <span>{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="about-pane">
          {tab === 'Overview' && (
            <div className="ov">
              <div className="avatar">
                <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} />
                <span className="avatar-ring" />
              </div>
              <div className="ov-main">
                <h1>{profile.firstName} <span>{profile.lastName}</span></h1>
                <p className="ov-role mono"><Typewriter words={profile.roles} /></p>
                <dl className="specs">
                  {Object.entries(systemInfo).map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div className="btn-row">
                  <button className="btn primary" onClick={() => os.open('resume')}><FiFileText /> Resume</button>
                  <button className="btn" onClick={() => os.open('contact')}><FiMail /> Contact</button>
                  <a className="btn icon" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
                  <a className="btn icon" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
                </div>
              </div>
            </div>
          )}

          {tab === 'Story' && (
            <div className="story">
              {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              <div className="pillars">
                {PILLARS.map((p) => (
                  <div key={p.title} className="pillar">
                    <span>{p.icon}</span>
                    <strong>{p.title}</strong>
                    <small>{p.text}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Stats' && (
            <div className="stats">
              {about.stats.map((s) => (
                <div key={s.label} className="stat">
                  <b><Counter to={s.value} suffix={s.suffix} /></b>
                  <span>{s.label}</span>
                </div>
              ))}
              <div className="stat wide">
                <span className="mono">$ uptime</span>
                <b className="mono small">open to work · learning every day · load average: high</b>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
