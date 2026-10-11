import { Bell, LogOut } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useState } from 'react';

interface TopBarProps {
  title: string;
  onNavigate?: (page: string, id?: string) => void;
}

export default function TopBar({ title, onNavigate }: TopBarProps) {
  const { setRole, role, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm leading-tight">{title}</h1>
            <p className="text-[10px] text-gray-400 leading-tight">ALIADO</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            aria-label="Notificaciones"
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="font-bold text-sm text-gray-900">Notificaciones</span>
                  <button onClick={markAllNotificationsRead} className="text-xs text-blue-600 font-semibold">
                    Marcar todo
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">Sin notificaciones</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id); setShowNotif(false);
                        if (!n.targetId) return;
                        onNavigate?.(n.type === 'oportunidad' ? 'detalle-oportunidad' : n.type === 'propuesta' ? 'detalle-solicitud' : role === 'cliente' ? 'detalle-servicio' : 'detalle-servicio-prestador', n.targetId);
                      }}
                      className={`px-4 py-3 border-b border-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <button
          aria-label="Salir"
          onClick={() => setRole(null)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
