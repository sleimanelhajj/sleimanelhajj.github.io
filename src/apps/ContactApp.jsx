import { useState } from 'react'
import { FiSend, FiCopy, FiCheck, FiGithub, FiLinkedin } from 'react-icons/fi'
import { profile } from '../data'

export default function ContactApp() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' })
  const [copied, setCopied] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  // Opens the visitor's mail client prefilled (no backend needed).
  const send = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(f.subject || `Hello from ${f.name}`)
    const body = encodeURIComponent(`${f.message}\n\n— ${f.name} (${f.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* */ }
  }

  return (
    <form className="mail" onSubmit={send}>
      <div className="mail-bar">
        <button type="submit" className="btn primary"><FiSend /> Send</button>
        <span className="mono dim">smtp://sleiman · port 25 · listening</span>
      </div>
      <div className="mail-row">
        <label>To:</label>
        <span className="to-chip">{profile.firstName} {profile.lastName} &lt;{profile.email}&gt;</span>
        <button type="button" className="ghost" onClick={copy} aria-label="Copy email">{copied ? <FiCheck /> : <FiCopy />}</button>
      </div>
      <div className="mail-row"><label htmlFor="m-name">From:</label><input id="m-name" required value={f.name} onChange={set('name')} placeholder="Your name" /></div>
      <div className="mail-row"><label htmlFor="m-email">Reply-to:</label><input id="m-email" required type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" /></div>
      <div className="mail-row"><label htmlFor="m-sub">Subject:</label><input id="m-sub" value={f.subject} onChange={set('subject')} placeholder="Let's build something" /></div>
      <textarea required value={f.message} onChange={set('message')} placeholder={'Hi Sleiman,\n\n'} aria-label="Message" />
      <div className="mail-foot">
        <a href={profile.github} target="_blank" rel="noreferrer"><FiGithub /> github.com/sleimanelhajj</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /> LinkedIn</a>
      </div>
    </form>
  )
}
