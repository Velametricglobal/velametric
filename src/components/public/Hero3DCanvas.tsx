import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DProps {
  glowColor?: string;
  rotationSpeed?: number;
  scale?: number;
  particleDensity?: number;
  lightIntensity?: number;
  mouseInteraction?: boolean;
}

export const Hero3DCanvas: React.FC<Hero3DProps> = ({
  glowColor = '#6366f1',
  rotationSpeed = 0.6,
  scale = 1.1,
  particleDensity = 80,
  lightIntensity = 1.8,
  mouseInteraction = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const responsiveScale = isMobile ? scale * 0.7 : isTablet ? scale * 0.88 : scale;

    const width = containerRef.current.clientWidth || 360;
    const height = containerRef.current.clientHeight || 360;

    // WebGL Capability Check
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL initialization fallback', e);
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 6.2 : 5.5;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2));

    containerRef.current.appendChild(renderer.domElement);

    // Torus Knot — Complex Luxury Architectural Mesh
    const geometry = new THREE.TorusKnotGeometry(
      responsiveScale * 0.85, 
      responsiveScale * 0.28, 
      isMobile ? 64 : 120, 
      isMobile ? 12 : 16, 
      2, 
      3
    );
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1e1b4b'),
      emissive: new THREE.Color('#312e81'),
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Outer Wireframe Halo
    const wireGeo = new THREE.IcosahedronGeometry(responsiveScale * 1.5, isMobile ? 1 : 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f59e0b'), // Champagne Amber accent
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Discrete Ambient Dust Particles (Optimized for Mobile)
    const particleCount = Math.round(isMobile ? particleDensity * 1.5 : particleDensity * 4);
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * (isMobile ? 7 : 10);
      positions[i + 1] = (Math.random() - 0.5) * (isMobile ? 7 : 10);
      positions[i + 2] = (Math.random() - 0.5) * (isMobile ? 7 : 10);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#818cf8'),
      size: isMobile ? 0.045 : 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dual-Tone Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key Light (Indigo)
    const keyLight = new THREE.PointLight(new THREE.Color('#6366f1'), lightIntensity * 2.5, 50);
    keyLight.position.set(6, 6, 6);
    scene.add(keyLight);

    // Warm Fill Light (Amber Gold)
    const fillLight = new THREE.PointLight(new THREE.Color('#f59e0b'), lightIntensity * 2, 50);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // Mouse & Touch Tracking
    let targetX = 0;
    let targetY = 0;
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!mouseInteraction || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      mesh.rotation.x += 0.004 * rotationSpeed;
      mesh.rotation.y += 0.006 * rotationSpeed;

      wireMesh.rotation.x -= 0.002 * rotationSpeed;
      wireMesh.rotation.y -= 0.003 * rotationSpeed;

      particles.rotation.y += 0.0008 * rotationSpeed;

      if (mouseInteraction) {
        mesh.rotation.y += (targetX * 0.35 - mesh.rotation.y) * 0.04;
        mesh.rotation.x += (-targetY * 0.35 - mesh.rotation.x) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [glowColor, rotationSpeed, scale, particleDensity, lightIntensity, mouseInteraction]);

  return (
    <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] max-w-full overflow-hidden flex items-center justify-center pointer-events-auto">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
