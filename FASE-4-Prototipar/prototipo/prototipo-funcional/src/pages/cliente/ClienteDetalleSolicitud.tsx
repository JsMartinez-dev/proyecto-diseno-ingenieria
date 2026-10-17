import { useApp } from '@/store/AppContext';
import { MapPin, Calendar, Clock, MessageSquare, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';

export default function ClienteDetalleSolicitud({ onNavigate, requestId }: ClientePageProps & { requestId?: string }) {
  const { requests, providers, currentClient, cancelRequest, acceptProposal, addToast } = useApp();
  const req = requests.find((r) => r.id === requestId && r.clientId === currentClient.id);

  if (!req) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Solicitud no encontrada</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate('solicitudes')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  const handleAccept = (proposalId: string, providerName: string) => {
    if (!acceptProposal(req.id, proposalId)) return;
    addToast(`Prestador seleccionado: ${providerName}`, 'success');
    onNavigate('solicitudes');
  };

  return (
    <PageContainer>
      <button onClick={() => onNavigate('solicitudes')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver a solicitudes
      </button>

      <Card className="p-5 mb-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{req.title}</h1>
            <p className="text-sm text-gray-500">{req.category}</p>
          </div>
          <RequestStatusBadge status={req.status} />
        </div>
        <p className="text-sm text-gray-600 mb-4">{req.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-gray-500 font-medium">Ubicación aproximada:</span> {req.zone}, Santa Marta
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {req.preferredDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {req.preferredTime}
          </div>
          <Badge color={req.urgency === 'Urgente' ? 'red' : req.urgency === 'Alta' ? 'amber' : 'blue'} size="sm">
            {req.urgency}
          </Badge>
        </div>
      </Card>

      {['BORRADOR', 'PUBLICADA'].includes(req.status) && <Button variant="secondary" className="mb-3" onClick={() => onNavigate('nueva-solicitud', req.id)}>Editar solicitud</Button>}
      {req.photo && <img src={req.photo} alt="Foto del problema" className="max-h-64 rounded-xl mb-4" />}
      {['BORRADOR', 'PUBLICADA', 'CON_PROPUESTAS'].includes(req.status) && <Button variant="danger" className="mb-4" onClick={() => {
        if (window.confirm('¿Cancelar esta solicitud y cerrar sus propuestas?')) cancelRequest(req.id);
      }}>Cancelar solicitud</Button>}
      <h2 className="font-bold text-gray-900 mb-3">
        Propuestas recibidas {req.proposals.length > 0 && `(${req.proposals.length})`}
      </h2>

      {req.proposals.length === 0 ? (
        <Card className="p-6 text-center">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Aún no hay propuestas. Los prestadores verán tu solicitud pronto.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {req.proposals.map((prop) => {
            const provider = providers.find((p) => p.id === prop.providerId);
            return (
              <Card key={prop.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full ${provider?.avatarColor || 'bg-gray-500'} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {prop.providerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{prop.providerName}</p>
                      {provider?.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={prop.providerRating} size={14} />
                      <span className="text-xs text-gray-500">{prop.providerJobs} trabajos</span>
                    </div>
                  </div>
                  {prop.status === 'aceptada' && <Badge color="green">Aceptada</Badge>}
                  {prop.status === 'retirada' && <Badge color="gray">Retirada</Badge>}
                  {prop.status === 'cerrada' && <Badge color="gray">Cerrada</Badge>}
                  {prop.status === 'rechazada' && <Badge color="gray">Rechazada</Badge>}
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Precio estimado</span>
                    <span className="text-lg font-bold text-gray-900">${prop.price.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {prop.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prop.time}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3 mb-3">
                  <p className="text-sm text-gray-700">{prop.message}</p>
                </div>

                {prop.status === 'pendiente' && ['PUBLICADA', 'CON_PROPUESTAS'].includes(req.status) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      fullWidth
                      onClick={() => onNavigate('perfil-prestador', prop.providerId)}
                    >
                      Ver perfil
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => handleAccept(prop.id, prop.providerName)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aceptar propuesta
                    </Button>
                  </div>
                )}
                {prop.status === 'pendiente' && req.status === 'CONTRATADA' && (
                  <Button size="sm" variant="secondary" fullWidth onClick={() => onNavigate('perfil-prestador', prop.providerId)}>
                    Ver perfil
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {req.serviceId && (
        <Button fullWidth className="mt-4" onClick={() => onNavigate('detalle-servicio', req.serviceId)}>
          Ver detalle del servicio
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </PageContainer>
  );
}
