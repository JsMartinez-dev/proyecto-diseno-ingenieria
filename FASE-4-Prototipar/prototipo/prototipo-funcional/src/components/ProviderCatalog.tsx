import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import type { Provider, ProviderService } from '@/types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Modal from './ui/Modal';

export default function ProviderCatalog({ provider, editable = false }: { provider: Provider; editable?: boolean }) {
  const { categories, role, saveProviderService, removeProviderService } = useApp();
  const canEdit = editable && role === 'prestador' && provider.id === 'prov-1' && !provider.suspended;
  const selectedCategories = categories.filter(c => provider.categoryIds.includes(c.id));
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const edit = (service?: ProviderService) => {
    setId(service?.id); setCategoryId(service?.categoryId || selectedCategories.find(c => c.active)?.id || '');
    setName(service?.name || ''); setDescription(service?.description || ''); setOpen(true);
  };
  return <>
    <Card className="p-4 mb-3">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Categorías de servicio</h2>
      <div className="flex flex-wrap gap-2">{selectedCategories.map(c => <Badge key={c.id} color="blue">{c.name}{!c.active && ' (inactiva)'}</Badge>)}</div>
    </Card>
    <Card className="p-4 mb-3">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-gray-700">Servicios que ofrece</h2>
        {canEdit && <Button size="sm" onClick={() => edit()} disabled={!selectedCategories.some(c => c.active)}>Crear servicio</Button>}
      </div>
      {provider.offeredServices.length === 0 && <p className="text-sm text-gray-500">Aún no hay servicios publicados.</p>}
      <div className="space-y-4">{selectedCategories.map(category => {
        const services = provider.offeredServices.filter(s => s.categoryId === category.id);
        if (!services.length) return null;
        return <section key={category.id}>
          <h3 className="text-sm font-semibold text-blue-700 mb-2">{category.name}</h3>
          <div className="space-y-2">{services.map(service => <div key={service.id} className="bg-gray-50 rounded-xl p-3">
            <p className="font-semibold text-sm text-gray-900">{service.name}</p>
            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            {canEdit && <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => edit(service)}>Editar servicio</Button>
              <Button size="sm" variant="danger" onClick={() => { if (window.confirm(`¿Eliminar el servicio «${service.name}»?`)) removeProviderService(provider.id, service.id); }}>Eliminar servicio</Button>
            </div>}
          </div>)}</div>
        </section>;
      })}</div>
    </Card>
    {canEdit && <Modal open={open} onClose={() => setOpen(false)} title={id ? 'Editar servicio' : 'Crear servicio'}>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (saveProviderService(provider.id, { categoryId, name, description }, id)) setOpen(false); }}>
        <label className="block text-sm font-semibold">Categoría de servicio
          <select required aria-label="Categoría de servicio" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border rounded-xl p-3 mt-1">
            <option value="">Selecciona una categoría</option>{selectedCategories.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">Nombre del servicio
          <input required maxLength={120} aria-label="Nombre del servicio" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Reparación de fugas" className="w-full border rounded-xl p-3 mt-1" />
        </label>
        <label className="block text-sm font-semibold">Descripción del servicio
          <textarea required maxLength={2000} aria-label="Descripción del servicio" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-xl p-3 mt-1" />
        </label>
        <div className="flex gap-2"><Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit">Guardar servicio</Button></div>
      </form>
    </Modal>}
  </>;
}
