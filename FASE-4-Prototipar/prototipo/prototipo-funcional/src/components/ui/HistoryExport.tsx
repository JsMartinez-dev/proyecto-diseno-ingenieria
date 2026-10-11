import type { ServiceRecord } from '@/types';
import Button from './Button';
export default function HistoryExport({ services }: { services: ServiceRecord[] }) {
  const download = () => {
    // Export only the authorized list; exclude addresses, contact details and names of third parties.
    const rows = services.map(s => ({ servicio: s.id, categoria: s.category, fecha: s.date, hora: s.time, precio: s.price, estado: s.stage, calificacion: s.rating ?? null }));
    const url = URL.createObjectURL(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'aliado-historial.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <Button variant="secondary" className="mb-4" onClick={download}>Descargar mi historial</Button>;
}
