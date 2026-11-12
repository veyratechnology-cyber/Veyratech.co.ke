"use client";

/**
 * Landing-page 3D scene: "a business system being built".
 *
 * On a blueprint platform, the pieces of a business system drop into place one
 * by one — database, POS, inventory, CRM, payments, reports, then the web &
 * mobile app on top. Each piece starts as a blue wireframe "plan" and becomes
 * solid when it lands. When the last piece is in, the system goes live (glow,
 * pulse ring, orbiting data), holds, then the build starts again.
 *
 * Built from primitives only (no external textures, fonts or HDRIs), so it
 * works under the site's Content-Security-Policy and loads instantly.
 * Loaded client-side only via next/dynamic (see HeroVisual.tsx).
 */

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Html } from "@react-three/drei";
import * as THREE from "three";

const ORANGE = "#FC8436";
const BLUE = "#3B82F6";

type Vec3 = [number, number, number];

interface BlockDef {
  key: string;
  label: string;
  size: Vec3;
  pos: Vec3;
  color: string;
  emissive: string;
  /** seconds into the loop when this piece starts dropping in */
  start: number;
  /** where the label sits, relative to the block centre */
  labelAt: Vec3;
}

// Stacked bottom-to-top. Heights line up exactly: platform 0.15 → db → modules → reports → app.
const BLOCKS: BlockDef[] = [
  { key: "db", label: "Database & Cloud", size: [3.4, 0.5, 3.4], pos: [0, 0.4, 0], color: "#1B3E6F", emissive: BLUE, start: 0.6, labelAt: [0, -0.05, 2.0] },
  { key: "pos", label: "Sales & POS", size: [1.5, 0.8, 1.5], pos: [-0.95, 1.05, -0.95], color: "#234A80", emissive: BLUE, start: 1.8, labelAt: [-1.15, 0.45, -0.2] },
  { key: "inv", label: "Inventory", size: [1.5, 0.8, 1.5], pos: [0.95, 1.05, -0.95], color: "#234A80", emissive: BLUE, start: 2.7, labelAt: [1.1, 0.5, -0.3] },
  { key: "crm", label: "Customers (CRM)", size: [1.5, 0.8, 1.5], pos: [-0.95, 1.05, 0.95], color: "#234A80", emissive: BLUE, start: 3.6, labelAt: [-1.2, -0.1, 0.5] },
  { key: "pay", label: "M-Pesa Payments", size: [1.5, 0.8, 1.5], pos: [0.95, 1.05, 0.95], color: "#234A80", emissive: BLUE, start: 4.5, labelAt: [1.25, -0.1, 0.5] },
  { key: "rep", label: "Reports", size: [2.3, 0.4, 2.3], pos: [0, 1.65, 0], color: "#2A5298", emissive: BLUE, start: 5.6, labelAt: [1.75, 0.1, 0.4] },
  { key: "app", label: "Web & Mobile App", size: [1, 1, 1], pos: [0, 2.35, 0], color: ORANGE, emissive: ORANGE, start: 6.6, labelAt: [0, 0.95, 0] },
];

const DROP = 0.9; // seconds a piece takes to land
const BUILD_END = BLOCKS[BLOCKS.length - 1].start + DROP; // 7.5s
const LIVE_END = 12.2; // system stays "live" until here
const FADE = 0.8; // pieces shrink away before the loop restarts
const LOOP = LIVE_END + FADE;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
// Slight overshoot so pieces "settle" when they land
const easeOutBack = (p: number) => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);

function useLoopTime() {
  return (clock: THREE.Clock) => clock.getElapsedTime() % LOOP;
}

/** Blueprint platform the system is built on. */
function Platform() {
  return (
    <group>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[5.2, 0.15, 5.2]} />
        <meshStandardMaterial color="#0A1D38" metalness={0.4} roughness={0.5} />
        <Edges color={ORANGE} />
      </mesh>
      <gridHelper args={[5.2, 13, "#2B4B7A", "#1B3558"]} position={[0, 0.155, 0]} />
    </group>
  );
}

/** One piece of the system: wireframe plan first, then the solid block drops in. */
function Block({ def, index }: { def: BlockDef; index: number }) {
  const solid = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const plan = useRef<THREE.LineSegments>(null);
  const label = useRef<HTMLSpanElement>(null);
  const loopTime = useLoopTime();

  const planGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...def.size)), [def.size]);
  useEffect(() => () => planGeometry.dispose(), [planGeometry]);

  useFrame(({ clock }) => {
    const t = loopTime(clock);
    const p = clamp01((t - def.start) / DROP); // 0 → 1 while dropping
    const fading = t > LIVE_END;
    const fade = fading ? 1 - clamp01((t - LIVE_END) / FADE) : 1;
    const live = t > BUILD_END && !fading;

    if (solid.current) {
      solid.current.visible = p > 0 && fade > 0.01;
      solid.current.position.y = def.pos[1] + (1 - easeOutCubic(p)) * 3.2;
      const s = (p < 1 ? easeOutBack(p) * 0.25 + 0.75 : 1) * fade;
      solid.current.scale.setScalar(Math.max(0.001, s));
    }
    if (material.current) {
      // Flash as the piece lands, then a gentle staggered pulse once the system is live
      const flash = Math.max(0, 1 - (t - def.start - DROP) / 0.6);
      const landed = p >= 1 ? flash : 0;
      const pulse = live ? 0.25 + Math.sin(clock.getElapsedTime() * 3 - index * 0.7) * 0.15 : 0;
      const base = def.key === "app" ? 0.9 : 0.04;
      material.current.emissiveIntensity = base + landed * 0.5 + pulse * (def.key === "app" ? 1 : 0.35);
    }
    if (plan.current) {
      // The plan shows until its block has landed, and hides during the fade-out
      const mat = plan.current.material as THREE.LineBasicMaterial;
      mat.opacity = fading ? 0 : p >= 1 ? 0 : 0.55 - p * 0.3;
      plan.current.visible = mat.opacity > 0.01;
    }
    if (label.current) {
      label.current.style.opacity = p >= 1 && !fading ? "1" : "0";
    }
  });

  return (
    <group>
      <lineSegments ref={plan} geometry={planGeometry} position={def.pos}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.5} />
      </lineSegments>

      <mesh ref={solid} position={def.pos} visible={false}>
        <boxGeometry args={def.size} />
        <meshStandardMaterial ref={material} color={def.color} emissive={def.emissive} emissiveIntensity={0.12} metalness={0.2} roughness={0.55} />
        <Edges color={def.key === "app" ? "#FFD2B0" : ORANGE} />
      </mesh>

      <Html
        center
        position={[def.pos[0] + def.labelAt[0], def.pos[1] + def.labelAt[1], def.pos[2] + def.labelAt[2]]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          ref={label}
          style={{ opacity: 0, transition: "opacity 0.4s ease" }}
          className="block whitespace-nowrap rounded-full border border-white/15 bg-[#081A30]/90 px-2.5 py-1 text-[11px] font-medium leading-none text-white/90 shadow-lg"
        >
          {def.label}
        </span>
      </Html>
    </group>
  );
}

/** Effects that switch on when the last piece lands: pulse ring, orbiting data, warm light. */
function LiveEffects() {
  const ring = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const loopTime = useLoopTime();

  useFrame(({ clock }, delta) => {
    const t = loopTime(clock);
    const live = t > BUILD_END && t <= LIVE_END;
    const since = t - BUILD_END;

    if (ring.current) {
      // A ring expands outward from the top block every 1.6s while live
      const k = live ? (since % 1.6) / 1.6 : 0;
      ring.current.visible = live;
      ring.current.scale.setScalar(0.6 + k * 3.2);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.7;
    }
    if (orbit.current) {
      orbit.current.visible = live;
      orbit.current.rotation.y += delta * 1.6;
    }
    if (light.current) {
      const target = live ? 22 : 4;
      light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, target, 0.06);
    }
  });

  return (
    <group position={[0, 2.35, 0]}>
      <pointLight ref={light} color={ORANGE} intensity={4} distance={9} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[1, 0.012, 8, 96]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <group ref={orbit} visible={false}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.25, Math.sin(a * 2) * 0.15, Math.sin(a) * 1.25]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color="#FFD2B0" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/** "Building… 57%" → "System live" badge in front of the platform. */
function StatusBadge() {
  const text = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const last = useRef("");
  const loopTime = useLoopTime();

  useFrame(({ clock }) => {
    const t = loopTime(clock);
    const landed = BLOCKS.filter((b) => t >= b.start + DROP).length;
    const live = t > BUILD_END && t <= LIVE_END;
    const next = live ? "System live" : `Building your system… ${Math.round((landed / BLOCKS.length) * 100)}%`;
    if (next !== last.current && text.current && dot.current) {
      last.current = next;
      text.current.textContent = next;
      dot.current.style.background = live ? "#34C77B" : ORANGE;
    }
  });

  return (
    <Html center position={[0, 0, 3.3]} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#081A30]/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl">
        <span ref={dot} className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
        <span ref={text}>Building your system… 0%</span>
      </span>
    </Html>
  );
}

function Particles({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3] = r * Math.cos(theta);
      arr[i * 3 + 1] = Math.random() * 7 - 1.5;
      arr[i * 3 + 2] = r * Math.sin(theta);
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
      <pointsMaterial size={0.04} color="#9DB4D6" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Gentle side-to-side sway plus a lean toward the pointer. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const sway = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, sway + state.pointer.x * 0.3, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.08, 0.05);
  });
  return <group ref={group}>{children}</group>;
}

/** Three-quarter view from above; pulled back on small canvases (phones). */
function CameraFit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const k = size.width < 480 ? 1.55 : 1.32;
    camera.position.set(6.2 * k, 5.4 * k, 7.6 * k);
    camera.lookAt(0, 0.95, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={2.2} />
      <directionalLight position={[-4, 6, 8]} intensity={0.9} />
      <pointLight position={[-6, 3, -5]} intensity={4} distance={18} color={BLUE} />

      <Rig>
        <Platform />
        {BLOCKS.map((def, i) => (
          <Block key={def.key} def={def} index={i} />
        ))}
        <LiveEffects />
        <StatusBadge />
      </Rig>
      <Particles />
      <CameraFit />
    </>
  );
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [6.2, 5.4, 7.6], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      style={{ background: "transparent" }}
    >
      <SceneContents />
    </Canvas>
  );
}
