import { useApp } from '@/store/AppContext';
import { Calendar, DollarSign, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import { ServiceStageBadge } from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorServicios({ onNavigate }: PrestadorPageProps) {
  const { services } = useApp();
  const myServices = services.filter((s) => s.providerId === 'prov-1');
  const active = myServices.filter((s) => !['FINALIZADO', 'CANCELADO'].includes(s.stage));
  const completed = myServices.filter((s) => s.stage === 'FINALIZADO');

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Servicios</h1>

      {active.length > 0 && (
        <>
          <h2 className="font-semibold text-gray-700 text-sm mb-3">Servicios activos</h2>
          <div className="space-y-3 mb-6">
            {active.map((svc) => (
              <Card key={svc.id} hover onClick={() => onNavigate('detalle-servicio-prestador', svc.id)} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{svc.category}</p>
                    <p className="text-xs text-gray-500">Cliente: {svc.clientName}</p>
                  </div>
                  <ServiceStageBadge stage={svc.stage} />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {svc.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${svc.price.toLocaleString('es-CO')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="font-semibold text-gray-700 text-sm mb-3">Servicios completados</h2>
      {completed.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="Sin servicios completados"
          message="Tus servicios finalizados aparecerán aquí."
        />
      ) : (
        <div className="space-y-3">
          {completed.map((svc) => (
            <Card key={svc.id} hover onClick={() => onNavigate('detalle-servicio-prestador', svc.id)} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{svc.category}</p>
                  <p className="text-xs text-gray-500">Cliente: {svc.clientName}</p>
                </div>
                <ServiceStageBadge stage={svc.stage} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {svc.date}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${svc.price.toLocaleString('es-CO')}
                </div>
                {svc.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    {svc.rating}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
