/**
 * Sleiman El Hajj — Portfolio JS
 */

// ── Config ───────────────────────────────────────────────────────
const CONFIG = {
    loadingDelay: 1600,
    typingSpeed: 100,
    titles: [
        'Full Stack Developer',
        'Computer Engineer',
        'AI Enthusiast',
        'Problem Solver',
    ]
};

// ── DOM refs ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ── Loading Screen ───────────────────────────────────────────────
function hideLoadingScreen() {
    setTimeout(() => {
        const screen = $('loadingScreen');
        if (!screen) return;
        screen.classList.add('hidden');
        setTimeout(() => {
            screen.remove();
            initGSAP();
            startTypingAnimation();
        }, 500);
    }, CONFIG.loadingDelay);
}

// ── GSAP Animations ──────────────────────────────────────────────
function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .from('.hero-greeting',     { opacity: 0, y: 18, duration: 0.55 })
        .from('.name-line',         { opacity: 0, y: 30, duration: 0.6, stagger: 0.12 }, '-=0.3')
        .from('.hero-title',        { opacity: 0, y: 18, duration: 0.5 }, '-=0.35')
        .from('.hero-description',  { opacity: 0, y: 18, duration: 0.45 }, '-=0.3')
        .from('.hero-cta',          { opacity: 0, y: 18, duration: 0.4 }, '-=0.25')
        .from('.hero-social',       { opacity: 0, y: 14, duration: 0.35 }, '-=0.2')
        .from('.scroll-indicator',  { opacity: 0, duration: 0.4 }, '-=0.1');

    // Helper: section header reveal
    $$('.section-header').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
            opacity: 0, x: -24, duration: 0.6, ease: 'power2.out'
        });
    });

    // About text
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        gsap.from(aboutText.children, {
            scrollTrigger: { trigger: aboutText, start: 'top 78%', once: true },
            opacity: 0, y: 20, stagger: 0.1, duration: 0.55, ease: 'power2.out'
        });
    }
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        gsap.from(aboutImage, {
            scrollTrigger: { trigger: aboutImage, start: 'top 78%', once: true },
            opacity: 0, scale: 0.95, duration: 0.65, ease: 'power2.out'
        });
    }

    // Skill cards — staggered
    gsap.from('.skill-card', {
        scrollTrigger: { trigger: '#skills', start: 'top 75%', once: true },
        opacity: 0, y: 24, stagger: 0.12, duration: 0.55, ease: 'power2.out'
    });

    // Experience items
    gsap.from('.experience-item', {
        scrollTrigger: { trigger: '#experience', start: 'top 72%', once: true },
        opacity: 0, x: -28, stagger: 0.15, duration: 0.55, ease: 'power2.out'
    });

    // Project cards
    gsap.from('.project-card', {
        scrollTrigger: { trigger: '#projects', start: 'top 72%', once: true },
        opacity: 0, y: 30, stagger: 0.1, duration: 0.5, ease: 'power2.out'
    });

    // Contact
    gsap.from('.contact-text', {
        scrollTrigger: { trigger: '#contact', start: 'top 78%', once: true },
        opacity: 0, x: -24, duration: 0.55, ease: 'power2.out'
    });
    gsap.from('.contact-form', {
        scrollTrigger: { trigger: '#contact', start: 'top 78%', once: true },
        opacity: 0, x: 24, duration: 0.55, ease: 'power2.out'
    });
}

// ── Navigation ───────────────────────────────────────────────────
function initNavigation() {
    const menuBtn   = $('menuBtn');
    const mobileNav = $('mobileNav');
    const navLinks  = $$('.nav-link');
    const mobileLinks = $$('.mobile-nav-link');
    const sections  = $$('.section');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn && menuBtn.classList.remove('active');
            mobileNav && mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    [...navLinks, ...mobileLinks].forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', () => {
        const pos = window.scrollY + window.innerHeight / 3;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.dataset.section === sec.id);
                });
            }
        });
    }, { passive: true });

    // Escape closes mobile nav
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
            menuBtn && menuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ── Scroll Progress ──────────────────────────────────────────────
function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(window.scrollY / total) * 100}%`;
    }, { passive: true });
}

// ── Typing Animation ─────────────────────────────────────────────
function startTypingAnimation() {
    const el = $('dynamicTitle');
    if (!el) return;

    let idx = 0, charIdx = 0, deleting = false, delay = CONFIG.typingSpeed;

    function type() {
        const current = CONFIG.titles[idx];
        if (deleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            delay = CONFIG.typingSpeed / 2;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            delay = CONFIG.typingSpeed;
        }

        if (!deleting && charIdx === current.length) {
            delay = 2200;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            idx = (idx + 1) % CONFIG.titles.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }

    setTimeout(type, 900);
}

// ── Stat Counters ────────────────────────────────────────────────
function initStatCounters() {
    const stats = $$('.stat-number[data-target]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const dur    = 1800;

    function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(target * ease) + suffix;
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ── Contact Form ─────────────────────────────────────────────────
function initContactForm() {
    const form = $('contactForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        try {
            const res = await fetch('https://formspree.io/f/xwpvdypy', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            });
            if (res.ok) {
                showNotification('Message sent! I\'ll get back to you soon.', 'success');
                form.reset();
            } else throw new Error();
        } catch {
            showNotification('Failed to send. Please try again.', 'error');
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    });
}

function showNotification(msg, type) {
    $$('.notification').forEach(n => n.remove());
    const n = document.createElement('div');
    Object.assign(n.style, {
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        padding: '0.85rem 1.25rem',
        background: type === 'success' ? 'rgba(34,197,94,0.95)' : 'rgba(239,68,68,0.95)',
        color: '#fff', borderRadius: '8px', fontSize: '0.875rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        zIndex: '9999', backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease'
    });
    n.className = 'notification';
    n.innerHTML = `<span>${msg}</span><button style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;line-height:1" onclick="this.parentElement.remove()">&times;</button>`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 5000);
}

// ── Terminal ─────────────────────────────────────────────────────
const terminalSteps = [
    { type: 'command', text: 'whoami' },
    { type: 'output',  text: '>>> Loading profile...' },
    { type: 'output',  text: '>>> Name: Sleiman El Hajj' },
    { type: 'output',  text: '>>> Role: Fourth year Computer Engineering Student' },
    { type: 'output',  text: '>>> University: Lebanese American University' },
    { type: 'output',  text: '>>> Specialization: Full Stack Development' },
    { type: 'output',  text: '>>> Upcoming: AI & Machine Learning' },
    { type: 'command', text: 'cat mission.txt' },
    { type: 'output',  text: '>>> Mission: Building efficient, scalable solutions with modern technology.' },
    { type: 'output',  text: '>>> Continuously learning through research and development.' },
    { type: 'command', text: 'ls experience/' },
    { type: 'output',  text: '>>> Experience log:' },
    { type: 'output',  text: '  /part-time-fullstack-developer-inframappa' },
    { type: 'output',  text: '  /freelance-backend-development' },
    { type: 'output',  text: '  nodejs-express-systems.md' },
    { type: 'output',  text: '  react-angular-webapps.md' },
    { type: 'command', text: 'echo $INTERESTS' },
    { type: 'output',  text: '>>> Web Development | AI/ML | NLP | Backend Systems' },
];

function initTerminal() {
    const body   = $('terminalBody');
    const runBtn = $('runTerminalBtn');
    if (!body || !runBtn) return;

    showTerminalPrompt();
    runBtn.addEventListener('click', () => playTerminalAnimation());

    // Keyboard input
    let userInput = '';
    document.addEventListener('keydown', e => {
        const prompt = $('terminalPrompt');
        if (!prompt || prompt.style.display === 'none') return;
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === 'Backspace') {
            userInput = userInput.slice(0, -1);
            updateTerminalInput(userInput);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            processTerminalCommand(userInput);
            userInput = '';
            updateTerminalInput('');
            e.preventDefault();
        } else if (e.key.length === 1) {
            userInput += e.key;
            updateTerminalInput(userInput);
            e.preventDefault();
        }
    });
}

function showTerminalPrompt() {
    const body = $('terminalBody');
    if (!body) return;
    body.innerHTML = `
        <div id="terminalLines"></div>
        <div class="terminal-line" id="terminalPrompt">
            <span class="prompt">C:\\SLEIMAN&gt;</span>
            <span class="typed-command"></span>
            <span class="terminal-cursor"></span>
        </div>`;
}

function updateTerminalInput(val) {
    const el = document.querySelector('.typed-command');
    if (el) el.textContent = val;
}

function processTerminalCommand(cmd) {
    const lines = $('terminalLines');
    if (!lines) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${cmd}</span>`;
    lines.appendChild(line);

    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'cls' || trimmed === 'clear') {
        lines.innerHTML = '';
    } else if (trimmed === 'help') {
        const h = document.createElement('div');
        h.className = 'bio-line';
        h.textContent = '>>> Commands: whoami  help  cls  clear';
        lines.appendChild(h);
    } else if (trimmed === 'whoami') {
        const w = document.createElement('div');
        w.className = 'bio-line';
        w.textContent = '>>> Sleiman El Hajj — Full Stack Developer & AI Enthusiast';
        lines.appendChild(w);
    }

    const body = $('terminalBody');
    if (body) body.scrollTop = body.scrollHeight;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function typeCommand(text) {
    const el = document.querySelector('.typed-command');
    if (!el) return;
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
        el.textContent += text[i];
        await sleep(38);
    }
}

async function playTerminalAnimation() {
    const runBtn = $('runTerminalBtn');
    const body   = $('terminalBody');
    const lines  = $('terminalLines');
    if (!runBtn || !body || !lines) return;

    runBtn.disabled = true;
    lines.innerHTML = '';

    const showPrompt = show => {
        const p = $('terminalPrompt');
        if (p) p.style.display = show ? 'flex' : 'none';
    };

    showPrompt(true);

    for (const step of terminalSteps) {
        if (step.type === 'command') {
            showPrompt(true);
            document.querySelector('.typed-command').textContent = '';
            await typeCommand(step.text);
            await sleep(380);

            const l = document.createElement('div');
            l.className = 'terminal-line';
            l.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${step.text}</span>`;
            lines.appendChild(l);
            document.querySelector('.typed-command').textContent = '';
            showPrompt(false);
        } else {
            showPrompt(false);
            const out = document.createElement('div');
            out.className = 'bio-line';
            lines.appendChild(out);

            for (let i = 0; i < step.text.length; i++) {
                out.innerHTML = step.text.slice(0, i + 1) + '<span class="terminal-cursor"></span>';
                await sleep(14);
            }
            out.textContent = step.text;
            await sleep(180);
        }
        body.scrollTop = body.scrollHeight;
    }

    showPrompt(true);
    runBtn.disabled = false;
}

// ── Vanta Background ─────────────────────────────────────────────
function initVanta() {
    if (typeof VANTA === 'undefined') return;
    VANTA.BIRDS({
        el: '#vanta-bg',
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 0.6,
        backgroundColor: 0xfaf9ff,
        color1: 0x9b84f5,
        color2: 0xf472b6,
        colorMode: 'variance',
        birdSize: 1.2,
        wingSpan: 28,
        speedLimit: 4.0,
        separation: 60,
        alignment: 50,
        cohesion: 50,
        quantity: 4,
    });
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initVanta();
    hideLoadingScreen();
    initNavigation();
    initScrollProgress();
    initContactForm();
    initStatCounters();
    initTerminal();
});

// Keyframe for notification slide
const style = document.createElement('style');
style.textContent = `@keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
