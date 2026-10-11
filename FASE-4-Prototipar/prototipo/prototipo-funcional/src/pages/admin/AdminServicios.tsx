import { useApp } from '@/store/AppContext';
import Card from '@/components/ui/Card';
import { ServiceStageBadge } from '@/components/ui/StatusBadge';
import type { AdminPageProps } from '../cliente/types';

export default function AdminServicios({ onNavigate: _onNavigate }: AdminPageProps) {
  const { services } = useApp();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Servicios</h1>
        <p className="text-sm text-gray-500">Todos los servicios contratados</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Prestador</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{svc.category}</td>
                  <td className="px-4 py-3 text-gray-500">{svc.clientName}</td>
                  <td className="px-4 py-3 text-gray-500">{svc.providerName}</td>
                  <td className="px-4 py-3 text-gray-500">{svc.date}</td>
                  <td className="px-4 py-3 text-gray-500">${svc.price.toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3">
                    <ServiceStageBadge stage={svc.stage} />
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
