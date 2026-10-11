import ProviderCatalog from '@/components/ProviderCatalog';
import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { MapPin, Briefcase, Clock, Pencil, TrendingUp, Info, ChevronRight, LogOut } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorPerfil({ onNavigate }: PrestadorPageProps) {
  const { providers, categories, zones: availableZones, updateProviderProfile, addToast, setRole } = useApp();
  const provider = providers.find((p) => p.id === 'prov-1')!;
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(provider.bio);
  const [categoryIds, setCategoryIds] = useState(provider.categoryIds);
  const [zones, setZones] = useState(provider.zones.join(', '));
  const [available, setAvailable] = useState(provider.available);

  const handleSave = () => {
    const saved = updateProviderProfile(provider.id, {
      bio,
      categoryIds,
      zones: zones.split(',').map((z) => z.trim()).filter(Boolean),
      available,
    });
    if (!saved) return;
    addToast('Perfil actualizado correctamente', 'success');
    setEditing(false);
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center mb-6">
        <div className={`w-20 h-20 rounded-full ${provider.avatarColor} flex items-center justify-center text-white font-bold text-2xl mb-3`}>
          {provider.name.charAt(0)}
        </div>
        <h1 className="text-lg font-bold text-gray-900">{provider.name}</h1>
        <p className="text-sm text-gray-500">{provider.specialty}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={provider.rating} size={14} showNumber />
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{provider.jobsCompleted} servicios</span>
          {provider.verified && <Badge color="green" size="sm">Verificado</Badge>}
        </div>
      </div>

      <Button fullWidth className="mb-4" onClick={() => { setBio(provider.bio); setCategoryIds(provider.categoryIds); setZones(provider.zones.join(', ')); setAvailable(provider.available); setEditing(true); }}>
        <Pencil className="w-4 h-4" />
        Editar perfil
      </Button>

      <Card className="p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Experiencia</p>
            <p className="text-xs text-gray-500">{provider.experienceYears} años</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Zona principal</p>
            <p className="text-xs text-gray-500">Ubicación aproximada: {provider.zone}, Santa Marta</p>
          </div>
        </div>
      </Card>

      <ProviderCatalog provider={provider} editable />


      <Card className="p-4 mb-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">Zonas donde trabaja</p>
        <div className="flex flex-wrap gap-2">
          {provider.zones.map((z) => (
            <Badge key={z} color="gray">
              <MapPin className="w-3 h-3" />
              {z}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">Disponibilidad</p>
            <p className="text-xs text-gray-500">{provider.available ? 'Disponible ahora' : 'No disponible'}</p>
          </div>
          <Badge color={provider.available ? 'green' : 'gray'} size="sm">
            {provider.available ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </Card>

      <h2 className="font-bold text-gray-900 mt-6 mb-3">Reseñas recibidas</h2>
      <div className="space-y-3 mb-6">
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

      <Card className="p-4 mb-3 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
        <button onClick={() => onNavigate('progreso')} className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Mi progreso de formalización</p>
            <p className="text-xs text-gray-500">Ruta orientativa</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </Card>

      <Card className="p-4 mb-3">
        <button onClick={() => onNavigate('acerca')} className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Acerca de ALIADO</p>
            <p className="text-xs text-gray-500">Proyecto académico</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </Card>

      <Card className="p-4 mb-6">
        <button onClick={() => onNavigate('proximas')} className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Próximas funciones</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </Card>

      <Button variant="danger" fullWidth onClick={() => setRole(null)}>
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </Button>

      <Modal open={editing} onClose={() => setEditing(false)} title="Editar perfil profesional" size="md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Descripción profesional</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Categorías de servicio</label>
            <div className="flex flex-wrap gap-2">{categories.filter(c => c.active || categoryIds.includes(c.id)).map(c => <label key={c.id} className="text-sm flex gap-1">
              <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={e => {
                setCategoryIds(prev => e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
              }} />{c.name}{!c.active && ' (inactiva)'}</label>)}</div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Zonas de atención</label>
            <div className="flex flex-wrap gap-2">{availableZones.filter(z => z.active).map(z => <label key={z.id} className="text-sm flex gap-1">
              <input type="checkbox" checked={zones.split(',').map(s => s.trim()).includes(z.name)} onChange={e => {
                const selected = zones.split(',').map(s => s.trim()).filter(Boolean);
                setZones((e.target.checked ? [...selected, z.name] : selected.filter(s => s !== z.name)).join(', '));
              }} />{z.name}</label>)}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Disponible ahora</span>
            <button
              onClick={() => setAvailable(!available)}
              className={`w-12 h-7 rounded-full transition-colors ${available ? 'bg-green-500' : 'bg-gray-300'} relative`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${available ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setEditing(false)}>Cancelar</Button>
            <Button fullWidth onClick={handleSave}>Guardar cambios</Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
