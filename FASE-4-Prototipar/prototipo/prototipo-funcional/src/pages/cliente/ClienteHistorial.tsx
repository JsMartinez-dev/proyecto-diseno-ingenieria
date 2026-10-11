import HistoryExport from '@/components/ui/HistoryExport';
import { useApp } from '@/store/AppContext';
import { Calendar, DollarSign, Clock, Briefcase } from 'lucide-react';
import Card from '@/components/ui/Card';
import StarRating from '@/components/ui/StarRating';
import { ServiceStageBadge } from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';

export default function ClienteHistorial({ onNavigate }: ClientePageProps) {
  const { services, currentClient } = useApp();
  const myServices = services.filter((s) => s.clientId === currentClient.id);

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Historial de servicios</h1>

      <HistoryExport services={myServices} />
      {myServices.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="Sin servicios contratados"
          message="Aquí aparecerán los servicios que contrates a través de la plataforma."
        />
      ) : (
        <div className="space-y-3">
          {myServices.map((svc) => (
            <Card key={svc.id} hover onClick={() => onNavigate('detalle-servicio', svc.id)} className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{svc.category}</p>
                  <p className="text-xs text-gray-500">Prestador: {svc.providerName}</p>
                </div>
                <ServiceStageBadge stage={svc.stage} />
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {svc.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {svc.time}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${svc.price.toLocaleString('es-CO')}
                </div>
              </div>
              {svc.rating && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <StarRating rating={svc.rating} size={14} />
                  <span className="text-xs text-gray-500 truncate">{svc.reviewComment}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
