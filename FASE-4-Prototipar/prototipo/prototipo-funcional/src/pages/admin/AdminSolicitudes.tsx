import { useApp } from '@/store/AppContext';
import Card from '@/components/ui/Card';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import type { AdminPageProps } from '../cliente/types';

export default function AdminSolicitudes({ onNavigate: _onNavigate }: AdminPageProps) {
  const { requests } = useApp();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Solicitudes</h1>
        <p className="text-sm text-gray-500">Todas las solicitudes de la plataforma</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium">Propuestas</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{req.title}</td>
                  <td className="px-4 py-3 text-gray-500">{req.category}</td>
                  <td className="px-4 py-3 text-gray-500">{req.clientName}</td>
                  <td className="px-4 py-3 text-gray-500">{req.zone}</td>
                  <td className="px-4 py-3 text-gray-500">{req.proposals.length}</td>
                  <td className="px-4 py-3">
                    <RequestStatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
