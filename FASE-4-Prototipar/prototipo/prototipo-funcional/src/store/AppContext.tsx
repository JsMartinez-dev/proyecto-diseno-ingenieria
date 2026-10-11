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
  useEffect(() => { try { localStorage.setItem(`aliado-v1-${key}`, JSON.stringify(value)); } catch { /* storage unavailable */ } }, [key, value]);
  return [value, set, latest] as const;
}

interface AppContextType {
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
  createReport: (report: Omit<Report, 'id' | 'status' | 'date'>) => void;
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
      proposals: [],
      createdAt: new Date().toISOString().slice(0, 10),
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
      || !Number.isFinite(proposal.price) || proposal.price <= 0 || !proposal.date || !proposal.time) {
      addToast('No puedes enviar esta propuesta', 'error'); return false;
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

  const withdrawProposal = (requestId: string, proposalId: string) => {
    if (!permitted('prestador')) return;
    const request = requestsRef.current.find(r => r.id === requestId);
    if (!request || !['PUBLICADA', 'CON_PROPUESTAS'].includes(request.status)) return;
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, proposals: r.proposals.map(p => p.id === proposalId && p.providerId === 'prov-1' && p.status === 'pendiente' ? { ...p, status: 'rechazada' } : p) }));
    addToast('Propuesta retirada');
  };

  const acceptProposal = (requestId: string, proposalId: string) => {
    const req = requestsRef.current.find(r => r.id === requestId);
    if (!permitted('cliente') || !req || !canAccept(req, proposalId, role)) { addToast('La solicitud ya está contratada o la propuesta no está disponible', 'error'); return false; }
    const prop = req.proposals.find(p => p.id === proposalId)!;
    if (providersRef.current.find(p => p.id === prop.providerId)?.suspended) { addToast('Prestador restringido', 'error'); return false; }
    const id = crypto.randomUUID();
    const newService: ServiceRecord = {
      id, requestId, clientId: req.clientId, clientName: req.clientName,
      providerId: prop.providerId, providerName: prop.providerName, category: req.category,
      date: prop.date, time: prop.time, price: prop.price,
      address: req.address || `Dirección pendiente de coordinación · ${req.zone}`,
      stage: 'CONTRATADO', createdAt: new Date().toISOString(),
      history: [{ stage: 'CONTRATADO', date: new Date().toISOString(), actor: 'Cliente' }],
    };
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, status: 'CONTRATADA', serviceId: id,
      proposals: r.proposals.map(p => ({ ...p, status: p.id === proposalId ? 'aceptada' : 'rechazada' })) }));
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
    setRequests(prev => prev.map(r => r.id !== requestId ? r : { ...r, status: 'CANCELADA', proposals: r.proposals.map(p => ({ ...p, status: 'rechazada' })) }));
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
    if (!role || !report.description.trim()) return;
    const newReport: Report = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'PENDIENTE',
      date: new Date().toISOString().slice(0, 10),
    };
    setReports((prev) => [newReport, ...prev]);
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
    const userId = providersRef.current.find(p => p.name === userName)?.id || (userName === currentClient.name ? 'client-1' : userName);
    setSuspendedUsers(prev => [...new Set([...prev, userId])]);
    setProviders(prev => prev.map(p => p.name === userName ? { ...p, suspended: true } : p));
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
    const { bio, categoryIds, zones, available, formalizationSteps } = updates;
    setProviders(prev => prev.map(p => p.id !== providerId ? p : { ...p,
      bio: bio ?? p.bio, categoryIds: categoryIds ?? p.categoryIds, zones: zones ?? p.zones,
      specialty: categoryIds ? categoriesRef.current.find(c => c.id === categoryIds[0])?.name || p.specialty : p.specialty,
      available: available ?? p.available, formalizationSteps: formalizationSteps ?? p.formalizationSteps }));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentClient,
        requests,
        services,
        providers,
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
