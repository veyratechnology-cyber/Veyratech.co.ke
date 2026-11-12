"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ShoppingCart, Package, Users, Smartphone, BarChart3, Globe } from "lucide-react";

/**
 * Hero visual wrapper.
 * - Loads the Three.js scene only in the browser (keeps it out of the initial bundle).
 * - Shows a static, CSS-only version while loading, when WebGL is unavailable,
 *   or when the visitor prefers reduced motion.
 * - Pauses rendering while the hero is scrolled out of view.
 */
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <StaticSystem />,
});

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduced && canUseWebGL() ? "3d" : "static");
  }, []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="relative aspect-square w-full max-w-[560px] mx-auto" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-secondary/15 blur-3xl" />
      {mode === "3d" ? <HeroScene active={inView} /> : <StaticSystem />}
    </div>
  );
}

/** CSS-only stand-in that mirrors the 3D scene's layout. */
function StaticSystem() {
  const modules = [
    { icon: ShoppingCart, label: "Sales & POS", pos: "left-[6%] top-[22%]" },
    { icon: Package, label: "Inventory", pos: "right-[4%] top-[18%]" },
    { icon: Users, label: "Customers (CRM)", pos: "right-0 top-[56%]" },
    { icon: Smartphone, label: "M-Pesa", pos: "left-[52%] bottom-[4%] -translate-x-1/2" },
    { icon: BarChart3, label: "Reports", pos: "left-0 top-[60%]" },
    { icon: Globe, label: "Web & Mobile", pos: "left-1/2 top-[2%] -translate-x-1/2" },
  ];
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-[18%] rounded-full border border-secondary/30" />
      <div className="absolute inset-[28%] rounded-full border border-dashed border-white/15" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_60px_rgba(252,132,54,0.7)]" />
      {modules.map(({ icon: Icon, label, pos }) => (
        <div
          key={label}
          className={`absolute ${pos} flex items-center gap-2 rounded-full border border-white/10 bg-primary-dark/90 px-3 py-2 text-xs font-medium text-white/90 shadow-lg`}
        >
          <Icon size={14} className="text-secondary" />
          {label}
        </div>
      ))}
    </div>
  );
}
