import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "symbol" | "wordmark";
  /** kept for backwards compatibility; the logo uses fixed brand colours */
  theme?: "light" | "dark";
  /** show the "Technology & Consulting" line under the wordmark */
  tagline?: boolean;
}

// Official logo colours
export const LOGO_BLUE = "#1238B0";
export const LOGO_ORANGE = "#F58220";

/**
 * The VT mark: a blue "V" with an orange "T" nested inside it.
 * Shapes are shared with public/favicon.svg and the generated app icons.
 */
export const LOGO_MARK = {
  viewBox: "0 0 100 92",
  v: "0,0 24,0 50,64 76,19 90,19 50,91",
  t: "26,0 100,0 89.4,17.6 72.6,17.6 51,52 43,38 55,17.6 33,17.6",
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={LOGO_MARK.viewBox} xmlns="http://www.w3.org/2000/svg" className={cn("h-10 w-auto", className)} role="img" aria-label="VeyraTech">
      <polygon points={LOGO_MARK.v} fill={LOGO_BLUE} />
      <polygon points={LOGO_MARK.t} fill={LOGO_ORANGE} />
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-sora font-extrabold tracking-tight leading-none", className)}>
      <span style={{ color: LOGO_BLUE }}>VEYRA</span> <span style={{ color: LOGO_ORANGE }}>TECH</span>
    </span>
  );
}

/**
 * VeyraTech logo: VT mark + "VEYRA TECH" wordmark + "Technology & Consulting".
 * Designed for dark surfaces (it is drawn on black in the brand artwork).
 */
export function Logo({ className, variant = "full", tagline = true }: LogoProps) {
  if (variant === "symbol") return <LogoMark className={className} />;

  if (variant === "wordmark") {
    return (
      <div className={cn("flex items-center", className)}>
        <Wordmark className="text-2xl" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-10" />
      <div className="flex flex-col items-end">
        <Wordmark className="text-[22px]" />
        {tagline && <span className="mt-1 text-[10px] font-semibold leading-none text-white">Technology &amp; Consulting</span>}
      </div>
    </div>
  );
}

export default Logo;
