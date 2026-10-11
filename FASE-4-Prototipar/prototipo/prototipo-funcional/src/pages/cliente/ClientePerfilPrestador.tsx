import ProviderCatalog from '@/components/ProviderCatalog';
import { useApp } from '@/store/AppContext';
import { MapPin, CheckCircle, Briefcase, Clock, AlertCircle, Flag } from 'lucide-react';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';
import type { ReportReason } from '@/types';

export default function ClientePerfilPrestador({ onNavigate, providerId }: ClientePageProps & { providerId?: string }) {
  const { providers, createReport, addToast } = useApp();
  const provider = providers.find((p) => p.id === providerId && !p.suspended);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>('Comportamiento inapropiado');
  const [reportDesc, setReportDesc] = useState('');

  if (!provider) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Prestador no encontrado</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate('buscar')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  const handleReport = () => {
    createReport({
      reporterName: 'Patricia Mercado',
      reportedName: provider.name,
      reason: reportReason,
      description: reportDesc || `Reporte de ${reportReason}`,
      type: 'Usuario',
    });
    addToast('Reporte enviado. El equipo lo revisará pronto.', 'success');
    setShowReport(false);
    setReportDesc('');
  };

  return (
    <PageContainer>
      <button onClick={() => onNavigate('buscar')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver
      </button>

      <Card className="p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${provider.avatarColor} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
            {provider.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{provider.name}</h1>
              {provider.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-sm text-gray-500">{provider.specialty}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={provider.rating} size={14} showNumber />
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{provider.jobsCompleted} servicios realizados</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{provider.bio}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-xs">Experiencia</span>
            </div>
            <p className="font-bold text-gray-900">{provider.experienceYears} años</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">Ubicación</span>
            </div>
            <p className="font-bold text-gray-900 text-sm">{provider.zone}, Santa Marta</p>
            <p className="text-[10px] text-gray-400">Ubicación aproximada</p>
          </div>
        </div>

        <ProviderCatalog provider={provider} />

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Zonas donde trabaja</p>
          <div className="flex flex-wrap gap-2">
            {provider.zones.map((z) => (
              <Badge key={z} color="gray">
                <MapPin className="w-3 h-3" />
                {z}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge color={provider.available ? 'green' : 'gray'}>
            <Clock className="w-3 h-3" />
            {provider.available ? 'Disponible ahora' : 'No disponible'}
          </Badge>
        </div>

        <Button variant="danger" size="sm" fullWidth onClick={() => setShowReport(true)}>
          <Flag className="w-4 h-4" />
          Reportar a este prestador
        </Button>
      </Card>

      <h2 className="font-bold text-gray-900 mb-3">Reseñas ({provider.reviews.length})</h2>
      <div className="space-y-3">
        {provider.reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <StarRating rating={review.rating} size={14} />
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
          </Card>
        ))}
      </div>

      <Modal open={showReport} onClose={() => setShowReport(false)} title="Reportar prestador" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Reportando a <span className="font-semibold text-gray-700">{provider.name}</span></p>
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
              placeholder="Cuenta qué ocurrió..."
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
