export type Role = 'cliente' | 'prestador' | 'admin';

export type ServiceStatus =
  | 'BORRADOR'
  | 'PUBLICADA'
  | 'CON_PROPUESTAS'
  | 'CONTRATADA'
  | 'EN_PROCESO'
  | 'FINALIZADA'
  | 'CANCELADA';

export type ServiceStage =
  | 'CONTRATADO'
  | 'EN_PROCESO'
  | 'TERMINADO'
  | 'FINALIZADO'
  | 'CANCELADO';

export type Urgency = 'Baja' | 'Normal' | 'Alta' | 'Urgente';

export type ReportStatus = 'PENDIENTE' | 'EN_REVISION' | 'RESUELTO' | 'DESCARTADO';

export type ReportReason =
  | 'Comportamiento inapropiado'
  | 'Incumplimiento'
  | 'Posible fraude'
  | 'Información falsa'
  | 'Otro';

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  active: boolean;
}

export interface Zone {
  id: string;
  name: string;
  active: boolean;
}

export interface Review {
  authorId?: string;
  hidden?: boolean;
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  punctuality: number;
  quality: number;
  communication: number;
}

export interface ProviderService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
}

export interface Attachment {
  id: string;
  name: string;
  data: string;
  mime: string;
}
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  evidence: Attachment;
}
export interface AvailabilitySlot {
  id: string;
  date: string;
  start: string;
  end: string;
}
export interface VerificationRequest {
  id: string;
  providerId: string;
  documents: Attachment[];
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  createdAt: string;
  reason?: string;
}
export interface DemoPreferences {
  publicName: boolean;
  profileVisible: boolean;
  opportunities: boolean;
  proposals: boolean;
}
export interface CoordinationMessage {
  id: string;
  serviceId: string;
  sender: 'cliente' | 'prestador';
  text: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  jobsCompleted: number;
  zone: string;
  zones: string[];
  categoryIds: string[];
  offeredServices: ProviderService[];
  available: boolean;
  suspended?: boolean;
  formalizationSteps?: string[];
  portfolio?: PortfolioItem[];
  agenda?: AvailabilitySlot[];
  bio: string;
  reviews: Review[];
  verified: boolean;
  avatarColor: string;
}

export interface Proposal {
  id: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  providerJobs: number;
  price: number;
  date: string;
  time: string;
  message: string;
  status: 'pendiente' | 'aceptada' | 'rechazada' | 'retirada' | 'cerrada';
}

export interface ServiceRequest {
  id: string;
  category: string;
  title: string;
  description: string;
  zone: string;
  urgency: Urgency;
  preferredDate: string;
  preferredTime: string;
  clientName: string;
  clientId: string;
  status: ServiceStatus;
  proposals: Proposal[];
  photo?: string;
  address?: string;
  createdAt: string;
  serviceId?: string;
}

export interface ServiceRecord {
  id: string;
  requestId: string;
  proposalId?: string;
  clientId: string;
  clientName: string;
  providerId: string;
  providerName: string;
  category: string;
  date: string;
  time: string;
  price: number;
  address: string;
  stage: ServiceStage;
  history?: { stage: ServiceStage; date: string; actor: string }[];
  rating?: number;
  reviewComment?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  zone: string;
  avatarColor: string;
}

export interface Report {
  id: string;
  reporterName: string;
  reportedName: string;
  reason: ReportReason;
  description: string;
  date: string;
  status: ReportStatus;
  type: 'Usuario' | 'Servicio' | 'Contenido';
  reporterId?: string;
  reportedId?: string;
  evidence?: Attachment[];
  resolution?: string;
  targetId?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  adminName: string;
  target: string;
  date: string;
  time: string;
}

export interface Notification {
  id: string;
  type: 'oportunidad' | 'propuesta' | 'aceptada' | 'estado' | 'calificacion';
  title: string;
  message: string;
  time: string;
  read: boolean;
  recipientRole?: Role;
  targetId?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
