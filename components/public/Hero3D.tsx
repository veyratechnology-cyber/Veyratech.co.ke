"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Floating 3D Shapes Component
 * Geometric shapes representing technology and innovation
 */
function FloatingShapes() {
  const group = useRef<THREE.Group>(null);

  // Rotate group slowly
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Floating Cube */}
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[-0.5, 0.5]}
      >
        <mesh position={[-2, 1, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FC8436" metalness={0.3} roughness={0.4} />
        </mesh>
      </Float>

      {/* Floating Sphere */}
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.8}
        floatingRange={[-0.3, 0.3]}
      >
        <mesh position={[2, 0.5, -1]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#0D2340" metalness={0.5} roughness={0.2} />
        </mesh>
      </Float>

      {/* Floating Torus */}
      <Float
        speed={2.5}
        rotationIntensity={0.4}
        floatIntensity={0.6}
        floatingRange={[-0.4, 0.4]}
      >
        <mesh position={[0, -1, -2]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.6, 0.2, 16, 32]} />
          <meshStandardMaterial color="#FC8436" metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>

      {/* Floating Octahedron */}
      <Float
        speed={1.8}
        rotationIntensity={0.6}
        floatIntensity={0.5}
        floatingRange={[-0.3, 0.3]}
      >
        <mesh position={[-1.5, -0.5, 1]}>
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial color="#0D2340" metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * 3D Scene Component
 */
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FC8436" />

      {/* 3D Content */}
      <FloatingShapes />

      {/* Camera Controls (subtle movement only) */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/**
 * WebGL Detection Hook
 */
function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}

/**
 * Static Fallback Hero (for non-WebGL browsers)
 */
function StaticHero() {
  return (
    <div className="absolute inset-0">
      {/* Gradient background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse"></div>
        <div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full filter blur-3xl animate-pulse" 
          style={{animationDelay: '2s'}}
        ></div>
      </div>
    </div>
  );
}

/**
 * Hero3D Component
 * 3D interactive hero with WebGL detection and fallback
 */
export function Hero3D() {
  const webGLSupported = useWebGLSupport();

  // Show static hero on mobile or non-WebGL browsers
  if (!webGLSupported || typeof window !== 'undefined' && window.innerWidth < 768) {
    return <StaticHero />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Suspense fallback={<StaticHero />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default Hero3D;
