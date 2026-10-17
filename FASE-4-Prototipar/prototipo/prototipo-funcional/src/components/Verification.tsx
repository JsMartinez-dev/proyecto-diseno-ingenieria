import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import type { Attachment } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Attachments, { AttachmentList } from '@/components/Attachments';

export default function Verification({ admin = false }: { admin?: boolean }) {
  const { verifications, requestVerification, reviewVerification, providers } = useApp();
  const [files, setFiles] = useState<Attachment[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const pending = verifications.some(v => v.status === 'PENDIENTE');
  return <Card className="p-4 mb-4 space-y-3">
    <h2 className="font-bold">{admin ? 'Revisión documental' : 'Verificación documental ampliada'}</h2>
    <p className="text-xs text-gray-500">Simulación académica con documentos ficticios. La revisión no certifica el estado legal ni la calidad del prestador.</p>
    {!admin && !pending && <div className="space-y-3">
      <Attachments label="Documentos de ejemplo" files={files} onChange={setFiles} />
      <Button disabled={!files.length} onClick={() => { if (requestVerification(files)) setFiles([]); }}>Solicitar verificación</Button>
    </div>}
    {!verifications.length && <p className="text-sm text-gray-500">Sin solicitudes de verificación.</p>}
    {verifications.map(v => <div className="border rounded-xl p-3 space-y-3" key={v.id}>
      <p className="font-semibold text-sm">{admin ? providers.find(p => p.id === v.providerId)?.name : 'Tu solicitud'} · {v.status}</p>
      <p className="text-xs text-gray-500">{new Date(v.createdAt).toLocaleString('es-CO')}</p>
      <AttachmentList files={v.documents} />
      {v.reason && <p className="text-sm">Resultado: {v.reason}</p>}
      {admin && v.status === 'PENDIENTE' && <div className="space-y-2">
        <label className="block text-sm">Justificación de la verificación<textarea className="block w-full border rounded-xl p-3" value={reasons[v.id] || ''} onChange={e => setReasons(prev => ({ ...prev, [v.id]: e.target.value }))} /></label>
        <div className="flex gap-2"><Button onClick={() => reviewVerification(v.id, true, reasons[v.id] || '')}>Aprobar</Button><Button variant="danger" onClick={() => reviewVerification(v.id, false, reasons[v.id] || '')}>Rechazar</Button></div>
      </div>}
    </div>)}
  </Card>;
}
