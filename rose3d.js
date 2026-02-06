/*
 * Interactive 3D Rose - Three.js
 * Click on petals to reveal Valentine's Day plans
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// Plan data for each petal
const petalPlans = [
    {
        index: 0,
        emoji: "🍽️",
        time: "2:00 PM",
        title: "Novikov",
        info: "Dress glamorous! 👗✨",
        detail: "Fine dining at its best"
    },
    {
        index: 1,
        emoji: "🍣",
        time: "4:00 PM",
        title: "Sushi Class",
        info: "Get comfy! 👕",
        detail: "Let's roll together!"
    },
    {
        index: 2,
        emoji: "🍦",
        time: "After",
        title: "Ice Cream",
        info: "Sweet treats! 🥰",
        detail: "Perfect ending"
    }
];

class Rose3D {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.controls = null;
        this.roseObject = null;
        this.roseMesh = null; // The actual rose body for 4th click
        this.clickablePetals = []; // The 3 special colored petals
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredPetal = null;
        this.animatingPetals = [];
        this.revealedPlans = [];
        this.clickCount = 0;
        this.glowInterval = null; // For rose glow animation
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) {
            console.log('Rose already initialized');
            return;
        }
        
        console.log('Initializing 3D Rose...');
        
        this.canvas = document.getElementById('rose-canvas');
        if (!this.canvas) {
            console.error('Rose canvas not found');
            return;
        }

        this.container = this.canvas.parentElement;
        console.log('Canvas container size:', this.container.clientWidth, 'x', this.container.clientHeight);
        
        this.setupScene();
        this.loadRoseModel();
        this.setupEventListeners();
        this.animate();
        
        this.isInitialized = true;
        console.log('Rose initialization complete');
    }

    setupScene() {
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            33,
            this.container.clientWidth / this.container.clientHeight,
            1,
            2000
        );
        this.camera.position.set(0, 150, 250);

        // Scene
        this.scene = new THREE.Scene();

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.6);
        pointLight.castShadow = true;
        this.camera.add(pointLight);
        this.scene.add(this.camera);

        // Add a directional light for better petal visibility
        const directionalLight = new THREE.DirectionalLight(0xfff0f5, 0.4);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;

        // Controls - Manual rotation only
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = false; // Disable auto-rotation
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        this.controls.minDistance = 150;
        this.controls.maxDistance = 400;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    loadRoseModel() {
        console.log('Starting to load rose model...');
        
        const material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.8,
            side: THREE.DoubleSide
        });

        const manager = new THREE.LoadingManager(
            () => {
                console.log('Rose model loading complete');
                this.onModelLoaded();
            },
            (url, itemsLoaded, itemsTotal) => {
                console.log(`Loading: ${itemsLoaded}/${itemsTotal} - ${url}`);
            },
            (url) => {
                console.error('Error loading:', url);
            }
        );

        const loader = new OBJLoader(manager);
        loader.load(
            "https://happy358.github.io/Images/Model/red_rose3.obj",
            (obj) => {
                console.log('Rose OBJ loaded successfully');
                this.roseObject = obj;
                
                obj.traverse((child) => {
                    if (child.isMesh) {
                        console.log('Found mesh:', child.name);
                        const mat = material.clone();
                        
                        if (child.name === "rose") {
                            mat.color.set("crimson");
                            // Store rose mesh for 4th click
                            this.roseMesh = child;
                            this.roseMesh.userData.isRoseBody = true;
                        } else if (child.name === "calyx") {
                            mat.color.set("#001a14");
                        } else if (child.name === "leaf1" || child.name === "leaf2") {
                            mat.color.set("#00331b");
                        }
                        
                        child.material = mat;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                
                obj.rotation.set(0, Math.PI / 1.7, 0);
                this.scene.add(obj);
                console.log('Rose added to scene');
            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    console.log(`Rose model ${Math.round(percentComplete)}% loaded`);
                }
            },
            (error) => {
                console.error('Error loading rose model:', error);
            }
        );
    }

    onModelLoaded() {
        console.log('Rose model loaded successfully');
        
        // Create 3 distinct colored clickable petals
        this.createClickablePetals();
    }

    createClickablePetals() {
        // Define 3 subtle color variations (more natural crimson tones with slight highlights)
        const petalColors = [
            { color: 0xE63946, emissive: 0xFF6B7A, name: 'Bright Crimson' },  // Restaurant
            { color: 0xDC143C, emissive: 0xFF5764, name: 'Deep Crimson' },    // Sushi Class
            { color: 0xF08080, emissive: 0xFFB3BA, name: 'Light Crimson' }    // Ice Cream
        ];

        // Positions around the rose (spread out significantly for clear visibility)
        const petalPositions = [
            { x: 25, y: 10, z: 20, rotation: { x: 0.4, y: -0.3, z: 0.4 }, scale: 1.0 },      // Far right
            { x: -40, y: 30, z: 25, rotation: { x: -0.4, y: 1.0, z: -0.6 }, scale: 0.95 },    // Far left
            { x: 20, y: 40, z: -10, rotation: { x: 0.2, y: -0.8, z: 0.3 }, scale: 1.05 }       // Right-front (moved as requested)
        ];

        petalPositions.forEach((pos, index) => {
            // Create a more organic rose petal shape using a custom shaped sphere
            const petalGeometry = new THREE.SphereGeometry(12, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6);
            
            // Reshape to create realistic rose petal contours
            const positionAttribute = petalGeometry.attributes.position;
            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);
                const z = positionAttribute.getZ(i);
                
                // Calculate distance from center for natural curving
                const distFromCenter = Math.sqrt(x * x + z * z);
                const normalizedDist = distFromCenter / 12;
                
                // Create organic petal shape: wider at top, narrower at base, curved edges
                const widthScale = 1.4 + normalizedDist * 0.3;
                const heightScale = 2.2 - normalizedDist * 0.4;
                const depthScale = 0.25 + normalizedDist * 0.15;
                
                // Add subtle wave/curl to edges
                const curl = Math.sin(normalizedDist * Math.PI) * 0.8;
                
                positionAttribute.setXYZ(
                    i,
                    x * widthScale,
                    y * heightScale + curl,
                    z * depthScale
                );
            }
            petalGeometry.computeVertexNormals();
            
            // Create material matching the rose with subtle highlights
            const petalMaterial = new THREE.MeshStandardMaterial({
                color: petalColors[index].color,
                metalness: 0,
                roughness: 0.75,
                side: THREE.DoubleSide,
                emissive: petalColors[index].emissive,
                emissiveIntensity: 0.15 // Very subtle glow
            });
            
            // Create mesh
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            // Position, rotate, and scale
            petal.position.set(pos.x, pos.y, pos.z);
            petal.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
            petal.scale.setScalar(pos.scale);
            
            // Store plan index for this petal
            petal.userData.planIndex = index;
            petal.userData.isClickable = true;
            petal.userData.originalColor = petalColors[index].color;
            petal.userData.originalEmissiveIntensity = 0.15;
            petal.userData.originalScale = pos.scale;
            
            // Add to scene and clickable array
            this.scene.add(petal);
            this.clickablePetals.push(petal);
            
            console.log(`Created clickable petal ${index + 1} (${petalColors[index].name})`);
        });
    }

    setupEventListeners() {
        // Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Click for petal interaction
        this.canvas.addEventListener('click', (event) => this.onMouseClick(event));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check petals or rose body depending on click count
        let intersectables = this.clickablePetals.slice();
        if (this.clickCount === 3 && this.roseMesh) {
            intersectables.push(this.roseMesh);
        }
        
        const intersects = this.raycaster.intersectObjects(intersectables, false);

        if (intersects.length > 0) {
            const intersectedPetal = intersects[0].object;
            
            // Check if this petal is clickable and not already clicked
            if ((intersectedPetal.userData.isClickable || intersectedPetal.userData.isRoseBody) && !intersectedPetal.userData.clicked) {
                if (this.hoveredPetal !== intersectedPetal) {
                    // Reset previous hovered petal
                    if (this.hoveredPetal && !this.hoveredPetal.userData.clicked) {
                        const originalScale = this.hoveredPetal.userData.originalScale || 1;
                        this.hoveredPetal.scale.setScalar(originalScale);
                        if (this.hoveredPetal.material.emissiveIntensity !== undefined) {
                            this.hoveredPetal.material.emissiveIntensity = this.hoveredPetal.userData.originalEmissiveIntensity || 0;
                        }
                    }
                    
                    this.hoveredPetal = intersectedPetal;
                    this.canvas.style.cursor = 'pointer';
                    
                    // Hover effects: subtle scale and brighter glow
                    const originalScale = intersectedPetal.userData.originalScale || 1;
                    intersectedPetal.scale.setScalar(originalScale * 1.08);
                    if (intersectedPetal.material.emissiveIntensity !== undefined) {
                        intersectedPetal.material.emissiveIntensity = 0.4;
                    }
                }
            }
        } else {
            // Reset hover state
            if (this.hoveredPetal && !this.hoveredPetal.userData.clicked) {
                const originalScale = this.hoveredPetal.userData.originalScale || 1;
                this.hoveredPetal.scale.setScalar(originalScale);
                if (this.hoveredPetal.material.emissiveIntensity !== undefined) {
                    this.hoveredPetal.material.emissiveIntensity = this.hoveredPetal.userData.originalEmissiveIntensity || 0;
                }
                this.hoveredPetal = null;
            }
            this.canvas.style.cursor = 'default';
        }
    }

    onMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check petals or rose body depending on click count
        let intersectables = this.clickablePetals.slice();
        if (this.clickCount === 3 && this.roseMesh) {
            intersectables.push(this.roseMesh);
        }
        
        const intersects = this.raycaster.intersectObjects(intersectables, false);

        if (intersects.length > 0) {
            const clickedPetal = intersects[0].object;
            
            // Only process if petal is clickable and not already clicked
            if ((clickedPetal.userData.isClickable || clickedPetal.userData.isRoseBody) && !clickedPetal.userData.clicked) {
                const intersectionPoint = intersects[0].point;
                this.onPetalClick(clickedPetal, intersectionPoint);
            }
        }
    }

    onPetalClick(petal, intersectionPoint) {
        // Check if petal has already been clicked
        if (petal.userData.clicked) {
            return;
        }
        
        // Check if this is the 4th click (rose body)
        if (petal.userData.isRoseBody && this.clickCount === 3) {
            this.onFourthClick();
            return;
        }
        
        // Get the plan index for this specific petal
        const planIndex = petal.userData.planIndex;
        if (planIndex === undefined || planIndex >= petalPlans.length) {
            console.log('Invalid plan index');
            return;
        }

        // Mark petal as clicked
        petal.userData.clicked = true;
        petal.userData.isClickable = false;
        
        // Increment click count and update counter
        this.clickCount++;
        this.updateCounter();
        
        // Show the plan for this specific petal
        this.revealPlan(petalPlans[planIndex]);

        // Animate the petal falling
        this.animatePetalFall(petal);

        // Reset hover state
        if (this.hoveredPetal === petal) {
            this.hoveredPetal = null;
            this.canvas.style.cursor = 'default';
        }
        
        // Update subtitle after 3 clicks
        if (this.clickCount === 3) {
            const subtitle = document.querySelector('.celebration-subtitle');
            if (subtitle) {
                subtitle.textContent = '👇 Click the ROSE one more time! 👇';
                subtitle.style.fontSize = '1.4rem';
                subtitle.style.fontWeight = '700';
                subtitle.style.animation = 'urgentPulse 1s infinite';
                subtitle.style.color = '#ff1493';
                subtitle.style.textShadow = '2px 2px 4px rgba(255, 20, 147, 0.3)';
            }
            
            // Make the rose glow to indicate it's clickable
            if (this.roseMesh && this.roseMesh.material) {
                this.roseMesh.material.emissive = new THREE.Color(0xff1493);
                this.roseMesh.material.emissiveIntensity = 0.3;
                
                // Pulsing glow animation
                this.startRoseGlowAnimation();
            }
        }
        
        console.log(`Petal ${planIndex + 1} clicked - revealing plan (${this.clickCount}/4)`);
    }

    startRoseGlowAnimation() {
        // Animate the rose glow to make it obvious
        if (this.glowInterval) clearInterval(this.glowInterval);
        
        let glowDirection = 1;
        let currentIntensity = 0.3;
        
        this.glowInterval = setInterval(() => {
            if (!this.roseMesh || !this.roseMesh.material || this.clickCount === 4) {
                clearInterval(this.glowInterval);
                return;
            }
            
            currentIntensity += glowDirection * 0.02;
            
            if (currentIntensity >= 0.6) {
                glowDirection = -1;
            } else if (currentIntensity <= 0.3) {
                glowDirection = 1;
            }
            
            this.roseMesh.material.emissiveIntensity = currentIntensity;
        }, 50);
    }

    onFourthClick() {
        console.log('4th click - playing speech!');
        
        // Stop the glow animation
        if (this.glowInterval) {
            clearInterval(this.glowInterval);
            this.glowInterval = null;
        }
        
        // Update counter
        this.clickCount = 4;
        this.updateCounter();
        
        // Hide subtitle
        const subtitle = document.querySelector('.celebration-subtitle');
        if (subtitle) {
            subtitle.style.display = 'none';
        }
        
        // Show and play audio
        const audioContainer = document.getElementById('audio-container');
        const audio = document.getElementById('speech-audio');
        
        if (audioContainer && audio) {
            audioContainer.style.display = 'block';
            audio.play();
            
            // Scroll to audio
            audioContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Mark rose as clicked
        if (this.roseMesh) {
            this.roseMesh.userData.clicked = true;
        }
    }

    updateCounter() {
        const counterText = document.getElementById('counter-text');
        if (counterText) {
            counterText.textContent = `${this.clickCount}/4`;
            
            // Add animation
            counterText.style.animation = 'none';
            setTimeout(() => {
                counterText.style.animation = 'gentlePulse 0.5s ease';
            }, 10);
        }
    }

    revealPlan(plan) {
        this.revealedPlans.push(plan);
        
        const container = document.getElementById('revealed-plans');
        if (!container) return;

        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.setAttribute('data-plan-index', plan.index); // Store index for sorting
        planCard.innerHTML = `
            <div class="plan-emoji">${plan.emoji}</div>
            <div class="plan-content">
                <div class="plan-time">${plan.time}</div>
                <div class="plan-title">${plan.title}</div>
                <div class="plan-info">${plan.info}</div>
                <div class="plan-detail">${plan.detail}</div>
            </div>
        `;
        
        // Insert card in chronological order
        const existingCards = Array.from(container.children);
        let inserted = false;
        
        for (let i = 0; i < existingCards.length; i++) {
            const existingIndex = parseInt(existingCards[i].getAttribute('data-plan-index'));
            if (plan.index < existingIndex) {
                container.insertBefore(planCard, existingCards[i]);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) {
            container.appendChild(planCard);
        }
        
        // Animate in
        setTimeout(() => {
            planCard.classList.add('visible');
        }, 50);
    }

    animatePetalFall(petal) {
        const startTime = Date.now();
        const duration = 2500; // 2.5 seconds
        const startPosition = petal.position.clone();
        const startRotation = petal.rotation.clone();
        const startScale = petal.scale.clone();

        const animation = {
            petal: petal,
            startTime: startTime,
            duration: duration,
            startPosition: startPosition,
            startRotation: startRotation,
            startScale: startScale,
            material: petal.material
        };

        this.animatingPetals.push(animation);
    }

    updateAnimations() {
        const currentTime = Date.now();
        
        for (let i = this.animatingPetals.length - 1; i >= 0; i--) {
            const anim = this.animatingPetals[i];
            const elapsed = currentTime - anim.startTime;
            const progress = Math.min(elapsed / anim.duration, 1);

            // Side-to-side swing (3-4 oscillations)
            const swingAmount = Math.sin(progress * Math.PI * 7) * 30 * (1 - progress);
            anim.petal.position.x = anim.startPosition.x + swingAmount;

            // Fall down
            anim.petal.position.y = anim.startPosition.y - (progress * 300);
            
            // Rotation while falling
            anim.petal.rotation.x = anim.startRotation.x + (progress * Math.PI * 2);
            anim.petal.rotation.z = anim.startRotation.z + (progress * Math.PI * 1.5);

            // Fade out
            if (anim.material) {
                anim.material.opacity = 1 - progress;
                anim.material.transparent = true;
            }

            // Remove when complete
            if (progress >= 1) {
                this.scene.remove(anim.petal);
                this.animatingPetals.splice(i, 1);
            }
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.updateAnimations();
        this.render();
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    dispose() {
        // Clean up resources
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        this.isInitialized = false;
    }
}

// Create global instance and auto-initialize when DOM is ready
const rose3DInstance = new Rose3D();

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rose3D = rose3DInstance;
    });
} else {
    window.rose3D = rose3DInstance;
}

// Export for use in other scripts
export default rose3DInstance;
