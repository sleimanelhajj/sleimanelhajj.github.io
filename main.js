/**
 * Main JavaScript - Sleiman El Hajj Portfolio
 * Handles UI interactions, animations, and form submissions
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
const CONFIG = {
    loadingDelay: 2500,
    typingSpeed: 100,
    scrollOffset: 100,
    titles: [
        'Full Stack Developer',
        'Computer Engineer',
        'AI Enthusiast',
        'Problem Solver',
        'Tech Explorer'
    ]
};

// ═══════════════════════════════════════════════════════════════════════════
// DOM ELEMENTS
// ═══════════════════════════════════════════════════════════════════════════
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    menuBtn: document.getElementById('menuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    navLinks: document.querySelectorAll('.nav-link'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    dynamicTitle: document.getElementById('dynamicTitle'),
    contactForm: document.getElementById('contactForm'),
    scrollProgressBar: document.querySelector('.scroll-progress-bar'),
    sections: document.querySelectorAll('.section')
};

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SCREEN
// ═══════════════════════════════════════════════════════════════════════════
function hideLoadingScreen() {
    setTimeout(() => {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
            
            // Start animations after loading
            initAnimations();
            startTypingAnimation();
        }
    }, CONFIG.loadingDelay);
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function initNavigation() {
    // Mobile menu toggle
    if (elements.menuBtn && elements.mobileNav) {
        elements.menuBtn.addEventListener('click', () => {
            elements.menuBtn.classList.toggle('active');
            elements.mobileNav.classList.toggle('active');
            document.body.style.overflow = elements.mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile nav on link click
    elements.mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.menuBtn.classList.remove('active');
            elements.mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Smooth scroll for all nav links
    [...elements.navLinks, ...elements.mobileNavLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    elements.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════════════════════════════════════
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        if (elements.scrollProgressBar) {
            elements.scrollProgressBar.style.width = `${scrolled}%`;
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPING ANIMATION
// ═══════════════════════════════════════════════════════════════════════════
function startTypingAnimation() {
    if (!elements.dynamicTitle) return;
    
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = CONFIG.typingSpeed;
    
    function type() {
        const currentTitle = CONFIG.titles[titleIndex];
        
        if (isDeleting) {
            elements.dynamicTitle.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = CONFIG.typingSpeed / 2;
        } else {
            elements.dynamicTitle.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = CONFIG.typingSpeed;
        }
        
        if (!isDeleting && charIndex === currentTitle.length) {
            typingDelay = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % CONFIG.titles.length;
            typingDelay = 500; // Pause before new word
        }
        
        setTimeout(type, typingDelay);
    }
    
    // Start typing after a brief delay
    setTimeout(type, 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════
function initAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('[data-animate]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    elements.sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe skill items
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
    });
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe experience items
    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
        observer.observe(item);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════════════════
function initContactForm() {
    if (!elements.contactForm) return;
    
    elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = elements.contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        const formData = new FormData(elements.contactForm);
        
        try {
            const response = await fetch('https://formspree.io/f/xwpvdypy', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });
            
            if (response.ok) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                elements.contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        background: type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: '1000',
        animation: 'fadeInUp 0.3s ease',
        backdropFilter: 'blur(10px)'
    });
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILL HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════
function initSkillEffects() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Add glow effect
            item.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.boxShadow = 'none';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT CARD EFFECTS
// ═══════════════════════════════════════════════════════════════════════════
function initProjectEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PARALLAX EFFECTS
// ═══════════════════════════════════════════════════════════════════════════
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - scrolled / 700;
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// CURSOR EFFECTS (Optional enhancement)
// ═══════════════════════════════════════════════════════════════════════════
function initCursorEffects() {
    // Skip on touch devices
    if ('ontouchstart' in window) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    Object.assign(cursor.style, {
        position: 'fixed',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid rgba(99, 102, 241, 0.5)',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'transform 0.1s ease, width 0.2s ease, height 0.2s ease',
        transform: 'translate(-50%, -50%)'
    });
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    Object.assign(cursorDot.style, {
        position: 'fixed',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.8)',
        pointerEvents: 'none',
        zIndex: '9999',
        transform: 'translate(-50%, -50%)'
    });
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'rgba(34, 211, 238, 0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to close mobile nav
        if (e.key === 'Escape' && elements.mobileNav.classList.contains('active')) {
            elements.menuBtn.classList.remove('active');
            elements.mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZE
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    hideLoadingScreen();
    initNavigation();
    initScrollProgress();
    initContactForm();
    initSkillEffects();
    initProjectEffects();
    initParallax();
    initCursorEffects();
    initKeyboardNav();
});

// Add CSS animations dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
    
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item,
    .project-card,
    .experience-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
    }
    
    .skill-item.visible,
    .project-card.visible,
    .experience-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);

// ═══════════════════════════════════════════════════════════════════════════
// MAGNETIC CURSOR TRAIL
// ═══════════════════════════════════════════════════════════════════════════
class CursorTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 15;
        this.mouseX = 0;
        this.mouseY = 0;
        this.container = null;
        this.colors = ['#6366f1', '#818cf8', '#22d3ee', '#f472b6'];
        this.isTouch = 'ontouchstart' in window;
        
        if (!this.isTouch) {
            this.init();
        }
    }
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'cursor-trail-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
        
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.animate();
    }
    
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.createParticle();
    }
    
    createParticle() {
        if (this.particles.length >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${this.mouseX - size / 2}px;
            top: ${this.mouseY - size / 2}px;
            pointer-events: none;
            opacity: 0.8;
            box-shadow: 0 0 ${size * 2}px ${color};
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            life: 1,
            size: size
        });
    }
    
    animate() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= 0.03;
            
            particle.element.style.opacity = particle.life * 0.8;
            particle.element.style.transform = `scale(${particle.life})`;
            
            if (particle.life <= 0) {
                particle.element.remove();
                this.particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail
new CursorTrail();

// ═══════════════════════════════════════════════════════════════════════════
// INTERACTIVE SKILL ORBIT (Mini Animation)
// ═══════════════════════════════════════════════════════════════════════════
function addSkillsOrbitEffect() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const orbitContainer = document.createElement('div');
    orbitContainer.className = 'skills-orbit';
    orbitContainer.innerHTML = `
        <div class="orbit-ring ring-1">
            <div class="orbit-dot"></div>
        </div>
        <div class="orbit-ring ring-2">
            <div class="orbit-dot"></div>
        </div>
        <div class="orbit-ring ring-3">
            <div class="orbit-dot"></div>
        </div>
    `;
    
    const orbitStyle = document.createElement('style');
    orbitStyle.textContent = `
        .skills-orbit {
            position: absolute;
            top: 50%;
            right: -150px;
            transform: translateY(-50%);
            width: 300px;
            height: 300px;
            opacity: 0.3;
            pointer-events: none;
        }
        
        .orbit-ring {
            position: absolute;
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            animation: orbit linear infinite;
        }
        
        .ring-1 {
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-duration: 8s;
        }
        
        .ring-2 {
            width: 180px;
            height: 180px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-duration: 12s;
            animation-direction: reverse;
        }
        
        .ring-3 {
            width: 260px;
            height: 260px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-duration: 16s;
        }
        
        .orbit-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, #6366f1, #22d3ee);
            border-radius: 50%;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
        }
        
        @keyframes orbit {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @media (max-width: 1200px) {
            .skills-orbit { display: none; }
        }
    `;
    
    document.head.appendChild(orbitStyle);
    skillsSection.style.position = 'relative';
    skillsSection.appendChild(orbitContainer);
}

// Add orbit effect after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addSkillsOrbitEffect, 100);
});

// ═══════════════════════════════════════════════════════════════════════════
// TERMINAL SECTION
// ═══════════════════════════════════════════════════════════════════════════
const terminalSteps = [
    { type: "command", text: "whoami" },
    { type: "output", text: ">>> Loading player profile..." },
    { type: "output", text: ">>> Name: Sleiman El Hajj" },
    { type: "output", text: ">>> Class: Fourth year Computer Engineering Student" },
    { type: "output", text: ">>> Location: Lebanese American University" },
    { type: "output", text: ">>> Specialization: Full Stack Development" },
    { type: "output", text: ">>> Upcoming AI enthusiast" },
    { type: "command", text: "cat mission.txt" },
    { type: "output", text: ">>> Mission: Creating efficient, scalable solutions using modern technologies." },
    { type: "output", text: ">>> Continuously learning through research and development" },
    { type: "command", text: "ls experience/" },
    { type: "output", text: ">>> Experience log:" },
    { type: "output", text: "   📁 part-time-fullstack-developer" },
    { type: "output", text: "   📁 freelance-backend-development" },
    { type: "output", text: "   📄 nodejs-express-systems.md" },
    { type: "output", text: "   📄 react-angular-webapps.md" },
    { type: "command", text: "echo $INTERESTS" },
    { type: "output", text: ">>> Web Development" },
    { type: "output", text: ">>> AI & Machine Learning" },
    { type: "output", text: ">>> NLP (Natural Language Processing)" },
    { type: "output", text: ">>> Linear Algebra" },
    { type: "output", text: ">>> Backend Development" },
];

function initTerminal() {
    const terminalBody = document.getElementById('terminalBody');
    const runTerminalBtn = document.getElementById('runTerminalBtn');
    
    if (!terminalBody || !runTerminalBtn) return;
    
    // Show initial prompt
    showTerminalPrompt();
    
    // Run button click handler
    runTerminalBtn.addEventListener('click', () => {
        playTerminalAnimation();
    });
    
    // Keyboard input handling
    let userInput = "";
    
    document.addEventListener('keydown', (e) => {
        const promptDiv = document.getElementById('terminalPrompt');
        if (!promptDiv || promptDiv.style.display === 'none') return;
        
        // Don't intercept if user is in a form field
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.contentEditable === 'true'
        )) {
            return;
        }
        
        // Ignore modifier keys
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        
        if (e.key === 'Backspace') {
            userInput = userInput.slice(0, -1);
            updateTerminalInput(userInput);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            processTerminalCommand(userInput);
            userInput = "";
            updateTerminalInput(userInput);
            e.preventDefault();
        } else if (e.key.length === 1) {
            userInput += e.key;
            updateTerminalInput(userInput);
            e.preventDefault();
        }
    });
}

function showTerminalPrompt() {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return;
    
    terminalBody.innerHTML = `
        <div id="terminalLines"></div>
        <div class="terminal-line" id="terminalPrompt">
            <span class="prompt">C:\\SLEIMAN&gt;</span>
            <span class="typed-command"></span>
            <span class="terminal-cursor"></span>
        </div>
    `;
}

function updateTerminalInput(input) {
    const typedCommand = document.querySelector('.typed-command');
    if (typedCommand) typedCommand.textContent = input;
}

function processTerminalCommand(command) {
    const linesDiv = document.getElementById('terminalLines');
    if (!linesDiv) return;
    
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${command}</span>`;
    linesDiv.appendChild(newLine);
    
    // Handle special commands
    if (command.trim().toLowerCase() === 'cls' || command.trim().toLowerCase() === 'clear') {
        linesDiv.innerHTML = '';
    } else if (command.trim().toLowerCase() === 'help') {
        const helpLine = document.createElement('div');
        helpLine.className = 'bio-line';
        helpLine.innerHTML = '>>> Available commands: whoami, help, cls, clear';
        linesDiv.appendChild(helpLine);
    } else if (command.trim().toLowerCase() === 'whoami') {
        const whoLine = document.createElement('div');
        whoLine.className = 'bio-line';
        whoLine.innerHTML = '>>> Sleiman El Hajj - Full Stack Developer & AI Enthusiast';
        linesDiv.appendChild(whoLine);
    }
    
    const terminalBody = document.getElementById('terminalBody');
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeCommand(command) {
    const typedCommand = document.querySelector('.typed-command');
    if (!typedCommand) return;
    
    typedCommand.innerHTML = '';
    for (let i = 0; i < command.length; i++) {
        typedCommand.innerHTML += command[i];
        await sleep(40);
    }
}

async function playTerminalAnimation() {
    const runTerminalBtn = document.getElementById('runTerminalBtn');
    const terminalBody = document.getElementById('terminalBody');
    const linesDiv = document.getElementById('terminalLines');
    
    if (!runTerminalBtn || !terminalBody || !linesDiv) return;
    
    runTerminalBtn.disabled = true;
    linesDiv.innerHTML = '';
    
    const showPrompt = (show = true) => {
        const promptDiv = document.getElementById('terminalPrompt');
        if (promptDiv) promptDiv.style.display = show ? 'flex' : 'none';
    };
    
    showPrompt(true);
    
    for (const step of terminalSteps) {
        if (step.type === 'command') {
            showPrompt(true);
            document.querySelector('.typed-command').innerHTML = '';
            await typeCommand(step.text);
            await sleep(400);
            
            const newLine = document.createElement('div');
            newLine.className = 'terminal-line';
            newLine.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${step.text}</span>`;
            linesDiv.appendChild(newLine);
            
            document.querySelector('.typed-command').innerHTML = '';
            showPrompt(false);
        } else {
            showPrompt(false);
            
            const outputLine = document.createElement('div');
            outputLine.className = 'bio-line';
            linesDiv.appendChild(outputLine);
            
            for (let i = 0; i < step.text.length; i++) {
                outputLine.innerHTML = step.text.slice(0, i + 1) + '<span class="terminal-cursor"></span>';
                await sleep(15);
            }
            outputLine.innerHTML = step.text;
            await sleep(200);
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    showPrompt(true);
    runTerminalBtn.disabled = false;
}

// Initialize terminal when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED STAT COUNTERS
// ═══════════════════════════════════════════════════════════════════════════
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();
    
    element.classList.add('counting');
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(target * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.classList.remove('counting');
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize stat counters when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initStatCounters();
});
