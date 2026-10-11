import { useState } from 'react';
import { isCompatible } from '@/store/rules';
import { useApp } from '@/store/AppContext';
import { MapPin, Search } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { RequestStatusBadge } from '@/components/ui/StatusBadge';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorOportunidades({ onNavigate }: PrestadorPageProps) {
  const { requests, providers, categories, zones } = useApp();
  const provider = providers.find(p => p.id === 'prov-1')!;
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const opportunities = requests.filter(
    (r) => isCompatible(r, provider, categories, zones) && (!category || r.category === category) && (!urgency || r.urgency === urgency)
  );

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Oportunidades</h1>

      <div className="flex gap-3 mb-4">
        <select aria-label="Filtrar categoría" value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded-xl"><option value="">Todas las categorías compatibles</option>{categories.filter(c => c.active && provider.categoryIds.includes(c.id)).map(c => c.name).map(c => <option key={c}>{c}</option>)}</select>
        <select aria-label="Filtrar urgencia" value={urgency} onChange={e => setUrgency(e.target.value)} className="p-2 border rounded-xl"><option value="">Toda urgencia</option>{['Baja','Normal','Alta','Urgente'].map(u => <option key={u}>{u}</option>)}</select>
      </div>
      {opportunities.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No hay oportunidades"
          message="Cuando los clientes publiquen solicitudes cercanas, aparecerán aquí."
        />
      ) : (
        <div className="space-y-3">
          {opportunities.map((req) => {
            const hasProposal = req.proposals.some((p) => p.providerId === 'prov-1');
            return (
              <Card key={req.id} hover onClick={() => onNavigate('detalle-oportunidad', req.id)} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{req.title}</p>
                    <p className="text-xs text-gray-500">{req.category}</p>
                  </div>
                  <RequestStatusBadge status={req.status} />
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{req.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {req.zone}
                  </div>
                  <Badge color="blue" size="sm">Zona compatible</Badge>
                  <span>{req.createdAt}</span>
                </div>
                {hasProposal && (
                  <div className="mt-2">
                    <Badge color="green" size="sm">Ya enviaste una propuesta</Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
