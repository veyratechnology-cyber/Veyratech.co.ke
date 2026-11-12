import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href"> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary " +
  "active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 " +
  "aria-disabled:opacity-50 aria-disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-secondary text-white shadow-[0_8px_24px_-8px_rgba(252,132,54,0.6)] hover:bg-secondary-hover hover:shadow-[0_12px_28px_-8px_rgba(252,132,54,0.7)]",
  secondary:
    "bg-white/[0.04] text-text-primary border border-white/20 hover:border-secondary/70 hover:text-secondary hover:bg-secondary/5",
  outline:
    "border border-white/20 text-text-primary hover:border-secondary hover:bg-secondary/10 hover:text-white",
  ghost: "text-text-secondary hover:text-secondary hover:bg-secondary/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-[15px]",
  lg: "px-8 py-4 text-base md:text-lg",
};

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/**
 * Reusable Button Component (VeyraTech navy + orange).
 *
 * Pass `href` to render a link styled as a button instead of wrapping a
 * <button> inside <Link> (which is invalid HTML and confuses screen readers).
 * External links (http/https/mailto/tel) render a plain <a>.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", isLoading = false, className, children } = props;
  const classes = cn(baseStyles, variants[variant], sizes[size], className);
  const content = isLoading ? (
    <>
      <Spinner />
      Loading...
    </>
  ) : (
    children
  );

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, isLoading: _l, className: _c, children: _ch, disabled, ...rest } = props;
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    const shared = {
      ...rest,
      className: classes,
      "aria-disabled": disabled || isLoading || undefined,
      tabIndex: disabled ? -1 : rest.tabIndex,
    };

    if (isExternal) {
      const newTab = /^https?:/.test(href) && rest.target === undefined;
      return (
        <a href={href} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...shared}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} {...shared}>
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, isLoading: _l, className: _c, children: _ch, disabled, ...rest } = props;
  return (
    <button className={classes} disabled={disabled || isLoading} {...rest}>
      {content}
    </button>
  );
}

export default Button;
