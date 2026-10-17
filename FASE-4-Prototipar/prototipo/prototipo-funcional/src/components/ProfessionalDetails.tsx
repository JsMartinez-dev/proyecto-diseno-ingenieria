import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import type { Attachment, Provider } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Attachments from '@/components/Attachments';

export default function ProfessionalDetails({ provider, editable = false }: { provider: Provider; editable?: boolean }) {
  const { addPortfolioItem, removePortfolioItem, saveSlot, removeSlot, services } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<Attachment[]>([]);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  return <div className="space-y-4 mb-4">
    <Card className="p-4 space-y-3">
      <h2 className="font-bold">Portafolio de trabajos</h2>
      {!provider.portfolio?.length && <p className="text-sm text-gray-500">Aún no hay trabajos publicados.</p>}
      {provider.portfolio?.map(item => <div key={item.id} className="border rounded-xl p-3 space-y-2">
        <img src={item.evidence.data} alt={item.title} className="w-full max-h-56 object-contain rounded-lg" />
        <h3 className="font-semibold">{item.title}</h3><p className="text-sm">{item.description}</p>
        {editable && <Button variant="danger" size="sm" onClick={() => removePortfolioItem(item.id)}>Eliminar trabajo</Button>}
      </div>)}
      {editable && <form className="space-y-3 border-t pt-3" onSubmit={e => { e.preventDefault(); if (files[0] && addPortfolioItem(title, description, files[0])) { setTitle(''); setDescription(''); setFiles([]); } }}>
        <label className="block text-sm">Nombre del trabajo<input required maxLength={100} value={title} onChange={e => setTitle(e.target.value)} className="block w-full border p-3 rounded-xl" /></label>
        <label className="block text-sm">Descripción del trabajo<textarea required maxLength={500} value={description} onChange={e => setDescription(e.target.value)} className="block w-full border p-3 rounded-xl" /></label>
        <Attachments imagesOnly files={files} onChange={setFiles} max={1} label="Foto del trabajo" />
        <Button type="submit" disabled={!files.length}>Agregar al portafolio</Button>
      </form>}
    </Card>
    <Card className="p-4 space-y-3">
      <h2 className="font-bold">Agenda y franjas disponibles</h2>
      <p className="text-sm text-gray-500">{provider.agenda?.length ? 'Las propuestas deben quedar dentro de estas franjas. Una contratación reserva su hora de inicio.' : 'Sin franjas específicas: se utiliza la disponibilidad general del perfil.'}</p>
      {provider.agenda?.map(slot => <div key={slot.id} className="border rounded-xl p-3 flex flex-wrap items-center gap-3 justify-between">
        <span className="text-sm">{slot.date} · {slot.start}–{slot.end}</span>
        {editable && <button className="text-red-700 text-sm underline" onClick={() => removeSlot(slot.id)}>Eliminar franja</button>}
      </div>)}
      {editable && <>
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (saveSlot({ date, start, end })) setDate(''); }}>
          <label className="block text-sm">Fecha de la franja<input required type="date" value={date} onChange={e => setDate(e.target.value)} className="block w-full p-3 border rounded-xl" /></label>
          <div className="grid grid-cols-2 gap-3"><label className="text-sm">Desde<input required type="time" value={start} onChange={e => setStart(e.target.value)} className="block w-full p-3 border rounded-xl" /></label><label className="text-sm">Hasta<input required type="time" value={end} onChange={e => setEnd(e.target.value)} className="block w-full p-3 border rounded-xl" /></label></div>
          <Button type="submit">Agregar franja</Button>
        </form>
        <h3 className="font-semibold text-sm">Horas reservadas</h3>
        {services.filter(s => s.providerId === provider.id && !['FINALIZADO', 'CANCELADO'].includes(s.stage)).map(s => <p key={s.id} className="text-sm">{s.date} · {s.time} · {s.category}</p>)}
      </>}
    </Card>
  </div>;
}
