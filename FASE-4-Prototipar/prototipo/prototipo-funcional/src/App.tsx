import { useState, useCallback } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import ToastContainer from '@/components/ui/Toast';

import Landing from '@/pages/Landing';

import TopBar from '@/components/layout/TopBar';
import BottomNav, { clienteNavItems, prestadorNavItems } from '@/components/layout/BottomNav';
import AdminSidebar from '@/components/layout/AdminSidebar';

import ClienteInicio from '@/pages/cliente/ClienteInicio';
import ClienteBuscar from '@/pages/cliente/ClienteBuscar';
import ClienteSolicitudes from '@/pages/cliente/ClienteSolicitudes';
import ClienteNuevaSolicitud from '@/pages/cliente/ClienteNuevaSolicitud';
import ClienteDetalleSolicitud from '@/pages/cliente/ClienteDetalleSolicitud';
import ClientePerfilPrestador from '@/pages/cliente/ClientePerfilPrestador';
import ClienteDetalleServicio from '@/pages/cliente/ClienteDetalleServicio';
import ClienteHistorial from '@/pages/cliente/ClienteHistorial';
import ClientePerfil from '@/pages/cliente/ClientePerfil';

import PrestadorInicio from '@/pages/prestador/PrestadorInicio';
import PrestadorOportunidades from '@/pages/prestador/PrestadorOportunidades';
import PrestadorDetalleOportunidad from '@/pages/prestador/PrestadorDetalleOportunidad';
import PrestadorServicios from '@/pages/prestador/PrestadorServicios';
import PrestadorDetalleServicio from '@/pages/prestador/PrestadorDetalleServicio';
import PrestadorHistorial from '@/pages/prestador/PrestadorHistorial';
import PrestadorPerfil from '@/pages/prestador/PrestadorPerfil';
import PrestadorProgreso from '@/pages/prestador/PrestadorProgreso';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import AdminPrestadores from '@/pages/admin/AdminPrestadores';
import AdminSolicitudes from '@/pages/admin/AdminSolicitudes';
import AdminServicios from '@/pages/admin/AdminServicios';
import AdminReportes from '@/pages/admin/AdminReportes';
import AdminCategorias from '@/pages/admin/AdminCategorias';
import AdminZonas from '@/pages/admin/AdminZonas';
import AdminAuditoria from '@/pages/admin/AdminAuditoria';

import AcercaDe from '@/pages/shared/AcercaDe';
import ProximasFunciones from '@/pages/shared/ProximasFunciones';

function ClienteApp() {
  const [page, setPage] = useState('inicio');
  const [param, setParam] = useState<string | undefined>(undefined);

  const navigate = useCallback((p: string, par?: string) => {
    setPage(p);
    setParam(par);
    window.scrollTo(0, 0);
  }, []);

  const titleMap: Record<string, string> = {
    inicio: 'Inicio',
    buscar: 'Buscar prestadores',
    solicitudes: 'Mis solicitudes',
    'nueva-solicitud': 'Nueva solicitud',
    'detalle-solicitud': 'Detalle de solicitud',
    'perfil-prestador': 'Perfil del prestador',
    'detalle-servicio': 'Detalle del servicio',
    historial: 'Historial',
    perfil: 'Mi perfil',
    acerca: 'Acerca de ALIADO',
    proximas: 'Próximas funciones',
  };

  let content;
  switch (page) {
    case 'inicio':
      content = <ClienteInicio onNavigate={navigate} />;
      break;
    case 'buscar':
      content = <ClienteBuscar onNavigate={navigate} />;
      break;
    case 'solicitudes':
      content = <ClienteSolicitudes onNavigate={navigate} />;
      break;
    case 'nueva-solicitud':
      content = <ClienteNuevaSolicitud key={param || 'new'} onNavigate={navigate} requestId={param} />;
      break;
    case 'detalle-solicitud':
      content = <ClienteDetalleSolicitud onNavigate={navigate} requestId={param} />;
      break;
    case 'perfil-prestador':
      content = <ClientePerfilPrestador onNavigate={navigate} providerId={param} />;
      break;
    case 'detalle-servicio':
      content = <ClienteDetalleServicio onNavigate={navigate} serviceId={param} />;
      break;
    case 'historial':
      content = <ClienteHistorial onNavigate={navigate} />;
      break;
    case 'perfil':
      content = <ClientePerfil onNavigate={navigate} />;
      break;
    case 'acerca':
      content = <AcercaDe onBack={() => navigate('perfil')} />;
      break;
    case 'proximas':
      content = <ProximasFunciones onBack={() => navigate('perfil')} />;
      break;
    default:
      content = <ClienteInicio onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title={titleMap[page] || 'ALIADO'} onNavigate={navigate} />
      {content}
      <BottomNav items={clienteNavItems} active={page} onNavigate={navigate} />
    </div>
  );
}

function PrestadorApp() {
  const [page, setPage] = useState('inicio');
  const [param, setParam] = useState<string | undefined>(undefined);

  const navigate = useCallback((p: string, par?: string) => {
    setPage(p);
    setParam(par);
    window.scrollTo(0, 0);
  }, []);

  const titleMap: Record<string, string> = {
    inicio: 'Inicio',
    oportunidades: 'Oportunidades',
    'detalle-oportunidad': 'Oportunidad',
    servicios: 'Servicios',
    'detalle-servicio-prestador': 'Detalle del servicio',
    historial: 'Historial',
    perfil: 'Mi perfil',
    progreso: 'Mi progreso',
    acerca: 'Acerca de ALIADO',
    proximas: 'Próximas funciones',
  };

  let content;
  switch (page) {
    case 'inicio':
      content = <PrestadorInicio onNavigate={navigate} />;
      break;
    case 'oportunidades':
      content = <PrestadorOportunidades onNavigate={navigate} />;
      break;
    case 'detalle-oportunidad':
      content = <PrestadorDetalleOportunidad onNavigate={navigate} requestId={param} />;
      break;
    case 'servicios':
      content = <PrestadorServicios onNavigate={navigate} />;
      break;
    case 'detalle-servicio-prestador':
      content = <PrestadorDetalleServicio onNavigate={navigate} serviceId={param} />;
      break;
    case 'historial':
      content = <PrestadorHistorial onNavigate={navigate} />;
      break;
    case 'perfil':
      content = <PrestadorPerfil onNavigate={navigate} />;
      break;
    case 'vista-publica':
      content = <ClientePerfilPrestador onNavigate={navigate} providerId={param} preview />;
      break;
    case 'progreso':
      content = <PrestadorProgreso onNavigate={navigate} />;
      break;
    case 'acerca':
      content = <AcercaDe onBack={() => navigate('perfil')} />;
      break;
    case 'proximas':
      content = <ProximasFunciones onBack={() => navigate('perfil')} />;
      break;
    default:
      content = <PrestadorInicio onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title={titleMap[page] || 'ALIADO'} onNavigate={navigate} />
      {content}
      <BottomNav items={prestadorNavItems} active={page} onNavigate={navigate} />
    </div>
  );
}

function AdminApp() {
  const [page, setPage] = useState('dashboard');

  const navigate = useCallback((p: string) => {
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  let content;
  if (page === 'acerca') {
    content = (
      <div className="p-6">
        <AcercaDe onBack={() => navigate('dashboard')} />
      </div>
    );
  } else {
    switch (page) {
      case 'dashboard':
        content = <AdminDashboard onNavigate={navigate} />;
        break;
      case 'usuarios':
        content = <AdminUsuarios onNavigate={navigate} />;
        break;
      case 'prestadores':
        content = <AdminPrestadores onNavigate={navigate} />;
        break;
      case 'solicitudes':
        content = <AdminSolicitudes onNavigate={navigate} />;
        break;
      case 'servicios':
        content = <AdminServicios onNavigate={navigate} />;
        break;
      case 'reportes':
        content = <AdminReportes onNavigate={navigate} />;
        break;
      case 'categorias':
        content = <AdminCategorias onNavigate={navigate} />;
        break;
      case 'zonas':
        content = <AdminZonas onNavigate={navigate} />;
        break;
      case 'auditoria':
        content = <AdminAuditoria onNavigate={navigate} />;
        break;
      default:
        content = <AdminDashboard onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pb-16 md:pb-0">
      <AdminSidebar active={page} onNavigate={navigate} />
      <main className="flex-1 min-w-0 pb-16 md:pb-0">{content}</main>
    </div>
  );
}

function AppContent() {
  const { role } = useApp();

  if (!role) return <Landing />;
  if (role === 'cliente') return <ClienteApp />;
  if (role === 'prestador') return <PrestadorApp />;
  return <AdminApp />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}
