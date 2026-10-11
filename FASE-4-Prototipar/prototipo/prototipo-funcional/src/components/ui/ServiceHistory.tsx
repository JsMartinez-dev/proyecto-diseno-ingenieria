import type { ServiceRecord } from '@/types';
import Card from './Card';
import { ServiceStageBadge } from './StatusBadge';
export default function ServiceHistory({ service }: { service: ServiceRecord }) {
  const history = service.history || [{ stage: service.stage, date: service.createdAt, actor: 'Estado inicial de demo' }];
  return <Card className="p-5 mb-4"><h2 className="font-bold mb-3">Historial de estados</h2>
    <ol className="space-y-3">{history.map((event, index) => <li key={index} className="text-sm flex flex-wrap items-center gap-2">
      <ServiceStageBadge stage={event.stage} /><span>{event.actor}</span><time>{new Date(event.date).toLocaleString('es-CO')}</time>
    </li>)}</ol></Card>;
}
