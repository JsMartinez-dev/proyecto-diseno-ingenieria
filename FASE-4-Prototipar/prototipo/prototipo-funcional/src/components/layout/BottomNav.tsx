import { Home, Search, FileText, Clock, User } from 'lucide-react';
import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
}

export default function BottomNav({ items, active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => (
          <button
            key={item.id}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
              active === item.id ? 'text-blue-700' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export const clienteNavItems: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { id: 'buscar', label: 'Buscar', icon: <Search className="w-5 h-5" /> },
  { id: 'solicitudes', label: 'Solicitudes', icon: <FileText className="w-5 h-5" /> },
  { id: 'historial', label: 'Historial', icon: <Clock className="w-5 h-5" /> },
  { id: 'perfil', label: 'Perfil', icon: <User className="w-5 h-5" /> },
];

export const prestadorNavItems: NavItem[] = [
  { id: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { id: 'oportunidades', label: 'Oportunidades', icon: <Search className="w-5 h-5" /> },
  { id: 'servicios', label: 'Servicios', icon: <FileText className="w-5 h-5" /> },
  { id: 'historial', label: 'Historial', icon: <Clock className="w-5 h-5" /> },
  { id: 'perfil', label: 'Perfil', icon: <User className="w-5 h-5" /> },
];
