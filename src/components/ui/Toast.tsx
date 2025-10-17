import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle
};

const colors = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-error-50 border-error-200 text-error-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800'
};

const iconColors = {
  success: 'text-success-600',
  error: 'text-error-600',
  info: 'text-primary-600',
  warning: 'text-warning-600'
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${colors[type]}
      `}
    >
      <div className="flex items-start">
        <Icon className={`flex-shrink-0 w-5 h-5 mt-0.5 ${iconColors[type]}`} />
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{title}</p>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
