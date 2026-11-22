// ─────────────────────────────────────────────────────────────
//  All portfolio content lives here. Edit this file to update
//  the site — no need to touch the components.
// ─────────────────────────────────────────────────────────────

export const profile = {
  firstName: 'Sleiman',
  lastName: 'El Hajj',
  initials: 'SEH',
  roles: ['Computer Engineer', 'Full Stack Developer', 'AI Enthusiast', 'Systems Builder'],
  tagline:
    'Computer Engineering graduate from the Lebanese American University. I design and build efficient, scalable systems, from the database schema up to the pixels.',
  location: 'Lebanon',
  status: 'Open to opportunities',
  email: 'sleimanelhajj7@gmail.com',
  github: 'https://github.com/sleimanelhajj',
  linkedin: 'https://linkedin.com/in/sleiman-el-hajj-0b32b9289',
  resume: '/ElHajj_Sleiman_CV.pdf',
  photo: '/profile.jpg',
}

export const about = {
  paragraphs: [
    'I am a Computer Engineering graduate from the Lebanese American University with a passion for building digital experiences that are fast, reliable and well engineered.',
    'My journey started with curiosity about how things work (logic gates, processors, networks) and grew into a love for full-stack software and intelligent systems.',
    'Outside of work you will find me exploring new tech, contributing to open source, or leading initiatives as Vice President of the IEEE Aeronautical & Electronics Club.',
  ],
  stats: [
    { value: 10, suffix: '+', label: 'Projects' },
    { value: 2, suffix: '+', label: 'Years Exp.' },
    { value: 1, suffix: '', label: 'Certificate' },
  ],
}

// Printed by the interactive terminal (`neofetch`)
export const systemInfo = {
  OS: 'SleimanOS v2.0 (CompE edition)',
  Host: 'Lebanese American University',
  Degree: 'B.E. Computer Engineering',
  Shell: 'zsh + coffee',
  Focus: 'Full Stack / AI Agents / Systems',
  Location: 'Lebanon',
}

export const skills = [
  { group: 'Frontend', code: 'U1', items: ['Angular', 'React', 'React Native', 'TypeScript', 'HTML', 'CSS'] },
  { group: 'Backend', code: 'U2', items: ['Node.js', 'Express', '.NET', 'REST APIs', 'Swagger'] },
  { group: 'Database', code: 'U3', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'] },
  { group: 'AI & ML', code: 'U4', items: ['Python', 'LangChain', 'LangGraph', 'Deep Learning', 'Keras', 'NumPy', 'LLMs'] },
  { group: 'Low-Level', code: 'U5', items: ['C / C++', 'Assembly', 'Verilog', 'Arduino', 'Digital Logic'] },
  { group: 'Tooling', code: 'U6', items: ['Git', 'Linux', 'Docker', 'Postman', 'VS Code'] },
]

export const experience = [
  {
    role: 'Full Stack Developer',
    company: 'Inframappa',
    type: 'Part-time',
    period: 'Apr 2025 – Present',
    hash: 'a3f9c21',
    head: true,
    description:
      'Building features for a leading US infrastructure mapping solution serving universities, hospitals and municipalities: orthorectified imagery, digitized engineering drawings and real-time 2D/3D mapping of above and underground assets.',
    tags: ['Angular', 'TypeScript', 'OpenLayers', 'GIS'],
  },
  {
    role: 'Backend Developer',
    company: 'Freelance',
    type: 'Contract',
    period: 'Feb 2025 – Mar 2025',
    hash: '7be04d8',
    description:
      'Developed the backend for a basketball court booking system: a RESTful API with Node.js and Express, Swagger documentation, and a PostgreSQL schema for sessions and reservations.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Swagger'],
  },
  {
    role: 'Vice President',
    company: 'IEEE Aeronautical & Electronics Club, LAU',
    type: 'Leadership',
    period: '2024 – Present',
    hash: '1c55e90',
    description:
      'Leading initiatives in aerospace engineering and electronics. Organizing technical workshops, coordinating student projects and connecting students with industry.',
    tags: ['Leadership', 'Event Planning', 'Project Management'],
  },
]

export const projects = [
  {
    title: 'Warehouse Agent',
    category: 'AI',
    description:
      'AI-powered warehouse assistant built with LangGraph and LangChain. Helps employees manage inventory through natural-language conversations.',
    tags: ['LangGraph', 'LangChain', 'Python', 'LLM'],
    github: 'https://github.com/sleimanelhajj/LLMs-project.git',
  },
  {
    title: 'Intelligent Engineering Algorithms',
    category: 'AI',
    description:
      'Search agent suite implementing A*, BFS, deep learning, K-means, Q-learning, cellular automata and genetic algorithms with a React visualizer.',
    tags: ['React', 'Flask', 'Python', 'Deep Learning'],
    github: 'https://github.com/sleimanelhajj/IEASubmission.git',
  },
  {
    title: 'BBB Hotel Booking',
    category: 'Web',
    description: 'Full-stack team project to book and list hotel rooms, backed by MongoDB and a Node/Express API.',
    tags: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/sleimanelhajj/BBB',
  },
  {
    title: 'Propertease',
    category: 'Web',
    description: 'Property listing application for adding and browsing properties, built with React, Node.js and MySQL.',
    tags: ['React', 'Node.js', 'MySQL'],
    github: 'https://github.com/sleimanelhajj/DBProject.git',
  },
  {
    title: 'Job Portal',
    category: 'Web',
    description: 'Browse job posts and create listings. React front end with MongoDB for data management.',
    tags: ['React', 'MongoDB'],
    github: 'https://github.com/sleimanelhajj/react-project.git',
  },
]
