/**
 * Three.js Scene - Sleiman El Hajj Portfolio
 * A visually stunning 3D background with interactive elements
 */

class ThreeScene {
    constructor() {
        this.container = document.getElementById('three-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometricShapes = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createParticles();
        this.createAmbientLight();
        this.addEventListeners();
        this.animate();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.001);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0a0a0f, 1);
        this.container.appendChild(this.renderer.domElement);
    }
    
    createParticles() {
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorPalette = [
            new THREE.Color(0x6366f1), // Primary purple
            new THREE.Color(0x818cf8), // Light purple
            new THREE.Color(0x22d3ee), // Cyan accent
            new THREE.Color(0xf472b6), // Pink accent
        ];
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
            
            // Color
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Custom shader material for particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Add subtle movement
                    pos.x += sin(uTime * 0.3 + position.y * 0.1) * 2.0;
                    pos.y += cos(uTime * 0.2 + position.x * 0.1) * 2.0;
                    pos.z += sin(uTime * 0.1 + position.z * 0.1) * 1.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Create circular particles with soft edges
                    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
                    float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    // Add glow effect
                    vec3 finalColor = vColor * strength;
                    gl_FragColor = vec4(finalColor, strength * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createGeometricShapes() {
        const shapeConfigs = [
            { type: 'icosahedron', size: 8, position: [-30, 20, -20], color: 0x6366f1, rotation: { x: 0.001, y: 0.002 } },
            { type: 'octahedron', size: 6, position: [35, -15, -30], color: 0x22d3ee, rotation: { x: 0.002, y: 0.001 } },
            { type: 'tetrahedron', size: 5, position: [-25, -25, -15], color: 0xf472b6, rotation: { x: 0.001, y: 0.003 } },
            { type: 'dodecahedron', size: 4, position: [40, 30, -40], color: 0x818cf8, rotation: { x: 0.002, y: 0.002 } },
            { type: 'torus', size: [5, 2, 16, 100], position: [0, 0, -60], color: 0x6366f1, rotation: { x: 0.001, y: 0.001 } },
            { type: 'torusKnot', size: [3, 1, 100, 16], position: [-40, 0, -50], color: 0x22d3ee, rotation: { x: 0.002, y: 0.001 } },
        ];
        
        shapeConfigs.forEach(config => {
            let geometry;
            
            switch (config.type) {
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(config.size, 0);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(config.size, 0);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(config.size, 0);
                    break;
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(config.size, 0);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(...config.size);
                    break;
                case 'torusKnot':
                    geometry = new THREE.TorusKnotGeometry(...config.size);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
            }
            
            // Wireframe material with glow
            const material = new THREE.MeshBasicMaterial({
                color: config.color,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...config.position);
            mesh.userData.rotationSpeed = config.rotation;
            mesh.userData.originalPosition = { ...mesh.position };
            
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
            
            // Add inner glow mesh
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.1
            });
            
            const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
            glowMesh.position.copy(mesh.position);
            glowMesh.scale.setScalar(0.9);
            mesh.userData.glowMesh = glowMesh;
            this.scene.add(glowMesh);
        });
    }
    
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x6366f1, 1, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x22d3ee, 1, 100);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (this.particles) {
            this.particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
    }
    
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onScroll() {
        this.scrollY = window.scrollY;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Update particle shader time
        if (this.particles) {
            this.particles.material.uniforms.uTime.value = elapsedTime;
            
            // Rotate particles based on mouse and scroll
            this.particles.rotation.x = this.scrollY * 0.0003 + this.mouse.y * 0.1;
            this.particles.rotation.y = this.scrollY * 0.0002 + this.mouse.x * 0.1;
        }
        
        // Camera movement based on scroll
        this.camera.position.y = -this.scrollY * 0.02;
        this.camera.lookAt(0, -this.scrollY * 0.02, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());

        window.addEventListener('mousemove', (e) => this.onMouseMove(e));

        window.addEventListener('scroll', () => this.onScroll());
    }
}

// Initialize Three.js scene when DOM is loaded
let threeScene = null;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to be loaded
    if (typeof THREE !== 'undefined') {
        threeScene = new ThreeScene();
    } else {
        console.error('Three.js not loaded');
    }
});

// Export for potential use in other modules
window.ThreeScene = ThreeScene;
