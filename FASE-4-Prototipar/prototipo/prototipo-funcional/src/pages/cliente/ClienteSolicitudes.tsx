import { useApp } from '@/store/AppContext';
import { Plus, MapPin, MessageSquare, FileText } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';

export default function ClienteSolicitudes({ onNavigate }: ClientePageProps) {
  const { requests, currentClient } = useApp();
  const myRequests = requests.filter((r) => r.clientId === currentClient.id);

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Mis solicitudes</h1>
        <Button size="sm" onClick={() => onNavigate('nueva-solicitud')}>
          <Plus className="w-4 h-4" />
          Nueva
        </Button>
      </div>

      {myRequests.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No tienes solicitudes"
          message="Crea tu primera solicitud para recibir propuestas de prestadores cercanos."
          action={<Button onClick={() => onNavigate('nueva-solicitud')}>Publicar una solicitud</Button>}
        />
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => (
            <Card
              key={req.id}
              hover
              onClick={() => onNavigate('detalle-solicitud', req.id)}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-500">{req.category}</p>
                </div>
                <RequestStatusBadge status={req.status} />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{req.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {req.zone}
                </div>
                {req.proposals.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {req.proposals.length} propuesta{req.proposals.length !== 1 ? 's' : ''}
                  </div>
                )}
                <span className="text-gray-400">{req.createdAt}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
