import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import type { Attachment, Report, ReportReason } from '@/types';
import Button from '@/components/ui/Button';
import Attachments from '@/components/Attachments';

export default function ReportForm({ targetId, reportedName, type, onDone }: { targetId: string; reportedName: string; type: Report['type']; onDone: () => void }) {
  const { createReport, role, currentClient, providers, addToast } = useApp();
  const [reason, setReason] = useState<ReportReason>('Incumplimiento');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<Attachment[]>([]);
  return <form className="space-y-4" onSubmit={e => { e.preventDefault();
    if (createReport({ targetId, reportedName, type, reporterName: role === 'cliente' ? currentClient.name : providers.find(p => p.id === 'prov-1')?.name || 'Prestador', reason, description, evidence })) { addToast('Reporte registrado para revisión'); onDone(); }
  }}>
    <p className="text-sm">Reportando: {reportedName}</p>
    <label className="block text-sm">Motivo<select value={reason} onChange={e => setReason(e.target.value as ReportReason)} className="block w-full p-3 border rounded-xl">{['Comportamiento inapropiado', 'Incumplimiento', 'Posible fraude', 'Información falsa', 'Otro'].map(r => <option key={r}>{r}</option>)}</select></label>
    <label className="block text-sm">Descripción del reporte<textarea required maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} className="block w-full p-3 border rounded-xl" /></label>
    <Attachments files={evidence} onChange={setEvidence} />
    <div className="flex gap-3"><Button type="button" variant="ghost" onClick={onDone}>Cancelar</Button><Button type="submit" variant="danger" disabled={!description.trim()}>Enviar reporte</Button></div>
  </form>;
}
