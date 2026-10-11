import { useApp } from '@/store/AppContext';
import { Plus, Star, MapPin, ChevronRight, Wrench } from 'lucide-react';
import * as Icons from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';

export default function ClienteInicio({ onNavigate }: ClientePageProps) {
  const { currentClient, providers, requests, categories: cats } = useApp();

  const recommendedProviders = providers.filter((p) => p.available).slice(0, 3);
  const myActiveRequests = requests.filter(
    (r) => r.clientId === currentClient.id && r.status !== 'FINALIZADA' && r.status !== 'CANCELADA'
  );

  return (
    <PageContainer>
      <div className="mb-6">
        <p className="text-sm text-gray-400">Hola,</p>
        <h1 className="text-2xl font-bold text-gray-900">{currentClient.name}</h1>
        <p className="text-gray-500 mt-2">¿Qué servicio necesitas hoy?</p>
      </div>

      <Button size="lg" fullWidth onClick={() => onNavigate('nueva-solicitud')}>
        <Plus className="w-5 h-5" />
        Publicar una solicitud
      </Button>

      <h2 className="font-bold text-gray-900 mt-8 mb-3">Categorías</h2>
      <div className="grid grid-cols-3 gap-3">
        {cats.map((cat) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[cat.icon] || Wrench;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate('buscar')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <h2 className="font-bold text-gray-900 mt-8 mb-3">Prestadores recomendados</h2>
      <div className="space-y-3">
        {recommendedProviders.map((p) => (
          <Card
            key={p.id}
            hover
            onClick={() => onNavigate('perfil-prestador', p.id)}
            className="p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${p.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 truncate">{p.name}</p>
                  {p.verified && <Badge color="green" size="sm">Verificado</Badge>}
                </div>
                <p className="text-xs text-gray-500">{p.specialty}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">{p.jobsCompleted} trabajos</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">{p.zone}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {myActiveRequests.length > 0 && (
        <>
          <h2 className="font-bold text-gray-900 mt-8 mb-3">Solicitudes activas</h2>
          <div className="space-y-3">
            {myActiveRequests.map((req) => (
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
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {req.zone}
                  </div>
                  {req.proposals.length > 0 && (
                    <Badge color="amber" size="sm">{req.proposals.length} propuestas</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
