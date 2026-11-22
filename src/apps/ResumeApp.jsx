import { FiDownload, FiExternalLink } from 'react-icons/fi'
import { profile } from '../data'

export default function ResumeApp() {
  return (
    <div className="resume">
      <div className="mail-bar">
        <a className="btn primary" href={profile.resume} download><FiDownload /> Download</a>
        <a className="btn" href={profile.resume} target="_blank" rel="noreferrer"><FiExternalLink /> Open</a>
      </div>
      <iframe src={`${profile.resume}#view=FitH`} title="Resume" />
    </div>
  )
}
