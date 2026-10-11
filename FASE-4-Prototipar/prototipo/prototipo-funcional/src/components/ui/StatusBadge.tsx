import Badge from './Badge';
import type { ServiceStatus, ServiceStage, ReportStatus } from '@/types';

export function RequestStatusBadge({ status }: { status: ServiceStatus }) {
  const map: Record<ServiceStatus, { color: 'gray' | 'blue' | 'amber' | 'green' | 'teal' | 'red'; label: string }> = {
    BORRADOR: { color: 'gray', label: 'Borrador' },
    PUBLICADA: { color: 'blue', label: 'Publicada' },
    CON_PROPUESTAS: { color: 'amber', label: 'Con propuestas' },
    CONTRATADA: { color: 'teal', label: 'Contratada' },
    EN_PROCESO: { color: 'amber', label: 'En proceso' },
    FINALIZADA: { color: 'green', label: 'Finalizada' },
    CANCELADA: { color: 'red', label: 'Cancelada' },
  };
  const { color, label } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function ServiceStageBadge({ stage }: { stage: ServiceStage }) {
  const map: Record<ServiceStage, { color: 'teal' | 'blue' | 'amber' | 'green' | 'red'; label: string }> = {
    CONTRATADO: { color: 'teal', label: 'Contratado' },
    TERMINADO: { color: 'blue', label: 'Pendiente de confirmación' },
    CANCELADO: { color: 'red', label: 'Cancelado' },
    EN_PROCESO: { color: 'amber', label: 'En proceso' },
    FINALIZADO: { color: 'green', label: 'Finalizado' },
  };
  const { color, label } = map[stage];
  return <Badge color={color}>{label}</Badge>;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const map: Record<ReportStatus, { color: 'red' | 'amber' | 'green' | 'gray'; label: string }> = {
    PENDIENTE: { color: 'red', label: 'Pendiente' },
    EN_REVISION: { color: 'amber', label: 'En revisión' },
    DESCARTADO: { color: 'gray', label: 'Descartado' },
    RESUELTO: { color: 'green', label: 'Resuelto' },
  };
  const { color, label } = map[status];
  return <Badge color={color}>{label}</Badge>;
}
