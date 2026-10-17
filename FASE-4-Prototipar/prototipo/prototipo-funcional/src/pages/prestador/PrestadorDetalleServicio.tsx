import { useState } from 'react';
import ReportForm from '@/components/ReportForm';
import Modal from '@/components/ui/Modal';
import ServiceCoordination from '@/components/ServiceCoordination';
import { nextStage } from '@/store/rules';
import ServiceHistory from '@/components/ui/ServiceHistory';
import { useApp } from '@/store/AppContext';
import {
  MapPin, Calendar, User, DollarSign, CheckCircle, Play, Star,
  AlertCircle, ChevronRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ServiceStageBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorDetalleServicio({ onNavigate, serviceId }: PrestadorPageProps & { serviceId?: string }) {
  const [showReport, setShowReport] = useState(false);
  const { services, advanceStage, cancelService } = useApp();
  const service = services.find((s) => s.id === serviceId && s.providerId === 'prov-1');

  if (!service) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Servicio no encontrado</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate('servicios')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  const stages = ['CONTRATADO', 'EN_PROCESO', 'TERMINADO', 'FINALIZADO'] as const;
  const currentIdx = stages.findIndex(stage => stage === service.stage);
  const stageIcons = [CheckCircle, Play, CheckCircle, Star] as const;
  const stageLabels = ['Contratado', 'En ejecución', 'Terminado por el prestador', 'Confirmado por el cliente'];
  const handleAdvance = () => advanceStage(service.id);

  return (
    <PageContainer>
      <button onClick={() => onNavigate('servicios')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver a servicios
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
            <div>
              <p className="text-xs text-gray-400">Cliente</p>
              <p className="font-semibold text-gray-900 text-sm">{service.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Fecha y hora</p>
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
              <p className="text-xs text-gray-400">Dirección del cliente</p>
              <p className="font-semibold text-gray-900 text-sm">{service.address}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Visible por contratación</p>
            </div>
          </div>
        </div>
      </Card>

      <ServiceCoordination service={service} />
      <Button variant="danger" className="mb-4" onClick={() => setShowReport(true)}>Reportar problema con el servicio</Button>
      <Modal open={showReport} onClose={() => setShowReport(false)} title="Reportar servicio"><ReportForm targetId={service.id} reportedName={service.clientName} type="Servicio" onDone={() => setShowReport(false)} /></Modal>
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
                <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                  {stageLabels[idx]}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {nextStage(service, 'prestador') && (
        <Button fullWidth onClick={handleAdvance}>
          {service.stage === 'CONTRATADO' ? 'Iniciar servicio' : 'Marcar como terminado'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {service.stage === 'FINALIZADO' && service.rating && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="font-semibold text-gray-900 text-sm mb-1">El cliente calificó tu servicio</p>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= service.rating! ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
          </div>
          {service.reviewComment && <p className="text-sm text-gray-600">"{service.reviewComment}"</p>}
        </Card>
      )}
    </PageContainer>
  );
}
