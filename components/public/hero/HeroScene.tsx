"use client";

/**
 * Landing-page 3D scene: "one connected system".
 *
 * A glowing core (your business system) with orbiting modules — POS, inventory,
 * CRM, M-Pesa, reports, web & mobile — linked to it by lines that carry moving
 * data pulses. The whole scene leans toward the pointer.
 *
 * Built from primitives only (no external textures, fonts or HDRIs), so it
 * works under the site's Content-Security-Policy and loads instantly.
 * Loaded client-side only via next/dynamic (see HeroVisual.tsx).
 */

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";

const ORANGE = "#FC8436";
const NAVY = "#0D2340";
const BLUE = "#3B82F6";

export const MODULES = [
  "Sales & POS",
  "Inventory",
  "Customers (CRM)",
  "M-Pesa",
  "Reports",
  "Web & Mobile",
] as const;

/** Evenly spread points around the core, alternating above/below the equator. */
function useModulePositions(radius = 2.7) {
  return useMemo(
    () =>
      MODULES.map((_, i) => {
        const angle = (i / MODULES.length) * Math.PI * 2 + 0.3;
        const y = (i % 2 === 0 ? 0.45 : -0.45);
        return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.6);
      }),
    [radius]
  );
}

function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (shell.current) {
      shell.current.rotation.y += delta * 0.25;
      shell.current.rotation.x += delta * 0.1;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 2) * 0.04;
      inner.current.scale.setScalar(s);
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.3;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.2;
  });

  return (
    <group>
      {/* Glowing heart */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.72, 3]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.4} roughness={0.25} metalness={0.2} />
      </mesh>
      {/* Soft halo */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      {/* Wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial color={ORANGE} wireframe transparent opacity={0.35} />
      </mesh>
      {/* Orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.75, 0.012, 8, 128]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, Math.PI / 5, 0]}>
        <torusGeometry args={[2.05, 0.008, 8, 128]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function ModuleNode({ position, label, index }: { position: THREE.Vector3; label: string; index: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * (0.4 + index * 0.05);
  });

  return (
    <Float speed={1.4 + index * 0.15} rotationIntensity={0.2} floatIntensity={0.6} floatingRange={[-0.12, 0.12]}>
      <group position={position}>
        <mesh ref={mesh}>
          <boxGeometry args={[0.44, 0.44, 0.44]} />
          <meshStandardMaterial color={NAVY} metalness={0.5} roughness={0.3} emissive={BLUE} emissiveIntensity={0.25} />
          <Edges threshold={15} color={ORANGE} />
        </mesh>
        <Html center position={[0, -0.5, 0]} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-full border border-white/15 bg-[#081A30]/90 px-2.5 py-1 text-[11px] font-medium leading-none text-white/90 shadow-lg">
            {label}
          </span>
        </Html>
      </group>
    </Float>
  );
}

/** Line from the core to a module with a small pulse travelling along it. */
function Link3D({ to, index }: { to: THREE.Vector3; index: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), to], [to]);

  useFrame((state) => {
    if (!pulse.current) return;
    const t = (state.clock.getElapsedTime() * 0.35 + index / MODULES.length) % 1;
    // Alternate direction: odd links send data to the core, even links from it.
    const k = index % 2 === 0 ? t : 1 - t;
    pulse.current.position.copy(to).multiplyScalar(k);
    const fade = Math.sin(t * Math.PI);
    pulse.current.scale.setScalar(0.6 + fade * 0.6);
  });

  return (
    <group>
      <Line points={points} color={ORANGE} lineWidth={1} transparent opacity={0.35} dashed dashSize={0.12} gapSize={0.08} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#FFD2B0" />
      </mesh>
    </group>
  );
}

function Particles({ count = 450 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Points on a thick spherical shell around the scene
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#9DB4D6" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow idle spin plus a gentle lean toward the pointer
    group.current.rotation.y += delta * 0.08;
    // Base tilt so the orbit is seen slightly from above; lean toward the pointer
    const targetX = 0.32 - state.pointer.y * 0.15;
    const targetZ = -state.pointer.x * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, 0.05);
  });
  return <group ref={group}>{children}</group>;
}

function SceneContents() {
  const positions = useModulePositions();
  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 0]} intensity={18} distance={7} color={ORANGE} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} />
      <pointLight position={[-6, -3, -4]} intensity={6} distance={14} color={BLUE} />

      <Rig>
        <Core />
        {positions.map((p, i) => (
          <React.Fragment key={MODULES[i]}>
            <Link3D to={p} index={i} />
            <ModuleNode position={p} label={MODULES[i]} index={i} />
          </React.Fragment>
        ))}
      </Rig>
      <Particles />
      <CameraFit />
    </>
  );
}

/** Pull the camera back on small canvases (phones) so outer modules aren't clipped. */
function CameraFit() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    camera.position.z = size.width < 480 ? 8.6 : 7.4;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <SceneContents />
    </Canvas>
  );
}
