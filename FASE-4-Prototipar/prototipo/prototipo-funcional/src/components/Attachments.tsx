import { useState } from 'react';
import type { Attachment } from '@/types';
import { validAttachment } from '@/store/demoRules';

export function AttachmentList({ files }: { files: Attachment[] }) {
  return <ul className="space-y-2">{files.map(file => <li key={file.id}>
    {file.mime.startsWith('image/') ? <img src={file.data} alt={file.name} className="max-h-48 rounded-lg" /> : null}
    <a href={file.data} download={file.name} className="text-sm text-blue-700 underline break-all">Descargar {file.name}</a>
  </li>)}</ul>;
}
export default function Attachments({ files, onChange, imagesOnly = false, label = 'Adjuntar evidencia', max = 3 }: { files: Attachment[]; onChange: (files: Attachment[]) => void; imagesOnly?: boolean; label?: string; max?: number }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  return <div className="space-y-2">
    <label className="block text-sm font-semibold">{label}
      <input className="block w-full text-sm mt-2" type="file" disabled={loading || files.length >= max} accept={imagesOnly ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,application/pdf'} onChange={async e => {
        const file = e.target.files?.[0]; e.target.value = ''; setError('');
        if (!file) return;
        if (!validAttachment(file, imagesOnly)) { setError(`Usa ${imagesOnly ? 'JPG, PNG o WebP' : 'JPG, PNG, WebP o PDF'} de hasta 250 KB.`); return; }
        setLoading(true);
        try {
          const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
          onChange([...files, { id: crypto.randomUUID(), name: file.name, mime: file.type, data }]);
        } catch { setError('No se pudo leer el archivo. Intenta nuevamente.'); }
        finally { setLoading(false); }
      }} />
    </label>
    <p className="text-xs text-gray-500">Solo archivos de ejemplo. Máximo {max}, de 250 KB cada uno.</p>
    {loading && <p role="status" className="text-sm">Leyendo archivo…</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <AttachmentList files={files} />
    {files.map(file => <button type="button" key={file.id} className="block text-sm text-red-700 underline" onClick={() => onChange(files.filter(f => f.id !== file.id))}>Quitar {file.name}</button>)}
  </div>;
}
