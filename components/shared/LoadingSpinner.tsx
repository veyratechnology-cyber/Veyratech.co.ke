/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        className="animate-spin text-secondary" 
        size={sizeMap[size]} 
      />
      {text && (
        <p className="mt-3 text-sm text-text-secondary">{text}</p>
      )}
    </div>
  );
}

/**
 * Full Page Loading
 */
export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary/80 backdrop-blur-sm z-50">
      <div className="bg-primary-dark rounded-lg p-8 shadow-xl border border-border">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
}

/**
 * Skeleton Loader
 */
interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-border rounded ${className}`}
        />
      ))}
    </>
  );
}

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return (
    <div className="bg-primary-dark rounded-lg border border-border p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-1/4" />
    </div>
  );
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
