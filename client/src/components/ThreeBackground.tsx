import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Detect reduced motion preference
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Responsive particle density based on device
const getParticleCount = () => {
  const isMobile = window.innerWidth < 768;
  const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  if (prefersReducedMotion()) return 0;
  if (isMobile || isLowPower) return 75;
  return 150;
};

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Get particle count (responsive)
    const particleCount = getParticleCount();
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Storage for resources to clean up
    let particles: THREE.BufferGeometry | undefined;
    let particleMaterial: THREE.ShaderMaterial | undefined;
    let particleSystem: THREE.Points | undefined;
    let velocities: Float32Array | undefined;

    // Create particles only if motion is allowed
    if (particleCount > 0) {
      particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      velocities = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Random positions
        positions[i * 3] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

        // Random velocities (very slow)
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Particle material with calming colors
      particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          color1: { value: new THREE.Color(0x3b82f6) }, // Primary blue
          color2: { value: new THREE.Color(0x06b6d4) }, // Cyan
        },
        vertexShader: `
          attribute float size;
          uniform float time;
          varying float vAlpha;
          
          void main() {
            vAlpha = sin(time + position.x * 0.01) * 0.3 + 0.7;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying float vAlpha;
          
          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            
            vec3 color = mix(color1, color2, gl_PointCoord.x);
            float alpha = (1.0 - distance * 2.0) * vAlpha * 0.6;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });

      particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
      particlesRef.current = particleSystem;
    }

    // Animation loop
    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);

      // Only animate if we have particles
      if (particleSystem && particleMaterial && velocities) {
        // Update particle material time uniform
        if (particleMaterial.uniforms) {
          particleMaterial.uniforms.time.value = time * 0.001;
        }

        // Gently move particles
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3] * 0.5; // Slower movement
          positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.5;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.5;

          // Wrap around screen bounds
          if (Math.abs(positions[i * 3]) > 200) {
            velocities[i * 3] *= -1;
          }
          if (Math.abs(positions[i * 3 + 1]) > 200) {
            velocities[i * 3 + 1] *= -1;
          }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Very slow rotation for calming effect
        particleSystem.rotation.y += 0.0002;
        particleSystem.rotation.x += 0.0001;
      }

      renderer.render(scene, camera);
    };

    // Start animation (for reduced motion users, this renders once then stops the loop)
    if (particleCount > 0) {
      animate(0);
    } else {
      // For reduced motion users, render once and don't start the loop
      renderer.render(scene, camera);
    }

    // Handle window resize (throttled)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!mountRef.current) return;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup (comprehensive disposal)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      if (particles) {
        particles.dispose();
      }
      if (particleMaterial) {
        particleMaterial.dispose();
      }
      if (particleSystem) {
        scene.remove(particleSystem);
      }
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ 
        background: prefersReducedMotion() 
          ? 'linear-gradient(135deg, hsl(210 5% 98%) 0%, hsl(210 10% 96%) 100%)'
          : 'transparent',
      }}
    />
  );
}