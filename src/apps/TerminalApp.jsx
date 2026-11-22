import { useEffect, useRef, useState } from 'react'
import { profile, systemInfo, skills, projects, experience } from '../data'

const PROMPT = 'guest@sleiman:~$'
const ASCII = String.raw`   ____  _____ _   _
  / ___|| ____| | | |
  \___ \|  _| | |_| |
   ___) | |___|  _  |
  |____/|_____|_| |_|`

const CMDS = ['help', 'whoami', 'neofetch', 'skills', 'projects', 'experience', 'contact', 'open', 'resume', 'clear', 'sudo hire-me']

function run(cmd, os) {
  const [c, ...args] = cmd.trim().split(/\s+/)
  switch ((c || '').toLowerCase()) {
    case '': return []
    case 'help':
      return [
        'available commands:',
        '  whoami       who is this guy?',
        '  neofetch     system information',
        '  skills       list installed modules',
        '  projects     ls ~/projects',
        '  experience   git log --career',
        '  contact      ways to reach me',
        '  open <app>   open about|skills|projects|experience|contact|resume',
        '  sudo hire-me ;)',
        '  clear        clear the screen',
      ]
    case 'whoami': return [`${profile.firstName} ${profile.lastName}`, profile.tagline]
    case 'neofetch': return [{ neo: true }]
    case 'skills': return skills.map((s) => `[${s.code}] ${s.group.padEnd(10)} ${s.items.join(', ')}`)
    case 'ls':
    case 'projects': return projects.map((p) => `drwxr-xr-x  ${p.category.padEnd(4)}  ${p.title}`)
    case 'experience':
    case 'git': return experience.map((e) => `* ${e.hash}  ${e.role} @ ${e.company}  (${e.period})`)
    case 'contact': return [`email:    ${profile.email}`, `github:   ${profile.github}`, `linkedin: ${profile.linkedin}`]
    case 'open': {
      const a = (args[0] || '').toLowerCase()
      if (!['about', 'skills', 'projects', 'experience', 'contact', 'resume', 'terminal'].includes(a)) return ['usage: open about|skills|projects|experience|contact|resume']
      setTimeout(() => os.open(a), 300)
      return [`launching ${a}...`]
    }
    case 'resume':
    case 'cv': setTimeout(() => os.open('resume'), 300); return ['opening ElHajj_Sleiman_CV.pdf...']
    case 'sudo':
      if (args.join(' ').includes('hire')) {
        setTimeout(() => os.open('contact'), 900)
        return ['[sudo] password for guest: ********', 'access granted. opening Mail...']
      }
      return ['guest is not in the sudoers file. try: sudo hire-me']
    case 'echo': return [args.join(' ')]
    case 'date': return [new Date().toString()]
    case 'rm': return ['nice try. this filesystem is read-only.']
    case 'exit': return ['there is no escape. close the window instead.']
    default: return [`command not found: ${c}. type 'help'`]
  }
}

export default function TerminalApp({ os }) {
  const [history, setHistory] = useState([{ cmd: null, out: ["SleimanOS 2.0 tty1 — type 'help' to get started."] }])
  const [input, setInput] = useState('')
  const [past, setPast] = useState([])
  const [ptr, setPtr] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }) }, [history])

  const submit = (cmd) => {
    if (cmd.trim().toLowerCase() === 'clear') setHistory([])
    else setHistory((h) => [...h, { cmd, out: run(cmd, os) }])
    if (cmd.trim()) setPast((p) => [cmd, ...p])
    setPtr(-1)
    setInput('')
  }

  const onKey = (e) => {
    if (e.key === 'Enter') submit(input)
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(ptr + 1, past.length - 1)
      if (past[n] !== undefined) { setPtr(n); setInput(past[n]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = ptr - 1
      setPtr(n)
      setInput(n >= 0 ? past[n] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const m = CMDS.find((x) => x.startsWith(input))
      if (input && m) setInput(m)
    }
  }

  const line = (o, i) => {
    if (typeof o === 'string') return <div key={i}>{o}</div>
    if (o.neo)
      return (
        <div key={i} className="neo">
          <pre>{ASCII}</pre>
          <div>
            <div><b className="t-green">guest</b>@<b className="t-cyan">sleiman</b></div>
            <div className="t-dim">-------------</div>
            {Object.entries(systemInfo).map(([k, v]) => <div key={k}><b className="t-cyan">{k}</b>: {v}</div>)}
            <div className="palette">{Array.from({ length: 8 }).map((_, k) => <i key={k} />)}</div>
          </div>
        </div>
      )
    return null
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term-scroll mono" ref={bodyRef}>
        {history.map((h, i) => (
          <div key={i} className="t-block">
            {h.cmd !== null && <div><span className="t-green">{PROMPT}</span> {h.cmd}</div>}
            <div className="t-out">{h.out.map(line)}</div>
          </div>
        ))}
        <div className="t-input">
          <span className="t-green">{PROMPT}</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label="Terminal input" />
        </div>
      </div>
      <div className="t-chips">
        {['help', 'neofetch', 'skills', 'projects', 'sudo hire-me'].map((c) => (
          <button key={c} className="mono" onClick={(e) => { e.stopPropagation(); submit(c) }}>{c}</button>
        ))}
      </div>
    </div>
  )
}
