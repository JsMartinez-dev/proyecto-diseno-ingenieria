import { isCompatible } from '@/store/rules';
import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { MapPin, Calendar, Clock, AlertCircle, Send, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageContainer from '@/components/layout/PageContainer';
import type { PrestadorPageProps } from '../cliente/types';

export default function PrestadorDetalleOportunidad({ onNavigate, requestId }: PrestadorPageProps & { requestId?: string }) {
  const { requests, providers, categories, zones, addProposal, withdrawProposal, addToast } = useApp();
  const provider = providers.find(p => p.id === 'prov-1')!;
  const req = requests.find((r) => r.id === requestId && isCompatible(r, provider, categories, zones));
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!req) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Oportunidad no encontrada</p>
          <Button variant="secondary" className="mt-4" onClick={() => onNavigate('oportunidades')}>Volver</Button>
        </div>
      </PageContainer>
    );
  }

  const existingProposal = req.proposals.find((p) => p.providerId === 'prov-1' && p.status === 'pendiente');

  const handleSendProposal = () => {
    if (!Number.isFinite(Number(price)) || Number(price) <= 0 || !date || !time) {
      addToast('Completa precio, fecha y hora', 'error');
      return;
    }
    const saved = addProposal(req.id, {
      providerId: 'prov-1',
      providerName: provider.name,
      providerRating: provider.rating,
      providerJobs: provider.jobsCompleted,
      price: parseInt(price),
      date,
      time,
      message: message || 'Estoy disponible para realizar este servicio.',
    });
    if (!saved) return;
    setSent(true);
    addToast('Propuesta enviada correctamente', 'success');
    setTimeout(() => onNavigate('oportunidades'), 1800);
  };

  if (sent) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Propuesta enviada</h2>
          <p className="text-gray-500 text-sm">El cliente recibirá tu propuesta y podrá aceptarla o rechazarla.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button onClick={() => onNavigate('oportunidades')} className="text-sm text-blue-600 font-medium mb-3">
        ← Volver a oportunidades
      </button>

      <Card className="p-5 mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-1">{req.title}</h1>
        <p className="text-sm text-gray-500 mb-3">{req.category}</p>
        <p className="text-sm text-gray-600 mb-4">{req.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-gray-500 font-medium">Ubicación aproximada:</span> {req.zone}, Santa Marta
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {req.preferredDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {req.preferredTime}
          </div>
          <Badge color={req.urgency === 'Urgente' ? 'red' : req.urgency === 'Alta' ? 'amber' : 'blue'} size="sm">
            {req.urgency}
          </Badge>
        </div>
      </Card>

      {existingProposal ? (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Ya enviaste una propuesta</p>
              <p className="text-xs text-gray-500">Espera la respuesta del cliente</p>
            </div>
          </div>
          <Button variant="danger" className="mb-3" onClick={() => withdrawProposal(req.id, existingProposal.id)}>Retirar propuesta</Button>
          <div className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Precio:</span>
              <span className="font-bold text-gray-900">${existingProposal.price.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Disponible:</span>
              <span className="font-semibold text-gray-700">{existingProposal.date} {existingProposal.time}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Mensaje:</span>
              <p className="text-sm text-gray-700 mt-1">{existingProposal.message}</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-4">Enviar propuesta</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Precio estimado</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="85000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Fecha disponible</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="Hoy">Hoy</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Pasado mañana">Pasado mañana</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hora disponible</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm bg-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Mensaje para el cliente</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ej: Puedo revisar la fuga esta tarde. El valor incluye diagnóstico."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm resize-none"
              />
            </div>
            <Button fullWidth onClick={handleSendProposal}>
              <Send className="w-4 h-4" />
              Enviar propuesta
            </Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
