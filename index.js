const terminalBody = document.getElementById("terminalBody");
const getToKnowMeBtn = document.getElementById("getToKnowMeBtn");

const terminalSteps = [
  { type: "command", text: "who am i" },
  { type: "output", text: ">>> Loading player profile..." },
  { type: "output", text: ">>> Name: Sleiman El Hajj" },
  {
    type: "output",
    text: ">>> Class: Fourth year Computer Engineering Student",
  },
  { type: "output", text: ">>> Location: Lebanese American University" },
  { type: "output", text: ">>> Specialization: Full Stack Development" },
  { type: "output", text: ">>> Upcoming AI enthusiast" },
  { type: "command", text: "What is my mission" },
  {
    type: "output",
    text: ">>> Mission: Creating efficient, scalable solutions using modern technologies.",
  },
  {
    type: "output",
    text: ">>> Continously learning through research and development",
  },
  { type: "command", text: "brief summary of my experience" },
  { type: "output", text: ">>> Experience log:" },
  { type: "output", text: "- Currently a part time full stack developer" },
  { type: "output", text: "- Freelance backend development" },
  { type: "output", text: "- Building robust systems with Node.js & Express" },
  {
    type: "output",
    text: "- Creating dynamic web applications with React.js and Angular",
  },
];
function showInitialPrompt() {
  terminalBody.innerHTML = `
    <div id="terminalLines"></div>
    <div class="terminal-line" id="terminalPrompt">
      <span class="prompt">C:\\SLEIMAN&gt;</span>
      <span class="typed-command"></span>
      <span class="terminal-cursor"></span>
    </div>
  `;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeCommand(command) {
  const typedCommand = document.querySelector(".typed-command");
  typedCommand.innerHTML = "";
  for (let i = 0; i < command.length; i++) {
    typedCommand.innerHTML += command[i];
    await sleep(30);
  }
}

async function playTerminal() {
  getToKnowMeBtn.disabled = true;
  const linesDiv = document.getElementById("terminalLines");
  let stepIndex = 0;

  // Helper to show/hide the prompt at the bottom
  function showPrompt(show = true) {
    const promptDiv = document.getElementById("terminalPrompt");
    if (promptDiv) promptDiv.style.display = show ? "block" : "none";
  }

  // Start with prompt visible
  showPrompt(true);

  while (stepIndex < terminalSteps.length) {
    const step = terminalSteps[stepIndex];

    if (step.type === "command") {
      // Show prompt and type command at the prompt
      showPrompt(true);
      document.querySelector(".typed-command").innerHTML = "";
      await typeCommand(step.text);
      await sleep(300);

      // Move the finished command line to terminalLines
      const promptDiv = document.getElementById("terminalPrompt");
      const newLine = document.createElement("div");
      newLine.className = "terminal-line";
      newLine.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${step.text}</span>`;
      linesDiv.appendChild(newLine);

      // Reset the prompt for next output/command
      promptDiv.querySelector(".typed-command").innerHTML = "";
      terminalBody.scrollTop = terminalBody.scrollHeight;

      // Hide prompt for output phase
      showPrompt(false);
    } else {
      // Output appears as a new line above the prompt (prompt hidden)
      // Hide the prompt cursor
      showPrompt(false);

      // Create output line with cursor
      const outputLine = document.createElement("div");
      outputLine.className = "bio-line";
      linesDiv.appendChild(outputLine);

      for (let i = 0; i < step.text.length; i++) {
        // Always keep the cursor at the end while typing
        outputLine.innerHTML =
          step.text.slice(0, i + 1) + '<span class="terminal-cursor"></span>';
        await sleep(15);
      }
      // Remove cursor after output is done typing
      outputLine.innerHTML = step.text;
      await sleep(300);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    stepIndex++;
  }

  // After all steps, show prompt again
  showPrompt(true);
  getToKnowMeBtn.disabled = false;
}

// Play the terminal animation without removing the prompt

// Show prompt on load
showInitialPrompt();

// Prevent default for anchor tags with href="#"
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (e) => e.preventDefault());
});

// --- USER INPUT HANDLING FOR TERMINAL ---

let userInput = "";

function focusTerminal() {
  // Focus the window so keydown works even after clicking elsewhere
  window.focus();
}

function updatePromptInput() {
  const typedCommand = document.querySelector(".typed-command");
  if (typedCommand) typedCommand.textContent = userInput;
}


document.addEventListener("keydown", function (e) {
  const promptDiv = document.getElementById("terminalPrompt");
  if (!promptDiv || promptDiv.style.display === "none") return;

  // NEW: Check if user is typing in a form input - if so, don't intercept
  const activeElement = document.activeElement;
  if (activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' || 
    activeElement.contentEditable === 'true'
  )) {
    return; // Let the form input handle the keypress
  }

  // Ignore if modifier keys are pressed
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Backspace") {
    userInput = userInput.slice(0, -1);
    updatePromptInput();
    e.preventDefault();
  } else if (e.key === "Enter") {
    processUserCommand(userInput);
    userInput = "";
    updatePromptInput();
    e.preventDefault();
  } else if (e.key.length === 1) {
    userInput += e.key;
    updatePromptInput();
    e.preventDefault();
  }
});

function processUserCommand(command) {
  const linesDiv = document.getElementById("terminalLines");
  // Add the user's command to the terminal
  const newLine = document.createElement("div");
  newLine.className = "terminal-line";
  newLine.innerHTML = `<span class="prompt">C:\\SLEIMAN&gt;</span> <span class="command">${command}</span>`;
  linesDiv.appendChild(newLine);

  // If command is 'cls', clear the terminal
  if (command.trim().toLowerCase() === "cls") {
    linesDiv.innerHTML = "";
  }

  // Always scroll to bottom
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// When the page loads or after animation, reset user input and focus
function resetPromptInput() {
  userInput = "";
  updatePromptInput();
  focusTerminal();
}

// After your playTerminal function, add this:
getToKnowMeBtn.addEventListener("click", () => {
  playTerminal().then(resetPromptInput);
});

// Also call resetPromptInput on load
resetPromptInput();




// --- PROJECT LEVEL SELECT ---
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    // Remove active from all
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Hide all cards
    document.querySelectorAll('.project-card').forEach(card => card.style.display = 'none');
    // Show selected level
    const level = this.getAttribute('data-level');
    const card = document.querySelector(`.project-card[data-level="${level}"]`);
    if (card) card.style.display = '';
  });
});
// Set Level 1 as default
document.querySelector('.level-btn[data-level="1"]').classList.add('active');

// Form Submission Handling
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://formspree.io/f/xwpvdypy", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await response.json();
      console.log("Formspree Response:", result);

      if (response.ok) {
        alert(
          "Thank you for your message! I will get back to you soon."
        );
        contactForm.reset();
      } else {
        alert("Failed to send message. Check console for details.");
      }
    } catch (error) {
      console.error("Error sending form:", error);
      alert("An error occurred. Please try again later.");
    }
  });
}


// ...existing code...

// Hamburger Menu Functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
}


// ...existing code...

// PAGE LOADING ANIMATION
window.addEventListener('load', () => {
  // Hide loading screen after 2.5 seconds
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      
      // Remove loading screen from DOM after animation
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
    
    // Start entrance animations
    initEntranceAnimations();
    createParticles();
  }, 2500);
});

// ENTRANCE ANIMATIONS
function initEntranceAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// FLOATING PARTICLES
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  const numberOfParticles = 50;
  
  for (let i = 0; i < numberOfParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    particlesContainer.appendChild(particle);
  }
}

// TYPING ANIMATION FOR NAME
function initTypingAnimation() {
  const nameElement = document.querySelector('.name');
  if (!nameElement) return;
  
  const text = nameElement.textContent;
  nameElement.textContent = '';
  nameElement.classList.add('typing-animation');
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      nameElement.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      // Remove typing cursor after animation
      setTimeout(() => {
        nameElement.style.borderRight = 'none';
      }, 1000);
    }
  };
  
  // Start typing after loading screen disappears
  setTimeout(typeWriter, 3000);
}

// Initialize typing animation
initTypingAnimation();

// SMOOTH SCROLLING WITH OFFSET FOR FIXED NAV
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ...existing code...
// CONSTELLATION BACKGROUND
// index.js
// index.js

// ─────────────────────────────────────────────────────────────────────────────
// ★ CONFIGURATION ★
const STAR_COLOR_DEFAULT   = '#3b82f6';          // default star fill
const STAR_COLOR_CLICKED   = '#FF4500';          // clicked star fill
const CONST_LINE_COLOR     = '#3b82f6'; // constellation lines
const PERM_LINE_COLOR      = '#3b82f6'; // permanent click‐lines
const MOUSE_LINE_COLOR     = '#3b82f6'; // hover‐to‐mouse lines

// how close two clicked stars must be to form one constellation
const CLUSTER_MAX_DISTANCE   = 120;

// how close a pointer-click must land to a star to toggle it
const CLICK_HIT_RADIUS       = 30;
// ─────────────────────────────────────────────────────────────────────────────

class ConstellationBackground {
  constructor() {
    this.canvas = document.getElementById('constellation');
    this.ctx    = this.canvas.getContext('2d');
    this.stars  = [];
    this.mouse  = { x: 0, y: 0 };

    // store clicked stars
    this.clickedStars         = new Set();
    // store permanent connections between clicked stars
    this.permanentConnections = [];

    this.init();
    this.animate();
    this.addEventListeners();
  }
  
  init() {
    this.resize();
    this.createStars();
  }
  
  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createStars() {
    const area     = this.canvas.width * this.canvas.height;
    const numStars = Math.floor(area / 8000);
    this.stars = [];

    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        brightness: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
        clicked: false
      });
    }
  }
  
  drawStars() {
    this.stars.forEach(star => {
      this.ctx.save();
      this.ctx.globalAlpha = star.brightness;
      this.ctx.fillStyle  = star.clicked ? STAR_COLOR_CLICKED : STAR_COLOR_DEFAULT;
      this.ctx.shadowBlur  = star.size * 2;
      this.ctx.shadowColor = this.ctx.fillStyle;

      this.ctx.beginPath();
      this.ctx.arc(
        star.x,
        star.y,
        star.clicked ? star.size * 1.5 : star.size,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.restore();

      // twinkle
      star.brightness += (Math.random() - 0.5) * 0.02;
      star.brightness = Math.max(0.3, Math.min(1, star.brightness));
    });
  }

  drawConstellations() {
    this.ctx.strokeStyle = CONST_LINE_COLOR;
    this.ctx.lineWidth   = 1;

    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const s1 = this.stars[i];
        const s2 = this.stars[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CLUSTER_MAX_DISTANCE) {
          this.ctx.globalAlpha = (CLUSTER_MAX_DISTANCE - dist) / CLUSTER_MAX_DISTANCE * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(s1.x, s1.y);
          this.ctx.lineTo(s2.x, s2.y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawPermanentConnections() {
    this.ctx.strokeStyle = PERM_LINE_COLOR;
    this.ctx.lineWidth   = 3;
    this.ctx.globalAlpha = 1;

    this.permanentConnections.forEach(conn => {
      this.ctx.beginPath();
      this.ctx.moveTo(conn.star1.x, conn.star1.y);
      this.ctx.lineTo(conn.star2.x, conn.star2.y);
      this.ctx.stroke();
    });
  }

  drawMouseConnections() {
    this.ctx.strokeStyle = MOUSE_LINE_COLOR;
    this.ctx.lineWidth   = 2;

    this.stars.forEach(star => {
      const dx   = star.x - this.mouse.x;
      const dy   = star.y - this.mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 150) {
        this.ctx.globalAlpha = (150 - dist) / 150 * 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    });
    this.ctx.globalAlpha = 1;
  }

  handleCanvasClick(e) {
    // find click position
    const rect   = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // find nearest star
    let closest = null;
    let minD    = CLICK_HIT_RADIUS;
    this.stars.forEach(star => {
      const dx   = star.x - clickX;
      const dy   = star.y - clickY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minD) {
        minD    = dist;
        closest = star;
      }
    });
    if (!closest) return;
    
    // toggle it
    closest.clicked = !closest.clicked;

    if (closest.clicked) {
      // add to clicked set
      this.clickedStars.add(closest);

      // connect it only to other clicked stars within CLUSTER_MAX_DISTANCE
      this.clickedStars.forEach(other => {
        if (other !== closest) {
          const dx   = other.x - closest.x;
          const dy   = other.y - closest.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CLUSTER_MAX_DISTANCE) {
            this.permanentConnections.push({ star1: closest, star2: other });
          }
        }
      });
    } else {
      // remove from clicked set
      this.clickedStars.delete(closest);
      // drop any permanent connections to/from it
      this.permanentConnections = this.permanentConnections.filter(
        c => c.star1 !== closest && c.star2 !== closest
      );
    }
  }

 updateStars() {
  this.stars.forEach(star => {
    star.y += star.speed;

    if (star.y > this.canvas.height + 10) {
      // Teleport back to top
      star.y = -10;
      star.x = Math.random() * this.canvas.width;

      // ⚠️ NEW: if it was clicked, un-click it and drop its connections
      if (star.clicked) {
        star.clicked = false;
        this.clickedStars.delete(star);

        // remove any permanentConnections involving this star
        this.permanentConnections = this.permanentConnections.filter(
          c => c.star1 !== star && c.star2 !== star
        );

        // if you were using lastClickedStar logic, clear it too:
        if (this.lastClickedStar === star) {
          this.lastClickedStar = null;
        }
      }
    }
  });
}

  animate() {
    // clear to transparent so CSS background shows
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawStars();
    this.drawConstellations();
    this.drawPermanentConnections();
    this.drawMouseConnections();
    this.updateStars();

    requestAnimationFrame(() => this.animate());
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createStars();
    });

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // only handle *single* clicks (ignore double-clicks)
    this.canvas.addEventListener('click', e => {
      if (e.detail === 1) this.handleCanvasClick(e);
    });

    this.canvas.style.pointerEvents = 'auto';
  }
}

// initialize
window.addEventListener('load', () => {
  new ConstellationBackground();

  // your existing loader & page-init code
  setTimeout(() => {
    const screen = document.getElementById('loadingScreen');
    if (screen) {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 500);
    }
    initEntranceAnimations();
    initCardAnimations();
    initNavbarScrollEffect();
    createParticles();
    initParallaxEffect();
    document.querySelector('#home')?.classList.add('visible');
  }, 2500);
});
