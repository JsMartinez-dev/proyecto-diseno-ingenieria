import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useApp } from '@/store/AppContext';
import * as Icons from 'lucide-react';
import { Wrench } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { AdminPageProps } from '../cliente/types';

export default function AdminCategorias({ onNavigate: _onNavigate }: AdminPageProps) {
  const { categories, saveCategory, toggleCategoryActive, addToast } = useApp();

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState<string>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Categorías</h1>
        <p className="text-sm text-gray-500">Administra las categorías de servicios</p>
      </div>

<Button onClick={() => { setId(undefined); setName(''); setDescription(''); setEditing(true); }}>Nueva categoría</Button>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[cat.icon] || Wrench;
          return (
            <Card key={cat.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button size="sm" variant="secondary" onClick={() => { setId(cat.id); setName(cat.name); setDescription(cat.description); setEditing(true); }}>Editar</Button>
                <Badge color={cat.active ? 'green' : 'gray'} size="sm">
                  {cat.active ? 'Activa' : 'Inactiva'}
                </Badge>
                <Button
                  size="sm"
                  variant={cat.active ? 'ghost' : 'secondary'}
                  onClick={() => {
                    toggleCategoryActive(cat.id);
                    addToast(`Categoría ${cat.name} ${cat.active ? 'desactivada' : 'activada'}`, 'success');
                  }}
                >
                  {cat.active ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title={id ? 'Editar catálogo' : 'Nuevo registro'}>
        <div className="space-y-3"><label>Nombre<input aria-label="Nombre" value={name} onChange={e => setName(e.target.value)} className="block w-full border p-3 rounded-xl" /></label><label>Descripción<textarea aria-label="Descripción" value={description} onChange={e => setDescription(e.target.value)} className="block w-full border p-3 rounded-xl" /></label>
        <Button disabled={!name.trim()} onClick={() => { if (saveCategory(name, description, id)) { setEditing(false); addToast('Catálogo guardado'); } }}>Guardar</Button></div>
      </Modal>
    </div>
  );
}
