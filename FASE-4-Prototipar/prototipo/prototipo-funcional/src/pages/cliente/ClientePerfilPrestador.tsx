import ProfessionalDetails from '@/components/ProfessionalDetails';
import ReportForm from '@/components/ReportForm';
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

export default function ClientePerfilPrestador({ onNavigate, providerId, preview = false }: ClientePageProps & { providerId?: string; preview?: boolean }) {
  const { providers, role, preferences } = useApp();
  const provider = providers.find((p) => p.id === providerId && !p.suspended);
  const [showReport, setShowReport] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<string>();

  if (!provider) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Prestador no encontrado</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate(preview ? 'perfil' : 'buscar')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button onClick={() => onNavigate(preview ? 'perfil' : 'buscar')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver
      </button>

      {preview && <p className="bg-blue-50 p-3 rounded-xl text-sm mb-4">Vista previa del perfil público.{!preferences.profileVisible && ' Tu perfil está oculto del catálogo.'}</p>}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${provider.avatarColor} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
            {preview && !preferences.publicName ? 'P' : provider.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{preview && !preferences.publicName ? 'Prestador de ALIADO' : provider.name}</h1>
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

        {role === 'cliente' && <Button variant="danger" size="sm" fullWidth onClick={() => { setReviewTarget(undefined); setShowReport(true); }}>
          <Flag className="w-4 h-4" />
          Reportar a este prestador
        </Button>}
      </Card>

      <ProfessionalDetails provider={provider} />
      <p className="text-xs text-gray-500 mb-4">{provider.verified ? 'Verificación ampliada de ejemplo: documentación revisada en la demo.' : 'Nivel básico: información declarada, sin revisión documental ampliada.'} No certifica estado legal ni calidad del servicio.</p>
      <h2 className="font-bold text-gray-900 mb-3">Reseñas ({provider.reviews.length})</h2>
      <div className="space-y-3">
        {provider.reviews.filter(review => !review.hidden).map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <StarRating rating={review.rating} size={14} />
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            {role === 'cliente' && <button className="text-sm text-red-700 mt-2 underline" onClick={() => { setReviewTarget(review.id); setShowReport(true); }}>Reportar esta reseña</button>}
          </Card>
        ))}
      </div>

      <Modal open={showReport} onClose={() => setShowReport(false)} title="Reportar prestador" size="sm">
        <ReportForm key={reviewTarget || provider.id} targetId={reviewTarget || provider.id} reportedName={provider.name} type={reviewTarget ? 'Contenido' : 'Usuario'} onDone={() => setShowReport(false)} />
      </Modal>
    </PageContainer>
  );
}
