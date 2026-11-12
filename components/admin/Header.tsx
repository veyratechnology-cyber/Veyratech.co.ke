import React from "react";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div className="bg-primary-dark border-b border-border px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-sora font-bold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
        </div>
      </div>
    </div>
  );
}

export default Header;
