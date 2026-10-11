import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageContainer from '@/components/layout/PageContainer';
import type { ClientePageProps } from './types';
import type { Urgency } from '@/types';

export default function ClienteNuevaSolicitud({ onNavigate, requestId }: ClientePageProps & { requestId?: string }) {
  const { categories, zones, requests, createRequest, addToast, currentClient } = useApp();
  const existing = requests.find(r => r.id === requestId && r.clientId === currentClient.id);
  const [category, setCategory] = useState(existing?.category || '');
  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [zone, setZone] = useState(existing?.zone || '');
  const [urgency, setUrgency] = useState<Urgency>(existing?.urgency || 'Normal');
  const [preferredDate, setPreferredDate] = useState(existing?.preferredDate || '');
  const [preferredTime, setPreferredTime] = useState(existing?.preferredTime || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [photo, setPhoto] = useState<string | undefined>(existing?.photo);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (draft = false) => {
    if (!title.trim() || !description.trim() || (!draft && (!category || !zone))) {
      addToast('Completa todos los campos obligatorios', 'error');
      return;
    }
    const saved = createRequest({
      category,
      title,
      description,
      zone,
      urgency,
      address: address.trim(),
      photo,
      preferredDate: preferredDate || 'Flexible',
      preferredTime: preferredTime || 'Flexible',
      clientName: currentClient.name,
      clientId: currentClient.id,
    }, draft, requestId);
    if (!saved) return;
    if (draft) { addToast('Borrador guardado'); onNavigate('solicitudes'); return; }
    setSuccess(true);
    addToast('Solicitud publicada correctamente', 'success');
    setTimeout(() => {
      onNavigate('solicitudes');
    }, 1800);
  };

  if (success) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitud publicada correctamente</h2>
          <p className="text-gray-500 text-sm">Los prestadores cercanos podrán ver tu solicitud y enviar propuestas.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">{existing ? 'Editar solicitud' : 'Nueva solicitud'}</h1>

      <Card className="p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Categoría *</label>
          <div className="flex flex-wrap gap-2">
            {categories.filter(c => c.active).map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  category === c.name
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: El aire acondicionado dejó de enfriar"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Descripción *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema en detalle..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Zona *</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
          >
            <option value="">Selecciona una zona</option>
            {zones.filter(z => z.active).map((z) => (
              <option key={z.id} value={z.name}>{z.name}, Santa Marta</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Solo se mostrará la zona aproximada, no tu dirección exacta.</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Urgencia</label>
          <div className="flex gap-2">
            {(['Baja', 'Normal', 'Alta', 'Urgente'] as Urgency[]).map((u) => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  urgency === u
                    ? u === 'Urgente'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : u === 'Alta'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : u === 'Normal'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-400 bg-gray-50 text-gray-700'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Fecha preferida</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Horario</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
            >
              <option value="">Flexible</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Foto (opcional)</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Foto del problema" onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
              addToast('Usa una imagen JPG, PNG o WebP de hasta 5 MB', 'error'); return;
            }
            const reader = new FileReader();
            reader.onload = () => setPhoto(String(reader.result));
            reader.readAsDataURL(file);
          }} />
          {photo && <img src={photo} alt="Problema a resolver" className="mt-3 max-h-48 rounded-xl" />}
          <label className="block mt-4 text-sm font-semibold">Dirección exacta (opcional)</label>
          <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded-xl p-3 mt-2" />
          <p className="text-xs text-gray-500 mt-1">Solo se comparte con el prestador contratado.</p>
        </div>
      </Card>

      <Button variant="secondary" fullWidth className="mt-4" onClick={() => handleSubmit(true)}>Guardar borrador</Button>
      <div className="mt-4 flex gap-3">
        <Button variant="ghost" fullWidth onClick={() => onNavigate('solicitudes')}>
          Cancelar
        </Button>
        <Button fullWidth onClick={() => handleSubmit()}>
          Publicar solicitud
        </Button>
      </div>
    </PageContainer>
  );
}
