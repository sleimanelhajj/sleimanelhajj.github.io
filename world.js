/**
 * 3D Portfolio World - Sleiman El Hajj
 * An immersive first-person explorable 3D portfolio experience
 */

class PortfolioWorld {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Player controls
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.playerHeight = 2;
        this.moveSpeed = 50;
        
        // Camera rotation
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.isLocked = false;
        
        // Interactive objects
        this.interactiveObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // World elements
        this.floatingObjects = [];
        this.particles = null;
        
        // UI
        this.infoPanel = null;
        this.crosshair = null;
        
        this.init();
    }
    
    init() {
        this.createUI();
        this.createScene();
        this.createLights();
        this.createGround();
        this.createSkybox();
        this.createParticles();
        this.createPortfolioElements();
        this.addEventListeners();
        this.animate();
    }
    
    createUI() {
        // Main container
        this.container = document.createElement('div');
        this.container.id = 'world-container';
        this.container.innerHTML = `
            <div class="world-overlay">
                <canvas id="worldCanvas"></canvas>
                
                <!-- Crosshair -->
                <div class="crosshair" id="crosshair">
                    <div class="crosshair-dot"></div>
                </div>
                
                <!-- Info Panel -->
                <div class="info-panel" id="infoPanel">
                    <button class="info-close" id="infoPanelClose">✕</button>
                    <h3 class="info-title" id="infoTitle">Title</h3>
                    <p class="info-description" id="infoDescription">Description</p>
                    <div class="info-tags" id="infoTags"></div>
                    <a href="#" class="info-link" id="infoLink" target="_blank">View More →</a>
                </div>
                
                <!-- Instructions -->
                <div class="world-instructions" id="worldInstructions">
                    <div class="instructions-content">
                        <h2>🌐 Welcome to My 3D Portfolio World</h2>
                        <p>Explore my work in an immersive 3D environment!</p>
                        <div class="controls-guide">
                            <div class="control-item">
                                <span class="key">W A S D</span>
                                <span>Move around</span>
                            </div>
                            <div class="control-item">
                                <span class="key">MOUSE</span>
                                <span>Look around</span>
                            </div>
                            <div class="control-item">
                                <span class="key">CLICK</span>
                                <span>Interact with objects</span>
                            </div>
                            <div class="control-item">
                                <span class="key">ESC</span>
                                <span>Exit exploration</span>
                            </div>
                        </div>
                        <button class="start-explore-btn" id="startExploreBtn">
                            <span>Click to Explore</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Exit Button -->
                <button class="world-exit-btn" id="worldExitBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Exit World
                </button>
                
                <!-- Interaction Hint -->
                <div class="interaction-hint" id="interactionHint">
                    Press <span class="key">E</span> or <span class="key">CLICK</span> to interact
                </div>
            </div>
        `;
        
        // Styles
        const style = document.createElement('style');
        style.textContent = `
            #world-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                background: #000;
            }
            
            #world-container.active {
                display: block;
            }
            
            .world-overlay {
                width: 100%;
                height: 100%;
                position: relative;
            }
            
            #worldCanvas {
                width: 100%;
                height: 100%;
                display: block;
            }
            
            /* Crosshair */
            .crosshair {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .crosshair.visible {
                opacity: 1;
            }
            
            .crosshair-dot {
                width: 8px;
                height: 8px;
                background: #22d3ee;
                border-radius: 50%;
                box-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee;
            }
            
            /* Info Panel */
            .info-panel {
                position: absolute;
                top: 50%;
                right: 50px;
                transform: translateY(-50%);
                width: 350px;
                background: rgba(15, 15, 25, 0.95);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                padding: 30px;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .info-panel.visible {
                opacity: 1;
                pointer-events: auto;
            }
            
            .info-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 50%;
                color: #fff;
                cursor: pointer;
                font-size: 16px;
            }
            
            .info-title {
                font-size: 24px;
                font-weight: 700;
                color: #fff;
                margin-bottom: 15px;
                background: linear-gradient(135deg, #6366f1, #22d3ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .info-description {
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .info-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 20px;
            }
            
            .info-tag {
                padding: 5px 12px;
                background: rgba(99, 102, 241, 0.2);
                border-radius: 20px;
                font-size: 12px;
                color: #818cf8;
            }
            
            .info-link {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: #22d3ee;
                text-decoration: none;
                font-weight: 600;
                transition: gap 0.3s ease;
            }
            
            .info-link:hover {
                gap: 12px;
            }
            
            /* Instructions */
            .world-instructions {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
            }
            
            .world-instructions.hidden {
                display: none;
            }
            
            .instructions-content {
                text-align: center;
                max-width: 500px;
                padding: 40px;
            }
            
            .instructions-content h2 {
                font-size: 36px;
                color: #fff;
                margin-bottom: 15px;
            }
            
            .instructions-content > p {
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 40px;
                font-size: 18px;
            }
            
            .controls-guide {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .control-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            
            .control-item .key {
                padding: 10px 20px;
                background: rgba(99, 102, 241, 0.2);
                border: 1px solid rgba(99, 102, 241, 0.4);
                border-radius: 10px;
                color: #818cf8;
                font-family: 'JetBrains Mono', monospace;
                font-weight: 600;
            }
            
            .control-item span:last-child {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
            }
            
            .start-explore-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 18px 40px;
                font-size: 18px;
                font-weight: 600;
                color: #fff;
                background: linear-gradient(135deg, #6366f1, #818cf8);
                border: none;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .start-explore-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
            }
            
            /* Mini Map */
            .mini-map {
                position: absolute;
                bottom: 30px;
                left: 30px;
                width: 150px;
                height: 150px;
                background: rgba(15, 15, 25, 0.8);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 10px;
                padding: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .mini-map.visible {
                opacity: 1;
            }
            
            .map-player {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 10px;
                height: 10px;
                background: #22d3ee;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #22d3ee;
            }
            
            .map-legend {
                position: absolute;
                bottom: 5px;
                left: 5px;
                right: 5px;
                display: flex;
                justify-content: space-around;
                font-size: 8px;
                color: rgba(255, 255, 255, 0.6);
            }
            
            .legend-item {
                display: flex;
                align-items: center;
                gap: 3px;
            }
            
            .legend-item .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
            
            .dot.project { background: #f472b6; }
            .dot.skill { background: #22d3ee; }
            .dot.about { background: #fbbf24; }
            
            /* Exit Button */
            .world-exit-btn {
                position: absolute;
                top: 30px;
                right: 30px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .world-exit-btn.visible {
                opacity: 1;
            }
            
            .world-exit-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            /* Interaction Hint */
            .interaction-hint {
                position: absolute;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                background: rgba(15, 15, 25, 0.9);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 30px;
                color: #fff;
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }
            
            .interaction-hint.visible {
                opacity: 1;
            }
            
            .interaction-hint .key {
                padding: 3px 8px;
                background: rgba(99, 102, 241, 0.3);
                border-radius: 5px;
                font-family: 'JetBrains Mono', monospace;
                color: #818cf8;
            }
            
            /* World Entry Button (on main page) */
            .world-trigger {
                position: fixed;
                bottom: 100px;
                right: 30px;
                padding: 15px 25px;
                background: linear-gradient(135deg, #10b981, #22d3ee);
                border: none;
                border-radius: 50px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
                animation: pulse-green 2s ease-in-out infinite;
            }
            
            .world-trigger:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
            }
            
            @keyframes pulse-green {
                0%, 100% { box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 10px 40px rgba(16, 185, 129, 0.6); }
            }
            
            @media (max-width: 768px) {
                .controls-guide {
                    grid-template-columns: 1fr;
                }
                
                .info-panel {
                    width: 90%;
                    right: 5%;
                    transform: translateY(-50%);
                }
                
                .world-trigger {
                    bottom: 80px;
                    right: 20px;
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.container);
        
        // Add trigger button to main page
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'world-trigger';
        triggerBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Explore 3D World
        `;
        triggerBtn.addEventListener('click', () => this.openWorld());
        document.body.appendChild(triggerBtn);
        
        // Cache UI elements
        this.infoPanel = document.getElementById('infoPanel');
        this.crosshair = document.getElementById('crosshair');
    }
    
    createScene() {
        const canvas = document.getElementById('worldCanvas');
        
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a12, 0.015);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, this.playerHeight, 10);
        
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a12);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    createLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambient);
        
        // Main directional light
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(50, 50, 50);
        directional.castShadow = true;
        directional.shadow.mapSize.width = 2048;
        directional.shadow.mapSize.height = 2048;
        this.scene.add(directional);
        
        // Colored point lights for atmosphere
        const colors = [0x6366f1, 0x22d3ee, 0xf472b6, 0x10b981];
        const positions = [
            [-20, 10, -20],
            [20, 10, -20],
            [-20, 10, 20],
            [20, 10, 20]
        ];
        
        positions.forEach((pos, i) => {
            const light = new THREE.PointLight(colors[i], 1, 50);
            light.position.set(...pos);
            this.scene.add(light);
        });
    }
    
    createGround() {
        // Create a grid ground
        const gridSize = 100;
        const gridDivisions = 50;
        
        // Grid helper
        const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x6366f1, 0x1a1a2e);
        grid.material.opacity = 0.3;
        grid.material.transparent = true;
        this.scene.add(grid);
        
        // Ground plane (invisible but for reference)
        const groundGeo = new THREE.PlaneGeometry(gridSize, gridSize);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a12,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add glowing boundary lines
        const boundaryMat = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.5 });
        const boundaryGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-gridSize/2, 0, -gridSize/2),
            new THREE.Vector3(gridSize/2, 0, -gridSize/2),
            new THREE.Vector3(gridSize/2, 0, gridSize/2),
            new THREE.Vector3(-gridSize/2, 0, gridSize/2),
            new THREE.Vector3(-gridSize/2, 0, -gridSize/2)
        ]);
        const boundary = new THREE.Line(boundaryGeo, boundaryMat);
        this.scene.add(boundary);
    }
    
    createSkybox() {
        // Create gradient sky sphere
        const skyGeo = new THREE.SphereGeometry(200, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0a0a20) },
                bottomColor: { value: new THREE.Color(0x000005) },
                offset: { value: 20 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }
    
    createParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorOptions = [
            new THREE.Color(0x6366f1),
            new THREE.Color(0x22d3ee),
            new THREE.Color(0xf472b6)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 30 + 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createPortfolioElements() {
        // Central welcome monument
        this.createWelcomeMonument();
        
        // Project floating cards
        this.createProjectCards();
        
        // Skill orbs
        this.createSkillOrbs();
        
        // Experience pillars
        this.createExperiencePillars();
        
        // About me hologram
        this.createAboutHologram();
        
        // Contact portal
        this.createContactPortal();
    }
    
    createWelcomeMonument() {
        // Central glowing pillar
        const pillarGeo = new THREE.CylinderGeometry(0.5, 1, 8, 8);
        const pillarMat = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            emissive: 0x6366f1,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(0, 4, 0);
        this.scene.add(pillar);
        
        // Floating ring
        const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 100);
        const ringMat = new THREE.MeshPhongMaterial({
            color: 0x22d3ee,
            emissive: 0x22d3ee,
            emissiveIntensity: 0.5
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(0, 6, 0);
        ring.rotation.x = Math.PI / 2;
        this.scene.add(ring);
        
        this.floatingObjects.push({
            mesh: ring,
            baseY: 6,
            rotateY: true,
            floatSpeed: 1,
            floatAmount: 0.5
        });
        
        // Add Welcome label
        const welcomeLabel = this.createTextSprite('🌟 Welcome!', 0x22d3ee);
        welcomeLabel.position.set(0, 10, 0);
        welcomeLabel.scale.set(10, 5, 1);
        this.scene.add(welcomeLabel);
        
        this.floatingObjects.push({
            mesh: welcomeLabel,
            baseY: 10,
            floatSpeed: 0.8,
            floatAmount: 0.5
        });
        
        // Add to interactive
        pillar.userData = {
            type: 'welcome',
            title: 'Welcome to My World',
            description: 'I\'m Sleiman El Hajj, a Full Stack Developer and Computer Engineering student. Explore this 3D space to learn more about my projects, skills, and experience!',
            tags: ['Explorer', 'Developer', 'Creator'],
            link: '#hero'
        };
        this.interactiveObjects.push(pillar);
    }
    
    createProjectCards() {
        const projects = [
            {
                title: 'Warehouse Agent',
                emoji: '🤖',
                description: 'An intelligent AI-powered warehouse assistant built using LangGraph and LangChain.',
                tags: ['LangGraph', 'LangChain', 'Python', 'LLM'],
                link: 'https://github.com/sleimanelhajj/LLMs-project.git',
                position: [-15, 3, -15],
                color: 0xf472b6
            },
            {
                title: 'IEA Algorithms',
                emoji: '🧠',
                description: 'A comprehensive search agent implementing A*, BFS, deep learning, and more.',
                tags: ['React.js', 'Flask', 'Python', 'AI'],
                link: 'https://github.com/sleimanelhajj/IEASubmission.git',
                position: [15, 3, -15],
                color: 0x22d3ee
            },
            {
                title: 'Hotel Booking',
                emoji: '🏨',
                description: 'Full-stack project enabling users to book and list hotel rooms.',
                tags: ['React.js', 'Node.js', 'MongoDB'],
                link: 'https://github.com/sleimanelhajj/BBB',
                position: [-15, 3, 15],
                color: 0x10b981
            },
            {
                title: 'Propertease',
                emoji: '🏠',
                description: 'Property listing application with aesthetic UI and MySQL backend.',
                tags: ['React.js', 'Node.js', 'MySQL'],
                link: 'https://github.com/sleimanelhajj/DBProject.git',
                position: [15, 3, 15],
                color: 0xfbbf24
            }
        ];
        
        projects.forEach((project, index) => {
            // Create floating card
            const cardGeo = new THREE.BoxGeometry(4, 3, 0.3);
            const cardMat = new THREE.MeshPhongMaterial({
                color: project.color,
                emissive: project.color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.9
            });
            const card = new THREE.Mesh(cardGeo, cardMat);
            card.position.set(...project.position);
            card.castShadow = true;
            
            // Add wireframe
            const wireframe = new THREE.LineSegments(
                new THREE.EdgesGeometry(cardGeo),
                new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
            );
            card.add(wireframe);
            
            // Create text label sprite above the card
            const label = this.createTextSprite(project.emoji + ' ' + project.title, project.color);
            label.position.set(project.position[0], project.position[1] + 2.5, project.position[2]);
            label.scale.set(8, 4, 1);
            this.scene.add(label);
            
            // Add label to floating objects so it bobs with the card
            this.floatingObjects.push({
                mesh: label,
                baseY: project.position[1] + 2.5,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatAmount: 0.3
            });
            
            // Store data
            card.userData = {
                type: 'project',
                ...project
            };
            
            this.scene.add(card);
            this.interactiveObjects.push(card);
            
            this.floatingObjects.push({
                mesh: card,
                baseY: project.position[1],
                rotateY: true,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatAmount: 0.3
            });
            
            // Add glowing base
            const baseGeo = new THREE.CircleGeometry(2, 32);
            const baseMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.3
            });
            const base = new THREE.Mesh(baseGeo, baseMat);
            base.position.set(project.position[0], 0.01, project.position[2]);
            base.rotation.x = -Math.PI / 2;
            this.scene.add(base);
            
            // Add vertical beam of light from base to card
            const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, project.position[1], 8);
            const beamMat = new THREE.MeshBasicMaterial({
                color: project.color,
                transparent: true,
                opacity: 0.3
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.set(project.position[0], project.position[1] / 2, project.position[2]);
            this.scene.add(beam);
        });
    }
    
    // Create text sprite for labels
    createTextSprite(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Background with gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(15, 15, 25, 0.9)');
        gradient.addColorStop(0.5, 'rgba(25, 25, 40, 0.95)');
        gradient.addColorStop(1, 'rgba(15, 15, 25, 0.9)');
        
        // Rounded rectangle background
        const padding = 20;
        const radius = 20;
        context.beginPath();
        context.moveTo(padding + radius, padding);
        context.lineTo(canvas.width - padding - radius, padding);
        context.quadraticCurveTo(canvas.width - padding, padding, canvas.width - padding, padding + radius);
        context.lineTo(canvas.width - padding, canvas.height - padding - radius);
        context.quadraticCurveTo(canvas.width - padding, canvas.height - padding, canvas.width - padding - radius, canvas.height - padding);
        context.lineTo(padding + radius, canvas.height - padding);
        context.quadraticCurveTo(padding, canvas.height - padding, padding, canvas.height - padding - radius);
        context.lineTo(padding, padding + radius);
        context.quadraticCurveTo(padding, padding, padding + radius, padding);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();
        
        // Border
        const colorHex = '#' + color.toString(16).padStart(6, '0');
        context.strokeStyle = colorHex;
        context.lineWidth = 3;
        context.stroke();
        
        // Glow effect
        context.shadowColor = colorHex;
        context.shadowBlur = 15;
        context.stroke();
        
        // Text
        context.shadowBlur = 0;
        context.font = 'bold 36px Space Grotesk, Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ffffff';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        return sprite;
    }
    
    createSkillOrbs() {
        const skills = [
            { name: 'Angular', color: 0xdd0031 },
            { name: 'React', color: 0x61dafb },
            { name: 'Node.js', color: 0x339933 },
            { name: 'Python', color: 0x3776ab },
            { name: 'MongoDB', color: 0x47a248 },
            { name: 'PostgreSQL', color: 0x336791 },
            { name: 'LangChain', color: 0x1c3c3c },
            { name: 'Deep Learning', color: 0xff6f00 }
        ];
        
        const radius = 8;
        skills.forEach((skill, index) => {
            const angle = (index / skills.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius - 25;
            
            // Skill orb
            const orbGeo = new THREE.SphereGeometry(0.5, 32, 32);
            const orbMat = new THREE.MeshPhongMaterial({
                color: skill.color,
                emissive: skill.color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.9
            });
            const orb = new THREE.Mesh(orbGeo, orbMat);
            orb.position.set(x, 2, z);
            
            orb.userData = {
                type: 'skill',
                title: skill.name,
                description: `One of my key technical skills. Click to learn more about my experience with ${skill.name}.`,
                tags: ['Skill', 'Technology'],
                link: '#skills'
            };
            
            this.scene.add(orb);
            this.interactiveObjects.push(orb);
            
            this.floatingObjects.push({
                mesh: orb,
                baseY: 2,
                rotateY: false,
                floatSpeed: 1 + Math.random(),
                floatAmount: 0.5,
                orbitAngle: angle,
                orbitRadius: radius,
                orbitSpeed: 0.1
            });
            
            // Connecting line to center
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 1, -25),
                new THREE.Vector3(x, 2, z)
            ]);
            const lineMat = new THREE.LineBasicMaterial({
                color: skill.color,
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(lineGeo, lineMat);
            this.scene.add(line);
        });
        
        // Central skills hub
        const hubGeo = new THREE.IcosahedronGeometry(1, 0);
        const hubMat = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            emissive: 0x6366f1,
            emissiveIntensity: 0.5,
            wireframe: true
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.position.set(0, 2, -25);
        this.scene.add(hub);
        
        // Add label for Skills Hub
        const skillsLabel = this.createTextSprite('⚡ Skills Hub', 0x6366f1);
        skillsLabel.position.set(0, 5, -25);
        skillsLabel.scale.set(8, 4, 1);
        this.scene.add(skillsLabel);
        
        this.floatingObjects.push({
            mesh: skillsLabel,
            baseY: 5,
            floatSpeed: 0.5,
            floatAmount: 0.3
        });

        this.floatingObjects.push({
            mesh: hub,
            baseY: 2,
            rotateY: true,
            rotateX: true,
            floatSpeed: 0.5,
            floatAmount: 0.2
        });
    }
    
    createExperiencePillars() {
        const experiences = [
            {
                title: 'Full Stack Developer @ Inframappa',
                description: 'Developing features for US infrastructure mapping solution.',
                tags: ['Angular', 'TypeScript', 'GIS'],
                position: [25, 0, 0],
                height: 6
            },
            {
                title: 'Backend Developer (Freelance)',
                description: 'Built basketball court booking system backend.',
                tags: ['Node.js', 'PostgreSQL', 'Swagger'],
                position: [30, 0, 5],
                height: 4
            },
            {
                title: 'VP @ IEEE Aeronautical Club',
                description: 'Leading aerospace engineering initiatives at LAU.',
                tags: ['Leadership', 'Events', 'Projects'],
                position: [28, 0, -5],
                height: 5
            }
        ];
        
        experiences.forEach((exp, index) => {
            const pillarGeo = new THREE.BoxGeometry(2, exp.height, 2);
            const pillarMat = new THREE.MeshPhongMaterial({
                color: 0x818cf8,
                emissive: 0x6366f1,
                emissiveIntensity: 0.2
            });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(exp.position[0], exp.height / 2, exp.position[2]);
            pillar.castShadow = true;
            
            pillar.userData = {
                type: 'experience',
                title: exp.title,
                description: exp.description,
                tags: exp.tags,
                link: '#experience'
            };
            
            this.scene.add(pillar);
            this.interactiveObjects.push(pillar);
            
            // Top glow
            const glowGeo = new THREE.SphereGeometry(0.3, 16, 16);
            const glowMat = new THREE.MeshBasicMaterial({
                color: 0x22d3ee,
                transparent: true,
                opacity: 0.8
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            glow.position.set(exp.position[0], exp.height + 0.5, exp.position[2]);
            this.scene.add(glow);
            
            this.floatingObjects.push({
                mesh: glow,
                baseY: exp.height + 0.5,
                floatSpeed: 2,
                floatAmount: 0.2
            });
        });
        
        // Add Experience area label
        const expLabel = this.createTextSprite('💼 Experience', 0x818cf8);
        expLabel.position.set(28, 9, 0);
        expLabel.scale.set(8, 4, 1);
        this.scene.add(expLabel);
        
        this.floatingObjects.push({
            mesh: expLabel,
            baseY: 9,
            floatSpeed: 0.4,
            floatAmount: 0.3
        });
    }
    
    createAboutHologram() {
        // Create holographic display for about section
        const frameGeo = new THREE.TorusGeometry(3, 0.1, 16, 100);
        const frameMat = new THREE.MeshPhongMaterial({
            color: 0xfbbf24,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.5
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(-25, 3, 0);
        frame.rotation.y = Math.PI / 2;
        this.scene.add(frame);
        
        this.floatingObjects.push({
            mesh: frame,
            baseY: 3,
            rotateZ: true,
            floatSpeed: 0.3,
            floatAmount: 0.2
        });
        
        // Inner hologram effect
        const holoGeo = new THREE.CircleGeometry(2.8, 32);
        const holoMat = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const holo = new THREE.Mesh(holoGeo, holoMat);
        holo.position.set(-25, 3, 0);
        holo.rotation.y = Math.PI / 2;
        
        holo.userData = {
            type: 'about',
            title: 'About Sleiman El Hajj',
            description: 'Fourth year Computer Engineering student at Lebanese American University. Passionate about Full Stack Development and AI. VP of IEEE Aeronautical & Electronics Club.',
            tags: ['Student', 'Developer', 'Leader'],
            link: '#about'
        };
        
        this.scene.add(holo);
        this.interactiveObjects.push(holo);
        
        // Add About label
        const aboutLabel = this.createTextSprite('👤 About Me', 0xfbbf24);
        aboutLabel.position.set(-25, 7, 0);
        aboutLabel.scale.set(8, 4, 1);
        this.scene.add(aboutLabel);
        
        this.floatingObjects.push({
            mesh: aboutLabel,
            baseY: 7,
            floatSpeed: 0.3,
            floatAmount: 0.3
        });
    }
    
    createContactPortal() {
        // Create a glowing portal for contact
        const portalGeo = new THREE.TorusGeometry(2, 0.3, 16, 100);
        const portalMat = new THREE.MeshPhongMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.8
        });
        const portal = new THREE.Mesh(portalGeo, portalMat);
        portal.position.set(0, 3, -40);
        this.scene.add(portal);
        
        this.floatingObjects.push({
            mesh: portal,
            baseY: 3,
            rotateZ: true,
            floatSpeed: 0.5,
            floatAmount: 0.3
        });
        
        // Inner glow
        const innerGeo = new THREE.CircleGeometry(1.7, 32);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 3, -40);
        
        inner.userData = {
            type: 'contact',
            title: 'Get In Touch',
            description: 'Want to collaborate or just say hello? I\'d love to hear from you! Click to go to the contact section.',
            tags: ['Email', 'GitHub', 'LinkedIn'],
            link: '#contact'
        };
        
        this.scene.add(inner);
        this.interactiveObjects.push(inner);
        
        // Add Contact label
        const contactLabel = this.createTextSprite('📬 Contact Portal', 0x10b981);
        contactLabel.position.set(0, 7, -40);
        contactLabel.scale.set(8, 4, 1);
        this.scene.add(contactLabel);
        
        this.floatingObjects.push({
            mesh: contactLabel,
            baseY: 7,
            floatSpeed: 0.5,
            floatAmount: 0.3
        });

        // Particle effect around portal
        const particleCount = 100;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 0.5;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = 3 + (Math.random() - 0.5) * 2;
            positions[i * 3 + 2] = -40 + Math.sin(angle) * radius;
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x10b981,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const portalParticles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(portalParticles);
        
        this.floatingObjects.push({
            mesh: portalParticles,
            baseY: 3,
            rotateY: true,
            floatSpeed: 1,
            floatAmount: 0
        });
    }
    
    addEventListeners() {
        // Start button
        document.getElementById('startExploreBtn').addEventListener('click', () => this.startExploration());
        
        // Exit button
        document.getElementById('worldExitBtn').addEventListener('click', () => this.closeWorld());
        
        // Info panel close
        document.getElementById('infoPanelClose').addEventListener('click', () => this.hideInfoPanel());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        
        // Mouse controls
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('click', () => this.onMouseClick());
        
        // Pointer lock
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    onKeyDown(e) {
        // ESC should always work to exit the world
        if (e.code === 'Escape' && this.container.classList.contains('active')) {
            e.preventDefault();
            this.closeWorld();
            return;
        }
        
        if (!this.isLocked) return;
        
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.moveForward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.moveBackward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.moveLeft = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.moveRight = true;
                break;
            case 'KeyE':
                this.interact();
                break;
        }
    }
    
    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.moveForward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.moveBackward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.moveLeft = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.moveRight = false;
                break;
        }
    }
    
    onMouseMove(e) {
        if (!this.isLocked) return;
        
        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;
        
        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= movementX * 0.002;
        this.euler.x -= movementY * 0.002;
        
        // Limit vertical look
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
        
        this.camera.quaternion.setFromEuler(this.euler);
    }
    
    onMouseClick() {
        if (this.isLocked) {
            this.interact();
        }
    }
    
    onPointerLockChange() {
        this.isLocked = document.pointerLockElement === document.getElementById('worldCanvas');
        
        if (!this.isLocked && this.container.classList.contains('active')) {
            // Only show instructions if info panel is not visible
            if (!this.infoPanel.classList.contains('visible')) {
                document.getElementById('worldInstructions').classList.remove('hidden');
                document.getElementById('worldExitBtn').classList.remove('visible');
            }
            document.getElementById('crosshair').classList.remove('visible');
        }
    }
    
    onResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    interact() {
        // Check what we're looking at
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.title) {
                this.showInfoPanel(object.userData);
            }
        }
    }
    
    showInfoPanel(data) {
        document.getElementById('infoTitle').textContent = data.title;
        document.getElementById('infoDescription').textContent = data.description;
        document.getElementById('infoLink').href = data.link;
        
        const tagsContainer = document.getElementById('infoTags');
        tagsContainer.innerHTML = data.tags.map(tag => `<span class="info-tag">${tag}</span>`).join('');
        
        this.infoPanel.classList.add('visible');
        
        // Release pointer lock so user can click the link
        document.exitPointerLock();
        this.isLocked = false;
        
        // Hide crosshair but keep exit button visible
        document.getElementById('crosshair').classList.remove('visible');
        document.getElementById('interactionHint').classList.remove('visible');
    }
    
    hideInfoPanel() {
        this.infoPanel.classList.remove('visible');
        
        // Re-lock pointer for exploration
        const canvas = document.getElementById('worldCanvas');
        canvas.requestPointerLock();
    }
    
    openWorld() {
        this.container.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.animate();
    }
    
    closeWorld() {
        this.container.classList.remove('active');
        document.body.style.overflow = '';
        document.exitPointerLock();
        this.isLocked = false;
        
        // Reset UI
        document.getElementById('worldInstructions').classList.remove('hidden');
        document.getElementById('crosshair').classList.remove('visible');
        document.getElementById('worldExitBtn').classList.remove('visible');
        this.hideInfoPanel();
    }
    
    startExploration() {
        const canvas = document.getElementById('worldCanvas');
        canvas.requestPointerLock();
        
        document.getElementById('worldInstructions').classList.add('hidden');
        document.getElementById('crosshair').classList.add('visible');
        document.getElementById('worldExitBtn').classList.add('visible');
    }
    
    updateMovement(delta) {
        if (!this.isLocked) return;
        
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();
        
        if (this.moveForward || this.moveBackward) {
            this.velocity.z -= this.direction.z * this.moveSpeed * delta;
        }
        if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * this.moveSpeed * delta;
        }
        
        // Apply movement in camera direction
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
        
        this.camera.position.addScaledVector(forward, -this.velocity.z * delta);
        this.camera.position.addScaledVector(right, -this.velocity.x * delta);
        
        // Keep player at ground level
        this.camera.position.y = this.playerHeight;
        
        // Boundary limits
        const limit = 45;
        this.camera.position.x = Math.max(-limit, Math.min(limit, this.camera.position.x));
        this.camera.position.z = Math.max(-limit, Math.min(limit, this.camera.position.z));
    }
    
    checkInteractionHint() {
        if (!this.isLocked) return;
        
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        const hint = document.getElementById('interactionHint');
        if (intersects.length > 0 && intersects[0].distance < 10) {
            hint.classList.add('visible');
        } else {
            hint.classList.remove('visible');
        }
    }
    
    updateFloatingObjects(time) {
        this.floatingObjects.forEach(obj => {
            // Floating animation
            if (obj.floatAmount > 0) {
                obj.mesh.position.y = obj.baseY + Math.sin(time * obj.floatSpeed) * obj.floatAmount;
            }
            
            // Rotation
            if (obj.rotateY) {
                obj.mesh.rotation.y += 0.005;
            }
            if (obj.rotateX) {
                obj.mesh.rotation.x += 0.003;
            }
            if (obj.rotateZ) {
                obj.mesh.rotation.z += 0.005;
            }
            
            // Orbit (for skill orbs)
            if (obj.orbitAngle !== undefined) {
                obj.orbitAngle += obj.orbitSpeed * 0.01;
                obj.mesh.position.x = Math.cos(obj.orbitAngle) * obj.orbitRadius;
                obj.mesh.position.z = Math.sin(obj.orbitAngle) * obj.orbitRadius - 25;
            }
        });
    }
    
    updateParticles(time) {
        if (this.particles) {
            this.particles.rotation.y = time * 0.02;
        }
    }
    
    animate() {
        if (!this.container.classList.contains('active')) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        this.updateMovement(delta);
        this.updateFloatingObjects(time);
        this.updateParticles(time);
        this.checkInteractionHint();
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize world when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        window.portfolioWorld = new PortfolioWorld();
    }
});
