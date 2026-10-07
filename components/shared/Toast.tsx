"use client";

/**
 * Toast Notification System
 * Simple toast notifications without external dependencies
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-hide after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-500 flex-shrink-0" />,
    error: <XCircle size={20} className="text-red-500 flex-shrink-0" />,
    warning: <AlertCircle size={20} className="text-yellow-500 flex-shrink-0" />,
    info: <Info size={20} className="text-blue-500 flex-shrink-0" />,
  };

  const styles = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div
      className={`
        ${styles[toast.type]}
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        transition-all duration-300 transform
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      style={{
        animation: isExiting ? 'none' : 'slideIn 0.3s ease-out',
      }}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex-1">
          <h4 className="font-semibold text-text-primary text-sm mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-text-secondary text-sm">{toast.message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

// Helper functions
export const toast = {
  success: (title: string, message?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type: 'success', title, message },
        })
      );
    }
  },
  error: (title: string, message?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type: 'error', title, message },
        })
      );
    }
  },
  warning: (title: string, message?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type: 'warning', title, message },
        })
      );
    }
  },
  info: (title: string, message?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type: 'info', title, message },
        })
      );
    }
  },
};

// Add global styles for animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
}
