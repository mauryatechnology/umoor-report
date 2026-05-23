'use client';

import Dialog from './Dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning'
  isLoading = false,
}) {
  const isDanger = variant === 'danger';

  return (
    <Dialog open={open} onClose={onClose} size="sm" title={title}>
      <div className="flex flex-col items-center text-center py-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            isDanger
              ? 'bg-red-100 text-red-600'
              : 'bg-amber-100 text-amber-600'
          }`}
        >
          {isDanger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
        </div>
        <p className="text-charcoal/70 text-sm leading-relaxed max-w-xs">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-charcoal/70 bg-charcoal/5 hover:bg-charcoal/10 transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2 ${
            isDanger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-amber-600 hover:bg-amber-700'
          } disabled:opacity-60`}
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
