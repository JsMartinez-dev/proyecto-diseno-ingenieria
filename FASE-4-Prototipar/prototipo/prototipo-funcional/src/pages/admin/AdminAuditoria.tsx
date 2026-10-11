import { useApp } from '@/store/AppContext';
import { ScrollText, Tag, MapPin, Flag, Ban, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import type { AdminPageProps } from '../cliente/types';

export default function AdminAuditoria({ onNavigate: _onNavigate }: AdminPageProps) {
  const { audit } = useApp();

  const getIcon = (action: string) => {
    if (action.includes('suspendió')) return Ban;
    if (action.includes('reporte')) return Flag;
    if (action.includes('categoría')) return Tag;
    if (action.includes('zona')) return MapPin;
    if (action.includes('advirtió')) return AlertCircle;
    return ScrollText;
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Auditoría</h1>
        <p className="text-sm text-gray-500">Registro de acciones administrativas</p>
      </div>

      <Card className="p-5">
        <div className="space-y-0">
          {audit.map((entry, idx) => {
            const Icon = getIcon(entry.action);
            return (
              <div key={entry.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {idx < audit.length - 1 && <div className="w-0.5 h-6 bg-gray-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-semibold text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Objetivo: <span className="font-medium">{entry.target}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{entry.adminName}</span>
                    <span>•</span>
                    <span>{entry.date} {entry.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
