import type { Provider, Role, ServiceRequest, ServiceRecord, ServiceStage, Category, Zone } from '../types';

export function isCompatible(request: ServiceRequest, provider: Provider, categories?: Category[], zones?: Zone[]) {
  return ['PUBLICADA', 'CON_PROPUESTAS'].includes(request.status)
    && (!categories || categories.some(c => c.active && c.name === request.category))
    && (!zones || zones.some(z => z.active && z.name === request.zone))
    && !provider.suspended && provider.available
    && Boolean(request.preferredDate && request.preferredTime)
    && Boolean(categories?.some(c => c.name === request.category && provider.categoryIds.includes(c.id)))
    && provider.zones.includes(request.zone)
    && (!provider.agenda?.length || provider.agenda.some(slot => {
      const dateMatches = request.preferredDate === 'Flexible' || !/^\d{4}-\d{2}-\d{2}$/.test(request.preferredDate) || slot.date === request.preferredDate;
      const period = request.preferredTime;
      const timeMatches = period === 'Mañana' ? slot.start < '12:00' && slot.end > '00:00'
        : period === 'Tarde' ? slot.start < '18:00' && slot.end > '12:00'
        : period === 'Noche' ? slot.end > '18:00' : true;
      return dateMatches && timeMatches;
    }));
}

export function nextStage(service: ServiceRecord, role: Role | null): ServiceStage | null {
  if (role === 'prestador' && service.providerId === 'prov-1') {
    if (service.stage === 'CONTRATADO') return 'EN_PROCESO';
    if (service.stage === 'EN_PROCESO') return 'TERMINADO';
  }
  if (role === 'cliente' && service.clientId === 'client-1' && service.stage === 'TERMINADO') return 'FINALIZADO';
  return null;
}

export function canCancel(service: ServiceRecord, role: Role | null) {
  return !['FINALIZADO', 'CANCELADO'].includes(service.stage)
    && ((role === 'cliente' && service.clientId === 'client-1')
      || (role === 'prestador' && service.providerId === 'prov-1'));
}

export function canAccept(request: ServiceRequest, proposalId: string, role: Role | null) {
  return role === 'cliente' && request.clientId === 'client-1'
    && ['PUBLICADA', 'CON_PROPUESTAS'].includes(request.status) && !request.serviceId
    && request.proposals.some(p => p.id === proposalId && p.status === 'pendiente');
}
