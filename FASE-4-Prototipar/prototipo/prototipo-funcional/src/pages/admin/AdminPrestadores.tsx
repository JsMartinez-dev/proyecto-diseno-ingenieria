import Verification from '@/components/Verification';
import ProviderCatalog from '@/components/ProviderCatalog';
import Modal from '@/components/ui/Modal';
import type { Provider } from '@/types';
import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Search, Star, CheckCircle, Ban } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { AdminPageProps } from '../cliente/types';

export default function AdminPrestadores({ onNavigate: _onNavigate }: AdminPageProps) {
  const { providers, addToast, suspendUser } = useApp();
  const [selected, setSelected] = useState<Provider | null>(null);
  const [search, setSearch] = useState('');

  const filtered = providers.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Prestadores</h1>
        <p className="text-sm text-gray-500">Trabajadores independientes registrados</p>
      </div>

      <Verification admin />
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar prestador o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full ${p.avatarColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {p.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{p.name}</p>
                  {p.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-xs text-gray-500">{p.specialty} • {p.experienceYears} años</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-700">{p.rating}</span>
              </div>
              <span className="text-gray-400">{p.jobsCompleted} trabajos</span>
              <Badge color={p.available ? 'green' : 'gray'} size="sm">
                {p.suspended ? 'Suspendido' : p.available ? 'Disponible' : 'No disponible'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" fullWidth onClick={() => setSelected(p)}>
                Ver perfil
              </Button>
              <Button aria-label={`Suspender cuenta de ${p.name}`} size="sm" variant="danger" disabled={p.suspended} onClick={() => { const reason = window.prompt('Motivo de la suspensión'); if (!reason?.trim()) return; suspendUser(p.name, reason); addToast(`${p.name} suspendido`, 'success'); }}>
                <Ban className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Perfil profesional">
        {selected && <div className="space-y-3"><h2 className="font-bold">{selected.name}</h2><p>{selected.bio}</p><ProviderCatalog provider={selected} /><p>Zonas: {selected.zones.join(', ')}</p><p>Disponibilidad: {selected.available ? 'Disponible' : 'No disponible'}</p><p>Verificación de ejemplo: {selected.verified ? 'Verificado' : 'Sin verificar'}</p></div>}
      </Modal>
    </div>
  );
}
