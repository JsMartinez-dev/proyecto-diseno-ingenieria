import type { AvailabilitySlot, DemoPreferences, Notification, ServiceRecord, Role } from '../types';

export const defaultPreferences: DemoPreferences = { publicName: true, profileVisible: true, opportunities: true, proposals: true };
export function notificationEnabled(preferences: DemoPreferences, type: Notification['type']) {
  return type === 'oportunidad' ? preferences.opportunities : type === 'propuesta' ? preferences.proposals : true;
}
export function canCoordinate(service: ServiceRecord, role: Role | null) {
  return !['FINALIZADO', 'CANCELADO'].includes(service.stage) &&
    ((role === 'cliente' && service.clientId === 'client-1') || (role === 'prestador' && service.providerId === 'prov-1'));
}
export function validSlot(slot: Pick<AvailabilitySlot, 'date' | 'start' | 'end'>, slots: AvailabilitySlot[], id?: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(slot.date) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(slot.start) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(slot.end) && slot.start < slot.end &&
    !slots.some(s => s.id !== id && s.date === slot.date && slot.start < s.end && slot.end > s.start);
}
export function proposalFitsAgenda(date: string, time: string, slots: AvailabilitySlot[] = []) {
  // Without a detailed agenda, general availability remains the fallback.
  return slots.length === 0 || slots.some(s => s.date === date && s.start <= time && time < s.end);
}
export function validAttachment(file: { size: number; type: string }, imagesOnly = false) {
  return file.size > 0 && file.size <= 250 * 1024 &&
    ['image/jpeg', 'image/png', 'image/webp', ...(imagesOnly ? [] : ['application/pdf'])].includes(file.type);
}
