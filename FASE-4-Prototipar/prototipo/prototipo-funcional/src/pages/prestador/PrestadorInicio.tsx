import { isCompatible } from '@/store/rules';
import { useApp } from '@/store/AppContext';
import { Search, FileText, Briefcase, Star, MapPin, ChevronRight, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorInicio({ onNavigate }: PrestadorPageProps) {
  const { requests, providers, categories, zones, services } = useApp();
  const provider = providers.find((p) => p.id === 'prov-1')!;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const availableOpportunities = requests.filter(
    (r) => isCompatible(r, provider, categories, zones)
  );
  const sentProposals = requests.filter((r) =>
    r.proposals.some((p) => p.providerId === 'prov-1')
  );
  const activeServices = services.filter(
    (s) => s.providerId === 'prov-1' && !['FINALIZADO', 'CANCELADO'].includes(s.stage)
  );

  const nearbyOpportunities = availableOpportunities.slice(0, 3);

  return (
    <PageContainer>
      <p className="text-sm text-gray-400">{greeting},</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{provider.name}</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-400">Oportunidades</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{availableOpportunities.length}</p>
          <p className="text-xs text-gray-400">disponibles</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-teal-600" />
            <span className="text-xs text-gray-400">Propuestas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{sentProposals.length}</p>
          <p className="text-xs text-gray-400">enviadas</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-400">Servicios</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeServices.length}</p>
          <p className="text-xs text-gray-400">activos</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs text-gray-400">Calificación</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{provider.rating}</p>
          <p className="text-xs text-gray-400">{provider.jobsCompleted} trabajos</p>
        </Card>
      </div>

      <h2 className="font-bold text-gray-900 mb-3">Oportunidades cerca de ti</h2>
      <div className="space-y-3">
        {nearbyOpportunities.map((req) => (
          <Card key={req.id} hover onClick={() => onNavigate('detalle-oportunidad', req.id)} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <p className="font-bold text-gray-900">{req.title}</p>
                <p className="text-xs text-gray-500">{req.category}</p>
              </div>
              <RequestStatusBadge status={req.status} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {req.zone}
              </div>
              <Badge color="blue" size="sm">Zona compatible</Badge>
              <span>Hoy</span>
            </div>
          </Card>
        ))}
      </div>

      <Button fullWidth className="mt-4" onClick={() => onNavigate('oportunidades')}>
        Ver todas las oportunidades
        <ChevronRight className="w-4 h-4" />
      </Button>

      <Card className="p-4 mt-4 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Mi progreso de formalización</p>
            <p className="text-xs text-gray-500">Completa tu ruta hacia la formalización</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => onNavigate('progreso')}>
            Ver
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
