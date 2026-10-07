import React from 'react';
import { useToast } from '../../context/ToastContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-stone-200 bg-white';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;

        if (toast.type === 'error') {
          borderClass = 'border-amber-200 bg-[#FFFDFB]';
          icon = <AlertCircle className="w-5 h-5 text-[#C85A32] flex-shrink-0" />;
        } else if (toast.type === 'info') {
          borderClass = 'border-stone-200 bg-[#FDFBF7]';
          icon = <Info className="w-5 h-5 text-stone-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform duration-200 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium text-[#2B1E16] leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
