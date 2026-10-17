import { AttachmentList } from '@/components/Attachments';
import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { Flag, AlertCircle, Ban, CheckCircle, Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ReportStatusBadge } from '@/components/ui/StatusBadge';
import type { Report } from '@/types';
import type { AdminPageProps } from '../cliente/types';

export default function AdminReportes({ onNavigate: _onNavigate }: AdminPageProps) {
  const { reports, updateReportStatus, suspendUser, warnUser, moderateReportContent, addToast } = useApp();
  const [resolution, setResolution] = useState('');
  const [selected, setSelected] = useState<Report | null>(null);

  const handleAction = (action: 'advertir' | 'suspender' | 'cerrar' | 'descartar') => {
    if (!selected) return;
    if (!resolution.trim()) { addToast('Escribe una justificación', 'error'); return; }
    if (action === 'advertir') {
      warnUser(selected.reportedName);
      updateReportStatus(selected.id, 'EN_REVISION');
      addToast(`Advertencia enviada a ${selected.reportedName}`, 'success');
    } else if (action === 'suspender') {
      suspendUser(selected.reportedId || selected.reportedName, resolution);
      updateReportStatus(selected.id, 'RESUELTO', resolution);
      addToast(`${selected.reportedName} suspendido`, 'success');
    } else {
      updateReportStatus(selected.id, action === 'descartar' ? 'DESCARTADO' : 'RESUELTO', resolution);
      addToast('Reporte cerrado', 'success');
    }
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reportes</h1>
        <p className="text-sm text-gray-500">Gestión de reportes y moderación</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-400">Pendientes</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{reports.filter((r) => r.status === 'PENDIENTE').length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-400">En revisión</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{reports.filter((r) => r.status === 'EN_REVISION').length}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-400">Resueltos</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{reports.filter((r) => r.status === 'RESUELTO').length}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium">Reportante</th>
                <th className="px-4 py-3 font-medium">Reportado</th>
                <th className="px-4 py-3 font-medium">Motivo</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.reporterName}</td>
                  <td className="px-4 py-3 text-gray-500">{r.reportedName}</td>
                  <td className="px-4 py-3 text-gray-500">{r.reason}</td>
                  <td className="px-4 py-3 text-gray-500">{r.type}</td>
                  <td className="px-4 py-3 text-gray-500">{r.date}</td>
                  <td className="px-4 py-3">
                    <ReportStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary" onClick={() => { setSelected(r); setResolution(''); if (r.status === 'PENDIENTE') updateReportStatus(r.id, 'EN_REVISION'); }}>
                      <Eye className="w-4 h-4" />
                      Abrir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalle del reporte" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Reportante</p>
                <p className="font-semibold text-gray-900 text-sm">{selected.reporterName}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Reportado</p>
                <p className="font-semibold text-gray-900 text-sm">{selected.reportedName}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Motivo</p>
                <p className="font-semibold text-gray-900 text-sm">{selected.reason}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Estado</p>
                <ReportStatusBadge status={selected.status} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Descripción</p>
              <p className="text-sm text-gray-700">{selected.description}</p>
            </div>

            <AttachmentList files={selected.evidence || []} />
            {selected.resolution && <p className="text-sm">Decisión: {selected.resolution}</p>}
            {!['RESUELTO', 'DESCARTADO'].includes(selected.status) && (
              <div className="space-y-2">
                <label className="block text-sm">Justificación de la decisión<textarea aria-label="Justificación de la decisión" value={resolution} onChange={e => setResolution(e.target.value)} className="w-full border rounded-xl p-3" /></label>
                {selected.type === 'Contenido' && <Button variant="danger" fullWidth onClick={() => { if (moderateReportContent(selected.id, resolution)) setSelected(null); }}>Ocultar reseña reportada</Button>}
                <Button variant="secondary" fullWidth onClick={() => handleAction('descartar')}>Descartar reporte</Button>
                <Button variant="secondary" fullWidth onClick={() => handleAction('advertir')}>
                  <AlertCircle className="w-4 h-4" />
                  Advertir usuario
                </Button>
                <Button variant="danger" fullWidth onClick={() => handleAction('suspender')}>
                  <Ban className="w-4 h-4" />
                  Suspender cuenta
                </Button>
                <Button variant="ghost" fullWidth onClick={() => handleAction('cerrar')}>
                  <CheckCircle className="w-4 h-4" />
                  Cerrar reporte
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
