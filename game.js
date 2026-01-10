/**
 * Interactive Mini-Game - Code Breaker
 * An engaging Three.js game for the portfolio
 */

class CodeBreakerGame {
    constructor() {
        this.gameContainer = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.fallingObjects = [];
        this.score = 0;
        this.isPlaying = false;
        this.gameTime = 30;
        this.timeLeft = 30;
        this.highScore = localStorage.getItem('codeBreaker_highScore') || 0;
        this.clock = new THREE.Clock();
        this.spawnInterval = null;
        this.timerInterval = null;
        this.particles = [];
        
        this.codeSymbols = ['{ }', '< />', '[ ]', '( )', '=> ', '++', '&&', '||', '!=', '==', '//'];
        this.colors = [0x6366f1, 0x22d3ee, 0xf472b6, 0x10b981, 0xfbbf24];
        
        this.init();
    }
    
    init() {
        this.createGameUI();
        this.createScene();
        this.addEventListeners();
    }
    
    createGameUI() {
        // Game overlay container
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'game-container';
        this.gameContainer.innerHTML = `
            <div class="game-overlay">
                <div class="game-header">
                    <div class="game-score">
                        <span class="score-label">Score</span>
                        <span class="score-value" id="gameScore">0</span>
                    </div>
                    <div class="game-timer">
                        <span class="timer-label">Time</span>
                        <span class="timer-value" id="gameTimer">30</span>
                    </div>
                    <div class="game-high-score">
                        <span class="high-score-label">Best</span>
                        <span class="high-score-value" id="gameHighScore">${this.highScore}</span>
                    </div>
                </div>
                <canvas id="gameCanvas"></canvas>
                <div class="game-start-screen" id="gameStartScreen">
                    <div class="game-title">
                        <span class="game-icon">🎮</span>
                        <h3>Code Breaker</h3>
                    </div>
                    <p class="game-description">Click the falling code symbols to score points!</p>
                    <p class="game-hint">Different symbols = Different points</p>
                    <button class="game-start-btn" id="startGameBtn">
                        <span>Start Game</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div class="game-over-screen" id="gameOverScreen">
                    <h3>Game Over!</h3>
                    <div class="final-score">
                        <span class="final-label">Your Score</span>
                        <span class="final-value" id="finalScore">0</span>
                    </div>
                    <div class="new-high-score" id="newHighScore" style="display: none;">
                        🏆 New High Score! 🏆
                    </div>
                    <button class="game-restart-btn" id="restartGameBtn">Play Again</button>
                </div>
                <button class="game-close-btn" id="closeGameBtn">✕</button>
            </div>
        `;
        
        // Style the game
        const style = document.createElement('style');
        style.textContent = `
            #game-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                background: rgba(10, 10, 15, 0.95);
                backdrop-filter: blur(10px);
            }
            
            #game-container.active {
                display: block;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .game-overlay {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
            }
            
            .game-header {
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 40px;
                z-index: 10;
                background: rgba(99, 102, 241, 0.1);
                padding: 15px 30px;
                border-radius: 50px;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }
            
            .game-score, .game-timer, .game-high-score {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .score-label, .timer-label, .high-score-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .score-value, .timer-value, .high-score-value {
                font-size: 28px;
                font-weight: 700;
                color: #fff;
                font-family: 'JetBrains Mono', monospace;
            }
            
            .timer-value {
                color: #22d3ee;
            }
            
            .high-score-value {
                color: #fbbf24;
            }
            
            #gameCanvas {
                width: 100%;
                height: 100%;
            }
            
            .game-start-screen, .game-over-screen {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                z-index: 100;
                background: rgba(20, 20, 30, 0.95);
                padding: 50px;
                border-radius: 20px;
                border: 1px solid rgba(99, 102, 241, 0.3);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            
            .game-title {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .game-icon {
                font-size: 40px;
            }
            
            .game-title h3 {
                font-size: 36px;
                font-weight: 700;
                background: linear-gradient(135deg, #6366f1, #22d3ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .game-description {
                color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                margin-bottom: 10px;
            }
            
            .game-hint {
                color: rgba(255, 255, 255, 0.5);
                font-size: 14px;
                margin-bottom: 30px;
            }
            
            .game-start-btn, .game-restart-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 15px 40px;
                font-size: 18px;
                font-weight: 600;
                color: #fff;
                background: linear-gradient(135deg, #6366f1, #818cf8);
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .game-start-btn:hover, .game-restart-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
            }
            
            .game-over-screen h3 {
                font-size: 32px;
                color: #fff;
                margin-bottom: 20px;
            }
            
            .final-score {
                margin-bottom: 20px;
            }
            
            .final-label {
                display: block;
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .final-value {
                font-size: 60px;
                font-weight: 700;
                background: linear-gradient(135deg, #6366f1, #22d3ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .new-high-score {
                color: #fbbf24;
                font-size: 20px;
                margin-bottom: 20px;
                animation: pulse 0.5s ease infinite alternate;
            }
            
            @keyframes pulse {
                from { transform: scale(1); }
                to { transform: scale(1.1); }
            }
            
            .game-close-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                font-size: 24px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .game-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
            }
            
            .game-over-screen {
                display: none;
            }
            
            /* Game trigger button in hero */
            .game-trigger {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #6366f1, #818cf8);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
                animation: float 3s ease-in-out infinite;
            }
            
            .game-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 15px 40px rgba(99, 102, 241, 0.6);
            }
            
            .game-trigger-tooltip {
                position: absolute;
                right: 70px;
                background: rgba(20, 20, 30, 0.95);
                color: #fff;
                padding: 8px 15px;
                border-radius: 8px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .game-trigger:hover .game-trigger-tooltip {
                opacity: 1;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @media (max-width: 768px) {
                .game-header {
                    gap: 20px;
                    padding: 10px 20px;
                }
                
                .score-value, .timer-value, .high-score-value {
                    font-size: 22px;
                }
                
                .game-start-screen, .game-over-screen {
                    padding: 30px;
                    width: 90%;
                }
                
                .game-title h3 {
                    font-size: 28px;
                }
                
                .game-trigger {
                    width: 50px;
                    height: 50px;
                    font-size: 24px;
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.gameContainer);
        
        // Add game trigger button
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'game-trigger';
        triggerBtn.innerHTML = `
            🎮
            <span class="game-trigger-tooltip">Play Code Breaker!</span>
        `;
        triggerBtn.addEventListener('click', () => this.openGame());
        document.body.appendChild(triggerBtn);
    }
    
    createScene() {
        const canvas = document.getElementById('gameCanvas');
        
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a0f, 0);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add point lights
        const pointLight1 = new THREE.PointLight(0x6366f1, 1, 100);
        pointLight1.position.set(10, 10, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x22d3ee, 1, 100);
        pointLight2.position.set(-10, -10, 20);
        this.scene.add(pointLight2);
    }
    
    createFallingObject() {
        const symbolIndex = Math.floor(Math.random() * this.codeSymbols.length);
        const symbol = this.codeSymbols[symbolIndex];
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Create 3D text-like object (using box as placeholder, styled with material)
        const geometry = new THREE.BoxGeometry(
            2 + Math.random() * 1.5,
            2 + Math.random() * 1.5,
            0.5
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position at top
        mesh.position.x = (Math.random() - 0.5) * 40;
        mesh.position.y = 25;
        mesh.position.z = (Math.random() - 0.5) * 10;
        
        // Store metadata
        mesh.userData = {
            symbol: symbol,
            points: (symbolIndex + 1) * 10, // Different symbols worth different points
            speed: 0.1 + Math.random() * 0.15,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            }
        };
        
        // Add wireframe for extra effect
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
        );
        mesh.add(wireframe);
        
        this.fallingObjects.push(mesh);
        this.scene.add(mesh);
    }
    
    createExplosion(position, color) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(position);
            
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                ),
                life: 1
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.position.add(particle.userData.velocity);
            particle.userData.life -= 0.03;
            particle.material.opacity = particle.userData.life;
            particle.scale.setScalar(particle.userData.life);
            
            if (particle.userData.life <= 0) {
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }
    
    addEventListeners() {
        // Start button
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        
        // Restart button
        document.getElementById('restartGameBtn').addEventListener('click', () => this.startGame());
        
        // Close button
        document.getElementById('closeGameBtn').addEventListener('click', () => this.closeGame());
        
        // Click/Touch on game canvas
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        canvas.addEventListener('touchstart', (e) => this.onCanvasTouch(e));
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameContainer.classList.contains('active')) {
                this.closeGame();
            }
        });
    }
    
    onCanvasClick(event) {
        if (!this.isPlaying) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.checkIntersection();
    }
    
    onCanvasTouch(event) {
        if (!this.isPlaying) return;
        event.preventDefault();
        
        const touch = event.touches[0];
        this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        this.checkIntersection();
    }
    
    checkIntersection() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.fallingObjects);
        
        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            const points = hitObject.userData.points;
            const color = hitObject.material.color.getHex();
            
            // Add score
            this.score += points;
            this.updateScoreDisplay();
            
            // Show floating score
            this.showFloatingScore(hitObject.position.clone(), points);
            
            // Create explosion
            this.createExplosion(hitObject.position.clone(), color);
            
            // Remove object
            this.removeObject(hitObject);
        }
    }
    
    showFloatingScore(position, points) {
        const scoreDiv = document.createElement('div');
        scoreDiv.style.cssText = `
            position: fixed;
            left: ${((position.x / 20) + 0.5) * window.innerWidth}px;
            top: ${((-position.y / 15) + 0.5) * window.innerHeight}px;
            color: #22d3ee;
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10001;
            animation: floatUp 1s ease-out forwards;
        `;
        scoreDiv.textContent = `+${points}`;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-50px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(scoreDiv);
        
        setTimeout(() => scoreDiv.remove(), 1000);
    }
    
    removeObject(object) {
        const index = this.fallingObjects.indexOf(object);
        if (index > -1) {
            this.fallingObjects.splice(index, 1);
            this.scene.remove(object);
            object.geometry.dispose();
            object.material.dispose();
        }
    }
    
    onResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    openGame() {
        this.gameContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.animateGame();
    }
    
    closeGame() {
        this.gameContainer.classList.remove('active');
        document.body.style.overflow = '';
        this.endGame(false);
    }
    
    startGame() {
        // Hide start/end screens
        document.getElementById('gameStartScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Reset game state
        this.score = 0;
        this.timeLeft = this.gameTime;
        this.isPlaying = true;
        
        // Clear existing objects
        this.fallingObjects.forEach(obj => {
            this.scene.remove(obj);
            obj.geometry.dispose();
            obj.material.dispose();
        });
        this.fallingObjects = [];
        
        // Update displays
        this.updateScoreDisplay();
        this.updateTimerDisplay();
        
        // Start spawning
        this.spawnInterval = setInterval(() => {
            if (this.isPlaying) {
                this.createFallingObject();
            }
        }, 500);
        
        // Start timer
        this.timerInterval = setInterval(() => {
            if (this.isPlaying) {
                this.timeLeft--;
                this.updateTimerDisplay();
                
                if (this.timeLeft <= 0) {
                    this.endGame(true);
                }
            }
        }, 1000);
    }
    
    endGame(showResults) {
        this.isPlaying = false;
        
        clearInterval(this.spawnInterval);
        clearInterval(this.timerInterval);
        
        if (showResults) {
            // Check for high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('codeBreaker_highScore', this.highScore);
                document.getElementById('gameHighScore').textContent = this.highScore;
                document.getElementById('newHighScore').style.display = 'block';
            } else {
                document.getElementById('newHighScore').style.display = 'none';
            }
            
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverScreen').style.display = 'block';
        }
    }
    
    updateScoreDisplay() {
        document.getElementById('gameScore').textContent = this.score;
    }
    
    updateTimerDisplay() {
        document.getElementById('gameTimer').textContent = this.timeLeft;
        
        // Change color when time is low
        const timerEl = document.getElementById('gameTimer');
        if (this.timeLeft <= 10) {
            timerEl.style.color = '#ef4444';
        } else {
            timerEl.style.color = '#22d3ee';
        }
    }
    
    animateGame() {
        if (!this.gameContainer.classList.contains('active')) return;
        
        requestAnimationFrame(() => this.animateGame());
        
        // Update falling objects
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            
            // Move down
            obj.position.y -= obj.userData.speed;
            
            // Rotate
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
            
            // Remove if out of screen
            if (obj.position.y < -20) {
                this.removeObject(obj);
            }
        }
        
        // Update particles
        this.updateParticles();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        window.codeBreakerGame = new CodeBreakerGame();
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// EASTER EGG: Konami Code
// ═══════════════════════════════════════════════════════════════════════════
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerEasterEgg() {
    // Create matrix rain effect
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.8;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン</>{}[]();=>';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frameCount = 0;
    const maxFrames = 300; // ~5 seconds
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#22d3ee';
        ctx.font = `${fontSize}px JetBrains Mono, monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = Math.random() > 0.5 ? '#6366f1' : '#22d3ee';
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(drawMatrix);
        } else {
            // Fade out
            canvas.style.transition = 'opacity 1s ease';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 1000);
        }
    }
    
    drawMatrix();
    
    // Show message
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 32px;
        color: #22d3ee;
        font-family: 'JetBrains Mono', monospace;
        z-index: 10000;
        text-shadow: 0 0 20px #22d3ee;
        animation: glitch 0.5s infinite;
    `;
    msg.innerHTML = '🎮 DEVELOPER MODE ACTIVATED 🎮';
    
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch {
            0%, 100% { transform: translate(-50%, -50%) skew(0deg); }
            20% { transform: translate(-52%, -50%) skew(2deg); }
            40% { transform: translate(-48%, -50%) skew(-2deg); }
            60% { transform: translate(-50%, -52%) skew(1deg); }
            80% { transform: translate(-50%, -48%) skew(-1deg); }
        }
    `;
    document.head.appendChild(glitchStyle);
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.transition = 'opacity 1s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 1000);
    }, 4000);
}
