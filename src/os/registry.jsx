import { FiUser, FiTerminal, FiCpu, FiGitBranch, FiFolder, FiMail, FiFileText } from 'react-icons/fi'
import AboutApp from '../apps/AboutApp'
import TerminalApp from '../apps/TerminalApp'
import SkillsApp from '../apps/SkillsApp'
import ExperienceApp from '../apps/ExperienceApp'
import ProjectsApp from '../apps/ProjectsApp'
import ContactApp from '../apps/ContactApp'
import ResumeApp from '../apps/ResumeApp'

// Every "app" on SleimanOS. `label` is the short name under the icon,
// `title` is the window title. w/h are the preferred window size.
export const APPS = [
  { id: 'about', label: 'About', title: 'About This Engineer', icon: FiUser, color: ['#38e1ff', '#2563eb'], w: 760, h: 540, comp: AboutApp },
  { id: 'terminal', label: 'Terminal', title: 'guest@sleiman: ~', icon: FiTerminal, color: ['#334155', '#0b1220'], w: 640, h: 420, comp: TerminalApp },
  { id: 'skills', label: 'Skills', title: 'Task Manager — Skills', icon: FiCpu, color: ['#34f5a0', '#0d9488'], w: 780, h: 520, comp: SkillsApp },
  { id: 'experience', label: 'Experience', title: 'Source Control — career.git', icon: FiGitBranch, color: ['#ffc14d', '#f97316'], w: 820, h: 520, comp: ExperienceApp },
  { id: 'projects', label: 'Projects', title: 'Files — ~/projects', icon: FiFolder, color: ['#c084fc', '#6366f1'], w: 820, h: 540, comp: ProjectsApp },
  { id: 'contact', label: 'Contact', title: 'Mail — New Message', icon: FiMail, color: ['#ff7a85', '#db2777'], w: 640, h: 540, comp: ContactApp },
  { id: 'resume', label: 'Resume.pdf', title: 'Preview — ElHajj_Sleiman_CV.pdf', icon: FiFileText, color: ['#f1f5f9', '#94a3b8'], w: 720, h: 620, comp: ResumeApp },
]

export const getApp = (id) => APPS.find((a) => a.id === id)

export function AppIcon({ app, size = 56 }) {
  const Icon = app.icon
  return (
    <span
      className="app-icon"
      style={{ width: size, height: size, '--c1': app.color[0], '--c2': app.color[1], fontSize: size * 0.44 }}
    >
      <Icon />
    </span>
  )
}
