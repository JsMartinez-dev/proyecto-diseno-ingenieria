import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { canCoordinate } from '@/store/demoRules';
import type { ServiceRecord } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ServiceCoordination({ service }: { service: ServiceRecord }) {
  const { role, messages, sendMessage } = useApp();
  const [text, setText] = useState('');
  const enabled = canCoordinate(service, role);
  return <Card className="p-4 mb-4 space-y-3">
    <h2 className="font-bold">Coordinación del servicio</h2>
    <p className="text-xs text-gray-500">Canal habilitado al contratar. No necesitas compartir teléfono ni correo. Los mensajes de esta demo se consultan al cambiar de rol en este navegador.</p>
    <div role="log" aria-label="Mensajes del servicio" className="space-y-2 max-h-64 overflow-y-auto">
      {messages.filter(m => m.serviceId === service.id).map(m => <div key={m.id} className={`rounded-xl p-3 text-sm ${m.sender === role ? 'bg-blue-50' : 'bg-gray-100'}`}><p className="font-semibold">{m.sender === 'cliente' ? 'Cliente' : 'Prestador'}</p><p className="whitespace-pre-wrap break-words">{m.text}</p><p className="text-xs text-gray-500 mt-1">{new Date(m.date).toLocaleString('es-CO')}</p></div>)}
    </div>
    {enabled ? <form className="space-y-2" onSubmit={e => { e.preventDefault(); if (sendMessage(service.id, text)) setText(''); }}><label className="block text-sm">Mensaje de coordinación<textarea required maxLength={1000} value={text} onChange={e => setText(e.target.value)} className="block w-full border rounded-xl p-3" /></label><Button type="submit" disabled={!text.trim()}>Enviar mensaje</Button></form> : <p className="text-sm text-gray-500">El canal está cerrado. Puedes consultar los mensajes anteriores.</p>}
  </Card>;
}
