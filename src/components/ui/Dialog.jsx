'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export default function Dialog({
  open,
  onClose,
  title,
  subtitle,
  size = 'lg',
  children,
  footer,
  className = '',
}) {
  const handleEsc = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-overlay-fade-in"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-dialog-slide-up ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-charcoal/8 bg-gradient-to-r from-emerald-50/80 to-white rounded-t-2xl shrink-0">
            <div className="pr-8">
              <h2 className="text-lg font-bold text-emerald-dark font-heading flex items-center gap-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-charcoal/55 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-charcoal/8 bg-cream/40 rounded-b-2xl shrink-0 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
