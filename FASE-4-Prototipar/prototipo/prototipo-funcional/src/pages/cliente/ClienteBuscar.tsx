import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Star, MapPin, Search, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PageContainer from '@/components/layout/PageContainer';
import EmptyState from '@/components/ui/EmptyState';
import type { ClientePageProps } from './types';

export default function ClienteBuscar({ onNavigate }: ClientePageProps) {
  const { providers, zones, categories } = useApp();
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filtered = providers.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchZone = !zoneFilter || p.zones.includes(zoneFilter);
    const matchCat = !catFilter || p.categoryIds.some(id => categories.some(c => c.id === id && c.name === catFilter));
    return !p.suspended && matchSearch && matchZone && matchCat;
  });

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Buscar prestadores</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Nombre o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setZoneFilter('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${!zoneFilter ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Todas las zonas
        </button>
        {zones.filter(z => z.active).map((z) => (
          <button
            key={z.id}
            onClick={() => setZoneFilter(zoneFilter === z.name ? '' : z.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${zoneFilter === z.name ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {z.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setCatFilter('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${!catFilter ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Todas
        </button>
        {categories.filter(c => c.active).map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFilter(catFilter === c.name ? '' : c.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${catFilter === c.name ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-3">{filtered.length} prestadores encontrados</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="Sin resultados"
          message="No se encontraron prestadores con esos filtros. Prueba cambiar la búsqueda."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} hover onClick={() => onNavigate('perfil-prestador', p.id)} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full ${p.avatarColor} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{p.name}</p>
                    {p.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-gray-500">{p.specialty}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{p.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">{p.jobsCompleted} trabajos</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Ubicación aproximada: {p.zone}, Santa Marta</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge color={p.available ? 'green' : 'gray'} size="sm">
                    {p.available ? 'Disponible' : 'No disponible'}
                  </Badge>
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onNavigate('perfil-prestador', p.id); }}>
                    Ver perfil
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
