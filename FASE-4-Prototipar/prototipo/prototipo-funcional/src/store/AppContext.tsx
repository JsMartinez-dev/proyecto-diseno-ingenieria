import { defaultPreferences, notificationEnabled, canCoordinate, validSlot, proposalFitsAgenda } from './demoRules';
import type { DemoPreferences, Attachment, AvailabilitySlot, VerificationRequest, CoordinationMessage } from '@/types';
import { migrateProvider, type LegacyProvider } from './providerCatalog';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type {
  Role,
  ServiceRequest,
  ServiceRecord,
  Proposal,
  Provider,
  ProviderService,
  Report,
  AuditEntry,
  Notification,
  Toast,
  Review,
  Category,
  Zone,
} from '@/types';
import {
  initialRequests,
  initialServices,
  initialReports,
  initialAudit,
  initialNotifications,
  categories as initialCategories,
  zones as initialZones,
  providers as initialProviders,
} from '@/data/mockData';

import { isCompatible, nextStage, canCancel, canAccept } from './rules';

// Keep the latest value synchronously to reject repeated actions before React renders.
function useDemoState<T>(key: string, initial: T, migrate?: (value: T) => T) {
  const [value, render] = useState<T>(() => {
    try { const saved = JSON.parse(localStorage.getItem(`aliado-v1-${key}`) || 'null') ?? initial; return migrate ? migrate(saved) : saved; }
    catch { return initial; }
  });
  const latest = useRef(value);
  const set = useCallback((update: T | ((previous: T) => T)) => {
    latest.current = typeof update === 'function' ? (update as (previous: T) => T)(latest.current) : update;
    render(latest.current);
  }, []);
  useEffect(() => { try { localStorage.setItem(`aliado-v1-${key}`, JSON.stringify(value)); } catch { window.dispatchEvent(new Event('aliado-storage-error')); } }, [key, value]);
  return [value, set, latest] as const;
}

interface AppContextType {
  preferences: DemoPreferences;
  savePreferences: (updates: Partial<DemoPreferences>) => void;
  consentDate?: string;
  acceptConsent: () => void;
  personalizeDemo: (role: 'cliente' | 'prestador', name: string) => void;
  editProposal: (requestId: string, proposalId: string, updates: Pick<Proposal, 'price' | 'date' | 'time' | 'message'>) => boolean;
  addPortfolioItem: (title: string, description: string, evidence: Attachment) => boolean;
  removePortfolioItem: (id: string) => void;
  saveSlot: (slot: Omit<AvailabilitySlot, 'id'>) => boolean;
  removeSlot: (id: string) => void;
  verifications: VerificationRequest[];
  requestVerification: (documents: Attachment[]) => boolean;
  reviewVerification: (id: string, approved: boolean, reason: string) => boolean;
  messages: CoordinationMessage[];
  sendMessage: (serviceId: string, text: string) => boolean;
  role: Role | null;
  setRole: (role: Role | null) => void;
  currentClient: { id: string; name: string; zone: string };
  requests: ServiceRequest[];
  services: ServiceRecord[];
  providers: Provider[];
  reports: Report[];
  audit: AuditEntry[];
  notifications: Notification[];
  categories: Category[];
  zones: Zone[];
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  createRequest: (req: Omit<ServiceRequest, 'id' | 'status' | 'proposals' | 'createdAt'>, draft?: boolean, requestId?: string) => boolean;
  withdrawProposal: (requestId: string, proposalId: string) => void;
  addProposal: (requestId: string, proposal: Omit<Proposal, 'id' | 'status'>) => boolean;
  acceptProposal: (requestId: string, proposalId: string) => boolean;
  advanceStage: (serviceId: string) => void;
  cancelService: (serviceId: string) => void;
  cancelRequest: (requestId: string) => void;
  suspendedUsers: string[];
  deletionRequested: boolean;
  requestDeletion: () => void;
  updateClient: (updates: { name: string; zone: string }) => void;
  rateService: (serviceId: string, rating: number, comment: string, punctuality: number, quality: number, communication: number) => boolean;
  createReport: (report: Omit<Report, 'id' | 'status' | 'date'>) => boolean;
  moderateReportContent: (reportId: string, reason: string) => boolean;
  updateReportStatus: (reportId: string, status: Report['status'], reason?: string) => void;
  suspendUser: (userName: string, reason?: string) => void;
  warnUser: (userName: string) => void;
  saveCategory: (name: string, description: string, id?: string) => boolean;
  saveZone: (name: string, id?: string) => boolean;
  toggleCategoryActive: (categoryId: string) => void;
  toggleZoneActive: (zoneId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  saveProviderService: (providerId: string, service: Omit<ProviderService, 'id'>, id?: string) => boolean;
  removeProviderService: (providerId: string, serviceId: string) => void;
  updateProviderProfile: (providerId: string, updates: Partial<Provider>) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [allPreferences, setPreferences, preferencesRef] = useDemoState<Partial<Record<Role, DemoPreferences>>>('preferences', {});
  const [consents, setConsents] = useDemoState<Partial<Record<Role, string>>>('consents', {});
  const [verifications, setVerifications, verificationsRef] = useDemoState<VerificationRequest[]>('verifications', []);
  const [messages, setMessages] = useDemoState<CoordinationMessage[]>('messages', []);
  const preferences = role ? { ...defaultPreferences, ...allPreferences[role] } : defaultPreferences;
  const savePreferences = (updates: Partial<DemoPreferences>) => {
    if (role) { setPreferences(prev => ({ ...prev, [role]: { ...defaultPreferences, ...prev[role], ...updates } })); addToast('Preferencias guardadas'); }
  };
  const acceptConsent = () => { if (role) setConsents(prev => ({ ...prev, [role]: new Date().toISOString() })); };
  const personalizeDemo = (accountRole: 'cliente' | 'prestador', name: string) => {
    if (accountRole === 'cliente') setClient(prev => ({ ...prev, name }));
    else setProviders(prev => prev.map(p => p.id === 'prov-1' ? { ...p, name } : p));
    setConsents(prev => ({ ...prev, [accountRole]: new Date().toISOString() }));
  };
  const [requests, setRequests, requestsRef] = useDemoState<ServiceRequest[]>('requests', initialRequests);
  const [services, setServices, servicesRef] = useDemoState<ServiceRecord[]>('services', initialServices);
  const [providers, setProviders, providersRef] = useDemoState<Provider[]>('providers', initialProviders, saved => saved.map(p => migrateProvider(p as LegacyProvider, (() => { try { return JSON.parse(localStorage.getItem('aliado-v1-categories') || 'null') || initialCategories; } catch { return initialCategories; } })())));
  const [reports, setReports, reportsRef] = useDemoState<Report[]>('reports', initialReports);
  const [audit, setAudit] = useDemoState<AuditEntry[]>('audit', initialAudit);
  const [notifications, setNotifications] = useDemoState<Notification[]>('notifications', initialNotifications);
  const [categories, setCategories, categoriesRef] = useDemoState<Category[]>('categories', initialCategories);
  const [zones, setZones, zonesRef] = useDemoState<Zone[]>('zones', initialZones);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [currentClient, setClient] = useDemoState('client', { id: 'client-1', name: 'Patricia Mercado', zone: 'Bavaria' });
  const [deletions, setDeletions] = useDemoState<string[]>('deletions', []);
  const requestDeletion = () => {
    if (role !== 'cliente' && role !== 'prestador') return;
    setDeletions(prev => [...new Set([...prev, role])]);
    addToast('Solicitud de eliminación registrada, pendiente de revisión');
  };
  const [suspendedUsers, setSuspendedUsers] = useDemoState<string[]>('suspended', []);
  const updateClient = (updates: { name: string; zone: string }) => {
    if (role !== 'cliente' || !updates.name.trim() || !zones.some(z => z.active && z.name === updates.zone)) return;
    setClient({ ...currentClient, ...updates, name: updates.name.trim() });
    addToast('Datos guardados');
  };
  const notify = (recipientRole: Role, type: Notification['type'], title: string, targetId: string) => {
    if (!notificationEnabled({ ...defaultPreferences, ...preferencesRef.current[recipientRole] }, type)) return;
    setNotifications(prev => [{ id: crypto.randomUUID(), type, title, message: title, time: new Date().toLocaleString('es-CO'), read: false, recipientRole, targetId }, ...prev]);
  };
  const notificationRole = (n: Notification) => n.recipientRole || (n.type === 'oportunidad' || n.type === 'aceptada' ? 'prestador' : 'cliente');
  const permitted = (required: Role) => role === required && (role === 'admin' || !suspendedUsers.includes(role === 'cliente' ? 'client-1' : 'prov-1'));

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    const onStorageError = () => addToast('No se pudo guardar en este navegador. Reduce los adjuntos; los cambios solo durarán esta sesión.', 'error');
    window.addEventListener('aliado-storage-error', onStorageError);
    return () => window.removeEventListener('aliado-storage-error', onStorageError);
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAudit = (action: string, target: string) => {
    const now = new Date();
    const entry: AuditEntry = {
      id: `aud-${Date.now()}`,
      action,
      adminName: 'Admin',
      target,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
    };
    setAudit((prev) => [entry, ...prev]);
  };

  const createRequest = (req: Omit<ServiceRequest, 'id' | 'status' | 'proposals' | 'createdAt'>, draft = false, requestId?: string) => {
    if (!permitted('cliente') || req.clientId !== currentClient.id || !req.title.trim() || !req.description.trim()
      || (!draft && !categoriesRef.current.some(c => c.active && c.name === req.category))
      || (!draft && !zonesRef.current.some(z => z.active && z.name === req.zone))) { addToast('Solicitud inválida o cuenta restringida', 'error'); return false; }
    const existing = requestId ? requestsRef.current.find(r => r.id === requestId) : undefined;
    if (requestId && (!existing || existing.clientId !== currentClient.id || !['BORRADOR', 'PUBLICADA'].includes(existing.status))) {
      addToast('La solicitud ya no admite edición', 'error'); return false;
    }
    const newReq: ServiceRequest = {
      ...req,
      id: requestId || crypto.randomUUID(),
      status: draft ? 'BORRADOR' : 'PUBLICADA',
      proposals: existing?.proposals || [],
      createdAt: existing?.createdAt || new Date().toISOString().slice(0, 10),
    };
    setRequests((prev) => [newReq, ...prev.filter(r => r.id !== newReq.id)]);
    const provider = providersRef.current.find(p => p.id === 'prov-1');
    if (!draft && provider && isCompatible(newReq, provider, categoriesRef.current, zonesRef.current)) notify('prestador', 'oportunidad', 'Nueva oportunidad compatible', newReq.id);
    return true;
  };

  const addProposal = (requestId: string, proposal: Omit<Proposal, 'id' | 'status'>) => {
    const request = requestsRef.current.find(r => r.id === requestId);
    const provider = providersRef.current.find(p => p.id === proposal.providerId);
    if (!permitted('prestador') || proposal.providerId !== 'prov-1' || !request || !provider || !isCompatible(request, provider, categoriesRef.current, zonesRef.current)
      || request.proposals.some(p => p.providerId === proposal.providerId && p.status === 'pendiente')
      || !proposalFitsAgenda(proposal.date, proposal.time, provider.agenda)
      || servicesRef.current.some(s => s.providerId === provider.id && !['FINALIZADO', 'CANCELADO'].includes(s.stage) && s.date === proposal.date && s.time === proposal.time)
      || !Number.isFinite(proposal.price) || proposal.price <= 0 || !proposal.date || !proposal.time) {
      addToast('Revisa precio y horario: debe estar dentro de tu agenda y sin otra contratación.', 'error'); return false;
    }
    const newProposal: Proposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pendiente',
    };
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updatedProposals = [...r.proposals, newProposal];
          return {
            ...r,
            proposals: updatedProposals,
            status: r.status === 'PUBLICADA' ? 'CON_PROPUESTAS' : r.status,
          };
        }
        return r;
      })
    );
    if (request.clientId === currentClient.id) notify('cliente', 'propuesta', 'Recibiste una nueva propuesta', requestId);
    return true;
  };

  const editProposal = (requestId: string, proposalId: string, updates: Pick<Proposal, 'price' | 'date' | 'time' | 'message'>) => {
    const request = requestsRef.current.find(r => r.id === requestId);
    const provider = providersRef.current.find(p => p.id === 'prov-1');
    const proposal = request?.proposals.find(p => p.id === proposalId && p.providerId === 'prov-1' && p.status === 'pendiente');
    if (!permitted('prestador') || !request || !provider || !proposal || !isCompatible(request, provider, categoriesRef.current, zonesRef.current)
      || !Number.isFinite(updates.price) || updates.price <= 0 || !updates.date || !updates.time || !proposalFitsAgenda(updates.date, updates.time, provider.agenda)
      || servicesRef.current.some(s => s.providerId === provider.id && !['FINALIZADO', 'CANCELADO'].includes(s.stage) && s.date === updates.date && s.time === updates.time)) {
      addToast('La propuesta no admite cambios o el horario no está disponible', 'error'); return false;
    }
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, proposals: r.proposals.map(p => p.id === proposalId ? { ...p, ...updates } : p) }));
    addToast('Propuesta actualizada'); return true;
  };

  const withdrawProposal = (requestId: string, proposalId: string) => {
    if (!permitted('prestador')) return;
    const request = requestsRef.current.find(r => r.id === requestId);
    if (!request || !['PUBLICADA', 'CON_PROPUESTAS'].includes(request.status)) return;
    setRequests(prev => prev.map(r => {
      if (r.id !== requestId) return r;
      const proposals = r.proposals.map(p => p.id === proposalId && p.providerId === 'prov-1' && p.status === 'pendiente' ? { ...p, status: 'retirada' as const } : p);
      return { ...r, proposals, status: proposals.some(p => p.status === 'pendiente') ? 'CON_PROPUESTAS' : 'PUBLICADA' };
    }));
    addToast('Propuesta retirada');
  };

  const acceptProposal = (requestId: string, proposalId: string) => {
    const req = requestsRef.current.find(r => r.id === requestId);
    if (!permitted('cliente') || !req || !canAccept(req, proposalId, role)) { addToast('La solicitud ya está contratada o la propuesta no está disponible', 'error'); return false; }
    const prop = req.proposals.find(p => p.id === proposalId)!;
    if (providersRef.current.find(p => p.id === prop.providerId)?.suspended) { addToast('Prestador restringido', 'error'); return false; }
    const selectedProvider = providersRef.current.find(p => p.id === prop.providerId);
    if (!selectedProvider || !proposalFitsAgenda(prop.date, prop.time, selectedProvider.agenda) || servicesRef.current.some(s => s.providerId === prop.providerId && !['FINALIZADO', 'CANCELADO'].includes(s.stage) && s.date === prop.date && s.time === prop.time)) {
      addToast('El horario del prestador ya no está disponible', 'error'); return false;
    }
    const id = crypto.randomUUID();
    const newService: ServiceRecord = {
      id, requestId, proposalId, clientId: req.clientId, clientName: req.clientName,
      providerId: prop.providerId, providerName: prop.providerName, category: req.category,
      date: prop.date, time: prop.time, price: prop.price,
      address: req.address || `Dirección pendiente de coordinación · ${req.zone}`,
      stage: 'CONTRATADO', createdAt: new Date().toISOString(),
      history: [{ stage: 'CONTRATADO', date: new Date().toISOString(), actor: 'Cliente' }],
    };
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, status: 'CONTRATADA', serviceId: id,
      proposals: r.proposals.map(p => ({ ...p, status: p.id === proposalId ? 'aceptada' : p.status === 'pendiente' ? 'cerrada' : p.status })) }));
    setServices(prev => [newService, ...prev]);
    if (prop.providerId === 'prov-1') notify('prestador', 'aceptada', 'Tu propuesta fue aceptada', id);
    return true;
  };

  const changeStage = (serviceId: string, cancel = false) => {
    const service = servicesRef.current.find(s => s.id === serviceId);
    if (!service || !role || !permitted(role)) return;
    const stage = cancel ? (canCancel(service, role) ? 'CANCELADO' : null) : nextStage(service, role);
    if (!stage) { addToast('Transición no permitida', 'error'); return; }
    setServices(prev => prev.map(s => s.id !== serviceId ? s : { ...s, stage,
      history: [...(s.history || [{ stage: s.stage, date: s.createdAt, actor: 'Estado inicial de demo' }]),
        { stage, date: new Date().toISOString(), actor: role }] }));
    setRequests(prev => prev.map(r => r.id !== service.requestId ? r : { ...r,
      status: stage === 'FINALIZADO' ? 'FINALIZADA' : stage === 'CANCELADO' ? 'CANCELADA' : 'EN_PROCESO' }));
    if (stage === 'FINALIZADO') setProviders(prev => prev.map(p => p.id !== service.providerId ? p : { ...p, jobsCompleted: p.jobsCompleted + 1 }));
    if (role === 'prestador' || service.providerId === 'prov-1') notify(role === 'cliente' ? 'prestador' : 'cliente', 'estado', `Servicio: ${stage.toLowerCase()}`, serviceId);
    addToast('Estado actualizado');
  };
  const advanceStage = (serviceId: string) => changeStage(serviceId);
  const cancelService = (serviceId: string) => changeStage(serviceId, true);
  const cancelRequest = (requestId: string) => {
    const request = requestsRef.current.find(r => r.id === requestId);
    if (!permitted('cliente') || !request || request.clientId !== currentClient.id || !['BORRADOR', 'PUBLICADA', 'CON_PROPUESTAS'].includes(request.status)) return;
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, status: 'CANCELADA', proposals: r.proposals.map(p => ({ ...p, status: p.status === 'pendiente' ? 'cerrada' : p.status })) }));
    addToast('Solicitud cancelada');
  };

  const rateService = (serviceId: string, rating: number, comment: string, punctuality: number, quality: number, communication: number) => {
    const eligible = servicesRef.current.find(s => s.id === serviceId);
    if (!permitted('cliente') || !eligible || eligible.clientId !== currentClient.id || eligible.stage !== 'FINALIZADO' || eligible.rating
      || [rating, punctuality, quality, communication].some(n => !Number.isInteger(n) || n < 1 || n > 5)) { addToast('Calificación no permitida', 'error'); return false; }
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, rating, reviewComment: comment } : s))
    );
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      const review: Review = {
        id: `rev-${Date.now()}`,
        authorId: service.clientId,
        authorName: service.clientName,
        rating,
        comment,
        date: new Date().toISOString().slice(0, 10),
        punctuality,
        quality,
        communication,
      };
      setProviders((prev) =>
        prev.map((p) =>
          p.id === service.providerId
            ? {
                ...p,
                reviews: [review, ...p.reviews],
                jobsCompleted: p.jobsCompleted,
                rating: Math.round(([review, ...p.reviews].reduce((sum, r) => sum + r.rating, 0) / (p.reviews.length + 1)) * 10) / 10,
              }
            : p
        )
      );
    }
    return true;
  };

  const createReport = (report: Omit<Report, 'id' | 'status' | 'date'>) => {
    if (!role || role === 'admin' || !permitted(role) || !report.description.trim() || !report.targetId) { addToast('Completa el reporte y su objetivo', 'error'); return false; }
    const reporterId = role === 'cliente' ? 'client-1' : 'prov-1';
    const reportedId = report.type === 'Usuario' ? report.targetId : report.type === 'Servicio'
      ? (() => { const s = servicesRef.current.find(s => s.id === report.targetId); return role === 'cliente' ? s?.providerId : s?.clientId; })()
      : providersRef.current.find(p => p.reviews.some(r => r.id === report.targetId))?.id;
    const duplicate = reportsRef.current.find(r => r.reporterId === reporterId && r.targetId === report.targetId && r.type === report.type && r.reason === report.reason && ['PENDIENTE', 'EN_REVISION'].includes(r.status));
    if (duplicate) {
      if ((duplicate.evidence?.length || 0) + (report.evidence?.length || 0) > 3) { addToast('El reporte abierto admite como máximo 3 evidencias', 'error'); return false; }
      setReports(prev => prev.map(r => r.id !== duplicate.id ? r : { ...r, evidence: [...(r.evidence || []), ...(report.evidence || [])].slice(0, 3) }));
      addToast('Evidencia incorporada al reporte abierto'); return true;
    }
    const newReport: Report = {
      ...report, reporterId, reportedId,
      id: `rep-${Date.now()}`,
      status: 'PENDIENTE',
      date: new Date().toISOString().slice(0, 10),
    };
    setReports((prev) => [newReport, ...prev]);
    return true;
  };

  const updateReportStatus = (reportId: string, status: Report['status'], reason = '') => {
    if (role !== 'admin') return;
    if (['RESUELTO', 'DESCARTADO'].includes(status) && !reason.trim()) { addToast('Escribe la justificación de la decisión', 'error'); return; }
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status, resolution: reason.trim() } : r)));
    const report = reportsRef.current.find((r) => r.id === reportId);
    if (report) {
      addAudit(`Administrador cambió reporte a ${status}: ${reason}`, `Reporte #${report.id}`);
    }
  };

  const suspendUser = (userName: string, reason = '') => {
    if (role !== 'admin') return;
    if (!reason.trim()) { addToast('Indica el motivo de la suspensión', 'error'); return; }
    const userId = providersRef.current.find(p => p.name === userName || p.id === userName)?.id || (userName === currentClient.name || userName === currentClient.id ? 'client-1' : userName);
    setSuspendedUsers(prev => [...new Set([...prev, userId])]);
    setProviders(prev => prev.map(p => p.id === userId ? { ...p, suspended: true } : p));
    addAudit(`Administrador suspendió usuario: ${reason}`, userName);
  };

  const warnUser = (userName: string) => {
    if (role !== 'admin') return;
    addAudit('Administrador advirtió usuario', userName);
  };

  const saveCategory = (name: string, description: string, id?: string) => {
    name = name.trim();
    if (role !== 'admin' || !name || categoriesRef.current.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) { addToast('Nombre vacío o duplicado', 'error'); return false; }
    if (id) {
      const previous = categoriesRef.current.find(c => c.id === id);
      if (!previous) return false;
      setCategories(prev => prev.map(c => c.id !== id ? c : { ...c, name, description }));
      setProviders(prev => prev.map(p => ({ ...p, specialty: p.specialty === previous.name ? name : p.specialty, categoryIds: p.categoryIds })));
      setRequests(prev => prev.map(r => r.category === previous.name ? { ...r, category: name } : r));
    } else setCategories(prev => [...prev, { id: crypto.randomUUID(), name, description, icon: 'Wrench', active: true }]);
    addAudit(id ? 'Editó categoría' : 'Creó categoría', name); return true;
  };
  const saveZone = (name: string, id?: string) => {
    name = name.trim();
    if (role !== 'admin' || !name || zonesRef.current.some(z => z.id !== id && z.name.toLowerCase() === name.toLowerCase())) { addToast('Nombre vacío o duplicado', 'error'); return false; }
    if (id) {
      const previous = zonesRef.current.find(z => z.id === id);
      if (!previous) return false;
      setZones(prev => prev.map(z => z.id !== id ? z : { ...z, name }));
      setProviders(prev => prev.map(p => ({ ...p, zone: p.zone === previous.name ? name : p.zone, zones: p.zones.map(z => z === previous.name ? name : z) })));
      setRequests(prev => prev.map(r => r.zone === previous.name ? { ...r, zone: name } : r));
      if (currentClient.zone === previous.name) setClient({ ...currentClient, zone: name });
    } else setZones(prev => [...prev, { id: crypto.randomUUID(), name, active: true }]);
    addAudit(id ? 'Editó zona' : 'Creó zona', name); return true;
  };

  const toggleCategoryActive = (categoryId: string) => {
    if (role !== 'admin') return;
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, active: !c.active } : c))
    );
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      addAudit('Administrador modificó categoría', cat.name);
    }
  };

  const toggleZoneActive = (zoneId: string) => {
    if (role !== 'admin') return;
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z)));
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      addAudit('Administrador modificó zona', zone.name);
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => (notificationRole(n) === role ? { ...n, read: true } : n)));
  };

  const saveProviderService = (providerId: string, service: Omit<ProviderService, 'id'>, id?: string) => {
    if (!permitted('prestador') || providerId !== 'prov-1') return false;
    const provider = providersRef.current.find(p => p.id === providerId);
    if (!provider || (id && !provider.offeredServices.some(s => s.id === id))) return false;
    if (!service.name.trim() || !service.description.trim() || !provider.categoryIds.includes(service.categoryId)
      || !categoriesRef.current.some(c => c.id === service.categoryId && c.active)) { addToast('Completa nombre, descripción y una categoría de tu perfil', 'error'); return false; }
    if (provider.offeredServices.some(s => s.id !== id && s.categoryId === service.categoryId && s.name.trim().toLocaleLowerCase() === service.name.trim().toLocaleLowerCase())) {
      addToast('Ya tienes ese servicio en esta categoría', 'error'); return false;
    }
    const offering: ProviderService = { ...service, name: service.name.trim(), description: service.description.trim(), id: id || crypto.randomUUID() };
    setProviders(prev => prev.map(p => p.id !== providerId ? p : { ...p, offeredServices: id ? p.offeredServices.map(s => s.id === id ? offering : s) : [...p.offeredServices, offering] }));
    addToast(id ? 'Servicio actualizado' : 'Servicio creado'); return true;
  };
  const removeProviderService = (providerId: string, serviceId: string) => {
    if (!permitted('prestador') || providerId !== 'prov-1') return;
    setProviders(prev => prev.map(p => p.id !== providerId ? p : { ...p, offeredServices: p.offeredServices.filter(s => s.id !== serviceId) }));
    addToast('Servicio eliminado');
  };

  const updateProviderProfile = (providerId: string, updates: Partial<Provider>) => {
    if (!permitted('prestador') || providerId !== 'prov-1') return false;
    const original = providersRef.current.find(p => p.id === providerId);
    if (!original) return false;
    if (updates.zones && (!updates.zones.length || updates.zones.some(z => !zonesRef.current.some(item => item.name === z && item.active)))) { addToast('Selecciona al menos una zona activa', 'error'); return false; }
    if (updates.categoryIds && (!updates.categoryIds.length || updates.categoryIds.some(id => !categoriesRef.current.some(c => c.id === id && c.active)))) { addToast('Selecciona al menos una categoría activa', 'error'); return false; }
    if (updates.categoryIds && original.offeredServices.some(service => !updates.categoryIds!.includes(service.categoryId))) { addToast('Primero elimina o cambia de categoría los servicios asociados', 'error'); return false; }
    // Only professional fields can be changed by the owner.
    const { bio, categoryIds, zones, available, formalizationSteps, experienceYears } = updates;
    if (experienceYears !== undefined && (!Number.isFinite(experienceYears) || experienceYears < 0 || experienceYears > 80)) { addToast('Experiencia inválida', 'error'); return false; }
    setProviders(prev => prev.map(p => p.id !== providerId ? p : { ...p,
      experienceYears: experienceYears ?? p.experienceYears,
      bio: bio ?? p.bio, categoryIds: categoryIds ?? p.categoryIds, zones: zones ?? p.zones,
      specialty: categoryIds ? categoriesRef.current.find(c => c.id === categoryIds[0])?.name || p.specialty : p.specialty,
      available: available ?? p.available, formalizationSteps: formalizationSteps ?? p.formalizationSteps }));
    return true;
  };

  const addPortfolioItem = (title: string, description: string, evidence: Attachment) => {
    const provider = providersRef.current.find(p => p.id === 'prov-1');
    if (!permitted('prestador') || !title.trim() || !description.trim() || !evidence || (provider?.portfolio?.length || 0) >= 6) { addToast('Completa el trabajo y una imagen. Máximo 6 trabajos.', 'error'); return false; }
    setProviders(prev => prev.map(p => p.id !== 'prov-1' ? p : { ...p, portfolio: [...(p.portfolio || []), { id: crypto.randomUUID(), title: title.trim(), description: description.trim(), evidence }] }));
    addToast('Trabajo agregado al portafolio'); return true;
  };
  const removePortfolioItem = (id: string) => {
    if (permitted('prestador')) setProviders(prev => prev.map(p => p.id !== 'prov-1' ? p : { ...p, portfolio: (p.portfolio || []).filter(item => item.id !== id) }));
  };
  const saveSlot = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const provider = providersRef.current.find(p => p.id === 'prov-1');
    if (!permitted('prestador') || !provider || !validSlot(slot, provider.agenda || [])) { addToast('Revisa la fecha y las horas; las franjas no pueden solaparse', 'error'); return false; }
    setProviders(prev => prev.map(p => p.id !== 'prov-1' ? p : { ...p, agenda: [...(p.agenda || []), { ...slot, id: crypto.randomUUID() }].sort((a,b) => (a.date + a.start).localeCompare(b.date + b.start)) }));
    return true;
  };
  const removeSlot = (id: string) => {
    if (permitted('prestador')) setProviders(prev => prev.map(p => p.id !== 'prov-1' ? p : { ...p, agenda: (p.agenda || []).filter(s => s.id !== id) }));
  };
  const requestVerification = (documents: Attachment[]) => {
    if (!permitted('prestador') || !documents.length || verificationsRef.current.some(v => v.providerId === 'prov-1' && v.status === 'PENDIENTE')) { addToast('Adjunta documentos; solo puede haber una solicitud pendiente', 'error'); return false; }
    setVerifications(prev => [{ id: crypto.randomUUID(), providerId: 'prov-1', documents, status: 'PENDIENTE', createdAt: new Date().toISOString() }, ...prev]);
    addToast('Verificación enviada a revisión'); return true;
  };
  const reviewVerification = (id: string, approved: boolean, reason: string) => {
    const request = verificationsRef.current.find(v => v.id === id && v.status === 'PENDIENTE');
    if (role !== 'admin' || !request || !reason.trim()) { addToast('Escribe el resultado de la revisión', 'error'); return false; }
    setVerifications(prev => prev.map(v => v.id !== id ? v : { ...v, status: approved ? 'APROBADA' : 'RECHAZADA', reason: reason.trim() }));
    setProviders(prev => prev.map(p => p.id !== request.providerId ? p : { ...p, verified: approved }));
    addAudit(`Verificación ${approved ? 'aprobada' : 'rechazada'}: ${reason}`, request.providerId); return true;
  };
  const sendMessage = (serviceId: string, text: string) => {
    const service = servicesRef.current.find(s => s.id === serviceId);
    if (!service || !role || role === 'admin' || !permitted(role) || !canCoordinate(service, role) || !text.trim() || text.length > 1000) { addToast('No es posible enviar el mensaje', 'error'); return false; }
    setMessages(prev => [...prev, { id: crypto.randomUUID(), serviceId, sender: role, text: text.trim(), date: new Date().toISOString() }]); return true;
  };
  const moderateReportContent = (reportId: string, reason: string) => {
    const report = reportsRef.current.find(r => r.id === reportId);
    if (role !== 'admin' || !reason.trim() || report?.type !== 'Contenido' || !providersRef.current.some(p => p.reviews.some(r => r.id === report.targetId))) { addToast('Selecciona una reseña reportada e indica el motivo', 'error'); return false; }
    setProviders(prev => prev.map(p => ({ ...p, reviews: p.reviews.map(r => r.id === report.targetId ? { ...r, hidden: true } : r) })));
    updateReportStatus(reportId, 'RESUELTO', reason);
    addAudit(`Ocultó reseña: ${reason}`, report.targetId || reportId);
    addToast('Reseña retirada de la vista pública'); return true;
  };
  const publicPreferences = { ...defaultPreferences, ...allPreferences.prestador };
  const clientPreferences = { ...defaultPreferences, ...allPreferences.cliente };
  const isPublicView = role === 'cliente' || role === null;
  const visibleProviders = providers.filter(p => !isPublicView || p.id !== 'prov-1' || publicPreferences.profileVisible).map(p => ({ ...p,
    name: isPublicView && p.id === 'prov-1' && !publicPreferences.publicName ? 'Prestador de ALIADO' : p.name,
    reviews: p.reviews.map(r => role !== 'admin' && !clientPreferences.publicName && (r.authorId === 'client-1' || r.authorName === currentClient.name) ? { ...r, authorName: 'Cliente de ALIADO' } : r),
  }));
  const visibleRequests = requests.map(r => ({ ...r,
    clientName: role === 'prestador' && !clientPreferences.publicName ? 'Cliente de ALIADO' : r.clientName,
    proposals: r.proposals.map(p => role === 'cliente' && p.providerId === 'prov-1' && !publicPreferences.publicName ? { ...p, providerName: 'Prestador de ALIADO' } : p),
  }));
  const visibleServices = services.map(s => ({ ...s,
    clientName: role === 'prestador' && s.clientId === 'client-1' && !clientPreferences.publicName ? 'Cliente de ALIADO' : s.clientName,
    providerName: role === 'cliente' && s.providerId === 'prov-1' && !publicPreferences.publicName ? 'Prestador de ALIADO' : s.providerName,
  }));

  return (
    <AppContext.Provider
      value={{
        preferences, savePreferences, consentDate: role ? consents[role] : undefined, acceptConsent, personalizeDemo,
        editProposal, addPortfolioItem, removePortfolioItem, saveSlot, removeSlot,
        verifications: role === 'admin' ? verifications : verifications.filter(v => role === 'prestador' && v.providerId === 'prov-1'),
        requestVerification, reviewVerification,
        messages: messages.filter(m => { const s = services.find(s => s.id === m.serviceId); return s && ((role === 'cliente' && s.clientId === 'client-1') || (role === 'prestador' && s.providerId === 'prov-1')); }), sendMessage,
        role,
        setRole,
        currentClient,
        requests: visibleRequests,
        services: visibleServices,
        providers: visibleProviders,
        reports,
        audit,
        notifications: notifications.filter(n => notificationRole(n) === role),
        categories,
        zones,
        toasts,
        addToast,
        removeToast,
        createRequest,
        addProposal,
        withdrawProposal,
        acceptProposal,
        advanceStage,
        cancelService,
        cancelRequest,
        suspendedUsers,
        updateClient,
        deletionRequested: role !== null && deletions.includes(role),
        requestDeletion,
        rateService,
        createReport,
        moderateReportContent,
        updateReportStatus,
        suspendUser,
        warnUser,
        toggleCategoryActive,
        saveCategory,
        saveZone,
        toggleZoneActive,
        markNotificationRead,
        markAllNotificationsRead,
        updateProviderProfile,
        saveProviderService,
        removeProviderService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
