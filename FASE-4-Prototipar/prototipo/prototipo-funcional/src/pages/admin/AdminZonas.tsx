import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import { MapPin, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { AdminPageProps } from '../cliente/types';

export default function AdminZonas({ onNavigate: _onNavigate }: AdminPageProps) {
  const { zones, saveZone, toggleZoneActive, addToast } = useApp();

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState<string>();
  const [name, setName] = useState('');
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Zonas</h1>
          <p className="text-sm text-gray-500">Administra las zonas de cobertura</p>
        </div>
        <Button size="sm" onClick={() => { setId(undefined); setName(''); setEditing(true); }}>
          <Plus className="w-4 h-4" />
          Nueva zona
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <Card key={zone.id} className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{zone.name}</p>
                <p className="text-xs text-gray-500">Santa Marta</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button size="sm" variant="secondary" onClick={() => { setId(zone.id); setName(zone.name); setEditing(true); }}>Editar</Button>
              <Badge color={zone.active ? 'green' : 'gray'} size="sm">
                {zone.active ? 'Activa' : 'Inactiva'}
              </Badge>
              <Button
                size="sm"
                variant={zone.active ? 'ghost' : 'secondary'}
                onClick={() => {
                  toggleZoneActive(zone.id);
                  addToast(`Zona ${zone.name} ${zone.active ? 'desactivada' : 'activada'}`, 'success');
                }}
              >
                {zone.active ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title={id ? 'Editar catálogo' : 'Nuevo registro'}>
        <div className="space-y-3"><label>Nombre<input aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} className="block w-full border p-3 rounded-xl" /></label>
        <Button disabled={!name.trim()} onClick={() => { if (saveZone(name, id)) { setEditing(false); addToast('Catálogo guardado'); } }}>Guardar</Button></div>
      </Modal>
    </div>
  );
}
