import { useApp } from '@/store/AppContext';
import { adminStats, monthlyData } from '@/data/mockData';
import { Users, Wrench, Briefcase, FileText, Flag, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { AdminPageProps } from '../cliente/types';

export default function AdminDashboard({ onNavigate }: AdminPageProps) {
  const { reports } = useApp();
  const pendingReports = reports.filter((r) => r.status === 'PENDIENTE').length;
  const stats = { ...adminStats, pendingReports };

  const cards = [
    { label: 'Usuarios registrados', value: stats.clients, icon: Users, color: 'bg-blue-600' },
    { label: 'Prestadores', value: stats.providers, icon: Wrench, color: 'bg-teal-600' },
    { label: 'Servicios realizados', value: stats.servicesCompleted, icon: Briefcase, color: 'bg-green-600' },
    { label: 'Solicitudes abiertas', value: stats.openRequests, icon: FileText, color: 'bg-amber-600' },
    { label: 'Reportes pendientes', value: stats.pendingReports, icon: Flag, color: 'bg-red-600' },
  ];

  const maxServices = Math.max(...monthlyData.map((d) => d.services));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-5">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-white mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Servicios por mes</h2>
          </div>
          <div className="flex items-end justify-between gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(d.services / maxServices) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Solicitudes por mes</h2>
            <Badge color="blue">2026</Badge>
          </div>
          <div className="space-y-3">
            {monthlyData.map((d) => (
              <div key={d.month}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">{d.month}</span>
                  <span className="font-semibold text-gray-700">{d.requests}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                    style={{ width: `${(d.requests / 70) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Reportes recientes</h2>
          <button onClick={() => onNavigate('reportes')} className="text-sm text-blue-600 font-medium">
            Ver todos
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Usuario</th>
                <th className="pb-2 font-medium">Tipo</th>
                <th className="pb-2 font-medium">Fecha</th>
                <th className="pb-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 4).map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gray-900">{r.reportedName}</td>
                  <td className="py-3 text-gray-500">{r.type}</td>
                  <td className="py-3 text-gray-500">{r.date}</td>
                  <td className="py-3">
                    <Badge color={r.status === 'PENDIENTE' ? 'red' : r.status === 'EN_REVISION' ? 'amber' : 'green'} size="sm">
                      {r.status === 'PENDIENTE' ? 'Pendiente' : r.status === 'EN_REVISION' ? 'En revisión' : 'Resuelto'}
                    </Badge>
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
