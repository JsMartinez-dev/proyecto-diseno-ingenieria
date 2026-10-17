import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-[60] flex flex-col gap-3 sm:w-96 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'info' ? Info : AlertCircle;
        const color = toast.type === 'success' ? 'text-green-600' : toast.type === 'info' ? 'text-blue-600' : 'text-red-600';
        const bg = toast.type === 'success' ? 'border-green-200' : toast.type === 'info' ? 'border-blue-200' : 'border-red-200';
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={`flex items-start gap-3 bg-white rounded-xl shadow-lg border ${bg} px-4 py-3 animate-slide-in`}
          >
            <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
            <p className="text-sm font-medium text-gray-800 flex-1 min-w-0 break-words">{toast.message}</p>
            <button aria-label="Cerrar aviso" onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
