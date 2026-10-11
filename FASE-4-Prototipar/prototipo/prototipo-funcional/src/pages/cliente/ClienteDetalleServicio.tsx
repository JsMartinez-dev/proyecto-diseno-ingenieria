import ServiceHistory from '@/components/ui/ServiceHistory';
import { useApp } from '@/store/AppContext';
import {
  MapPin, Calendar, User, Wrench, DollarSign,
  CheckCircle, Play, Flag, Star, AlertCircle, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { ServiceStageBadge } from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';
import type { ReportReason } from '@/types';

export default function ClienteDetalleServicio({ onNavigate, serviceId }: ClientePageProps & { serviceId?: string }) {
  const { services, providers, currentClient, advanceStage, cancelService, rateService, createReport, addToast } = useApp();
  const service = services.find((s) => s.id === serviceId && s.clientId === currentClient.id);
  const [showRating, setShowRating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [punctuality, setPunctuality] = useState(5);
  const [quality, setQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [reportReason, setReportReason] = useState<ReportReason>('Incumplimiento');
  const [reportDesc, setReportDesc] = useState('');

  if (!service) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Servicio no encontrado</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate('historial')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  const provider = providers.find((p) => p.id === service.providerId);
  const stages = ['CONTRATADO', 'EN_PROCESO', 'TERMINADO', 'FINALIZADO'] as const;
  const currentIdx = stages.findIndex(stage => stage === service.stage);
  const stageIcons = [CheckCircle, Play, CheckCircle, Star] as const;
  const stageLabels = ['Contratado', 'En ejecución', 'Terminado por el prestador', 'Confirmado por el cliente'];

  const handleRate = () => {
    if (!rateService(service.id, rating, comment, punctuality, quality, communication)) return;
    addToast('Reseña publicada correctamente', 'success');
    setShowRating(false);
  };

  const handleReport = () => {
    createReport({
      reporterName: service.clientName,
      reportedName: service.providerName,
      reason: reportReason,
      description: reportDesc || `Reporte de ${reportReason}`,
      type: 'Servicio',
    });
    addToast('Reporte enviado', 'success');
    setShowReport(false);
    setReportDesc('');
  };



  return (
    <PageContainer>
      <button onClick={() => onNavigate('historial')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver
      </button>

      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Detalle del servicio</h1>
          <ServiceStageBadge stage={service.stage} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Cliente</p>
              <p className="font-semibold text-gray-900 text-sm">{service.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400">Prestador</p>
              <p className="font-semibold text-gray-900 text-sm">{service.providerName}</p>
            </div>
            {provider && (
              <Button size="sm" variant="ghost" onClick={() => onNavigate('perfil-prestador', provider.id)}>
                Ver perfil
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Categoría</p>
              <p className="font-semibold text-gray-900 text-sm">{service.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Fecha</p>
              <p className="font-semibold text-gray-900 text-sm">{service.date} - {service.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Precio acordado</p>
              <p className="font-semibold text-gray-900 text-sm">${service.price.toLocaleString('es-CO')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Dirección</p>
              <p className="font-semibold text-gray-900 text-sm">{service.address}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Visible solo después de la contratación</p>
            </div>
          </div>
        </div>
      </Card>

      <ServiceHistory service={service} />
      {!['FINALIZADO', 'CANCELADO'].includes(service.stage) && (
        <Button variant="danger" fullWidth className="mb-4" onClick={() => {
          if (window.confirm('¿Cancelar este servicio? Esta acción cierra el servicio.')) cancelService(service.id);
        }}>Cancelar servicio</Button>
      )}
      {service.stage === 'TERMINADO' && <p className="text-sm text-blue-700 mb-4">El prestador terminó el trabajo. Falta la confirmación del cliente.</p>}
      {/* Timeline */}
      <Card className="p-5 mb-4">
        <h2 className="font-bold text-gray-900 mb-4">Estado del servicio</h2>
        <div className="space-y-0">
          {stages.map((stage, idx) => {
            const Icon = stageIcons[idx];
            const isDone = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={stage} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'
                    } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`w-0.5 h-8 ${idx < currentIdx ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                    {stageLabels[idx]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actions */}
      {service.stage === 'FINALIZADO' && !service.rating && (
        <Card className="p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-1">¿Cómo fue tu experiencia?</h2>
          <p className="text-sm text-gray-500 mb-4">Tu calificación ayuda a otros clientes a elegir mejor.</p>
          <Button fullWidth onClick={() => setShowRating(true)}>
            <Star className="w-4 h-4" />
            Calificar al prestador
          </Button>
        </Card>
      )}

      {service.stage === 'FINALIZADO' && service.rating && (
        <Card className="p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-gray-900">Tu calificación</p>
            <StarRating rating={service.rating} size={16} />
          </div>
          {service.reviewComment && <p className="text-sm text-gray-600">{service.reviewComment}</p>}
        </Card>
      )}

      {service.stage === 'TERMINADO' && (
        <Button fullWidth className="mb-3" onClick={() => advanceStage(service.id)}>
          Confirmar finalización
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      <Button variant="danger" size="sm" fullWidth onClick={() => setShowReport(true)}>
        <Flag className="w-4 h-4" />
        Reportar un problema
      </Button>

      {/* Rating Modal */}
      <Modal open={showRating} onClose={() => setShowRating(false)} title="Calificar servicio" size="sm">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">¿Cómo calificarías a {service.providerName}?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}>
                  <Star className={`w-8 h-8 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} hover:scale-110 transition-transform`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm resize-none"
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Califica estos aspectos:</p>
            {[
              { label: 'Puntualidad', value: punctuality, set: setPunctuality },
              { label: 'Calidad del trabajo', value: quality, set: setQuality },
              { label: 'Comunicación', value: communication, set: setCommunication },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <StarRating rating={item.value} size={18} interactive onChange={item.set} />
              </div>
            ))}
          </div>
          <Button fullWidth onClick={handleRate}>Publicar reseña</Button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal open={showReport} onClose={() => setShowReport(false)} title="Reportar problema" size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Motivo</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as ReportReason)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
            >
              <option>Comportamiento inapropiado</option>
              <option>Incumplimiento</option>
              <option>Posible fraude</option>
              <option>Información falsa</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Descripción</label>
            <textarea
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Describe el problema..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setShowReport(false)}>Cancelar</Button>
            <Button variant="danger" fullWidth onClick={handleReport}>Enviar reporte</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
