import {
  LayoutDashboard,
  Users,
  Wrench,
  FileText,
  Briefcase,
  Flag,
  Tag,
  MapPin,
  ScrollText,
  LogOut,
  Info,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useApp } from '@/store/AppContext';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface AdminSidebarProps {
  active: string;
  onNavigate: (page: string) => void;
}

export const adminNavItems: AdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'usuarios', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
  { id: 'prestadores', label: 'Prestadores', icon: <Wrench className="w-5 h-5" /> },
  { id: 'solicitudes', label: 'Solicitudes', icon: <FileText className="w-5 h-5" /> },
  { id: 'servicios', label: 'Servicios', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'reportes', label: 'Reportes', icon: <Flag className="w-5 h-5" /> },
  { id: 'categorias', label: 'Categorías', icon: <Tag className="w-5 h-5" /> },
  { id: 'zonas', label: 'Zonas', icon: <MapPin className="w-5 h-5" /> },
  { id: 'auditoria', label: 'Auditoría', icon: <ScrollText className="w-5 h-5" /> },
  { id: 'acerca', label: 'Acerca de', icon: <Info className="w-5 h-5" /> },
];

export default function AdminSidebar({ active, onNavigate }: AdminSidebarProps) {
  const { setRole } = useApp();
  const activeItem = adminNavItems.find((i) => i.id === active);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-900 font-bold">
              A
            </div>
            <div>
              <p className="font-bold text-sm">ALIADO</p>
              <p className="text-[10px] text-blue-300">Panel administrativo</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {adminNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${
                active === item.id
                  ? 'bg-blue-800 text-white border-l-4 border-blue-400'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-blue-800">
          <button
            onClick={() => setRole(null)}
            className="w-full flex items-center gap-3 px-2 py-2.5 text-sm font-medium text-blue-200 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="md:hidden sticky top-0 z-30 bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-900 font-bold text-xs">
            A
          </div>
          <span className="font-bold text-sm">ALIADO Admin</span>
        </div>
        <button onClick={() => setRole(null)} className="p-2">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 overflow-x-auto">
        <div className="flex items-center gap-1 px-2 py-2 min-w-max">
          {adminNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active === item.id ? 'text-blue-700' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {activeItem && (
        <div className="hidden md:block px-8 py-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{activeItem.label}</h1>
        </div>
      )}
    </>
  );
}
