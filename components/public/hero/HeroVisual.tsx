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

/** CSS-only stand-in: the finished system as stacked layers, matching the 3D scene. */
function StaticSystem() {
  const modules = [
    { icon: ShoppingCart, label: "Sales & POS" },
    { icon: Package, label: "Inventory" },
    { icon: Users, label: "Customers (CRM)" },
    { icon: Smartphone, label: "M-Pesa Payments" },
  ];
  const layer = "rounded-xl border border-secondary/40 bg-primary-dark/90 shadow-lg";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-[10%]">
      <div className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(252,132,54,0.6)]">
        <Globe size={16} /> Web &amp; Mobile App
      </div>
      <div className={`${layer} flex w-[70%] items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white/90`}>
        <BarChart3 size={14} className="text-secondary" /> Reports
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {modules.map(({ icon: Icon, label }) => (
          <div key={label} className={`${layer} flex items-center gap-2 px-3 py-3 text-xs font-medium text-white/90`}>
            <Icon size={14} className="flex-shrink-0 text-secondary" />
            {label}
          </div>
        ))}
      </div>
      <div className={`${layer} w-full px-4 py-3 text-center text-xs font-medium text-white/90`}>Database &amp; Cloud</div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-primary-dark px-3.5 py-1.5 text-xs font-semibold text-white">
        <span className="h-2 w-2 rounded-full bg-success" /> System live
      </div>
    </div>
  );
}
